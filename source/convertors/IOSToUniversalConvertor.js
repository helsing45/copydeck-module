import '../extension/ArrayExtension';
import '../extension/StringExtension';
import ConversionItem from '../model/ConversionItem';

class IOSToUniversalConvertor {

    convert(input){
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
                        let indexStart =  key.toLowerCase().indexOf('_singular');
                        iosConversionItem['id'] = key.substring(0,indexStart);
                        iosConversionItem['quantity'] = 'one';
                    } else if (key.toLowerCase().includes('_plural')) {
                        let indexStart =  key.toLowerCase().indexOf('_plural');
                        iosConversionItem['id'] = key.substring(0,indexStart);
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
                if (key == "plural") {
                    result.addRelation("plural", relation);
                }
            }
        }

        return result;
    }

    formatValue(unformatted){
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
    
}
export default IOSToUniversalConvertor;