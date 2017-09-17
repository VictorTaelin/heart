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
const tick = (dt, {w, h}, field, state) => {
  const wh = Math.min(w, h);
  for (var i = 0, as = state.atoms, l = as.length; i < l; ++i) {
    const atom = as[i];
    const ax = (atom.x - w*0.5 + wh*0.5) / wh * 512;
    const ay = atom.y / wh * 512; 
    const gi = Math.round(ax > 511 ? 511 : ax < 0 ? 0 : ax);
    const gj = Math.round(ay > 511 ? 511 : ay < 0 ? 0 : ay);
    const gr = field[gj][gi];
    const gx = gr[0] || 511;
    const gy = gr[1] || 511;
    const dx = gx - ax;
    const dy = gy - ay;
    const ds = Math.max(Math.sqrt(dx * dx + dy * dy), 20);
    const rx = dx * ds;
    const ry = dy * ds;
    atom.vx += 50000 / (ds * ds * ds) * rx * dt;
    atom.vy += 50000 / (ds * ds * ds) * ry * dt;
    atom.vx *= 0.99;
    atom.vy *= 0.99;
    atom.x += atom.vx * dt;
    atom.y += atom.vy * dt;
  };
};

// *Context2D, {w:Number, h:Number}, GameState -> ()
const render = (() => {
  return (ctx, {w, h}, state) => {
    ctx.fillStyle = "rgba(241, 241, 241, 0.03)";
    ctx.fillRect(0, 0, w, h);

    var t = Date.now();
    for (var i = 0, as = state.atoms, l = as.length; i < l; ++i) {
      var atom = as[i];
      var a = (1 - Math.max(t - atom.t, 0) / 20000);
      ctx.fillStyle = "rgba(255,0,0," + a + ")";
      ctx.fillRect(atom.x, atom.y, 1, 1);
    };
  };
})();

// *State -> ()
const garbageCollect = state => {
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
module.exports = field => {
  // Builds canvas
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const w = canvas.width = window.innerWidth;
  const h = canvas.height = window.innerHeight;

  // Initial state
  let state = {atoms: []};

  // Events
  var firing = null;
  var mx = 0, my = 0;
  canvas.ontouchstart = canvas.onmousedown = e => {
    if (e.pageX || e.changedTouches) {
      mx = e.pageX || e.changedTouches[0].pageX;
      my = e.pageY || e.changedTouches[0].pageY;
    };
    firing = setInterval(() => {
      for (var i = 0; i < 12; ++i) {
        state.atoms.push(
          new Atom(mx, my,
            Math.random() * 200 - 100,
            Math.random() * 200 - 100));
      };
      document.title = state.atoms.length > 2000 ? "[: <3" : "[:";
    }, 50);
  };
  canvas.ontouchmove = canvas.onmousemove = e => {
    mx = e.pageX || e.changedTouches[0].pageX;
    my = e.pageY || e.changedTouches[0].pageY;
  };
  canvas.ontouchend = canvas.onmouseup = e => {
    clearInterval(firing);
    document.title = "(:";
  };

  // Main loop
  setInterval(() => tick(0.01, {w,h}, field, state), 10);
  setInterval(() => render(context, {w,h}, state), 10);
  setInterval(() => garbageCollect(state), 3000);

  return canvas;
};
