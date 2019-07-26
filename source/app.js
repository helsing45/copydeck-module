import Translator from "./translator/Translator";
import '../source/extension/StringExtension';
import UniversalToAndroidConvertor from "./convertors/UniversalToAndroidConvertor";
import UniversalToIOSConvertor from "./convertors/UniversalToIOSConvertor";
import UniversalToCSVConvertor from "./convertors/UniversalToCSVConvertor";
import UniversalToI18Next from "./convertors/UniversalToI18NextConvertor";
import ConversionItem from "./model/ConversionItem";
import IOSToUniversalConvertor from "./convertors/IOSToUniversalConvertor";
import AndroidToUniversalConvertor from "./convertors/AndroidToUniversalConvertor";
import CSVToUniversalConvertor from "./convertors/CSVToUniversalConvertor";
import I18NextToUniversalConvertor from "./convertors/I18NextToUniversalConvertor";
import AndroidIO from "./IO/AndroidIO";
import IosIO from "./IO/IosIO";
import CsvIO from "./IO/CsvIO";
import I18nextIO from "./IO/I18nextIO";
var fs = require("fs");

// CSV to i18Next
/*new Translator()
    .from("Csv")
    .read("./files/csv/Sheet2.csv")
    .to("i18Next")
    .translateToFile('./files/output/');*/
//var path = "./test/files/test_01";
//testToUniversalConversion(path,"android");
//testToUniversalConversion(path,"ios");
//testToUniversalConversion(path,"csv");
//testToUniversalConversion(path,"i18next");


var path = "./test/files/test_01"
console.log("Android is: " + testUniversalToAndroidConversion(path));
//console.log("IOS is: " + testIOSConversion(path));
//console.log("Csv is: " + testCsvConversions(path));
//console.log("i18Next is: " + testI18NextConversion(path));

//prepareTestFiles('./files/csv/Sheet2.csv');
//prepareTestFiles('./files/output/universal/UniversalItems.json');

function prepareTestFiles(readPath){
    //prepareTestFile(readPath,"universal");
    //prepareTestFile(readPath,"Android");
    //prepareTestFile(readPath,"IOS");
    //prepareTestFile(readPath,"Csv");
    //prepareTestFile(readPath,"i18Next");
}


function prepareTestFile(readPath,platform){
    new Translator()
        .from("universal")
        .readFile(readPath)
        .to(platform)
        .translateToFile('./files/output/' + platform);
        /*.translate()
        .then((x) => {
            console.log(platform);
            console.log(JSON.stringify(x));
        });*/
}

function getInputFileFromUniveralFolder(path,platform){
    var completePath = path + "/" +platform + "/toUniversal" 
    var reader;
    switch (platform) {
        case "android":
            reader = new AndroidIO();
            break;
        case "ios":
            reader = new IosIO();
            break;
        case "csv":
            reader = new CsvIO();
            break;
        case "i18next":
            reader = new I18nextIO();
            break;
    }

    reader.read(completePath);
    return reader;
}

function testToUniversalConversion(path,platform){
    var convertor;
    switch (platform) {
        case "ios":
            convertor = new I18NextToUniversalConvertor();
            break;
        case "android":
            convertor = new AndroidToUniversalConvertor();
            break;
        case "csv":
            convertor = new CSVToUniversalConvertor();
            break;
        case "i18next":
            convertor = new I18NextToUniversalConvertor();
            break;
    }
    let platformFile = getInputFileFromUniveralFolder(path,platform);
    convertor.convert(platformFile).then((x)=>{
       console.log(platform + ": "+ testUniversals(path,x));
    });
}

function testUniversals(path, univerals, idFormatter){    
    let expected = new Set();
    ConversionItem.parse(fs.readFileSync(path + "/universal_items.json")).map((x)=>{
        let formattedId = (idFormatter ? idFormatter(x.getUniqueId()): x.getUniqueId());
        expected.add(formattedId);
    });

    let result = new Set();
    univerals.map((x)=>{
        
        let formattedId = (idFormatter ? idFormatter(x.getUniqueId()): x.getUniqueId());
        result.add(formattedId);
    });

    if (result.size !== expected.size){ return false;}
    for (var a of result) {
        if (!expected.has(a)){
            return false;
        }
    }
    return true;

}

function testFileInput(path,platform,result,regex){
    let expected = getInputFileFromUniveralFolder(path,platform).file;
    if(Object.keys(expected).length != Object.keys(result).length){
        return false;
    }

    for (const key in expected) {
        if (!result.hasOwnProperty(key)) {
            return false;
        }
        if(expected[key].regexRemoveAll(regex) != result[key].regexRemoveAll(regex)){
            return false;
        }
    }
    return true;
}


///------------------ TEST METHOD #2 -----------------------------------

function testUniversalToAndroidConversion(path){
    let regex = /<!-- generation time : [0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z-->/g;
    new Translator()
    .from("universal")
    .defineDefaultLang('en')
    .readFile(path + "/universal_items.json")
    .to("Android")
    .translate()
    .then((x) => {
        console.log(testFileInput(path,"android",x, regex));
    });
}

function testAndroidToUniversalConversion(path){
    new Translator()
    .from("Android")
    .readFile(path + "/android/toUniversal")
    .to("universal")
    .translate()
    .then((x) => {
       let result = testUniversals(path + "/android", x ,(id)=>{
            return id.toLowerCase();
        });
        console.log(result);
    });
}

function testIOSConversion(path){
    let regex = /.*Generation time :.*[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z.*\n/g;
    new Translator()
    .from("IOS")
    .readFile(path + "/ios/toUniversal")
    .to("universal")
    .translate()
    .then((x) => {
       let result = testUniversals(path , x , (id) => {
           return id.toUpperCase();
       });
        console.log(result);
    });
}

function testI18NextConversion(path){
    new Translator()
    .from("i18Next")
    .readFile(path + "/i18next/toUniversal")
    .to("universal")
    .translate()
    .then((x) => {
       let result = testUniversals(path , x, (id)=>{
           return id.camelize();
       } );
        console.log(result);
    });
}

function testCsvConversions(path){
    new Translator()
    .from("Csv")
    .readFile(path + "/csv/toUniversal")
    .to("universal")
    .translate()
    .then((x) => {
       let result = testUniversals(path, x);
        console.log(result);
    });

}