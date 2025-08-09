const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear old data (dev only)
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  // Upsert users
  const landlord = await prisma.user.upsert({
    where: { email: "alice@landlord.com" },
    update: {},
    create: {
      name: "Alice Landlord",
      email: "alice@landlord.com",
      password: "hashedpassword",
      role: "LANDLORD",
    },
  });

  const agent = await prisma.user.upsert({
    where: { email: "bob@agent.com" },
    update: {},
    create: {
      name: "Bob Agent",
      email: "bob@agent.com",
      password: "hashedpassword",
      role: "AGENT",
    },
  });

  // Create multiple listings
  await prisma.listing.createMany({
    data: [
      {
        title: "Modern Apartment",
        description: "A beautiful apartment in the city center.",
        price: 1200,
        location: "Nairobi",
        ownerId: landlord.id,
        agentId: agent.id,
      },
      {
        title: "Cozy Cottage",
        description: "A peaceful cottage in the countryside.",
        price: 800,
        location: "Naivasha",
        ownerId: landlord.id,
        agentId: agent.id,
      },
      {
        title: "Luxury Villa",
        description: "A luxurious villa with a pool and garden.",
        price: 3000,
        location: "Mombasa",
        ownerId: landlord.id,
        agentId: agent.id,
      },
    ],
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });