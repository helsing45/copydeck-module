import IO from "./IO";
const fs = require('fs');

class CsvIO extends IO {

    read(filePath) {
        var paths = this._getFilePaths(filePath);
        for (let index = 0; index < paths.length; index++) {
            const path = paths[index];

            var splittedPaths = path.split('/');
            var fileName = splittedPaths[splittedPaths.length - 1].split('.')[0];
            this._files[fileName] = fs.readFileSync(path, 'utf-8');

        }
    }

    write(outputPath) {
        for (const key in this._files) {
            if (this._files.hasOwnProperty(key)) {
                var fileOutputPath = outputPath + "/" + key + ".csv";
                this._writeFile(fileOutputPath, this._files[key], (err) => {
                    if (err) {
                        console.log(err);
                    }
                })
            }
        }
    }


}
export default CsvIO;