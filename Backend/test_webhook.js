const API_URL = 'http://localhost:3000/api/meetings/webhook';

const testPayload = {
    triggerEvent: "BOOKING_CREATED",
    payload: {
        id: Date.now(),
        startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        status: "ACCEPTED",
        attendees: [
            {
                name: "Test Client",
                email: "client@test.com",
            }
        ],
        responses: {
            referral_code: "REF123",
            question1: "Answer to question 1",
            question2: "Answer to question 2"
        },
        metadata: {
            referral_code: "REF123"
        }
    }
};

async function testWebhook() {
    try {
        console.log("🚀 Sending test webhook to:", API_URL);
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(testPayload)
        });
        const data = await response.json();
        console.log("✅ Status:", response.status);
        console.log("✅ Response:", data);
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

testWebhook();
