import Translator from "../source/translator/Translator";
import '../source/extension/StringExtension';
import AndroidIO from "../source/IO/AndroidIO";
import IosIO from "../source/IO/IosIO";
import CsvIO from "../source/IO/CsvIO";
import I18nextIO from "../source/IO/I18nextIO";

class TestUtils {

    static testPlatformConversion(platform, path, regex) {
        new Translator()
            .from("universal")
            .defineDefaultLang('en')
            .readFile(path + "/universal_items.json")
            .to(platform)
            .translate()
            .then((x) => {
                console.log(testFileInput(path, platform, x, regex));
            });
    }

    testFileInput(path, platform, result, regex) {
        let expected = getInputFileFromUniveralFolder(path, platform).file;
        if (Object.keys(expected).length != Object.keys(result).length) {
            return false;
        }

        for (const key in expected) {
            if (!result.hasOwnProperty(key)) {
                return false;
            }
            if (expected[key].regexRemoveAll(regex) != result[key].regexRemoveAll(regex)) {
                return false;
            }
        }
        return true;
    }

    getInputFileFromUniveralFolder(path, platform) {
        var completePath = path + "/" + platform;
        var reader;
        switch (platform) {
            case "Android":
                reader = new AndroidIO();
                break;
            case "IOS":
                reader = new IosIO();
                break;
            case "Csv":
                reader = new CsvIO();
                break;
            case "i18Next":
                reader = new I18nextIO();
                break;
        }

        reader.read(completePath);
        return reader;
    }

}