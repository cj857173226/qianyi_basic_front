export function deepClone(obj) {
  if (obj === null) return null;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (typeof obj !== "object") return obj;
  let o = new obj.constructor();
  for (let key in obj) {
    o[key] =
      typeof obj[key] === "object" ? this.deepClone(obj[key]) : obj[key];
  }
  return o;
}