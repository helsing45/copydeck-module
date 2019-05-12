import AndroidIO from "./IO/AndroidIO";
import CsvIO from "./IO/CsvIO";
import IosIO from "./IO/IosIO";
import I18nextIO from "./IO/I18nextIO";
import CsvMapTransformation from "./map/CsvMapTransformation";
import Translator from "./Translator";
import AndroidMapTransformation from "./map/AndroidMapTransformation";

var input = new AndroidIO();
input.read("./files/android/variables");
var output = new AndroidIO();

var translator = new Translator(input, new AndroidMapTransformation(),new AndroidMapTransformation(),output);
translator.translate('./files/output/translator');

