import IO from "./IO";

var fs = require('fs');
const DEFAULT_LANGUAGE_KEY = "default";
const DEFAULT_FOLDER_NAME = "values";

class AndroidIO extends IO {

    read(filePath) {
        var paths = this._getFilePaths(filePath);
        paths.forEach(path => {
            var splittedPath = path.split('/');
            var key = splittedPath[splittedPath.length - 2];
            if (key == DEFAULT_FOLDER_NAME) {
                key = DEFAULT_LANGUAGE_KEY;
            } else {
                key = key.replace(DEFAULT_FOLDER_NAME + "-", "");
            }
            this._files[key] = fs.readFileSync(path, 'utf-8');
        });
    }

    write(outputPath) {
        for (const key in this._files) {
            if (this._files.hasOwnProperty(key)) {
                var folderParent;
                if (key == DEFAULT_LANGUAGE_KEY) {
                    folderParent = DEFAULT_FOLDER_NAME;
                } else {
                    folderParent = DEFAULT_FOLDER_NAME + "-" + key;
                }
                var fileOutputPath = outputPath + "/" + folderParent + "/string.xml";
                this._writeFile(fileOutputPath, this._files[key], (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
    }
}
export default AndroidIO;