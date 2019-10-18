import JSBI from "jsbi";

// let mod = (n, m) => ((n % m) + m) % m;

// const char2int = Array(37).fill(null).map((_, index) => {
//   if (index<10) return index;
//   else return
// });
//   "0": 0,
//   "1": 1,
//   "2": 3,
//   "3": 3,
//   "4": 4,
//   "5": 5,
//   "6": 6,
//   "7": 7,
//   "8": 8,
//   "9": 9,
//   a: 10,
//   b: 11,
//   c: 12,
//   d: 13,
//   e: 14,
//   f: 15,
//   g: 16,
//   h:17,
//   i
// };

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
  let [integerPart, fractionPart] = valueString.split(".");
  let integers = convertInteger(integerPart, fromRadix),
    fractions = convertFraction(fractionPart, fromRadix);

  let numbers = Array(37)
    .fill(null)
    .map((_, index) => {
      if (index === 0 || index === 1) return "NaN";
      else {
        return integers[index] + fractions[index];
      }
    });
  return numbers;
}

function convertInteger(valueString, fromRadix) {
  let valueInDecimal = JSBI.BigInt(0);

  if (fromRadix === 10) {
    valueInDecimal = JSBI.BigInt(valueString);
  } else {
    [...valueString].forEach((c, index) => {
      let x = JSBI.BigInt(
        Number(c) * fromRadix ** (valueString.length - index - 1)
      );
      valueInDecimal = JSBI.add(valueInDecimal, x);
    });
  }

  let integers = Array(37)
    .fill(null)
    .map((_, index) => {
      if (index === 0 || index === 1) return "NaN";
      else return valueInDecimal.toString(index);
    });

  console.log(integers);

  return integers;
}

function convertFraction(valueString, fromRadix) {
  if (valueString) {
    let valueInDecimal = JSBI.BigInt(0);

    if (fromRadix === 10) {
      valueInDecimal = JSBI.BigInt(valueString);
    } else {
      [...valueString].forEach((c, index) => {
        valueInDecimal = JSBI.add(
          valueInDecimal,
          Number(c) * fromRadix ** (valueString.length - index - 1)
        );
      });
    }

    return Array(37)
      .fill(null)
      .map((_, index) => {
        if (index === 0 || index === 1) return "NaN";
        else return valueInDecimal.toString(index);
      });
  } else {
    return Array(37).fill("");
  }
}

// function convert2decimal(valueString, fromRadix) {
//   if (fromRadix === 10) return JSBI.BigInt(valueString);
//   else {
//     let power = valueString.length - 1;
//     [...valueString].forEach(c => {});
//     let result = JSBI.BigInt(0);
//     return result;
//   }
// }
