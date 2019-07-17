import '../source/extension/StringExtension';
import UniversalToAndroidConvertor from "../source/convertors/UniversalToAndroidConvertor";
import UniversalToIOSConvertor from "../source/convertors/UniversalToIOSConvertor";
import UniversalToCSVConvertor from "../source/convertors/UniversalToCSVConvertor";
import UniversalToI18Next from "../source/convertors/UniversalToI18NextConvertor";
import ConversionItem from '../source/model/ConversionItem';

var fs = require("fs");

test("File integrity Android #01", () => {
    expect(testFiles("./test/files/test_01", "android")).toBe(true);
});

test("File integrity IOS #01", () => {
    expect(testFiles("./test/files/test_01", "ios")).toBe(true);
});
test("File integrity CSV #01", () => {
    expect(testFiles("./test/files/test_01", "csv")).toBe(true);
});
test("File integrity i18Next #01", () => {
    expect(testFiles("./test/files/test_01", "i18next")).toBe(true);
});

test("File section Android", () => {
    expect(testFiles("./test/files/test_section", "android")).toBe(true);
});
test("File section IOS", () => {
    expect(testFiles("./test/files/test_section", "ios")).toBe(true);
});
test("File section CSV", () => {
    expect(testFiles("./test/files/test_section", "csv")).toBe(true);
});
test("File section i18Next", () => {
    expect(testFiles("./test/files/test_section", "i18next")).toBe(true);
});

function testFiles(path, platform) {
    var universal = ConversionItem.parse(fs.readFileSync(path + "/universal_items.json"));
    var expectedResult = JSON.parse(fs.readFileSync(path + "/" + platform + "/result.json"));
    var convertor;
    var regex;
    switch (platform) {
        case "ios":
            regex = /.*Generation time :.*[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z.*\n/g;
            convertor = new UniversalToIOSConvertor();
            break;
        case "android":
            regex = /<!-- generation time : [0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z-->/g;
            convertor = new UniversalToAndroidConvertor();
            break;
        case "csv":
            convertor = new UniversalToCSVConvertor();
            break;
        case "i18next":
            convertor = new UniversalToI18Next();
            break;
    }
    let result = convertor.convert(universal);
    let keys = Object.keys(expectedResult);
    for (const key of keys) {
        let formattedResult = result[key].regexRemoveAll(regex);
        let formattedExpectedResult = expectedResult[key].regexRemoveAll(regex);
        if (formattedExpectedResult != formattedResult) {
            return false;
        }
    }
    return true;
}