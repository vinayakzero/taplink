import fs from "fs";
import path from "path";
import { prisma } from "./prisma";
import { getMongoDb, isMongoConfigured } from "./mongodb";

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

// Data directory path for disk persistence
const DATA_DIR = path.join(process.cwd(), "data");
const CUSTOMERS_FILE = path.join(DATA_DIR, "customers.json");
const CARDS_FILE = path.join(DATA_DIR, "nfc-cards.json");
const EVENTS_FILE = path.join(DATA_DIR, "analytics.json");

function ensureDataDir(dir = DATA_DIR) {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch {
    // Read-only filesystem fallback
  }
}

function loadJson<T>(filePath: string, fallback: T): T {
  try {
    const tmpPath = path.join("/tmp", path.basename(filePath));
    const targetPath = fs.existsSync(tmpPath) ? tmpPath : filePath;

    if (fs.existsSync(targetPath)) {
      const content = fs.readFileSync(targetPath, "utf-8").replace(/^\uFEFF/, "").trim();
      if (!content) return fallback;
      return JSON.parse(content);
    }
  } catch (err) {
    console.error(`Error loading ${filePath}:`, err);
  }
  return fallback;
}

function saveJson<T>(filePath: string, data: T) {
  try {
    ensureDataDir();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    try {
      const tmpPath = path.join("/tmp", path.basename(filePath));
      fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf-8");
    } catch (tmpErr) {
      console.error(`Error saving to tmp for ${filePath}:`, tmpErr);
    }
  }
}

// In-memory cache loaded from disk
let inMemoryCustomers: CustomerData[] = loadJson<CustomerData[]>(CUSTOMERS_FILE, []);
let inMemoryNfcCards: NfcCardData[] = loadJson<NfcCardData[]>(CARDS_FILE, []);
let inMemoryEvents: AnalyticsEventData[] = loadJson<AnalyticsEventData[]>(EVENTS_FILE, []);

/**
 * Get customer by username (case-insensitive)
 */
export async function getCustomerByUsername(username: string): Promise<CustomerData | null> {
  const normalized = username.toLowerCase().trim();

  // 1. Try MongoDB Atlas
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const doc = await db.collection("customers").findOne({
          username: { $regex: new RegExp(`^${normalized}$`, "i") },
        });
        if (doc) {
          const { _id, ...rest } = doc as any;
          return rest as CustomerData;
        }
      }
    } catch (err) {
      console.error("Mongo getCustomerByUsername error:", err);
    }
  }

  // 2. Try PostgreSQL Prisma
  try {
    const customer = await prisma.customer.findUnique({
      where: { username: normalized },
    });
    if (customer) return customer;
  } catch {
    // Fallback to in-memory/file store
  }

  // 3. Fallback to JSON file / memory
  const customers = loadJson<CustomerData[]>(CUSTOMERS_FILE, inMemoryCustomers);
  inMemoryCustomers = customers;
  const found = customers.find((c) => c.username.toLowerCase() === normalized);
  return found || null;
}

/**
 * Get customer by ID
 */
export async function getCustomerById(id: string): Promise<CustomerData | null> {
  // 1. Try MongoDB
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const doc = await db.collection("customers").findOne({ id });
        if (doc) {
          const { _id, ...rest } = doc as any;
          return rest as CustomerData;
        }
      }
    } catch (err) {
      console.error("Mongo getCustomerById error:", err);
    }
  }

  // 2. Try PostgreSQL Prisma
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
    });
    if (customer) return customer;
  } catch {
    // Fallback
  }

  // 3. Fallback to memory/file
  const customers = loadJson<CustomerData[]>(CUSTOMERS_FILE, inMemoryCustomers);
  inMemoryCustomers = customers;
  return customers.find((c) => c.id === id) || null;
}

/**
 * Get all customers
 */
export async function getAllCustomers(): Promise<CustomerData[]> {
  // 1. Try MongoDB
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const docs = await db.collection("customers").find({}).sort({ createdAt: -1 }).toArray();
        if (docs && docs.length > 0) {
          return docs.map(({ _id, ...rest }: any) => rest as CustomerData);
        }
      }
    } catch (err) {
      console.error("Mongo getAllCustomers error:", err);
    }
  }

  // 2. Try PostgreSQL Prisma
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (customers && customers.length > 0) return customers;
  } catch {
    // Fallback
  }

  // 3. Fallback to file/memory
  const customers = loadJson<CustomerData[]>(CUSTOMERS_FILE, inMemoryCustomers);
  inMemoryCustomers = customers;
  return customers;
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

  // 1. Try MongoDB
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection("customers").insertOne({ ...newCustomer });
        inMemoryCustomers.unshift(newCustomer);
        saveJson(CUSTOMERS_FILE, inMemoryCustomers);
        return newCustomer;
      }
    } catch (err) {
      console.error("Mongo createCustomer error:", err);
    }
  }

  // 2. Try PostgreSQL Prisma
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
    saveJson(CUSTOMERS_FILE, inMemoryCustomers);
    return created;
  } catch {
    inMemoryCustomers.unshift(newCustomer);
    saveJson(CUSTOMERS_FILE, inMemoryCustomers);
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

  // 1. Try MongoDB
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection("customers").updateOne({ id }, { $set: { ...data, updatedAt: now } });
        const updatedDoc = await db.collection("customers").findOne({ id });
        if (updatedDoc) {
          const { _id, ...rest } = updatedDoc as any;
          const idx = inMemoryCustomers.findIndex((c) => c.id === id);
          if (idx !== -1) inMemoryCustomers[idx] = rest as CustomerData;
          saveJson(CUSTOMERS_FILE, inMemoryCustomers);
          return rest as CustomerData;
        }
      }
    } catch (err) {
      console.error("Mongo updateCustomer error:", err);
    }
  }

  // 2. Try PostgreSQL Prisma
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
    saveJson(CUSTOMERS_FILE, inMemoryCustomers);
    return updated;
  } catch {
    const idx = inMemoryCustomers.findIndex((c) => c.id === id);
    if (idx !== -1) {
      inMemoryCustomers[idx] = {
        ...inMemoryCustomers[idx],
        ...data,
        updatedAt: now,
      };
      saveJson(CUSTOMERS_FILE, inMemoryCustomers);
      return inMemoryCustomers[idx];
    }
    return null;
  }
}

/**
 * Delete a customer and associated records permanently
 */
export async function deleteCustomer(id: string): Promise<boolean> {
  // 1. Try MongoDB
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection("customers").deleteOne({ id });
        await db.collection("nfc_cards").deleteMany({ customerId: id });
        await db.collection("analytics_events").deleteMany({ customerId: id });
      }
    } catch (err) {
      console.error("Mongo deleteCustomer error:", err);
    }
  }

  // 2. Try PostgreSQL Prisma
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

  saveJson(CUSTOMERS_FILE, inMemoryCustomers);
  saveJson(CARDS_FILE, inMemoryNfcCards);
  saveJson(EVENTS_FILE, inMemoryEvents);

  return inMemoryCustomers.length < initialLength;
}

/**
 * Toggle Active customer
 */
export async function setCustomerStatus(id: string, isActive: boolean): Promise<boolean> {
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection("customers").updateOne({ id }, { $set: { isActive, updatedAt: new Date() } });
      }
    } catch (err) {
      console.error("Mongo setCustomerStatus error:", err);
    }
  }

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
    saveJson(CUSTOMERS_FILE, inMemoryCustomers);
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

  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection("analytics_events").insertOne({ ...eventData });
      }
    } catch (err) {
      console.error("Mongo trackAnalyticsEvent error:", err);
    }
  }

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
  saveJson(EVENTS_FILE, inMemoryEvents);
  return true;
}

/**
 * Get all NFC Cards
 */
export async function getAllNfcCards(): Promise<NfcCardData[]> {
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const docs = await db.collection("nfc_cards").find({}).sort({ createdAt: -1 }).toArray();
        const allCustomers = await getAllCustomers();
        return docs.map(({ _id, ...rest }: any) => ({
          ...rest,
          customer: allCustomers.find((c) => c.id === rest.customerId),
        })) as NfcCardData[];
      }
    } catch (err) {
      console.error("Mongo getAllNfcCards error:", err);
    }
  }

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

  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection("nfc_cards").insertOne({ ...newCard });
        inMemoryNfcCards.unshift(newCard);
        saveJson(CARDS_FILE, inMemoryNfcCards);
        return newCard;
      }
    } catch (err) {
      console.error("Mongo createNfcCard error:", err);
    }
  }

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
    saveJson(CARDS_FILE, inMemoryNfcCards);
    return created;
  } catch {
    inMemoryNfcCards.unshift(newCard);
    saveJson(CARDS_FILE, inMemoryNfcCards);
    return newCard;
  }
}

/**
 * Get Analytics statistics
 */
export async function getAnalyticsStats(customerId?: string) {
  let events = inMemoryEvents;

  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const filter = customerId ? { customerId } : {};
        const docs = await db.collection("analytics_events").find(filter).sort({ createdAt: -1 }).toArray();
        if (docs && docs.length > 0) {
          events = docs.map(({ _id, ...rest }: any) => rest as AnalyticsEventData);
        }
      }
    } catch (err) {
      console.error("Mongo getAnalyticsStats error:", err);
    }
  } else {
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
