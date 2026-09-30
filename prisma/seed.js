const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting TapLink database seed...");

  // 1. Create Admin User with user-specified credentials
  const adminEmail = process.env.ADMIN_EMAIL || "admin@taplink.in";
  const adminPassword = process.env.ADMIN_PASSWORD || "Taplink!@#$1234";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: "ADMIN",
    },
    create: {
      id: "user-admin-01",
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`✅ Admin user created/verified: ${admin.email}`);

  // 2. Create Default Customers
  const seedCustomers = [
    {
      id: "cust-rahul-01",
      userId: admin.id,
      username: "rahul",
      name: "Rahul",
      businessName: null,
      bio: null,
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      phone: "+91 98765 43210",
      whatsapp: "919876543210",
      whatsappMessage: "Hi Rahul! I saw your TapLink profile and would like to connect.",
      instagramUrl: "https://instagram.com/rahul",
      facebookUrl: "https://facebook.com/rahul",
      youtubeUrl: "https://youtube.com/@rahul",
      websiteUrl: "https://taplink.in/rahul",
      googleReviewUrl: "https://g.page/r/example-rahul/review",
      locationUrl: null,
      upiId: "rahul@okhdfcbank",
      isActive: true,
    },
    {
      id: "cust-abc-salon-02",
      userId: admin.id,
      username: "abc-salon",
      name: "ABC Salon",
      businessName: "Luxury Hair & Beauty Spa",
      bio: "Hair styling, organic treatments, and beauty makeovers.",
      profileImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
      phone: "+91 98111 22334",
      whatsapp: "919811122334",
      whatsappMessage: "Hello ABC Salon! I'd like to book an appointment.",
      instagramUrl: "https://instagram.com/abcluxurysalon",
      facebookUrl: "https://facebook.com/abcluxurysalon",
      youtubeUrl: "https://youtube.com/@abcsalonlooks",
      websiteUrl: "https://abcsalon.in",
      googleReviewUrl: "https://g.page/r/example-abc-salon/review",
      locationUrl: null,
      upiId: "abcsalon@icici",
      isActive: true,
    },
    {
      id: "cust-sharma-cafe-03",
      userId: admin.id,
      username: "sharma-cafe",
      name: "Sharma Cafe",
      businessName: "Fresh Brews & Bakery",
      bio: "Artisanal coffee and fresh bakery items.",
      profileImage: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
      phone: "+91 99887 76655",
      whatsapp: "919988776655",
      whatsappMessage: "Hi Sharma Cafe! I'd like to reserve a table / place an order.",
      instagramUrl: "https://instagram.com/sharmacafebakery",
      facebookUrl: "https://facebook.com/sharmacafe",
      youtubeUrl: "https://youtube.com/@sharmacaferecipes",
      websiteUrl: "https://sharmacafe.in",
      googleReviewUrl: "https://g.page/r/example-sharma-cafe/review",
      locationUrl: null,
      upiId: "sharmacafe@paytm",
      isActive: true,
    },
  ];

  for (const cust of seedCustomers) {
    await prisma.customer.upsert({
      where: { username: cust.username },
      update: cust,
      create: cust,
    });
    console.log(`✅ Customer profile seeded: https://taplink.in/${cust.username}`);
  }

  // 3. Seed NFC Cards
  const seedCards = [
    { id: "nfc-001", customerId: "cust-rahul-01", cardUid: "04:A2:8B:1A:6F:5E:80", status: "ACTIVE" },
    { id: "nfc-002", customerId: "cust-abc-salon-02", cardUid: "04:C5:11:9D:3A:42:80", status: "ACTIVE" },
    { id: "nfc-003", customerId: "cust-sharma-cafe-03", cardUid: "04:E9:55:7B:8C:19:80", status: "ACTIVE" },
  ];

  for (const card of seedCards) {
    await prisma.nfcCard.upsert({
      where: { cardUid: card.cardUid },
      update: card,
      create: card,
    });
  }

  console.log("🚀 TapLink Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
