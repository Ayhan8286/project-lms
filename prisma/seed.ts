import { PrismaClient } from "@prisma/client";

const database = new PrismaClient();

async function main() {
    try {
        const count = await database.category.count();
        if (count > 0) {
            console.log("Database already seeded with " + count + " categories.");
            return;
        }

        const categories = [
            { name: "Computer Science" },
            { name: "Music" },
            { name: "Fitness" },
            { name: "Photography" },
            { name: "Accounting" },
            { name: "Engineering" },
            { name: "Filming" },
        ];

        for (const category of categories) {
            await database.category.create({
                data: category
            });
        }

        console.log("Success: Seeded database with categories.");
    } catch (error) {
        console.log("Error seeding the database categories", error);
    } finally {
        await database.$disconnect();
    }
}

main();
