export function classes(...args: any[]) {
  return args.filter((args) => typeof args === "string").join(" ");
}
