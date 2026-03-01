const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Checking Customer unique identifiers...');
    try {
        // This will fail if email_phone is not the right name, but let's check what's available
        console.log('Customer unique inputs:', require('@prisma/client').Prisma.CustomerScalarFieldEnum);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
