import ConversionItem from '../model/ConversionItem'; 
import '../extension/ArrayExtension'; 
 
const csv = require('csvtojson') 
const LocalCode = require('locale-code') 
const ISO6391 = require('iso-639-1') 

class CSVToUniversalConvertor {

    async convert(input) {
        //For now CsvMapTransformation doesn't handle multiple file
        var key = Object.keys(input._files)[0];
        var csvBuilder = csv().fromString(input._files[key]);
        const json = await csvBuilder;
        var conversionItems = json.map(x => this.jsonObjectToConversionObject(x));
        return this.associateRelations(conversionItems);
    }

    jsonObjectToConversionObject(json) {
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
    associateRelations(items) {
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
                result.push(this.handleRelationOf(element));
            }
        }
        return result;
    }

    handleRelationOf(items) {
        var result = new ConversionItem();
        var hasBeenSetup = false;

        for (let index = 0; index < items.length; index++) {
            const element = items[index];
            var foundRelation = this.findRelation(element);
            if (!foundRelation) {
                if (!hasBeenSetup) {
                    result.copy(element);
                    hasBeenSetup = true;
                } else {
                    //TODO handle warning
                    //this._warnings.push("Duplicate ID detected");
                }
            } else {
                result.addRelation(foundRelation.toLowerCase(), element);
            }

        }
        return result;
    }

    findRelation(conversionItem) {
        if (conversionItem.meta["relation"]) {
            return conversionItem.meta["relation"];
        } else if (conversionItem.meta["Plural"]) {
            return "Plural";
        }
        return "";
    }

}
export default CSVToUniversalConvertor;