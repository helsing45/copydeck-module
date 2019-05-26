import Translator from "./translator/Translator";

// CSV to i18Next
/*new Translator()
    .from("Csv")
    .read("./files/csv/Sheet1.csv")
    .to("i18Next")
    .translateToFile('./files/output/');*/

//i18Next to CSV
new Translator()
    .from("i18Next")
    .read("./files/i18next")
    .to("Csv")
    .translateToFile('./files/output/')
    /*.translate()
    .then((x) => {
        console.log(x);
    });*/

/*var input = new IosIO();
input.read("./files/ios/variable");
var output = new IosIO();

var translator = new Translator(input, new IOSMapTransformations(),new CsvMapTransformation(),output);
translator.translate('./files/output/translator');*/

// CSV TO IOS
/*var input = new CsvIO();
input.read("./files/csv/variables.csv");
var output = new IosIO();

var translator = new Translator(input, new CsvMapTransformation(),new IOSMapTransformations(),output);
translator.translate('./files/output/translator');*/