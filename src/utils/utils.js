let mod = (n, m) => ((n % m) + m) % m;

export function isValidNumber(str, radix) {
  // precondition: 1 <= radix <= 36
  let validDigits = `0-${Math.min(9, radix)}`,
    validChars = "";
  if (radix > 10) {
    let biggestCharCode = String.fromCharCode("a".charCodeAt(0) + radix - 11);
    validChars = `a-${biggestCharCode}`;
  }

  let regex = new RegExp(`[^${validDigits}${validChars}]`, "ig");
  return regex.test(str);
}
