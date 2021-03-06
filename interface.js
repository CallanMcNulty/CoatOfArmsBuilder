$(document).ready(function() {
  var emblazoner = new Emblazoner($("#shield")[0]);
  var baseShield = emblazoner.chooseShield("heater");
  var editorElement = $("#editor");
  createDivisionEditor(baseShield, editorElement);

  function createDivisionEditor(division, element) {
    element.empty();
    var divisionEditor = $("<div class='division-editor'></div>");
    element.append(divisionEditor);
    var svg = $("<svg width='9em' height='9em' viewBox='0 0 100 100' preserveAspectRatio='none'></svg>");
    divisionEditor.append(svg);
    var editorEmblazoner = new Emblazoner(svg[0]);
    var poly = editorEmblazoner.drawPolygon(division.polygon);
    if(division.subdivisions.length===0) {
      editorEmblazoner.addField(division.field, poly, division.polygon);
    }
    if(division.subdivisions.length===0) {
      divisionEditor.append(createFieldEditor(division, element));
    } else {
      for(let i=0; i<division.subdivisions.length; i++) {
        var newDivisionEditor = $("<div class='editor-container'></div>");
        element.append(newDivisionEditor);
        createDivisionEditor(division.subdivisions[i], newDivisionEditor);
      }
    }
    if(division.parentCharge && Object.keys(division.parentCharge.secondaryChargeDivisions).length!==0) {
      divisionEditor.append(createPartEditor(division));
    }
    divisionEditor.append(createSubdivisionEditor(division, element));
    divisionEditor.append(createChargeMaker(division, element));
    if(division.charges.length > 0) {
      divisionEditor.append(createLayoutEditor(division));
    }
    if(division.charges.length!==0) {
      var sameCharges = [];
      var chargeElementSameChargesMap = [];
      for(let i=0; i<division.charges.length; i++) {
        var chargeEditorContainer = $("<div class='editor-container'></div>");
        element.append(chargeEditorContainer);
        chargeElementSameChargesMap.push({charge:division.charges[i], element:chargeEditorContainer, sameCharges: sameCharges});
        // createChargeEditor(division.charges[i], chargeEditorContainer, sameCharges);
        sameCharges.push(chargeEditorContainer);
        if(i===division.charges.length-1 || !division.charges[i].equals(division.charges[i+1])) {
          sameCharges = [];
        } else {
          chargeEditorContainer.hide();
        }
      }
      for(let i=0; i<chargeElementSameChargesMap.length; i++) {
        let item = chargeElementSameChargesMap[i];
        createChargeEditor(item.charge, item.element, item.sameCharges);
      }
    }
    if(division.ordinaries.length!==0) {
      for(let i=0; i<division.ordinaries.length; i++) {
        var chargeEditorContainer = $("<div class='editor-container'></div>");
        element.append(chargeEditorContainer);
        createChargeEditor(division.ordinaries[i], chargeEditorContainer, []);
      }
    }
  }

  function createChargeEditor(charge, element, sameChargeElements) {
    element.empty();
    var chargeEditor = $("<div class='charge-editor'></div>");
    element.append(chargeEditor);
    var numberSelector = $("<label>Number:</label><input type='number' value='"+(sameChargeElements.length)+"' min='1' step='1'/>");
    chargeEditor.append(numberSelector);
    var changeNumberButton = $("<button>CHANGE</button>");
    chargeEditor.append(changeNumberButton);
    var showDuplicatesButton = $("<button class='showdups'>SHOW DUPLICATES</button>");
    chargeEditor.append(showDuplicatesButton);
    if(charge.parentDivision.ordinaries.indexOf(charge)!==-1) {
      numberSelector.hide();
      changeNumberButton.hide();
      showDuplicatesButton.hide();
    }
    if(sameChargeElements.length === 1) {
      showDuplicatesButton.hide();
    }
    var deleteButton = $("<button>REMOVE CHARGE</button>");
    chargeEditor.append(deleteButton);
    var divisionEditor = $("<div></div>");
    element.append(divisionEditor);
    createDivisionEditor(charge.chargeDivision, divisionEditor);
    showDuplicatesButton.click(function() {
      let showOrHide = showDuplicatesButton.text();
      if(showOrHide === "SHOW DUPLICATES") {
        for(let i=0; i<sameChargeElements.length; i++) {
          sameChargeElements[i].show();
          sameChargeElements[i].find(".showdups").text("HIDE DUPLICATES");
        }
      } else {
        sameChargeElements[0].find(".showdups").text("SHOW DUPLICATES");
        for(let i=1; i<sameChargeElements.length; i++) {
          sameChargeElements[i].hide();
          sameChargeElements[i].find(".showdups").text("SHOW DUPLICATES");
        }
      }
    });
    changeNumberButton.click(function() {
      let indexOfEqualCharge = charge.parentDivision.charges.indexOf(charge);
      let originalIndex = indexOfEqualCharge;
      do {
        charge.parentDivision.charges.splice(indexOfEqualCharge, 1);
        indexOfEqualCharge = charge.parentDivision.charges.findIndex(function(chg) { return chg.equals(charge); });
      } while(indexOfEqualCharge!==-1)
      var number = parseInt($(numberSelector[1]).val());
      for(let i=0; i<number; i++) {
        charge.parentDivision.charges.splice(originalIndex, 0, charge.copy());
      }
      charge.parentDivision.update();
      createDivisionEditor(charge.parentDivision, element.parent());
      emblazoner.update();
    });
    deleteButton.click(function() {
      element.empty();
      charge.parentDivision.removeCharge(charge);
      emblazoner.update();
      var parentDivisionElement = element.parent();
      createDivisionEditor(charge.parentDivision, parentDivisionElement);
    });
  }

  function createFieldEditor(division, parentDivisionElement) {

    var fieldEditor = $("<div class='mini-editor'><span>Field</span><hr></div>");

    var editorRow = $("<div class='editor-row'></div>");

    var htmlString = "<label>Variation:</label><select>";
    for(let i=0; i<variations.length; i++) {
      htmlString += "<option "+(variations[i]===division.field.variation ? "selected":"")+">"+variations[i]+"</option>";
    }
    htmlString += "</select>";
    var variationSelector = $(htmlString);
    editorRow.append(variationSelector);
    fieldEditor.append(editorRow);

    editorRow = $("<div class='editor-row'></div>");

    htmlString = "<label>Tinctures:</label><select class='tincture-select'>";
    for(let i=0; i<tinctures.length; i++) {
      htmlString += "<option "+(tinctures[i]===division.field.tincture ? "selected":"")+">"+tinctures[i]+"</option>";
    }
    htmlString += "</select>";
    var selector = $(htmlString);
    editorRow.append(selector);

    htmlString = "<select class='tincture-select'>";
    for(let i=0; i<tinctures.length; i++) {
      htmlString += "<option "+(tinctures[i]===division.field.tinctureTwo ? "selected":"")+">"+tinctures[i]+"</option>";
    }
    htmlString += "</select>";
    var secondSelector = $(htmlString);
    editorRow.append(secondSelector);
    fieldEditor.append(editorRow);

    editorRow = $("<div class='editor-row'></div>");

    htmlString = "<label>Number:</label><input type='number' value='"+division.field.number+"' min='2' step='1'/>";
    var numberInput = $(htmlString);
    editorRow.append(numberInput);

    htmlString = "<button>CHANGE</button>";
    var changeNumberButton = $(htmlString);
    editorRow.append(changeNumberButton);
    fieldEditor.append(editorRow);

    if(division.field.variation==="plain") {
      $(selector[0]).text("Tincture:");
      secondSelector.hide();
      numberInput.hide();
      changeNumberButton.hide();
    }
    variationSelector.change(function(event) {
      var choice = $(this).val();
      division.field.variation = choice;
      emblazoner.update();
      createDivisionEditor(division, parentDivisionElement);
    });
    selector.change(function(event) {
      var choice = $(this).val();
      division.field.tincture = choice;
      emblazoner.update();
      createDivisionEditor(division, parentDivisionElement);
    });
    secondSelector.change(function(event) {
      var choice = $(this).val();
      division.field.tinctureTwo = choice;
      emblazoner.update();
      createDivisionEditor(division, parentDivisionElement);
    });
    changeNumberButton.click(function(event) {
      var num = parseInt($(numberInput[1]).val());
      division.field.number = num;
      emblazoner.update();
      createDivisionEditor(division, parentDivisionElement);
    });
    return fieldEditor;
  }

  function createSubdivisionEditor(division, parentDivisionElement) {

    var subdivisionEditor = $("<div class='mini-editor'><span>Divisions</span><hr></div>");

    var editorRow = $("<div class='editor-row'></div>");

    var htmlString = "<label>Type:</label><select>";
    for(let i=0; i<dividers.length; i++) {
      htmlString += "<option value="+dividers[i].val+" "+(dividers[i].val===division.dividingLine ? "selected":"")+">"+
                    dividers[i].name+"</option>";
    }
    htmlString += "</select>";
    var selector = $(htmlString);
    editorRow.append(selector);
    subdivisionEditor.append(editorRow);

    editorRow = $("<div class='editor-row'></div>");

    var button = $("<button>DIVIDE</button>");
    editorRow.append(button);
    subdivisionEditor.append(editorRow);

    button.click(function(event) {
      var choice = $(selector[1]).val();
      if(choice==="none") {
        division.merge();
      } else {
        division.divide(choice);
      }
      emblazoner.update();
      createDivisionEditor(division, parentDivisionElement);
    });
    return subdivisionEditor;
  }

  function createChargeMaker(division, parentDivisionElement) {

    var chargeEditor = $("<div class='mini-editor'><span>Charges</span><hr></div>");
    var editorRow = $("<div class='editor-row'></div>");

    var typeSelector = $(
    `<label>Charge Type:</label><select>
      <option>ordinary</option>
      <option>common</option>
      <option>beast</option>
    </select>`);
    editorRow.append(typeSelector);
    chargeEditor.append(editorRow);

    var secondEditorRow = $("<div class='editor-row'></div>");
    var htmlString = "<label>Device:</label>";
    secondEditorRow.append($(htmlString));

    htmlString = "<select>";
    for(let i=0; i<ordinaries.length; i++) {
      htmlString += "<option value="+ordinaries[i].val+">"+ordinaries[i].name+"</option>";
    }
    htmlString += "</select>";
    var ordinarySelector = $(htmlString);
    secondEditorRow.append(ordinarySelector);

    htmlString = "<select>";
    for(let i=0; i<mobileCharges.length; i++) {
      htmlString += "<option value="+mobileCharges[i].val+">"+mobileCharges[i].name+"</option>";
    }
    htmlString += "</select>";
    var commonSelector = $(htmlString);
    secondEditorRow.append(commonSelector);
    commonSelector.hide();

    htmlString = "<select>";
    for(let i=0; i<beasts.length; i++) {
      htmlString += "<option value="+beasts[i].val+">"+beasts[i].name+"</option>";
    }
    htmlString += "</select>";
    var beastSelector = $(htmlString);
    secondEditorRow.append(beastSelector);
    beastSelector.hide();

    htmlString = "<select>";
    for(let i=0; i<attitudes.length; i++) {
      htmlString += "<option value="+attitudes[i]+">"+attitudes[i]+"</option>";
    }
    htmlString += "</select>";
    var attitudeSelector = $(htmlString);
    secondEditorRow.append(attitudeSelector);
    attitudeSelector.hide();
    chargeEditor.append(secondEditorRow);

    editorRow = $("<div class='editor-row'></div>");

    var button = $("<button>ADD CHARGE</button>");
    editorRow.append(button);
    chargeEditor.append(editorRow);

    var selectors = [ordinarySelector, commonSelector, beastSelector, attitudeSelector];
    var selector = ordinarySelector;

    var changeAvailableAttitudes = function(beast) {
      $(attitudeSelector[0].children).hide();
      let possibleAttitudes = attitudesPerBeast[beast];
      for(let i=0; i<possibleAttitudes.length; i++) {
        $(attitudeSelector[0].querySelector("option[value='"+possibleAttitudes[i]+"']")).show();
      }
      $(attitudeSelector[0].children).removeAttr("selected");
      attitudeSelector[0].querySelector("option[value='"+possibleAttitudes[0]+"']").setAttribute("selected", "selected");
    }
    changeAvailableAttitudes(beasts[0].name);

    typeSelector.change(function(event) {
      var choice = $(this).val();
      selectors.forEach(sel=>sel.hide());
      if(choice==="ordinary") {
        selector = ordinarySelector;
      } else if(choice==="common") {
        selector = commonSelector;
      } else if(choice==="beast") {
        selector = beastSelector;
        attitudeSelector.show();
      }
      selector.show();
    });
    beastSelector.change(function(event) {
      var choice = $(this).val();
      var beast = choice.split("_")[0];
      changeAvailableAttitudes(beast);
    });
    button.click(function(event) {
      var choice = selector.val();
      if(selector===beastSelector) {
        choice += "_"+attitudeSelector.val();
      }
      isOrdinary = ordinaries.findIndex(function(el) {return el.val===choice;}) !== -1;
      if(isOrdinary) {
        division.addOrdinary(choice);
      } else {
        division.addCharge(choice);
      }
      createDivisionEditor(division, parentDivisionElement);
      emblazoner.update();
    });
    return chargeEditor;
  }

  function createLayoutEditor(division) {

    var layoutEditor = $("<div class='mini-editor'><span>Charge Layout</span><hr></div>");
    var editorRow = $("<div class='editor-row'></div>");

    var htmlString = "<label>Layout:</label><select>";
    for(let i=0; i<layouts.length; i++) {
      htmlString += "<option value="+layouts[i].val+" "+(layouts[i].val===division.chargeArrangement ? "selected":"")+">"+
                    layouts[i].name+"</option>";
    }
    htmlString += "</select>";
    var layoutSelector = $(htmlString);
    editorRow.append(layoutSelector);
    layoutEditor.append(editorRow);

    editorRow = $("<div class='editor-row'></div>");

    htmlString = "<label>Specified:</label><input class='long-input' />";
    var specifiedInput = $(htmlString);
    specifiedInput.val(division.specifiedChargeArrangement.join(" "));
    editorRow.append(specifiedInput);
    layoutEditor.append(editorRow);

    editorRow = $("<div class='editor-row'></div>");

    htmlString = "<button>CHANGE LAYOUT</button>";
    var customButton = $(htmlString);
    editorRow.append(customButton);
    layoutEditor.append(editorRow);

    if(division.chargeArrangement!=="specified") {
      specifiedInput.hide();
      customButton.hide();
    }

    layoutSelector.change(function() {
      var choice = $(layoutSelector[1]).val();
      division.chargeArrangement = choice;
      if(choice!=="specified") {
        division.update();
        emblazoner.update();
        specifiedInput.hide();
        customButton.hide();
        $(specifiedInput[1]).val("");
      } else {
        specifiedInput.show();
        customButton.show();
      }
    });
    customButton.click(function() {
      var inptString = $(specifiedInput[1]).val();
      let numberStrings = inptString.split(/\D+/g);
      let numbers = [];
      let sum = 0;
      for(let i=0; i<numberStrings.length; i++) {
        let num = parseInt(numberStrings[i]);
        if(!isNaN(num)) {
          numbers.push(num);
          sum += num;
        }
      }
      if(sum===division.charges.length) {
        division.specifiedChargeArrangement = numbers;
        division.update();
        emblazoner.update();
      } else {
        $(specifiedInput[1]).val("INVALID");
      }
    });
    return layoutEditor;
  }

  function createPartEditor(division) {
    var partEditor = $("<div class='mini-editor' style='overflow-y:auto;'><span>Charge Parts</span><hr></div>");
    var scdivs = division.parentCharge.secondaryChargeDivisions;
    let keys = Object.keys(scdivs);
    for(let i=0; i<keys.length; i++) {
      let editorRow = $("<div class='editor-row'></div>");
      let htmlString = "<label>"+keys[i].replace("_"," ")+":</label><select class='tincture-select'>";
      let currentTincture = scdivs[keys[i]][0].field.tincture;
      for(let i=0; i<tinctures.length; i++) {
        htmlString += "<option "+(tinctures[i]===currentTincture ? "selected":"")+">"+tinctures[i]+"</option>";
      }
      htmlString += "</select>";
      let selector = $(htmlString);
      editorRow.append(selector);
      partEditor.append(editorRow);
      selector.change(function() {
        var choice = $(this).val();
        let chargeParts = scdivs[keys[i]];
        for(let j=0; j<chargeParts.length; j++) {
          chargeParts[j].field.tincture = choice;
        }
        emblazoner.update();
      });
    }
    return partEditor;
  }
});
