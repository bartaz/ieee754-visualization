var dom = require( "./dom" );
var dynks = require( "./dynks" );

var exponentElement = dom.$("#exponent");
var exponentTwinElement = dom.$("#exponent-twin");
var significandElement = dom.$("#significand");
var valueElement = dom.$("#value");

// take value of significand and make it integer
var significand = Number(significandElement.innerHTML) * 10000;

function getCurrentValue() {
    return +exponentElement.innerHTML;
}

function updateValue( exponent ) {
    exponentElement.innerHTML = exponent;
    exponentTwinElement.innerHTML = exponent;

    // compute value based on significand and exponent
    // there is some trickery forced to avoid computation errors
    var pow = exponent - 4;
    var value;
    if (pow >= 0) {
        value = significand * Math.pow( 10, pow );
    } else {
        value = significand / Math.pow( 10, -pow );
    }

    // turn value into fixed precision string
    value = value.toFixed(15);

    // and cut all unnecessary zeros
    // unfortunately .toFixed makes some computation errors visible
    // so we need to not only cut zeros but any insignificand digits
    // that appear
    var lastDigit = value.indexOf( significand % 10 );
    var point = value.indexOf( "." );
    var cut = point > lastDigit ? point+2 : lastDigit + 1;

    valueElement.innerHTML = value.substr(0, cut);
}

dynks( exponentElement, getCurrentValue, updateValue );
