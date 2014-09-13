
/** @param {...noh.AttrsAndNodes} var_args as always.. */
var prettydiv = function(var_args) {
    var an = noh.organize(arguments);
    return noh.div({style:"margin: 25px; padding:15px; border: double"}, an.attrs, an.nodes);
};



var example = function() {
    return noh.div(
        noh.h1("Simple NOH example"),
        noh.h4("(check the noh_example.js file)"),
        noh.p("TODO: add some styles, borders etc; add some function that acts as a kind of a template"),
        prettydiv(
            noh.h3("Lets check out some table"),
            noh.table(
                noh.tr(
                    noh.td("first cell in first row"),
                    noh.td("second cell in first row"),
                    noh.td("third cell in first row")
                ),
                noh.tr(
                    noh.td("first cell in second row"),
                    noh.td("second cell in second row"),
                    noh.td("third cell in second row")
                )
            )
        ),
        prettydiv(
            noh.h3("Now lets check out some inputs"),
            noh.input({type:"text"}),
            noh.input({type:"button"}),
            noh.input({type:"checkbox"}),
            noh.input({type:"color"}),
            noh.input({type:"date"}),
            noh.input({type:"file"}),
            noh.input({type:"radio"}),
            noh.input({type:"time"}),
            noh.input({type:"week"}),
            noh.p("TODO: better inputs examples")
        )
    );
};


function init() {
    var root = document.getElementById('noh_example');
    var ex = example();
    ex.attachToDOM(root);
    $("td").css("border", "solid");
}

$(document).ready(init);

