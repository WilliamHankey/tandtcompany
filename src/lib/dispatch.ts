// Orders are dispatched only on Tuesdays (2) and Thursdays (4).
// Given a date, return the next dispatch day (inclusive of today if it is a
// dispatch day — though in practice fulfilment happens after payment clears).
export function nextDispatchDate(from: Date = new Date()): Date {
  const result = new Date(from);
  result.setHours(0, 0, 0, 0);
  // Look up to 7 days ahead.
  for (let i = 0; i < 7; i++) {
    const day = result.getDay();
    if (day === 2 || day === 4) {
      return result;
    }
    result.setDate(result.getDate() + 1);
  }
  return result;
}

export function formatDispatchDate(date: Date = nextDispatchDate()): string {
  return date.toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
