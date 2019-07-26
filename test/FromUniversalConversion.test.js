import Translator from "../source/translator/Translator";
import '../source/extension/StringExtension';
import AndroidIO from "../source/IO/AndroidIO";
import IosIO from "../source/IO/IosIO";
import CsvIO from "../source/IO/CsvIO";
import I18nextIO from "../source/IO/I18nextIO";

test("Universal to Android #1", () => {
    testPlatformConversion("Android", "./test/files/simple_test", /<!-- generation time : [0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z-->/g);
});

test("Universal to IOS #1", () => {
    testPlatformConversion("IOS", "./test/files/simple_test", /.*Generation time :.*[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z.*\n/g);
});

test("Universal to i18Next #1", () => {
    testPlatformConversion("i18Next", "./test/files/simple_test");
});

test("Universal to Csv #1", () => {
    testPlatformConversion("Csv", "./test/files/simple_test");
});

function testPlatformConversion(platform, path, regex) {
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

function testFileInput(path, platform, result, regex) {
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

function getInputFileFromUniveralFolder(path, platform) {
    var completePath = path + "/" + platform + "/toUniversal"
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