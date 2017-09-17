const fieldDrawer = require("./fieldDrawer.js");
const heartField = require("./heartField.json");

window.onload = () => {
  document.getElementById("main").appendChild(fieldDrawer(heartField));
};

document.ontouchmove = e => {
  e.preventDefault();
};
