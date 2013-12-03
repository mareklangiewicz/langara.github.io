// [ vim: set tabstop=2 shiftwidth=2 expandtab : ] 

/**                                           
 * @author marek.langiewicz@gmail.com (Marek Langiewicz)
 * @fileoverview
 * This file contains NOH library documentation (written using NOH library itself)
 * You have to init NOH library with option: pollute:true first, to use code from this file.
 */



function noh_doc() {
  return about();
}

function about() {
  return div({style:"margin:10px"},
    noh.fancy(h1("NOH")),
    h4("(No HTML library)"),
    p("The ", strong("NOH"), " library allows to create the HTML documents dynamicly in pure JavaScript ", 
      "(with almost no HTML code at all). "),
    p("The basic idea is that for every HTML tag, we have special JavaScript function, that generates appropriate DOM element."),
    p(
      h4("Example:"),
      dl(
        dt("Instead of HTML code like this:"),
        dd(
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
        dt("We write JS code like this:"),
        dd(
          noh.syntaxhl("js",
            'div({id:"someid"},\n' +
            '    h2("EXAMPLE"),\n' +
            '    p(h4("Some header"),"Some content"),\n' +
            '    p(h4("Other header"),"Other content")\n' +
            ')\n' 
          )
        )
      )
    ),

    p(
      "We have a function for every HTML element like: ", noh.syntaxhl("js", "table, tr, td, div, span etc..; "),
      "but also we have functions that constructs many specialized and more complex Nodes that have some dynamic behaviour ",
      "implemented like: ",
      noh.syntaxhl("js", "noh.menu, noh.oneof, noh.details, noh.syntaxhl, noh.srccode, noh.llogger, noh.plogger")
    ),
    p("TODO: more introduction - how it replaces templates (there are other libraries, but...), that many times it's better to generate content from js because html is verbose (long download) etc.."),
    p("TODO: more examples - with not standard tags, but still simple; with attributes and styles; different ways to insert attributes and nodes - a few examples giving the same result"),
    p("TODO: about initialization; about options; about pollute:true and why we should avoid it in bigger projects;"),
    p("TODO: example that adds some dynamic behavoiur, and serves as a kind of template"),
    p("The NOH library requires a jQuery library. (tested on: jquery-1.10.2.js)"),
    p("Please check the ", a({href:'noh_tests.html'}, b("noh_tests.html")), " file! It demonstrates all available elements in action."),
    p("Additional API documentation generated with ",
      a({href:'http://usejsdoc.org/'}, "jsdoc3"),
      " will be available here: ",
      a({href:'apidoc/index.html'}, "NOH API documentation")
    )
  );
};


