import JSBI from "jsbi";

let mod = (n, m) => ((n % m) + m) % m;

const radix2_4 = { "00": "0" };

export function isValidNumber(str, radix) {
  // precondition: 2 <= radix <= 36
  let validDigits = `0-${Math.min(9, radix - 1)}`,
    valid = null;
  if (radix > 10) {
    let biggestCharCode = String.fromCharCode("a".charCodeAt(0) + radix - 11);
    let validChars = `a-${biggestCharCode}`;
    valid = new RegExp(
      `^[${validDigits}${validChars}]*\\.?[${validDigits}${validChars}]+$`,
      "ig"
    );
  } else {
    valid = new RegExp(`^[${validDigits}]*\\.?[${validDigits}]+$`, "ig");
  }
  return valid.test(str);
}

export function convert2all(valueString, fromRadix) {
  const valInDecimal = parseInt(valueString.replace(/\s/g, ""), fromRadix);

  let numbers = Array(37)
    .fill(null)
    .map((_, index) => {
      if (index === 0 || index === 1) return "NaN";
      else {
        return valInDecimal.toString(index);
      }
    });
  return numbers;
}
