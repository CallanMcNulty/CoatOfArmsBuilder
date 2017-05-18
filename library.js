var tinctures = ["argent", "or", "azure", "gules", "purpure", "sable", "vert"];
var variations = ["plain", "barry", "bendy", "bendy sinister", "paly", "chequy", "lozengy", "masoned"];
var dividers = [{name:"none", val:"none"}, {name:"pale", val:"pale"}, {name:"fess", val:"fess"}, {name:"bend", val:"bend"},
                {name:"bend sinister", val:"bendSinister"}, {name:"chevron", val:"chevron"},
                {name:"chevron reversed", val:"chevronReversed"}, {name:"quarterly", val:"cross"},
                {name:"saltire", val:"saltire"}];
var mobileCharges = [{name:"cross potent", val:"crossPotent"}, {name:"escutcheon", val:"escutcheon"}, {name:"fleur-de-lis", val:"fleurDeLis"},
                    {name:"heart", val:"heart"}, {name:"lozenge", val:"lozenge"}, {name:"mullet", val:"mullet"}];
var beasts = [{name:"fish", val:"fish"}, {name:"lion", val:"lion"}];
var attitudes = ["naiant", "rampant"];
var ordinaries = [{name:"bend", val:"bend"}, {name:"bend sinister", val:"bendSinister"}, {name:"canton", val:"canton"},
                {name:"chevron", val:"chevron"}, {name:"chevron reversed", val:"chevronReversed"}, {name:"chief", val:"chief"},
                {name:"cross", val:"cross"}, {name:"fess", val:"fess"}, {name:"pale", val:"pale"}, {name:"saltire", val:"saltire"}];
var layouts = [{name:"default", val:"default"}, {name:"specified", val:"specified"}, {name:"bendwise", val:"bend"},
              {name:"bendwise sinister", val:"bendSinister"}, {name:"chevronwise", val:"chevron"}, {name:"chevronwise reversed", val:"chevronReversed"},
              {name:"crosswise", val:"cross"}, {name:"fesswise", val:"fess"}, {name:"palewise", val:"pale"}, {name:"saltirewise", val:"saltire"}];
var irregularPlurals = [{singular:"cross potent", plural:"crosses potent"}, {singular:"fleur-de-lis", plural:"fleurs-de-lis"},
                      {singular:"fish", plural:"fishes"}];
TINCTURE = {
  argent: "#f7f7f7",
  or: "gold",
  azure: "#117",
  gules: "#d11",
  purpure: "#a02098",
  sable: "#070710",
  vert: "green",
}
SHIELD = {
  heater: new Polygon([new Point(0,0), new Point(100,0), new Point(100,60), new Point(50,100), new Point(0,60)])
}
CHARGE = {
  lozenge: new Polygon([new Point(50,0), new Point(75,50), new Point(50,100), new Point(25,50)]),
  mullet: new Polygon([new Point(0,40), new Point(38,40), new Point(50,5), new Point(62,40), new Point(100,40),
                new Point(70,63), new Point(80,100), new Point(50,78), new Point(20,100), new Point(30,63)]),
  escutcheon: new Polygon([new Point(0,0), new Point(100,0), new Point(100,60), new Point(50,100), new Point(0,60)]),
  heart: new Polygon([new Point(7,50), new Point(0,30), new Point(7,8), new Point(25,0), new Point(40,5), new Point(50,20),
                new Point(60,5), new Point(75,0), new Point(93,8), new Point(100,30), new Point(93,50), new Point(50,90)]),
  crossPotent: new Polygon([new Point(0,30), new Point(10,30), new Point(10,45), new Point(45,45), new Point(45,10),
                new Point(30,10), new Point(30,0), new Point(70,0), new Point(70,10), new Point(55,10), new Point(55,45),
                new Point(90,45), new Point(90,30), new Point(100,30), new Point(100,70), new Point(90,70), new Point(90,55),
                new Point(55,55), new Point(55,90), new Point(70,90), new Point(70,100), new Point(30,100), new Point(30,90),
                new Point(45,90), new Point(45,55), new Point(10,55), new Point(10,70), new Point(0,70)]),
  fleurDeLis: new Polygon([new Point(50,0), new Point(60,10), new Point(67,25), new Point(60,40), new Point(55,60),
                new Point(70,35), new Point(85,30), new Point(97,37), new Point(100,50), new Point(97,60), new Point(80,70),
                new Point(85,55), new Point(75,55), new Point(60,70), new Point(65,75), new Point(60,80), new Point(68,84),
                new Point(78,81), new Point(67,90), new Point(55,87), new Point(50,100),
                new Point(45,87), new Point(33,90), new Point(22,81), new Point(32,84), new Point(40,80), new Point(35,75),
                new Point(40,70), new Point(25,55), new Point(15,55), new Point(20,70), new Point(3,60), new Point(0,50),
                new Point(3,37), new Point(15,30), new Point(30,35), new Point(45,60), new Point(40,40), new Point(33,25), new Point(40,10)]),
  fish_naiant: new Polygon([new Point(2,45), new Point(7,45), new Point(18,40), new Point(28,38), new Point(35,35), new Point(55,37),
                new Point(75,43), new Point(85,45), new Point(93,50), new Point(85,55), new Point(75,57), new Point(60,63),
                new Point(30,65), new Point(21,63), new Point(28,55), new Point(28,45), new Point(27,55), new Point(19,62),
                new Point(10,60), new Point(0,50), new Point(10,55)]),
  lion_rampant: new Polygon([new Point(42.5,32), new Point(46.5,29.7), new Point(53.9,26.5), new Point(45.8,26.5),
                new Point(44.1,29.5), new Point(41.4,27.6), new Point(42.3,24.5), new Point(49.7,22.5), new Point(51.3,19.3),
                new Point(49.3,16.7), new Point(46.8,19.1), new Point(41.4,19.4), new Point(40.9,16), new Point(39.5,13.8),
                new Point(40.9,11.9), new Point(44.5,11), new Point(48,11.5), new Point(51.8,8.6), new Point(60.1,8),
                new Point(59.9,5.2), new Point(63.2,7), new Point(63.7,5), new Point(66.6,8.6), new Point(70,8.6), new Point(74,9.7),
                new Point(70,14.6), new Point(71.7,21), new Point(72.7,31.2), new Point(70.7,29), new Point(70.5,39.8),
                new Point(69,37.9), new Point(68.8,43.7), new Point(67.3,45.3), new Point(72.8,52.3), new Point(81.7,65.6),
                new Point(87.4,70.4), new Point(91,69), new Point(91.4,64), new Point(87.6,56.1), new Point(84.7,57.6),
                new Point(86.2,53.7), new Point(83.3,54.3), new Point(84.8,50.6), new Point(82,51.1), new Point(83.3,46.7),
                new Point(80.5,44.6), new Point(80.3,37.9), new Point(82.7,29.9), new Point(85.7,25.2), new Point(85.6,16.7),
                new Point(88.1,22.4), new Point(89,15.1), new Point(91.5,24.5), new Point(91.3,33.8), new Point(90.2,41.4),
                new Point(87.6,47.5), new Point(94.7,62.2), new Point(93.5,71.7), new Point(88.9,74.5), new Point(84.1,71.7),
                new Point(80.1,81.4), new Point(82.9,86), new Point(79.3,85.3), new Point(81.3,89.8), new Point(77.7,89),
                new Point(79.3,93.4), new Point(76,92.5), new Point(76.5,95.7), new Point(73.5,94.8), new Point(69.9,95),
                new Point(71.6,98.3), new Point(67.4,98.3), new Point(66.6,95), new Point(64.8,97.8), new Point(60.7,95.6),
                new Point(64.7,92.9), new Point(58.8,93.5), new Point(58.8,88.5), new Point(61.5,89.3), new Point(61,86.9),
                new Point(63,86), new Point(64.6,89.3), new Point(67,89.5), new Point(71.3,83), new Point(66.2,77), new Point(68.7,71.3),
                new Point(53.9,72.4), new Point(55.7,75.9), new Point(51.8,75.8), new Point(50.9,80.6), new Point(48.6,77.4),
                new Point(46.5,81), new Point(44,77.7), new Point(41.8,80.2), new Point(38.8,75.5), new Point(37.1,79.9),
                new Point(33.5,78.5), new Point(35.2,73.7), new Point(31.6,77.4), new Point(27.6,75), new Point(30.4,72.3),
                new Point(25.5,71.3), new Point(26.5,66.9), new Point(30,68.6), new Point(30,65.6), new Point(34.4,64.6),
                new Point(35.6,69.1), new Point(45.7,69.7), new Point(49,63.2), new Point(59.4,61.7), new Point(66.7,66.8),
                new Point(59.6,60.7), new Point(54.3,54.8), new Point(60.1,50.6), new Point(53.6,54.3), new Point(52.2,56.7),
                new Point(51,54.1), new Point(48.6,57.1), new Point(47.8,54.5), new Point(45.2,60), new Point(43.8,56),
                new Point(44.2,51.8), new Point(42.6,54.3), new Point(40.7,50), new Point(38.3,49.4), new Point(35.2,53.7),
                new Point(33.6,50.4), new Point(32.4,54.1), new Point(31,50.5), new Point(29.3,54), new Point(27.8,51.6),
                new Point(25.5,53.5), new Point(25,56.2), new Point(20.9,56.7), new Point(19.3,54.2), new Point(15.7,55.2),
                new Point(13.5,51.6), new Point(15.3,49.1), new Point(11,48.6), new Point(11.7,43.8), new Point(15.6,45),
                new Point(14,42.8), new Point(16.5,41.5), new Point(19.8,45.9), new Point(34.8,39.8), new Point(30.9,40.4),
                new Point(31.5,37), new Point(28.4,39), new Point(28.6,33.5), new Point(26.4,36), new Point(26.7,30.1),
                new Point(24.2,32.4), new Point(24.8,25.4), new Point(21.7,24.2), new Point(20.6,20.6), new Point(22.9,19.1),
                new Point(22.6,16), new Point(18,15.8), new Point(17.3,11.3), new Point(22.2,11.3), new Point(19.8,7.8),
                new Point(23.5,6), new Point(26.3,9.2), new Point(27.6,6), new Point(29.9,9.3), new Point(29.3,13.5),
                new Point(31.9,21.5), new Point(41.6,31.7), new Point(38.3,36.4), new Point(37.7,41.8), new Point(39.1,36.8)])
}
CHARGE_PARTS = {
  fish_naiant: {
    finned: [
      new Polygon([new Point(85,45), new Point(92,39), new Point(100,35), new Point(100,40), new Point(97,50),
                  new Point(100,60), new Point(100,65), new Point(92,61), new Point(85,55), new Point(93,50)]),
      new Polygon([new Point(38,36), new Point(43,29), new Point(48,25), new Point(53,29), new Point(57,35), new Point(54,37)]),
      new Polygon([new Point(70,42), new Point(75,39), new Point(80,37), new Point(79,44)]),
      new Polygon([new Point(45,64), new Point(55,63), new Point(56,72), new Point(50,69)]),
      new Polygon([new Point(66,61), new Point(71,66), new Point(78,64), new Point(83,59), new Point(79,56), new Point(72,58)]),
      new Polygon([new Point(28,59), new Point(35,55), new Point(43,54), new Point(38,61), new Point(30,61)])
    ]
  },
  lion_rampant: {
    langued: [
      new Polygon([new Point(35.8,20.2), new Point(37.3,22.6), new Point(39.5,23.7), new Point(44.7,20.9), new Point(51,19.8),
        new Point(49.7,22.5), new Point(45.1,23), new Point(40.8,25.4), new Point(37.8,25), new Point(36.2,22.4)])
    ],
    armed: [
      new Polygon([new Point(26.8,3.7), new Point(29.1,6.6), new Point(28.9,9), new Point(27.5,8.1)]),
      new Polygon([new Point(18,5.2), new Point(22.3,5.3), new Point(24,7.3), new Point(21.8,7.9)]),
      new Polygon([new Point(15,12.8), new Point(18.9,12), new Point(20.2,13.5), new Point(18.6,14.4)]),
      new Polygon([new Point(17.7,21.7), new Point(22.3,21.1), new Point(23.3,22.9), new Point(20.8,23.6)]),
      new Polygon([new Point(11.5,41.3), new Point(14.5,40.7), new Point(16.8,42.2), new Point(15.3,43.4)]),
      new Polygon([new Point(6.4,46.5), new Point(10.2,44.5), new Point(13.2,44.6), new Point(14,46.2), new Point(13,47.3)]),
      new Polygon([new Point(11.3,55.7), new Point(12.8,52.4), new Point(15,51.2), new Point(16,53.2)]),
      new Polygon([new Point(21,59.3), new Point(21.7,54.6), new Point(23,54.3), new Point(24,56)]),
      new Polygon([new Point(28.9,61.5), new Point(33.5,65.5), new Point(32.2,67.4), new Point(30.8,66.5)]),
      new Polygon([new Point(21.7,69), new Point(24.2,66.2), new Point(27.7,66.9), new Point(27.6,69.3), new Point(24.8,68.7)]),
      new Polygon([new Point(27.1,78.4), new Point(28.7,74), new Point(30.8,74.4), new Point(30.6,76.2)]),
      new Polygon([new Point(33.4,81.7), new Point(34.6,78.3), new Point(37.1,77.9), new Point(37.3,79.3)]),
      new Polygon([new Point(58.3,84.9), new Point(60.8,85.1), new Point(63.1,86.7), new Point(61.9,87.6)]),
      new Polygon([new Point(54.5,92), new Point(56.8,89.2), new Point(59.7,89), new Point(61.1,90.2), new Point(60,92), new Point(57.3,91.4)]),
      new Polygon([new Point(59.2,98.1), new Point(61.4,95.3), new Point(63.2,94.7), new Point(63.9,96.5)]),
      new Polygon([new Point(68.2,97.5), new Point(68.9,95.6), new Point(70.9,96.9), new Point(71.5,100)])
    ]
  }
}
var attitudesPerBeast = {"lion": ["rampant"], "fish": ["naiant"]};
DIVISION = {
  perChevron: [
    [new Point(0,60), new Point(50,40), new Point(100,60)]
  ],
  perChevronReversed: [
    [new Point(0,40), new Point(50,60), new Point(100,40)]
  ],
  perPale: [
    [new Point(50,0), new Point(50,100)]
  ],
  perFess: [
    [new Point(0,50), new Point(100,50)]
  ],
  perBend: [
    [new Point(0,0), new Point(100,100)]
  ],
  perBendSinister: [
    [new Point(0,100), new Point(100,0)]
  ],
  pale: [
    [new Point(40,0), new Point(40,100)],
    [new Point(60,100), new Point(60,0)]
  ],
  fess: [
    [new Point(0,40), new Point(100,40)],
    [new Point(100,60), new Point(0,60)]
  ],
  bend: [
    [new Point(14,0), new Point(100,86)],
    [new Point(86,100), new Point(0,14)]
  ],
  bendSinister: [
    [new Point(86,0), new Point(0,86)],
    [new Point(100,14), new Point(14,100)]
  ],
  saltire: [
    [new Point(14,0), new Point(50,36), new Point(86,0)],
    [new Point(100,14), new Point(64,50), new Point(100,86)],
    [new Point(86,100), new Point(50,64), new Point(14,100)],
    [new Point(0,86), new Point(36,50), new Point(0,14)]
  ],
  cross: [
    [new Point(0,40), new Point(40,40), new Point(40,0)],
    [new Point(60,0), new Point(60,40), new Point(100,40)],
    [new Point(100,60), new Point(60,60), new Point(60,100)],
    [new Point(40,100), new Point(40,60), new Point(0,60)]
  ],
  chevron: [
    [new Point(0,46), new Point(50,26), new Point(100,46)],
    [new Point(100,74), new Point(50,54), new Point(0,74)],
  ],
  chevronReversed: [
    [new Point(0,26), new Point(50,46), new Point(100,26)],
    [new Point(100,54), new Point(50,74), new Point(0,54)],
  ],
  chief: [
    [new Point(0,30), new Point(100,30)]
  ],
  canton: [
    [new Point(40,0), new Point(40,40), new Point(0,40)]
  ]
}
function copyPaths(paths) {
  var result = [];
  for(let i=0; i<paths.length; i++) {
    var path = paths[i];
    var newPath = [];
    for(let i=0; i<path.length; i++) {
      newPath.push(path[i].copy());
    }
    result.push(newPath);
  }
  return result;
}
function copyChargeParts(parts) {
  var copy = {};
  let keys = Object.keys(parts);
  for(let i=0; i<keys.length; i++) {
    let part = parts[keys[i]];
    var partCopy = [];
    copy[keys[i]] = partCopy;
    for(let j=0; j<part.length; j++) {
      partCopy.push(part[j].copy());
    }
  }
  return copy;
}
function findName(array, value, knownProp="val", soughtProp="name") {
  let index = array.findIndex(function(el){ return el[knownProp]===value; });
  if(index===-1) { return null; }
  return array[index][soughtProp];
}
function pluralize(word) {
  let irreg = findName(irregularPlurals, word, "singular", "plural")
  if(irreg) {
    return irreg;
  }
  return word+"s";
}
