class Emblazoner {
  constructor(svg) {
    this.svg = svg;
    this.shield = null;
  }
  chooseShield(shieldType) {
    this.shield = new Division(SHIELD[shieldType].copy());
    this.update();
    return this.shield;
  }
  update() {
    this.svg.innerHTML = "";
    this.drawDivision(this.shield);
    $("#blazon-box").text(this.shield.blazon());
  }
  drawPolygon(poly) {
    var pointString = "";
    for(let i=0; i<poly.vertices.length; i++) {
      let vertex = poly.vertices[i];
      pointString += vertex.x;
      pointString += ",";
      pointString += vertex.y;
      pointString += " ";
    }
    this.svg.innerHTML += "<polygon points='"+pointString+"' />";
    var el = this.svg.lastChild;
    el.setAttribute("fill", "#f9efb9");
    return el;
  }
  drawLine(line, color="lightblue") {
    this.svg.innerHTML += "<line x1="+line.p1.x+" y1="+line.p1.y+" x2="+line.p2.x+" y2="+line.p2.y+" style='stroke:"+color+"'/>";
  }
  drawPoint(pt) {
    this.drawLine(new Line(pt,new Point(pt.x+1,pt.y)), "violet");
  }
  addField(field, element, polygon) {
    var rect = polygon.getRect();
    element.setAttribute("fill", TINCTURE[field.tincture]);
    if(field.variation === "plain") {
    } else if(field.variation === "barry") {
      let fessWidth = rect.height/field.number;
      var fields = [new Field(), new Field()];
      fields[0].tincture = field.tinctureTwo;
      fields[1].tincture = field.tincture;
      var currentFieldIndex = 0;
      for(let i=1; i<=field.number; i++) {
        let paths = [[new Point(-1,i*fessWidth+rect.y1), new Point(101,i*fessWidth+rect.y1)],
                    [new Point(-1,(i-1)*fessWidth+rect.y1), new Point(101,(i-1)*fessWidth+rect.y1)]];
        let fessSections = polygon.divideByPaths(paths);
        for(let j=fessSections.length-1; j>=0; j--) {
          let fessRect = fessSections[j].fullRect;
          if((i-1)*fessWidth+rect.y1 < fessRect.center.y&&fessRect.center.y < i*fessWidth+rect.y1) {
            var fessElement = this.drawPolygon(fessSections[j]);
            this.addField(fields[currentFieldIndex], fessElement, fessSections[j]);
          }
        }
        currentFieldIndex = Math.abs(currentFieldIndex-1);
      }
    } else if(field.variation==="bendy" || field.variation==="bendy sinister") {
      var isSinister = field.variation==="bendy sinister";
      var topVertices = polygon.vertices.slice();
      var bottomVertices = polygon.vertices.slice();
      bottomVertices.sort(function(a,b) {
        let corner = new Point((isSinister?rect.x2:rect.x1), rect.y2);
        let aDist = new Line(corner, a).getLength();
        let bDist = new Line(corner, b).getLength();
        if(aDist < bDist) { return -1; }
        if(bDist < aDist) { return 1; }
        return 0;
      });
      topVertices.sort(function(a,b) {
        let corner = new Point((isSinister?rect.x1:rect.x2), rect.y1);
        let aDist = new Line(corner, a).getLength();
        let bDist = new Line(corner, b).getLength();
        if(aDist < bDist) { return -1; }
        if(bDist < aDist) { return 1; }
        return 0;
      });
      let bottomPerpLine = new Line(bottomVertices[0], new Point(bottomVertices[0].x+(isSinister?-100:100), bottomVertices[0].y+100));
      let topPerpLine = new Line(topVertices[0], new Point(topVertices[0].x+(isSinister?-100:100), topVertices[0].y+100));
      let perpendicularLine = new Line(rect.center, new Point(rect.center.x+(isSinister?-100:100),rect.center.y-100));
      let newPerpP1 = perpendicularLine.getIntersection(topPerpLine);
      let newPerpP2 = perpendicularLine.getIntersection(bottomPerpLine);
      perpendicularLine = new Line(newPerpP1, newPerpP2);
      let bendWidth = perpendicularLine.getLength()/field.number;
      var fields = [new Field(), new Field()];
      fields[0].tincture = field.tinctureTwo;
      fields[1].tincture = field.tincture;
      var currentFieldIndex = 0;
      for(let i=1; i<field.number; i++) {
        let pt = perpendicularLine.getPointOnLine(bendWidth*i);
        let bendPath = [new Point(pt.x+(isSinister?1000:-1000), pt.y-1000), new Point(pt.x+(isSinister?-1000:1000), pt.y+1000)];
        let bendSections = polygon.divideByPaths([bendPath]);
        let containingTriangle = new Polygon([new Point(pt.x+(isSinister?1000:-1000),pt.y-1000),
                                              new Point(pt.x+(isSinister?-1000:1000),pt.y+1000),
                                              new Point(pt.x+(isSinister?1000:-1000),pt.y+1000)]);
        for(let j=bendSections.length-1; j>=0; j--) {
          if(containingTriangle.containsPoint( bendSections[j].getCenter() )) {
            var bendElement = this.drawPolygon(bendSections[j]);
            this.addField(fields[currentFieldIndex], bendElement, bendSections[j]);
          }
        }
        currentFieldIndex = Math.abs(currentFieldIndex-1);
      }
    } else if(field.variation==="paly") {
      let paleWidth = rect.width/field.number;
      var fields = [new Field(), new Field()];
      fields[0].tincture = field.tinctureTwo;
      fields[1].tincture = field.tincture;
      var currentFieldIndex = 0;
      for(let i=1; i<=field.number; i++) {
        let paths = [[new Point(i*paleWidth+rect.x1,-1), new Point(i*paleWidth+rect.x1,101)],
                    [new Point((i-1)*paleWidth+rect.x1,-1), new Point((i-1)*paleWidth+rect.x1,101)]];
        let paleSections = polygon.divideByPaths(paths);
        for(let j=paleSections.length-1; j>=0; j--) {
          let paleRect = paleSections[j].fullRect;
          if((i-1)*paleWidth+rect.x1 < paleRect.center.x&&paleRect.center.x < i*paleWidth+rect.x1) {
            var paleElement = this.drawPolygon(paleSections[j]);
            this.addField(fields[currentFieldIndex], paleElement, paleSections[j]);
          }
        }
        currentFieldIndex = Math.abs(currentFieldIndex-1);
      }
    } else if(field.variation==="chequy") {
      let checkWidth = rect.height/field.number;
      let checksPerRow = Math.ceil(rect.width/checkWidth);
      var fields = [new Field(), new Field()];
      fields[0].tincture = field.tinctureTwo;
      fields[1].tincture = field.tincture;
      var currentFieldIndex = 0;
      for(let i=0; i<field.number; i++) {
        let p1 = new Point(1000,i*checkWidth+rect.y1);
        let p4 = new Point(1000,(i===field.number-1)?rect.y2:((i+1)*checkWidth+rect.y1));
        for(let j=0; j<checksPerRow; j++) {
          let p2 = new Point(j*checkWidth+rect.x1,i*checkWidth+rect.y1);
          let p3 = new Point(j*checkWidth+rect.x1,(i+1)*checkWidth+rect.y1);
          let sections = polygon.divideByPaths([[p1,p2,p3,p4]]);
          for(let k=0; k<sections.length; k++) {
            let sectionRect = sections[k].fullRect;
            if(i*checkWidth+rect.y1 < sectionRect.center.y&&sectionRect.center.y < (i+1)*checkWidth+rect.y1 && sectionRect.height < rect.height) {
              let checkElement = this.drawPolygon(sections[k]);
              let fieldIndex = (i%2===0&&j%2===0)||(i%2!==0&&j%2!==0)? 1 : 0;
              this.addField(fields[fieldIndex], checkElement, sections[k]);
            }
          }
        }
      }
    }
  }
  drawDivision(division) {
    if(division.subdivisions.length===0) {
      var polyElement = this.drawPolygon(division.polygon);
      this.addField(division.field, polyElement, division.polygon);
    }
    for(let i=0; i<division.subdivisions.length; i++) {
      let sub = division.subdivisions[i];
      this.drawDivision(sub);
    }
    for(let i=0; i<division.charges.length; i++) {
      let cdiv = division.charges[i].chargeDivision;
      this.drawDivision(cdiv);
      let scdiv = division.charges[i].secondaryChargeDivisions;
      var keys = Object.keys(scdiv);
      for(let i=0; i<keys.length; i++) {
        let part = scdiv[keys[i]];
        for(let j=0; j<part.length; j++) {
          this.drawDivision(part[j]);
        }
      }
    }
    for(let i=0; i<division.ordinaries.length; i++) {
      let cdiv = division.ordinaries[i].chargeDivision;
      this.drawDivision(cdiv);
    }
  }
}

function getEvenRows(num, divPoly) {
  var rect = divPoly.fullRect;
  var numRows = 0;
  var allRowsSum;
  var rowSeparation;
  do {
    numRows += 1;
    firstTime = false;
    var rowSeparation = rect.height/(numRows + 1);
    var allLines = getSomeNumberOfRows(numRows, divPoly);
    var allRowsSum = 0;
    for(let i=0; i<allLines.length; i++) {
      allRowsSum += allLines[i].p2.x - allLines[i].p1.x;
    }
  } while(rowSeparation > allRowsSum/num && numRows < num)
  return allLines;
}

function getSomeNumberOfRows(numRows, divPoly) {
  var rect = divPoly.getRect();
  var rowSeparation = rect.height/(numRows + 1);
  var allRows = [];
  for(let i=1; i<=numRows; i++) {
    allRows = allRows.concat(divPoly.getHorizontalCrossSection(rect.y1 + i*rowSeparation));
  }
  return allRows;
}

function divideAmongRows(num, rows) {
  var numbersPerRow = [];
  var rowsLengthSum = 0;
  for(let i=0; i<rows.length; i++) {
    rowsLengthSum += rows[i].getLength();//rows[i].p2.x - rows[i].p1.x;
  }
  var remaining = num;
  var remainingLengths = [];
  for(let i=0; i<rows.length; i++) {
    let rowLength = rows[i].getLength();//rows[i].p2.x - rows[i].p1.x;
    let lengthRatio = rowLength/rowsLengthSum;
    let portion = lengthRatio*num;
    let numOnRow = Math.floor(lengthRatio*num);
    numbersPerRow.push(numOnRow);
    remaining -= numOnRow;
    remainingLengths.push(portion - numOnRow);
  }
  for(let i=0; i<remaining; i++) {
    let indexOfGreatestRemaining = remainingLengths.indexOf(Math.max.apply(null, remainingLengths));
    numbersPerRow[indexOfGreatestRemaining] += 1;
    remainingLengths[indexOfGreatestRemaining] = 0;
  }
  return numbersPerRow;
}

function divideAmongMultiLineRows(rows, numbersPerRow) {
  if(rows.length===numbersPerRow.length) { return numbersPerRow; }
  for(var i=0; i<rows.length-1; i++) {
    var row = rows[i];
    var num = numbersPerRow[i];
    if(approxEquals(row.p1.y, rows[i+1].p1.y)) {
      var endSameRowIndex = rows.length-1;
      for(var j=i+1; j<rows.length; j++) {
        if(!approxEquals(row.p1.y, rows[j].p1.y)) {
          endSameRowIndex = j;
        }
      }
      let newNumbers = divideAmongRows(num, rows.slice(i,endSameRowIndex));
      let args = [i, endSameRowIndex].concat(newNumbers);
      Array.prototype.splice.apply(rows, args);
    }
  }
  return rows;
}

function getLayout(num, divPoly, type="default", numbers = []) {
  var numbersPerRow = numbers;
  var rows = [];
  if(type==="rectangle") {
    var numRows = roundToNearest(Math.sqrt(num));
    var numPerRow = Math.floor(num/numRows);
    var remainder = num%numRows;
    for(let i=0; i<numRows; i++) {
      let numThisRow = numPerRow;
      if(remainder > 0) {
        numThisRow += 1;
        remainder -= 1;
      }
      numbersPerRow.push(numThisRow);
    }
    rows = getSomeNumberOfRows(numRows, divPoly);
    numbersPerRow = divideAmongMultiLineRows(rows, numbersPerRow);
  } else if(type==="default") {
    rows = getEvenRows(num, divPoly);
    numbersPerRow = divideAmongRows(num, rows);
  } else if(type==="specified") {
    rows = getSomeNumberOfRows(numbersPerRow.length, divPoly);
    numbersPerRow = divideAmongMultiLineRows(rows, numbersPerRow);
  } else if(type==="fess") {
    let center = divPoly.getCenter();
    rows = divPoly.getHorizontalCrossSection(center.y);
    numbersPerRow = divideAmongRows(num, rows);
  } else if(type==="pale") {
    let center = divPoly.getCenter();
    let line = new Line(new Point(center.x,center.y-1000), new Point(center.x,center.y+1000));
    rows = divPoly.getCrossSection(line);
    numbersPerRow = divideAmongRows(num, rows);
  } else if(type==="bend") {
    let center = divPoly.getCenter();
    let line = new Line(new Point(center.x-1000,center.y-1000), new Point(center.x+1000,center.y+1000));
    rows = divPoly.getCrossSection(line);
    numbersPerRow = divideAmongRows(num, rows);
  } else if(type==="bendSinister") {
    let center = divPoly.getCenter();
    let line = new Line(new Point(center.x-1000,center.y+1000), new Point(center.x+1000,center.y-1000));
    rows = divPoly.getCrossSection(line);
    numbersPerRow = divideAmongRows(num, rows);
  } else if(type==="saltire") {
    let center = divPoly.getCenter();
    let line = new Line(new Point(center.x,center.y), new Point(center.x+1000,center.y+1000));
    let line2 = new Line(new Point(center.x,center.y), new Point(center.x+1000,center.y-1000));
    let line3 = new Line(new Point(center.x,center.y), new Point(center.x-1000,center.y+1000));
    let line4 = new Line(new Point(center.x,center.y), new Point(center.x-1000,center.y-1000));
    let lines = [line, line2, line3, line4];
    for(let i=0; i<lines.length; i++) {
      rows = rows.concat(divPoly.getCrossSection(lines[i]));
    }
    numbersPerRow = divideAmongRows(num, rows);
  } else if(type==="cross") {
    let center = divPoly.getCenter();
    let line = new Line(new Point(center.x,center.y), new Point(center.x,center.y+1000));
    let line2 = new Line(new Point(center.x,center.y), new Point(center.x,center.y-1000));
    let lines = [line, line2];
    for(let i=0; i<lines.length; i++) {
      rows = rows.concat(divPoly.getCrossSection(lines[i]));
    }
    line = new Line(new Point(center.x-1000,center.y), new Point(center.x+1000,center.y));
    rows = rows.concat(divPoly.getCrossSection(line));
    numbersPerRow = divideAmongRows(num, rows);
  } else if(type==="chevron") {
    let offset = divPoly.fullRect.height/5;
    let center = divPoly.getCenter();
    center.y -= offset;
    let line = new Line(new Point(center.x,center.y), new Point(center.x-500,center.y+200));
    let line2 = new Line(new Point(center.x,center.y), new Point(center.x+500,center.y+200));
    rows = rows.concat(divPoly.getCrossSection(line));
    rows = rows.concat(divPoly.getCrossSection(line2));
    numbersPerRow = divideAmongRows(num, rows);
  } else if(type==="chevronReversed") {
    let offset = divPoly.fullRect.height/5;
    let center = divPoly.getCenter();
    center.y += offset;
    let line = new Line(new Point(center.x,center.y), new Point(center.x-500,center.y-200));
    let line2 = new Line(new Point(center.x,center.y), new Point(center.x+500,center.y-200));
    rows = rows.concat(divPoly.getCrossSection(line));
    rows = rows.concat(divPoly.getCrossSection(line2));
    numbersPerRow = divideAmongRows(num, rows);
  }

  layout = [];
  for(let i=0; i<rows.length; i++) {
    layout.push({ row:rows[i], number:numbersPerRow[i] });
  }
  return layout;
}

function getLayoutPoints(layout) {
  var points = [];
  let minSpacing = Infinity;
  for(let i=0; i<layout.length; i++) {
    let row = layout[i].row;
    let num = layout[i].number;
    var rowLength = row.getLength();
    var spacing = rowLength/(num+1);
    minSpacing = Math.min(spacing,minSpacing);
    for(let i=1; i<=num; i++) {
      // points.push(new Point(row.p1.x+i*spacing,row.p1.y));
      points.push(row.getPointOnLine(i*spacing));
    }
  }
  return {radius:minSpacing/2, pts:points};
}

function dividePolygon(basePolygon, paths) {
  let divisionPolygon = new Polygon(Array.prototype.concat.apply([], paths));
  divisionPolygon.fullRect = { x1:0, y1:0, x2:100, y2:100, width:100, height:100, center:new Point(50,50) };
  let baseCenter = basePolygon.getCenter();
  divisionPolygon.moveTo(baseCenter);
  let baseWidth = basePolygon.fullRect.width;
  let baseHeight = basePolygon.fullRect.height;
  if(baseHeight > baseWidth) {
    divisionPolygon.resizeToHeight(baseWidth);
  } else {
    divisionPolygon.resizeToWidth(baseHeight);
  }
  for(let i=0; i<paths.length; i++) {
    let path = paths[i];
    let pathInitialLine = new Line(path[1], path[0]);
    let pathFinalLine = new Line(path[path.length-2], path[path.length-1]);

    path[0] = pathInitialLine.getPointOnLine(1000);
    path[path.length-1] = pathFinalLine.getPointOnLine(1000);
  }
  return basePolygon.divideByPaths(paths);
}
