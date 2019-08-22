import Translator from "./translator/Translator";

exports.translateToFile = function(config){
  return new Translator()
      .from(config.from)
      .readFile(config.readPath)
      .filter(config.filter)
      .defineDefaultLang(config.defaultLang)
      .to(config.to)
      .translateToFile(config.writePath);
}