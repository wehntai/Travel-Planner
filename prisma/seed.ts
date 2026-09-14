import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setHours(9, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}

function at(date: Date, hours: number, minutes = 0): Date {
  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

async function main() {
  console.log("Seeding database...");

  await prisma.expense.deleteMany();
  await prisma.note.deleteMany();
  await prisma.accommodation.deleteMany();
  await prisma.itineraryEvent.deleteMany();
  await prisma.packingItem.deleteMany();
  await prisma.flight.deleteMany();
  await prisma.bucketListItem.deleteMany();
  await prisma.shareLink.deleteMany();
  await prisma.tripMember.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.user.deleteMany();

  const alex = await prisma.user.create({
    data: { name: "Alex Morgan", avatarColor: "#0ea5e9" },
  });
  const jamie = await prisma.user.create({
    data: { name: "Jamie Chen", avatarColor: "#f97316" },
  });
  const sam = await prisma.user.create({
    data: { name: "Sam Rivera", avatarColor: "#22c55e" },
  });

  // --- Trip 1: Japan 2027 (planning, in the future) ---------------------
  const japan = await prisma.trip.create({
    data: {
      name: "Japan 2027",
      destination: "Tokyo → Kyoto → Osaka",
      startDate: new Date("2027-04-10"),
      endDate: new Date("2027-04-24"),
      description:
        "Two weeks of cherry blossoms, ramen, and temples. Tokyo first, then the bullet train down to Kyoto and Osaka.",
      status: "planning",
      ownerId: alex.id,
      members: {
        create: [
          { userId: alex.id, role: "owner" },
          { userId: jamie.id, role: "editor" },
          { userId: sam.id, role: "editor" },
        ],
      },
    },
  });

  await prisma.bucketListItem.createMany({
    data: [
      {
        tripId: japan.id,
        name: "Shibuya Crossing",
        location: "Tokyo",
        category: "sightseeing",
        description: "The famous scramble crossing, best seen from the Starbucks above.",
        priority: "high",
        status: "planned",
        estimatedCost: 0,
      },
      {
        tripId: japan.id,
        name: "Ichiran Ramen",
        location: "Shibuya, Tokyo",
        category: "food",
        description: "Solo booth ramen with a build-your-own flavor form.",
        priority: "high",
        status: "want_to_visit",
        estimatedCost: 15,
        website: "https://ichiran.com",
      },
      {
        tripId: japan.id,
        name: "Fushimi Inari Shrine",
        location: "Kyoto",
        category: "culture",
        description: "Thousands of vermillion torii gates up the mountain.",
        priority: "high",
        status: "want_to_visit",
        estimatedCost: 0,
      },
      {
        tripId: japan.id,
        name: "Arashiyama Bamboo Grove",
        location: "Kyoto",
        category: "nature",
        priority: "medium",
        status: "want_to_visit",
        estimatedCost: 0,
      },
      {
        tripId: japan.id,
        name: "Dotonbori at night",
        location: "Osaka",
        category: "nightlife",
        description: "Neon signs, canal boats, and street food everywhere.",
        priority: "medium",
        status: "want_to_visit",
        estimatedCost: 30,
      },
      {
        tripId: japan.id,
        name: "Nintendo TOKYO",
        location: "Shibuya, Tokyo",
        category: "shopping",
        priority: "low",
        status: "want_to_visit",
        estimatedCost: 50,
      },
      {
        tripId: japan.id,
        name: "teamLab Planets",
        location: "Tokyo",
        category: "activity",
        description: "Immersive digital art museum — book tickets in advance.",
        priority: "high",
        status: "planned",
        estimatedCost: 25,
        website: "https://teamlab.art/e/planets/",
      },
    ],
  });

  await prisma.flight.createMany({
    data: [
      {
        tripId: japan.id,
        type: "departure",
        airline: "ANA",
        flightNumber: "NH 106",
        departureAirport: "SFO",
        departureDateTime: new Date("2027-04-10T13:20:00"),
        arrivalAirport: "HND",
        arrivalDateTime: new Date("2027-04-11T16:50:00"),
        confirmationNumber: "ANA-88213X",
        terminal: "International Terminal",
      },
      {
        tripId: japan.id,
        type: "return",
        airline: "ANA",
        flightNumber: "NH 107",
        departureAirport: "HND",
        departureDateTime: new Date("2027-04-24T17:30:00"),
        arrivalAirport: "SFO",
        arrivalDateTime: new Date("2027-04-24T11:05:00"),
        confirmationNumber: "ANA-88213X",
      },
    ],
  });

  await prisma.accommodation.createMany({
    data: [
      {
        tripId: japan.id,
        name: "Shibuya Excel Hotel Tokyu",
        address: "1-12-2 Dogenzaka, Shibuya, Tokyo",
        checkIn: new Date("2027-04-11"),
        checkOut: new Date("2027-04-16"),
        confirmationNumber: "TE-994821",
        price: 1240,
        bookingLink: "https://example.com/booking/1",
      },
      {
        tripId: japan.id,
        name: "Kyoto Machiya Stay",
        address: "Nakagyo Ward, Kyoto",
        checkIn: new Date("2027-04-16"),
        checkOut: new Date("2027-04-20"),
        confirmationNumber: "AIRBNB-KY0212",
        price: 680,
      },
      {
        tripId: japan.id,
        name: "Osaka Namba Hotel",
        address: "Namba, Osaka",
        checkIn: new Date("2027-04-20"),
        checkOut: new Date("2027-04-24"),
        price: 520,
      },
    ],
  });

  await prisma.packingItem.createMany({
    data: [
      { tripId: japan.id, name: "Passport", category: "documents", packed: true },
      { tripId: japan.id, name: "Travel insurance printout", category: "documents", packed: true },
      { tripId: japan.id, name: "Phone charger", category: "electronics", packed: true },
      { tripId: japan.id, name: "Universal adapter", category: "electronics", packed: false },
      { tripId: japan.id, name: "Portable battery pack", category: "electronics", packed: false },
      { tripId: japan.id, name: "Comfortable walking shoes", category: "clothing", packed: false },
      { tripId: japan.id, name: "Light rain jacket", category: "clothing", packed: false },
      { tripId: japan.id, name: "Toothbrush & toothpaste", category: "toiletries", packed: true },
      { tripId: japan.id, name: "Sunscreen", category: "toiletries", packed: false },
      { tripId: japan.id, name: "Allergy medication", category: "medication", packed: false },
      { tripId: japan.id, name: "IC card / Suica", category: "essentials", packed: false },
      { tripId: japan.id, name: "Pocket wifi reservation", category: "essentials", packed: true },
      { tripId: japan.id, name: "Reusable water bottle", category: "essentials", packed: false },
    ],
  });

  const day1 = new Date("2027-04-12");
  const day2 = new Date("2027-04-13");
  await prisma.itineraryEvent.createMany({
    data: [
      {
        tripId: japan.id,
        title: "Breakfast at Tsutaya Bookstore Cafe",
        startAt: at(day1, 9, 0),
        location: "Daikanyama, Tokyo",
        sortOrder: 0,
      },
      {
        tripId: japan.id,
        title: "Explore Shibuya",
        startAt: at(day1, 10, 30),
        location: "Shibuya, Tokyo",
        notes: "Walk through Shibuya Crossing, check out the Starbucks view.",
        sortOrder: 1,
      },
      {
        tripId: japan.id,
        title: "Lunch — Ichiran Ramen",
        startAt: at(day1, 13, 0),
        location: "Shibuya, Tokyo",
        sortOrder: 2,
      },
      {
        tripId: japan.id,
        title: "Meiji Shrine",
        startAt: at(day1, 15, 0),
        location: "Shibuya, Tokyo",
        sortOrder: 3,
      },
      {
        tripId: japan.id,
        title: "Dinner in Shinjuku",
        startAt: at(day1, 19, 0),
        location: "Shinjuku, Tokyo",
        sortOrder: 4,
      },
      {
        tripId: japan.id,
        title: "teamLab Planets",
        startAt: at(day2, 10, 0),
        location: "Tokyo",
        notes: "Tickets already booked — bring shorts, some rooms have water.",
        sortOrder: 0,
      },
      {
        tripId: japan.id,
        title: "Akihabara wander",
        startAt: at(day2, 14, 0),
        location: "Akihabara, Tokyo",
        sortOrder: 1,
      },
    ],
  });

  await prisma.expense.createMany({
    data: [
      { tripId: japan.id, name: "Flights (Alex + Jamie)", amount: 2140, category: "flights", paidById: alex.id, date: new Date("2026-11-02") },
      { tripId: japan.id, name: "Shibuya Excel Hotel deposit", amount: 300, category: "hotel", paidById: jamie.id, date: new Date("2026-11-10") },
      { tripId: japan.id, name: "JR Pass (3 people)", amount: 690, category: "transportation", paidById: sam.id, date: new Date("2026-12-01") },
      { tripId: japan.id, name: "teamLab tickets", amount: 75, category: "activities", paidById: alex.id, date: new Date("2026-12-15") },
    ],
  });

  await prisma.note.createMany({
    data: [
      {
        tripId: japan.id,
        title: "Restaurant ideas",
        content:
          "- Sukiyabashi Jiro (need reservation months out)\n- Ippudo original Hakata location if we make it south\n- Try onigiri from a konbini at least once, seriously",
      },
      {
        tripId: japan.id,
        title: "Things to remember",
        content:
          "Get a Suica/Welcome Suica card at the airport. Cash is still king outside big cities — bring more yen than you think you need.",
      },
    ],
  });

  await prisma.shareLink.create({
    data: { tripId: japan.id, token: "japan2027-friends", role: "editor" },
  });

  // --- Trip 2: Lisbon Long Weekend (completed, in the past) --------------
  const lisbon = await prisma.trip.create({
    data: {
      name: "Lisbon Long Weekend",
      destination: "Lisbon, Portugal",
      startDate: new Date("2026-03-05"),
      endDate: new Date("2026-03-09"),
      description: "A quick escape for pastel de nata and miradouro sunsets.",
      status: "completed",
      ownerId: alex.id,
      members: {
        create: [
          { userId: alex.id, role: "owner" },
          { userId: jamie.id, role: "editor" },
        ],
      },
    },
  });

  await prisma.bucketListItem.createMany({
    data: [
      { tripId: lisbon.id, name: "Pastéis de Belém", location: "Belém", category: "food", priority: "high", status: "completed" },
      { tripId: lisbon.id, name: "Miradouro da Senhora do Monte", location: "Graça", category: "sightseeing", priority: "medium", status: "completed" },
      { tripId: lisbon.id, name: "Tram 28 ride", location: "Alfama", category: "activity", priority: "medium", status: "completed" },
    ],
  });

  await prisma.expense.createMany({
    data: [
      { tripId: lisbon.id, name: "Flights", amount: 480, category: "flights", paidById: alex.id, date: new Date("2026-01-15") },
      { tripId: lisbon.id, name: "Airbnb", amount: 390, category: "hotel", paidById: jamie.id, date: new Date("2026-02-01") },
      { tripId: lisbon.id, name: "Dinner at Time Out Market", amount: 62, category: "food", paidById: alex.id, date: new Date("2026-03-06") },
    ],
  });

  // --- Trip 3: Iceland Ring Road (planning, further out) -----------------
  const iceland = await prisma.trip.create({
    data: {
      name: "Iceland Ring Road",
      destination: "Reykjavík and the Ring Road",
      startDate: daysFromNow(120),
      endDate: daysFromNow(130),
      description: "Road trip around the whole island — waterfalls, glaciers, hot springs.",
      status: "planning",
      ownerId: sam.id,
      members: {
        create: [
          { userId: sam.id, role: "owner" },
          { userId: alex.id, role: "editor" },
        ],
      },
    },
  });

  await prisma.bucketListItem.createMany({
    data: [
      { tripId: iceland.id, name: "Seljalandsfoss", category: "nature", priority: "high", status: "want_to_visit" },
      { tripId: iceland.id, name: "Blue Lagoon", category: "activity", priority: "medium", status: "want_to_visit", estimatedCost: 90 },
      { tripId: iceland.id, name: "Jökulsárlón Glacier Lagoon", category: "nature", priority: "high", status: "want_to_visit" },
    ],
  });

  await prisma.packingItem.createMany({
    data: [
      { tripId: iceland.id, name: "Waterproof jacket", category: "clothing" },
      { tripId: iceland.id, name: "Thermal layers", category: "clothing" },
      { tripId: iceland.id, name: "International driver's permit", category: "documents" },
    ],
  });

  console.log("Seed complete:");
  console.log(`  Users: Alex Morgan, Jamie Chen, Sam Rivera`);
  console.log(`  Trips: ${japan.name}, ${lisbon.name}, ${iceland.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
