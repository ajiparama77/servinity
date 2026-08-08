import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seeder...');

  // 1. We skip deleting templates because they might be in use by Tenants (Foreign Key constraint).
  // We will make the creation idempotent instead.
  
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

  // 3. Insert data idempotently
  for (const t of templates) {
    let bt = await prisma.businessTemplate.findFirst({ where: { name: t.name } });
    if (!bt) {
      bt = await prisma.businessTemplate.create({
        data: {
          name: t.name,
          description: `Template for ${t.name} businesses`,
        },
      });
      console.log(`Created template: ${t.name}`);

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
    } else {
      console.log(`Skipped existing template (roles/professions): ${t.name}`);
    }

    // Always ensure color exists
    const existingColor = await prisma.templateBusinessColor.findFirst({
      where: { businessTemplateId: bt.id }
    });
    
    if (!existingColor) {
      await prisma.templateBusinessColor.create({
        data: {
          businessTemplateId: bt.id,
          colorHex: t.color,
        },
      });
      console.log(`Created missing color ${t.color} for template ${t.name}`);
    }
  }

  // 4. Seed Superadmin
  console.log('Seeding Superadmin...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.superadmin.upsert({
    where: { email: 'admin@servinity.com' },
    update: { passwordHash: adminPassword },
    create: {
      email: 'admin@servinity.com',
      passwordHash: adminPassword,
      fullName: 'Servinity System Admin',
    },
  });

  // 5. Seed Subscription Plans
  console.log('Seeding Subscription Plans...');
  const plans = [
    {
      name: 'Basic Plan',
      pricePerMonth: 149000,
      maxBranches: 1,
      features: ['Basic POS System', 'Up to 100 Appointments/mo', 'Email Support'],
    },
    {
      name: 'Professional Plan',
      pricePerMonth: 299000,
      maxBranches: 3,
      features: ['Advanced POS System', 'Unlimited Appointments', 'WhatsApp Integration', 'Priority Support'],
    },
    {
      name: 'Enterprise Plan',
      pricePerMonth: 999000, // Or whatever custom pricing logic
      maxBranches: 999, // Represents unlimited
      features: ['Cross-branch Inventory', 'Consolidated Financial Reports', 'API Access', 'Dedicated Account Manager'],
    },
  ];

  for (const plan of plans) {
    const existingPlan = await prisma.subscriptionPlan.findFirst({
      where: { name: plan.name }
    });

    if (!existingPlan) {
      await prisma.subscriptionPlan.create({
        data: {
          name: plan.name,
          pricePerMonth: plan.pricePerMonth,
          maxBranches: plan.maxBranches,
          features: plan.features,
        }
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
