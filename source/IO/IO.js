
const fs = require('fs');
var getDirName = require('path').dirname;
var mkdirp = require('mkdirp');

class IO {
    constructor() {
        this._files = {};
    }

    read(filePath) {
        
    }

    write(filePath){

    }

    get file() {
        return this._files;
    }

    set file(files) {
        this._files = files;
    }    

    _getFilePaths(filePath){
        var filePaths =[];
        var files = fs.readdirSync(filePath,'utf-8');
        for (let index = 0; index < files.length; index++) {
            const path = filePath + "/" + files[index];
            if(fs.lstatSync(path).isDirectory()){
                filePaths = filePaths.concat(this._getFilePaths(path));
            }else{
                filePaths.push(path);
            }
            
        }
        return filePaths;
    }
    

    _writeFile(path, contents, cb) {
        mkdirp(getDirName(path), function (err) {
            if (err) return cb(err);

            fs.writeFile(path, contents, cb);
        });
    }
}
export default IO;