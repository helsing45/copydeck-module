
Array.prototype.distinct = function distinct() {
    let length = this.length,
        result = [],
        seen = new Set();
    outer:
        for (let index = 0; index < length; index++) {
            let value = this[index];
            if (seen.has(value)) continue outer;
            seen.add(value);
            result.push(value);
        }
    return result;
}

Array.prototype.groupBy = function groupBy(groupKey) {
    let groupedBySectionItems = {};
    for (const element of this) {
        let section = getKeyValue(groupKey,element);
        if(!(section in groupedBySectionItems)){
            groupedBySectionItems[section] = [];
        }
        groupedBySectionItems[section].push(element);
    }
    return groupedBySectionItems;
}

function getKeyValue(key, item) {
    let splittedKey = key.split('.');
    if (splittedKey.length == 1) {
        return item[splittedKey[0]] ? item[splittedKey[0]] : "";
    }
    let leftKey = splittedKey[0];
    let rightKey = key.replace(leftKey + '.', "");
    if (item.hasOwnProperty(leftKey)) {
        return getKeyValue(rightKey, item[leftKey]);
    }
    return "";
}