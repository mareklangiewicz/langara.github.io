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
    testsres.push(dt(noh.fancy(h3("stest: ", t))).css("padding", "20px"), dd(runstest(stests[t])));
  var runtests = dl(testsres);
  return runtests;
}


function noh_tests() {
  return div(
    noh.fancy(h2("Simple tests")),
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


tests.fancyh16 = function() {
  return div(
    noh.fancy(h1("Some h1 text")),
    noh.fancy(h2("Some h2 text")),
    noh.fancy(h3("Some h3 text")),
    noh.fancy(h4("Some h4 text")),
    noh.fancy(h5("Some h5 text")),
    noh.fancy(h6("Some h6 text"))
  );
};

tests.srccode = function() {
  return noh.srccode(tests.srccode);
};


tests.overlay = function() {
  var content1 = div({style:"margin: 10px; color: green; font-size: xx-large"}, " overlay BLEBLE", br(), "BLUBLU").addclass("pretty");
  var content2 = div({style:"margin: 10px; color: blue; font-size: x-large"}, " overlay BLEBLE", br(), "BLUBLU").addclass("pretty");
  var content3 = div({style:"margin: 30px; color: red; font-size: large"}, " overlay", br(), "BLU").addclass("pretty");
  var overlay = noh.overlay(content1, content2, content3).addclass("left top");
  overlay.$.click(function() {overlay.hide()});
  var style = {"class":"noh link", style:"padding: 5px"};
  var show = a(style, 'overlay.show()');
  var hide = a(style, 'overlay.hide()');
  var show1 = a(style, 'overlay.show(1)');
  var hide1 = a(style, 'overlay.hide(1)');
  var show2 = a(style, 'overlay.show(2)');
  var hide2 = a(style, 'overlay.hide(2)');
  var addsmooth = a(style, 'overlay.parent.addclass("smooth")');
  var remsmooth = a(style, 'overlay.parent.remclass("smooth")');
  var addpretty = a(style, 'overlay[1].addclass("pretty")');
  var rempretty = a(style, 'overlay[1].remclass("pretty")');
  var tobottom = a(style, 'overlay.remclass("top").addclass("bottom")');
  var totop = a(style, 'overlay.remclass("bottom").addclass("top")');
  show.$.click(function() {overlay.show()});
  hide.$.click(function() {overlay.hide()});
  show1.$.click(function() {overlay.show(1)});
  hide1.$.click(function() {overlay.hide(1)});
  show2.$.click(function() {overlay.show(2)});
  hide2.$.click(function() {overlay.hide(2)});
  addsmooth.$.click(function() {overlay.parent.addclass("smooth")});
  remsmooth.$.click(function() {overlay.parent.remclass("smooth")});
  addpretty.$.click(function() {overlay[1].addclass("pretty")});
  rempretty.$.click(function() {overlay[1].remclass("pretty")});
  tobottom.$.click(function() {overlay.remclass("top").addclass("bottom")});
  totop.$.click(function() {overlay.remclass("bottom").addclass("top")});
  return div(
    show, hide, br(),
    show1, hide1, br(),
    show2, hide2, br(),
    addsmooth,
    remsmooth, br(),
    addpretty,
    rempretty, br(),
    tobottom,
    totop,
    noh.table1r({style:"border: 6px ridge green"},
      td(overlay)
    )
  );
};


tests.overlay2 = function() {
  var content1 = div({style:"margin: 10px; color: green; font-size: xx-large"}, " overlay BLEBLE", br(), "BLUBLU").addclass("pretty");
  var content2 = div({style:"margin: 10px; color: blue; font-size: x-large"}, " overlay BLEBLE", br(), "BLUBLU").addclass("pretty");
  var content3 = div({style:"margin: 30px; color: red; font-size: large"}, " overlay", br(), "BLU").addclass("pretty");
  var overlay = noh.overlay(
    content1,
    content2,
    noh.ex.silly().addclass("pretty"),
    content3
  ).addclass("top"); //We will control left/right position by hand
  overlay.css("right", "10px");
  overlay.$.click(function() {overlay.hide()});
  var style = {"class":"noh link", style:"padding: 5px"};
  var show = a(style, 'overlay.show()');
  var hide = a(style, 'overlay.hide()');
  var show1 = a(style, 'overlay.show(1)');
  var hide1 = a(style, 'overlay.hide(1)');
  var show2 = a(style, 'overlay.show(2)');
  var hide2 = a(style, 'overlay.hide(2)');
  var addsmooth = a(style, 'overlay.parent.addclass("smooth")');
  var remsmooth = a(style, 'overlay.parent.remclass("smooth")');
  var tobottom = a(style, 'overlay.remclass("top").addclass("bottom")');
  var totop = a(style, 'overlay.remclass("bottom").addclass("top")');
  var right1 = a(style, 'overlay.css("right", "30px")');
  var right2 = a(style, 'overlay.css("right", "130px")');
  var right3 = a(style, 'overlay.css("right", "230px")');
  show.$.click(function() {overlay.show()});
  hide.$.click(function() {overlay.hide()});
  show1.$.click(function() {overlay.show(1)});
  hide1.$.click(function() {overlay.hide(1)});
  show2.$.click(function() {overlay.show(2)});
  hide2.$.click(function() {overlay.hide(2)});
  addsmooth.$.click(function() {overlay.parent.addclass("smooth")});
  remsmooth.$.click(function() {overlay.parent.remclass("smooth")});
  tobottom.$.click(function() {overlay.remclass("top").addclass("bottom")});
  totop.$.click(function() {overlay.remclass("bottom").addclass("top")});
  right1.$.click(function() {overlay.css("right", "30px")});
  right2.$.click(function() {overlay.css("right", "130px")});
  right3.$.click(function() {overlay.css("right", "230px")});
  return div(
    show, hide, br(),
    show1, hide1, br(),
    show2, hide2, br(),
    addsmooth,
    remsmooth, br(),
    tobottom,
    totop, br(),
    right1, right2, right3,
    noh.table1r({style:"border: 6px ridge green"},
      td(overlay)
    )
  );
};

tests.overlay3 = function() {
  var logger = noh.log.reel(15).addclass("pretty");
  install_logger(logger);
  var cmdline = noh.cmdline(40).addclass("pretty");
  var overlay = noh.overlay(logger, cmdline);
  overlay.addclass("bottom"); //We will control left/right position by hand
  overlay.addclass("smooth");
  overlay.css("right", "10px");
  var style = {"class":"noh link", style:"padding: 5px"};
  var show = a(style, 'overlay.show()');
  var hide = a(style, 'overlay.hide()');
  var show1 = a(style, 'overlay.show(1)');
  var hide1 = a(style, 'overlay.hide(1)');
  var show2 = a(style, 'overlay.show(2)');
  var hide2 = a(style, 'overlay.hide(2)');
  var addsmooth = a(style, 'overlay.parent.addclass("smooth")');
  var remsmooth = a(style, 'overlay.parent.remclass("smooth")');
  var tobottom = a(style, 'overlay.remclass("top").addclass("bottom")');
  var totop = a(style, 'overlay.remclass("bottom").addclass("top")');
  var right1 = a(style, 'overlay.css("right", "30px")');
  var right2 = a(style, 'overlay.css("right", "130px")');
  var right3 = a(style, 'overlay.css("right", "230px")');
  show.$.click(function() {overlay.show()});
  hide.$.click(function() {overlay.hide()});
  show1.$.click(function() {overlay.show(1)});
  hide1.$.click(function() {overlay.hide(1)});
  show2.$.click(function() {overlay.show(2)});
  hide2.$.click(function() {overlay.hide(2)});
  addsmooth.$.click(function() {overlay.parent.addclass("smooth")});
  remsmooth.$.click(function() {overlay.parent.remclass("smooth")});
  tobottom.$.click(function() {overlay.remclass("top").addclass("bottom")});
  totop.$.click(function() {overlay.remclass("bottom").addclass("top")});
  right1.$.click(function() {overlay.css("right", "30px")});
  right2.$.click(function() {overlay.css("right", "130px")});
  right3.$.click(function() {overlay.css("right", "230px")});
  return div(
    show, hide, br(),
    show1, hide1, br(),
    show2, hide2, br(),
    addsmooth,
    remsmooth, br(),
    tobottom,
    totop, br(),
    right1, right2, right3,
    noh.table1r({style:"border: 6px ridge green"},
      td(overlay)
    )
  );
};


tests.sleepy = function() {
  var content = div({style:"color: green; font-size: xx-large"}, " sleepy BLEBLE", br(), "BLUBLU");
  var sleepy = noh.sleepy(content, 2000);
  var style = {"class":"noh link", style:"padding: 5px"};
  var wake = a(style, "sleepy.wake()");
  var sleep = a(style, "sleepy.sleep()");
  var addsmooth = a(style, 'sleepy.parent.addclass("smooth")');
  var remsmooth = a(style, 'sleepy.parent.remclass("smooth")');
  wake.$.click(function() {sleepy.wake()});
  sleep.$.click(function() {sleepy.sleep();});
  addsmooth.$.click(function() {sleepy.parent.addclass("smooth")});
  remsmooth.$.click(function() {sleepy.parent.remclass("smooth")});
  return div(
    wake,
    sleep,
    addsmooth,
    remsmooth,
    noh.table1r({style:"border: 6px ridge green"},
      td(sleepy)
    )
  );
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
  var addsmooth = a(style, 'reel.parent.addclass("smooth")');
  var remsmooth = a(style, 'reel.parent.remclass("smooth")');
  var addfast = a(style, 'reel.parent.addclass("fast")');
  var remfast = a(style, 'reel.parent.remclass("fast")');
  var addslow = a(style, 'reel.parent.addclass("slow")');
  var remslow = a(style, 'reel.parent.remclass("slow")');
  var addveryslow = a(style, 'reel.parent.addclass("very_slow")');
  var remveryslow = a(style, 'reel.parent.remclass("very_slow")');
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
  var update1 = a(style, 'reel.update(1)'); 
  var update2 = a(style, 'reel.update(2)'); 
  var update3 = a(style, 'reel.update(3)'); 
  var update5 = a(style, 'reel.update(5)'); 
  var update7 = a(style, 'reel.update(7)'); 
  addsmooth.$.click(function() {reel.parent.addclass("smooth")});
  remsmooth.$.click(function() {reel.parent.remclass("smooth")});
  addfast.$.click(function() {reel.parent.addclass("fast")});
  remfast.$.click(function() {reel.parent.remclass("fast")});
  addslow.$.click(function() {reel.parent.addclass("slow")});
  remslow.$.click(function() {reel.parent.remclass("slow")});
  addveryslow.$.click(function() {reel.parent.addclass("very_slow")});
  remveryslow.$.click(function() {reel.parent.remclass("very_slow")});
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
  update1.$.click(function() {reel.update(1);});
  update2.$.click(function() {reel.update(2);});
  update3.$.click(function() {reel.update(3);});
  update5.$.click(function() {reel.update(5);});
  update7.$.click(function() {reel.update(7);});
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
    spinback, br(),
    update1,
    update2,
    update3,
    update5,
    update7,
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

tests.kbd = function() {
  return div(noh.ukbd("fjdkl http://www.google.pl google fjsdk ftp://blabal fjdsl http://mareklangiewicz.pl fds fjdsklfds"));
};

function get_test_logger(logger) {
  var style = {"class":"noh link", style:"padding: 5px"};
  var log1 = a(style, 'logger.log("info", ["dupa info"])');
  var log2 = a(style, 'logger.log("warning", ["dupa warning"])');
  var log3 = a(style, 'logger.log("error", ["dupa error", "dupa error2", 3, 4, window])');
  var log4 = a(style, 'logger.log("info warning", ["dupa info warning"])');
  var install = a(style, 'noh.log.l2c(logger).install()');
  var install2 = a(style, 'noh.log.l2c(noh.log.addtime(logger)).install()');
  var addsmooth = a(style, 'logger.parent.addclass("smooth")');
  var remsmooth = a(style, 'logger.parent.remclass("smooth")');
  var addpretty = a(style, 'logger.addclass("pretty")');
  var rempretty = a(style, 'logger.remclass("pretty")');
  var setlines5 = a(style, 'logger.setlines(5)');
  var setlines9 = a(style, 'logger.setlines(9)');
  log1.$.click(function() { logger.log("info", ["dupa info"]); });
  log2.$.click(function() { logger.log("warning", ["dupa warning"]); });
  log3.$.click(function() { logger.log("error", ["dupa error", "dupa error2", 3, 4, window]); });
  log4.$.click(function() { logger.log("info warning", ["dupa info warning"]); });
  install.$.click(function() { noh.log.l2c(logger).install(); });
  install2.$.click(function() { noh.log.l2c(noh.log.limitlen(noh.log.addtime(logger), 20)).install(); });
  addsmooth.$.click(function() {logger.parent.addclass("smooth")});
  remsmooth.$.click(function() {logger.parent.remclass("smooth")});
  addpretty.$.click(function() {logger.addclass("pretty")});
  rempretty.$.click(function() {logger.remclass("pretty")});
  setlines5.$.click(function() {logger.setlines(5)});
  setlines9.$.click(function() {logger.setlines(9)});
  return div(
    log1, br(),
    log2, br(),
    log3, br(),
    log4, br(),
    addsmooth, remsmooth, br(),
    addpretty, rempretty, br(),
    install, br(),
    install2, br(),
    setlines5, setlines9, br(),
    noh.table1r({style:"border: 6px ridge green"},
      td(logger)
    )
  );
}

tests.log_slittle = function() {
  var slittle = noh.log.slittle(3000);
  return get_test_logger(slittle);
};

tests.log_multi = function() {
  var slittle1 = noh.log.slittle(1000);
  var slittle2 = noh.log.slittle(2000);
  var slittle3 = noh.log.slittle(3000);
  var c2l = noh.log.c2l(window.console);
  var multi = noh.log.multi([slittle1, slittle2, slittle3, c2l]);
  var all = div(slittle1, slittle2, slittle3);
  all.log = function(classes, data) { multi.log(classes, data); };
  return get_test_logger(all);
};

tests.log_reel = function() {
  var rlogger = noh.log.reel(15);
  return get_test_logger(rlogger);
};

function install_logger(logger) {

  noh.log.l2c(

    noh.log.multi([

      noh.log.c2l(window.console),

      noh.log.limitlen(
        noh.log.addtime(
          logger
        ), 40
      )

   ])

  ).install();

};

tests.log_install = function() {

  var style = {"class":"noh link", style:"padding: 5px"};
  var binstall = a(style, 'install_logger(logger)');
  var logger = noh.log.reel(15, 30000).addclass("pretty smooth");
  binstall.$.click(function() { install_logger(logger); console.log("Welcome!"); });
  return div(
    binstall,
    noh.table1r({style:"border: 6px ridge green"},
      td(logger)
    )
  );
};


tests.cmdline = function() {
  return noh.cmdline(40);
};
