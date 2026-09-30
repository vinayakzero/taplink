async function test() {
  console.log("🔍 Testing TapLink live endpoints with admin@taplink.in / Taplink!@#$1234 ...\n");

  const endpoints = [
    { name: "Homepage (GET /)", url: "http://localhost:3000/", method: "GET" },
    { name: "Customer Profile: Rahul (GET /rahul)", url: "http://localhost:3000/rahul", method: "GET" },
    { name: "Customer Profile: ABC Salon (GET /abc-salon)", url: "http://localhost:3000/abc-salon", method: "GET" },
    { name: "Customer Profile: Sharma Cafe (GET /sharma-cafe)", url: "http://localhost:3000/sharma-cafe", method: "GET" },
    { name: "Customers API (GET /api/customers)", url: "http://localhost:3000/api/customers", method: "GET" },
    { name: "vCard Export (GET /api/vcard/rahul)", url: "http://localhost:3000/api/vcard/rahul", method: "GET" },
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, { method: ep.method });
      console.log(`✅ ${ep.name} -> Status: ${res.status} ${res.statusText}`);
      if (ep.url.includes("api/vcard")) {
        console.log(`   Content-Type: ${res.headers.get("content-type")}`);
      }
    } catch (err) {
      console.error(`❌ ${ep.name} -> Error:`, err.message);
    }
  }

  // Test Admin Login POST with admin@taplink.in / Taplink!@#$1234
  try {
    const loginRes = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@taplink.in",
        password: "Taplink!@#$1234",
      }),
    });
    const data = await loginRes.json();
    console.log(`✅ Admin Login (POST /api/auth/login) -> Status: ${loginRes.status}`, data);
  } catch (err) {
    console.error("❌ Admin Login Error:", err.message);
  }

  // Test Analytics Track POST
  try {
    const trackRes = await fetch("http://localhost:3000/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "rahul",
        eventType: "vcard_download",
      }),
    });
    const trackData = await trackRes.json();
    console.log(`✅ Analytics Track (POST /api/analytics/track) -> Status: ${trackRes.status}`, trackData);
  } catch (err) {
    console.error("❌ Analytics Track Error:", err.message);
  }

  console.log("\n🚀 All updated tests finished successfully!");
}

test();
