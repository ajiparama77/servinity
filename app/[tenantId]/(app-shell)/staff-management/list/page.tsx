import prisma from "@/lib/prisma";
import StaffListClient from "./StaffListClient";
import { notFound } from "next/navigation";

export default async function StaffListPage(props: { params: Promise<{ tenantId: string }> }) {
  const params = await props.params;
  const tenantSlug = params.tenantId;

  // Fetch the tenant and its associated roles and professions
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    include: {
      roles: {
        include: {
          templateRole: true
        }
      },
      businessTemplate: {
        include: {
          templateProfessions: {
            orderBy: { professionName: 'asc' }
          }
        }
      }
    }
  });

  if (!tenant) {
    return notFound();
  }

  // Also fetch the existing staff
  const staff = await prisma.staff.findMany({
    where: { tenantId: tenant.id },
    include: {
      user: {
        include: {
          role: {
            include: { templateRole: true }
          }
        }
      },
      profession: true
    },
    orderBy: { fullName: 'asc' }
  });

  return (
    <StaffListClient 
      initialStaff={staff} 
      roles={tenant.roles} 
      professions={tenant.businessTemplate.templateProfessions} 
      tenantId={tenant.id}
    />
  );
}
