
function init() {
    noh.init({smooth:"slow", pollute:true});
    var body = noh.div(noh_doc(), noh_tests());
    body.attachToDOM(document.body);
    SyntaxHighlighter.all();
}


$(document).ready(init);

