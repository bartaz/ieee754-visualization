var ieee754 = require("./ieee754");
var dom = require("./dom");

var visualization = dom.$(".visualization-bits");
var numberInput = dom.$("#number-input");


function classNameFilter( className ){
    return function( bit ){ return bit.classList.contains(className); };
}

var bits = dom.$$(".bit", visualization);
var bitsSign = bits.filter( classNameFilter("sign") );
var bitsExponent = bits.filter( classNameFilter("exponent") );
var bitsHidden = bits.filter( classNameFilter("hidden") );
var bitsSignificand = bits.filter( classNameFilter("significand") );


function getInputNumberValue() {
    return Number( numberInput.value.replace("\u2212", "-") );
}

function setNumberInputValue( value ) {
    value = Number( value );
    if (value === 0 && (1/value < 0)) {
        // special case to detect and show negative zero
        value = "-0";
    } else {
        value = Number.prototype.toString.call(value);
    }

    value = value.replace("-", "\u2212"); //pretty minus

    if (value !== numberInput.value) {
        numberInput.value = value;
    }
    updateBinary();
}


function updateBitElementClasses( bitElements, bits, prevBit ) {
    prevBit = typeof prevBit == "string" ? prevBit.slice(-1) : "0";
    for (var i = 0; i < bits.length; i++) {
        var bitElement = bitElements[ i ];
        bitElement.classList.remove("one");
        bitElement.classList.remove("zero");
        bitElement.classList.remove("prev-one");
        bitElement.classList.remove("prev-zero");

        bitElement.classList.add(bits[i] == "1" ? "one" : "zero");
        if (i === 0) {
            bitElement.classList.add(prevBit == "1" ? "prev-one" : "prev-zero");
        }
    }
}

function updateBinary() {
    var number = getInputNumberValue();
    var result = ieee754.toIEEE754Parsed( number );

    var isExpandedMode = visualization.classList.contains("expanded");

    updateBitElementClasses( bitsSign, result.bSign );
    updateBitElementClasses( bitsExponent, result.bExponent, isExpandedMode ? "0" : result.bSign );
    updateBitElementClasses( bitsHidden, result.bHidden );
    updateBitElementClasses( bitsSignificand, result.bSignificand, isExpandedMode ? result.bHidden : result.bExponent );
}


function classNamesToBinaryString( binaryString, bitSpan ) {
    binaryString += bitSpan.classList.contains("zero") ? "0" : "1";
    return binaryString;
}

function updateNumber( exponent ) {
    var b = "";

    b += bitsSign.reduce( classNamesToBinaryString, "" );
    b += exponent || bitsExponent.reduce( classNamesToBinaryString, "" );
    b += bitsSignificand.reduce( classNamesToBinaryString, "" );

    var f = ieee754.binaryStringToFloat64( b );
    setNumberInputValue( f );
}

updateBinary();

numberInput.addEventListener( "change", function() {
    setNumberInputValue( getInputNumberValue() );
}, false);

numberInput.addEventListener("keydown", function ( event ) {
    var diff = 0;
    if ( event.keyCode === 38 || event.keyCode === 40 ) {

            if ( event.keyCode === 38 ) diff = +1;
            else diff = -1;

            if ( event.shiftKey ) diff *= 10;
            if ( event.altKey ) diff /= 10;

            setNumberInputValue( diff + getInputNumberValue() );

        event.preventDefault();
    }
}, false);


document.body.addEventListener( "click", function( event ){
    var target = event.target;

    if (target.classList.contains("zero") || target.classList.contains("one")) {
        target.classList.toggle("zero");
        target.classList.toggle("one");

        updateNumber();
        updateBinary();
    }

}, false);

