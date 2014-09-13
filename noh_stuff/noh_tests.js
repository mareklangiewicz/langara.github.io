// [ vim: set tabstop=2 shiftwidth=2 expandtab : ] 

/**                                           
 * @author marek.langiewicz@gmail.com (Marek Langiewicz)
 * @fileoverview
 * This file contains NOH library tests (written using NOH library itself)
 * You have to init NOH library with option: pollute:true, to use code from this file.
 * We use the {@link http://alexgorbatchev.com/SyntaxHighlighter/|SyntaxHighlighter}
 * to show some source code on the page.
 */                                        






/**
 * This function will insert tree with all tests to DOM element with id="noh_tests"
 * (if it finds one).If there is no such element, user can still insert it
 * wherever he wants, using noh_tests() function by hand.
 */
function noh_tests_init() {
  var container = $('#noh_tests');
  if(container.length == 0)
    return;
  var tests = noh_tests();
  tests.attachToDOM(container[0]);
  if(window['SyntaxHighlighter'])
    window['SyntaxHighlighter'].all(); // strange syntax to avoid closure compiler complainings
      // (like: variable SyntaxHighlighter is undeclared)
}

$(document).ready(noh_tests_init);









/**
 * Special div for tests. Contains strong border (double), big margin and big padding
 * The reason is to be clearly visible and distinguishable from other elements.
 * @param {...noh.AttrsAndNodes} var_args as always..
 * @return {!noh.Element}
 */
function tdiv(var_args) {
  return noh.div({"class":"noh stest"}, arguments);
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
    noh.ul(
      noh.li(noh.h4("Source code:"), noh.srccode(f)),
      noh.li(noh.h4("Result:"), tdiv(node)),
      noh.li(
        noh.h4("Result source code (html):"),
        noh.syntaxhl(
          "html",
          node.dom.outerHTML || new XMLSerializer().serializeToString(node.dom)
        )
      )
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
    testsres.push(
      noh.dt(noh.fancy(noh.h3({id:"stest_" + t}, "stest: ", t))).css("padding", "20px"),
      noh.dd(runstest(stests[t]))
    );
  var runtests = noh.dl(testsres);
  return runtests;
}

function stests_toc(stests) {
  var astyle = {"class":"noh link", style:"padding: 5px"};
  var toc = [];
  for(var t in stests) {
    var a = noh.a(astyle, t);
    a.scroll_target = "#stest_" + t;
    a.on("click", function() { $(this.noh.scroll_target)[0].noh.scroll(); });
    toc.push(noh.li(a));
  }
  return noh.ul(toc);
}

function noh_tests() {
  return noh.div(
    noh.fancy(noh.h1("NOH Simple tests")),
    noh.p("Please check the ", noh.a({href: "noh_doc.html"}, "documentation"), " first."),
    noh.fancy(noh.h3("TOC")),
    stests_toc(tests),
    runstests(tests)
  );
};



var tests = {};


// TODO: use noh.ex elements in other tests

tests.simple = function() { return noh.ex.simple(); };
tests.goofy = function() { return noh.ex.goofy(); };
tests.silly = function() { return noh.ex.silly(); };
tests.whitey = function() { return noh.ex.whitey(); };
tests.shiny = function() { return noh.ex.shiny(); };
tests.shiny = function() { return noh.ex.shiny(); };            
tests.idiots = function() { return noh.ex.idiots(); };

tests.colors = function() {
  return noh.div(
    noh.sdiv(noh.ex.color("red")),
    noh.sdiv(noh.ex.color("green")),
    noh.sdiv(noh.ex.color("blue"))
  );
};

tests.rainbows = function() {
  return noh.div(
    noh.sdiv(noh.ex.rainbow(5)),
    noh.sdiv(noh.ex.rainbow(10)),
    noh.sdiv(noh.ex.rainbow(15))
  );
};            

tests.h16 = function() {
  return noh.div(
    noh.h1("Some h1 text"),
    noh.h2("Some h2 text"),
    noh.h3("Some h3 text"),
    noh.h4("Some h4 text"),
    noh.h5("Some h5 text"),
    noh.h6("Some h6 text")
  );
};


tests.fancyh16 = function() {
  return noh.div(
    noh.fancy(noh.h1("Some h1 text")),
    noh.fancy(noh.h2("Some h2 text")),
    noh.fancy(noh.h3("Some h3 text")),
    noh.fancy(noh.h4("Some h4 text")),
    noh.fancy(noh.h5("Some h5 text")),
    noh.fancy(noh.h6("Some h6 text"))
  );
};

tests.srccode = function() {
  return noh.srccode(tests.srccode);
};




tests.sleepy = function() {

  var obj = noh.sleepy(noh.ex.simple(), 2000);

  return noh.objtest(obj, [
    'obj.wake()',
    'obj.sleep()',
    'obj.parent.addclass("smooth")',
    'obj.parent.remclass("smooth")'
  ]);
};



tests.blind = function() {

  var obj = noh.blind(
    noh.ex.rainbow(4)
  );

  return noh.objtest(obj, [
    'obj.roll(true)',
    'obj.roll(false)',
    'obj.down()'
  ]).addclass("smooth");
};


tests.oneof = function() {
  var obj = noh.oneof(
    noh.div({style:"font-style: italic; color: green; font-size: xx-large"}, "BLABLA"),
    noh.div({style:"color: blue; font-size: xx-large"}, "BLEBLE", noh.br(), "BLUBLU"),
    noh.div({style:"color: red; font-size: xx-large"}, "BLIBLI", noh.br(), noh.br(), "BLZBLZ")
  );
  obj.select(0);

  return noh.objtest(obj, [
    'obj.next()',
    'obj.prev()',
    'obj.select(1)',
    'obj.select(-1)'
  ]).addclass("smooth");
};

tests.details = function() {
  var bigstyle = {style:"color: brown; font-size: x-large; width: 400px;"};
  var obj = noh.details(
      noh.div(
        noh.div(bigstyle, "bjkalb DETAILS"),
        noh.div(bigstyle, "fjdsklfsd   DETAILS"),
        noh.div("fjdsklf jksfl dsjlf djksdfl DETAILS")
      )
  );

  obj.addclass("smooth");

  return noh.objtest(obj, [
    "obj.down()",
    "obj.roll(true)",
    "obj.roll(false)"
  ]);
};



tests.overlay = function() {

  var content1 = noh.div({style:"margin: 10px; color: green; font-size: xx-large"},
    " overlay BLEBLE", noh.br(), "BLUBLU").addclass("pretty");
  var content2 = noh.div({style:"margin: 10px; color: blue; font-size: x-large"},
    " overlay BLEBLE", noh.br(), "BLUBLU").addclass("pretty");
  var content3 = noh.div({style:"margin: 30px; color: red; font-size: large"},
    " overlay", noh.br(), "BLU").addclass("pretty");

  var obj = noh.overlay(content1, content2, content3).addclass("right top");

  obj.$.click(function() {obj.hide()});

  var objtest = noh.objtest(obj, [
    "obj.show()",
    "obj.hide()",
    "obj.show(1)",
    "obj.hide(1)",
    "obj.show(2)",
    "obj.hide(2)",
    'obj.parent.addclass("smooth")',
    'obj.parent.remclass("smooth")',
    'obj[1].addclass("pretty")',
    'obj[1].remclass("pretty")',
    'obj.remclass("top").addclass("bottom")',
    'obj.remclass("bottom").addclass("top")'
  ]);

  obj.parent.addclass("smooth");
  
  return objtest;
};



tests.overlay2 = function() {

  var obj = noh.overlay(
    noh.ex.silly().addclass("pretty"),
    noh.ex.goofy().addclass("pretty"),
    noh.ex.simple().addclass("pretty"),
    noh.ex.shiny().addclass("pretty")
  ).addclass("top"); //We will control left/right position by hand

  obj.css("left", "330px");

  obj.$.click(function() {obj.hide()});

  var objtest = noh.objtest(obj, [
    "obj.show()",
    "obj.hide()",
    "obj.show(2)",
    "obj.hide(2)",
    'obj.parent.addclass("smooth")',
    'obj.parent.remclass("smooth")',
    'obj[1].addclass("pretty")',
    'obj[1].remclass("pretty")',
    'obj.remclass("top").addclass("bottom")',
    'obj.remclass("bottom").addclass("top")',
    'obj.css("left", "30px")',
    'obj.css("left", "330px")'
  ]);

  obj.parent.addclass("smooth");
  
  return objtest;
};


tests.overlay_logger_cmd = function() {

  var logger = noh.log.reel(15).addclass("pretty");
  install_logger(logger);
  var cmdline = noh.cmdline(40).addclass("pretty");
  var obj = noh.overlay(logger, cmdline);
  obj.addclass("bottom"); //We will control left/right position by hand
  obj.css("right", "10px");

  var objtest = noh.objtest(obj, [
    "obj.show()",
    "obj.hide()",
    "obj.show(1)",
    "obj.hide(1)",
    'obj.parent.addclass("smooth")',
    'obj.parent.remclass("smooth")',
    'obj.remclass("top").addclass("bottom")',
    'obj.remclass("bottom").addclass("top")',
    'obj.css("right", "30px")',
    'obj.css("right", "230px")'
  ]);

  obj.parent.addclass("smooth");
  
  return objtest;
};

var reel_commands = [
  'obj.rotate(2)',
  'obj.rotate(-3)',
  'obj.rotation',
  'obj.spin(20)',
  'obj.spin(-12, -4, 100)',
  'obj.update(2)',
  'obj.update(5)',
  'obj.parent.addclass("smooth")',
  'obj.parent.remclass("smooth")',
  'obj.parent.addclass("fast")',
  'obj.parent.remclass("fast")',
  'obj.parent.addclass("slow")',
  'obj.parent.remclass("slow")',
  'obj.parent.addclass("very_slow")',
  'obj.parent.remclass("very_slow")',
  'obj.addclass("fancy")',
  'obj.remclass("fancy")'
];


tests.reel1 = function() {
  var bigstyle = {style:"padding: 5px; border: solid blue; color: black; font-size: large; width: 400px; background: wheat"};
  var obj = noh.reel(5, "dynamic", "dynamic",
    noh.div(bigstyle, "BLABLA").css("background", "green"),
    noh.div(bigstyle, "BLABLA").css("background", "blue"),
    noh.div(bigstyle, "BLEBLE", noh.br(), "BLUBLU").css("width", "500px"),
    noh.div(bigstyle, "BLEBLE", noh.br(), "BLUBLU").css("width", "200px"),
    noh.div(bigstyle, "BLEBLE", noh.br(), "BLUBLU").css("width", "220px"),
    noh.div(bigstyle, "BLIBLI", noh.br(), "margin:10px", noh.br(), "BLZBLZ").css("width", "270px").css("margin", "10px"),
    noh.div(bigstyle, "BLIBLI", noh.br(), "margin:20px", noh.br(), "BLZBLZ").css("width", "250px").css("margin", "20px"),
    noh.div(bigstyle, "BLIBLI", noh.br(), noh.br(), "BLZBLZ").css("width", "130px")
  );

  obj.select(2);

  var objtest = noh.objtest(obj, reel_commands);

  obj.parent.addclass("smooth");
  
  return objtest;
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
    elements.push(noh.div(style, "" + str(i, 3)));
  return noh.reel(3, "automatic", "automatic", elements)
    .select(1).addclass("smooth").addclass("fancy");
}

tests.reel2 = function() {
  var obj = reelnr(1,12);
  var objtest = noh.objtest(obj, reel_commands);
  obj.parent.addclass("smooth");
  return objtest;
};


tests.reel_crazy = function() {
  var dummywatch = function(speed) {
    var number1 = reelnr(0,speed);
    var number2 = reelnr(0,speed);
    var number3 = reelnr(0,speed);
    var watch = noh.table1r(noh.td(number1), noh.td(number2), noh.td(number3));
    watch.tick = function() {
      number3.rotate(-1);
      if(number3.rotation == 0) {
        number2.rotate(-1);
        if(number2.rotation == 0)
          number1.rotate(-1);
      }
    };
    return watch;
  };

  var dw1 = dummywatch(3);
  var dw2 = dummywatch(5);
  var dw3 = dummywatch(9);

  var obj = noh.reel(5, "dynamic", "dynamic", dw1, dw2, dw3);

  obj.tick = function() {
    dw1.tick();
    dw2.tick();
    dw3.tick();
  };

  /** @this {noh.Reel} */
  obj.stop = function() {
    if(this.intervalId)
      window.clearInterval(this.intervalId);
    this.intervalId = undefined;
  };

  obj.start = function(speed) {
    obj.stop();
    obj.intervalId = window.setInterval(function() { obj.tick(); }, speed);
  }

  var objtest = noh.objtest(obj, reel_commands.concat('obj.start(200)', 'obj.stop()'));
  obj.parent.addclass("smooth");
  window.setTimeout(function() { obj.update(3); }, 3000);
  return objtest;
};


tests.ukbd = function() {
  return noh.div(noh.ukbd("fjdkl http://www.google.pl google fjsdk ftp://blabal fjdsl http://mareklangiewicz.pl fds fjdsklfds"));
};



tests.log_slittle = function() {
  var obj = noh.log.slittle(3000);
  var objtest = noh.objtest(obj, [
    'obj.log("info", ["dupa info"])',
    'obj.log("warning", ["dupa warning"])',
    'obj.log("error", ["dupa error", "dupa error2", 3, 4, window])',
    'obj.log("info warning", ["dupa info warning"])',
    'noh.log.l2c(obj).install()',
    'noh.log.l2c(noh.log.addtime(obj)).install()',
    'obj.addclass("pretty")',
    'obj.remclass("pretty")'
  ]);
  obj.parent.addclass("smooth");
  return objtest;
};





tests.log_multi = function() {
  var slittle1 = noh.log.slittle(1000);
  var slittle2 = noh.log.slittle(2000);
  var slittle3 = noh.log.slittle(3000);
  var c2l = noh.log.c2l(/** @type {!noh.log.IConsole} */(window.console));
  var multi = noh.log.multi([slittle1, slittle2, slittle3, c2l]);
  var obj = noh.div(slittle1, slittle2, slittle3);
  obj.log = function(classes, data) { multi.log(classes, data); };
  var objtest = noh.objtest(obj, [
    'obj.log("info", ["dupa info"])',
    'obj.log("warning", ["dupa warning"])',
    'obj.log("error", ["dupa error", "dupa error2", 3, 4, window])',
    'obj.log("info warning", ["dupa info warning"])',
    'noh.log.l2c(obj).install()',
    'noh.log.l2c(noh.log.addtime(obj)).install()'
  ]);
  obj.parent.addclass("smooth");
  return objtest;
};

tests.log_reel = function() {
  var obj = noh.log.reel(15);
  var objtest = noh.objtest(obj, [
    'obj.log("info", ["dupa info"])',
    'obj.log("warning", ["dupa warning"])',
    'obj.log("error", ["dupa error", "dupa error2", 3, 4, window])',
    'obj.log("info warning", ["dupa info warning"])',
    'noh.log.l2c(obj).install()',
    'noh.log.l2c(noh.log.addtime(obj)).install()',
    'obj.addclass("pretty")',
    'obj.remclass("pretty")',
    'obj.setlines(5)',
    'obj.setlines(9)'
  ]);
  obj.parent.addclass("smooth");
  return objtest;
};

function install_logger(logger) {

  noh.log.l2c(

    noh.log.multi([

      noh.log.c2l(/** @type {!noh.log.IConsole} */(window.console)),

      noh.log.limitlen(
        noh.log.addtime(
          logger
        ), 40
      )

   ])

  ).install();

};


tests.log_install = function() {
  var obj = noh.log.reel(15, 30000).addclass("pretty smooth");
  return noh.objtest(obj, [
    'install_logger(obj)'
  ]);
};



tests.cmdline = function() {
  var obj = noh.cmdline(40);
  return noh.objtest(obj, [
    'obj.type("2+2")',
    'obj.type("2+2*2")',
    'obj.type("window")',
    'obj.run()'
  ]);
};

