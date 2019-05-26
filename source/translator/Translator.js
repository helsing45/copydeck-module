import AndroidIO from "../IO/AndroidIO";
import CsvIO from "../IO/CsvIO";
import IosIO from "../IO/IosIO";
import I18nextIO from "../IO/I18nextIO";
import UniversalToAndroidConvertor from "../convertors/UniversalToAndroidConvertor";
import UniversalToIOSConvertor from "../convertors/UniversalToIOSConvertor";
import UniversalToCSVConvertor from "../convertors/UniversalToCSVConvertor";
import UniversalToI18NextConvertor from "../convertors/UniversalToI18NextConvertor";
import AndroidToUniversalConvertor from "../convertors/AndroidToUniversalConvertor";
import IOSToUniversalConvertor from "../convertors/IOSToUniversalConvertor";
import CSVToUniversalConvertor from "../convertors/CSVToUniversalConvertor";
import I18NextToUniversalConvertor from "../convertors/I18NextToUniversalConvertor";

class Translator {
    constructor() {
        this.inputFile;
        this.toBaseTranslator;
        this.fromBaseTranslator;
        this.outputFile;
        this.filter;
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
            default:
                throw new Error("translatorType " + translatorType + " is not a know type");
        }
        return this;
    }

    read(inputPath) {
        this.inputFile.read(inputPath);
        return this;
    }

    to(translatorType) {
        switch (translatorType) {
            case "Android":
                this.outputFile = new AndroidIO();
                this.fromBaseTranslator = new UniversalToAndroidConvertor();
                break;
            case "IOS":
                this.outputFile = new IosIO();
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
            default:
                throw new Error("translatorType " + translatorType + " is not a know type");
        }
        return this;
    }

    filter(input) {
        //TODO
        return input;
    }

    translate() {
        return this.toBaseTranslator.convert(this.inputFile).then((x) => {
            let result = this.fromBaseTranslator.convert(this.filter(x));
            return new Promise((resolve) => {
                resolve(result);
            });;
        });
    }

    translateToFile(outputPath) {
        this.translate().then((result) => {
            this.outputFile.file = result;
            this.outputFile.write(outputPath);
        })
    }
}


export default Translator;