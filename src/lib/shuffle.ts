/** Fisher–Yates shuffle that never returns the input order (when length > 1). */
export const shuffle = <T,>(arr: readonly T[]): T[] => {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  if (out.length > 1 && out.every((v, i) => v === arr[i])) [out[0], out[1]] = [out[1], out[0]];
  return out;
};
