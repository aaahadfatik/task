import { subDays } from "date-fns";

function mulberry32(seed: number) {
  let t = seed + 0x6d2b79f5;
  return function () {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getDateAdded(productId: number, baseDate = new Date()) {
  const rng = mulberry32(productId * 9301 + 49297);
  const maxDays = 180;
  const offset = Math.floor(rng() * maxDays);
  const normalizedBase = new Date(baseDate);
  normalizedBase.setHours(0, 0, 0, 0);
  return subDays(normalizedBase, offset);
}
