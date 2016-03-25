/**
 * @param node
 * @param tags
 * @returns {boolean}
 * @deprecated
 */
function isElement(node,tags){
    for(var i = 0;i<tags.length;i++){
        if(node.is(tags[i])) return true;
    }
}

String.prototype.getAllOccurrences = function(char){
    var regex = new RegExp(char,"gi"), result, indices = [];
    while ( (result = regex.exec(this.toString())) ) {
        indices.push(result.index);
    }
    return indices;
};
!(function ($, undefined) {
    /// adapted http://jsfiddle.net/drzaus/Hgjfh/5/

    var get_selector = function (element) {
        var pieces = [];

        for (; element && element.tagName !== undefined; element = element.parentNode) {
            if (element.className) {
                var classes = element.className.split(' ');
                for (var i in classes) {
                    if (classes.hasOwnProperty(i) && classes[i]) {
                        pieces.unshift(classes[i]);
                        pieces.unshift('.');
                    }
                }
            }
            if (element.id && !/\s/.test(element.id)) {
                pieces.unshift(element.id);
                pieces.unshift('#');
            }
            pieces.unshift(element.tagName);
            pieces.unshift(' > ');
        }

        return pieces.slice(1).join('');
    };

    $.fn.getSelector = function (only_one) {
        if (true === only_one) {
            return get_selector(this[0]);
        } else {
            return $.map(this, function (el) {
                return get_selector(el);
            });
        }
    };

})(window.jQuery);