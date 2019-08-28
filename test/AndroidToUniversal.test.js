import Convertor from "../source/convertors/AndroidToUniversalConvertor";
const convertor = new Convertor();

//----------- STRINGS -----------
test("Single String", () => {
    expect(convertor
            .formatValue("Hello %1$s"))
        .toBe("Hello {{text}}");
});

test("Multiple Strings", () => {
    expect(convertor
            .formatValue("Hello %1$s, %2$s"))
        .toBe("Hello {{text}}, {{text}}");
});

//----------- NUMBER -----------
test("Single number", () => {
    expect(convertor
            .formatValue("you have %1$d message"))
        .toBe("you have {{number}} message");
});

test("Multiple number", () => {
    expect(convertor
            .formatValue("you have %1$d unread message and %2$d total"))
        .toBe("you have {{number}} unread message and {{number}} total");
});

test("Single number percent", () => {
    expect(convertor
            .formatValue("%1$d%"))
        .toBe("{{number}}%");
});

test("Single number dollar", () => {
    expect(convertor
            .formatValue("%1$d $"))
        .toBe("{{number}} $");
});

//----------- FLOAT -----------
test("Single float prefix", () => {
    expect(convertor
            .formatValue("%1$f student"))
        .toBe("{{float}} student");
});

test("Single float precision prefix", () => {
    expect(convertor
            .formatValue("%1$.2f student"))
        .toBe("{{float:2}} student");
});

test("Single float postfix", () => {
    expect(convertor
            .formatValue("prefix %1$f"))
        .toBe("prefix {{float}}");
});

test("Single float precision postfix", () => {
    expect(convertor
            .formatValue("prefix %1$.2f"))
        .toBe("prefix {{float:2}}");
});

test("Single float percent", () => {
    expect(convertor
            .formatValue("%1$f%"))
        .toBe("{{float}}%");
});

test("Single float dollar", () => {
    expect(convertor
            .formatValue("%1$f $"))
        .toBe("{{float}} $");
});

test("Multiple floats", () => {
    expect(convertor
            .formatValue("%1$f / %2$f"))
        .toBe("{{float}} / {{float}}");
});

test("Multiple floats, first precisions", () => {
    expect(convertor
            .formatValue("%1$.2f / %2$f"))
        .toBe("{{float:2}} / {{float}}");
});

test("Multiple floats, second precisions", () => {
    expect(convertor
            .formatValue("%1$f / %2$.2f"))
        .toBe("{{float}} / {{float:2}}");
});

test("Multiple precisions floats", () => {
    expect(convertor
            .formatValue("%1$.2f / %2$.2f"))
        .toBe("{{float:2}} / {{float:2}}");
});

test("Float precision empty", () => {
    expect(convertor
            .formatValue("%1$f"))
        .toBe("{{float}}");
});

test("Float precision two digits", () => {
    expect(convertor
            .formatValue("%1$.10f"))
        .toBe("{{float:10}}");
});

test("Float precision three digits", () => {
    expect(convertor
            .formatValue("%1$.100f"))
        .toBe("{{float:100}}");
});

//----------- MULTIPLE VARIABLE TYPE -----------
test("All variable type", () => {
    expect(convertor
            .formatValue("%1$s with %2$d cause %3$f"))
        .toBe("{{text}} with {{number}} cause {{float}}");
});

test("All variable type #2", () => {
    expect(convertor
            .formatValue("%1$s / %2$s / %3$d / %4$f"))
        .toBe("{{text}} / {{text}} / {{number}} / {{float}}");
});

test("All variable type #2", () => {
    expect(convertor
            .formatValue("%1$s / %2$s / %3$d / %4$.2f"))
        .toBe("{{text}} / {{text}} / {{number}} / {{float:2}}");
});

//----------- ANDROID SPECIFIC -----------
test("Android apostrophe", () => {
    expect(convertor
            .formatValue("No i don\'t"))
        .toBe("No i don't");
});

test("Android special caract: &", () => {
    expect(convertor
            .formatValue("M&amp;M"))
        .toBe("M&M");
});

test("Android special caract: <", () => {
    expect(convertor
            .formatValue("M&lt;M"))
        .toBe("M<M");
});

test("Android special caract: >", () => {
    expect(convertor
            .formatValue("M&gt;M"))
        .toBe("M>M");
});

//----------- CDATA -----------
test("Valide CDATA", () => {
    expect(convertor
            .formatValue("<![CDATA[M>M]]>"))
        .toBe("<![CDATA[M>M]]>");
});

test("CDATA with prefix", () => {
    expect(convertor
            .formatValue("Hey look &lt;![CDATA[M&gt;M]]&gt;"))
        .toBe("Hey look <![CDATA[M>M]]>");
});

test("CDATA with postfix", () => {
    expect(convertor
            .formatValue("&lt;![CDATA[M&gt;M]]&gt; postfix"))
        .toBe("<![CDATA[M>M]]> postfix");
});