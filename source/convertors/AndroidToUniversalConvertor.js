import '../extension/ArrayExtension';
import '../extension/StringExtension';
import ConversionItem from '../model/ConversionItem';

class AndroidToUniversalConvertor {

    convert(input) {
        return new Promise((resolve) => {
            let files = input.file;
            //First we map all the string in the individual files, then adding it to the same list. 
            let keys = Object.keys(files);
            let xmlsStrings = [];
            for (const key of keys) {
                xmlsStrings = xmlsStrings.concat(this.convertToXMLFile(files[key], key));
            }
            //Then we group every items by is ID, this will match every item of every language.
            //And create a conversionItem it each group.
            let conversionItems = [];
            let groupedXmlString = xmlsStrings.groupBy("id");
            let groupKeys = Object.keys(groupedXmlString);
            for (const groupKey of groupKeys) {
                conversionItems.push(this.buildConversionItemOf(groupedXmlString[groupKey]));
            }
            //We then end the promise by returning our result.
            resolve(conversionItems);
        });
    }

    convertToXMLFile(content, key) {
        let convert = require('xml-js');
        let xml = JSON.parse(convert.xml2json(content, {
            compact: false,
            spaces: 4
        }));
        for (const xmlObject of xml['elements']) {
            if (xmlObject['type'] == "element" && xmlObject['name'] == "resources") {
                return this.convertXMLResourceElement(xmlObject['elements'], key);
            }
        }
    }

    convertXMLResourceElement(xmlElement, key) {
        let androidConversionItems = [];
        let section = "";
        for (const element of xmlElement) {
            switch (element['type']) {
                case "comment":
                    section = element["comment"];
                    break;
                case "element":
                    if (element['name'] == "string") {
                        let androidConversionItem = this.readAsString(element, section);
                        androidConversionItem['key'] = key;
                        androidConversionItems.push(androidConversionItem);
                    } else if (element['name'] == "plurals") {
                        let plurals = this.readAsPlurals(element, section);
                        for (const plural of plurals) {
                            plural['key'] = key;
                            androidConversionItems.push(plural);
                        }
                    }
                    break;
            }
        }
        return androidConversionItems;
    }
    readAsString(element, section) {
        let id = element['attributes']['name'];
        let value = element['elements'][0]['text'];
        return {
            "section": section,
            "id": id,
            "value": value,
            "quantity": "one"
        };
    }

    readAsPlurals(element, section) {
        let pluralConversionItems = [];
        let id = element['attributes']['name'];
        for (const pluralElement of element['elements']) {
            let value = pluralElement['elements'][0]['text'];
            pluralConversionItems.push({
                "section": section,
                "id": id,
                "value": value,
                'quantity': pluralElement['attributes']['quantity']
            })
        }
        return pluralConversionItems;
    }

    buildConversionItemOf(xmlResourceGroup) {
        //First we group by quantity.
        let groupedByQuantity = xmlResourceGroup.groupBy("quantity");

        //Then for each quantity we build a conversionItem
        let conversionItems = {};
        for (const key in groupedByQuantity) {
            if (groupedByQuantity.hasOwnProperty(key)) {
                const group = groupedByQuantity[key];

                let conversionItem = new ConversionItem();
                conversionItem.addId("String_Id", group[0].id);
                for (const lang of group) {
                    conversionItem.addValue(lang.key, this.formatValue(lang.value));
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
                //TODO improve relation algorithm
                if (key == "other") {
                    result.addRelation("plural", relation);
                }
            }
        }

        return result;
    }

    formatValue(unformatted) {
        let regex = /%([0-9]+\$)?(\.[0-9]+)?(d|f|s)/g;
        let matchs = unformatted.match(regex);
        if (matchs) {
            matchs.forEach((foundPattern) => {
                switch (foundPattern.charAt(foundPattern.length - 1)) {
                    case "s":
                        unformatted = unformatted.replace(foundPattern, '{{text}}');
                        break;
                    case "d":
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
        unformatted = unformatted.replaceAll("\\'", "'");
        if(!(unformatted.startsWith("<![CDATA[") && unformatted.endsWith("]]>"))){
            unformatted = unformatted.toNoneXMLFormat(unformatted);
        }
        return unformatted;
    }

}
export default AndroidToUniversalConvertor;