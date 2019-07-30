import '../extension/StringExtension';

class UniversalToI18Next {

    convert(input) {
        let availableLang = this.findLanguages(input);
        let groupedItems = input.groupBy("_meta.Section");        
        let orderedKeys = Object.keys(groupedItems).sort();
        var result = {};

        for (let langIndex = 0; langIndex < availableLang.length; langIndex++) {
            const lang = availableLang[langIndex];
            result[lang] = this.printForLang(groupedItems, orderedKeys, lang)
        }
        return result;
    }

    findLanguages(items) {
        let lang = [];
        items.map((x) => {
            lang = lang.concat(Object.keys(x.values))
        })
        return lang.distinct();
    }

    printForLang(items, orderedKeys, lang) {
        let result = {"translation":{}};

        for (const key of orderedKeys) {
                result.translation[key] = this.printGroup(items[key], lang);
            
        }
        return JSON.stringify(result);
    }

    printGroup(group, lang) {
        let resultGroup = {};
        for (const item of group) {
            let id = this.getIdOfConversionItem(item);
            if (!item.relation) {
                resultGroup[id] = this.formatValue(item.values[lang]);
            } else {
                resultGroup[id] = this.formatValue(item.values[lang]);
                //TODO only work for plural, handle other relation
                resultGroup[id + "_plural"] = this.formatValue(item.getRelation("plural").values[lang]);

            }
        }
        return resultGroup;
    }

    getIdOfConversionItem(conversionItem) {
        let id = conversionItem.ids["Web"];
        if (!id) {
            id = conversionItem.ids["string"];
        }

        if (!id) {
            //TODO put error handeling
            id = "";
        }

        return id.camelize();
    }

    formatValue(unformatted) {
        var floatFormattedString = this.i18nextFloatTextFormat(unformatted);
        var stringFormatted = this.i18nextTextFormat(floatFormattedString);
        return stringFormatted;
    }

    i18nextTextFormat(unformattedString) {
        var count = 0;
        var res = unformattedString;

        // Replace {{text}} with named variable. Ex: {{text0}}
        while (res.indexOf('{{text}}') > -1) {
            res = res.replace('{{text}}', `{{text${count}}}`);
            count++;
        }

        count = 0;

        // Replace {{number}} with named variable. Ex: {{number0}}
        while (res.indexOf('{{number}}') > -1) {
            res = res.replace('{{number}}', `{{number${count}}}`);
            count++;
        }

        return res;
    }

    i18nextFloatTextFormat(unformattedString) {
        var floatRegex = /{{float:?\d*}}/;
        var count = 0;
        var res = unformattedString;
        while (res.search(floatRegex) > -1) {
            var index = res.search(floatRegex);

            if (res[index + 7] === ':') {
                //Ressouce potentially has decimals
                var numberIndex = index + 8,
                    number = '';

                //Fetch whole decimal number
                while (res[numberIndex] !== '}') {
                    number += res[numberIndex];
                    numberIndex++;
                }

                //There were not any numbers after the ':', replace as {{float}}
                if (numberIndex === index + 8) {
                    res = res.replace('{{float:}}', `{{decimal${count}}}`);
                } else {
                    // Add format
                    var floatPrecision = parseInt(number);
                    var format = '0';
                    if (floatPrecision > 0) {
                        format += '.';
                        for (var point = 0; point < floatPrecision; point++) {
                            format += '0';
                        }
                    }
                    res = res.replace(`{{float:${number}}}`, `{{decimal${count}, ${format}}}`);
                }
            } else {
                // Resource has no decimals.
                res = res.replace('{{float}}', `{{decimal${count}}}`);
            }
            count++;
        }

        return res;
    }

}
export default UniversalToI18Next;