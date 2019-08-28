import Convertor from "../source/convertors/I18NextToUniversalConvertor";
const convertor = new Convertor();

//----------- STRINGS -----------
test("Single String", () => {
    expect(convertor            
        .formatValue("Hello {{text0}}"))
        .toBe("Hello {{text}}");
});

test("Multiple Strings", () => {
    expect(convertor            
        .formatValue("Hello {{text0}}, {{text1}}"))
        .toBe("Hello {{text}}, {{text}}");
});

//----------- NUMBER -----------
test("Single number", () => {
    expect(convertor            
        .formatValue("you have {{number0}} message"))
        .toBe("you have {{number}} message");
});

test("Multiple number", () => {
    expect(convertor            
        .formatValue("you have {{number0}} unread message and {{number1}} total"))
        .toBe("you have {{number}} unread message and {{number}} total");
});

test("Single number percent", () => {
    expect(convertor            
        .formatValue("{{number0}}%"))
        .toBe("{{number}}%");
});

test("Single number dollar", () => {
    expect(convertor            
        .formatValue("{{number0}} $"))
        .toBe("{{number}} $");
});

//----------- FLOAT -----------
test("Single float prefix", () => {
    expect(convertor            
        .formatValue("{{decimal0}} student"))
        .toBe("{{float}} student");
});

test("Single float precision prefix", () => {
    expect(convertor            
        .formatValue("{{decimal0, 0.00}} student"))
        .toBe("{{float:2}} student");
});

test("Single float postfix", () => {
    expect(convertor            
        .formatValue("prefix {{decimal0}}"))
        .toBe("prefix {{float}}");
});

test("Single float precision postfix", () => {
    expect(convertor            
        .formatValue("prefix {{decimal0, 0.00}}"))
        .toBe("prefix {{float:2}}");
});

test("Single float percent", () => {
    expect(convertor            
        .formatValue("{{decimal0}}%"))
        .toBe("{{float}}%");
});

test("Single float dollar", () => {
    expect(convertor            
        .formatValue("{{decimal0}} $"))
        .toBe("{{float}} $");
});

test("Multiple floats", () => {
    expect(convertor            
        .formatValue("{{decimal0}} / {{decimal1}}"))
        .toBe("{{float}} / {{float}}");
});

test("Multiple floats, first precisions", () => {
    expect(convertor            
        .formatValue("{{decimal0, 0.00}} / {{decimal1}}"))
        .toBe("{{float:2}} / {{float}}");
});

test("Multiple floats, second precisions", () => {
    expect(convertor            
        .formatValue("{{decimal0}} / {{decimal1, 0.00}}"))
        .toBe("{{float}} / {{float:2}}");
});

test("Multiple precisions floats", () => {
    expect(convertor            
        .formatValue("{{decimal0, 0.00}} / {{decimal1, 0.00}}"))
        .toBe("{{float:2}} / {{float:2}}");
});

test("Float precision two digits", () => {
    expect(convertor            
        .formatValue("{{decimal0, 0.0000000000}}"))
        .toBe("{{float:10}}");
});

test("Float precision three digits", () => {
    expect(convertor            
        .formatValue("{{decimal0, 0.0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000}}"))
        .toBe("{{float:100}}");
});

//----------- MULTIPLE VARIABLE TYPE -----------
test("All variable type", () => {
    expect(convertor            
        .formatValue("{{text0}} with {{number0}} cause {{decimal0}}"))
        .toBe("{{text}} with {{number}} cause {{float}}");
});

test("All variable type #2", () => {
    expect(convertor            
        .formatValue("{{text0}} / {{text1}} / {{number0}} / {{decimal0}}"))
        .toBe("{{text}} / {{text}} / {{number}} / {{float}}");
});

test("All variable type #2", () => {
    expect(convertor            
        .formatValue("{{text0}} / {{text1}} / {{number0}} / {{decimal0, 0.00}}"))
        .toBe("{{text}} / {{text}} / {{number}} / {{float:2}}");
});