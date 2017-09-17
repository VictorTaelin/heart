// Builds `heartField.json`

const sin = Math.sin;
const cos = Math.cos;
const sqrt = Math.sqrt;

const w = 512;
const h = 512;

let gravity = [];
let nearest = [];

// Builds gravity points using heart curve
for (var t = 0; t < 1;) {
  var a = t * Math.PI * 2;
  var r = Math.min(w, h) * 0.03;
  var x = w * 0.5 + (16 * sin(a) * sin(a) * sin(a)) * r;
  var y = h * 0.5 + (-2.5 + -13 * cos(a) + 5 * cos(2 * a) + 2 * cos(3 * a) + cos(4 * a)) * r;
  var dx = 48 * sin(a) * sin(a) * cos(a);
  var dy = 13 * sin(a) - 10 * sin(2 * a) - 6 * sin(3 * a) - 4 * sin(4 * a);
  var d = Math.sqrt((dx * dx) + (dy * dy));
  gravity.push({x,y});
  t += Math.min(0.025 / d, 0.02);
}

// Builds a map with the nearest gravity to given <512 int point.
for (var j = 0; j < 512; ++j) {
  if (!nearest[j]) {
    nearest[j] = [];
  }
  for (var i = 0; i < 512; ++i) {
    var pivot = {x: Infinity, y: Infinity};
    var pivotDist = Infinity;
    for (var n = 0, g = gravity, l = g.length; n < l; ++n) {
      var point = gravity[n];
      var distX = point.x - i;
      var distY = point.y - j;
      var dist = sqrt(distX * distX + distY * distY);
      if (dist < pivotDist) {
        pivot = point;
        pivotDist = dist;
      };
    };
    nearest[j][i] = [Math.round(pivot.x), Math.round(pivot.y)];
  }
}

require("fs").writeFileSync("./heartField.json", JSON.stringify(nearest));
