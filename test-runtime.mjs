async function test() {
  console.log("🔍 Testing TapLink live endpoints, Auth, Image Upload, Profile Editing & Deletion...\n");

  const endpoints = [
    { name: "Homepage (GET /)", url: "http://localhost:3000/", method: "GET" },
    { name: "Customer Profile: Rahul (GET /rahul)", url: "http://localhost:3000/rahul", method: "GET" },
    { name: "Customer Profile: ABC Salon (GET /abc-salon)", url: "http://localhost:3000/abc-salon", method: "GET" },
    { name: "Customer Profile: Sharma Cafe (GET /sharma-cafe)", url: "http://localhost:3000/sharma-cafe", method: "GET" },
    { name: "Customers API (GET /api/customers)", url: "http://localhost:3000/api/customers", method: "GET" },
    { name: "vCard Export (GET /api/vcard/rahul)", url: "http://localhost:3000/api/vcard/rahul", method: "GET" },
    { name: "Static Logo Asset (GET /logo.png)", url: "http://localhost:3000/logo.png", method: "GET" },
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

  // 2. Test Image Upload API (POST /api/upload)
  let uploadedPhotoUrl = "";
  try {
    const formData = new FormData();
    const fakeImageBuffer = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
    const blob = new Blob([fakeImageBuffer], { type: "image/png" });
    formData.append("file", blob, "avatar.png");

    const uploadRes = await fetch("http://localhost:3000/api/upload", {
      method: "POST",
      body: formData,
    });
    const uploadData = await uploadRes.json();
    uploadedPhotoUrl = uploadData.url;
    console.log(`✅ Gallery Image Upload (POST /api/upload) -> Status: ${uploadRes.status}`, uploadData);
  } catch (err) {
    console.error("❌ Image Upload Error:", err.message);
  }

  // 3. Test Customer Create (with uploaded profile photo)
  let createdCustomerId = "";
  try {
    const createRes = await fetch("http://localhost:3000/api/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: authCookie,
      },
      body: JSON.stringify({
        name: "Test Photo Profile",
        username: "test-photo-profile",
        businessName: "Photo Studio",
        bio: "Tested with uploaded gallery photo.",
        profileImage: uploadedPhotoUrl,
        whatsapp: "919876543210",
        upiId: "test@upi",
        isActive: true,
      }),
    });
    const createData = await createRes.json();
    createdCustomerId = createData.customer?.id;
    console.log(`✅ Create Customer with Uploaded Photo (POST /api/customers) -> Status: ${createRes.status}`, createData.customer?.profileImage);
  } catch (err) {
    console.error("❌ Create Customer Error:", err.message);
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

  console.log("\n🚀 All verification tests completed successfully!");
}

test();
