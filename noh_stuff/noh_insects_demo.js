// [ vim: set tabstop=2 shiftwidth=2 expandtab : ] 

/**                                           
 * @author marek.langiewicz@gmail.com (Marek Langiewicz)
 * @fileoverview
 * This file contains tests for the NOH Insects library
 */



/**
 * This function will insert tree with all tests to DOM element with id="noh_insects_tests"
 * (if it finds one).If there is no such element, user can still insert it
 * wherever he wants, using noh_insects_tests() function by hand.
 */
function noh_insects_demo_init() {
  var container = $('#noh_insects_demo');
  if(container.length == 0)
    return;
  var demo = noh_insects_demo();
  demo.attachToDOM(container[0]);
}

$(document).ready(noh_insects_demo_init);



function noh_insects_demo() {
  var refresh = noh.button("Refresh");
  var addbigtree = noh.button("Add some big tree");
  var demo_trees = noh.demo_trees();
  var demo = noh.div(
    noh.fancy(noh.h1("NOH Insects demo")),
    noh.p("Please check the ", noh.a({href: "noh_doc.html"}, "NOH library documentation"), " first."),
    noh.p("Please check ", noh.a({href: "noh_insects_tests.html"}, "NOH insects tests"), " too."),
    noh.p("Click somewhere to leave a fly on the screen :-)"),
    noh.p("TODO: implement some big spiders and other insects :-)"),
    noh.p(refresh),
    noh.p(addbigtree, noh.br(), '(fast browser needed)'),
    demo_trees
  );


  $(document).on('click', function(ev) {
    var fly = noh.fly(ev.clientX, ev.clientY);
    demo.add(fly);
    fly.start();
  });


  refresh.on('click', function() {
    location.reload();
  });
  addbigtree.on('click', function() {
    demo_trees.addbigtree();
  });

  return demo;
};

noh.wind = noh.fnum(2, 2, 2, true);

noh.demo_trees = function() {
  var trees = [];
  trees.push(noh.tree({ depth: 5, breadth: 1, spread: noh.fnum(20, 15, 15, true), trunkw:  8, trunkh:  60, trunkh_factor: noh.fnum(0.82, 0.3, 0.3, true) }).pos( 200, $(window).height()));
  trees.push(noh.tree({ depth: 5, breadth: 1, spread: noh.fnum(20, 15, 15, true), trunkw:  8, trunkh:  60, trunkh_factor: noh.fnum(0.82, 0.3, 0.3, true) }).pos( 400, $(window).height()));
  trees.push(noh.tree({ depth: 7, breadth: 1, spread: noh.fnum(20, 15, 15, true), trunkw: 12, trunkh: 100, trunkh_factor: noh.fnum(0.82, 0.3, 0.3, true) }).pos( 600, $(window).height()));
  trees.push(noh.tree({ depth: 7, breadth: 1, spread: noh.fnum(20, 15, 15, true), trunkw: 12, trunkh: 100, trunkh_factor: noh.fnum(0.82, 0.3, 0.3, true) }).pos( 800, $(window).height()));
  trees.push(noh.tree({ depth: 7, breadth: 1, spread: noh.fnum(20, 15, 15, true), trunkw: 12, trunkh: 100, trunkh_factor: noh.fnum(0.82, 0.3, 0.3, true) }).pos(1000, $(window).height()));
  var demo_trees = noh.div(trees).addclass("smooth very_lazy");
  demo_trees.addbigtree = function() {
    var x = noh.fnum(600, 400).get();
    var bigtree = noh.tree({ depth:10, breadth: 1, spread: noh.fnum(20, 15, 15, true), trunkw: 34, trunkh: 140, trunkh_factor: noh.fnum( 0.8, 0.2, 0.2, true) }).pos(x, $(window).height());
    this.add(bigtree);  
  };
  demo_trees.tick = function() {
    for(var i = 0; i < this.length; ++i)
      if(this[i].tick)
        this[i].tick();
  };
  var ticker = noh.ticker(demo_trees, 6000);
  ticker.start();
  return demo_trees;
};




