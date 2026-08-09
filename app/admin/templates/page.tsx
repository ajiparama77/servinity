import prisma from "@/lib/prisma";
import TemplatesClient from "./TemplatesClient";

export default async function AdminTemplatesPage() {
  const templates = await prisma.businessTemplate.findMany({
    include: {
      templateProfessions: {
        orderBy: { professionName: 'asc' }
      },
      templateRoles: {
        orderBy: { roleName: 'asc' }
      }
    },
    orderBy: { name: 'asc' }
  });

  return <TemplatesClient initialTemplates={templates} />;
}
