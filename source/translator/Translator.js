import AndroidIO from "../IO/AndroidIO";
import CsvIO from "../IO/CsvIO";
import IosIO from "../IO/IosIO";
import I18nextIO from "../IO/I18nextIO";
import CsvMapTransformation from "../map/CsvMapTransformation";
import AndroidMapTransformation from "../map/AndroidMapTransformation";
import IOSMapTransformations from "../map/IOSMapTransformation";
import {
    resolve
} from "path";
import I18NextMapTransformation from "../map/I18NextMapTransformation";

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
                this.toBaseTranslator = new AndroidMapTransformation();
                break;
            case "IOS":
                this.inputFile = new IosIO();
                this.toBaseTranslator = new IOSMapTransformations();
                break;
            case "Csv":
                this.inputFile = new CsvIO();
                this.toBaseTranslator = new CsvMapTransformation();
                break;
            case "i18Next":
                this.inputFile = new I18nextIO();
                this.toBaseTranslator = new I18NextMapTransformation();
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
                this.fromBaseTranslator = new AndroidMapTransformation();
                break;
            case "IOS":
                this.outputFile = new IosIO();
                this.fromBaseTranslator = new IOSMapTransformations();
                break;
            case "Csv":
                this.outputFile = new CsvIO();
                this.fromBaseTranslator = new CsvMapTransformation();
                break;
            case "i18Next":
                this.outputFile = new I18nextIO();
                this.fromBaseTranslator = new I18NextMapTransformation();
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
        return this.toBaseTranslator.toBaseForm(this.inputFile).then((x) => {
            let result = this.fromBaseTranslator.fromBaseForm(this.filter(x));
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

/*translate(outputPath) {
    this.inputMapTransformater.toBaseForm(this.inputFile).then((x) => {
        this.outputFile.file = this.outputMapTransformer.fromBaseForm(this.filter(x));
        this.outputFile.write(outputPath);
    });
}*/


export default Translator;