// What the globe footer stores when a selected city is asked to be "here".
// Run: node tests/home_check.js
const fs = require("fs"), path = require("path");
const src = fs.readFileSync(path.join(__dirname, "..", "Model.js"), "utf8")
  .replace(".pragma library", "");
const box = {};
new Function(src + "; this.M={labelForZoneId,footerHomeStore,globeHomeStore};").call(box);
const M = box.M;

let n = 0, f = 0;
const t = (k, a, b) => {
  n++;
  if (JSON.stringify(a) !== JSON.stringify(b)) {
    f++;
    console.log("  FAIL", k, JSON.stringify(a), "!=", JSON.stringify(b));
  }
};

const CHI = "America/Chicago";
const LON = "Europe/London";

t("Nashville on a Chicago clock stores Nashville",
  M.footerHomeStore("Nashville", CHI, "", CHI), "Nashville");
t("Chicago with no override stores nothing",
  M.footerHomeStore("Chicago", CHI, "", CHI), null);
t("Chicago while Nashville is home stores blank",
  M.footerHomeStore("Chicago", CHI, "Nashville", CHI), "");
t("Nashville while it is already home stores blank",
  M.footerHomeStore("Nashville", CHI, "Nashville", CHI), "");
t("London cannot be home on a Chicago clock",
  M.footerHomeStore("London", LON, "", CHI), null);
t("London cannot be home even if named as the override",
  M.footerHomeStore("London", LON, "London", CHI), null);
t("a blank label stores nothing",
  M.footerHomeStore("  ", CHI, "", CHI), null);
t("no machine zone stores nothing",
  M.footerHomeStore("Nashville", CHI, "", ""), null);
t("a padded name is the same city",
  M.footerHomeStore("  Nashville  ", CHI, "", CHI), "Nashville");

t("a globe tap on Nashville stores Nashville",
  M.globeHomeStore("Nashville", CHI, "", CHI), "Nashville");
t("a second globe tap on Nashville leaves it",
  M.globeHomeStore("Nashville", CHI, "Nashville", CHI), null);
t("a globe tap on Chicago while Nashville is home clears it",
  M.globeHomeStore("Chicago", CHI, "Nashville", CHI), "");
t("a globe tap on London stores nothing",
  M.globeHomeStore("London", LON, "", CHI), null);

console.log(`  -> ${n - f}/${n} home assertions passed`);
process.exit(f ? 1 : 0);
