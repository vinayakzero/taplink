const BASE_URL = "https://taplink-app.vercel.app";

async function runLiveTests() {
  console.log(`=== STARTING LIVE VERCEL VERIFICATION (${BASE_URL}) ===`);
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // Test 1: Homepage & WhatsApp button
  console.log("\n1. Testing Live Homepage...");
  try {
    const res = await fetch(`${BASE_URL}/`);
    const html = await res.text();
    assert(res.status === 200, "Live Homepage returns status 200 OK");
    assert(html.includes("Order on WhatsApp") || html.includes("wa.me"), "Live Homepage has Order on WhatsApp CTA");
    assert(html.includes("/admin/login") || html.includes("/admin"), "Live Homepage has Admin link");
    assert(!html.includes(">+91 99999 99999<"), "No raw phone number visible in button text");
  } catch (err) {
    assert(false, `Live Homepage fetch error: ${err.message}`);
  }

  // Test 2: Live Admin Login
  console.log("\n2. Testing Live Admin Login Authentication...");
  let cookieHeader = "";
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@taplink.in", password: "Taplink!@#$1234" }),
    });
    const data = await res.json();
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
      cookieHeader = setCookie.split(";")[0];
    }
    assert(res.status === 200 && data.success, `Live Admin login successful: status=${res.status}`);
  } catch (err) {
    assert(false, `Live Admin login failed: ${err.message}`);
  }

  // Test 3: Add Customer on Live Vercel
  console.log("\n3. Testing Add Customer on Live Vercel...");
  let createdCustomerId = "";
  const testUsername = `testrohan${Date.now().toString(36)}`;
  try {
    const customerPayload = {
      name: "Rohan Sharma",
      businessName: "Sharma Photography Studio",
      username: testUsername,
      bio: "Professional Wedding & Event Photographer in Mumbai",
      phone: "+91 98200 12345",
      whatsapp: "919820012345",
      whatsappMessage: "Hi Rohan! I would like to inquire about photoshoot bookings.",
      googleReviewUrl: "https://g.page/r/sharma-studio/review",
      upiId: "rohan@okhdfcbank",
      websiteUrl: "https://sharmaphotography.in",
      instagramUrl: "sharmaphotography",
      facebookUrl: "sharmaphotography",
      youtubeUrl: "sharmaphotography",
      locationUrl: "https://maps.google.com/?q=Sharma+Photography",
      isActive: true,
    };

    const res = await fetch(`${BASE_URL}/api/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(customerPayload),
    });

    const data = await res.json();
    assert(res.status === 201 && data.customer?.id, `Live Customer created successfully: @${testUsername}`);
    createdCustomerId = data.customer?.id;
  } catch (err) {
    assert(false, `Live Customer creation failed: ${err.message}`);
  }

  // Test 4: Live Customer Profile Page & Dynamic Buttons
  console.log("\n4. Testing Live Customer Profile Page on Vercel...");
  try {
    const res = await fetch(`${BASE_URL}/${testUsername}`);
    const html = await res.text();
    assert(res.status === 200, `Live profile /${testUsername} loaded with status 200`);
    assert(html.includes("Rohan Sharma"), "Profile renders customer name correctly");
    assert(html.includes("Sharma Photography Studio"), "Profile renders business name");
    assert(html.includes("919820012345"), "WhatsApp action button configured");
    assert(html.includes("98200"), "Direct call / phone button configured");
    assert(html.includes("sharma-studio"), "Google Reviews button configured");
    assert(html.includes("rohan@okhdfcbank"), "UPI direct payment link configured");
    assert(html.includes("sharmaphotography"), "Social media buttons (Insta/FB/YT) configured");
  } catch (err) {
    assert(false, `Live profile page failed: ${err.message}`);
  }

  // Test 5: Live vCard Download API
  console.log("\n5. Testing Live vCard Contact Download...");
  try {
    const res = await fetch(`${BASE_URL}/api/vcard/${testUsername}`);
    const vcf = await res.text();
    assert(res.status === 200, "Live vCard API returned 200");
    assert(vcf.includes("BEGIN:VCARD") && vcf.includes("Rohan Sharma"), "Live vCard contains valid contact payload");
  } catch (err) {
    assert(false, `Live vCard download failed: ${err.message}`);
  }

  // Test 6: Delete Customer from Live Vercel
  console.log("\n6. Testing Delete Customer on Live Vercel...");
  try {
    const res = await fetch(`${BASE_URL}/api/customers/${createdCustomerId}`, {
      method: "DELETE",
      headers: { Cookie: cookieHeader },
    });
    const data = await res.json();
    assert(res.status === 200 && data.success, "Customer deleted successfully on Live Vercel");

    // Verify customer is gone from list
    const listRes = await fetch(`${BASE_URL}/api/customers`);
    const listData = await listRes.json();
    const stillExists = (listData.customers || []).some((c) => c.id === createdCustomerId);
    assert(!stillExists, "Customer permanently removed from live database");
  } catch (err) {
    assert(false, `Live Customer delete failed: ${err.message}`);
  }

  console.log(`\n=== LIVE VERCEL VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED ===\n`);
}

runLiveTests();
