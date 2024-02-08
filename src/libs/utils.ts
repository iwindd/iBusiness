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

export function isValidEAN(code: string): boolean {
  // Remove any non-numeric characters
  code = code.replace(/\D/g, '');

  // Check if the code is either EAN8 or EAN13
  if (code.length !== 8 && code.length !== 13) {
      return false;
  }

  // Checksum calculation
  const checksum = code.slice(-1);
  const digits = code.slice(0, -1).split('').map(Number);

  const sum = digits.reduce((acc, digit, index) => {
      if ((code.length === 8 && index % 2 === 0) || (code.length === 13 && index % 2 !== 0)) {
          return acc + digit * 3;
      }
      return acc + digit;
  }, 0);

  const calculatedChecksum = (10 - (sum % 10)) % 10;

  return parseInt(checksum, 10) === calculatedChecksum;
}