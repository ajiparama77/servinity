import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const tenant = await prisma.tenant.findUnique({
      where: { slug },
      include: { 
        businessTemplate: {
          include: { templateColors: true }
        } 
      }
    });
    
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }
    
    let effectiveColor = tenant.colorHex;
    if (!effectiveColor && tenant.businessTemplate?.templateColors?.length > 0) {
      effectiveColor = tenant.businessTemplate.templateColors[0].colorHex;
    }
    
    return NextResponse.json({
      ...tenant,
      effectiveColor
    });
  } catch (error) {
    console.error("GET Tenant API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    
    const contentType = request.headers.get('content-type') || '';
    let name = '';
    let colorHex: string | null = null;
    let logoPhotoUrl = undefined;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      name = formData.get('name') as string;
      
      const formColor = formData.get('colorHex') as string | null;
      colorHex = formColor?.trim() || null;
      
      const logoFile = formData.get('logo') as File | null;
      if (logoFile && logoFile.size > 0) {
        const bytes = await logoFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'logos');
        try {
          await mkdir(uploadDir, { recursive: true });
        } catch (e) {
          // Ignore if directory already exists
        }

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const extension = logoFile.name.split('.').pop() || 'png';
        const filename = `${slug}-${uniqueSuffix}.${extension}`;
        
        const filepath = join(uploadDir, filename);
        await writeFile(filepath, buffer);
        
        logoPhotoUrl = `/uploads/logos/${filename}`;
      }
    } else {
      const body = await request.json();
      name = body.name;
      colorHex = body.colorHex?.trim() || null;
    }
    
    const updateData: any = { name, colorHex };
    if (logoPhotoUrl !== undefined) {
      updateData.logo_photo = logoPhotoUrl;
    }

    const updatedTenant = await prisma.tenant.update({
      where: { slug },
      data: updateData,
      include: { 
        businessTemplate: {
          include: { templateColors: true }
        }
      }
    });
    
    let effectiveColor = updatedTenant.colorHex;
    if (!effectiveColor && updatedTenant.businessTemplate?.templateColors?.length > 0) {
      effectiveColor = updatedTenant.businessTemplate.templateColors[0].colorHex;
    }
    
    return NextResponse.json({
      ...updatedTenant,
      effectiveColor
    });
  } catch (error) {
    console.error("PUT Tenant API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
