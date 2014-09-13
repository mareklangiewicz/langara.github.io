// [ vim: set tabstop=2 shiftwidth=2 expandtab : ] 

/**                                           
 * @author marek.langiewicz@gmail.com (Marek Langiewicz)
 * @fileoverview
 * This file contains NOH library documentation (written using NOH library itself)
 */

/**
 * This function will insert whole documentation tree to DOM element with id="noh_doc" (it it finds one).
 * If there is no such element, user can still insert it wherever he wants by hand.
 */
function noh_doc_init() {
  var container = $('#noh_doc');
  if(container.length == 0)
    return;
  var doc = noh_doc();
  doc.attachToDOM(container[0]);
  if(window['SyntaxHighlighter'])
    window['SyntaxHighlighter'].all(); // strange syntax to avoid closure compiler complainings (variable SyntaxHighlighter is undeclared)
}

$(document).ready(noh_doc_init);


function noh_doc() {
  return about();
}

function about() {
  return noh.div({style:"margin:10px"},
    noh.fancy(noh.h1("NOH")),
    noh.h4("(No HTML library)"),
    noh.p("The ", noh.strong("NOH"), " library allows to create the HTML documents dynamicly in pure JavaScript ", 
      "(with almost no HTML code at all). "),
    noh.p("The basic idea is that for every HTML tag, we have special JavaScript function, that generates appropriate DOM element."),
    noh.p(
      noh.h4("Example:"),
      noh.dl(
        noh.dt("Instead of HTML code like this:"),
        noh.dd(
          noh.syntaxhl("html",
            '<div id="someid">\n' +
            '    <h2>EXAMPLE</h2>\n' +
            '    <p>\n' +
            '        <h4>Some header</h4>\n' +
            '        Some content\n' +
            '    </p>\n' +
            '    <p>\n' +
            '        <h4>Other header</h4>\n' +
            '        Other content\n' +
            '    </p>\n' +
            '</div>\n' 
          )
        ),
        noh.dt("We write JS code like this:"),
        noh.dd(
          noh.syntaxhl("js",
            'noh.div({id:"someid"},\n' +
            '    noh.h2("EXAMPLE"),\n' +
            '    noh.p(noh.h4("Some header"),"Some content"),\n' +
            '    noh.p(noh.h4("Other header"),"Other content")\n' +
            ')\n' 
          )
        )
      )
    ),

    noh.p(
      "We have a function for every HTML element like: ", noh.syntaxhl("js", "noh.table, noh.tr, noh.td, noh.div, noh.span etc..; "),
      "but also we have functions that constructs many specialized and more complex Nodes that have some dynamic behaviour ",
      "implemented like: ",
      noh.syntaxhl("js", "noh.menu, noh.oneof, noh.details, noh.syntaxhl, noh.srccode, noh.llogger, noh.plogger")
    ),
    noh.p("TODO: more introduction - how it replaces templates (there are other libraries, but...), that many times it's better to generate content from js because html is verbose (long download) etc.."),
    noh.p("TODO: more examples - with not standard tags, but still simple; with attributes and styles; different ways to insert attributes and nodes - a few examples giving the same result"),
    noh.p("TODO: about initialization; about options; about pollute:true and why we should avoid it in bigger projects;"),
    noh.p("TODO: example that adds some dynamic behavoiur, and serves as a kind of template"),
    noh.p("TODO: About compiled versions of pages - min1, min2, min3"),
    noh.p("The NOH library requires a jQuery library. (tested on: jquery-1.10.2.js)"),
    noh.p("Please check the ", noh.a({href:'noh_tests.html'}, noh.b("noh_tests.html")), " file! It demonstrates all available elements in action."),
    noh.p("Additional API documentation generated with ",
      noh.a({href:'http://usejsdoc.org/'}, "jsdoc3"),
      " will be available here: ",
      noh.a({href:'apidoc/index.html'}, "NOH API documentation")
    )
  );
};


