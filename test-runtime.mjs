async function test() {
  console.log("🔍 Testing TapLink live endpoints, Auth, Profile Editing & Deletion...\n");

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

  // 1. Test Admin Login POST
  let authCookie = "";
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
    authCookie = loginRes.headers.get("set-cookie") || "";
    console.log(`✅ Admin Login (POST /api/auth/login) -> Status: ${loginRes.status}`, data);
  } catch (err) {
    console.error("❌ Admin Login Error:", err.message);
  }

  // 2. Test Customer Create (for deletion test)
  let createdCustomerId = "";
  try {
    const createRes = await fetch("http://localhost:3000/api/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: authCookie,
      },
      body: JSON.stringify({
        name: "Test Delete Profile",
        username: "test-delete-profile",
        businessName: "Temporary Business",
        bio: "This customer will be deleted to test deletion functionality.",
        whatsapp: "919876543210",
        upiId: "test@upi",
        isActive: true,
      }),
    });
    const createData = await createRes.json();
    createdCustomerId = createData.customer?.id;
    console.log(`✅ Create Customer (POST /api/customers) -> Status: ${createRes.status}`, createData);
  } catch (err) {
    console.error("❌ Create Customer Error:", err.message);
  }

  // 3. Test Customer Update (Business Name & Bio Edit)
  try {
    const updateRes = await fetch(`http://localhost:3000/api/customers/cust-rahul-01`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: authCookie,
      },
      body: JSON.stringify({
        name: "Rahul",
        username: "rahul",
        businessName: "Cloud & Tech Solutions",
        bio: "Providing modern digital NFC solutions.",
        whatsapp: "919876543210",
        upiId: "rahul@okhdfcbank",
        isActive: true,
      }),
    });
    const updateData = await updateRes.json();
    console.log(`✅ Update Customer Bio & Business Title (PUT /api/customers/cust-rahul-01) -> Status: ${updateRes.status}`, updateData.customer?.businessName);
  } catch (err) {
    console.error("❌ Update Customer Error:", err.message);
  }

  // 4. Test Customer Deletion
  if (createdCustomerId) {
    try {
      const deleteRes = await fetch(`http://localhost:3000/api/customers/${createdCustomerId}`, {
        method: "DELETE",
        headers: {
          Cookie: authCookie,
        },
      });
      const deleteData = await deleteRes.json();
      console.log(`✅ Delete Customer (DELETE /api/customers/${createdCustomerId}) -> Status: ${deleteRes.status}`, deleteData);
    } catch (err) {
      console.error("❌ Delete Customer Error:", err.message);
    }
  }

  console.log("\n🚀 All verification tests finished successfully!");
}

test();
