import JSBI from "jsbi";

export function isValidNumber(str, radix) {
  // precondition: 2 <= radix <= 36
  let validDigits = `0-${Math.min(9, radix - 1)}`,
    valid = null;
  if (radix > 10) {
    let biggestCharCode = String.fromCharCode("a".charCodeAt(0) + radix - 11);
    let validChars = `a-${biggestCharCode}`;
    valid = new RegExp(
      `^-?[${validDigits}${validChars}]+\\.?[${validDigits}${validChars}]*$`,
      "ig"
    );
  } else {
    valid = new RegExp(`^-?[${validDigits}]+\\.?[${validDigits}]*$`, "ig");
  }
  return valid.test(str);
}

// input: [0-9A-Za-z]
// output: 0-35
let digit2num = d => {
  if (d > "9") {
    d = d.toLowerCase();
    return 10 + d.charCodeAt(0) - "a".charCodeAt(0);
  } else {
    return Number(d);
  }
};

// input: 0-35
// output: [0-9a-z]
let num2digit = x => {
  if (x <= 9) return `${x}`;
  else return String.fromCharCode("a".charCodeAt(0) + x - 10);
};

// input: string representation of an integer in radix, where 2<=radix<=36
// output: BigInt of the input in decimal
function convert2decimal(valueString, fromRadix) {
  if (fromRadix === 10) return JSBI.BigInt(valueString);

  let result = JSBI.BigInt(0),
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
    result = JSBI.add(result, x);
  });

  return negative ? JSBI.unaryMinus(result) : result;
}

export function convert2all(valueString, fromRadix, precision) {
  let [integralPart, fractionPart] = valueString.split(".");

  let integrals = convertIntegral(integralPart, fromRadix);
  let fractions = fractionPart
    ? convertFraction(fractionPart, fromRadix, precision)
    : null;
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

function convertIntegral(valueString, fromRadix) {
  // precondition: valueString is a valid representation of the number in fromRadix
  let valueInDecimal = convert2decimal(valueString, fromRadix);

  let results = Array(37).fill(null);

  [...results.keys()].forEach(radix => {
    if (radix === fromRadix) {
      console.log("here");
      results[radix] = valueString;
    } else if (radix === 0 || radix === 1) results[radix] = "NaN";
    else results[radix] = valueInDecimal.toString(radix);
  });

  return results;
}

function convertFraction(valueString, fromRadix, precision = 5) {
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

// input: valueString is of form "xxxx" originated from a fractional 0.xxxx
// output: string representation of input in decimal, with "0." stripped off
function convertToDecimalFraction(valueString, fromRadix, precision) {
  if (fromRadix === 10) return JSBI.BigInt(valueString);
  else {
    let dividend = JSBI.multiply(
        convert2decimal(valueString, fromRadix),
        JSBI.BigInt(10)
      ),
      divisor = JSBI.exponentiate(
        JSBI.BigInt(fromRadix),
        JSBI.BigInt(valueString.length)
      );
    let result = JSBI.divide(dividend, divisor).toString(),
      remainder = JSBI.remainder(dividend, divisor);

    while (/[^0]/g.test(remainder.toString()) && result.length < precision) {
      dividend = JSBI.multiply(remainder, JSBI.BigInt(10));
      result += JSBI.divide(dividend, divisor).toString();
      remainder = JSBI.remainder(dividend, divisor);
    }

    return result;
  }
}

function convertFromDecimalFraction(valueString, toRadix, precison) {
  let result = "";
  let multiplier = JSBI.BigInt(digit2num(`${toRadix}`)),
    multiplicand = JSBI.BigInt(valueString);

  while (/[^0]/g.test(multiplicand) && result.length < precison) {
    let offset = multiplicand.toString().length;
    let x = JSBI.multiply(multiplicand, multiplier).toString();
    let nextDigit = x.slice(0, x.length - offset);
    result += num2digit(Number(nextDigit));
    multiplicand = JSBI.BigInt(x.slice(x.length - offset));
  }

  return result;
}
