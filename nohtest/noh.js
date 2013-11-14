// [ vim: set tabstop=2 shiftwidth=2 expandtab : ] 

/**                                           
 * @author marek.langiewicz@gmail.com (Marek Langiewicz)
 * @fileoverview
 * <p>
 * This is the <strong>NOH</strong> (NO HTML) library.
 * </p>
 * <p>
 * It allows to create the html documents dynamically in pure JavaScript (with almost no html code at all)
 * It contains a kind of a wrappers to DOM hierarchy.
 * We have a function for every html element like: {@linkcode table, tr, td, div, span} etc..;
 * but also we have functions that constructs many specialized and more complex elements that have some dynamic behaviour
 * implemented (like {@linkcode menu, oneof, bar, logger}, and more).
 * TODO: implement some srccode, some logger and some tester.
 * </p>
 * <p>
 * Please check the files: {@link noh_example.js} (and {@link example.html}) for full (but simple) working example.
 * Main documentation with introduction and examples is available here: {@link index.html|NOH library documentation}
 * Additional API documentation generated with {@link http://usejsdoc.org/|jsdoc3} is available here: {@link apidoc/index.html|NOH API documentation} TODO
 * </p>
 * <p>
 * NOH library depends on jQuery. TODO: Limit jQuery usage for NOH to be able to work with SVG or other elements (not only html)
 * {@linkcode http://stackoverflow.com/questions/3642035/jquerys-append-not-working-with-svg-element|stackoverflow}
 * </p>
 * @licence Released under the MIT license.
 */

/*
 * Example:
 *
 * Instead of HTML code like:
 * <div id="someid">
 *     <h2>EXAMPLE</h2>
 *     <p>
 *         <h4>Some header</h4>
 *         Some content
 *     </p>
 *     <p>
 *         <h4>Other header</h4>
 *         Other content
 *     </p>
 * </div>
 *
 * We write JS code like:
 * div({id:"someid"},
 *     h2("EXAMPLE"),
 *     p(h4("Some header"),"Some content"),
 *     p(h4("Other header"),"Other content")
 * )
 */


/**
 * @namespace Main NOH library namespace.
 */
noh = {};




/** @typedef {{pollute:boolean|undefined}} */
noh.Options;

/** @typedef {Object.<string, string>} */
noh.Attrs;

/** @typedef {Array.<noh.Node>} */
noh.Nodes;

/** @typedef {(noh.Attrs|noh.Node|string|Array.<noh.AttrsAndNodes>|Arguments.<AttrsAndNodes>|undefined)} */
noh.AttrsAndNodes; 

/** @typedef {{attrs: noh.Attrs, nodes:noh.Nodes}} */
noh.RecAttrsAndNodes;



/**
 * @param {string=} opt_msg
 * @constructor
 * @extends {Error}
 */
noh.NotImplementedError = function(opt_msg) { if(opt_msg) this.message = opt_msg; };
noh.NotImplementedError.prototype = new Error("Not implemented");

/**
 * @param {string=} opt_msg
 * @constructor
 * @extends {NotImplementedError}
 */
noh.NotSupportedError = function(opt_msg) { if(opt_msg) this.message = opt_msg; };
noh.NotSupportedError.prototype = new noh.NotImplementedError("Operation not supported");




/**
 * Default NOH library settings. Options can be overridden by {@link:noh.init} function parameter
 * @type {noh.Options}
 */
noh.options = { 
  /** will we pollute global namespace with noh functions; if false (default), everything will be available only under the {@link:noh} namespace */
  pollute: false
};


/**
 * The list of HTML tags (used for automatic helper function generation) (read only)
 * @const
 */
noh.TAGS = [
  //TODO: this is too big - remove unwanted tags later (we want probably only those inside body)..
  //TODO: add SVG related tags (maybe MathML related tags too??) (but maybe in another file(s))
  "html", "head", "body", "script", "meta", "title", "link",
  "div", "p", "span", "a", "img", "br", "hr", "em", "i", "strong",
  "table", "tr", "th", "td", "thead", "tbody", "tfoot", "colgroup", "col",
  "ul", "ol", "li", 
  "dl", "dt", "dd",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "form", "fieldset", "input", "textarea", "label", "select", "option", "b", "pre", "code", "i", "button",
  "kbd"
];


/**
 * This function has to be called before any other NOH function. It has to be called exactly once.
 * @param {!noh.Options=} opt_options user can provide here values for some global NOH options to change it behaviour (optional)
 */
noh.init = function(opt_options) {
  if(noh.init.done_)
    throw new NotSupportedError("The init function should be called only once!");

  $.extend(noh.options, opt_options);                           

  noh.text = function(text) { return new noh.Text(text); };

  /**
   * @param {string} tag
   * @return {function(...noh.AttrsAndNodes):noh.Element}
   */
  var genTag = function(tag) {
    return function(var_args) {
      return new noh.Element(tag, arguments);
    };
  };

  for(var i = 0; i < noh.TAGS.length; ++i)
    noh[noh.TAGS[i]] = genTag(noh.TAGS[i]); //TODO: maybe just type all possible functions by hand - to be able to annotate it all with type comments for closure compiler checking and optimisation

  if(noh.options.pollute)
    for(var i = 0; i < noh.TAGS.length; ++i)
      window[noh.TAGS[i]] = noh[noh.TAGS[i]];

  noh.init.done_ = true;
};


/**
 * This helper function is used to parse the arguments in a clever way.
 * We want to get an object representing the attributes of created Element (like {@linkcode {href:"http://foo.com", "class":"some_css_class"..}})
 * and a list of children of new created element, where every child is a Node.
 * But we want the user to have the ability to provide this information in many different ways.
 * So this function have to guess for example:
 * <ul>
 * <li> which arguments represents the Element attributes </li>
 * <li> which are not Nodes but simple strings and have to be wrapped in Text nodes </li>
 * <li> which are single children, and which is a whole list of children (All nested Array like objects are just flattened) </li>
 * <li> which we have to ignore (user can pass some undefined arguments and we will ignore them) </li>
 * </ul>
 * Pretty examples of using this flexibility should be presented in the main documentation: {@link index.html|NOH Library documentation}
 * @param {noh.AttrsAndNodes} args Arguments parsed as attributes and nodes.
 * @param {number=} opt_ignore Number of elements to ignore at the beginning of args list. It is important only if args is an array-like object (default is 0)
 * @param {noh.RecAttrsAndNodes=} opt_result A result object to be extended.
 * @return {noh.RecAttrsAndNodes} Attributes and children extracted from args.
 */
noh.organize = function(args, opt_ignore, opt_result) {

  var result = opt_result ? opt_result : {
    attrs: {},
    nodes: []
  };

  if(args instanceof noh.Node)
    result.nodes.push(args);
  else if(typeof args === "string")
    result.nodes.push(noh.text(args));
  else if(noh.arr.isArrayLike(args))
    for(var i = opt_ignore === undefined ? 0 : opt_ignore; i < args.length; ++i)
      noh.organize(args[i], 0, result);
  else if(args instanceof Object)
    $.extend(result.attrs, args);
  else if((args === undefined)||(args === null))
    ;
  else
    throw new TypeError("Unknown argument type: " + typeof args + " value: " + String(args));

  return result;
};


noh.arr = {};


/**
 * Inserts one array elements to the other array (at the end).
 * @param {Array} arrIn The source array.
 * @param {Array} arrOut The destination array.
 * @return {number} New length of the destination array.
 * TODO: do we need it now at all?
 */
noh.arr.push = function(arrIn, arrOut) {
  return arrOut.push.apply(arrOut, arrIn);
};


/**
 * @return {number} index of first occurrence of val in arr; or -1 if not found.
 * @param {*} val A value to find in arr.
 * @param {!Array} arr Array to find the val in.
 */
noh.arr.indexOf = function(val, arr) {
  for(var x = 0; x < arr.length; ++x)
    if(val == arr[x])
      return x;
  return -1;
};



/**
 * Converts an array to an object.
 * @param {!Array.<string>} records Array of object property names in the same order as values in arr parameter.
 * @param {Array} arr array (or null).
 * @return {Object} An object that gets it's property names from records parameter, and values from arr parameter.
 * If arr is null, the returned object will be also null.
 * TODO: do we need it now at all?
 */
noh.arr.arr2obj = function(records, arr) {
  if(arr === null) return null;
  var obj = {};
  for(var x = 0; x < records.length; ++x)
    obj[records[x]] = arr[x];
  return obj;
};

/**
 * Symetric function to the one above.
 * Also accepts null input (and returns null in that case).
 * @param {!Array.<string>} records Array of object property names that defines the order to put the obj values to returned array.
 * @param {Object} obj An input object that provides values to return in array.
 * @return {Array} An array of obj values in order defined by records parameter.
 * TODO: do we need it now at all?
 */
noh.arr.obj2arr = function(records, obj) {
  if(obj === null) return null;
  var arr = [];
  for(var x = 0; x < records.length; ++x)
    arr.push(obj[records[x]]);
  return arr;
};

/**
 * Checks if the provided object is an array or can be used as an array.
 * @param {Object} arr An object to test.
 * @return {boolean} True if arr is an array like object
 */
noh.arr.isArrayLike = function(arr) {
  var hasOwn = Object.prototype.hasOwnProperty;
  var len;
  return arr != null && ( //Here the != is intentional (we don't want to use !==)
    arr instanceof jQuery ||
    typeof(len = arr.length) === "number" && (
      (
        len >= 0 && hasOwn.call(arr, 0) &&
        hasOwn.call(arr, len - 1)
      ) || jQuery.isArray(arr)
    )
  );
};



noh.str = {};

/**
 * Shorten given text to given length max.
 * If text is too long it cuts it, and changes three last letters to "..."
 * @param {string} text
 * @param {number} maxlen
 * @return {string} shortened text
 */
noh.str.limitlen = function(text, maxlen) {
  if(text.length > maxlen) 
    text = text.substr(0, maxlen-3) + "...";
  return text;
};

/**
 * A base constructor for Node objects. This is base "class" for all UI objects created by NOH.
 * @constructor
 */
noh.Node = function() {

  /** Number of children of this Node. Users can not change this directly!. */
  this.length = 0;

  /**
   * @type {noh.Node}
   */
  this.parent = null;

  /**
   * the dom property have to be overriden in derivatives!
   * @type {noh.Node}
   */
  this.dom = null;

  /**
   * The jQuery object representing this node.
   * the $ property have to be overriden in derivatives!
   * TODO: better type description?
   * @type {Object}
   */
  this.$ = null;
};


/**
 * Adds a new child node at the end.
 * @param {!noh.Node} node A node to add as a last child of our node.
 * @return {!noh.Node} this (for chaining)
 */
noh.Node.prototype.add = function(node) {
  node.attachToDOM(this.dom);
  node.parent = this;
  Array.prototype.push.call(this, node);
  return this;
};

/**
 * Removes last child node.
 * @return {!noh.Node} this (for chaining)
 */
noh.Node.prototype.rem = function() {
  var node = Array.prototype.pop.call(this);
  node.parent = null;
  node.detachFromDOM(this.dom);
  return this;
};


/**
 * This dummy method is only for console to display our Node as an array..
 * TODO: implement real splice with callback for inserting and removing DOM elements;
 * then implement other array-like methods using splice. (like: pop, push, shift, unshift) 
 * @see http://stackoverflow.com/questions/6599071/array-like-objects-in-javascript
 */
noh.Node.prototype.splice = function() { throw new NotSupportedError(); };


/**
 * Attaches a node to given DOM root element
 * @param {!noh.Node} root
 * @return {!noh.Node} this (for chaining)
 */
noh.Node.prototype.attachToDOM = function(root) {
  root.appendChild(this.dom);
  return this;
};

/**
 * Detaches a node from given DOM root element
 * @param {!noh.Node} root
 * @return {!noh.Node} this (for chaining)
 */
noh.Node.prototype.detachFromDOM = function(root) {
  root.removeChild(this.dom);
  return this;
};



/**
 * @param {string} text
 * @constructor
 * @extends {noh.Node}
 */
noh.Text = function(text) {
  this.text = text;
  noh.Node.call(this);
  this.dom = document.createTextNode(text);
  this.dom.noh = this;
  this.$ = $(this.dom);
};

noh.Text.prototype = new noh.Node();



/**
 * A base constructor for the DOM elements (Besides HTML elements it can be SVG or MathMl elements).
 * @param {string} tag Tag name like: div or img or table etc..
 * @param {...noh.AttrsAndNodes} var_args Attributes and children nodes. See {@linkcode noh.organize} for more detailed explanation about attributes and children parameters.
 * @constructor
 * @extends {noh.Node}
 */
noh.Element = function(tag, var_args) {
  this.tag = tag;

  noh.Node.call(this);
    
  this.dom = document.createElement(tag);
  this.dom.noh = this;
  this.$ = $(this.dom);

  var an = noh.organize(arguments, 1);

  for(var a in an.attrs)
    this.attr(a, an.attrs[a]);

  for(var i = 0; i < an.nodes.length; ++i)
    this.add(an.nodes[i]);
};

noh.Element.prototype = new noh.Node();

/**
 * Sets an element's attribute
 * @param {string} name
 * @param {string} value
 * @return {!noh.Element} this (for chaining)
 */
noh.Element.prototype.attr = function(name, value) {
  this.$.attr(name, value);
  return this;
};


/**
 * Applies the css style (just a convenient shortcut for typical jQuery method invocation)
 * @see http://api.jquery.com/css/#css2
 * @param {string} name CSS property name
 * @param {string} value CSS property value
 * @return {!noh.Element} this (for chaining)
 */
noh.Element.prototype.css = function(name, value) {
  this.$.css(name, value);
  return this;
};

/**
 * Attach an event handling function for one or more events to this element.
 * (just a convenient shortcut for typical jQuery method invocation)
 * @see http://api.jquery.com/on/#on-events-selector-data-handlereventObject
 * @param {string} events One or more space separated events (usually its just one word like: "click")
 * @param {string} handler A function to execute when the event is triggered.
 * @return {!noh.Element} this (for chaining)
 */
noh.Element.prototype.on = function(events, handler) {
  this.$.on(events, handler);
  return this;
};

/**
 * Add one or more classes to element's "class" attribute
 * @param {string} class One or more space-separated classes to add to the class attribute
 * @return {!noh.Element} this (for chaining)
 */
noh.Element.prototype.addclass = function(aclass) {
  this.$.addClass(aclass);
  return this;
}

noh.Element.prototype.hasclass = function(aclass) {
  return this.$.hasClass(aclass);
}

noh.Element.prototype.toggleclass = function(aclass) {
  this.$.toggleClass(aclass);
  return this;
}




/**
 * Remove one or more classes from element's "class" attribute
 * @param {string} class One or more space-separated classes to be removed from the class attribute
 * @return {!noh.Element} this (for chaining)
 */
noh.Element.prototype.remclass = function(aclass) {
  this.$.removeClass(aclass);
  return this;
}




/**
 * Scrolls the page to given position (in pixels)
 * @param {number} offset Position to which to scroll. (in pixels; from the top of the page)
 * @param {number=} opt_duration Time in miliseconds determining how long the scrolling will run. Default is 1000
 */
noh.scroll = function(offset, opt_duration) {
  $('html,body').animate( {scrollTop: offset }, opt_duration ? opt_duration : 1000); 
};


/**
 * Scrolls the page, so the element is on the top
 * @param {number=} opt_duration Time in miliseconds determining how long the scrolling will run. Default is 1000
 * @return {!noh.Element} this (for chaining)
 */
noh.Element.prototype.scroll = function(opt_duration) {
  noh.scroll(this.$.offset().top, opt_duration);
  return this;
}


/* 
 * *************************************************************
 * Core code ends here.
 * The rest of this file contains some basic but useful examples
 * *************************************************************
 */







/**
 * Just a shortcut for a table with one row only
 * @param {...noh.AttrsAndNodes} var_args Attributes and children nodes. See {@linkcode noh.organize} for more detailed explanation about attributes and children parameters.
 * @return {noh.Element} A new table Node with one row and given attributes and children.
 */
noh.table1r = function(var_args) {
  var an = noh.organize(arguments);
  return noh.table(an.attrs, noh.tbody(noh.tr(an.nodes)));
};



/**
 * A horizontal bar of any given elemens that uses table with one row (with attribute "class" set to "bar" by default)
 * Yes, I know that using tables to force layout is a bad practice :-)
 * @param {...noh.AttrsAndNodes} var_args Attributes and children nodes.
 */
noh.tablebar = function(var_args) {
    var an = noh.organize(arguments);
    var cells = [];
    for(var x = 0; x < an.children.length; ++x)
        cells.push(j.td(an.nodes[x]));
    return noh.table1r({"class":"noh bar"}, an.attrs, cells);
};
// TODO: better bars: bar(horizontal/vertical, ...); hbar = bar(horizontal, ...); vbar = ... And no tables! (but css)









/**
 * Generates the pre element prepared for SyntaxHighlighter plugin
 * @see http://alexgorbatchev.com/SyntaxHighlighter/
 * @param {string} brush The SyntaxHighlighter brush to use (like "js" fo JavaScript)
 * @param {string} code The code to display.
 * @return {noh.Element} A new pre Element prepared to colorize by SyntaxHighlighter plugin.
 */
noh.syntaxhl = function(brush, code) {
  return noh.pre({"class":"brush: " + brush + "; toolbar: false"}, code);
};

/**
 * This Element creates the "pre" html element with a source code of given function inside.
 * The "pre" element CSS "class" is set to match the SyntaxHighlighter requirements and
 * can be easly coloured using that plugin.
 * @see {@link http://alexgorbatchev.com/SyntaxHighlighter|SyntaxHighlighter} The highlighting plugin.
 * @see index.html Examples of using this element and SyntaxHighlighter plugin.
 * @param {function()} afunction The function which source code should be rendered.
 * @return {noh.Element} A new srccode Element.
 */
noh.srccode = function(afunction) {
  return noh.syntaxhl("js", afunction.toString());
};




/**
 * This Element will fly over the page (position:fixed). User should some CSS classes to it:
 * "left" or "right" and "top" or "bottom" (but never: "left" and "right" or "top" and "bottom")
 * It will stick to given screen side automaticly (with some little margin)
 * and it can be swept away to nearest side using .hide() method; and brought back using the .show() method().
 * It should be under element with "smooth" class so it moves smoothly.
 * If user fails to add some position related classes to it, he can still manage the overlay position by hand.
 * Note: it is a good idea for overlay's children to have CSS class "pretty" so it will get some pretty default styles
 * @param {...noh.AttrsAndNodes} var_args Attributes and children nodes.
 * @return {!noh.Element} A new overlay.
 */
noh.overlay = function(var_args) {

  var overlay = noh.div(arguments).addclass("noh overlay");
  
  overlay.show = function() {
    if(this.hasclass("left"))
      this.css("left", ""); // determined by the CSS rule
    if(this.hasclass("right"))
      this.css("right", ""); // determined by the CSS rule
    if(this.hasclass("top"))
      this.css("top", ""); // determined by the CSS rule
    if(this.hasclass("bottom"))
      this.css("bottom", ""); // determined by the CSS rule
    this.remclass("hidden").addclass("visible");
    return this;
  };

  overlay.hide = function() {
    var w = this.$.width();
    var h = this.$.height();
    if(this.hasclass("left"))
      this.css("left", "" + (-w-50) + "px");
    else if(this.hasclass("right"))
      this.css("right", "" + (-w-50) + "px");
    else if(this.hasclass("top"))
      this.css("top", "" + (-h-50) + "px");
    else if(this.hasclass("bottom"))
      this.css("bottom", "" + (-h-50) + "px");
    this.remclass("visible").addclass("hidden");
    return this;
  };

  return overlay;
};




/**
 * Makes given element sleepy. By default it is in "asleep" state (it has the "asleep" CSS class)
 * If we wake it (method: wake) it will be awake (will have the "awake" CSS class) for some time.
 * Then it will fall asleep again (the "awake" CSS class is removed, and it gets "asleep" CSS class).
 * User can wake it again by invoking the "wake" method.
 * User can of course define how it will behave in "awake" and in "asleep" states in CSS file.
 * @param {!noh.Element} element to modify
 * @param {number=} opt_duration How many miliseconds will it be awake by default (it will be 1000 if not provided).
 * @return {!noh.Element}
 */
noh.sleepy = function(element, opt_duration) {

  element.addclass("noh").addclass("sleepy");

  element.defaultAwakeTime_ = opt_duration === undefined ? 1000 : opt_duration;

  element.wake = function(opt_duration) {
    this.remclass("asleep").addclass("awake");
    window.clearTimeout(this.timeoutId_);
    var duration = opt_duration === undefined ? element.defaultAwakeTime_ : opt_duration;
    var callback = function() { element.sleep(); }
    this.timeoutId_ = window.setTimeout(callback, duration);
  };

  element.sleep = function() {
    window.clearTimeout(this.timeoutId_);
    this.timeoutId_ = undefined;
    this.remclass("awake").addclass("asleep");
  };

  element.sleep();

  return element;
};








/**
 * An object that can show or hide it's content by rolling it down (hidden->visible) or up (visible->hidden)
 * @interface
 */
noh.IBlind = function() {};

/**
 * Returns if the content is visible (down).
 * @return {boolean}
 */
noh.IBlind.prototype.down = function() {};

/**
 * Rolls the blind down (to show it content) or up (hiding the content)
 * @param {boolean} down
 * @return {!noh.IBlind} this (for chaining)
 */
noh.IBlind.prototype.roll = function(down) {};



/**
 * An object that can show or hide it's content by rolling it down (hidden->visible) or up (visible->hidden)
 * @param {...noh.AttrsAndNodes} var_args Attributes and children nodes. See {@linkcode noh.organize} for more detailed explanation about attributes and children parameters.
 * @constructor
 * @extends {noh.Element}
 * @implements {noh.IBlind}
 * TODO: it can change its size dynamicly so it should be inside some absolutely positioned block, for better performance.
 * (to avoid forcing browser to relayout the whole page too much)
 */
noh.Blind = function(var_args) {
  var content = noh.div({class:'noh blind content'}, arguments);
  noh.Element.call(this, "div", {class: 'noh blind'}, content);
  this.content_ = content;
  this.roll(false);
  var this_ = this;
  this.$.show(function() {this_.roll(this_.down());});
};

noh.Blind.prototype = new noh.Element("div");

/**
 * Returns if the content is visible (down).
 * @return {boolean}
 */
noh.Blind.prototype.down = function() { return this.down_; };

/**
 * Rolls the blind down (to show it content) or up (hiding the content)
 * @param {boolean} down
 * @return {!noh.Blind} this (for chaining)
 */
noh.Blind.prototype.roll = function(down) {
  var $blind = this.$;
  var $content = this.content_.$;
  var w = $content.width();
  var h = $content.height();
  $content.css("clip", "rect(0px " + w + "px " + (down ? h : 0) + "px 0px");
  if(down) {
    this.content_.remclass("hidden");
    this.content_.addclass("visible");
  }
  else {
    this.content_.remclass("visible");
    this.content_.addclass("hidden");
  }
  $blind.width(w);
  $blind.height(down ? h : 0);
  this.down_ = down;
  return this;
};

/**
 * TODO: description
 * @param {...noh.AttrsAndNodes} var_args Attributes and children nodes
 * @return {!noh.Blind}
 */
noh.blind = function(var_args) {
  return new noh.Blind(arguments);
};




/**
 * An object that contains a collection of elements and always one of them can be "selected" (or none)
 * @interface
 */
noh.IOneOf = function() {};

/**
 * Returns which element is selected (or -1 if none is selected)
 * @return {number}
 */
noh.IOneOf.prototype.selected = function() {};

/**
 * Selects an element with given index (-1 means: do not select any element)
 * @param {number} idx
 * @return {!noh.IOneOf} this (for chaining)
 */
noh.IOneOf.prototype.select = function(idx) {};





/**
 * Element that displays one of his children at a time (or none).
 * (the children are placed one below another and then their visibility is changed respectively)
 * @param {...noh.AttrsAndNodes} var_args Attributes and children nodes. See {@linkcode noh.organize} for more detailed explanation about attributes and children parameters.
 * @constructor
 * @extends {noh.Element}
 * @implements {noh.IOneOf}
 * TODO: it can change its size dynamicly so it should be inside some absolutely positioned block, for better performance.
 */
noh.OneOf = function(var_args) {
  var an = noh.organize(arguments);
  for(var i = 0; i < an.nodes.length; ++i) {
    var blind = noh.blind(an.nodes[i]);
    an.nodes[i] = blind;
    blind.oneOfIdx_ = i;
  }
  noh.Element.call(this, "div", {class: 'noh oneof'}, an.attrs, an.nodes);

  this.selected_ = -1; 
};

noh.OneOf.prototype = new noh.Element("div");

/**
 * @return {number}
 */
noh.OneOf.prototype.selected = function() { return this.selected_; };

/**
 * Displays given child and hides all the others.
 * @param {(number|noh.Node)} idx Number of child to display or the child Node itself. (-1 or null means: do not display any child)
 * @return {!noh.OneOf} this (for chaining)
 */
noh.OneOf.prototype.select = function(idx) {
  if(idx instanceof noh.Node)
    idx = idx.oneOfIdx_;
  else if(idx === null)
    idx = -1;
  var l = this.length;
  if((idx < -1) || (idx >= l))
    idx = -1;

  if(this.selected_ != -1)
    this[this.selected_].roll(false);

  if(idx != -1)
    this[idx].roll(true);

  this.selected_ = idx;

  return this;
};

/** @private */
noh.OneOf.prototype.selectModulo_ = function(idx) {
  return this.select(idx < 0 ? this.length-1 : idx % this.length);
};

/**
 * Changes the displayed child to the next one.
 */
noh.OneOf.prototype.next = function() { return this.selectModulo_(this.selected() + 1); };

/**
 * Changes the displayed child to the previous one.
 */
noh.OneOf.prototype.prev = function() { return this.selectModulo_(this.selected() - 1); };


/**
 * TODO: description
 * @param {...noh.AttrsAndNodes} var_args Attributes and children nodes
 * @return {!noh.OneOf}
 */
noh.oneof = function(var_args) {
  return new noh.OneOf(arguments);
};



/**
 * This Element displays the "details..." button, and displays the content only after user clicks it.
 * Then the user can hide the content again by clicking the button again.
 * @param {...noh.AttrsAndNodes} var_args Attributes and children nodes
 * @return {!noh.Element} 
 */
noh.details = function(var_args) {
  var content = noh.div({class: "noh details content"}, arguments);
  var blind = noh.blind(content);
  var button = noh.button({class: "noh details button", title: "show/hide details"}, "details...");
  button.on("click", function() {blind.roll(!blind.down());});
  return noh.div({class: "noh details"}, noh.div(button), noh.div(blind));
};




/**
 * An object that can rotate its children up or down
 * @param {number} lines How many elements will be visible. The rest will be hidden (opacity:0 unless user change some css styles)
 * @param {string|number} width A width of the reel. It should be set big enough, so all elements fit inside.
 * It will be used to set three CSS properties: "width", "min-width", "max-width", so it can be string like "400px".
 * It can also be set to special value: "dynamic" or: "automatic",
 * and in that case it will be computed automaticly using the actual size of elements, when reel is shown and when it rotates.
 * The difference between "automatic" and "dynamic" is that "dynamic" take into account only visible element in every moment,
 * and "automatic" checks all elements every time (also hidden ones) (as a result "dynamic" is little more dynamic that "automatic")
 * @param {string|number} height A height of the reel. It should be set big enough, so elements don't overlap too much.
 * See param width for details.
 * @param {...noh.AttrsAndNodes} var_args Attributes and children nodes. See {@linkcode noh.organize} for more detailed explanation about attributes and children parameters.
 * @constructor
 * @extends {noh.Element}
 * @implements {noh.IOneOf}
 * TODO: it can change its size dynamicly so it should be inside some absolutely positioned block, for better performance.
 */
noh.Reel = function(lines, width, height, var_args) {
  var an = noh.organize(arguments, 3);
  for(var i = 0; i < an.nodes.length; ++i) {
    var element = noh.div({class:'noh reel element'}, an.nodes[i]);
    an.nodes[i] = element;
  }
  noh.Element.call(this, "div", {class: 'noh reel'}, an.attrs, an.nodes);

  /**
   * @readonly
   */
  this.lines = lines;

  /**
   * @readonly
   */
  this.rotation = 0;

  this.width = width;
  this.height = height;
  this.chksize();

  var this_ = this;
  this.$.show(function() {
    this_.update();
  });
  this.selected_ = -1;
};

noh.Reel.prototype = new noh.Element("div");

/**
 * @return {number}
 */
noh.Reel.prototype.selected = function() { return this.selected_; };

/**
 * Select given line (element at that line nr will always have CSS class "selected")
 * @param {number} nr Line nr to select.
 * @return {!noh.Reel} this (for chaining)
 */
noh.Reel.prototype.select = function(nr) {
  if((nr < -1) || (nr >= this.length))
    nr = -1;

  if(this.selected_ == nr)
    return this;

  if(this.selected_ != -1)
    this.getelem(this.selected_).remclass("selected");

  if(nr != -1)
    this.getelem(nr).addclass("selected");

  this.selected_ = nr;

  return this;
};

/**
 * Updates CSS properties: "min-width", "max-width", "width", "min-height", "max-height", "height"; if reel width and height was specified as "dynamic"
 */
noh.Reel.prototype.chksize = function() {
  var size = 0;
  var maxsize = 0;
  if(this.width == "automatic") {
    for(var i = 0; i < this.length; ++i) {
      esize = this[i].$.width();
      if(esize > size)
        size = esize;
    }
  }
  else if(this.width == "dynamic") {
    for(var i = 0; i < this.lines; ++i) {
      esize = this.getelem(i).$.width();
      if(esize > size)
        size = esize;
    }
  }
  else
    size = this.width;
  this.css("min-width", size).css("max-width", size).css("width", size);
  this.exactwidth_ = size;

  size = 0;
  if(this.height == "automatic") {
    for(var i = 0; i < this.length; ++i) {
      esize = this[i].$.height();
      if(esize > size)
        size = esize;
    }
    size *= this.lines;
  }
  else if(this.height == "dynamic") {
    for(var i = 0; i < this.lines; ++i) {
      esize = this.getelem(i).$.height();
      if(esize > size)
        size = esize;
    }
    size *= this.lines;
  }
  else
    size = this.height;
  this.css("min-height", size).css("max-height", size).css("height", size);
  this.exactheight_ = size;
};

/**
 * @param {number} nr Line nr
 * @return {number} fixed line nr. Between 0 and this.length-1
 */
noh.Reel.prototype.fixLineNr_ = function(nr) {
  while(nr < 0)
    nr += this.length; //FIXME: better computation, without loop.
  while(nr >= this.length)
    nr -= this.length; //FIXME: better computation, without loop.

  return nr;
};


/**
 * Returns a child at given position according to actual rotation.
 * Position 0 is at the top, 1 is below it, and so on..
 * @param {number} nr Which line to get.
 * @return {noh.Node} A child at given position.
 */
noh.Reel.prototype.getelem = function(nr) {
  return this[this.fixLineNr_(nr - this.rotation)];
};

/**
 * Update the reel properties like size, elements positions, CSS classes etc.
 * @param {number} opt_lines Optionally we can change the number of visible elements.
 * @return {!noh.Reel} this (for chaining)
 */
noh.Reel.prototype.update = function(opt_lines) {

  if(opt_lines !== undefined)
    this.lines = opt_lines;
  //TODO: check opt_lines value in debug mode

  this.chksize();

  for(var i = 0; i < this.length; ++i) {
    var element = this.getelem(i);
    element.remclass("selected");
    if(i < this.lines) {
      element.remclass("hidden").addclass("visible");
      element.css("top", "" + (i * this.exactheight_ / this.lines) + "px");
    }
    else {
      element.remclass("visible").addclass("hidden");
      element.css("top", "" + ((this.length-i-1) * this.exactheight_ / (this.length-this.lines)) + "px");
    }
  }
  if(this.selected_ != -1)
    this.getelem(this.selected_).addclass("selected");
  return this;
};


/**
 * Rotates the reel
 * @param {number} count How many lines to rotate down. (Negative means up)
 * @return {!noh.Reel} this (for chaining)
 */
noh.Reel.prototype.rotate = function(count) {
  this.rotation = this.fixLineNr_(this.rotation + count);
  return this.update();
};


/**
 * Rotates the reel many times with time gaps
 * @param {number} count How many lines to rotate down. (Negative means up)
 * @param {number=} opt_random If specified, the reel will generate random number between 0 and opt_random, and add it to param count.
 * @param {number=} opt_speed Defines how many milisecond to wait between single rotations. Default is 200
 * @return {!noh.Reel} this (for chaining)
 */
noh.Reel.prototype.spin = function(count, opt_random, opt_time) {
  if(this.intervalId_) {
    console.error("The reel is already spinning!");
    return;
  }
  if(opt_random)
    count += Math.round(Math.random() * opt_random);
  var time = opt_time ? opt_time : 200;
  var this_ = this;
  var callback = function() {
    if(count == 0) {
      window.clearInterval(this_.intervalId_);
      this_.intervalId_ = undefined;
    }
    else if(count > 0) {
      this_.rotate(1);
      --count;
    }
    else {
      this_.rotate(-1);
      ++count;
    }
  };
  this.intervalId_ = window.setInterval(callback, time);
};

/**
 * TODO: description
 * @param {number} lines See {@linkcode noh.Reel} for details.
 * @param {string|number} width See {@linkcode noh.Reel} for details. 
 * @param {string|number} height See {@linkcode noh.Reel} for details. 
 * @param {...noh.AttrsAndNodes} var_args See {@linkcode noh.Reel} for details.  
 * @return {!noh.Reel}
 */
noh.reel = function(lines, width, height, var_args) {
  var an = noh.organize(arguments, 3);
  return new noh.Reel(lines, width, height, an.attrs, an.nodes);
};



/**
 * Makes given element more fancy.
 * It always add a "fancy" class (so we can define in CSS file what really is "fancy",
 * but it can also add some more fun javascript stuff to some elements (depending of the element type)
 * you can enable/disable/configure different fancy features using "options" parameter.
 * @param {!noh.Element} element to modify
 * @param {noh.FancyOptions=} opt_options TODO: define some configuration options
 * @return {!noh.Element}
 */
noh.fancy = function(element, opt_options) {
  element.addclass("fancy");
  if(noh.arr.indexOf(element.tag, ["h1", "h2", "h3", "h4"]) != -1) {
    element.on("click", function() { this.noh.scroll(); });
  }
  return element;
}




/**
 * Something like a simple "kbd" element, but it wraps urls in given text inside the appropriate "a" elements.
 * @param {string} atext Text to wrap inside kdb element.
 * @return {!noh.Element} kbd element with given text splitted to words; and with urls wrapped inside the a links
 */
noh.ukbd = function(atext) {
  var words = atext.split(/\s+/);
  var url = /(https?|ftp):\/\//;
  var map = words.map(function(word) {
    if(url.test(word))
      return a({href:word, target:"_blank"}, word);
    else
      return " " + word + " ";
  });
  return noh.kbd(map);
}









noh.log = {};




/** @typedef {!ArrayLike.<*>} */
noh.log.Data; //FIXME: how to express ArrayLike type?


/**
 * @param {noh.log.Data} data
 * @return {string}
 */
noh.log.data2str = function(data) {
  var str = "";
  if(data.length > 0)
    str += data[0];
  for(var i = 1; i < data.length; ++i)
    str = str + " " + data[i].toString();  
  return str;
};

/**
 * @interface
 * This is basic interface for loggers.
 */
noh.log.ILogger = function() {};


/**
 * Logs given data with given severity
 * @param {string} classes One or more (space separated) classes to decorate the logged message (like: "info", or "warning", or "error", or "debug")
 * @param {noh.log.Data} data Data to log. It has to be an array like object.
 */
noh.log.ILogger.prototype.log = function(classes, data) {};





/**
 * Little (one line) logger.
 * @constructor
 * @implements {noh.log.ILogger}
 */
noh.log.Little = function() {
  noh.Element.call(this, "div", {class: 'noh log little'});
};

noh.log.Little.prototype = new noh.Element("div");

/**
/**
 * Logs given data with given severity
 * @param {string} classes One or more (space separated) classes to decorate the logged message (like: "info", or "warning", or "error", or "debug")
 * @param {!Array.<*>} data Data to log. It has to be an array like object.
 */
noh.log.Little.prototype.log = function(classes, data) { 
  if(this.length)
    this.rem(); // removes last (in this case only one) child.
  var ukbd = noh.ukbd(noh.log.data2str(data)).addclass("noh log element").addclass(classes);
  this.add(ukbd);
};


/**
 * Little (one line) logger.
 * @return {!noh.log.ILogger}
 */
noh.log.little = function() {
  return new noh.log.Little();
};


/**
 * Sleepy little logger
 * @param {number=} opt_duration How many miliseconds will it be visible. See {@linkcode noh.sleepy}
 * @return {!noh.log.ILogger}
 */
noh.log.slittle = function(opt_duration) {
  var little = noh.log.little();
  var slittle = noh.sleepy(little, opt_duration);
  slittle.log_ = slittle.log;
  slittle.log = function(classes, data) { this.log_(classes, data); this.wake(); };
  return slittle;
};







/**
 * @interface
 * Another interface for loggers. This one is subset of chrome console API and firefox console API.
 * It just allows to log messages with three different severity levels:
 * "info", "warn", "error" (and "log" which is the same as "info")
 */
noh.log.IConsole = function() {};

/**
 * Logs given data with default (general) severity. Usually this is the same as "info"
 * @param {...*} var_args Data to log. Strings are printed as they are; numbers are converted to strings; Objects are converted to strings using .toString() method.
 */
noh.log.IConsole.prototype.log = function(var_args) {};

/**
 * Logs given data with "info" (normal) severity. Usually this is the same as "log"
 * @param {...*} var_args Data to log. {@linkcode noh.IConsole.prototype.log}
 */
noh.log.IConsole.prototype.info = function(var_args) {};

/**
 * Logs given data with "warn" (warning) severity. Usually this severity is marked somehow (like bold font), but not with red color.
 * @param {...*} var_args Data to log. {@linkcode noh.IConsole.prototype.log}
 */
noh.log.IConsole.prototype.warn = function(var_args) {};

/**
 * Logs given data with "error" severity. Usually this severity is highlighted (f.e. with red bold font).
 * @param {...*} var_args Data to log. {@linkcode noh.IConsole.prototype.log}
 */
noh.log.IConsole.prototype.error = function(var_args) {};




/**
 * Wraps an ILogger object into IConsole.
 * This console can be then installed as global console object (window.console), so all system logs will be logged using given logger.
 * @implements {noh.IConsole}
 * @constructor
 * @param {!noh.log.ILogger} logger A logger to wrap.
 */
noh.log.L2C = function(logger) {
  this.logger = logger;
};


/**
 * Logs given data with default (general) severity. This is the same as "info"
 * @param {...*} var_args Data to log. Strings are printed as they are; numbers are converted to strings; Objects are converted to strings using .toString() method.
 */
noh.log.L2C.prototype.log = function(var_args) { this.logger.log("info", arguments); };

/**
 * Logs given data with "info" (normal) severity.
 * @param {...*} var_args Data to log. {@linkcode noh.log.IConsole.prototype.log}
 */
noh.log.L2C.prototype.info = function(var_args) { this.logger.log("info", arguments); };

/**
 * Logs given data with "warn" (warning) severity. Usually this severity is marked somehow (like bold font), but not with red color.
 * @param {...*} var_args Data to log. {@linkcode noh.log.IConsole.prototype.log}
 */
noh.log.L2C.prototype.warn = function(var_args) { this.logger.log("warning", arguments); };

/**
 * Logs given data with "error" severity. Usually this severity is highlighted (f.e. with red bold font).
 * @param {...*} var_args Data to log. {@linkcode noh.log.IConsole.prototype.log}
 */
noh.log.L2C.prototype.error = function(var_args) { this.logger.log("error", arguments); };

noh.log.L2C.prototype.debug = function(var_args) { this.logger.log("debug", arguments); };

/**
 * Installs this console as a global console object.
 */
noh.log.L2C.prototype.install = function() { window.console = this; };


/**
 * Wraps an ILogger object into IConsole.
 * This console can be then installed as global console object (window.console), so all system logs will be logged using given logger.
 * @param {!noh.log.ILogger} logger
 * @return {!noh.log.IConsole}
 */
noh.log.l2c = function(logger) {
  return new noh.log.L2C(logger);  
};






/**
 * Wraps an IConsole object into ILogger.
 * @implements {noh.ILogger}
 * @constructor
 * @param {!noh.log.IConsole} console A console to wrap.
 */
noh.log.C2L = function(console) {
  this.console = console;
};

/**
 * Logs given data with given severity
 * @param {string} classes One or more (space separated) classes to decorate the logged message (like: "info", or "warning", or "error", or "debug")
 * @param {!Array.<*>} data Data to log. It has to be an array like object.
 */
noh.log.C2L.prototype.log = function(classes, data) {
  if(/error/.test(classes))
    this.console.error.apply(this.console, data);
  else if(/warning/.test(classes))
    this.console.warn.apply(this.console, data);
  else if( (/debug/.test(classes)) && (this.console.debug instanceof Function) )
    this.console.debug.apply(this.console, data);
  else
    this.console.info.apply(this.console, data);
};


/**
 * Wraps an IConsole object into ILogger.
 * @param {!noh.log.IConsole} console
 * @return {!noh.log.ILogger}
 */
noh.log.c2l = function(console) {
  return new noh.log.C2L(console);
};




/**
 * Creates a logger that logs on all provided loggers.
 * @implements {noh.log.ILogger}
 * @constructor
 * @param {Array.<!noh.log.ILogger>} loggers
 */
noh.log.Multi = function(loggers) {
  this.loggers = loggers;
};

noh.log.Multi.prototype.log = function(classes, data) {
  for(var i = 0; i < this.loggers.length; ++i)
    this.loggers[i].log(classes, data);
};

/**
 * @param {Array.<!noh.ILogger>} loggers
 * @return {!noh.ILogger}
 */
noh.log.multi = function(loggers) {
  return new noh.log.Multi(loggers);
};



/**
 * Creates a logger that filters every message first (through provided filter function),
 * and then logs the result.
 * @implements {noh.log.ILogger}
 * @constructor
 * @param {!noh.log.ILogger} logger
 * @param {function(noh.log.Data):noh.log.Data} filter
 */
noh.log.Filter = function(logger, filter) {
  this.logger = logger;
  this.filter = filter;
};

noh.log.Filter.prototype.log = function(classes, data) {
  this.logger.log(classes, this.filter(data));
};

/**
 * @param {!noh.log.ILogger} logger
 * @param {function(noh.log.Data):noh.log.Data} filter
 * @return {!noh.ILogger}
 */
noh.log.filter = function(logger, filter) {
  return new noh.log.Filter(logger, filter);
};



/**
 * TODO: description
 * @param {!noh.log.ILogger} logger
 * @return {!noh.ILogger}
 */
noh.log.addtime = function(logger) {
  var filter = function(data) {
    var now = new Date();
    var time = "[" + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + "]";
    return [time].concat(Array.prototype.slice.call(data, 0));
  };
  return noh.log.filter(logger, filter);
};



/**
 * TODO: description
 * @param {!noh.log.ILogger} logger
 * @param {number} len
 * @return {!noh.ILogger}
 */
noh.log.limitlen = function(logger, len) {
  var filter = function(data) {
    var str = noh.log.data2str(data);
    return [noh.str.limitlen(str, len)];
  };
  return noh.log.filter(logger, filter);
};





/**
 * Creates a logger that uses Reel to rotate log lines.
 * @param {number} lines Number of visible lines.
 * @param {number=} opt_duration How many miliseconds will any log line be visible. See {@linkcode noh.log.slittle}
 * @return {!noh.log.ILogger}
 */
noh.log.reel = function(lines, opt_duration) {
  //TODO: validation of lines value in debug mode
  var length = lines * 2 + 1;
  var duration = opt_duration === undefined ? 10000 : opt_duration;
  var loggers = [];
  for(var i = 0; i < length; ++i)
    loggers.push(noh.log.slittle(duration));
  var reel = noh.reel(lines, "automatic", "automatic", loggers);
  reel.select(lines-1);
  logger = noh.div({class: "noh log reel"}, reel);
  logger.reel = reel;
  logger.log = function(classes, data) {
    var logger = this.reel.getelem(this.reel.lines)[0]; // This is first invisible logger
    logger.log(classes, data);
    this.reel.rotate(-1);
  };
  logger.setlines = function(lines) {
    var r = lines - this.reel.lines;
    this.reel.lines = lines;
    this.reel.rotate(r);
  };
  return logger;
};





/*****************************************************************************
 * FIXME: the rest of this file is an old not tested code!
 * TODO: review it first! (use chaining - it wasn't there when this code was written)
 * TODO: make simple tests for it and try it out
 ****************************************************************************/











/**
 * An object that can be in two logical states. Selected or not selected.
 * @interface
 */
noh.ISelectable = function() {};

/**
 * Checks if the object is selected or not.
 * @return {boolean} If the object is selected.
 */
noh.ISelectable.prototype.selected = function() {};

/**
 * Selects/deselects the object. (depending on this.selected())
 * @return {!noh.ISelectable} this (for chaining)
 */
noh.ISelectable.prototype.toggle = function() {};



/** 
 * This Element is prepared to be used as a menu item. It can be selected or not.
 * It will have css classes: "noh", "menu" and "item", (and "selected" if it is in selected state).
 * It changes its state when clicked (selected/not selected) (by calling the toggle method)
 * The toggle method can be overriden to add some functionality when the state is changing.
 * @param {noh.Node|string} content Usually it is just a text to display, but it can be any noh.Node.
 * @constructor               
 * @extends {noh.Element}
 * @implements {noh.ISelectable}
 */
noh.MenuItem = function(content) {
  noh.Element.call(this, "div", {"class": "noh menu item"}, content);
  this.on("click", function() { this.noh.toggle(); return false; });
}

noh.MenuItem.prototype = new noh.Element("div");

/**
 * This method should be overriden if we want to add some new fuctionality when the state is changing;
 * but you should call the original toggle anyway
 */
noh.MenuItem.prototype.toggle = function() { this.toggleclass("selected"); };

noh.MenuItem.prototype.selected = function() { return this.hasclass("selected"); };

/**
 * @param {noh.Node|string} content Usually it is just a text to display, but it can be any noh.Node.
 * @return {noh.MenuItem}
 */
noh.menuitem = function(content) { return new noh.MenuItem(content); };

/**
 * A menuitem with additional payload that is shown only when the menuitem is selected
 * @param {noh.ISelectable} item A main part - this is visible all the time
 * @param {noh.Node|string} payload Second part - this is visible only when item is selected. It shows itself below the main part.
 * @return {noh.ISelectable} A menuitem with payload attached.
 * TODO: change to new class BigMenuItem - for better performance and consistency
 */
noh.bigmenuitem = function(item, payload) {
  var oneof = noh.oneof(payload)
  var bigmenuitem = noh.div(
    noh.div(item),
    noh.div(oneof)
  );
  item.toggle_orig_ = item.toggle;
  item.toggle = function() { bigmenuitem.toggle(); };
  bigmenuitem.toggle = function() {
    item.toggle_orig_();  
    oneof.select(this.selected() ? 0 : -1);
  };
  bigmenuitem.selected = function() { return item.selected(); };

  return bigmenuitem;
};

//TODO: test: wrap some menu item with bigmenuitem a few times and check if all payloads are synced
//like: noh.bigmenuitem(noh.bigmenuitem(noh.menuitem("some item"), payload1), payload2)




/**
 * @extends {noh.Element}
 * @implements {noh.IOneOf}
 * @param {...noh.AttrsAndNodes} var_args Attributes and children. Children should be proper menuitems (implement:ISelectable extend:Element)
 */
noh.Menu = function(var_args) {

  var an = noh.organize(arguments);

  noh.Element.call(this, "div", an.attrs, an.nodes);

  this.items_ = an.nodes;

  for(var i = 0; i < this.items_.length; ++i) {
    var item = this.items[i];
    if(item.selected())
      item.toggle();
    item.menu_ = this;
    item.menuIdx_ = i;
    item.toggle_orig_ = item.toggle;
    item.toggle = function() {
      this.menu_.select(this.selected() ? -1 : this.menuIdx_);
    };
  }

  this.selected_ = -1;
};

noh.Menu.prototype = new noh.Element("div");

noh.Menu.prototype.selected = function() { return this.selected_; };

noh.Menu.prototype.select = function(idx) {

  if(this.selected_ != -1)
    this.items_[selected_].toggle_orig_(); // deselects old item

  //TODO: check the idx value in DEBUG mode (check the @define in closure compiler) (make sure it is removed completely in release mode)

  this.selected_ = idx;

  if(idx == -1)
    return;

  this.items_[idx].toggle_orig_(); //selects new item
};


/**
 * TODO: description
 * @param {...noh.AttrsAndNodes} var_args Attributes and children. Children should be proper menuitems (implement:ISelectable extend:Element)
 * @return {!noh.Menu}
 */
noh.menu = function(var_args) {
  return new noh.Menu(arguments);
};



/**
 * A menuitem with additional menu that is shown only when the menuitem is selected
 * @param {noh.ISelectable} item A main part - this is visible all the time
 * @param {noh.Menu} menu Second part - this menu is visible only when item is selected. It shows itself below the main part.
 * @return {noh.ISelectable} A menuitem with menu attached.
 */
noh.submenu = function(item, menu) {
  var submenu = bigmenuitem(item, menu);
  submenu.menu = menu;
  return submenu;
};


