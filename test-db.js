// Quick test: ping the Next.js API to see if DB is reachable
async function test() {
    try {
        // Hit the home page API to trigger prisma connection
        const res = await fetch('http://localhost:3002/api/checkout/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customer: {
                    name: 'Test User',
                    phone: '7055513961',
                    email: 'test@example.com',
                    addressLine: 'Test Address',
                    city: 'Test City',
                    state: 'Test State',
                    pincode: '110001'
                },
                items: [{ id: '1', quantity: 1 }]  // Product ID '1' (Kaju Katli)
            })
        });

        const text = await res.text();
        console.log('Status:', res.status);
        console.log('Response:', text);
    } catch (err) {
        console.error('Error:', err.message);
    }
}

test();
