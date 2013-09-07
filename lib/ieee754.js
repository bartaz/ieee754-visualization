
// float64ToOctets( 123.456 ) -> [ 64, 94, 221, 47, 26, 159, 190, 119 ]
function float64ToOctets(number) {
    var buffer = new ArrayBuffer(8);
    new DataView(buffer).setFloat64(0, number, false);
    return [].slice.call( new Uint8Array(buffer) );
}

// octetsToFloat64( [ 64, 94, 221, 47, 26, 159, 190, 119 ] ) -> 123.456
function octetsToFloat64( octets ) {
    var buffer = new ArrayBuffer(8);
    new Uint8Array( buffer ).set( octets );
    return new DataView( buffer ).getFloat64(0, false);
}

// intToBinaryString( 8 ) -> "00001000"
function intToBinaryString( i, length ) {
    length = length || 8;
    for(i = i.toString(2); i.length < length; i="0"+i);
    return i;
}

// binaryStringToInt( "00001000" ) -> 8
function binaryStringToInt( b ) {
    return parseInt(b, 2);
}

function octetsToBinaryString( octets ) {
    return octets.map( function(i){ return intToBinaryString(i); } ).join("");
}

function float64ToBinaryString( number ) {
    return octetsToBinaryString( float64ToOctets( number ) );
}

function binaryStringToFloat64( string ) {
    return octetsToFloat64( string.match(/.{8}/g).map( binaryStringToInt ) );
}

function toIEEE754Parsed(v) {
    var string = octetsToBinaryString( float64ToOctets(v) );
    var parts = string.match(/^(.)(.{11})(.{52})$/); // sign{1} exponent{11} fraction{52}

    var bSign = parts[1];
    var sign = Math.pow( -1, parseInt(bSign,2) );

    var bExponent = parts[2];
    var exponent = parseInt( bExponent, 2 );

    var exponentNormalized = exponent - 1023;
    var bSignificand = parts[3];

    var bHidden = (exponent === 0) ? "0" : "1";

    return {
        value: v,
        bFull: bSign + bExponent + bHidden + bSignificand,
        bSign: bSign,
        bExponent: bExponent,
        bHidden: bHidden,
        bSignificand: bSignificand,
        sign: sign,
        exponent: exponent,
        exponentNormalized: exponentNormalized,
    };
}

module.exports = {
    float64ToOctets: float64ToOctets,
    octetsToFloat64: octetsToFloat64,
    intToBinaryString: intToBinaryString,
    binaryStringToInt: binaryStringToInt,
    octetsToBinaryString: octetsToBinaryString,
    float64ToBinaryString: float64ToBinaryString,
    binaryStringToFloat64: binaryStringToFloat64,
    toIEEE754Parsed: toIEEE754Parsed
};