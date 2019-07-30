import Translator from "../source/translator/Translator";
import '../source/extension/StringExtension';
import AndroidIO from "../source/IO/AndroidIO";
import IosIO from "../source/IO/IosIO";
import CsvIO from "../source/IO/CsvIO";
import I18nextIO from "../source/IO/I18nextIO";

const androidRegex = /<!-- generation time : [0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z-->/g;
const iosRegex = /.*Generation time :.*[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z.*\n/g;

const SIMPLE_TEST_PATH = "./test/files/simple_test";
const SECTION_TEST_PATH = "./test/files/test_section";
const RELATION_TEST_PATH = "./test/files/test_relation";

/* ANDROID */
test("Universal to Android #1", () => testPlatformConversion("Android", SIMPLE_TEST_PATH, androidRegex));

test("Universal to Android Test Section", () => testPlatformConversion("Android", SECTION_TEST_PATH, androidRegex));

test("Universal to Android Test Relation", () => testPlatformConversion("Android", RELATION_TEST_PATH, androidRegex));

/* IOS */
test("Universal to IOS #1", () => testPlatformConversion("IOS", SIMPLE_TEST_PATH, iosRegex));

test("Universal to IOS Test Section", () => testPlatformConversion("IOS", SECTION_TEST_PATH, iosRegex));

test("Universal to IOS Test Relation", () => testPlatformConversion("IOS", RELATION_TEST_PATH, iosRegex));

/* I18Next */
test("Universal to i18Next #1", () => testPlatformConversion("i18Next", SIMPLE_TEST_PATH));

test("Universal to i18Next Test Section", () => testPlatformConversion("i18Next",SECTION_TEST_PATH));

test("Universal to i18Next Test Relation", () => testPlatformConversion("i18Next",RELATION_TEST_PATH));

/* CSV */
test("Universal to Csv #1", () => testPlatformConversion("Csv", SIMPLE_TEST_PATH));

test("Universal to Csv Test Section", () => testPlatformConversion("Csv", SECTION_TEST_PATH));

test("Universal to Csv Test Relation", () => testPlatformConversion("Csv", RELATION_TEST_PATH));

function testPlatformConversion(platform, path, regex) {
    return convert(platform, path)
        .then((x) => {
            return expect(testFileInput(path, platform, x, regex)).toBe(true);
        });
}

function convert(platform, path) {
    return new Translator()
        .from("universal")
        .defineDefaultLang('en')
        .readFile(path + "/universal_items.json")
        .to(platform)
        .translate();
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
    var completePath = path + "/" + platform.toLowerCase();
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