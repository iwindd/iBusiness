export function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export function filterArrayByProperty<T>(
  arr: T[],
  property: keyof T
): T[] {
  const uniqueKeys = new Set();
  return arr.filter(obj => {
    const key = obj[property];

    if (!uniqueKeys.has(key)) {
      uniqueKeys.add(key);
      return true;
    }

    return false;
  });
}
