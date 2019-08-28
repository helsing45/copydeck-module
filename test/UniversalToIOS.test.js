import Convertor from "../source/convertors/UniversalToIOSConvertor";
const convertor = new Convertor();

//----------- STRINGS -----------
test("Single String", () => {
    expect(convertor
            .formatValue("Hello {{text}}"))
        .toBe("Hello %s");
});

test("Multiple Strings", () => {
    expect(convertor
            .formatValue("Hello {{text}}, {{text}}"))
        .toBe("Hello %s, %s");
});

//----------- NUMBER -----------
test("Single number", () => {
    expect(convertor
            .formatValue("you have {{number}} message"))
        .toBe("you have %@ message");
});

test("Multiple number", () => {
    expect(convertor
            .formatValue("you have {{number}} unread message and {{number}} total"))
        .toBe("you have %@ unread message and %@ total");
});

test("Single number percent", () => {
    expect(convertor
            .formatValue("{{number}}%"))
        .toBe("%@%");
});

test("Single number dollar", () => {
    expect(convertor
            .formatValue("{{number}} $"))
        .toBe("%@ $");
});

//----------- FLOAT -----------
test("Single float prefix", () => {
    expect(convertor
            .formatValue("{{float}} student"))
        .toBe("%f student");
});

test("Single float precision prefix", () => {
    expect(convertor
            .formatValue("{{float:2}} student"))
        .toBe("%.2f student");
});

test("Single float postfix", () => {
    expect(convertor
            .formatValue("prefix {{float}}"))
        .toBe("prefix %f");
});

test("Single float precision postfix", () => {
    expect(convertor
            .formatValue("prefix {{float:2}}"))
        .toBe("prefix %.2f");
});

test("Single float percent", () => {
    expect(convertor
            .formatValue("{{float}}%"))
        .toBe("%f%");
});

test("Single float dollar", () => {
    expect(convertor
            .formatValue("{{float}} $"))
        .toBe("%f $");
});

test("Multiple floats", () => {
    expect(convertor
            .formatValue("{{float}} / {{float}}"))
        .toBe("%f / %f");
});

test("Multiple floats, first precisions", () => {
    expect(convertor
            .formatValue("{{float:2}} / {{float}}"))
        .toBe("%.2f / %f");
});

test("Multiple floats, second precisions", () => {
    expect(convertor
            .formatValue("{{float}} / {{float:2}}"))
        .toBe("%f / %.2f");
});

test("Multiple precisions floats", () => {
    expect(convertor
            .formatValue("{{float:2}} / {{float:2}}"))
        .toBe("%.2f / %.2f");
});

test("Float precision empty", () => {
    expect(convertor
            .formatValue("{{float:}}"))
        .toBe("%f");
});

test("Float precision two digits", () => {
    expect(convertor
            .formatValue("{{float:10}}"))
        .toBe("%.10f");
});

test("Float precision three digits", () => {
    expect(convertor
            .formatValue("{{float:100}}"))
        .toBe("%.100f");
});

//----------- MULTIPLE VARIABLE TYPE -----------
test("All variable type", () => {
    expect(convertor
            .formatValue("{{text}} with {{number}} cause {{float}}"))
        .toBe("%s with %@ cause %f");
});

test("All variable type #2", () => {
    expect(convertor
            .formatValue("{{text}} / {{text}} / {{number}} / {{float}}"))
        .toBe("%s / %s / %@ / %f");
});

test("All variable type #2", () => {
    expect(convertor
            .formatValue("{{text}} / {{text}} / {{number}} / {{float:2}}"))
        .toBe("%s / %s / %@ / %.2f");
});