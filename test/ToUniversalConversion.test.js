import Translator from "../source/translator/Translator";
import ConversionItem from '../source/model/ConversionItem';
import '../source/extension/StringExtension';
var fs = require("fs");

const androidIdFormatter = (id)=>{return id.toLowerCase()};
const iosIdFormatter = (id)=>{return id.toUpperCase()};
const i18NextIdFormatter = (id)=>{return id.camelize()};

const SIMPLE_TEST_PATH = "./test/files/simple_test";
const SECTION_TEST_PATH = "./test/files/test_section";
const RELATION_TEST_PATH = "./test/files/test_relation";

/* ANDROID */
test("Android to Universal #1", () => testUniversalConversion("Android", SIMPLE_TEST_PATH, androidIdFormatter));

test("Android to Universal Section", () => testUniversalConversion("Android", SECTION_TEST_PATH, androidIdFormatter));

test("Android to Universal Relation", () => testUniversalConversion("Android", RELATION_TEST_PATH, androidIdFormatter));

/* IOS */
test("IOS to Universal #1", () => testUniversalConversion("IOS", SIMPLE_TEST_PATH ,iosIdFormatter ));

test("IOS to Universal Section", () => testUniversalConversion("IOS", SECTION_TEST_PATH, iosIdFormatter));

test("IOS to Universal Relation", () => testUniversalConversion("IOS", RELATION_TEST_PATH, iosIdFormatter));

/* I18Next */
test("I18Next to Universal #1", () => testUniversalConversion("i18Next", SIMPLE_TEST_PATH, i18NextIdFormatter));

test("I18Next to Universal Section", () => testUniversalConversion("i18Next", SECTION_TEST_PATH, i18NextIdFormatter));

test("I18Next to Universal Relation", () => testUniversalConversion("i18Next", RELATION_TEST_PATH, i18NextIdFormatter));

/* CSV */
test("CSV to Universal #1", () => testUniversalConversion("Csv", SIMPLE_TEST_PATH));

test("CSV to Universal Section", () => testUniversalConversion("Csv", SECTION_TEST_PATH));

test("CSV to Universal Relation", () => testUniversalConversion("Csv", RELATION_TEST_PATH));

function testUniversalConversion(from, path, idFormatter) {
    return new Translator()
        .from(from)
        .readFile(path + "/" + from.toLowerCase())
        .to("universal")
        .translate()
        .then(data => {
            expect(testUniversals(path, data, idFormatter)).toBe(true);
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