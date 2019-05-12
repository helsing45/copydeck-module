import AndroidIO from "./IO/AndroidIO";
import CsvIO from "./IO/CsvIO";
import IosIO from "./IO/IosIO";
import I18nextIO from "./IO/I18nextIO";
import CsvMapTransformation from "./map/CsvMapTransformation";
import Translator from "./Translator";
import AndroidMapTransformation from "./map/AndroidMapTransformation";
import IOSMapTransformations from "./map/IOSMapTransformation";

var input = new IosIO();
input.read("./files/ios/variable");
var output = new IosIO();

var translator = new Translator(input, new IOSMapTransformations(),new CsvMapTransformation(),output);
translator.translate('./files/output/translator');

// CSV TO IOS
/*var input = new CsvIO();
input.read("./files/csv/variables.csv");
var output = new IosIO();

var translator = new Translator(input, new CsvMapTransformation(),new IOSMapTransformations(),output);
translator.translate('./files/output/translator');*/

