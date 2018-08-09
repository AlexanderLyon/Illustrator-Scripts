/**
 * This script shows / hides all sublayers, symbolItems, and groupItems of a specified parent layer
 * Enter the exact name of the layer(s) who's sublayers you want shown (case insensitive)
 * WARNING: This will affect ALL layers that match the provided name, not only the first one
 *
 * @author Alexander Lyon
 */

if (app.documents.length === 0) {
  alert("No Open / Active Document Found");
}
else {
  var doc = app.activeDocument;
  var dialog = new Window("dialog", "Show or Hide Layers");
  var chosenLayer;

  // Enter layer name
  dialog.layerRow = dialog.add('group', undefined);
  dialog.layerRow.orientation = 'row';
  dialog.layerRow.titleSt = dialog.layerRow.add('statictext', [0, 15, 115, 38], 'Enter layer name:');
  dialog.layerRow.titleEt = dialog.layerRow.add('edittext', [116, 15, 210, 38], "");
  dialog.layerRow.titleEt.active = true;
  dialog.layerRow.titleEt.onChanging = layerNameChanged;

  // Show or Hide Radio Buttons
  dialog.optionsRow = dialog.add('group', undefined);
  dialog.optionsRow.orientation = 'row';
  dialog.optionsRow.showAll = dialog.optionsRow.add('radiobutton', [10,15,85,35], 'Show All' );
  dialog.optionsRow.hideAll = dialog.optionsRow.add('radiobutton', [86,15,161,35], 'Hide All' );
  dialog.optionsRow.showAll.value = true;

  // Buttons
  dialog.buttonPanel = dialog.add('group', undefined);
  dialog.buttonPanel.orientation = 'row';
  dialog.buttonPanel.cancelBtn = dialog.buttonPanel.add('button',[15, 15, 115, 35], 'Cancel', {name:'cancel'});
  dialog.buttonPanel.cancelBtn.onClick = actionCanceled;
  dialog.buttonPanel.goBtn = dialog.buttonPanel.add('button', [125, 15, 225, 35], 'Go', {name:'go'});
  dialog.buttonPanel.goBtn.onClick = run;

  dialog.show();
}


function run() {
if (chosenLayer !== undefined) {
  var foundLayers = findLayers();

  if (foundLayers.length > 0) {
    dialog.hide();

    // For each layer with this name:
    for (var i=0; i<foundLayers.length; i++) {

      if (dialog.optionsRow.showAll.value === true) {
        // Show all sublayers
        showSublayers(foundLayers[i]);
      }

      else if (dialog.optionsRow.hideAll.value === true) {
        // Hide all sublayers
        hideSublayers(foundLayers[i]);
      }

    }

  }
  else {
    alert('No layer found with the name "' + chosenLayer + '"');
  }
}
else {
  alert("Please enter a valid layer name");
}
}


function layerNameChanged() {
chosenLayer = dialog.layerRow.titleEt.text;
}


function findLayers(currentLayer, savedList) {
/* Recursively searches document layers for chosenLayer */
if (currentLayer == undefined) {
  currentLayer = doc;
}
if (savedList == undefined) {
  savedList = [];
}

for(var i=0; i<currentLayer.layers.length; i++) {
  if (currentLayer.layers[i].name.toLowerCase() == chosenLayer.toLowerCase()) {
    savedList.push(currentLayer.layers[i]);
  }
  else {
    findLayers(currentLayer.layers[i], savedList);
  }
}

return savedList;
}


function showSublayers(parentLayer) {
var symbols = parentLayer.symbolItems;
var sublayers = parentLayer.layers;
var groups = parentLayer.groupItems;

// Sublayers:
if (sublayers) {
  for (var i=0; i<sublayers.length; i++) {
    sublayers[i].visible = true;
  }
}

// Symbols:
if (symbols) {
  for (var i=0; i<symbols.length; i++) {
    symbols[i].hidden = false;
  }
}

// Groups
if (groups) {
  for (var i=0; i<groups.length; i++) {
    groups[i].hidden = false;
  }
}

}


function hideSublayers(parentLayer) {
var symbols = parentLayer.symbolItems;
var sublayers = parentLayer.layers;
var groups = parentLayer.groupItems;

// Sublayers:
if (sublayers) {
  for (var i=0; i<sublayers.length; i++) {
    sublayers[i].visible = false;
  }
}

// Symbols:
if (symbols) {
  for (var i=0; i<symbols.length; i++) {
    symbols[i].hidden = true;
  }
}

// Groups
if (groups) {
  for (var i=0; i<groups.length; i++) {
    groups[i].hidden = true;
  }
}

}


function actionCanceled() {
dialog.hide();
}
