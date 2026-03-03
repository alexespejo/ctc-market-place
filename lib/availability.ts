export const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri"];
export const DAYS_FULL = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

// JS getDay() indices for Mon–Fri
export const WEEKDAY_INDICES = [1, 2, 3, 4, 5];

// 30-min slots from 8:00am to 11:00pm
export const SLOT_START_MINUTES = 8 * 60; // 480
export const SLOT_DURATION_MINS = 30;
export const SLOT_COUNT = Math.floor(
  (23 * 60 - SLOT_START_MINUTES) / SLOT_DURATION_MINS,
); // 30

// day (0=Sun … 6=Sat) -> array of slot indices
export type AvailabilitySchedule = Partial<Record<number, number[]>>;

export function slotToMinutes(slot: number): number {
  return SLOT_START_MINUTES + slot * SLOT_DURATION_MINS;
}

export function formatMinutes(totalMins: number): string {
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  const period = h >= 12 ? "pm" : "am";
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${displayH}:${m.toString().padStart(2, "0")}${period}`;
}

export function slotLabel(slot: number): string {
  return formatMinutes(slotToMinutes(slot));
}

export function isCurrentlyAvailable(schedule: AvailabilitySchedule): boolean {
  const now = new Date();
  const day = now.getDay();
  if (!WEEKDAY_INDICES.includes(day)) return false;
  const mins = now.getHours() * 60 + now.getMinutes();
  const slot = Math.floor((mins - SLOT_START_MINUTES) / SLOT_DURATION_MINS);
  if (slot < 0 || slot >= SLOT_COUNT) return false;
  return schedule[day]?.includes(slot) ?? false;
}

export function getNextAvailableLabel(
  schedule: AvailabilitySchedule,
): string | null {
  const now = new Date();
  const todayDay = now.getDay();
  const currentMins = now.getHours() * 60 + now.getMinutes();

  for (let offset = 0; offset < 7; offset++) {
    const day = (todayDay + offset) % 7;
    if (!WEEKDAY_INDICES.includes(day)) continue; // skip weekends

    const slots = schedule[day];
    if (!slots || slots.length === 0) continue;

    const sorted = [...slots].sort((a, b) => a - b);
    for (const slot of sorted) {
      const slotMins = slotToMinutes(slot);
      if (offset === 0 && slotMins <= currentMins) continue;
      const timeStr = formatMinutes(slotMins);
      if (offset === 0) return `today at ${timeStr}`;
      if (offset === 1) return `tomorrow at ${timeStr}`;
      return `${DAYS_FULL[day - 1]} at ${timeStr}`; // day 1–5 → index 0–4
    }
  }
  return null;
}
