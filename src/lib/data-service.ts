import { prisma } from "./prisma";

export interface CustomerData {
  id: string;
  userId?: string | null;
  username: string;
  name: string;
  businessName?: string | null;
  bio?: string | null;
  profileImage?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  whatsappMessage?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  youtubeUrl?: string | null;
  websiteUrl?: string | null;
  googleReviewUrl?: string | null;
  locationUrl?: string | null;
  upiId?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NfcCardData {
  id: string;
  customerId: string;
  cardUid: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  customer?: CustomerData;
}

export interface AnalyticsEventData {
  id: string;
  customerId: string;
  eventType: string;
  createdAt: Date;
  metadata?: unknown;
}

// Built-in seed profiles updated as requested (removed verbose filler and Verma Tech Consulting)
export const INITIAL_CUSTOMERS: CustomerData[] = [
  {
    id: "cust-rahul-01",
    userId: "user-admin-01",
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
    createdAt: new Date("2026-01-15T10:00:00Z"),
    updatedAt: new Date("2026-01-15T10:00:00Z"),
  },
  {
    id: "cust-abc-salon-02",
    userId: "user-admin-01",
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
    createdAt: new Date("2026-02-01T11:30:00Z"),
    updatedAt: new Date("2026-02-01T11:30:00Z"),
  },
  {
    id: "cust-sharma-cafe-03",
    userId: "user-admin-01",
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
    createdAt: new Date("2026-02-10T09:15:00Z"),
    updatedAt: new Date("2026-02-10T09:15:00Z"),
  },
];

export const INITIAL_NFC_CARDS: NfcCardData[] = [
  {
    id: "nfc-001",
    customerId: "cust-rahul-01",
    cardUid: "04:A2:8B:1A:6F:5E:80",
    status: "ACTIVE",
    createdAt: new Date("2026-01-16T12:00:00Z"),
    updatedAt: new Date("2026-01-16T12:00:00Z"),
  },
  {
    id: "nfc-002",
    customerId: "cust-abc-salon-02",
    cardUid: "04:C5:11:9D:3A:42:80",
    status: "ACTIVE",
    createdAt: new Date("2026-02-02T14:00:00Z"),
    updatedAt: new Date("2026-02-02T14:00:00Z"),
  },
  {
    id: "nfc-003",
    customerId: "cust-sharma-cafe-03",
    cardUid: "04:E9:55:7B:8C:19:80",
    status: "ACTIVE",
    createdAt: new Date("2026-02-11T16:00:00Z"),
    updatedAt: new Date("2026-02-11T16:00:00Z"),
  },
];

// In-memory fallback repository when running without PostgreSQL connected
let inMemoryCustomers: CustomerData[] = [...INITIAL_CUSTOMERS];
let inMemoryNfcCards: NfcCardData[] = [...INITIAL_NFC_CARDS];
let inMemoryEvents: AnalyticsEventData[] = [
  { id: "ev-1", customerId: "cust-rahul-01", eventType: "profile_view", createdAt: new Date(Date.now() - 3600000 * 2) },
  { id: "ev-2", customerId: "cust-rahul-01", eventType: "whatsapp_click", createdAt: new Date(Date.now() - 3600000) },
  { id: "ev-3", customerId: "cust-rahul-01", eventType: "upi_click", createdAt: new Date(Date.now() - 1800000) },
  { id: "ev-4", customerId: "cust-abc-salon-02", eventType: "profile_view", createdAt: new Date(Date.now() - 7200000) },
  { id: "ev-5", customerId: "cust-abc-salon-02", eventType: "google_review_click", createdAt: new Date(Date.now() - 3600000) },
  { id: "ev-6", customerId: "cust-sharma-cafe-03", eventType: "profile_view", createdAt: new Date(Date.now() - 14400000) },
];

/**
 * Get customer by username (case-insensitive)
 */
export async function getCustomerByUsername(username: string): Promise<CustomerData | null> {
  const normalized = username.toLowerCase().trim();
  try {
    const customer = await prisma.customer.findUnique({
      where: { username: normalized },
    });
    if (customer) return customer;
  } catch {
    // Fallback to in-memory store
  }

  const found = inMemoryCustomers.find((c) => c.username.toLowerCase() === normalized);
  return found || null;
}

/**
 * Get customer by ID
 */
export async function getCustomerById(id: string): Promise<CustomerData | null> {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
    });
    if (customer) return customer;
  } catch {
    // Fallback
  }
  return inMemoryCustomers.find((c) => c.id === id) || null;
}

/**
 * Get all customers
 */
export async function getAllCustomers(): Promise<CustomerData[]> {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (customers && customers.length > 0) return customers;
  } catch {
    // Fallback
  }
  return inMemoryCustomers;
}

/**
 * Create a new customer
 */
export async function createCustomer(data: Omit<CustomerData, "id" | "createdAt" | "updatedAt">): Promise<CustomerData> {
  const cleanUsername = data.username.toLowerCase().trim();
  const id = `cust-${cleanUsername}-${Date.now().toString(36)}`;
  const now = new Date();

  const newCustomer: CustomerData = {
    ...data,
    id,
    username: cleanUsername,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const created = await prisma.customer.create({
      data: {
        id: newCustomer.id,
        userId: newCustomer.userId,
        username: newCustomer.username,
        name: newCustomer.name,
        businessName: newCustomer.businessName,
        bio: newCustomer.bio,
        profileImage: newCustomer.profileImage,
        phone: newCustomer.phone,
        whatsapp: newCustomer.whatsapp,
        whatsappMessage: newCustomer.whatsappMessage,
        instagramUrl: newCustomer.instagramUrl,
        facebookUrl: newCustomer.facebookUrl,
        youtubeUrl: newCustomer.youtubeUrl,
        websiteUrl: newCustomer.websiteUrl,
        googleReviewUrl: newCustomer.googleReviewUrl,
        locationUrl: newCustomer.locationUrl,
        upiId: newCustomer.upiId,
        isActive: newCustomer.isActive,
      },
    });
    inMemoryCustomers.unshift(created);
    return created;
  } catch {
    inMemoryCustomers.unshift(newCustomer);
    return newCustomer;
  }
}

/**
 * Update an existing customer
 */
export async function updateCustomer(
  id: string,
  data: Partial<Omit<CustomerData, "id" | "createdAt">>
): Promise<CustomerData | null> {
  const now = new Date();
  try {
    const updated = await prisma.customer.update({
      where: { id },
      data: {
        ...data,
        updatedAt: now,
      },
    });
    const idx = inMemoryCustomers.findIndex((c) => c.id === id);
    if (idx !== -1) inMemoryCustomers[idx] = updated;
    return updated;
  } catch {
    const idx = inMemoryCustomers.findIndex((c) => c.id === id);
    if (idx !== -1) {
      inMemoryCustomers[idx] = {
        ...inMemoryCustomers[idx],
        ...data,
        updatedAt: now,
      };
      return inMemoryCustomers[idx];
    }
    return null;
  }
}

/**
 * Delete a customer and associated records
 */
export async function deleteCustomer(id: string): Promise<boolean> {
  try {
    await prisma.analyticsEvent.deleteMany({ where: { customerId: id } }).catch(() => {});
    await prisma.nfcCard.deleteMany({ where: { customerId: id } }).catch(() => {});
    await prisma.customer.delete({ where: { id } }).catch(() => {});
  } catch {
    // DB offline fallback
  }

  const initialLength = inMemoryCustomers.length;
  inMemoryCustomers = inMemoryCustomers.filter((c) => c.id !== id);
  inMemoryNfcCards = inMemoryNfcCards.filter((c) => c.customerId !== id);
  inMemoryEvents = inMemoryEvents.filter((e) => e.customerId !== id);
  return inMemoryCustomers.length < initialLength;
}

/**
 * Toggle Active customer
 */
export async function setCustomerStatus(id: string, isActive: boolean): Promise<boolean> {
  try {
    await prisma.customer.update({
      where: { id },
      data: { isActive },
    });
  } catch {
    // Fallback
  }
  const customer = inMemoryCustomers.find((c) => c.id === id);
  if (customer) {
    customer.isActive = isActive;
    return true;
  }
  return false;
}

/**
 * Record an analytics event
 */
export async function trackAnalyticsEvent(
  customerId: string,
  eventType: string,
  metadata?: unknown
): Promise<boolean> {
  const eventData: AnalyticsEventData = {
    id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    customerId,
    eventType,
    createdAt: new Date(),
    metadata: metadata || null,
  };

  try {
    await prisma.analyticsEvent.create({
      data: {
        id: eventData.id,
        customerId: eventData.customerId,
        eventType: eventData.eventType,
        metadata: eventData.metadata as any,
      },
    });
  } catch {
    // Fallback in memory
  }

  inMemoryEvents.push(eventData);
  return true;
}

/**
 * Get all NFC Cards
 */
export async function getAllNfcCards(): Promise<NfcCardData[]> {
  try {
    const cards = await prisma.nfcCard.findMany({
      include: { customer: true },
      orderBy: { createdAt: "desc" },
    });
    if (cards && cards.length > 0) return cards as any;
  } catch {
    // Fallback
  }
  return inMemoryNfcCards.map((c) => ({
    ...c,
    customer: inMemoryCustomers.find((cust) => cust.id === c.customerId),
  }));
}

/**
 * Create or assign NFC card
 */
export async function createNfcCard(customerId: string, cardUid: string, status = "ACTIVE"): Promise<NfcCardData> {
  const newCard: NfcCardData = {
    id: `nfc-${Date.now().toString(36)}`,
    customerId,
    cardUid,
    status,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const created = await prisma.nfcCard.create({
      data: {
        id: newCard.id,
        customerId: newCard.customerId,
        cardUid: newCard.cardUid,
        status: newCard.status,
      },
    });
    inMemoryNfcCards.unshift(created);
    return created;
  } catch {
    inMemoryNfcCards.unshift(newCard);
    return newCard;
  }
}

/**
 * Get Analytics statistics
 */
export async function getAnalyticsStats(customerId?: string) {
  let events = inMemoryEvents;
  try {
    const dbEvents = await prisma.analyticsEvent.findMany({
      where: customerId ? { customerId } : undefined,
      orderBy: { createdAt: "desc" },
    });
    if (dbEvents && dbEvents.length > 0) {
      events = dbEvents as any;
    }
  } catch {
    // Fallback
  }

  const filtered = customerId ? events.filter((e) => e.customerId === customerId) : events;

  const totalEvents = filtered.length;
  const profileViews = filtered.filter((e) => e.eventType === "profile_view").length;
  const clicks = filtered.filter((e) => e.eventType !== "profile_view").length;

  const eventTypeBreakdown: Record<string, number> = {};
  for (const ev of filtered) {
    eventTypeBreakdown[ev.eventType] = (eventTypeBreakdown[ev.eventType] || 0) + 1;
  }

  return {
    totalEvents,
    profileViews,
    clicks,
    eventTypeBreakdown,
    recentEvents: filtered.slice(-20).reverse(),
  };
}
