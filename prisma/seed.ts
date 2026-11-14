import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { localityPages } from '../src/lib/patna-localities';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required to seed the database.');
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const localities = localityPages.map((locality) => locality.name);
const brands = ['Kent','Aquaguard','Pureit','Livpure','Havells','Blue Star','AO Smith','Whirlpool','Tata Swach','Eureka Forbes','Zero B','Pentair'];
const categories = ['Membranes','Pumps','SMPS & Adapters','Filters & Cartridges','UV & UF Parts','Valves','Tanks','Tubes & Fittings','Complete RO Systems','Commercial RO Parts','Combo Kits','Accessories'];
const services = [
  { name: 'RO Repair', slug: 'repair', description: 'Diagnosis and repair for common home RO purifier issues.', basePrice: 0 },
  { name: 'RO Installation', slug: 'installation', description: 'New unit installation and purifier re-installation.', basePrice: 0 },
  { name: 'Filter Change', slug: 'filter-change', description: 'Filter and cartridge replacement; parts quoted separately.', basePrice: 0 },
  { name: 'Annual Maintenance', slug: 'amc', description: 'Ask us about annual maintenance options for your purifier.', basePrice: 0 },
  { name: 'Commercial Quote', slug: 'commercial-quote', description: 'Site assessment and service quote for commercial RO systems.', basePrice: 0 }
];
const slug = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function main() {
  try {
    for (const name of localities) await prisma.locality.upsert({ where: { slug: slug(name) }, update: {}, create: { name, slug: slug(name) } });
    for (const name of brands) await prisma.brand.upsert({ where: { slug: slug(name) }, update: {}, create: { name, slug: slug(name) } });
    for (const name of categories) await prisma.category.upsert({ where: { slug: slug(name) }, update: {}, create: { name, slug: slug(name) } });
    for (const service of services) await prisma.service.upsert({ where: { slug: service.slug }, update: {}, create: service });
    const defaults = {
      businessProfile: { name: 'QuickFix RO Care', city: 'Patna', state: 'Bihar', address: 'Patna, Bihar', phone: '+91 96612 88308', whatsapp: '919661288308', email: '', hours: 'Hours to be confirmed' },
      siteAnnouncement: { active: false, text: '' }
    };
    for (const [key, value] of Object.entries(defaults)) await prisma.setting.upsert({ where: { key }, update: {}, create: { key, value } });
    console.log(`Seed complete: ${localities.length} localities, ${brands.length} brands, ${categories.length} product categories, ${services.length} services.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
