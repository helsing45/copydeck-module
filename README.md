# Copydeck-Module
Copydeck-Mobule is the node module that allow you to transform Android, IOS or i18Next ressources files into a more user friendly Csv files. The translation from any type of file to any other type of file. The easiest way to use the module is to use is command line interface [command line interface](https://www.npmjs.com/package/copydeck-cli)


# Node integration
If you want to use in you node project you can use it like this
```
new Translator()
        .from({fileTypeEnum})
        .readFile({readingPath})
        .to({fileTypeEnum})
        .defineDefaultLang({locale-code})
        .translate()
        .then((x) => {
            //Do something
        });
```
Translator is basically a builder

|Builder method|Explication|Optional|
|--------------|-----------|--------|
|from|The type of file between; _'Android'_, _'Csv'_, _'IOS'_, _'i18Next'_, _'universal'_|No|
|readFile|The path of the reading folder|Yes, must use readAs|
|readAs|The json file generally build by the [IO](#IO) class|Yes, must use readFile|
|to|The type of file between; _'Android'_, _'Csv'_, _'IOS'_, _'i18Next'_, _'universal'_|No|
|defineDefaultLang|In the case of a transformation into Android files the DefaultLang determine witch language will have the folder named values|Yes|
|filter|The eval string use to filter what item you want to keep. If you translate from a Csv file you can filter by column name.|Yes|
|translate|Return a promise with a json file with the folder structure and data|Can by remplace by translateToFile|
|translateToFile|Write the folder structure and data, receive from translate and the [IO](#IO)|Can by remplace by translateToFile|


# Adding a new FileTypeEnum
If you wish to add a new language you will need to add two convertors one that can translate your language to Universal and one to translate Universal to your language. It allow the module to be able to transform every language into any other language.
## Convertor
Every Convertor class need to have a method convert(input). You have two types of convertor.
#### Universal to Language
This convertor will receive a array of ConversionItem and will return a json where every key is a language and it's value is a string that will be save as the file content.
#### Language to Universal
This convertor will receive a json with the structure or the reading folder and will return a promise of a array of ConversionItem

#### Universal form
The universal form is the intermediate transformation between two language. Every language know how to transform from & To ConversionItem Array.

The ConversionItem is seperate into 3 key
```JSON
{
       "_ids":{
          "string":"ID-001"
       },
       "_values":{
          "en":"String #1"
       },
       "_meta":{
          "Target":"Mobile"
       }
    },
```

When transforming from a Csv file if the column header is ISO6391 valid it will be use as a key in the _values object.

If the column header contains _id it will by use in the _ids object. By example if you have a string_id is key value will be string.

Every other columns will be added in the _meta object where the column name is the key .
## <a id="IO"></a> IO ##

The IO package contains every langugage Reader/Writer. Every IO class as 2 method read(filePath) and write(filePath). The IO job is to Read a folder and create a json with a structure of it, and also write all the file and folder structure from a json.

By example it's the AndroidIO class job to transform this

```JSON
{
   "fr":"<?xml version=\"1.0\" encoding=\"utf-8\"?> </resources>",
   "en":"<?xml version=\"1.0\" encoding=\"utf-8\"?> </resources>"
}
```

into
```
+--values-fr
|   +--strings.xml
+--values-en
|   +--string.xml
```

