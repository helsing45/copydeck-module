import '../extension/ArrayExtension';

class UniversalToCSVConvertor {

    convert(input) {
        //First we need to flat the item by putting all the attibut in one level.
        let allItems = this.extractRelations(input);
        let flattedConversionItems = allItems.map((x) => this.flat(x));
        let colums = this.getColumnsOf(flattedConversionItems);
        let csvContent = "";
        // First row is columns name
        csvContent += colums.join(',');
        csvContent += "\n";
        for (let index = 0; index < flattedConversionItems.length; index++) {
            const row = flattedConversionItems[index];
            csvContent += this.printRow(row, colums);

        }
        let csvFile = {};
        csvFile["copydeck"] = csvContent;
        return csvFile;
    }

    extractRelations(items) {
        let result = [];
        for (const item of items) {
            result.push(item);
            if (item.relation) {
                let relationKeys = Object.keys(item.relation);
                for (const key of relationKeys) {
                    result.push(item.getRelation(key));
                }
            }
        }
        return result;
    }

    flat(conversionItem) {
        var flattedConversionItem = {};
        //Add the values of meta
        var metaKeys = Object.keys(conversionItem.meta);
        for (let index = 0; index < metaKeys.length; index++) {
            var metaKey = metaKeys[index];
            flattedConversionItem[metaKey] = conversionItem.meta[metaKey];
        }

        //Add the values of Id
        var idKeys = Object.keys(conversionItem.ids);
        for (let index = 0; index < idKeys.length; index++) {
            var idKey = idKeys[index];
            flattedConversionItem[idKey + "_Id"] = conversionItem.ids[idKey];
        }

        //Add the value of languages
        var languageKeys = Object.keys(conversionItem.values);
        for (let index = 0; index < languageKeys.length; index++) {
            var languageKey = languageKeys[index];
            flattedConversionItem[languageKey] = conversionItem.values[languageKey];
        }
        return flattedConversionItem;

    }

    getColumnsOf(flattedConversionItems) {
        // Retreive all the keys
        let columns = [];
        flattedConversionItems.forEach(flatConversionItem => {
            columns = columns.concat(Object.keys(flatConversionItem));
        });

        //return only unique key
        return columns.distinct();
    }

    printRow(item, columns) {
        let row = [];
        for (const column of columns) {
            let value = item[column];
            row.push(value);
        }
        return row.join(',') + "\n";
    }

}
export default UniversalToCSVConvertor;