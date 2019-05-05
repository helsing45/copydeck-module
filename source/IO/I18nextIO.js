import IO from "./IO";

var fs = require('fs');

class I18nextIO extends IO {
    read(filePath) {
        var paths = this._getFilePaths(filePath);
        paths.forEach(path => {
            var splittedPath = path.split('/');
            var key = splittedPath[splittedPath.length - 1].split('.')[0];
            this._files[key] = fs.readFileSync(path, 'utf-8');
        });
    }

    write(outputPath) {
        for (const key in this._files) {
            if (this._files.hasOwnProperty(key)) {
                var fileOutputPath = outputPath + "/" + key + ".json";
                this._writeFile(fileOutputPath, this._files[key], (err) => {
                    if (err) {
                        console.log(err);
                    }
                })
            }
        }
    }
}
export default I18nextIO;