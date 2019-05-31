String.prototype.removeAll = function removeAll(toRemove) {
    return this.replaceAll(toRemove, '');
}

String.prototype.replaceAll = function replaceAll(oldCaract, newCaract) {
    return this.split(oldCaract).join(newCaract);
};

String.prototype.regexRemoveAll = function regexRemoveAll(regex){
    return this.regexReplaceAll(regex,'');
}

String.prototype.regexReplaceAll = function regexReplaceAll(regex, newCaract){
    let formattedString = this;
    let matchs = formattedString.match(regex);   
    if(!matchs) {
        return formattedString;
    }
    for (const x of matchs) {
        formattedString = formattedString.replace(x,newCaract);
    }
    return formattedString;
}

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
    var words = this.split("_");

    // Concatenate all capitalized words to get camelized string
    var result = "";
    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        var capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
        result += capitalizedWord;
    }

    return result;
}