String.prototype.replaceAll = function replaceAll(oldCaract, newCaract) {
    return this.split(oldCaract).join(newCaract);
};

String.prototype.toXMLFormat = function toXMLFormat() {
    return this.replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
};

String.prototype.toNoneXMLFormat = function toXMLFormat() {
    return this.replaceAll('&amp;','&')
    .replaceAll('&lt;','<')
    .replaceAll('&gt;','>');
};