import Translator from "./translator/Translator";

// CSV to i18Next
/*new Translator()
    .from("Csv")
    .read("./files/csv/Sheet1.csv")
    .to("i18Next")
    .translateToFile('./files/output/');*/

//i18Next to CSV
/*new Translator()
    .from("Csv")
    .read("./files/csv/Sheet1.csv")
    .to("Android")
    .translateToFile('./files/output/')
    .translate()
    .then((x) => {
        console.log(x);
    });*/