import AndroidIO from "./IO/AndroidIO";
import CsvIO from "./IO/CsvIO";
import IosIO from "./IO/IosIO";
import I18nextIO from "./IO/I18nextIO";
import CsvMapTransformation from "./map/CsvMapTransformation";
import Translator from "./Translator";

var input = new CsvIO();
input.read("./files/csv/copydeck-v2.csv");
var output = new CsvIO();

var translator = new Translator(input, new CsvMapTransformation(),new CsvMapTransformation(),output);
translator.translate('./files/output/translator');

/*var io = new I18nextIO();
io.read("./files/i18next");
io.write("./files/output/i18next");*/

/*var io = new IosIO();
io.read("./files/iOS");
io.write("./files/output");*/

/*var io = new CsvIO();
io.read("./files/csv/copydeck-v2.csv");
var csvMap = new CsvMapTransformation();
var result = csvMap.toBaseForm(io).then((x)=>{
    let outputFile = new CsvIO();
    let file = {};
    file["Test"] = csvMap.fromBaseForm(x);
    outputFile.file = file;
    outputFile.write("./files/translate")
});*/

/*var io =new AndroidIO();
io.read("./files/android");
var b = true;*/
//io.write('./files/output');