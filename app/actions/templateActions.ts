"use server";

import prisma from "@/lib/prisma";

export async function getBusinessTemplates() {
  try {
    const templates = await prisma.businessTemplate.findMany({
      include: {
        templateColors: true,
      },
      orderBy: {
        name: 'asc'
      }
    });

    return {
      success: true,
      data: templates.map(t => ({
        id: t.id,
        name: t.name,
        colorHex: t.templateColors[0]?.colorHex || "#333333"
      }))
    };
  } catch (error) {
    console.error("Error fetching templates:", error);
    return { success: false, data: [] };
  }
}
