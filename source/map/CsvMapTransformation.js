import ConversionItem from '../model/ConversionItem';
import {distinct} from '../utils/ArrayUtils';

const csv = require('csvtojson')
const LocalCode = require('locale-code')
const ISO6391 = require('iso-639-1')

class CsvMapTransformation {

    constructor() {
        this._warnings = [];
    }

    toBaseForm(input) {
        //For now CsvMapTransformation doesn't handle multiple file
        var key = Object.keys(input._files)[0];
        var csvBuilder = csv().fromString(input._files[key]);
        return csvBuilder.then((json) => {
            var conversionItems = json.map(x => this._jsonObjectToConversionObject(x));
            return this._associateRelations(conversionItems);
        });
    }

    _jsonObjectToConversionObject(json) {
        var item = new ConversionItem();
        Object.keys(json).forEach(key => {
            if (ISO6391.validate(key) || LocalCode.validate(key)) {
                item.addValue(key, json[key]);
            } else if (key.toLowerCase().includes("_id")) {
                if (json[key].trim().length > 0) {
                    item.addId(key, json[key]);
                }
            } else {
                item.addMeta(key, json[key]);
            }
        });
        return item;
    }
    _associateRelations(items) {
        var groupedItems = {};
        items.forEach(element => {
            if (!(element.getUniqueId() in groupedItems)) {
                groupedItems[element.getUniqueId()] = [];
            }
            groupedItems[element.getUniqueId()].push(element);
        });
        var result = [];

        var keys = Object.keys(groupedItems);
        for (let index = 0; index < keys.length; index++) {
            var element = groupedItems[keys[index]];
            if (element.length == 1) {
                result.push(element[0]);
            } else {
                result.push(this._handleRelationOf(element));
            }
        }
        return result;
    }

    _handleRelationOf(items) {
        var result = new ConversionItem();
        var hasBeenSetup = false;

        for (let index = 0; index < items.length; index++) {
            const element = items[index];
            var foundRelation = this._findRelation(element);
            if (!foundRelation) {
                if (!hasBeenSetup) {
                    result.copy(element);
                    hasBeenSetup = true;
                } else {
                    this._warnings.push("Duplicate ID detected");
                }
            } else {
                result.addRelation(foundRelation.toLowerCase(), element);
            }

        }
        return result;
    }

    _findRelation(conversionItem) {
        if (conversionItem.meta["relation"]) {
            return conversionItem.meta["relation"];
        } else if (conversionItem.meta["Plural"]) {
            return "Plural";
        }
        return "";
    }

    fromBaseForm(input) {
        //First we need to flat the item by putting all the attibut in one level.
        let flattedConversionItems = input.map((x) => this._flat(x));
        let colums = this._getColumnsOf(flattedConversionItems);
        let csvContent = "";
        // First row is columns name
        csvContent += colums.join(',');
        csvContent += "\n";
        for (let index = 0; index < flattedConversionItems.length; index++) {
            const row = flattedConversionItems[index];
            csvContent += this._printRow(row,colums);
            
        }
        let csvFile ={};
        csvFile["copydeck"] = csvContent;
        return csvFile;
    }

    _flat(conversionItem) {
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

    _getColumnsOf(flattedConversionItems) {
        // Retreive all the keys
        let columns = [];    
        flattedConversionItems.forEach(flatConversionItem => {
            columns = columns.concat(Object.keys(flatConversionItem));
        });

        //return only unique key
        return distinct(columns);
    }

    _printRow(item, columns){
        let row = [];
        for (const column of columns) {
            let value = item[column];
            row.push(value);
        }
        return row.join(',') + "\n";
    }

}
export default CsvMapTransformation;