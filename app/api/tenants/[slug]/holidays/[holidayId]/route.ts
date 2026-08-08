import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string, holidayId: string }> }) {
  try {
    const { slug, holidayId } = await params;
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

    const updatedHoliday = await prisma.holiday.updateMany({
      where: { 
        id: holidayId,
        tenantId: tenant.id // Security check
      },
      data: {
        name,
        branchId: branchId || null,
        date: new Date(date)
      }
    });

    if (updatedHoliday.count === 0) {
      return NextResponse.json({ error: 'Holiday not found' }, { status: 404 });
    }

    // Fetch the updated one to return
    const holiday = await prisma.holiday.findUnique({
      where: { id: holidayId }
    });

    return NextResponse.json(holiday);
  } catch (error) {
    console.error("PUT Holiday API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string, holidayId: string }> }) {
  try {
    const { slug, holidayId } = await params;

    const tenant = await prisma.tenant.findUnique({
      where: { slug }
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const deletedHoliday = await prisma.holiday.deleteMany({
      where: { 
        id: holidayId,
        tenantId: tenant.id // Security check
      }
    });

    if (deletedHoliday.count === 0) {
      return NextResponse.json({ error: 'Holiday not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Holiday API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
