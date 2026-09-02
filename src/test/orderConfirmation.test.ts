import { describe, expect, it } from "vitest";
import { formatOrderDate } from "../../functions/api/_shared/orderConfirmation";

describe("formatOrderDate", () => {
  it("formats an order date as DD Mon YYYY", () => {
    expect(formatOrderDate("2026-02-12T10:15:00.000Z")).toBe("12 Feb 2026");
  });

  it("uses the South African calendar date around UTC midnight", () => {
    expect(formatOrderDate("2026-02-11T22:30:00.000Z")).toBe("12 Feb 2026");
  });
});
