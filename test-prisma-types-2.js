const { Prisma } = require('@prisma/client');

async function main() {
    console.log('Checking Customer unique input keys...');
    // We can check the keys of a dummy object if available or just look at typical naming
    // But let's check if email_phone exists in the generated types metadata if possible
    console.log('Dumping Prisma.CustomerScalarFieldEnum again:', Prisma.CustomerScalarFieldEnum);
}

main();
