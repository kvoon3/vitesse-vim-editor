export function objectOmit<T extends object>(obj: T, keys: Array<keyof T>): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.find(i => i === key)),
  ) as T
}
