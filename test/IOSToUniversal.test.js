import Convertor from "../source/convertors/IOSToUniversalConvertor";
const convertor = new Convertor();

//----------- STRINGS -----------
test("Single String", () => {
    expect(convertor            
        .formatValue("Hello %s"))
        .toBe("Hello {{text}}");
});

test("Multiple Strings", () => {
    expect(convertor            
        .formatValue("Hello %s, %s"))
        .toBe("Hello {{text}}, {{text}}");
});

//----------- NUMBER -----------
test("Single number", () => {
    expect(convertor            
        .formatValue("you have %@ message"))
        .toBe("you have {{number}} message");
});

test("Multiple number", () => {
    expect(convertor            
        .formatValue("you have %@ unread message and %@ total"))
        .toBe("you have {{number}} unread message and {{number}} total");
});

test("Single number percent", () => {
    expect(convertor            
        .formatValue("%@%"))
        .toBe("{{number}}%");
});

test("Single number dollar", () => {
    expect(convertor            
        .formatValue("%@ $"))
        .toBe("{{number}} $");
});

//----------- FLOAT -----------
test("Single float prefix", () => {
    expect(convertor            
        .formatValue("%f student"))
        .toBe("{{float}} student");
});

test("Single float precision prefix", () => {
    expect(convertor            
        .formatValue("%.2f student"))
        .toBe("{{float:2}} student");
});

test("Single float postfix", () => {
    expect(convertor            
        .formatValue("prefix %f"))
        .toBe("prefix {{float}}");
});

test("Single float precision postfix", () => {
    expect(convertor            
        .formatValue("prefix %.2f"))
        .toBe("prefix {{float:2}}");
});

test("Single float percent", () => {
    expect(convertor            
        .formatValue("%f%"))
        .toBe("{{float}}%");
});

test("Single float dollar", () => {
    expect(convertor            
        .formatValue("%f $"))
        .toBe("{{float}} $");
});

test("Multiple floats", () => {
    expect(convertor            
        .formatValue("%f / %f"))
        .toBe("{{float}} / {{float}}");
});

test("Multiple floats, first precisions", () => {
    expect(convertor            
        .formatValue("%.2f / %f"))
        .toBe("{{float:2}} / {{float}}");
});

test("Multiple floats, second precisions", () => {
    expect(convertor            
        .formatValue("%f / %.2f"))
        .toBe("{{float}} / {{float:2}}");
});

test("Multiple precisions floats", () => {
    expect(convertor            
        .formatValue("%.2f / %.2f"))
        .toBe("{{float:2}} / {{float:2}}");
});

test("Float precision two digits", () => {
    expect(convertor            
        .formatValue("%.10f"))
        .toBe("{{float:10}}");
});

test("Float precision three digits", () => {
    expect(convertor            
        .formatValue("%.100f"))
        .toBe("{{float:100}}");
});

//----------- MULTIPLE VARIABLE TYPE -----------
test("All variable type", () => {
    expect(convertor            
        .formatValue("%s with %@ cause %f"))
        .toBe("{{text}} with {{number}} cause {{float}}");
});

test("All variable type #2", () => {
    expect(convertor            
        .formatValue("%s / %s / %@ / %f"))
        .toBe("{{text}} / {{text}} / {{number}} / {{float}}");
});

test("All variable type #2", () => {
    expect(convertor            
        .formatValue("%s / %s / %@ / %.2f"))
        .toBe("{{text}} / {{text}} / {{number}} / {{float:2}}");
});