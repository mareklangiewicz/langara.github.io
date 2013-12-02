// [ vim: set tabstop=2 shiftwidth=2 expandtab : ] 

var dict = [];

function init() {
  noh.init({pollute:true});
  var body = wyraz_body();
  body.attachToDOM(document.body);
  SyntaxHighlighter.all();
}


$(document).ready(init);


function wyraz_body() {
  var cmdline = noh.cmdline(40).addclass("pretty");
  var logger = noh.log.reel(35, 100000).addclass("pretty");
  noh.log.l2c(
    noh.log.multi([
      noh.log.c2l(window.console),
      noh.log.limitlen(
        noh.log.addtime(
          logger
        ), 120
      )
   ])
  ).install();
  var overlay = noh.overlay(logger, cmdline);
  overlay.addclass("bottom smooth"); //We will control left/right position by hand
  overlay.css("right", 20);
  var body = div(
    noh.fancy(h1("Wyraz")),
    overlay
  ).addclass("smooth");
  logger.on("click", function() {overlay.hide(); return false;});
  $(document).on("click", function() {overlay.show();});
  ghost_background(body.dom);
  slow_log([
    'PL: Witamy w aplikacji Wyraz. Wpisz: pomoc() aby uzyskać więcej pomocy.',
    'EN: Welcome to Wyraz app. Enter: help() to get some help.'
  ], 500);
  return body;
}


function help() {
  slow_log([
    'Help for "Wyraz" app:',
    'This is an application for playing around with polish words dictionary.',
    'enter: load() to load the dictionary to the dict variable (warning: it can take even 5 minutes)',
    'TODO: translate help to english'
  ], 500);
}

function pomoc() {
  slow_log([
    'Pomoc aplikacji Wyraz:',
    'wpisz: load() aby wczytać słownik do zmiennej dict. (uwaga: to może potrwać nawet parę minut)',
    'wpisz: dict.length aby zobaczyć ile słów jest w słowniku.',
    'wpisz: dict[0] aby zobaczyć pierwsze słowo w słowniku.',
    'wpisz: dict[10] aby zobaczyć jedenaste słowo w słowniku.',
    'wpisz: dict[100000] aby zobaczyć stutysięczne-pierwsze słowo w słowniku.',
    'wpisz: anagram("wyraz") aby wyszukać anagramy słowa wyraz.',
    'wpisz: metagram("hala") aby wyszukać metagramy słowa hala.',
    'wpisz: shorter("boisko") aby wyszukać skrótki słowa boisko.',
    'wpisz: circle("boisko") aby wyszukać anagramy kołowe słowa boisko.',
    'wpisz: rev("boisko") aby otrzymać wyraz oksiob.',
    'wpisz: circle(rev("boisko")) aby otrzymać anagramy kołowe słowa oksiob.',
    'wpisz: wyraz("irena") aby przeanalizować wyraz irena pod wieloma różnymi względami.',
    'wpisz: 2+2*2 aby dowiedzieć się ile to jest 2+2*2 :-)',
    'wpisz: rnd(0,100) aby otrzymać liczbę losową z przedziału 0..100.',
    'wpisz: dict[rnd(0,dict.length-1)] aby zobaczyć losowe słowo ze słownika.',
    '(możesz używać dowolnych instrukcji języka javascript)'
  ], 500);
}

function load() {
  if(load.interval_) {
    console.error("PL: Wczytywanie w trakcie! EN: Loading already in progress!");
    return;
  }
  console.log("PL: Wczytywanie słownika:");
  console.log("EN: Loading dict:");
  $.ajax ({
    type: 'GET',
    url: 'dict-utf8.json' ,
    cache: true,
    xhrFields: {
      onprogress: function (e) {
        load.loaded_ = e.loaded;
        load.total_ = e.total;
      }
    },
    beforeSend: function (XHR) {
      XHR.progress(function() {
        console.warn(arguments);
      });
      load.interval_ = setInterval (function () {
        var total = load.total_ !== undefined ? load.total_ : 0; 
        var loaded = load.loaded_ !== undefined ? load.loaded_ : 0;
        if((total > 0) && (loaded > 0))
          console.log(Math.round((loaded/total) * 100) + "%")
        else if(loaded > 0)
          console.log(Math.round(loaded/1024) + "K");
        else
          console.log("...");
      }, 500);
    },
    complete: function () {
      clearInterval (load.interval_);
    },
    success: function (response) {
      console.log("PL: Wczytywanie słownika dict zakończone. EN: Loading dict finished.");
      dict = response;
    },
    error: function() {
      console.error(arguments);
    }
  }); 
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


function rnd(min, max) { return Math.round(min + Math.random() * (max-min+1)); }


/**
 * This element will show itself somewhere  for a while and then it sill disappear. That's all.
 * @param {!noh.Element} element that will become a ghost
 * @param {number=} opt_delay How many miliseconds will it be hidden before showing itself. Default is random between 0 and 10000
 * @param {number=} opt_duration How many miliseconds will it be shown before hiding itself forever. Default is random between 0 and 10000
 * @param {Node=} opt_root A root element to which the gost will be attached (and detached later). Default is document.body
 */
var ghost = function(element, opt_delay, opt_duration, opt_root) {
  var delay = opt_delay === undefined ? rnd(0,10000) : opt_delay;
  var duration = opt_duration === undefined ? rnd(0,10000) : opt_duration;
  var root = opt_root ? opt_root : document.body;
  var aghost = noh.sleepy(element, opt_duration).addclass("ghost");

  var detach = function() {
    aghost.detachFromDOM(root);
  };

  var show = function() {
    aghost.wake();
    window.setTimeout(detach, duration + 20000);
  };

  var attach = function() {
    aghost.attachToDOM(root);
    window.setTimeout(show, 2000);
  };

  window.setTimeout(attach, delay);
};

var word_ghost = function(opt_delay, opt_duration, opt_root) {
  var word = noh.fancy(h2(dict[rnd(0,dict.length-1)]));
  var winwidth = $(window).width();
  var winheight = $(window).height();
  word.css("left", rnd(10, winwidth/2));
  word.css("top", rnd(100, winheight-200));
  ghost(word, opt_delay, opt_duration, opt_root);
};


var ghost_background = function(opt_root) {
  var next_ghost = function() {
    word_ghost(rnd(500, 5000), rnd(1000, 10000), opt_root);
  };
  window.setInterval(next_ghost, 3000);
};

function wyraz(text) {
  console.log('Analizuję "' + text + '":');
  anagram(text);
  metagram(text);
  shorter(text);
  circle(text);
  circle(rev(text));
  console.log('Skończyłem analizę.');
}

function anagram(text) {
  console.log('Szukam anagramów "' + text + '":');
  var results = [];
  for(var i = 0; i < dict.length; ++i)
    if(chk_anagram(text, dict[i]))
      results.push(dict[i]);
  if(results.length == 0) {
    console.log('Nie znalazłem żadnych anagramów "' + text + '" w słowniku.');
  }
  else {
    console.log('Znalazłem ' + results.length + ' anagramów "' + text + '" w słowniku:');
    for(var i = 0; i < results.length; ++i)
      console.log('-   ' + results[i]);
  }
}


function metagram(text) {
  console.log('Szukam metagramów "' + text + '":');
  var results = [];
  for(var i = 0; i < dict.length; ++i)
    if(chk_metagram(text, dict[i]))
      results.push(dict[i]);
  if(results.length == 0) {
    console.log('Nie znalazłem żadnych metagramów "' + text + '" w słowniku.');
  }
  else {
    console.log('Znalazłem ' + results.length + ' metagramów "' + text + '" w słowniku:');
    for(var i = 0; i < results.length; ++i)
      console.log('-   ' + results[i]);
  }
}

function shorter(text) {
  console.log('Szukam skrótek "' + text + '":');
  var results = [];
  for(var i = 0; i < dict.length; ++i)
    if(chk_shorter(text, dict[i]))
      results.push(dict[i]);
  if(results.length == 0) {
    console.log('Nie znalazłem żadnych skrótek "' + text + '" w słowniku.');
  }
  else {
    console.log('Znalazłem ' + results.length + ' skrótek "' + text + '" w słowniku:');
    for(var i = 0; i < results.length; ++i)
      console.log('-   ' + results[i]);
  }
}


function circle(text) {
  console.log('Szukam anagramów kołowych "' + text + '":');
  var results = [];
  for(var i = 0; i < dict.length; ++i)
    if(chk_circle(text, dict[i]))
      results.push(dict[i]);
  if(results.length == 0) {
    console.log('Nie znalazłem żadnych anagramów kołowych "' + text + '" w słowniku.');
  }
  else {
    console.log('Znalazłem ' + results.length + ' anagramów kołowych "' + text + '" w słowniku:');
    for(var i = 0; i < results.length; ++i)
      console.log('-   ' + results[i]);
  }
}


function rev(text) {
  return text.split("").reverse().join("");
}


function chk_anagram(text1, text2) {
  for(var i = 0; i < text1.length; ++i) {
    var j = text2.indexOf(text1[i]);
    if(j == -1)
      return false;
    else
      text2 = '' + text2.substring(0, j) + text2.substring(j+1);
  }
  return text2.length == 0;
}

function chk_metagram(text1, text2) {
  if(text1.length != text2.length)
    return false;
  for(var i = 0; i < text1.length; ++i)
    if( (text1.substring(0, i) == text2.substring(0, i)) && (text1.substring(i+1) == text2.substring(i+1)) )
      return true;
  return false;
}

function chk_shorter(text1, text2) {
  if(text1.length != text2.length + 1)
    return false;
  for(var i = 0; i < text1.length; ++i)
    if( (text1.substring(0, i) == text2.substring(0, i)) && (text1.substring(i+1) == text2.substring(i)) )
      return true;
  return false;
}


function chk_circle(text1, text2) {
  if(text1.length != text2.length)
    return false;
  for(var i = 1; i < text1.length; ++i)
    if(text1.substring(i) + text1.substring(0,i) == text2)
      return true;
  return false;
}

