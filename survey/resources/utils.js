//
// Some utility functions
//

Utils = {};

Utils.encode_html = function(html) {
    return $('<div/>').text(html).html();
};