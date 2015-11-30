// [ vim: set tabstop=2 shiftwidth=2 expandtab : ] 

var words = [];

function init() {
  var body = wyraz_body();
  body.attachToDOM(document.body);
}


$(document).ready(init);






// User commands:

function help() {
  slow_log([
    'Help for "Wyraz" app:',
    'This is an application for playing around with polish words dictionary.',
    'I will not provide full help, just some examples.',
    'It should be obvious for developers, but others should also be able to guess how it all works.',
    'enter: load("words-games") to load the "words-games" dictionary to words variable. (warning: this can take several minutes)',
    '(dictionary "words-games" contains 2703822 polish words)',
    'enter: anagram("okulista",words) to search for "okulista" anagrams in words dictionary.',
    'enter: metagram("hala",words) to search for "hala" metagrams in words dictionary.',
    'enter: short("boisko",words) to search for "boisko" shorts in words dictionary.',
    'enter: carousel("boisko", words) to search for "boisko" carousels in words dictionary.',
    'enter: rev("boisko") to get the reverse of "boisko".',
    'enter: carousel(rev("boisko"), words) to search for "oksiob" carousels in words dictionary.',
    'enter: drawer("ala", words) to search for "ala" drawers in words dictionary.',
    'enter: wyraz("irena", words) to analyze "irena" word using different functions.',
    'enter: advanced() to see advanced help.'
  ], 200);
}

function advanced() {
  slow_log([
    'Advanced help for "Wyraz" app:',
    'enter: words.length to check how long is in words dictionary.',
    'enter: words[0] to see first word in words dictionary.',
    'enter: words[10] to see eleventh word in words dictionary.',
    'enter: words[10] = "blabla" to change eleventh word in words dictionary to "blabla" (all changes are only temporary)',
    'enter: wg = words to save words dictionary in wg variable.',
    'enter: load("words-freq") to load "word-freq" dictionary to words variable. (this dictionary contains 102086 polish words sorted by popularity)',
    'enter: wf = words to save words dictionary in wf variable.',
    'enter: anagram(metagram("hala",wg),wg) to search for anagrams of metagrams of word:"hala" in wg dictionary.',
    'enter: short(anagram("trawka",wg),wg) to search for shorts of anagrams of word:"trawka" in wg dictionary.',
    'enter: sh = short(["trawka", "piorunek"], wg) to save in sh variable a list of shorts of words "trawka" i "piorunek" in wg dictionary.',
    'enter: anagram(sh,wf) to search for anagrams of words from sh variable in wf dictionary.',
    'enter: 2+2*2 aby to to know how much is:2+2*2 :-)',
    'enter: rnd(0,100) aby get a random number between 0 and 100.',
    'enter: words[rnd(0,words.length-1)] to get a random word from words dictionary.',
    '(you can use any JavaScript instructions here if you know JavaScript)',
    'You can also use internal Google Chrome console (Ctrl+Shift+J)',
    'It is not so beautiful, but it is better in many ways..'
  ], 200);
}

function pomoc() {
  slow_log([
    'Pomoc aplikacji Wyraz:',
    'Ta aplikacja służy do zabawy w przekształcenia słów.',
    'Nie napiszę pełnej pomocy, tylko parę przykładów.',
    'To powinno być proste dla programistów, ale inni też powinni być w stanie się domyślić na czym zabawa polega.',
    'wpisz: load("words-games") aby wczytać słownik "words-games" do zmiennej words. (uwaga: to może potrwać nawet parę minut)',
    '(słownik "words-games" zawiera 2703822 słów języka polskiego - w tym odmiany)',
    'wpisz: anagram("okulista",words) aby wyszukać anagramy słowa okulista w słowniku words.',
    'wpisz: metagram("hala",words) aby wyszukać metagramy słowa hala w słowniku words.',
    'wpisz: short("boisko",words) aby wyszukać skrótki słowa boisko w słowniku words.',
    'wpisz: carousel("boisko",words) aby wyszukać karuzeli słowa boisko w słowniku words.',
    'wpisz: rev("boisko") aby otrzymać odwrotność wyrazu boisko, czyli oksiob.',
    'wpisz: carousel(rev("boisko"),words) aby wyszukać karuzeli słowa oksiob w słowniku words.',
    'wpisz: drawer("ala",words) aby wyszukać szuflad słowa ala w słowniku words.',
    'wpisz: wyraz("irena",words) aby przeanalizować wyraz irena pod wieloma różnymi względami używając słownika words.',
    'wpisz: zaawansowany() aby zobaczyć pomoc dla zaawansowanych.'
  ], 200);
}

function zaawansowany() {
  slow_log([
    'Zaawansowana pomoc aplikacji Wyraz:',
    'wpisz: words.length aby sprawdzić liczbę słów w słowniku.',
    'wpisz: words[0] aby zobaczyć pierwsze słowo w słowniku.',
    'wpisz: words[10] aby zobaczyć jedenaste słowo w słowniku.',
    'wpisz: words[100000] aby zobaczyć stutysięczne-pierwsze słowo w słowniku.',
    'wpisz: words[10] = "blabla" aby podmienić jedenaste słowo w słowniku na "blabla" (wszelkie zmiany są tylko tymczasowe - do przeładowania strony)',
    'wpisz: wg = words aby zapisać słownik words w zmiennej wg',
    'wpisz: load("words-freq") aby wczytać słownik words-freq do zmiennej words. (ten słownik zawiera 102086 słów posortowanych według popularności)',
    'wpisz: wf = words aby zapisać słownik words w zmiennej wf',
    'wpisz: anagram(metagram("hala",wg),wg) aby wyszukać w słowniku wg anagramy metagramów słowa "hala".',
    'wpisz: short(anagram("trawka",wg),wg) aby wyszukać w słowniku wg skrótki anagramów słowa "trawka".',
    'wpisz: sh = short(["trawka", "piorunek"], wg) aby zapisać w zmiennej sh skrótki słów "trawka" i "piorunek" wyszukane w słowniku wg.',
    'wpisz: anagram(sh,wf) aby wyszukać anagramy słów z listy sh w słowniku wf.',
    'wpisz: 2+2*2 aby dowiedzieć się ile to jest 2+2*2 :-)',
    'wpisz: rnd(0,100) aby otrzymać liczbę losową z przedziału 0..100.',
    'wpisz: words[rnd(0,words.length-1)] aby zobaczyć losowe słowo ze słownika.',
    '(można używać dowolnych instrukcji języka javascript)',
    'Alternatywnie można używać wbudowanej konsoli przeglądarki Google Chrome (Ctrl+Shift+J)',
    'może nie jest taka piękna :-) ale pod wieloma względami lepsza..'
  ], 200);
}



function anagram(arr1, arr2) {
  if(!(arr1 instanceof Array))
    arr1 = [arr1];
  if(!(arr2 instanceof Array))
    arr2 = [arr2];
  var res = []; // all results will be here
  for(var i = 0; i < arr1.length; ++i) {
    console.log('PL: Szukam anagramów "' + arr1[i] + '":');
    console.log('EN: Searching for anagrams "' + arr1[i] + '":');
    var r = []; // results for given ar1[i]
    for(var j = 0; j < arr2.length; ++j)
      if(chk_anagram(arr1[i], arr2[j]))
        r.push(arr2[j]);
    if(r.length == 0) {
      console.log('PL: Nie znalazłem żadnych anagramów "' + arr1[i] + '".');
      console.log('EN: No anagrams of "' + arr1[i] + '" found.');
    }
    else {
      console.log('PL: Znalazłem ' + r.length + ' anagramów "' + arr1[i] + '".');
      console.log('EN: ' + r.length + ' "' + arr1[i] +'" anagrams found.');
    }
    res = res.concat(r);
  }
  return res;
}


function metagram(arr1, arr2) {
  if(!(arr1 instanceof Array))
    arr1 = [arr1];
  if(!(arr2 instanceof Array))
    arr2 = [arr2];
  var res = []; // all results will be here
  for(var i = 0; i < arr1.length; ++i) {
    console.log('PL: Szukam metagramów "' + arr1[i] + '":');
    console.log('EN: Searching for metagrams "' + arr1[i] + '":');
    var r = []; // results for given ar1[i]
    for(var j = 0; j < arr2.length; ++j)
      if(chk_metagram(arr1[i], arr2[j]))
        r.push(arr2[j]);
    if(r.length == 0) {
      console.log('PL: Nie znalazłem żadnych metagramów "' + arr1[i] + '".');
      console.log('EN: No metagrams of "' + arr1[i] + '" found.');
    }
    else {
      console.log('PL: Znalazłem ' + r.length + ' metagramów "' + arr1[i] + '".');
      console.log('EN: ' + r.length + ' "' + arr1[i] +'" metagrams found.');
    }
    res = res.concat(r);
  }
  return res;
}

function short(arr1, arr2) {
  if(!(arr1 instanceof Array))
    arr1 = [arr1];
  if(!(arr2 instanceof Array))
    arr2 = [arr2];
  var res = []; // all results will be here
  for(var i = 0; i < arr1.length; ++i) {
    console.log('PL: Szukam skrótek "' + arr1[i] + '":');
    console.log('EN: Searching for shorts "' + arr1[i] + '":');
    var r = []; // results for given ar1[i]
    for(var j = 0; j < arr2.length; ++j)
      if(chk_short(arr1[i], arr2[j]))
        r.push(arr2[j]);
    if(r.length == 0) {
      console.log('PL: Nie znalazłem żadnych skrótek "' + arr1[i] + '".');
      console.log('EN: No shorts of "' + arr1[i] + '" found.');
    }
    else {
      console.log('PL: Znalazłem ' + r.length + ' skrótek "' + arr1[i] + '".');
      console.log('EN: ' + r.length + ' "' + arr1[i] +'" shorts found.');
    }
    res = res.concat(r);
  }
  return res;
}


function carousel(arr1, arr2) {
  if(!(arr1 instanceof Array))
    arr1 = [arr1];
  if(!(arr2 instanceof Array))
    arr2 = [arr2];
  var res = []; // all results will be here
  for(var i = 0; i < arr1.length; ++i) {
    console.log('PL: Szukam karuzeli "' + arr1[i] + '":');
    console.log('EN: Searching for carousels "' + arr1[i] + '":');
    var r = []; // results for given ar1[i]
    for(var j = 0; j < arr2.length; ++j)
      if(chk_carousel(arr1[i], arr2[j]))
        r.push(arr2[j]);
    if(r.length == 0) {
      console.log('PL: Nie znalazłem żadnych karuzel "' + arr1[i] + '".');
      console.log('EN: No carousels of "' + arr1[i] + '" found.');
    }
    else {
      console.log('PL: Znalazłem ' + r.length + ' karuzel "' + arr1[i] + '".');
      console.log('EN: ' + r.length + ' "' + arr1[i] +'" carousels found.');
    }
    res = res.concat(r);
  }
  return res;
}


function drawer(arr1, arr2) {
  if(!(arr1 instanceof Array))
    arr1 = [arr1];
  if(!(arr2 instanceof Array))
    arr2 = [arr2];
  var res = []; // all results will be here
  for(var i = 0; i < arr1.length; ++i) {
    console.log('PL: Szukam szuflad "' + arr1[i] + '":');
    console.log('EN: Searching for drawers "' + arr1[i] + '":');
    var r = []; // results for given ar1[i]
    for(var j = 0; j < arr2.length; ++j)
      if(chk_drawer(arr1[i], arr2[j]))
        r.push(arr2[j]);
    if(r.length == 0) {
      console.log('PL: Nie znalazłem żadnych szuflad "' + arr1[i] + '".');
      console.log('EN: No drawers of "' + arr1[i] + '" found.');
    }
    else {
      console.log('PL: Znalazłem ' + r.length + ' szuflad "' + arr1[i] + '".');
      console.log('EN: ' + r.length + ' "' + arr1[i] +'" drawers found.');
    }
    res = res.concat(r);
  }
  return res;
}


function find(arr1, arr2) {
  if(!(arr1 instanceof Array))
    arr1 = [arr1];
  if(!(arr2 instanceof Array))
    arr2 = [arr2];
  var res = []; // all results will be here
  for(var i = 0; i < arr1.length; ++i)
    for(var j = 0; j < arr2.length; ++j)
      if(arr1[i] == arr2[j]) {
        res.push(arr2[j]);
        break;
      }
  return res;
}

function rev(arr1, arr2) {

  var rev_ = function(text) {
    return text.split("").reverse().join("");
  };

  var res = [];
  
  if(!(arr1 instanceof Array))
    arr1 = [arr1];

  if(arr2 === undefined) {
    for(var i = 0; i < arr1.length; ++i)
      res.push(rev_(arr1[i]));
    return res;
  }

  if(!(arr2 instanceof Array))
    arr2 = [arr2];

  for(var i = 0; i < arr1.length; ++i) {
    if(arr2.length > 1) { // We do not pollute the console if the dictionary is just one word.
      console.log('PL: Szukam odwrotności "' + arr1[i] + '":');
      console.log('EN: Searching for reverse "' + arr1[i] + '":');
    }

    var r = find(rev_(arr1[i]), arr2);

    if(arr2.length > 1) { // We do not pollute the console if the dictionary is just one word.
      if(r.length == 0) {
        console.log('PL: Nie znalazłem odwrotności "' + arr1[i] + '".');
        console.log('EN: No reverse of "' + arr1[i] + '" found.');
      }
      else {
        console.log('PL: Znalazłem ' + r.length + ' odwrotności "' + arr1[i] + '".');
        console.log('EN: ' + r.length + ' "' + arr1[i] +'" reverse found.');
      }
    }
    res = res.concat(r);
  }

  return res;
}

function rnd(min, max) { return Math.round(min + Math.random() * (max-min+1)); }


function wyraz(arr1, arr2) {
  var res = [];
  var r = []; // result of single operation.
  r = anagram(arr1, arr2); console.log(r); res = res.concat(r);
  r = metagram(arr1, arr2); console.log(r); res = res.concat(r); 
  r = short(arr1, arr2); console.log(r); res = res.concat(r);
  r = rev(arr1, arr2); console.log(r); res = res.concat(r);
  r = carousel(arr1, arr2); console.log(r); res = res.concat(r);
  r = carousel(rev(arr1), arr2); console.log(r); res = res.concat(r);
  r = drawer(arr1, arr2); console.log(r); res = res.concat(r);
  return res;
}

function load(dictname) {
  if(load.interval_) {
    console.error("PL: Wczytywanie w trakcie!");
    console.error("EN: Loading already in progress!");
    return;
  }
  if(dictname === undefined) {
    console.error('PL: Podaj nazwę słownika! (np: "words-games" lub: "words-freq")');
    console.error('EN: Enter dictionary name! (for example: "words-games" or: "words-freq")');
    return;
  }
  console.log('PL: Wczytywanie słownika "' + dictname + '" do zmiennej words:');
  console.log('EN: Loading dictionary "' + dictname + '" to variable words:');
  $.ajax ({
    type: 'GET',
    dataType: 'script',
    url: dictname + '.js',
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
          console.log(Math.round(loaded/1024) + " KB");
        else
          console.log("...");
      }, 500);
    },
    complete: function () {
      clearInterval (load.interval_);
      load.interval_ = undefined;
    },
    success: function (response) {
      console.log('PL: Wczytywanie słownika "' + dictname + '" do zmiennej words zakończone pomyślnie.');
      console.log('EN: Loading dictionary "' + dictname + '" to variable words finished successfully.');
    },
    error: function() {
      console.error(arguments);
    }
  }); 
}



function chk_anagram(text1, text2) {
  if(text1 == text2)
    return false; //Lets say that a word is not an anagram of itself.
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

function chk_short(text1, text2) {
  var j = 0;
  for(var i = 0; i < text1.length; ++i) {
    if(text1[i] == text2[j]) {
      j++;
      if(j == text2.length)
        return true;
    }
  }
  return false;
}


function chk_carousel(text1, text2) {
  for(var offset = 0; offset < text1.length; ++offset) {
    var ok = true;
    for(var i = 0; i < text2.length; ++i)
      if(text1[(offset+i) % text1.length] != text2[i]) {
        ok = false;
        break;
      }
    if(ok)
      return true;
  }
  return false;
}


function chk_drawer(text1, text2) {
  return text2.indexOf(text1) != -1;
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


function wyraz_body() {
  var warning = size_warning();
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
      noh.fancy(noh.h1("Wyraz")),
      "Small web app written with the ", noh.a({href:"https://github.com/langara/noh"}, "NOH"), " library", noh.br(),
      noh.i(warning).css("font-size", "small")
    ).css("margin", 20),
    overlay
  ).addclass("smooth");
  overlay.on("click", function() {return false;});
  $(document).on("click", function() {
    if(overlay.hasclass("hidden")) overlay.show();
    else overlay.hide();
  });
  ghost_background(body.dom);
  slow_log([
    'PL: Witamy w aplikacji Wyraz. Wpisz: pomoc() aby uzyskać więcej pomocy.',
    'EN: Welcome to Wyraz app. Enter: help() to get some help.',
    warning
  ], 500);
  window.setTimeout(function() {cmdline[0].$.focus();}, 200);
  return body;
}

function size_warning() {
  if ( ($(window).width() < 600) || ($(window).height() < 700) )
    return "WARNING: this app is NOT optimized for small screens...";
  return "";
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




/**
 * This element will show itself somewhere  for a while and then it sill disappear. That's all.
 * @param {!noh.Element} element that will become a ghost
 * @param {number=} opt_delay How many miliseconds will it be hidden before showing itself. Default is random between 0 and 10000
 * @param {number=} opt_duration How many miliseconds will it be shown before hiding itself forever. Default is random between 0 and 10000
 * @param {Node=} opt_root A root element to which the gost will be attached (and detached later). Default is document.body
 */
function ghost(element, opt_delay, opt_duration, opt_root) {
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
}

function word_ghost(opt_delay, opt_duration, opt_root) {
  var text = (noh.arr.isArrayLike(words) && words.length > 0) ? words[rnd(0, words.length-1)] : '*';
  var word = noh.fancy(noh.h2(text));
  var winwidth = $(window).width();
  var winheight = $(window).height();
  word.css("left", rnd(10, winwidth/2));
  word.css("top", rnd(100, winheight-200));
  word.css("transition", "all 4s");
  ghost(word, opt_delay, opt_duration, opt_root);
}


function ghost_background(opt_root) {
  var next_ghost = function() {
    word_ghost(rnd(500, 5000), rnd(1000, 10000), opt_root);
  };
  window.setInterval(next_ghost, 3000);
}


