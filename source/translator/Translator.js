import AndroidIO from "../IO/AndroidIO";
import CsvIO from "../IO/CsvIO";
import IosIO from "../IO/IosIO";
import I18nextIO from "../IO/I18nextIO";
import UniversalFileIO from "../IO/UniversalFileIO";
import UniversalToAndroidConvertor from "../convertors/UniversalToAndroidConvertor";
import UniversalToIOSConvertor from "../convertors/UniversalToIOSConvertor";
import UniversalToCSVConvertor from "../convertors/UniversalToCSVConvertor";
import UniversalToI18NextConvertor from "../convertors/UniversalToI18NextConvertor";
import FromUniversalConvertor from "../convertors/FromUniversalConvertor";
import AndroidToUniversalConvertor from "../convertors/AndroidToUniversalConvertor";
import IOSToUniversalConvertor from "../convertors/IOSToUniversalConvertor";
import CSVToUniversalConvertor from "../convertors/CSVToUniversalConvertor";
import I18NextToUniversalConvertor from "../convertors/I18NextToUniversalConvertor";
import ToUniversalConvertor from "../convertors/ToUniversalConvertor";

import '../extension/ArrayExtension'; 
import '../extension/StringExtension';

const LocalCode = require('locale-code') 
const ISO6391 = require('iso-639-1') 

class Translator {
    constructor() {
        this.inputFile;
        this.toBaseTranslator;
        this.fromBaseTranslator;
        this.outputFile;
        this.filter;
        this.defaultLang;
    }

    defineDefaultLang(lang) {
        this.defaultLang = lang;
        return this;
    }

    from(translatorType) {
        switch (translatorType) {
            case "Android":
                this.inputFile = new AndroidIO();
                this.toBaseTranslator = new AndroidToUniversalConvertor();
                break;
            case "IOS":
                this.inputFile = new IosIO();
                this.toBaseTranslator = new IOSToUniversalConvertor();
                break;
            case "Csv":
                this.inputFile = new CsvIO();
                this.toBaseTranslator = new CSVToUniversalConvertor();
                break;
            case "i18Next":
                this.inputFile = new I18nextIO();
                this.toBaseTranslator = new I18NextToUniversalConvertor();
                break;
            case "universal":
                this.inputFile = new UniversalFileIO();
                this.toBaseTranslator = new ToUniversalConvertor();
                break;
            default:
                throw new Error("translatorType " + translatorType + " is not a know type");
        }
        return this;
    }

    readFile(inputPath) {
        this.inputFile.read(inputPath);
        return this;
    }

    readAs(inputFile) {
        this.inputFile.file = inputFile;
        return this;
    }

    to(translatorType) {
        switch (translatorType) {
            case "Android":
                this.outputFile = new AndroidIO();
                this.outputFile.defaultLang = this.defaultLang;
                this.fromBaseTranslator = new UniversalToAndroidConvertor();
                break;
            case "IOS":
                this.outputFile = new IosIO();
                this.outputFile.defaultLang = this.defaultLang;
                this.fromBaseTranslator = new UniversalToIOSConvertor();
                break;
            case "Csv":
                this.outputFile = new CsvIO();
                this.fromBaseTranslator = new UniversalToCSVConvertor();
                break;
            case "i18Next":
                this.outputFile = new I18nextIO();
                this.fromBaseTranslator = new UniversalToI18NextConvertor();
                break;
            case "universal":
                this.outputFile = new UniversalFileIO();
                this.fromBaseTranslator = new FromUniversalConvertor();
                break;
            default:
                throw new Error("translatorType " + translatorType + " is not a know type");
        }
        return this;
    }

    filter(regex){
        if(!regex){
            return this;
        }
        let splittedRegex = regex.split(/\|\||\&\&/);
        let keys = [];
        for (const splittedItem of splittedRegex) {
            let key = splittedItem.split("==")[0]
            .removeAll('(')
            .removeAll(')')
            .trim();
            keys.push(key);
        }

        let formattedRegex = regex;
        for (const key of keys.distinct()) {
            let formattedKey;
            if (ISO6391.validate(key) || LocalCode.validate(key)) {
                formattedKey = "item._values." + key;
            } else if (key.toLowerCase().includes("_id")) {
                let startIndex = id.toLowerCase().indexOf("_id");
                let formattedId = id.substring(0, startIndex).toLowerCase();
                formattedKey = "item._ids." + formattedId; 
            } else {
                formattedKey = "item._meta."+key;
            }

            formattedRegex = formattedRegex.replaceAll(key,formattedKey);
        }
        this.filter = formattedRegex;
        return this;
    }

    _filter(input) {
        let filteredResult = [];
        for (const item of input) {
            if(eval(this.filter)){
                filteredResult.push(item);
            }
        }
        return filteredResult;
    }

    translate() {
        return this.toBaseTranslator.convert(this.inputFile).then((x) => {
            let result = this.fromBaseTranslator.convert(this._filter(x));
            this.outputFile.file = result;
            return new Promise((resolve,reject) => {
                resolve(this.outputFile.file);
            });;
        });
    }

    translateToFile(outputPath) {
        this.translate().then((result) => {
            this.outputFile.write(outputPath);
        })
    }
}


export default Translator;