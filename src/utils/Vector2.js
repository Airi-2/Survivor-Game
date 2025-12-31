export const clamp = (val, min, max, radius = 0) => {
  if (radius === 0) {
    return Math.max(min, Math.min(max, val));
  } else {
    return Math.max(min + radius, Math.min(max - radius, val));
  }
};
