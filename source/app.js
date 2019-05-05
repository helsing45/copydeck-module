import AndroidIO from "./IO/AndroidIO";
import CsvIO from "./IO/CsvIO";
import IosIO from "./IO/IosIO";
import I18nextIO from "./IO/I18nextIO";

var io = new I18nextIO();
io.read("./files/i18next");
io.write("./files/output/i18next");

/*var io = new IosIO();
io.read("./files/iOS");
io.write("./files/output");*/

/*var io = new CsvIO();
io.read("./files/csv/read_csv_file_test.csv");
io.write("./files/output");*/

/*var io =new AndroidIO();
io.read("./files/android");
io.write('./files/output');*/

var b = true;