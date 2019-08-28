import ConversionItem from "../model/ConversionItem";

class ToUniversalConvertor{
    convert(input){
        return new Promise((resolve)=>{
            resolve(ConversionItem.parse(input._files[Object.keys(input._files)[0]]));
        });
    }
}
export default ToUniversalConvertor;