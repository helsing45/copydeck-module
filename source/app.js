import Translator from "./translator/Translator";
import '../source/extension/StringExtension';
import UniversalFileIO from "./IO/UniversalFileIO";
var fs = require("fs");

writeTest('./files/csv/Sheet2.csv',"Test #1");



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

function writeTest(csvSourcePath, testName){
    //First we create the universal file;
    let testFolderPath = "./files/output/tests/" + testName;
    new Translator()
    .from("Csv")
    .readFile(csvSourcePath)
    .to("universal")
    .translate()
    .then((x)=>{
        let writer = new UniversalFileIO();
        writer.file = x;
        writer.write(testFolderPath,(e)=>{
            if(e){
                let b = true;
            }else{
                writePlatformTest("Android",testFolderPath);
                writePlatformTest("IOS",testFolderPath);
                writePlatformTest("Csv",testFolderPath);
                writePlatformTest("i18Next",testFolderPath);
            }
        });
    });
}

function writePlatformTest(platform,testFolderPath){
    new Translator()
    .from("universal")
    .defineDefaultLang('en')
    .readFile(testFolderPath + "/universal_items.json")
    .to(platform)
    .translateToFile(testFolderPath +"/"+ platform.toLowerCase());
}