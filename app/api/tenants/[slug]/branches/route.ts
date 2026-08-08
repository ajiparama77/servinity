import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const DAY_MAP: Record<string, number> = {
  'Sunday': 0,
  'Monday': 1,
  'Tuesday': 2,
  'Wednesday': 3,
  'Thursday': 4,
  'Friday': 5,
  'Saturday': 6
};

const REVERSE_DAY_MAP: Record<number, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday'
};

// Helper to format branches for the UI
const formatBranchesForUI = (branches: any[]): any[] => {
  return branches.map(branch => {
    // Format hours
    const schedule = (branch.branchHours || []).map((h: any) => ({
      day: REVERSE_DAY_MAP[h.dayOfWeek] || 'Unknown',
      start: h.openTime,
      end: h.closeTime,
      closed: h.isClosed
    }));

    // Ensure all 7 days exist in the output in correct order, starting from Monday
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const completeSchedule = daysOrder.map(dayName => {
      const existing = schedule.find((s: any) => s.day === dayName);
      if (existing) return existing;
      return { day: dayName, start: '09:00', end: '17:00', closed: true };
    });

    const formattedSubBranches = branch.subBranches ? formatBranchesForUI(branch.subBranches) : [];

    return {
      id: branch.id,
      name: branch.name,
      address: branch.address || '',
      phone: branch.phone || '',
      schedule: completeSchedule,
      subBranches: formattedSubBranches
    };
  });
};

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const tenant = await prisma.tenant.findUnique({
      where: { slug }
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Fetch master branches (parentId = null) with their sub-branches
    const masterBranches = await prisma.branch.findMany({
      where: { 
        tenantId: tenant.id,
        parentId: null
      },
      include: {
        branchHours: true,
        subBranches: {
          include: {
            branchHours: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    const formattedData = formatBranchesForUI(masterBranches);

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("GET Branches API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { name, address, phone, schedule, parentId } = body;
    
    if (!name || !schedule || !Array.isArray(schedule)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { slug }
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Prepare branch hours data
    const hoursData = schedule.map((s: any) => ({
      dayOfWeek: DAY_MAP[s.day],
      openTime: s.start,
      closeTime: s.end,
      isClosed: s.closed
    }));

    const newBranch = await prisma.branch.create({
      data: {
        tenantId: tenant.id,
        name,
        address,
        phone,
        parentId: parentId || null,
        branchHours: {
          create: hoursData
        }
      },
      include: {
        branchHours: true
      }
    });

    return NextResponse.json(newBranch, { status: 201 });
  } catch (error) {
    console.error("POST Branch API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
