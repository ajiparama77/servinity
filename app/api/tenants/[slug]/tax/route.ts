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

    let taxSetting = await prisma.taxSetting.findFirst({
      where: whereClause
    });

    // Return empty defaults if not found so UI can handle it gracefully
    if (!taxSetting) {
      return NextResponse.json({
        applyTax: true,
        taxName: 'VAT (PPN)',
        taxPercentage: 11,
        applyServiceCharge: true,
        serviceChargePercentage: 5
      });
    }

    return NextResponse.json(taxSetting);
  } catch (error) {
    console.error("GET Tax Settings Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { 
      branchId, 
      applyTax, 
      taxName, 
      taxPercentage, 
      applyServiceCharge, 
      serviceChargePercentage 
    } = body;
    
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

    let taxSetting = await prisma.taxSetting.findFirst({
      where: whereClause
    });

    if (taxSetting) {
      // Update
      taxSetting = await prisma.taxSetting.update({
        where: { id: taxSetting.id },
        data: {
          applyTax,
          taxName,
          taxPercentage,
          applyServiceCharge,
          serviceChargePercentage
        }
      });
    } else {
      // Create
      taxSetting = await prisma.taxSetting.create({
        data: {
          tenantId: tenant.id,
          branchId: branchId || null,
          applyTax,
          taxName,
          taxPercentage,
          applyServiceCharge,
          serviceChargePercentage
        }
      });
    }

    return NextResponse.json(taxSetting);
  } catch (error) {
    console.error("PUT Tax Settings Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
