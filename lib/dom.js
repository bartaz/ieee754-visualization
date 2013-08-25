// `arraify` takes an array-like object and turns it into real Array
// to make all the Array.prototype goodness available.
var arrayify = function ( a ) {
    return [].slice.call( a );
};

// `$` returns first element for given CSS `selector` in the `context` of
// the given element or whole document.
var $ = function ( selector, context ) {
    context = context || document;
    return context.querySelector(selector);
};

// `$$` return an array of elements for given CSS `selector` in the `context` of
// the given element or whole document.
var $$ = function ( selector, context ) {
    context = context || document;
    return arrayify( context.querySelectorAll(selector) );
};

exports.$ = $;
exports.$$ = $$;
