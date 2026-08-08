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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string; branchId: string }> }
) {
  try {
    const { branchId } = await params;
    const body = await request.json();
    const { name, address, phone, schedule } = body;

    if (!name || !schedule || !Array.isArray(schedule)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const hoursData = schedule.map((s: any) => ({
      dayOfWeek: DAY_MAP[s.day],
      openTime: s.start,
      closeTime: s.end,
      isClosed: s.closed
    }));

    // Update branch and replace all its hours
    // Prisma doesn't have a simple "replace all" for related records, 
    // so we delete existing hours and create new ones in a transaction.
    const [deletedHours, updatedBranch] = await prisma.$transaction([
      prisma.branchHour.deleteMany({
        where: { branchId }
      }),
      prisma.branch.update({
        where: { id: branchId },
        data: {
          name,
          address,
          phone,
          branchHours: {
            create: hoursData
          }
        },
        include: {
          branchHours: true
        }
      })
    ]);

    return NextResponse.json(updatedBranch);
  } catch (error) {
    console.error("PUT Branch API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string; branchId: string }> }
) {
  try {
    const { branchId } = await params;

    // Check if the branch exists and get its subBranches if any
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      include: { subBranches: true }
    });

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    const branchIdsToDelete = [branchId, ...branch.subBranches.map(sb => sb.id)];

    // We must delete dependent records first: BranchHour
    // Then we delete the branches themselves
    await prisma.$transaction([
      prisma.branchHour.deleteMany({
        where: { branchId: { in: branchIdsToDelete } }
      }),
      prisma.branch.deleteMany({
        where: { id: { in: branchIdsToDelete } }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Branch API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
