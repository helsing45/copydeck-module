import Translator from "./translator/Translator";
import '../source/extension/StringExtension';
import UniversalFileIO from "./IO/UniversalFileIO";
import AndroidIO from "./IO/AndroidIO";
import IosIO from "./IO/IosIO";
import CsvIO from "./IO/CsvIO";
import I18nextIO from "./IO/I18nextIO";

import ConversionItem from './model/ConversionItem';
import copydeck from './index.js'
var fs = require("fs");
const config = require('../test/files/cli/input/config.json');

//writeTest('./files/csv/Filter_test.csv',"Test Filter");
//testPlatformConversion("Android", "./test/files/simple_test", /<!-- generation time : [0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z-->/g);
//testPlatformConversion("IOS", "./test/files/simple_test", /.*Generation time :.*[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z.*\n/g);
//testPlatformConversion("i18Next", "./test/files/test_section");
//testPlatformConversion("Csv", "./test/files/simple_test");
//testUniversalConversion("IOS", "./test/files/test_relation");
//testFilter('Target == "Mobile" && Project == "P1"',["ID-004"]);
translateToFile(config);


function translateToFile(config){
    return new Translator()
        .from(config.from)
        .readFile(config.readPath)
        .filter(config.filter)
        .defineDefaultLang(config.defaultLang)
        .to(config.to)
        .translateToFile(config.writePath);
}


function translateFromFilePath(fromPlatform, inputPath, filter, toPlatform) {
    return new Translator()
        .from(fromPlatform)
        .readFile(inputPath)
        .filter(filter)
        .to(toPlatform)
        .translate();
}

function testFilter(filter, resultId) {
    new Translator()
        .from("universal")
        .readFile("./test/files/universal_items_for_filter.json")
        .filter(filter)
        .to("universal")
        .translate()
        .then((x) => {
            console.log(testIDs(x, resultId));
        });
}

function testIDs(result, ids) {
    if (result.size != ids.size) {
        return false;
    }
    let resultIds = [];
    for (const resultItems of result) {
        resultIds.push(resultItems._ids.string);
    }
    resultIds.sort((a, b) => sortAlphabetically(a, b));
    ids.sort((a, b) => sortAlphabetically(a, b));
    for (let index = 0; index < ids.length; index++) {
        if (resultIds[index] != ids[index]) {
            return false;
        }
    }
    return true;
}

function sortAlphabetically(a, b) {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;

}

function writeTest(csvSourcePath, testName) {
    //First we create the universal file;
    let testFolderPath = "./files/output/tests/" + testName;
    new Translator()
        .from("Csv")
        .readFile(csvSourcePath)
        .to("universal")
        .translate()
        .then((x) => {
            let writer = new UniversalFileIO();
            writer.file = x;
            writer.write(testFolderPath, (e) => {
                if (!e) {
                    writePlatformTest("Android", testFolderPath);
                    writePlatformTest("IOS", testFolderPath);
                    writePlatformTest("Csv", testFolderPath);
                    writePlatformTest("i18Next", testFolderPath);
                }
            });
        });
}

function writePlatformTest(platform, testFolderPath) {
    new Translator()
        .from("universal")
        .defineDefaultLang('en')
        .readFile(testFolderPath + "/universal_items.json")
        .to(platform)
        .translateToFile(testFolderPath + "/" + platform.toLowerCase());
}

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

function testUniversalConversion(from, path, idFormatter) {
    return new Translator()
        .from(from)
        .readFile(path + "/" + from.toLowerCase())
        .to("universal")
        .translate()
        .then(data => {
            let b = testUniversals(path, data, idFormatter);
        });
}

function testUniversals(path, univerals, idFormatter) {
    let expected = new Set();
    ConversionItem.parse(fs.readFileSync(path + "/universal_items.json")).map((x) => {
        let formattedId = (idFormatter ? idFormatter(x.getUniqueId()) : x.getUniqueId());
        expected.add(formattedId);
    });

    let result = new Set();
    univerals.map((x) => {
        let formattedId = (idFormatter ? idFormatter(x.getUniqueId()) : x.getUniqueId());
        result.add(formattedId);
    });

    if (result.size !== expected.size) {
        return false;
    }
    for (var a of result) {
        if (!expected.has(a)) {
            return false;
        }
    }
    return true;

}