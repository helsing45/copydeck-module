
class Translator{
    constructor(inputFile,inputMapTransformater,outputMapTransformer,outputFile){
        this.inputFile = inputFile;
        this.inputMapTransformater = inputMapTransformater;
        this.outputMapTransformer = outputMapTransformer;
        this.outputFile = outputFile;
    }

    translate(outputPath){
        this.inputMapTransformater.toBaseForm(this.inputFile).then((x)=>{
            this.outputFile.file = this.outputMapTransformer.fromBaseForm(this.filter(x));
            this.outputFile.write(outputPath);
        });
    }

    filter(input){
        //TODO
        return input;
    }

}
export default Translator;