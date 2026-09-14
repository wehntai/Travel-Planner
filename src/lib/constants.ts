// Shared option lists for fields stored as plain strings in SQLite.
// Centralizing these keeps labels/colors consistent across forms and displays.

export const TRIP_STATUSES = [
  { value: "planning", label: "Planning" },
  { value: "booked", label: "Booked" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
] as const;

export type TripStatus = (typeof TRIP_STATUSES)[number]["value"];

export const BUCKET_CATEGORIES = [
  { value: "food", label: "Food", emoji: "🍜" },
  { value: "sightseeing", label: "Sightseeing", emoji: "🏛️" },
  { value: "activity", label: "Activity", emoji: "🎟️" },
  { value: "shopping", label: "Shopping", emoji: "🛍️" },
  { value: "nature", label: "Nature", emoji: "🌿" },
  { value: "nightlife", label: "Nightlife", emoji: "🌙" },
  { value: "culture", label: "Culture", emoji: "🎭" },
  { value: "other", label: "Other", emoji: "📌" },
] as const;

export type BucketCategory = (typeof BUCKET_CATEGORIES)[number]["value"];

export const BUCKET_STATUSES = [
  { value: "want_to_visit", label: "Want to Visit" },
  { value: "planned", label: "Planned" },
  { value: "completed", label: "Completed" },
] as const;

export type BucketStatus = (typeof BUCKET_STATUSES)[number]["value"];

export const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
] as const;

export type Priority = (typeof PRIORITIES)[number]["value"];

export const FLIGHT_TYPES = [
  { value: "departure", label: "Departure" },
  { value: "return", label: "Return" },
  { value: "other", label: "Other" },
] as const;

export type FlightType = (typeof FLIGHT_TYPES)[number]["value"];

export const PACKING_CATEGORIES = [
  { value: "clothing", label: "Clothing" },
  { value: "toiletries", label: "Toiletries" },
  { value: "electronics", label: "Electronics" },
  { value: "documents", label: "Documents" },
  { value: "medication", label: "Medication" },
  { value: "essentials", label: "Travel Essentials" },
  { value: "misc", label: "Miscellaneous" },
] as const;

export type PackingCategory = (typeof PACKING_CATEGORIES)[number]["value"];

export const EXPENSE_CATEGORIES = [
  { value: "food", label: "Food", emoji: "🍜" },
  { value: "flights", label: "Flights", emoji: "✈️" },
  { value: "hotel", label: "Hotel", emoji: "🏨" },
  { value: "transportation", label: "Transportation", emoji: "🚕" },
  { value: "activities", label: "Activities", emoji: "🎟️" },
  { value: "shopping", label: "Shopping", emoji: "🛍️" },
  { value: "other", label: "Other", emoji: "💸" },
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]["value"];

export const MEMBER_ROLES = [
  { value: "owner", label: "Owner" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
] as const;

export type MemberRole = (typeof MEMBER_ROLES)[number]["value"];

export const AVATAR_COLORS = [
  "#0ea5e9",
  "#f97316",
  "#22c55e",
  "#a855f7",
  "#ef4444",
  "#14b8a6",
  "#eab308",
  "#ec4899",
];

export function labelFor<T extends { value: string; label: string }>(
  options: readonly T[],
  value: string,
): string {
  return options.find((o) => o.value === value)?.label ?? value;
}
