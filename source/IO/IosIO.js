import IO from "./IO";

var fs = require('fs');
const DEFAULT_LANGUAGE_KEY = "Base";

class IosIO extends IO {

    constructor(){
        super();
        this.defaultLang;
    }
    get defaultLang() {
        return this._defaultLang;
    }

    set defaultLang(defaultLang) {
        this._defaultLang = defaultLang;
    }

    set file(files) {
        if (this._defaultLang && files.hasOwnProperty(this._defaultLang)) {
            Object.defineProperty(files, DEFAULT_LANGUAGE_KEY, Object.getOwnPropertyDescriptor(files, this._defaultLang));
            delete files[this._defaultLang];
        }
        this._files = files;
}

    read(filePath) {
        var paths = this._getFilePaths(filePath);
        paths.forEach(path => {
            var splittedPath = path.split("/");
            var key = splittedPath[splittedPath.length - 2].split(".")[0];
            this._files[key] = fs.readFileSync(path, 'utf-8');
        });
    }

    write(outputPath) {
        for (const key in this._files) {
            if (this._files.hasOwnProperty(key)) {
                var fileOutputPath = outputPath + "/" + key + ".lproj/Localizable.strings";
                this._writeFile(fileOutputPath, this._files[key], (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
    }
}
export default IosIO;