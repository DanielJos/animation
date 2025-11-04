export const getNext10 = (c: string): string => {
  // Parse as integer, wrap around 0–9
  const n = (parseInt(c, 10) + 1) % 10;
  return n.toString();
};

export const getNextAlphaNumeric = (c: string): string => {
  const chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  return nextInSet(c, chars);
};

export const getNextAlphabetic = (c: string): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  return nextInSet(c, chars);
};

export const nextInSet = (c: string, set: string) => {
  const i = set.indexOf(c);
  return set[(i + 1 + (i < 0 ? 0 : 0)) % set.length] || set[0];
};

export const distanceForward = (from: string, to: string, set: string) => {
  const i = set.indexOf(from);
  const j = set.indexOf(to);
  if (i < 0 || j < 0) return 0;
  return (j - i + set.length) % set.length;
};
