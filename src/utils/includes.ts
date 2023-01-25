export default function includes<T>(
  arr: T[],
  searchElement: any
): searchElement is T {
  // @ts-ignore
  return arr.some((e) => e === searchElement);
}
