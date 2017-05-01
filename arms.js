class Division {
  constructor(polygon = null) {
    this.field = new Field();
    this.charges = [];
    this.ordinaries = [];
    this.chargeArrangement = "default";
    this.specifiedChargeArrangement = [];
    this.dividingLine = "none";
    this.subdivisions = [];
    this.parentDivision = null;
    this.parentCharge = null;

    this.polygon = polygon;
  }
  update(polygon=null) {
    if(polygon) {
      this.polygon = polygon;
    }
    if(this.dividingLine !== "none") {
      this.divide();
    }
    this.updateChargeLayout();
    var ordinaries = this.ordinaries.slice();
    this.ordinaries = [];
    for(let i=0; i<ordinaries.length; i++) {
      this.addOrdinary(ordinaries[i].device, ordinaries[i]);
      this.ordinaries[i].chargeDivision.update();
    }
    for(let i=0; i<this.charges.length; i++) {
      this.charges[i].chargeDivision.update();
    }
    for(let i=0; i<this.subdivisions.length; i++) {
      this.subdivisions[i].update();
    }
  }
  equals(other) {
    if(this.dividingLine !== other.dividingLine) { return false; }
    if(this.chargeArrangement !== other.chargeArrangement) { return false; }
    if(this.charges.length !== other.charges.length) { return false; }
    if(this.ordinaries.length !== other.ordinaries.length) { return false; }
    if(!this.field.equals(other.field)) { return false; }
    for(let i=0; i<this.charges.length; i++) {
      if(!this.charges[i].equals(other.charges[i])) {
        return false;
      }
    }
    for(let i=0; i<this.ordinaries.length; i++) {
      if(!this.ordinaries[i].equals(other.ordinaries[i])) {
        return false;
      }
    }
    for(let i=0; i<this.subdivisions.length; i++) {
      if(!this.subdivisions[i].equals(other.subdivisions[i])) {
        return false;
      }
    }
    return true;
  }
  divide(dividingLine=null) {
    var alreadyDivided = false;
    if(dividingLine) {
      this.dividingLine = dividingLine;
    } else {
      dividingLine = this.dividingLine;
      alreadyDivided = true;
    }
    var dividedByOrdinary = this.ordinaries.findIndex(function(ord) { return ord.device===dividingLine; });
    if(dividedByOrdinary===-1) {
      var divisionPaths = copyPaths(DIVISION["per"+dividingLine[0].toUpperCase()+dividingLine.slice(1)]);
      var divisionPolygons = dividePolygon(this.polygon, divisionPaths);
    } else {
      var divisionPaths = copyPaths(DIVISION[dividingLine]);
      var divisionPolygons = dividePolygon(this.polygon, divisionPaths).slice(1);
    }
    if(!alreadyDivided) {
      this.subdivisions = [];
      for(let i=0; i<divisionPolygons.length; i++) {
        this.subdivisions.push(new Division(divisionPolygons[i]));
      }
    } else {
      for(let i=0; i<this.subdivisions.length; i++) {
        this.subdivisions[i].polygon = divisionPolygons[i];
      }
    }
    this.subdivisions[0].field = this.field;
  }
  merge() {
    this.subdivisions = [];
  }
  addOrdinary(device, charge=null) {
    if(!charge) {
      charge = new Charge();
      charge.parentDivision = this;
      charge.device = device;
    }
    this.ordinaries.push(charge);
    var portions = dividePolygon(this.polygon, copyPaths(DIVISION[device]));
    charge.chargeDivision.polygon = portions[0];
    if(this.dividingLine === device) {
      let divisionPolygons = portions.slice(1);
      this.subdivisions = [];
      for(let i=0; i<divisionPolygons.length; i++) {
        this.subdivisions.push(new Division(divisionPolygons[i]));
      }
    }
    return charge;
  }
  addCharge(device) {
    var cdiv = new Charge(device);
    this.charges.push(cdiv);
    cdiv.parentDivision = this;
    this.update();
    return cdiv;
  }
  removeCharge(charge) {
    var i = this.charges.indexOf(charge);
    if(i===-1) {
      i = this.ordinaries.indexOf(charge);
      this.ordinaries.splice(i,1);
      if(charge.device===this.dividingLine) {
        this.divide(charge.device);
      }
    } else {
      this.charges.splice(i,1);
    }
    this.update();
  }
  updateChargeLayout(newArrangement=null, numbers=null) {
    if(newArrangement===null) { newArrangement=this.chargeArrangement; }
    if(numbers===null) { numbers=this.specifiedChargeArrangement; }

    var chargeLayout = getLayout(this.charges.length, this.polygon, newArrangement, numbers);
    var chargePositions = getLayoutPoints(chargeLayout);
    // var chargeMaxRadii = [];
    for(let i=0; i<this.charges.length; i++) {
      let charge = this.charges[i];
      let position = chargePositions[i];
      // let poly = charge.chargeDivision.polygon;
      // poly.moveTo(position);
      charge.moveTo(position);
      // let rect = poly.fullRect;
      // let center = rect.center;
      // chargeMaxRadii.push(this.polygon.getMinDistanceToIntersection(center));
    }
    var rect = this.polygon.fullRect;
    // chargeMaxRadii.push(rect.height/(chargeLayout.length+1)/2);

    // var maxRadius = Math.min.apply(null, chargeMaxRadii);
    var maxRadius = rect.height/(chargeLayout.length+1)/2;

    for(let i=0; i<this.charges.length; i++) {
      // this.charges[i].chargeDivision.polygon.resizeToRadius(maxRadius);
      this.charges[i].resize(maxRadius);
      // this.charges[i].chargeDivision.resize(maxRadius);
    }
  }

  copy() {
    var copy = new Division(this.polygon.copy());
    copy.field = this.field.copy();
    for(let i=0; i<this.charges.length; i++) {
      copy.charges.push(this.charges[i].copy());
    }
    for(let i=0; i<this.ordinaries.length; i++) {
      copy.ordinaries.push(this.ordinaries[i].copy());
    }
    for(let i=0; i<this.subdivisions.length; i++) {
      copy.subdivisions.push(this.subdivisions[i].copy());
    }
    copy.chargeArrangement = this.chargeArrangement;
    copy.specifiedChargeArrangement = this.specifiedChargeArrangement;
    copy.dividingLine = this.dividingLine;
    copy.parentDivision = this.parentDivision;
    copy.parentCharge = this.parentCharge;
    return copy;
  }
}

class Field {
  constructor() {
    this.variation = "plain";
    this.tincture = "argent";
    this.tinctureTwo = "sable";
    this.number = 8;
    this.division = null;
  }
  equals(other) {
    return (this.variation===other.variation && this.tincture===other.tincture && this.tinctureTwo===other.tinctureTwo);
  }
  copy() {
    var copy = new Field();
    copy.variation = this.variation;
    copy.tincture = this.tincture;
    copy.tinctureTwo = this.tinctureTwo;
    copy.number = this.number;
    return copy;
  }
}

class Charge {
  constructor(device = "lozenge") {
    this.device = device;
    this.parentDivision = null;
    this.chargeDivision = new Division(CHARGE[device].copy());
    this.chargeDivision.polygon.fullRect = {x1:0, y1:0, x2:100, y2:100, width:100, height:100, center:new Point(50,50)};
    this.chargeDivision.parentCharge = this;
    if(CHARGE_PARTS[device]) {
      this.secondaryChargeDivisions = copyChargeParts(CHARGE_PARTS[device]);
      var keys = Object.keys(this.secondaryChargeDivisions);
      for(let i=0; i<keys.length; i++) {
        let part = this.secondaryChargeDivisions[keys[i]];
        for(let j=0; j<part.length; j++) {
          let div = new Division(part[j]);
          div.polygon.fullRect = {x1:0, y1:0, x2:100, y2:100, width:100, height:100, center:new Point(50,50)};
          part[j] = div;
        }
      }
    } else {
      this.secondaryChargeDivisions = {};
    }
  }
  equals(other) {
    if(this.device !== other.device) {
      return false;
    }
    if(!this.chargeDivision.equals(other.chargeDivision)) {
      return false;
    }
    return true;
  }
  moveTo(position) {
    var currentPosition = this.chargeDivision.polygon.fullRect.center.copy();
    this.chargeDivision.polygon.moveTo(position);
    var changeInX = position.x - currentPosition.x;
    var changeInY = position.y - currentPosition.y;
    var keys = Object.keys(this.secondaryChargeDivisions);
    for(let i=0; i<keys.length; i++) {
      let part = this.secondaryChargeDivisions[keys[i]];
      for(let j=0; j<part.length; j++) {
        let div = part[j];
        div.polygon.moveTo(new Point(currentPosition.x+changeInX, currentPosition.y+changeInY));
      }
    }
  }
  resize(rad, to="radius") {
    if(to==="radius") {
      this.chargeDivision.polygon.resizeToRadius(rad);
    } else if(to==="width") {
      this.chargeDivision.polygon.resizeToWidth(rad);
    } else if(to==="height") {
      this.chargeDivision.polygon.resizeToHeight(rad);
    }
    var keys = Object.keys(this.secondaryChargeDivisions);
    for(let i=0; i<keys.length; i++) {
      let part = this.secondaryChargeDivisions[keys[i]];
      for(let j=0; j<part.length; j++) {
        part[j].polygon.resizeToWidth(this.chargeDivision.polygon.fullRect.width);
      }
    }
  }
  copy() {
    var copy = new Charge();
    copy.device = this.device;
    copy.parentDivision = this.parentDivision;
    copy.chargeDivision = this.chargeDivision.copy();
    copy.chargeDivision.parentCharge = copy;
    // copy.secondaryChargeDivisions = [];
    // for(let i=0; i<this.secondaryChargeDivisions.length; i++) {
    //   copy.secondaryChargeDivisions.push(this.secondaryChargeDivisions[i].copy());
    // }
    copy.secondaryChargeDivisions = copyChargeParts(this.secondaryChargeDivisions);
    return copy;
  }
}
