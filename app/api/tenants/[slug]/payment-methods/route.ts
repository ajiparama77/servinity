import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');

    const tenant = await prisma.tenant.findUnique({
      where: { slug }
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const whereClause = {
      tenantId: tenant.id,
      branchId: branchId || null
    };

    let paymentMethods = await prisma.paymentMethod.findMany({
      where: whereClause
    });

    // Default seeded methods if none exist for this level yet
    if (paymentMethods.length === 0) {
      return NextResponse.json([
        { methodCode: 'CASH', methodName: 'Cash', isActive: true, isDefault: true, isCustom: false, details: null },
        { methodCode: 'QRIS', methodName: 'QRIS / E-Wallet', isActive: true, isDefault: false, isCustom: false, details: null },
        { methodCode: 'EDC_BCA', methodName: 'Debit/Credit Card (EDC BCA)', isActive: true, isDefault: false, isCustom: false, details: null },
        { methodCode: 'EDC_MANDIRI', methodName: 'Debit/Credit Card (EDC Mandiri)', isActive: false, isDefault: false, isCustom: false, details: null },
        { methodCode: 'TRANSFER', methodName: 'Bank Transfer', isActive: true, isDefault: false, isCustom: false, details: null }
      ]);
    }

    return NextResponse.json(paymentMethods);
  } catch (error) {
    console.error("GET Payment Methods Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { branchId, methods } = body; 

    const tenant = await prisma.tenant.findUnique({
      where: { slug }
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const whereClause = {
      tenantId: tenant.id,
      branchId: branchId || null
    };

    // Keep track of methodCodes being sent, to delete any custom methods that were removed from the UI.
    const incomingMethodCodes = methods.map((m: any) => m.methodCode);

    // Delete custom methods that are no longer in the list
    await prisma.paymentMethod.deleteMany({
      where: {
        ...whereClause,
        isCustom: true,
        methodCode: {
          notIn: incomingMethodCodes
        }
      }
    });

    // Upsert all methods
    const results = [];
    for (const method of methods) {
      const existing = await prisma.paymentMethod.findFirst({
        where: { ...whereClause, methodCode: method.methodCode }
      });

      if (existing) {
        const updated = await prisma.paymentMethod.update({
          where: { id: existing.id },
          data: {
            methodName: method.methodName,
            isActive: method.isActive,
            isDefault: method.isDefault,
            details: method.details ?? null
          }
        });
        results.push(updated);
      } else {
        const created = await prisma.paymentMethod.create({
          data: {
            tenantId: tenant.id,
            branchId: branchId || null,
            methodCode: method.methodCode,
            methodName: method.methodName,
            isActive: method.isActive,
            isDefault: method.isDefault,
            isCustom: method.isCustom || false,
            details: method.details ?? null
          }
        });
        results.push(created);
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("PUT Payment Methods Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
