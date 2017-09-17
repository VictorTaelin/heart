(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// feito com muito carinho c:

// Types

// Number, Number -> Vector
function V(x, y) {
  this.x = x;
  this.y = y;
};

// Number, Number, Number, Number -> Atom
function Atom(x, y, vx, vy) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.t = Date.now();
};

// Game

// Number, {w:Number, h:Number}, [[Number,Number]], *GameState -> ()
var tick = function tick(dt, _ref, field, state) {
  var w = _ref.w,
      h = _ref.h;

  var wh = Math.min(w, h);
  for (var i = 0, as = state.atoms, l = as.length; i < l; ++i) {
    var atom = as[i];
    var ax = (atom.x - w * 0.5 + wh * 0.5) / wh * 512;
    var ay = atom.y / wh * 512;
    var gi = Math.round(ax > 511 ? 511 : ax < 0 ? 0 : ax);
    var gj = Math.round(ay > 511 ? 511 : ay < 0 ? 0 : ay);
    var gr = field[gj][gi];
    var gx = gr[0] || 511;
    var gy = gr[1] || 511;
    var dx = gx - ax;
    var dy = gy - ay;
    var ds = Math.max(Math.sqrt(dx * dx + dy * dy), 20);
    var rx = dx * ds;
    var ry = dy * ds;
    atom.vx += 50000 / (ds * ds * ds) * rx * dt;
    atom.vy += 50000 / (ds * ds * ds) * ry * dt;
    atom.vx *= 0.99;
    atom.vy *= 0.99;
    atom.x += atom.vx * dt;
    atom.y += atom.vy * dt;
  };
};

// *Context2D, {w:Number, h:Number}, GameState -> ()
var render = function () {
  return function (ctx, _ref2, state) {
    var w = _ref2.w,
        h = _ref2.h;

    ctx.fillStyle = "rgba(241, 241, 241, 0.03)";
    ctx.fillRect(0, 0, w, h);

    var t = Date.now();
    for (var i = 0, as = state.atoms, l = as.length; i < l; ++i) {
      var atom = as[i];
      var a = 1 - Math.max(t - atom.t, 0) / 20000;
      ctx.fillStyle = "rgba(255,0,0," + a + ")";
      ctx.fillRect(atom.x, atom.y, 1, 1);
    };
  };
}();

// *State -> ()
var garbageCollect = function garbageCollect(state) {
  var t = Date.now();
  var bs = [];
  for (var i = 0, as = state.atoms, l = as.length; i < l; ++i) {
    if (t - as[i].t < 20000) {
      bs.push(as[i]);
    }
  };
  state.atoms = bs;
};

// Program
module.exports = function (field) {
  // Builds canvas
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  var w = canvas.width = window.innerWidth;
  var h = canvas.height = window.innerHeight;

  // Initial state
  var state = { atoms: [] };

  // Events
  var firing = null;
  var mx = 0,
      my = 0;
  canvas.ontouchstart = canvas.onmousedown = function (e) {
    if (e.pageX || e.changedTouches) {
      mx = e.pageX || e.changedTouches[0].pageX;
      my = e.pageY || e.changedTouches[0].pageY;
    };
    firing = setInterval(function () {
      for (var i = 0; i < 12; ++i) {
        state.atoms.push(new Atom(mx, my, Math.random() * 200 - 100, Math.random() * 200 - 100));
      };
      document.title = state.atoms.length > 2000 ? "[: <3" : "[:";
    }, 50);
  };
  canvas.ontouchmove = canvas.onmousemove = function (e) {
    mx = e.pageX || e.changedTouches[0].pageX;
    my = e.pageY || e.changedTouches[0].pageY;
  };
  canvas.ontouchend = canvas.onmouseup = function (e) {
    clearInterval(firing);
    document.title = "(:";
  };

  // Main loop
  setInterval(function () {
    return tick(0.01, { w: w, h: h }, field, state);
  }, 10);
  setInterval(function () {
    return render(context, { w: w, h: h }, state);
  }, 10);
  setInterval(function () {
    return garbageCollect(state);
  }, 3000);

  return canvas;
};

},{}],2:[function(require,module,exports){
},{}],3:[function(require,module,exports){
"use strict";

var fieldDrawer = require("./fieldDrawer.js");
var heartField = require("./heartField.json");

window.onload = function () {
  document.getElementById("main").appendChild(fieldDrawer(heartField));
};

document.ontouchmove = function (e) {
  e.preventDefault();
};

},{"./fieldDrawer.js":1,"./heartField.json":2}]},{},[3]);