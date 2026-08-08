import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const tenant = await prisma.tenant.findUnique({
      where: { slug }
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Get today's date at start of day (local server time roughly)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const holidays = await prisma.holiday.findMany({
      where: { 
        tenantId: tenant.id,
        date: {
          gte: today // only upcoming holidays
        }
      },
      include: {
        branch: {
          select: { name: true }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    return NextResponse.json(holidays);
  } catch (error) {
    console.error("GET Holidays API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { name, date, branchId } = body;
    
    if (!name || !date) {
      return NextResponse.json({ error: 'Name and date are required' }, { status: 400 });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { slug }
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const newHoliday = await prisma.holiday.create({
      data: {
        tenantId: tenant.id,
        branchId: branchId || null,
        name,
        date: new Date(date)
      }
    });

    return NextResponse.json(newHoliday, { status: 201 });
  } catch (error) {
    console.error("POST Holiday API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
