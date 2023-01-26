export default function includes<T>(
  arr: T[],
  searchElement: any
): searchElement is T {
  return arr.some((e) => e === searchElement);
}
