import '../extension/ArrayExtension';
import '../extension/StringExtension';

class UniversalToIOSConvertor {
    convert(input) {
        let availableLang = this.findLanguages(input);
        let groupedItems = input.groupBy("_meta.Section");
        let groupedKey = Object.keys(groupedItems).sort();
        var result = {};
        for (const lang of availableLang) {
            let stringsFile = `/* \n Localizable.strings \n Generation time : ' ${new Date().toISOString()} \n  */\n`;

            groupedKey.forEach(key => {
                stringsFile += !key || key.trim().length == 0  ? "\n" : `\n/* ${key} */ \n`;
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
            let relationBloc = `"${this.getItemId(item, "_singular")}" = "${this.formatValue(item.values[lang])}";\n`;
            let relationKeys = Object.keys(item.relation);
            relationKeys.forEach(key => {
                relationBloc += `"${this.getItemId(item, "_" + key)}" = "${this.formatValue(item.relation[key].values[lang])}";\n`;
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
                            if (decimal.length > 0) {
                                unformatted = unformatted.replace(foundPattern, `%.${decimal}f`)
                            } else {
                                unformatted = unformatted.replace(foundPattern, `%f`)
                            }
                        }

                }
            }
        }

        return unformatted;
    }

}
export default UniversalToIOSConvertor;