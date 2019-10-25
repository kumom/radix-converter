# Radix Converter

This small tool is built using [React](https://github.com/facebook/create-react-app/). It converts numbers (integers and fractions) in radix 2 to 36 with arbitrary precision. This choice matches the specs of Javascript's `numObj.toString([radix])` and `parseInt(string, radix)`. Intuitively we have "a" mapped to decimal "10", "b" mapped to decimal "11", and all the way down "z" mapped to decimal "35". What makes this project cool is that we are not only handling `Number` type inputs that are limited to 64 bits, but also allowing arbitrarily big numbers including fractions.

The algorithm is in the `src/algo.js` file. It's a straightforward algorithm if you use a specific number as an example and start from the function `convert2all` (keyword: **Base-q expansion**). Results are recomputed for all radixes every time the user changes the precision or the value in any radix. We can also put current results in a buffer and only recompute the added / deleted digits. I imagine there would be many ways to implement it, but all seem a bit messy to me. That's way I decided to let it be for now.

_[JSBI](https://github.com/GoogleChromeLabs/jsbi) is used to ensure cross browser compatibility._

## To Do

- [x] Testing the algorithm
- [x] Prevent numbers from overflowing
- [x] Some buggy behaviors for saving/storing caret
- [x] Display other radixes
- [x] Allow to set precision

If you have ideas to improve this project in any way, feel free to fork it😊

## References

- [Big integer benchmarks](https://peterolson.github.io/BigInteger.js/benchmark/)
- [The simple math behind decimal-binary conversion algorithms](https://indepth.dev/the-simple-math-behind-decimal-binary-conversion-algorithms/)
- [Exploring Binary](https://www.exploringbinary.com/)
