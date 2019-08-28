import Convertor from "../source/convertors/UniversalToAndroidConvertor";
const convertor = new Convertor();

//----------- STRINGS -----------
test("Single String", () => {
    expect(convertor
            .formatValue("Hello {{text}}"))
        .toBe("Hello %1$s");
});

test("Multiple Strings", () => {
    expect(convertor
            .formatValue("Hello {{text}}, {{text}}"))
        .toBe("Hello %1$s, %2$s");
});

//----------- NUMBER -----------
test("Single number", () => {
    expect(convertor
            .formatValue("you have {{number}} message"))
        .toBe("you have %1$d message");
});

test("Multiple number", () => {
    expect(convertor
            .formatValue("you have {{number}} unread message and {{number}} total"))
        .toBe("you have %1$d unread message and %2$d total");
});

test("Single number percent", () => {
    expect(convertor
            .formatValue("{{number}}%"))
        .toBe("%1$d%");
});

test("Single number dollar", () => {
    expect(convertor
            .formatValue("{{number}} $"))
        .toBe("%1$d $");
});

//----------- FLOAT -----------
test("Single float prefix", () => {
    expect(convertor
            .formatValue("{{float}} student"))
        .toBe("%1$f student");
});

test("Single float precision prefix", () => {
    expect(convertor
            .formatValue("{{float:2}} student"))
        .toBe("%1$.2f student");
});

test("Single float postfix", () => {
    expect(convertor
            .formatValue("prefix {{float}}"))
        .toBe("prefix %1$f");
});

test("Single float precision postfix", () => {
    expect(convertor
            .formatValue("prefix {{float:2}}"))
        .toBe("prefix %1$.2f");
});

test("Single float percent", () => {
    expect(convertor
            .formatValue("{{float}}%"))
        .toBe("%1$f%");
});

test("Single float dollar", () => {
    expect(convertor
            .formatValue("{{float}} $"))
        .toBe("%1$f $");
});

test("Multiple floats", () => {
    expect(convertor
            .formatValue("{{float}} / {{float}}"))
        .toBe("%1$f / %2$f");
});

test("Multiple floats, first precisions", () => {
    expect(convertor
            .formatValue("{{float:2}} / {{float}}"))
        .toBe("%1$.2f / %2$f");
});

test("Multiple floats, second precisions", () => {
    expect(convertor
            .formatValue("{{float}} / {{float:2}}"))
        .toBe("%1$f / %2$.2f");
});

test("Multiple precisions floats", () => {
    expect(convertor
            .formatValue("{{float:2}} / {{float:2}}"))
        .toBe("%1$.2f / %2$.2f");
});

test("Float precision empty", () => {
    expect(convertor
            .formatValue("{{float:}}"))
        .toBe("%1$f");
});

test("Float precision two digits", () => {
    expect(convertor
            .formatValue("{{float:10}}"))
        .toBe("%1$.10f");
});

test("Float precision three digits", () => {
    expect(convertor
            .formatValue("{{float:100}}"))
        .toBe("%1$.100f");
});

//----------- MULTIPLE VARIABLE TYPE -----------
test("All variable type", () => {
    expect(convertor
            .formatValue("{{text}} with {{number}} cause {{float}}"))
        .toBe("%1$s with %2$d cause %3$f");
});

test("All variable type #2", () => {
    expect(convertor
            .formatValue("{{text}} / {{text}} / {{number}} / {{float}}"))
        .toBe("%1$s / %2$s / %3$d / %4$f");
});

test("All variable type #2", () => {
    expect(convertor
            .formatValue("{{text}} / {{text}} / {{number}} / {{float:2}}"))
        .toBe("%1$s / %2$s / %3$d / %4$.2f");
});

//----------- ANDROID SPECIFIC -----------
test("Android apostrophe", () => {
    expect(convertor
            .formatValue("No i don't"))
        .toBe("No i don\'t");
});

test("Android special caract: &", () => {
    expect(convertor
            .formatValue("M&M"))
        .toBe("M&amp;M");
});

test("Android special caract: <", () => {
    expect(convertor
            .formatValue("M<M"))
        .toBe("M&lt;M");
});

test("Android special caract: >", () => {
    expect(convertor
            .formatValue("M>M"))
        .toBe("M&gt;M");
});

//----------- CDATA -----------
test("Valide CDATA", () => {
    expect(convertor
            .formatValue("<![CDATA[M>M]]>"))
        .toBe("<![CDATA[M>M]]>");
});

test("CDATA with prefix", () => {
    expect(convertor
            .formatValue("Hey look <![CDATA[M>M]]>"))
        .toBe("Hey look &lt;![CDATA[M&gt;M]]&gt;");
});

test("CDATA with postfix", () => {
    expect(convertor
            .formatValue("<![CDATA[M>M]]> postfix"))
        .toBe("&lt;![CDATA[M&gt;M]]&gt; postfix");
});