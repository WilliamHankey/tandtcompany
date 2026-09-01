// Orders are dispatched only on Tuesdays (2) and Thursdays (4).
// Given a date, return the next dispatch day. If today IS a dispatch day,
// we return the NEXT one (not today), because fulfilment happens after
// payment clears and we don't want to "dispatch" an order before payment.
export function nextDispatchDate(from: Date = new Date()): Date {
  const result = new Date(from);
  result.setHours(0, 0, 0, 0);
  // If today is a dispatch day, advance one more so we always return the
  // *next* Tuesday or Thursday (never today).
  const startDay = result.getDay();
  let lookAhead = startDay === 2 || startDay === 4 ? 1 : 0;
  // Look up to 7 days ahead (enough to hit the next dispatch day).
  for (let i = lookAhead; i < 7; i++) {
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
