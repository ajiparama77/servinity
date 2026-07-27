import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seeder...');

  // 1. Clean up existing data (Idempotent)
  // Delete in reverse order of dependencies
  await prisma.templateBusinessColor.deleteMany();
  await prisma.templateProfession.deleteMany();
  await prisma.templateRole.deleteMany();
  await prisma.businessTemplate.deleteMany();

  console.log('Deleted old data.');

  // 2. Define the templates
  const templates = [
    {
      name: 'Salon & Beauty',
      color: '#FFC0CB', // Pink
      professions: [
        'Hair Stylist',
        'Senior Hair Stylist',
        'Colorist',
        'Hair Treatment Specialist',
        'Hair Washer',
        'Makeup Artist',
      ],
    },
    {
      name: 'Beauty Clinic',
      color: '#FFC0CB', // Pink
      professions: [
        'Aesthetic Doctor',
        'General Doctor',
        'Nurse',
        'Beautician',
        'Laser Therapist',
        'Skin Therapist',
        'Beauty Consultant',
      ],
    },
    {
      name: 'Physiotherapy',
      color: '#006400', // Dark Green
      professions: [
        'Physiotherapist',
        'Senior Physiotherapist',
        'Sports Physiotherapist',
        'Rehab Physiotherapist',
      ],
    },
    {
      name: 'Barbershop',
      color: '#00008B', // Dark Blue
      professions: ['Barber', 'Senior Barber', 'Hair Stylist', 'Hair Washer'],
    },
    {
      name: 'Nail Studio',
      color: '#FFC0CB', // Pink
      professions: ['Nail Artist', 'Senior Nail Artist', 'Manicurist', 'Pedicurist', 'Nail Technician'],
    },
    {
      name: 'Eyelash Studio',
      color: '#FFC0CB', // Pink
      professions: ['Lash Artist', 'Senior Lash Artist', 'Brow Artist', 'Beauty Therapist'],
    },
    {
      name: 'Tattoo Studio',
      color: '#000000', // Black
      professions: ['Tattoo Artist', 'Senior Tattoo Artist', 'Piercing Artist', 'Tattoo Assistant'],
    },
  ];

  const standardRoles = [
    { code: 'OWNER', name: 'Owner' },
    { code: 'MANAGER', name: 'Manager' },
    { code: 'RECEPTIONIST', name: 'Receptionist' },
    { code: 'CASHIER', name: 'Cashier' },
    { code: 'SERVICE_PROVIDER', name: 'Service Provider' },
    { code: 'ADMIN', name: 'Admin' },
  ];

  // 3. Insert data
  for (const t of templates) {
    const bt = await prisma.businessTemplate.create({
      data: {
        name: t.name,
        description: `Template for ${t.name} businesses`,
      },
    });

    console.log(`Created template: ${t.name}`);

    // Insert color
    await prisma.templateBusinessColor.create({
      data: {
        businessTemplateId: bt.id,
        colorHex: t.color,
      },
    });

    // Insert roles
    for (const role of standardRoles) {
      await prisma.templateRole.create({
        data: {
          businessTemplateId: bt.id,
          roleCode: role.code,
          roleName: role.name,
        },
      });
    }

    // Insert professions
    for (const profName of t.professions) {
      const code = profName.toUpperCase().replace(/\s+/g, '_');
      await prisma.templateProfession.create({
        data: {
          businessTemplateId: bt.id,
          professionCode: code,
          professionName: profName,
        },
      });
    }
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
