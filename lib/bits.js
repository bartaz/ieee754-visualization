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

var pointSlider = dom.$("#point-slider");
var pointSliderLabel = dom.$("#point-slider-label");

function getInputNumberValue() {
    return Number( numberInput.value.replace(/\u2212/g, "-") );
}

function setNumberInputValue( value ) {
    value = Number( value );
    if (value === 0 && (1/value < 0)) {
        // special case to detect and show negative zero
        value = "-0";
    } else {
        value = Number.prototype.toString.call(value);
    }

    value = value.replace(/-/g, "\u2212"); //pretty minus

    if (value !== numberInput.value) {
        numberInput.value = value;
    }
    updateVisualizatoin();
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


function updateBinary( parsed ) {
    var isExpandedMode = visualization.classList.contains("expanded");

    updateBitElementClasses( bitsSign, parsed.bSign );
    updateBitElementClasses( bitsExponent, parsed.bExponent, isExpandedMode ? "0" : parsed.bSign );
    updateBitElementClasses( bitsHidden, parsed.bHidden );
    updateBitElementClasses( bitsSignificand, parsed.bSignificand, isExpandedMode ? parsed.bHidden : parsed.bExponent );

    pointSliderLabel.style.left = (parsed.exponentNormalized - 1) * 15 + "px";

    if (parsed.exponent !== Number(pointSlider.value)) {
        pointSlider.value = parsed.exponent;
    }
}


function classNamesToBinaryString( binaryString, bitSpan ) {
    binaryString += bitSpan.classList.contains("zero") ? "0" : "1";
    return binaryString;
}

function updateNumber( values ) {
    var b = "";

    var exponent, significand;
    if (values) {
        exponent = values.exponent;
        significand = values.significand;
    }

    if (typeof exponent == "number") {
        exponent = ieee754.intToBinaryString( exponent, 11 );
    } else {
        exponent = bitsExponent.reduce( classNamesToBinaryString, "" );
    }

    if (typeof significand != "string") {
        significand = bitsSignificand.reduce( classNamesToBinaryString, "" );
    }

    b += bitsSign.reduce( classNamesToBinaryString, "" );
    b += exponent;
    b += significand;

    var f = ieee754.binaryStringToFloat64( b );
    setNumberInputValue( f );
}


function generatePowersHtml( b, startPower, classPrefix, useOne ) {
    if (typeof startPower != "number") {
        startPower = b.length - 1;
    }

    classPrefix = classPrefix || "exponent-bit-";

    var htmlPowers = "";
    var htmlComputed = "";
    var htmlFractions = "";
    var htmlFractionsComputed = "";

    var allZeros = true;
    for (var i = 0, l = b.length; i < l; i++) {
        if (b[i] == "1") {
            allZeros = false;
            var p = startPower - i;
            var j = b.length - 1 -i;
            if (htmlPowers.length > 0) {
                htmlPowers += "<span class='mo'> + </span>";
                htmlComputed += "<span class='mo'> + </span>";
                htmlFractions += "<span class='mo'> + </span>";
                htmlFractionsComputed += "<span class='mo'> + </span>";
            }

            var powerHtml = '<span class="msup '+ (classPrefix + j) +'"><span class="mn">2</span><span class="mn">'+ p +'</span></span>';

            if (useOne && p == 0) {
                powerHtml = '<span class="mn '+ (classPrefix + j) +'">1</span>';
            }
            htmlPowers += powerHtml;
            htmlComputed += '<span class="mn '+ (classPrefix + j) +'">' + Math.pow(2,p)+ '</span>';

            if (p >= 0) {
                htmlFractions += powerHtml;
                htmlFractionsComputed += '<span class="mn '+ (classPrefix + j) +'">' + Math.pow(2,p)+ '</span>';
            } else {
                htmlFractions += '<span class="mfrac '+ (classPrefix + j) +'"><span class="mn">1</span><span class="msup"><span class="mn">2</span><span class="mn">' + -p + '</span></span></span>';
                htmlFractionsComputed += '<span class="mfrac '+ (classPrefix + j) +'"><span class="mn">1</span><span class="mn">'+ Math.pow(2,-p) +'</span></span>';
            }
        }
    }

    if (allZeros) {
        htmlPowers = htmlComputed = htmlFractions = htmlFractionsComputed = '<span class="mn">0</span>';
    }

    htmlFractionsComputed = htmlFractionsComputed.replace(/Infinity/g, "&infin;");

    return {
        powers: htmlPowers,
        computed: htmlComputed,
        fractions: htmlFractions,
        fractionsComputed: htmlFractionsComputed
    };
}

function updateMath( representation ) {
    // enrich representation with powers HTML

    var htmlExponent = generatePowersHtml( representation.bExponent );

    representation.exponentPowers = htmlExponent.powers;
    representation.exponentPowersComputed = htmlExponent.computed;

    var significandBits = representation.bHidden + representation.bSignificand;

    representation.exponentZero = representation.exponent;
    representation.exponentNormalizedZero = representation.exponentNormalized;


    // [...] subnormal numbers are encoded with a biased exponent of 0,
    // but are interpreted with the value of the smallest allowed exponent,
    // which is one greater (i.e., as if it were encoded as a 1).
    //
    // -- http://en.wikipedia.org/wiki/Denormal_number

    if (representation.exponentNormalizedZero == -1023) {

        representation.exponentZero = representation.exponent + 1;
        representation.exponentNormalizedZero = representation.exponentNormalized + 1;
    }

    var htmlSignificand = generatePowersHtml( significandBits, representation.exponentNormalizedZero, "significand-bit-" );
    var htmlSignificandNormalized = generatePowersHtml( significandBits, 0, "significand-bit-" );
    var htmlSignificandNormalizedOne = generatePowersHtml( significandBits, 0, "significand-bit-", true );

    representation.significandPowersNormalized = htmlSignificandNormalized.powers;
    representation.significandPowersNormalizedOne = htmlSignificandNormalizedOne.powers;

    var equation = dom.$(".full-equation");

    if (isNaN(representation.value)) {
        representation.significandPowers = representation.significandPowersFractions
        = representation.significandPowersFractionsComputed = representation.significandPowersComputed
        = '<span class="mn significand-bit-any">NaN</span>';
    } else {
        representation.significandPowers = htmlSignificand.powers;
        representation.significandPowersFractions = htmlSignificand.fractions;
        representation.significandPowersFractionsComputed = htmlSignificand.fractionsComputed;
        representation.significandPowersComputed = htmlSignificand.computed;
    }

    if (representation.sign < 0)
        representation.signHtml = String(representation.sign).replace("-", "&minus;");
    else
        representation.signHtml = "+" + representation.sign;

    representation.absValue = Math.abs( representation.value );
    var dynamic = dom.$$(".math [data-ieee754-value]");

    dynamic.forEach( function(element){
        element.innerHTML = representation[ element.dataset.ieee754Value ];
    });

    if (isNaN(representation.value) || !isFinite(representation.value)) {
        equation.classList.add("collapsed");
    } else {
        equation.classList.remove("collapsed");
    }
}

function updateVisualizatoin() {
    var number = getInputNumberValue();
    var representation = ieee754.toIEEE754Parsed( number );

    updateBinary( representation );
    updateMath( representation );
}


// EVENT HANDLERS

numberInput.addEventListener( "change", function() {
    setNumberInputValue( getInputNumberValue() );
}, false);


numberInput.addEventListener("keydown", function ( event ) {
    var diff = 0;
    if ( event.keyCode === 38 || event.keyCode === 40 ) {

            if ( event.keyCode === 38 ) diff = +1;
            else diff = -1;

            if ( event.shiftKey ) {
                diff *= 10;
                if ( event.altKey ) {
                    diff *= 10;
                }
            } else if ( event.altKey ) {
                diff /= 10;
            }

            setNumberInputValue( diff + getInputNumberValue() );

        event.preventDefault();
    }
}, false);


pointSlider.addEventListener( "change", function() {
    var exponent = Number(pointSlider.value);
    updateNumber( { exponent: exponent } );
}, false);

pointSlider.addEventListener( "click", function() {
    pointSlider.focus();
}, false);

document.body.addEventListener( "click", function( event ){
    var target = event.target;

    if (target.classList.contains("zero") || target.classList.contains("one")) {
        target.classList.toggle("zero");
        target.classList.toggle("one");

        updateNumber();
        updateVisualizatoin();

        hoverRelatedExponentHandler( event );
        hoverRelatedSignificandHandler( event );
        hoverRelatedSignHandler( event );
    }

}, false);


// toggle hover class on parts of equation related to hovered bit
function createHoverRelatedHandler( selector, classPrefix ) {
    return function (event) {
        var target = event.target;
        if (dom.matchesSelector( target, selector )) {

            var siblings = dom.arrayify(target.parentNode.children).filter(classNameFilter("bit"));
            var n = siblings.length - siblings.indexOf( target ) - 1;

            var related = dom.$$((classPrefix+n)+","+(classPrefix+"any"));
            related.forEach( function(r){
                r.classList[ event.type == "mouseout" ? "remove" : "add"]("hover");
            });
        }
    };
}

var hoverRelatedExponentHandler = createHoverRelatedHandler( ".bit.exponent", ".exponent-bit-");
document.body.addEventListener( "mouseover", hoverRelatedExponentHandler, false );
document.body.addEventListener( "mouseout", hoverRelatedExponentHandler, false );

var hoverRelatedSignificandHandler = createHoverRelatedHandler( ".bit.significand, .bit.hidden", ".significand-bit-");
document.body.addEventListener( "mouseover", hoverRelatedSignificandHandler, false );
document.body.addEventListener( "mouseout", hoverRelatedSignificandHandler, false );

var hoverRelatedSignHandler = createHoverRelatedHandler( ".bit.sign", ".sign-bit-");
document.body.addEventListener( "mouseover", hoverRelatedSignHandler, false );
document.body.addEventListener( "mouseout", hoverRelatedSignHandler, false );


// toggle nowrap class on a equation row when equals sign is clicked

document.body.addEventListener( "click", function( event ){
    var target = event.target;

    if (dom.matchesSelector(target, ".mrow > .mo")) {
        target.parentNode.classList.toggle("nowrap");
    }

}, false);


// make exponent value editable

var dynks = require( "./dynks" );

var exponentElement = dom.$("#exponent-dynks");
var exponentNormalizedElement = dom.$("#exponent-normalized-dynks");

function getCurrentExponentValue() {
    return +exponentElement.innerHTML;
}

function updateExponentValue( value ) {
    var exponent = Number(value);
    updateNumber( { exponent: exponent } );
}
dynks( exponentElement, getCurrentExponentValue, updateExponentValue );

function getCurrentExponentNormalizedValue() {
    return +exponentNormalizedElement.innerHTML;
}

function updateExponentNormalizedValue( value ) {
    var exponent = Number(value);
    updateNumber( { exponent: exponent + 1023 } );
}
dynks( exponentNormalizedElement, getCurrentExponentNormalizedValue, updateExponentNormalizedValue );


dom.$(".toggle-details-button").addEventListener("click", function(){
    visualization.classList.toggle("expanded");
}, false);

// GO!

updateVisualizatoin();
