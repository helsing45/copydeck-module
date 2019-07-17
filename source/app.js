import Translator from "./translator/Translator";
import '../source/extension/StringExtension';
import UniversalToAndroidConvertor from "./convertors/UniversalToAndroidConvertor";
import UniversalToIOSConvertor from "./convertors/UniversalToIOSConvertor";
import UniversalToCSVConvertor from "./convertors/UniversalToCSVConvertor";
import UniversalToI18Next from "./convertors/UniversalToI18NextConvertor";
import ConversionItem from "./model/ConversionItem";
var fs = require("fs");

// CSV to i18Next
/*new Translator()
    .from("Csv")
    .read("./files/csv/Sheet1.csv")
    .to("i18Next")
    .translateToFile('./files/output/');*/
//var path = "./test/files/test_01"
var path = "./test/files/test_section"
console.log("Android is: " + testFiles(path,"android"));
console.log("IOS is: " + testFiles(path,"ios"));
console.log("Csv is: " + testFiles(path,"csv"));
console.log("i18Next is: " + testFiles(path,"i18next"));

//prepareTestFiles('./files/csv/test-sections.csv');

function prepareTestFiles(readPath){
    //prepareTestFile(readPath,"Android");
    //prepareTestFile(readPath,"IOS");
    //prepareTestFile(readPath,"Csv");
    //prepareTestFile(readPath,"i18Next");
}


function prepareTestFile(readPath,platform){
    new Translator()
        .from("Csv")
        .read(readPath)
        .to(platform)
        //.translateToFile('./files/output/' + platform);
        .translate()
        .then((x) => {
            console.log(platform);
            console.log(JSON.stringify(x));
        });
}

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