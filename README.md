# IEEE 754 Double Precision Floating Point Visualization

It's an interactive visualization of how double precision floating point representation works.

As presented during my [Everything you never wanted to know about JavaScript numbers](http://2013.jsconf.eu/speakers/bartek-szopka-everything-you-never-wanted-to-know-about-javascript-numbers-and-you-didnt-know-you-could-ask.html) talk at JSConf EU 2013.

Available at http://bartaz.github.io/ieee754-visualization/


## Disclaimer

The code is not perfect nor pretty ;)

I was playing around with different concepts to get the idea ready for JSConf. I hope to clean it up soon.


## Contributing

If you are a developer and want to help making it better, or a designer who wants to make it look prettier or
you know IEEE 754 and can see some error or a field for improvement - let me know by reporting an issue, sending
pull request or contact me at [@bartaz](http://twitter.com/bartaz) on Twitter.


## Acknowledgments and Resources

This tool wouldn't be possible without great work of others.


### Learning resources

Everything I know about numbers in IEEE 754 representation I've learnt from resources freely available on-line.

Nearly everything about JS numbers is described in details by Axel Rauschmayer in his [this series of articles about numbers](http://www.2ality.com/search/label/numbers), such as:

* [How numbers are encoded in JavaScript](http://www.2ality.com/2012/04/number-encoding.html)
* [NaN and Infinity in JavaScript](http://www.2ality.com/2012/02/nan-infinity.html)
* [Safe integers in JavaScript](http://www.2ality.com/2013/10/safe-integers.html)

There is of course a lot about this topic on Wikipedia. Like this [Double-precision floating-point format](http://en.wikipedia.org/wiki/Double-precision_floating-point_format) article, or description of the [IEEE 754-1985](http://en.wikipedia.org/wiki/IEEE_754-1985) standard.

You may also want to know what ECMAScript standard has to say about [Number type](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-ecmascript-language-types-number-type).

This is also not the first attempt to provide visualisation or conversion tools between numbers and their binary representation in IEEE 754 standard.

* [IEEE-754 Analysis](http://babbage.cs.qc.cuny.edu/IEEE-754/index.xhtml)
* [float.js](http://dherman.github.io/float.js/)


### Tools

Creating this visualization would be much harder without great tools such as:

* [webmake](https://github.com/medikoo/modules-webmake/) by Mariusz Nowak
* [CSS MathML fallback](http://lea.verou.me/2013/03/use-mathml-today-with-css-fallback/) by Lea Verou
* [Tangle](http://worrydream.com/Tangle/) by Bret Victor and his great work on [explorable explanations](http://worrydream.com/ExplorableExplanations/)


## License

Copyright 2013 Bartek Szopka.

Released under the MIT License.
