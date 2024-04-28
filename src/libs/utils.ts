import { NavItemConfig } from "@/typings/layout";

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

export function generateRandomEAN13(): string {
  // Generate random 12-digit product code
  let productCode = '';
  for (let i = 0; i < 12; i++) {
    productCode += Math.floor(Math.random() * 10);
  }

  // Calculate checksum
  const digits = productCode.split('').map(Number);
  const sum = digits.reduce((acc, digit, index) => {
    return acc + (index % 2 === 0 ? digit : digit * 3);
  }, 0);
  const checksum = (10 - (sum % 10)) % 10;

  // Construct full EAN13 barcode
  const ean13 = productCode + checksum;

  return ean13;
}

export function isNavItemActive({
  disabled,
  external,
  href,
  matcher,
  pathname,
}: Pick<NavItemConfig, 'disabled' | 'external' | 'href' | 'matcher'> & { pathname: string }): boolean {
  if (disabled || !href || external) {
    return false;
  }

  if (matcher) {
    if (matcher.type === 'startsWith') {
      return pathname.startsWith(matcher.href);
    }

    if (matcher.type === 'equals') {
      return pathname === matcher.href;
    }

    return false;
  }

  return pathname === href;
}

export const getFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!(file instanceof Blob)) {
      reject(new Error('Invalid file type. Expected a Blob.'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target) {
        const content = event.target.result as string;
        resolve(content);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
};