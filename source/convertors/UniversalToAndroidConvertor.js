import '../extension/ArrayExtension';
import '../extension/StringExtension';

class UniversalToAndroidConvertor {

    convert(input) {
        let availableLang = this.findLanguages(input);
        let groupedItems = input.groupBy("_meta.Section");
        let groupedKey = Object.keys(groupedItems).sort();
        var result = {};

        for (let langIndex = 0; langIndex < availableLang.length; langIndex++) {
            const lang = availableLang[langIndex];
            result[lang] = this.printForLang(groupedItems, groupedKey, lang)
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

    printForLang(items, keys, lang) {
        let stringXML = '<?xml version="1.0" encoding="utf-8"?> \n  <!-- generation time : ' + new Date().toISOString() + '--> \n<resources>\n';

        keys.forEach((key) => stringXML += this.printGroup(key, items[key], lang));
        stringXML += '</resources>'
        return stringXML;
    }

    printGroup(key, items, lang) {
        let group = !key || key.trim().length == 0 ? "\n" : `\n\t<!-- ${key} -->\n`;
        items.forEach(element => {
            group += this.printItem(element, lang);
        });
        return group;
    }

    printItem(item, lang) {
        let id = this.getRightId(item);
        if (!id) {
            throw "String is missing a id";
        }

        if (!item.relation) {
            return `\t<string name="${id}">${this.formatValue(item.values[lang])}</string>\n`
        } else {
            let pluralsXml = `\t<plurals name="${id}">`;
            if (item.relation['zero']) {
                pluralsXml += `\n \t\t<item quantity="zero">${this.formatValue(item.relation.zero.values[lang])}</item>`;
            }
            pluralsXml += `\n \t\t<item quantity="one">${this.formatValue(item.values[lang])}</item>`;
            //TODO only work for plural, handle other relation
            pluralsXml += `\n \t\t<item quantity="other">${this.formatValue(item.relation.plural.values[lang])}</item>`;
            pluralsXml += '\n\t</plurals>\n';
            return pluralsXml;
        }

    }

    getRightId(item) {
        let specificId = item.ids["android"];
        let id = specificId ? specificId : item.ids["string"];
        return id.toLowerCase();
    }

    formatValue(unformatted) {
        if (!unformatted) {
            return;
        }
        let regex = /{{(number|text|float|float:[0-9]*)}}/g;
        let matchs = unformatted.match(regex);
        if (matchs != null) {
            for (let occurence = 0; occurence < matchs.length; occurence++) {
                var foundPattern = matchs[occurence];
                switch (foundPattern) {
                    case "{{text}}":
                        unformatted = unformatted.replace(foundPattern, `%${occurence + 1}$s`)
                        break;
                    case "{{number}}":
                        unformatted = unformatted.replace(foundPattern, `%${occurence + 1}$d`)
                        break;
                    case "{{float}}":
                        unformatted = unformatted.replace(foundPattern, `%${occurence + 1}$f`)
                        break;
                    default:
                        if (foundPattern.includes("{{float:")) {
                            var decimal = foundPattern.replace("{{float:", "").replace("}}", "");
                            if (decimal.length > 0) {
                                unformatted = unformatted.replace(foundPattern, `%${occurence + 1}$.${decimal}f`)
                            } else {
                                unformatted = unformatted.replace(foundPattern, `%${occurence + 1}$f`)
                            }
                        }

                }
            }
        }
        unformatted = unformatted.replaceAll("'", "\'");
        if(!(unformatted.startsWith("<![CDATA[") && unformatted.endsWith("]]>"))){
            unformatted = unformatted.toXMLFormat(unformatted);
        }
        return unformatted;
    }
}

export default UniversalToAndroidConvertor;