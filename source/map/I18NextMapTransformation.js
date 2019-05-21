import '../extension/StringExtension';
import ConversionItem from '../model/ConversionItem';

class I18NextMapTransformation {
    toBaseForm(input) {
        return new Promise((resolve) => {
            let files = input.file;
            let i18NextStrings = [];
            //First we map all the string in the individual files, then adding it to the same list. 
            for (const key in files) {
                if (files.hasOwnProperty(key)) {
                    const file = files[key];
                    i18NextStrings = i18NextStrings.concat(this.readI18NextStrings(file, key));
                }
            }
            //Then we group every items by is ID, this will match every item of every language.
            //And create a conversionItem it each group.
            let conversionItems = [];
            let groupedI18NextString = i18NextStrings.groupBy("id");
            let groupKeys = Object.keys(groupedI18NextString);
            for (const groupKey of groupKeys) {
                conversionItems.push(this.buildConversionItemOf(groupedI18NextString[groupKey]));
            }
            resolve(conversionItems);
        });
    }

    readI18NextStrings(file, langKey) {
        let i18NextConversionItems = [];
        let translations = JSON.parse(file).translation;
        for (const section in translations) {
            if (translations.hasOwnProperty(section)) {
                const group = translations[section];
                for (const item in group) {
                    if (group.hasOwnProperty(item)) {
                        let i18NextConversionItem = {};
                        i18NextConversionItem['id'] = item.removeAll('_plural');
                        i18NextConversionItem['key'] = langKey;
                        i18NextConversionItem['value'] = group[item];
                        i18NextConversionItem['quantity'] = item.includes('_plural') ? 'plural' : 'one';
                        i18NextConversionItems.push(i18NextConversionItem);
                    }
                }
            }
        }
        return i18NextConversionItems;
    }

    buildConversionItemOf(i18NextString) {
        //First we group by quantity.
        let groupedByQuantity = i18NextString.groupBy("quantity");
        //Then for each quantity we build a conversionItem
        let conversionItems = {};
        for (const key in groupedByQuantity) {
            if (groupedByQuantity.hasOwnProperty(key)) {
                const group = groupedByQuantity[key];

                let conversionItem = new ConversionItem();
                conversionItem.addId("String_Id", group[0].id);
                for (const lang of group) {
                    conversionItem.addValue(lang.key, this.formatForBaseForm(lang.value));
                }
                conversionItem.addMeta("Section_name", group[0].section);
                conversionItems[key] = conversionItem;
            }
        }

        //Then we handle the relation between all the quantity
        let result = conversionItems["one"];
        for (const key in conversionItems) {
            if (conversionItems.hasOwnProperty(key)) {
                const relation = conversionItems[key];
                if (key == "plural") {
                    result.addRelation("plural", relation);
                }
            }
        }

        return result;
    }

    formatForBaseForm(unformatted) {
        let regex = /{{(text|decimal|number)[0-9]+(, [0-9])?(\.[0-9]+)?}}/g;
        let matchs = unformatted.match(regex);
        if (matchs) {
            matchs.forEach(foundPattern => {
                switch (foundPattern.charAt(2)) {
                    case 't':
                        unformatted = unformatted.replace(foundPattern, '{{text}}');
                        break;
                    case 'n':
                        unformatted = unformatted.replace(foundPattern, '{{number}}');
                        break;
                    case 'd':
                        if(foundPattern.includes(',')){
                            var decimal = foundPattern.split(',')[1].split('.')[1];
                            unformatted = unformatted.replace(foundPattern, `{{float:${decimal}}}`);
                        } else {
                            unformatted = unformatted.replace(foundPattern, '{{float}}');
                        }
                        break;
                }
            });
        }
        return unformatted;
    }

    fromBaseForm(input) {
        let availableLang = this.findLanguages(input);
        let groupedItems = input.groupBy("_meta.Section_name");
        var result = {};

        for (let langIndex = 0; langIndex < availableLang.length; langIndex++) {
            const lang = availableLang[langIndex];
            result[lang] = this.printForLang(groupedItems, lang)
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

    printForLang(items, lang) {
        let result = {};
        for (const key in items) {
            if (items.hasOwnProperty(key)) {
                const group = items[key];
                result[key] = this.printGroup(group, lang);
            }
        }
        return JSON.stringify(result);
    }

    printGroup(group, lang) {
        let resultGroup = {};
        for (const item of group) {
            let id = this.getIdOfConversionItem(item);
            if (!item.relation) {
                resultGroup[id] = this.toI18NextString(item.values[lang]);
            } else {
                resultGroup[id] = this.toI18NextString(item.values[lang]);
                //TODO only work for plural, handle other relation
                resultGroup[id + "_plural"] = this.toI18NextString(item.relation.plural.values[lang]);

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

    toI18NextString(unformatted) {
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
export default I18NextMapTransformation;