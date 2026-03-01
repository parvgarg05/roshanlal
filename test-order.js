async function test() {
    try {
        const res = await fetch('http://localhost:3001/api/checkout/create-order', {
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
                items: [{ id: 'clm1abcd1234567890abcdef1', quantity: 1 }]
            })
        });

        const text = await res.text();
        console.log('Status:', res.status);
        console.log('Body:', text);
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

test();
