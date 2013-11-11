// [ vim: set tabstop=2 shiftwidth=2 expandtab : ] 

/**                                           
 * @author marek.langiewicz@gmail.com (Marek Langiewicz)
 * @fileoverview
 * This file contains NOH library tests (written using NOH library itself)
 * You have to init NOH library with option: pollute:true, to use code from this file.
 * We use the {@link http://alexgorbatchev.com/SyntaxHighlighter/|SyntaxHighlighter} to show some source code on the page.
 */                                        



/**
 * Special div for tests. Contains strong border (double), big margin and big padding
 * The reason is to be clearly visible and distinguishable from other elements.
 * @param {...noh.AttrsAndNodes} as always..
 */
function tdiv(var_args) {
  return div({"class":"noh stest"}, arguments);
}



/** @typedef {function():noh.Node} */
noh.STest;

/** @typedef {!Object.<string,!noh.STest>} */
noh.STests;

/**
 * Takes a function f that creates any noh.Node (this function represents some simple test we want to run);
 * runs this f function; creates a special Node that displays the result, but also a source code of given function and html code of the result.
 * @param {function():noh.Node} f A function with simple test code.
 * @return {noh.Element} Pretty result of running given test.
 */
function runstest(f) {
  var node = f();
  return tdiv(
    ul(
      li(h4("Source code:"), tdiv(noh.srccode(f))),
      li(h4("Result:"), tdiv(node)),
      li(h4("Result source code (html):"), tdiv(noh.syntaxhl("html", node.dom.outerHTML || new XMLSerializer().serializeToString(node.dom))))
    )
  );
}


/**
 * Runs whole tests collection
 * @param {noh.STests} stests Collection of simple tests to run.
 * @return {noh.Element} Pretty tests results.
 */
function runstests(stests) {
  var testsres = [];
  for(var t in stests)
    testsres.push(dt(h3(t)), dd(runstest(stests[t])));
  var runtests = dl(testsres);
  runtests.$.find("ul, li").css("list-style", "disc inside"); //TODO: move styles to css file
  return runtests;
}


function noh_tests() {
  return div(
    h2("Simple tests"),
    runstests(tests)
  );
};



var tests = {};


tests.h16 = function() {
  return div(
    h1("Some h1 text"),
    h2("Some h2 text"),
    h3("Some h3 text"),
    h4("Some h4 text"),
    h5("Some h5 text"),
    h6("Some h6 text")
  );
};

tests.h16_hack = function() {
  var arr = [];
  for(var i = 1; i < 7; ++i)
    arr.push(noh["h"+i]("Some h"+i+" text"));
  return div(arr);
};


tests.srccode = function() {
  return noh.srccode(tests.srccode);
};


tests.blind = function() {
  var blind = noh.blind(
    div({style:"color: blue; font-size: xx-large"}, "blind BLEBLE", br(), "BLUBLU")
  );
  var style = {"class":"noh link", style:"padding: 5px"};
  var rolldown = a(style, "blind.roll(true)");
  var rollup = a(style, "blind.roll(false)");
  var down = a(style, "alert(blind.down())");
  rolldown.$.click(function() {blind.roll(true)});
  rollup.$.click(function() {blind.roll(false)});
  down.$.click(function() {alert(blind.down())});
  return div(
    rolldown,
    rollup,
    down,
    noh.table1r({style:"border: 6px ridge green"},
      td(blind)
    )
  );
};


tests.oneof = function() {
  var oneof = noh.oneof(
    div({style:"font-style: italic; color: green; font-size: xx-large"}, "BLABLA"),
    div({style:"color: blue; font-size: xx-large"}, "BLEBLE", br(), "BLUBLU"),
    div({style:"color: red; font-size: xx-large"}, "BLIBLI", br(), br(), "BLZBLZ")
  );
  oneof.select(0);
  var style = {"class":"noh link", style:"padding: 5px"};
  var next = a(style, "oneof.next()");
  var prev = a(style, "oneof.prev()");
  var select1 = a(style, "oneof.select(1)");
  var select_1 = a(style, "oneof.select(-1)");
  next.$.click(function() {oneof.next()});
  prev.$.click(function() {oneof.prev()});
  select1.$.click(function() {oneof.select(1)});
  select_1.$.click(function() {oneof.select(-1)});
  return div(
    next,
    prev,
    select1,
    select_1,
    noh.table1r({style:"border: 6px ridge green"},
      td(oneof)
    )
  );
};

tests.details = function() {
  var bigstyle = {style:"color: brown; font-size: x-large; width: 400px;"};
  return div(
    span(bigstyle, "BASIC INFO"),
    noh.details(
      div(
        div(bigstyle, "bjkalb DETAILS"),
        div(bigstyle, "fjdsklfsd   DETAILS"),
        div("fjdsklf jksfl dsjlf djksdfl DETAILS")
      )
    )
  );
};

function gen_test_reel(reel) {
  var style = {"class":"noh link", style:"padding: 5px"};
  var addsmooth = a(style, 'reel.addclass("smooth")');
  var remsmooth = a(style, 'reel.remclass("smooth")');
  var addfast = a(style, 'reel.addclass("fast")');
  var remfast = a(style, 'reel.remclass("fast")');
  var addslow = a(style, 'reel.addclass("slow")');
  var remslow = a(style, 'reel.remclass("slow")');
  var addveryslow = a(style, 'reel.addclass("very_slow")');
  var remveryslow = a(style, 'reel.remclass("very_slow")');
  var addfancy = a(style, 'reel.addclass("fancy")');
  var remfancy = a(style, 'reel.remclass("fancy")');
  var rotate1 = a(style, "reel.rotate(1)");
  var rotate2 = a(style, "reel.rotate(2)");
  var rotate3 = a(style, "reel.rotate(3)");
  var rotatem1 = a(style, "reel.rotate(-1)");
  var rotatem2 = a(style, "reel.rotate(-2)");
  var rotatem3 = a(style, "reel.rotate(-3)");
  var spin20 = a(style, 'reel.spin(20)');
  var spinback = a(style, 'reel.spin(-12, -4, 100)');
  addsmooth.$.click(function() {reel.addclass("smooth")});
  remsmooth.$.click(function() {reel.remclass("smooth")});
  addfast.$.click(function() {reel.addclass("fast")});
  remfast.$.click(function() {reel.remclass("fast")});
  addslow.$.click(function() {reel.addclass("slow")});
  remslow.$.click(function() {reel.remclass("slow")});
  addveryslow.$.click(function() {reel.addclass("very_slow")});
  remveryslow.$.click(function() {reel.remclass("very_slow")});
  addfancy.$.click(function() {reel.addclass("fancy")});
  remfancy.$.click(function() {reel.remclass("fancy")});
  rotate1.$.click(function() {reel.rotate(1)});
  rotate2.$.click(function() {reel.rotate(2)});
  rotate3.$.click(function() {reel.rotate(3)});
  rotatem1.$.click(function() {reel.rotate(-1)});
  rotatem2.$.click(function() {reel.rotate(-2)});
  rotatem3.$.click(function() {reel.rotate(-3)});
  spin20.$.click(function() {reel.spin(20)});
  spinback.$.click(function() {reel.spin(-12, -4, 100)});
  return div(
    addsmooth,
    remsmooth, br(),
    addfast,
    remfast, br(),
    addslow, 
    remslow, br(),
    addveryslow, 
    remveryslow, br(),
    addfancy, 
    remfancy, br(),
    rotate1,
    rotate2,
    rotate3,
    rotatem1,
    rotatem2,
    rotatem3, br(),
    spin20,
    spinback,
    div(noh.table1r(td({style:"border: 6px ridge green"}, reel)))
  );
}

tests.reel1 = function() {
  var bigstyle = {style:"padding: 5px; border: solid blue; color: black; font-size: large; width: 400px; background: wheat"};
  var reel = noh.reel(5, "dynamic", "dynamic",
    div(bigstyle, "BLABLA").css("background", "green"),
    div(bigstyle, "BLABLA").css("background", "blue"),
    div(bigstyle, "BLEBLE", br(), "BLUBLU").css("width", "500px"),
    div(bigstyle, "BLEBLE", br(), "BLUBLU").css("width", "200px"),
    div(bigstyle, "BLEBLE", br(), "BLUBLU").css("width", "220px"),
    div(bigstyle, "BLIBLI", br(), "margin:10px", br(), "BLZBLZ").css("width", "270px").css("margin", "10px"),
    div(bigstyle, "BLIBLI", br(), "margin:20px", br(), "BLZBLZ").css("width", "250px").css("margin", "20px"),
    div(bigstyle, "BLIBLI", br(), br(), "BLZBLZ").css("width", "130px")
  );
  reel.select(2);
  return gen_test_reel(reel);
};



function reelnr(min, max) {
  var str = function(nr, width) {
    var s = '' + nr;
    while(s.length < width)
      s = '0' + s;
    return s;
  }
  var elements = [];
  var style = {style:"font-family: monospace; margin: 5px; padding: 15px; border: solid black; color: black; font-size: large; width: 100; background: wheat"};
  for(var i = min; i <=max; ++i)
    elements.push(div(style, "" + str(i, 3)));
  return noh.reel(3, "automatic", "automatic", elements).select(1).addclass("smooth").addclass("fancy");
}

tests.reel2 = function() {
  var reel = reelnr(1,12);
  return gen_test_reel(reel);
};



