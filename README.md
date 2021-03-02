# Radix Converter

This small tool is built using [React](https://github.com/facebook/create-react-app/) and [bignumber.js](https://github.com/MikeMcl/bignumber.js/). It converts any numbers (integers and fractions) in radix 2 to 36 with arbitrary precision. Intuitively we have "a" mapped to decimal "10", "b" mapped to decimal "11", and all the way down "z" mapped to decimal "35". What makes this project cool is that we are not only handling `Number` type inputs that are limited to 64 bits, but also allowing arbitrarily big numbers including fractions.

_[JSBI](https://github.com/GoogleChromeLabs/jsbi) is used to ensure cross browser compatibility._
