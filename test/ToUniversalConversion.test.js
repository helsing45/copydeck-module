import Translator from "../source/translator/Translator";
import ConversionItem from '../source/model/ConversionItem';
import '../source/extension/StringExtension';
var fs = require("fs");

/* ANDROID */
test("Android to Universal #1", () => testUniversalConversion("Android", "./test/files/simple_test", (id)=>{return id.toLowerCase()}));

test("Android to Universal Section", () => testUniversalConversion("Android", "./test/files/test_section", (id)=>{return id.toLowerCase()}));

/* IOS */
test("IOS to Universal #1", () => testUniversalConversion("IOS", "./test/files/simple_test", (id)=>{return id.toUpperCase()}));

test("IOS to Universal Section", () => testUniversalConversion("IOS", "./test/files/test_section", (id)=>{return id.toUpperCase()}));

/* I18Next */
test("I18Next to Universal #1", () => testUniversalConversion("i18Next", "./test/files/simple_test", (id)=>{return id.camelize()}));

test("I18Next to Universal Section", () => testUniversalConversion("i18Next", "./test/files/test_section", (id)=>{return id.camelize()}));

/* CSV */
test("CSV to Universal #1", () => testUniversalConversion("Csv", "./test/files/simple_test"));

test("CSV to Universal Section", () => testUniversalConversion("Csv", "./test/files/test_section"));

function testUniversalConversion(from, path, idFormatter) {
    return new Translator()
        .from(from)
        .readFile(path + "/" + from.toLowerCase())
        .to("universal")
        .translate()
        .then(data => {
            expect(testUniversals(path, data, idFormatter)).toBe(false);
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