import Convertor from "../source/convertors/UniversalToI18NextConvertor";
const convertor = new Convertor();

//----------- STRINGS -----------
test("Single String", () => {
    expect(convertor
            .formatValue("Hello {{text}}"))
        .toBe("Hello {{text0}}");
});

test("Multiple Strings", () => {
    expect(convertor
            .formatValue("Hello {{text}}, {{text}}"))
        .toBe("Hello {{text0}}, {{text1}}");
});

//----------- NUMBER -----------
test("Single number", () => {
    expect(convertor
            .formatValue("you have {{number}} message"))
        .toBe("you have {{number0}} message");
});

test("Multiple number", () => {
    expect(convertor
            .formatValue("you have {{number}} unread message and {{number}} total"))
        .toBe("you have {{number0}} unread message and {{number1}} total");
});

test("Single number percent", () => {
    expect(convertor
            .formatValue("{{number}}%"))
        .toBe("{{number0}}%");
});

test("Single number dollar", () => {
    expect(convertor
            .formatValue("{{number}} $"))
        .toBe("{{number0}} $");
});

//----------- FLOAT -----------
test("Single float prefix", () => {
    expect(convertor
            .formatValue("{{float}} student"))
        .toBe("{{decimal0}} student");
});

test("Single float precision prefix", () => {
    expect(convertor
            .formatValue("{{float:2}} student"))
        .toBe("{{decimal0, 0.00}} student");
});

test("Single float postfix", () => {
    expect(convertor
            .formatValue("prefix {{float}}"))
        .toBe("prefix {{decimal0}}");
});

test("Single float precision postfix", () => {
    expect(convertor
            .formatValue("prefix {{float:2}}"))
        .toBe("prefix {{decimal0, 0.00}}");
});

test("Single float percent", () => {
    expect(convertor
            .formatValue("{{float}}%"))
        .toBe("{{decimal0}}%");
});

test("Single float dollar", () => {
    expect(convertor
            .formatValue("{{float}} $"))
        .toBe("{{decimal0}} $");
});

test("Multiple floats", () => {
    expect(convertor
            .formatValue("{{float}} / {{float}}"))
        .toBe("{{decimal0}} / {{decimal1}}");
});

test("Multiple floats, first precisions", () => {
    expect(convertor
            .formatValue("{{float:2}} / {{float}}"))
        .toBe("{{decimal0, 0.00}} / {{decimal1}}");
});

test("Multiple floats, second precisions", () => {
    expect(convertor
            .formatValue("{{float}} / {{float:2}}"))
        .toBe("{{decimal0}} / {{decimal1, 0.00}}");
});

test("Multiple precisions floats", () => {
    expect(convertor
            .formatValue("{{float:2}} / {{float:2}}"))
        .toBe("{{decimal0, 0.00}} / {{decimal1, 0.00}}");
});

test("Float precision empty", () => {
    expect(convertor
            .formatValue("{{float:}}"))
        .toBe("{{decimal0}}");
});

test("Float precision two digits", () => {
    expect(convertor
            .formatValue("{{float:10}}"))
        .toBe("{{decimal0, 0.0000000000}}");
});

test("Float precision three digits", () => {
    expect(convertor
            .formatValue("{{float:100}}"))
        .toBe("{{decimal0, 0.0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000}}");
});

//----------- MULTIPLE VARIABLE TYPE -----------
test("All variable type", () => {
    expect(convertor
            .formatValue("{{text}} with {{number}} cause {{float}}"))
        .toBe("{{text0}} with {{number0}} cause {{decimal0}}");
});

test("All variable type #2", () => {
    expect(convertor
            .formatValue("{{text}} / {{text}} / {{number}} / {{float}}"))
        .toBe("{{text0}} / {{text1}} / {{number0}} / {{decimal0}}");
});

test("All variable type #2", () => {
    expect(convertor
            .formatValue("{{text}} / {{text}} / {{number}} / {{float:2}}"))
        .toBe("{{text0}} / {{text1}} / {{number0}} / {{decimal0, 0.00}}");
});