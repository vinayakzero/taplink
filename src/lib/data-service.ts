import fs from "fs";
import path from "path";
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

// Data directory path for permanent disk persistence
const DATA_DIR = path.join(process.cwd(), "data");
const CUSTOMERS_FILE = path.join(DATA_DIR, "customers.json");
const CARDS_FILE = path.join(DATA_DIR, "nfc-cards.json");
const EVENTS_FILE = path.join(DATA_DIR, "analytics.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadJson<T>(filePath: string, fallback: T): T {
  try {
    ensureDataDir();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "").trim();
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
  } catch (err) {
    console.error(`Error saving ${filePath}:`, err);
  }
}

// Initial in-memory state loaded from disk
let inMemoryCustomers: CustomerData[] = loadJson<CustomerData[]>(CUSTOMERS_FILE, []);
let inMemoryNfcCards: NfcCardData[] = loadJson<NfcCardData[]>(CARDS_FILE, []);
let inMemoryEvents: AnalyticsEventData[] = loadJson<AnalyticsEventData[]>(EVENTS_FILE, []);

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
    // Fallback to in-memory/file store
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
