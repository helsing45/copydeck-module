import '../extension/StringExtension';
import ConversionItem from '../model/ConversionItem';

class I18NextToUniversalConvertor {

    convert(input) {
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
    
        formatValue(unformatted) {
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
                                var decimal = foundPattern.split(',')[1].split('.')[1].removeAll("}}").length;
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
export default I18NextToUniversalConvertor;