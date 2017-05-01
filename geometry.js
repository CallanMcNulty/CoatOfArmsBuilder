class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  equals(p2) {
    return approxEquals(this.x, p2.x) && approxEquals(this.y, p2.y);
  }
  copy() {
    return new Point(this.x, this.y);
  }
}

class Line {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  equals(l2) {
    if(this.p1.equals(l2.p1) && this.p2.equals(l2.p2)) {
      return true;
    } else if(this.p1.equals(l2.p2) && this.p2.equals(l2.p1)) {
      return true;
    } else {
      return false;
    }
  }

  getLength() {
    return Math.sqrt(Math.pow((this.p1.y - this.p2.y), 2) + Math.pow((this.p1.x - this.p2.x), 2));
  }

  getSlope() {
    return (this.p1.y - this.p2.y)/(this.p1.x - this.p2.x);
  }

  getAngleFromHorizontal() {
    // let naiveAngle = Math.PI - Math.abs(Math.atan(this.getSlope()) - Math.atan(0));
    let naiveAngle = Math.abs(Math.atan(this.getSlope()));
    let otherAngle = Math.abs(2*Math.PI - naiveAngle);
    return otherAngle<naiveAngle ? otherAngle : naiveAngle;
  }

  getPointOnLine(distance) {
    var angle = this.getAngleFromHorizontal();
    var xMultiplier = 1;
    var yMultiplier = 1;
    if(this.p2.x < this.p1.x) {
      xMultiplier = -1;
    }
    if(this.p2.y < this.p1.y) {
      yMultiplier = -1;
    }
    return new Point(this.p1.x+Math.cos(angle)*distance*xMultiplier, this.p1.y+Math.sin(angle)*distance*yMultiplier);
  }

  getABCForm() {
    var A = this.p2.y - this.p1.y;
    var B = this.p1.x - this.p2.x;
    var C = A*this.p1.x + B*this.p1.y;
    return {"A":A, "B":B, "C":C};
  }
  getYAtXPosition(x) {
    let val = this.getABCForm();
    return (val.C-val.A*x)/val.B;
  }
  getXAtYPosition(y) {
    let val = this.getABCForm();
    return (val.C-val.B*y)/val.A;
  }

  getSegmentIntersection(l2) {
    var pt;
    try {
      pt = this.getIntersection(l2);
    } catch(err) {
      throw err;
    }
    var thisMinX = Math.min(this.p1.x, this.p2.x);
    var otherMinX = Math.min(l2.p1.x, l2.p2.x);
    var thisMinY = Math.min(this.p1.y, this.p2.y);
    var otherMinY = Math.min(l2.p1.y, l2.p2.y);
    var thisMaxX = Math.max(this.p1.x, this.p2.x);
    var otherMaxX = Math.max(l2.p1.x, l2.p2.x);
    var thisMaxY = Math.max(this.p1.y, this.p2.y);
    var otherMaxY = Math.max(l2.p1.y, l2.p2.y);
    if( approxLessOrEquals(thisMinX, pt.x)&&approxLessOrEquals(pt.x, thisMaxX) &&
        approxLessOrEquals(thisMinY, pt.y)&&approxLessOrEquals(pt.y, thisMaxY) &&
        approxLessOrEquals(otherMinX, pt.x)&&approxLessOrEquals(pt.x, otherMaxX) &&
        approxLessOrEquals(otherMinY, pt.y)&&approxLessOrEquals(pt.y, otherMaxY) &&
        !pt.equals(this.p2) && !pt.equals(l2.p2)) {
      return pt;
    } else {
      throw {
        type: 0,
        point: pt,
        message: "Found intersection, but it is out of range of the segment."
      }
    }
  }

  getIntersection(l2) {
    var l1vals = this.getABCForm();
    var l2vals = l2.getABCForm();
    var det = l1vals.A*l2vals.B - l2vals.A*l1vals.B;
    let r1 = approxEquals(l1vals.C/l1vals.B, l2vals.C/l2vals.B)||(l1vals.C===0 && l1vals.B===0 && l2vals.C===0 && l2vals.B===0)||
            (l1vals.C/l1vals.B===Infinity && l2vals.C/l2vals.B===-Infinity)||(l1vals.C/l1vals.B===-Infinity && l2vals.C/l2vals.B===Infinity);
    let r2 = approxEquals(l1vals.B/l1vals.A, l2vals.B/l2vals.A)||(l1vals.B===0 && l1vals.A===0 && l2vals.B===0 && l2vals.A===0)||
            (l1vals.B/l1vals.A===Infinity && l2vals.B/l2vals.A===-Infinity)||(l1vals.B/l1vals.A===-Infinity && l2vals.B/l2vals.A===Infinity);
    let r3 = approxEquals(l1vals.A/l1vals.C, l2vals.A/l2vals.C)||(l1vals.A===0 && l1vals.C===0 && l2vals.A===0 && l2vals.C===0)||
            (l1vals.A/l1vals.C===Infinity && l2vals.A/l2vals.C===-Infinity)||(l1vals.A/l1vals.C===-Infinity && l2vals.A/l2vals.C===Infinity);
    let equalSlope = approxEquals((l1vals.A/l1vals.B*-1),(l2vals.A/l2vals.B*-1))||(l1vals.B===0 && l1vals.A===0 && l2vals.B===0 && l2vals.A===0)||
              (l1vals.A/l1vals.B*-1===Infinity && l2vals.A/l2vals.B*-1===-Infinity)||(l1vals.A/l1vals.B*-1===-Infinity && l2vals.A/l2vals.B*-1===Infinity);
    let equalIntercept = approxEquals((l1vals.C/l1vals.B),(l2vals.C/l2vals.B))||(l1vals.C===0 && l1vals.B===0 && l2vals.C===0 && l2vals.B===0)||
              (l1vals.C/l1vals.B===Infinity && l2vals.C/l2vals.B===-Infinity)||(l1vals.C/l1vals.B===-Infinity && l2vals.C/l2vals.B===Infinity);
    if(!approxEquals(det,0)) {
      var x = (l2vals.B*l1vals.C - l1vals.B*l2vals.C)/det;
      var y = (l1vals.A*l2vals.C - l2vals.A*l1vals.C)/det;
      return new Point(x, y);
    // } else if(equalSlope&&equalIntercept){
    } else if(r1 && r2 && r3) {
    // } else if(l1vals.C/l2vals.C===l1vals.B/l2vals.B && l1vals.B/l2vals.B===l1vals.A/l2vals.A) {
      throw {
        type: 2,
        message: "Trying to find intersection, but lines are the same."
      };
    }
    throw {
      type: 1,
      message: "Trying to find intersection, but lines are parallel."
    };
  }

  copy() {
    new Line(this.p1.copy(), this.p2.copy());
  }
}

class Polygon {
  constructor(points) {
    this.vertices = points;
    this.fullRect = this.getRect();
    this.sides = [];
    for(let i=0; i<this.vertices.length; i++) {
      let pt1 = this.vertices[i];
      if(i === this.vertices.length - 1) {
        var pt2 = this.vertices[0];
      } else {
        var pt2 = this.vertices[i+1];
      }
      this.sides.push(new Line(pt1, pt2));
    }
  }

  getRect() {
    var minX = Infinity;
    var maxX = -Infinity;
    var minY = Infinity;
    var maxY = -Infinity;
    for(let i=0; i<this.vertices.length; i++) {
      let v = this.vertices[i];
      minX = Math.min(minX, v.x);
      maxX = Math.max(maxX, v.x);
      minY = Math.min(minY, v.y);
      maxY = Math.max(maxY, v.y);
    }
    var width = maxX-minX;
    var height = maxY-minY;
    var rect = { x1:minX, y1:minY, x2:maxX, y2:maxY, width:width, height:height, center:new Point(minX+width/2, minY+height/2) };
    return rect;
  }

  resizeToWidth(newWidth) {
    var oldWidth = this.fullRect.width;
    var widthRatio = newWidth/oldWidth;
    var oldHeight = this.fullRect.height;
    var aspectRatio = oldHeight/oldWidth;
    var newHeight = newWidth*aspectRatio;
    var heightRatio = newHeight/oldHeight;
    for(let i=0; i<this.vertices.length; i++) {
      let v = this.vertices[i];
      v.x *= widthRatio;
      v.y *= heightRatio;
    }
    var goTo = this.fullRect.center.copy();
    this.fullRect.x1 *= widthRatio;
    this.fullRect.x2 *= widthRatio;
    this.fullRect.y1 *= heightRatio;
    this.fullRect.y2 *= heightRatio;
    this.fullRect.width = newWidth;
    this.fullRect.height = newHeight;
    this.fullRect.center = new Point(this.fullRect.x1+(newWidth/2), this.fullRect.y1+(newHeight/2));
    this.moveTo(goTo);
    return this;
  }
  resizeToHeight(newHeight) {
    var oldHeight = this.fullRect.height;
    var heightRatio = newHeight/oldHeight;
    var oldWidth = this.fullRect.width;
    var aspectRatio = oldWidth/oldHeight;
    var newWidth = newHeight*aspectRatio;
    var widthRatio = newWidth/oldWidth;
    for(let i=0; i<this.vertices.length; i++) {
      let v = this.vertices[i];
      v.x *= widthRatio;
      v.y *= heightRatio;
    }
    var goTo = this.fullRect.center.copy();
    this.fullRect.x1 *= widthRatio;
    this.fullRect.x2 *= widthRatio;
    this.fullRect.y1 *= heightRatio;
    this.fullRect.y2 *= heightRatio;
    this.fullRect.width = newWidth;
    this.fullRect.height = newHeight;
    this.fullRect.center = new Point(this.fullRect.x1+(newWidth/2), this.fullRect.y1+(newHeight/2));
    this.moveTo(goTo);
    return this;
  }
  resizeToRadius(newRad) {
    var circle = this.getContainingCircle();
    var widthToRadRatio = this.fullRect.width/circle.radius;
    var newWidth = newRad * widthToRadRatio;
    return this.resizeToWidth(newWidth);
  }

  moveX(dist) {
    for(let i=0; i<this.vertices.length; i++) {
      let v = this.vertices[i];
      v.x += dist;
    }
    this.fullRect.x1 += dist;
    this.fullRect.x2 += dist;
    this.fullRect.center.x += dist;
    return this;
  }
  moveY(dist) {
    for(let i=0; i<this.vertices.length; i++) {
      let v = this.vertices[i];
      v.y += dist;
    }
    this.fullRect.y1 += dist;
    this.fullRect.y2 += dist;
    this.fullRect.center.y += dist;
    return this;
  }
  moveTo(point) {
    var oldPoint = this.fullRect.center;
    this.moveX(point.x - oldPoint.x);
    this.moveY(point.y - oldPoint.y);
    return this;
  }

  getMinDistanceToIntersection(pt) {
    var min = Infinity;
    for(let i=0; i<this.vertices.length; i++) {
      let vertex = this.vertices[i];
      let lineToVtx = new Line(vertex, pt);
      let dist = lineToVtx.getLength();
      min = Math.min(min, dist);
    }
    for(let i=0; i<this.sides.length; i++) {
      let side = this.sides[i];
      let lineToP1 = new Line(side.p1, pt);
      let hyp = lineToP1.getLength();
      let hypm = lineToP1.getSlope();
      let sidem = side.getSlope();
      let angle = Math.PI - Math.abs( Math.atan(hypm)-Math.atan(sidem) );
      let dist = Math.sin(angle)*hyp;
      min = Math.min(min, dist);
    }
    return min;
  }

  getContainingCircle() {
    var pt = this.fullRect.center;
    var max = -Infinity;
    for(let i=0; i<this.vertices.length; i++) {
      let vertex = this.vertices[i];
      let lineToVtx = new Line(vertex, pt);
      let dist = lineToVtx.getLength();
      max = Math.max(max, dist);
    }
    return { center: pt, radius: max };
  }

  getCenter() {
    var centroid = new Point(0,0);
    var signedArea = 0;

    for(let i=0; i<this.vertices.length-1; i++) {
      let x0 = this.vertices[i].x;
      let y0 = this.vertices[i].y;
      let x1 = this.vertices[i+1].x;
      let y1 = this.vertices[i+1].y;
      let a = x0*y1 - x1*y0;
      signedArea += a;
      centroid.x += (x0 + x1)*a;
      centroid.y += (y0 + y1)*a;
    }

    let x0 = this.vertices[this.vertices.length-1].x;
    let y0 = this.vertices[this.vertices.length-1].y;
    let x1 = this.vertices[0].x;
    let y1 = this.vertices[0].y;
    let a = x0*y1 - x1*y0;
    signedArea += a;
    centroid.x += (x0 + x1)*a;
    centroid.y += (y0 + y1)*a;

    signedArea *= 0.5;
    centroid.x /= (6.0*signedArea);
    centroid.y /= (6.0*signedArea);

    return centroid;
  }

  getArea() {
    var area = 0;
    for(let i=0; i<this.vertices.length-1; i++) {
      area += this.vertices[i].x * this.vertices[i+1].y - this.vertices[i+1].x * this.vertices[i].y;
    }
    area += this.vertices[this.vertices.length-1].x * this.vertices[0].y - this.vertices[0].x * this.vertices[this.vertices.length-1].y;
    area = Math.abs(area)/2;
    return area;
  }

  containsPoint(pt) {
    var line = new Line(pt, new Point(pt.x+this.fullRect.x2+1000, pt.y));
    var intersectionCount = 0;
    for(let i=0; i<this.sides.length; i++) {
      let side = this.sides[i];
      var intersection;
      try {
        intersection = side.getSegmentIntersection(line);
      } catch(err) {
        intersection = null;
        if(err.type===2) {
          if(pt.x > Math.max(side.p1.x, side.p2.x)) {
            return false;
          }
          if(pt.x < Math.min(side.p1.x, side.p2.x)) {
            return false;
          }
          return true;
        }
      }
      if(intersection) {
        let adjacentPt1;
        let adjacentPt2;
        if(intersection.equals(side.p1)) {
          adjacentPt2 = side.p2;
          let adjacentSide = this.sides.find(function(s){ return s.p2.equals(intersection); });
          adjacentPt1 = adjacentSide.p1;
        } else if(intersection.equals(side.p2)) {
          adjacentPt1 = side.p1;
          let adjacentSide = this.sides.find(function(s){ return s.p1.equals(intersection); });
          adjacentPt2 = adjacentSide.p2;
        }
        if(adjacentPt1) {
          let pt1IsAboveLine = line.getYAtXPosition(adjacentPt1.x) < adjacentPt1.y;
          let pt2IsAboveLine = line.getYAtXPosition(adjacentPt2.x) < adjacentPt2.y;
          if((pt1IsAboveLine && pt2IsAboveLine) || (!pt1IsAboveLine && !pt2IsAboveLine)) {
            if(intersection.equals(pt)) {
              return false;
            }
            intersectionCount++;
          }
        }
        if(intersection.equals(pt)) {
          return true;
        }
        intersectionCount++;
      }
    }
    return intersectionCount%2===1;
  }

  getHorizontalCrossSection(height) {
    var horizLine = new Line(new Point(-1000, height), new Point(1000, height));
    var intersections = [];
    for(let i=0; i<this.sides.length; i++) {
      var side = this.sides[i];
      var intersection;
      try {
        intersection = horizLine.getSegmentIntersection(side);
      } catch(err) {
        intersection = null;
      }
      if(intersection) {
        var isLegitIntersection = !intersection.equals(side.p1);
        if(!isLegitIntersection) {
          let previousSide = this.sides[i-1>=0? i-1 : this.sides.length-1];
          isLegitIntersection = (previousSide.p1.y-height)/Math.abs(previousSide.p1.y-height)+(side.p2.y-height)/Math.abs(side.p2.y-height) === 0;
        }
        if(isLegitIntersection) {
          intersections.push(intersection);
        }
      }
    }
    intersections.sort(function(a, b) {
      if(a.x < b.x) {
        return -1;
      } else if (b.x < a.x) {
        return 1;
      } else {
        return 0;
      }
    });
    var lines = [];
    for(let i=0; i<intersections.length; i+=2) {
      lines.push(new Line(intersections[i], intersections[i+1]));
    }
    return lines;
  }

  divideByPaths(paths) {
    var emblazoner = new Emblazoner($("#shield")[0]);
    var newOuterPath = this.vertices.slice();
    var branchPoints = [];
    var branchPointSideIndices = [];
    var newPaths = [];
    // For every path... {
    for(let i=0; i<paths.length; i++) {
      var path = paths[i];
      var newPath = path.slice();
      //Find it's intersections with each side...
      for(let j=0; j<path.length-1; j++) {
        var line = new Line(path[j], path[j+1]);
        for(let k=0; k<this.sides.length; k++) {
          var side = this.sides[k];
          var intersection;
          try {
            intersection = line.getSegmentIntersection(side);
          } catch(err) {
            intersection = null;
            if(err.type===2) {
              if(approxLessOrEquals(Math.min(side.p1.x,side.p2.x), line.p1.x)&&approxLessOrEquals(line.p1.x, Math.max(side.p1.x,side.p2.x))
              &&approxLessOrEquals(Math.min(side.p1.y,side.p2.y), line.p1.y)&&approxLessOrEquals(line.p1.y, Math.max(side.p1.y,side.p2.y))) {
                intersection = line.p1;
              } else {
                intersection = line.p2;
              }

            }
          }
          if(intersection) {
            // Save intersection...
            branchPoints.push(intersection);
            // Save the index of the intersecting side...
            branchPointSideIndices.push(k);
            // If intersection point is not a point that is already on the path
            var indexOfIntersectionInPath = path.findIndex(function(pt) { return pt.equals(intersection); })
            if(indexOfIntersectionInPath===-1) {
              // Insert intersection point into path...
              let newPathBeginIndex = newPath.findIndex(function(pt) { return pt.equals(line.p1); });
              let newPathEndIndex = newPath.findIndex(function(pt) { return pt.equals(line.p2); });
              let intersectionSection = newPath.slice(newPathBeginIndex+1, newPathEndIndex);
              intersectionSection.push(intersection);
              intersectionSection.sort(function(pt1, pt2) {
                var line1 = new Line(line.p1, pt1);
                var line2 = new Line(line.p1, pt2);
                var l1length = line1.getLength();
                var l2length = line2.getLength();
                if(l1length < l2length) {
                  return -1;
                } else if(l2length < l1length) {
                  return 1;
                }
                return 0;
              });
              var args = [newPathBeginIndex+1, newPathEndIndex-(newPathBeginIndex+1)].concat(intersectionSection);
              Array.prototype.splice.apply(newPath, args);
            }
          }
        }
      }
      // Find points on path NOT inside the polygon, and remove them,
      // then split path into multiple paths at the index of each non-internal point and on each path-internal branch point {
      for(let i=newPath.length-1; i>=0; i--) {
        let pt = newPath[i];
        var contained = this.containsPoint(pt);
        let isInBranchPoints = branchPoints.findIndex(function(bppt) { return bppt.equals(pt); });
        let isOnOuterPath = newOuterPath.findIndex(function(oppt) { return oppt.equals(pt); });
        if(!contained && isInBranchPoints===-1 && isOnOuterPath===-1) {
          var cutPath = newPath.slice(i+1, newPath.length);
          if(cutPath.length > 1) {
            newPaths.push(cutPath);
          }
          newPath = newPath.slice(0,i);
        } else if(isInBranchPoints!==-1) {
          var cutPath = newPath.slice(i, newPath.length);
          if(cutPath.length > 1) {
            newPaths.push(cutPath);
          }
          newPath = newPath.slice(0,i+1);
          if(i>0) {
            let nextPt = newPath[i-1];
            let line = new Line(pt,nextPt);
            let equalSideIndex = this.sides.findIndex(function(s) {
              let i;
              try {
                i=s.getSegmentIntersection(line);
              } catch(err) {
                i = true;
                if(err.type===2) {
                  i = false;
                }
              }
              return !i;
            });
            // let nextIsBranchPoint = branchPoints.findIndex(function(bp) { return bp.equals(nextPt); });
            let middlePt = line.getPointOnLine(line.getLength()/2);
            if(!this.containsPoint(middlePt) || equalSideIndex!==-1) {// || nextIsBranchPoint) {
              newPath = newPath.slice(0,i);
            }
          }
        }
      }
      // end }
      if(newPath.length > 0) {
        newPaths.push(newPath);
      }
    }
    // end }
    // Add the saved points of intersection for every path to the outer path according to their relevant sides {
    for(var i=0; i<this.sides.length; i++) {
      var side = this.sides[i];
      var pointsOnSide = [];
      for(let j=0; j<branchPoints.length; j++) {
        let indexInPointsOnSide = pointsOnSide.findIndex(function(pt){return pt.equals(branchPoints[j]);});
        if(branchPointSideIndices[j]===i && indexInPointsOnSide===-1 && !branchPoints[j].equals(side.p1) && !branchPoints[j].equals(side.p2)) {
          pointsOnSide.push(branchPoints[j]);
        }
      }
      pointsOnSide.sort(function(pt1, pt2) {
        var line1 = new Line(side.p1, pt1);
        var line2 = new Line(side.p1, pt2);
        var l1length = line1.getLength();
        var l2length = line2.getLength();
        if(l1length < l2length) {
          return -1;
        } else if(l2length < l1length) {
          return 1;
        }
        return 0;
      });
      let outerPathIndex = newOuterPath.findIndex(function(pt) {
        return pt.equals(side.p1);
      });
      outerPathIndex = outerPathIndex===newOuterPath.length-1 ? 0 : outerPathIndex+1;
      var args = [outerPathIndex, 0].concat(pointsOnSide);
      Array.prototype.splice.apply(newOuterPath, args);
    }
    // end }
    for(let i=newPaths.length-1; i>=0; i--) {
      let currentPath = newPaths[i];
      let connectingPathIndex = newPaths.findIndex(function(p) { return p[p.length-1].equals(currentPath[0]); });
      if(connectingPathIndex!==-1) {
        newPaths[connectingPathIndex] = newPaths[connectingPathIndex].concat(currentPath.slice(1));
        newPaths.splice(i,1);
      }
    }
    // For each updated path, create a reversed version of that path {
    var reversedPaths = [];
    for(let i=newPaths.length-1; i>=0; i--) {
      var path = newPaths[i];
      if(path) {
        reversedPaths.push(path.slice().reverse());
      }
    }
    newPaths = newPaths.concat(reversedPaths);
    // end }
    // If all paths containing a branch point have been removed, remove the branch point
    for(let i=branchPoints.length-1; i>=0; i--) {
      let bpIsOnPath = newPaths.findIndex(function(path){ return path[0].equals(branchPoints[i])||path[path.length-1].equals(branchPoints[i]); });//return path.findIndex(function(pt){return pt.equals(branchPoints[i]);})!==-1;});
      if(bpIsOnPath===-1) {
        branchPoints.splice(i,1);
      }
    }
    // Create first traverser & begin looping
    var startIndex = newOuterPath.findIndex(function(pt) {
      return branchPoints.findIndex(function(bp) { return bp.equals(pt); }) === -1;
    });
    var traversers = [];
    if(newPaths.length > 0) {
      traversers.push({ open:true, points:[], path:newOuterPath, index:startIndex });
    }
    while(newPaths.length > 0) {
      var currentTraverser = traversers.find(function(element) {
        return element.open;
      });
      if(!currentTraverser) {
        break;
      }
      var currentPath = currentTraverser.path;
      var currentPoint = currentPath[currentTraverser.index];
      if(currentTraverser.points.length>0 && currentPoint.equals(currentTraverser.points[0])) {
        currentTraverser.open = false;
      } else {
        currentTraverser.points.push(currentPoint);
      }
      let indexInBranchPoints = branchPoints.findIndex(function(el) { return el.equals(currentPoint); });
      if(indexInBranchPoints !== -1) {
        if(currentPath === newOuterPath) {
          var intersectingPath = newPaths.find(function(path) { return path[0].equals(currentPoint); });
          if(!intersectingPath[intersectingPath.length-1].equals(currentTraverser.points[0])) {
            traversers.push({ open:true, points:[currentPoint], path:newOuterPath, index:currentTraverser.index+1 });
          }
          currentTraverser.path = intersectingPath;
          currentTraverser.index = 0;
        } else {
          currentTraverser.path = newOuterPath;
          currentTraverser.index = newOuterPath.findIndex(function(el) { return el.equals(currentPoint); });
        }
      }
      currentTraverser.index ++;
      if(currentTraverser.index === currentTraverser.path.length) { currentTraverser.index = 0; }
    }
    var result = [];
    for(let i=0; i<traversers.length; i++) {
      result.push(new Polygon(traversers[i].points));
    }
    // If there is an ordinary, put it at the front of the result array
    for(let i=0; i<result.length; i++) {
      let poly = result[i];
      var isOrdinary = true;
      for(let j=0; j<branchPoints.length; j++) {
        var bpt = branchPoints[j];
        let bptIsInVertices = poly.vertices.findIndex(function(pt) {
          return bpt.equals(pt);
        });
        if(bptIsInVertices===-1) {
          isOrdinary = false;
          break;
        }
      }
      if(isOrdinary) {
        let tmp = result[0];
        result[0] = poly;
        result[i] = tmp;
        break;
      }
    }
    return result;
  }

  removeConcavities() {
    var poly = this.copy();
    let polyArea = poly.getArea();
    for(let i=0; i<poly.vertices.length; i++) {
      var newVertices = poly.vertices.slice();
      newVertices.splice(i,1);
      var newPoly = new Polygon(newVertices);
      let newPolyArea = newPoly.getArea();
      if(newPolyArea > polyArea) {
        poly = newPoly;
        polyArea = poly.getArea();
        i=0;
      }
    }
    return poly;
  }

  copy() {
    var verticesCopy = [];
    for(let i=0; i<this.vertices.length; i++) {
      let v = this.vertices[i];
      verticesCopy.push(v.copy());
    }
    var copy = new Polygon(verticesCopy);
    copy.fullRect = {
      x1:this.fullRect.x1, x2:this.fullRect.x2, y1:this.fullRect.y1, y2:this.fullRect.y2,
      width:this.fullRect.width, height:this.fullRect.height, center:this.fullRect.center.copy()
    };
    return copy;
  }
}

function roundToNearest(num) {
  var up = Math.ceil(num);
  var down = Math.floor(num);
  var downDiff = num - down;
  var upDiff = up - num;
  if(upDiff < downDiff) {
    return up;
  } else {
    return down;
  }
}

function approxEquals(num1, num2, range = 0.00000000001) {
  return Math.abs(num2 - num1) < range || num1===num2;
}
function approxLessOrEquals(num1, num2, range = 0.00000000001) {
  return Math.abs(num2 - num1) < range || num1 < num2;
}
function approxGreaterOrEquals(num1, num2, range = 0.00000000001) {
  return Math.abs(num2 - num1) < range || num1 > num2;
}
