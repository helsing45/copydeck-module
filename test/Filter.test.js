import Translator from "../source/translator/Translator";

test("Filter single condition", () => testFilter('Target == "Android"',["ID-002","ID-005"]));
test("Filter two condition OR", () => testFilter('Target == "Android" || Target == "Mobile"',["ID-001","ID-002","ID-004","ID-005"]));
test("Filter two condition AND", () => testFilter('Target == "Mobile" && Project == "P1"',["ID-004"]));
test("Filter two group of condition", () => testFilter('(Target == "Mobile" || Target == "Android") && Project == "P1"',["ID-004","ID-005"]));
test("Filter two OR group", () => testFilter('(Target == "Mobile" || Target == "Android") && (Project == "P1" || Project == "All")',["ID-004","ID-005","ID-006"]));
test("Empty filter", () => testFilter('',["ID-001","ID-002","ID-003","ID-004","ID-005"]));
test("Undefined filter", () => testFilter(undefined,["ID-001","ID-002","ID-003","ID-004","ID-005"]));


function testFilter(filter,resultId){
    new Translator()
    .from("universal")
    .readFile("./test/files/universal_items_for_filter.json")
    .filter(filter)
    .to("universal")
    .translate()
    .then((x) => {
        return expect(testIDs(x,resultId)).toBe(true);
    });
}

function testIDs(result, ids){
    if(result.size != ids.size){
        return false;
    }
    let resultIds = [];
    for (const resultItems of result) {
        resultIds.push(resultItems._ids.string);
    }
    resultIds.sort((a,b)=> sortAlphabetically(a,b));
    ids.sort((a,b)=> sortAlphabetically(a,b));
    for (let index = 0; index < ids.length; index++) {
        if(resultIds[index] != ids[index]){
            return false;
        }       
    }
    return true;
}

function sortAlphabetically(a,b){
    if(a < b) { return -1; }
    if(a > b) { return 1; }
    return 0;

}