String.prototype.removeAll = function removeAll(toRemove) {
    return this.replaceAll(toRemove, '');
}

String.prototype.replaceAll = function replaceAll(oldCaract, newCaract) {
    return this.split(oldCaract).join(newCaract);
};

String.prototype.toXMLFormat = function toXMLFormat() {
    return this.replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
};

String.prototype.toNoneXMLFormat = function toXMLFormat() {
    return this.replaceAll('&amp;', '&')
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>');
};

String.prototype.camelize = function () {
    var words = this.split(separator.toLowerCase());

    // Concatenate all capitalized words to get camelized string
    var result = "";
    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        var capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
        result += capitalizedWord;
    }

    return result;
}