// [ vim: set tabstop=2 shiftwidth=2 expandtab : ] 


function init() {
  var body = l2i_body();
  body.attachToDOM(document.body);
}


$(document).ready(init);






// User commands:

function help() {
  slow_log([
    'Help for "L2I" app:',
    'This is a small mechanism for translating ordinary http links to android intents.',
    'TODO: remove this javascript console, or adapt it for mobile browsers',
    'TODO: create some real documentation here',
    'You have to install "L2I" android application to use this features fully. TODO: link to L2I on play store'
  ], 200);
}










function verbose(logger) {
  logger.lv_ = logger.log;
  logger.log = function(classes, data) {
    for(var i = 0; i < data.length; ++i) {
      if((typeof data[i] !== "string") && noh.arr.isArrayLike(data[i])) {
        logger.lv_(classes, ['[']);
        for(var j = 0; j < data[i].length; ++j) {
          logger.lv_(classes, ['- ' + data[i][j]]);
          if(j > 25) {
            logger.lv_(classes, ['...']);
            break;
          }
        }
        logger.lv_(classes, [']']);
      }
      else
        logger.lv_(classes, [data[i]]);
    }
  };
}

function a(addr) { return noh.a({href:addr}, addr); }
function la(addr) { return noh.li(a(addr)); }


function l2i_body() {

  var MP3EX = "/storage/emulated/0/Music/Wintersun/2004 - Wintersun/06 - Starchild.mp3";
  var GEOEX = "geo:47.6, -122.3";

  var cmdline = noh.cmdline(40).addclass("pretty");
  var logger = noh.log.reel(35, 240000).addclass("pretty");
  //logger = noh.log.limitlen(logger, 120);
  verbose(logger);
  noh.log.l2c(
    noh.log.multi([
      noh.log.c2l(window.console),
      logger
   ])
  ).install();
  var overlay = noh.overlay(logger, cmdline);
  overlay.addclass("bottom smooth"); //We will control left/right position by hand
  overlay.css("right", 20);
  var body = noh.div(
    noh.p(
      noh.fancy(noh.h1("L2I")), noh.br(),
      noh.fancy(noh.h2("TODO: rename to I2I and implement general intent converter/translator")), noh.br(),
      "(for example user could create some rules to create simple voice gateway for new commands like: play intent ....)", noh.br(),
      "TODO: some introduction here", noh.br(),
      "TODO: example links", noh.br(),
      noh.ul(
        la("file:/sdcard/"),
        la("file:///sdcard/"),
        la("file:" + MP3EX),
        la("file://" + MP3EX),
        la(GEOEX),
        la("http://mareklangiewicz.pl/l2i.html?action=view&data=" + encodeURIComponent(GEOEX)),
        la("http://mareklangiewicz.pl/l2i.html?action=android.media.action.MEDIA_PLAY_FROM_SEARCH&data=" + encodeURIComponent(MP3EX))
      )
    ).css("margin", 20),
    overlay
  ).addclass("smooth");
  slow_log([
    'EN: Welcome to L2I web app. Enter: help() to get some help.'
  ], 500);
  window.setTimeout(function() {cmdline[0].$.focus();}, 200);
  return body;
}



function slow_log(lines, delay) {
  var idx = 0;
  var interval = undefined;
  var callback = function() {
    if(idx >= lines.length) {
      window.clearInterval(interval);
      interval = undefined;
      return;
    }
    console.log(lines[idx]);
    idx ++;
  };

  interval = window.setInterval(callback, delay);
}



