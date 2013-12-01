// [ vim: set tabstop=2 shiftwidth=2 expandtab : ] 

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
  slow_help();
  return body;
}

function slow_help() {
  slow_log([
    'Witamy w aplikacji Wyraz.',
    'wpisz: anagram("wyraz") aby wyszukać anagramy słowa alamakota.',
    'wpisz: metagram("hala") aby wyszukać metaramy słowa hala.',
    'wpisz: wyraz("irena") aby przeanalizować wyraz irena pod wieloma różnymi względami.',
    'wpisz: 2+2*2 aby dowiedzieć się ile to jest 2+2*2 :-)',
    'wpisz: Math.random() aby wylosować liczbę rzeczywistą między 0 a 1',
    'wpisz: Math.random()*100 aby wylosować liczbę rzeczywistą z przedziału 0..100',
    'wpisz: Math.round(Math.random()*100) aby wylosować liczbę całkowitą z przedziału 0..100',
    'wpisz: slowa[10] aby zobaczyć dziesiąte słowo w słowniku.',
    'wpisz: slowa[100000] aby zobaczyć stutysięczne słowo w słowniku.',
    'wpisz: slowa.length aby zobaczyć ile słów jest w słowniku.',
    'wpisz: slowa[Math.round(Math.random()*slowa.length)] aby zobaczyć losowe słowo ze słownika.',
    '(możesz używać dowolnych instrukcji języka javascript)'
  ], 2000);
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
  var word = noh.fancy(h2(slowa[rnd(0,slowa.length-1)]));
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
  console.log('Skończyłem analizę.');
}

function anagram(text) {
  console.log('Szukam anagramów "' + text + '":');
  var results = [];
  for(var i = 0; i < slowa.length; ++i)
    if(chk_anagram(text, slowa[i]))
      results.push(slowa[i]);
  if(results.length == 0) {
    console.log('Nie znalazłem żadnych anagramów "' + text + '" w słowniku.');
  }
  else {
    console.log('Znalazłem ' + results.length + ' anagramów "' + text + '" w słowniku:');
    for(var i = 0; i < results.length; ++i)
      console.log('    ' + results[i]);
  }
}


function metagram(text) {
  console.log('Szukam metagramów "' + text + '":');
  var results = [];
  for(var i = 0; i < slowa.length; ++i)
    if(chk_metagram(text, slowa[i]))
      results.push(slowa[i]);
  if(results.length == 0) {
    console.log('Nie znalazłem żadnych metagramów "' + text + '" w słowniku.');
  }
  else {
    console.log('Znalazłem ' + results.length + ' metagramów "' + text + '" w słowniku:');
    for(var i = 0; i < results.length; ++i)
      console.log('    ' + results[i]);
  }
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

