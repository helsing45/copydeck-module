import IO from "./IO";
const fs = require('fs');

class CsvIO extends IO {

    read(filePath){
        console.log("Trying to read: " + filePath);
        var files = this._getFilePaths(filePath);
        console.log("Found: " + files);
        console.log(fs.readFileSync(files[0],'utf-8'));
    }
    

}
export default CsvIO;