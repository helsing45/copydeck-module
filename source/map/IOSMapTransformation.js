import '../extension/ArrayExtension';
import '../extension/StringExtension';
import ConversionItem from '../model/ConversionItem';
class IOSMapTransformations {

    toBaseForm(input) {
        return new Promise((resolve) => {
            let files = input.file;
            let iosStrings = [];
            //We map all the string in the individual file, then adding it to the same list.
            for (const key in files) {
                if (files.hasOwnProperty(key)) {
                    const file = files[key];
                    iosStrings = iosStrings.concat(this.readStringFile(file,key));
                }
            }
            //Then we group every items by is ID, this will match every item of every language.
            //And create a conversionItem it each group.
            let conversionItems = [];
            let groupedIosString = iosStrings.groupBy("id");
            let groupKeys = Object.keys(groupedIosString);
            for (const groupKey of groupKeys) {
                conversionItems.push(this.buildConversionItemOf(groupedIosString[groupKey]));
            }
            resolve(conversionItems);
        });
    }

    readStringFile(file, langKey) {
        let lines = file.split('\n');
        let ignore = false;
        let currentSection = "";
        let strings = [];
        for (const line of lines) {
            // we ignore every next line until we find the closing
            if (line.trim() == "/*" || line.trim() == "*/") {
                ignore = line.trim() == "/*";
            }

            if (!ignore) {
                // Check if it's a comment with this parttern /* section name */
                if (line.match(/\/\*.+ \*\//g)) {
                    currentSection = line.removeAll('/*').removeAll('*/');
                // Check if it's a element with this pattern "key" = "value";
                } else if (line.match(/".*" ?= ?".*";/g)) {                    
                    let splitted = line.replaceAll('"="', '" = "').split('" = "');
                    //Format the key
                    let key = splitted[0];
                    key = key.substring(1, key.lenght);

                    //Format the value
                    let value = splitted[1];
                    value = value.substring(0, value.length - 2);

                    //Create the temp iosConversionItem
                    let iosConversionItem = {};
                    iosConversionItem['key'] = langKey;
                    iosConversionItem['section'] = currentSection;
                    iosConversionItem['value'] = value;
                    if (key.toLowerCase().includes('_singular')) {
                        iosConversionItem['id'] = key.removeAll('_singular');
                        iosConversionItem['quantity'] = 'one';
                    } else if (key.toLowerCase().includes('_plural')) {
                        iosConversionItem['id'] = key.removeAll('_plural');
                        iosConversionItem['quantity'] = 'plural';
                    } else {
                        iosConversionItem['id'] = key;
                        iosConversionItem['quantity'] = 'one';
                    }
                    strings.push(iosConversionItem);
                }
            }
        }
        return strings;
    }

    buildConversionItemOf(iosString) {
        //First we group by quantity.
        let groupedByQuantity = iosString.groupBy("quantity");

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

    formatForBaseForm(unformatted){
        let regex = /%(@|s|f|.[0-9]*f)/g;
        let matchs = unformatted.match(regex);
        if (matchs) {
            matchs.forEach((foundPattern) => {
                switch (foundPattern.charAt(foundPattern.length - 1)) {
                    case "s":
                        unformatted = unformatted.replace(foundPattern, '{{text}}');
                        break;
                    case "@":
                        unformatted = unformatted.replace(foundPattern, '{{number}}');
                        break;
                    case "f":
                        if (foundPattern.includes('.')) {
                            var decimal = foundPattern.split('.')[1].replace("f", "");
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
        let groupedKey = Object.keys(groupedItems).sort();
        var result = {};
        for (const lang of availableLang) {
            let stringsFile = `/* \n  Localizable.strings \n Generation time : ' ${new Date().toISOString()} \n  */\n`;

            groupedKey.forEach(key => {
                stringsFile += key.trim().length == 0 ? "\n" : `\n/* ${key} */ \n`;
                stringsFile += this.printGroup(groupedItems[key], lang);
            });
            result[lang] = stringsFile;
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

    printGroup(items, lang) {
        let group = "";
        items.forEach(element => {
            group += this.printItem(element, lang);
        });
        return group;
    }

    printItem(item, lang) {
        let id = this.getItemId(item);
        if (!id) {
            throw "String is missing a id";
        }
        if (!item.relation) {
            return `"${id}" = "${this.formatValue(item.values[lang])}";\n`;
        } else {
            let relationBloc = `"${this.getItemId(item,"_singular")}" = "${this.formatValue(item.values[lang])}";\n`;
            let relationKeys = Object.keys(item.relation);
            relationKeys.forEach(key => {
                relationBloc += `"${this.getItemId(item,"_"+key)}" = "${this.formatValue(item.relation[key].values[lang])}";\n`;
            });
            return relationBloc;
        }
    }

    getItemId(item, suffix) {
        if (!suffix) {
            suffix = "";
        }
        let specificId = item.ids["IOS"];
        let id = (specificId ? specificId : item.ids["string"]) + suffix;
        return id.toUpperCase();
    }

    formatValue(unformatted) {
        let regex = /{{(text|number|float|float:[0-9]*)}}/g;
        let matchs = unformatted.match(regex);
        if (matchs != null) {
            for (let occurence = 0; occurence < matchs.length; occurence++) {
                var foundPattern = matchs[occurence];
                switch (foundPattern) {
                    case "{{text}}":
                        unformatted = unformatted.replace(foundPattern, `%s`)
                        break;
                    case "{{number}}":
                        unformatted = unformatted.replace(foundPattern, `%@`)
                        break;
                    case "{{float}}":
                        unformatted = unformatted.replace(foundPattern, `%f`)
                        break;
                    default:
                        if (foundPattern.includes("{{float:")) {
                            var decimal = foundPattern.replace("{{float:", "").replace("}}", "");
                            unformatted = unformatted.replace(foundPattern, `%.${decimal}f`)
                        }

                }
            }
        }

        return unformatted;
    }

}
export default IOSMapTransformations;