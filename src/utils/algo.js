import JSBI from "jsbi";

export function isValidNumber(str, radix) {
  // precondition: 2 <= radix <= 36

  let validChars = `0-${Math.min(9, radix - 1)}`;
  if (radix > 10) {
    validChars += `a-${String.fromCharCode("a".charCodeAt(0) + radix - 11)}`;
  }

  let valid = new RegExp(
    `^-?[${validChars}]+\\.?[${validChars}]*$|^-?\\.[${validChars}]+$|^$`,
    "ig"
  );

  return valid.test(str);
}

/*** Conversion Algorithm ***/
/* All functions named `^convert\w+` except "convert2all" 
   accept input matching [1-9a-z]+. Negative numbers and fractions are 
   in the end handled by "convert2all" */

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

function convert2decimal(valueString, fromRadix) {
  if (fromRadix === 10) return JSBI.BigInt(valueString);

  let result = JSBI.BigInt(0);
  [...valueString].forEach((c, index) => {
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

  return result;
}

function convertIntegral(valueString, fromRadix) {
  let valueInDecimal = convert2decimal(valueString, fromRadix);

  let results = Array(37).fill(null);

  [...results.keys()].forEach(radix => {
    if (radix === fromRadix) {
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

export function convert2all(valueString, fromRadix, precision) {
  let negative = valueString[0] === "-";
  valueString = negative ? valueString.slice(1) : valueString;

  let [integralPart, fractionPart] = valueString.split(".");

  let integrals = convertIntegral(integralPart, fromRadix);
  let fractions =
    fractionPart && Number(fractionPart) !== 0
      ? convertFraction(fractionPart, fromRadix, precision)
      : null;

  let sign = negative ? "-" : "";
  let numbers = Array(37)
    .fill(null)
    .map((_, radix) => {
      if (radix === 0 || radix === 1) return "NaN";
      else {
        if (radix === fromRadix) return valueString; // do not aggressively modify the value while the user is still typing
        if (fractions) return sign + integrals[radix] + "." + fractions[radix];
        else return sign + integrals[radix];
      }
    });

  return numbers;
}
