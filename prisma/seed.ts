const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear old data (dev only)
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  // Create landlords
  const landlords = await Promise.all([
    prisma.user.upsert({
      where: { email: "alice@landlord.com" },
      update: {},
      create: {
        name: "Alice Landlord",
        email: "alice@landlord.com",
        password: "hashedpassword",
        role: "LANDLORD",
      },
    }),
    prisma.user.upsert({
      where: { email: "john@landlord.com" },
      update: {},
      create: {
        name: "John Landlord",
        email: "john@landlord.com",
        password: "hashedpassword",
        role: "LANDLORD",
      },
    }),
    prisma.user.upsert({
      where: { email: "mary@landlord.com" },
      update: {},
      create: {
        name: "Mary Landlord",
        email: "mary@landlord.com",
        password: "hashedpassword",
        role: "LANDLORD",
      },
    }),
  ]);

  // Create agents
  const agents = await Promise.all([
    prisma.user.upsert({
      where: { email: "bob@agent.com" },
      update: {},
      create: {
        name: "Bob Agent",
        email: "bob@agent.com",
        password: "hashedpassword",
        role: "AGENT",
      },
    }),
    prisma.user.upsert({
      where: { email: "susan@agent.com" },
      update: {},
      create: {
        name: "Susan Agent",
        email: "susan@agent.com",
        password: "hashedpassword",
        role: "AGENT",
      },
    }),
    prisma.user.upsert({
      where: { email: "david@agent.com" },
      update: {},
      create: {
        name: "David Agent",
        email: "david@agent.com",
        password: "hashedpassword",
        role: "AGENT",
      },
    }),
  ]);

  // Create multiple listings with different owners and agents
  await prisma.listing.createMany({
    data: [
      {
        title: "Modern Apartment",
        description: "A beautiful apartment in the city center.",
        price: 1200,
        location: "Nairobi",
        ownerId: landlords[0].id,
        agentId: agents[0].id,
      },
      {
        title: "Cozy Cottage",
        description: "A peaceful cottage in the countryside.",
        price: 800,
        location: "Naivasha",
        ownerId: landlords[1].id,
        agentId: agents[1].id,
      },
      {
        title: "Luxury Villa",
        description: "A luxurious villa with a pool and garden.",
        price: 3000,
        location: "Mombasa",
        ownerId: landlords[2].id,
        agentId: agents[2].id,
      },
      {
        title: "Urban Loft",
        description: "A stylish loft in the heart of the city.",
        price: 1500,
        location: "Nairobi",
        ownerId: landlords[0].id,
        agentId: agents[1].id,
      },
      {
        title: "Beach House",
        description: "A relaxing house by the beach.",
        price: 2500,
        location: "Diani",
        ownerId: landlords[1].id,
        agentId: agents[2].id,
      },
      {
        title: "Mountain Retreat",
        description: "A quiet retreat in the mountains.",
        price: 1800,
        location: "Mt. Kenya",
        ownerId: landlords[2].id,
        agentId: agents[0].id,
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