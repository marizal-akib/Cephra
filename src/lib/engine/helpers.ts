/** Returns the numeric value if it is a number, otherwise NaN. */
export function num(v: unknown): number {
  return typeof v === "number" ? v : NaN;
}

/** Returns true only if the value is strictly boolean true. */
export function bool(v: unknown): boolean {
  return v === true;
}
