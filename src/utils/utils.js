import JSBI from "jsbi";

let digit2num = b => {
  let digit = b.toLowerCase();
  if (b > "9") {
    digit = 10 + b.charCodeAt(0) - "a".charCodeAt(0);
  }
  return digit;
};

let num2digit = x => {
  if (x <= 9) return x;
  else return String.fromCharCode("a".charCodeAt(0) + x - 10);
};

export function isValidNumber(str, radix) {
  // precondition: 2 <= radix <= 36
  let validDigits = `0-${Math.min(9, radix - 1)}`,
    valid = null;
  if (radix > 10) {
    let biggestCharCode = String.fromCharCode("a".charCodeAt(0) + radix - 11);
    let validChars = `a-${biggestCharCode}`;
    valid = new RegExp(
      `^-?[${validDigits}${validChars}]*\\.?[${validDigits}${validChars}]+$`,
      "ig"
    );
  } else {
    valid = new RegExp(`^-?[${validDigits}]*\\.?[${validDigits}]+$`, "ig");
  }
  return valid.test(str);
}

export function convert2all(valueString, fromRadix, precision) {
  let [integralPart, fractionPart] = valueString.split(".");

  let integrals = convertIntegral(integralPart, fromRadix);
  let fractions = convertFraction(fractionPart, fromRadix, precision);
  let numbers = Array(37)
    .fill(null)
    .map((_, index) => {
      if (index === 0 || index === 1) return "NaN";
      else {
        if (fractions) return integrals[index] + "." + fractions[index];
        else return integrals[index];
      }
    });

  return numbers;
}

export function convertIntegral(valueString, fromRadix) {
  // precondition: valueString is a valid representation of the number in fromRadix
  let valueInDecimal = convert2decimal(valueString, fromRadix);

  let results = Array(37)
    .fill(null)
    .map((_, index) => {
      if (index === fromRadix) return valueString;
      else if (index === 0 || index === 1) return "NaN";
      else return valueInDecimal.toString(index);
    });

  return results;
}

export function convertFraction(valueString, fromRadix, precision) {
  if (!valueString) return null;

  let decimal = convertToDecimalFraction(valueString, fromRadix, precision);

  let results = Array(37)
    .fill(null)
    .map((_, index) => {
      if (index === fromRadix) return valueString;
      else if (index === 0 || index === 1) return "NaN";
      else return convertFromDecimalFraction(decimal, index, precision);
    });

  return results;
}

function convert2decimal(valueString, fromRadix) {
  // precondition: valueString is an integer
  if (fromRadix === 10) return JSBI.BigInt(valueString);
  let valueInDecimal = JSBI.BigInt(0),
    negative = false;
  [...valueString].forEach((c, index) => {
    if (c === "-") {
      negative = !negative;
      return;
    }
    let digit = digit2num(c);
    let x = JSBI.multiply(
      JSBI.BigInt(digit),
      JSBI.exponentiate(
        JSBI.BigInt(fromRadix),
        JSBI.BigInt(valueString.length - index - 1)
      )
    );
    valueInDecimal = JSBI.add(valueInDecimal, x);
  });

  if (negative) valueInDecimal = JSBI.unaryMinus(valueInDecimal);

  return valueInDecimal;
}

function convertToDecimalFraction(valueString, fromRadix, precision) {
  // precondition: valueString is of form "xxxx" originated from a fractional 0.xxxx
  if (fromRadix === 10) return JSBI.BigInt(valueString);
  else {
    let next = JSBI.multiply(
        convert2decimal(valueString, fromRadix),
        JSBI.BigInt(10)
      ),
      toDivide = JSBI.exponentiate(
        JSBI.BigInt(fromRadix),
        JSBI.BigInt(valueString.length)
      );
    let result = JSBI.divide(next, toDivide).toString(),
      remainder = JSBI.remainder(next, toDivide).toString();

    while (/[^0]/g.test(remainder) && result.length < precision) {
      next = JSBI.multiply(JSBI.BigInt(remainder), JSBI.BigInt(10));
      result += JSBI.divide(next, toDivide).toString();
      remainder = JSBI.remainder(next, toDivide).toString();
    }

    return result;
  }
}

function convertFromDecimalFraction(valueString, toRadix, precison) {
  let result = "",
    radixInDecimal = JSBI.BigInt(digit2num(`${toRadix}`));
  let next = valueString;

  while (/[^0]/g.test(next) && result.length < precison) {
    let numDigits = next.length;
    let x = JSBI.multiply(JSBI.BigInt(next), radixInDecimal).toString();
    let current = x.slice(0, -numDigits);
    next = x.slice(-numDigits);
    result += num2digit(Number(current));
  }

  return result;
}
