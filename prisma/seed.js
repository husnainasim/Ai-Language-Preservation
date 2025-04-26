const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Create initial languages
  const languages = [
    {
      id: "yupik-central-alaskan-yup'ik",
      name: "Central Alaskan Yup'ik",
      description:
        "Central Alaskan Yup'ik is an Eskimo-Aleut language spoken in southwestern Alaska.",
      region: "Alaska, United States",
    },
    // Add more languages as needed
  ];

  console.log("Start seeding languages...");

  for (const language of languages) {
    const created = await prisma.language.upsert({
      where: { id: language.id },
      update: language,
      create: language,
    });
    console.log(`Created language: ${created.name} (${created.id})`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
