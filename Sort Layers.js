/**
 * This script sorts layers into alphabetical / reserve alphabetical order
 * Enter the exact name of the layer(s) who's sublayers you want sorted
 * WARNING: ALL layers that match the provided name will be sorted, not only the first one
 *
 * @author Alexander Lyon
 */

if (app.documents.length === 0) {
    alert("No Open / Active Document Found");
}
else {
    var doc = app.activeDocument;
    var dialog = new Window("dialog", "Sort Layers");
    var layerToSort;

    // Enter layer name
    dialog.layerRow = dialog.add('group', undefined);
    dialog.layerRow.orientation = 'row';
    dialog.layerRow.titleSt = dialog.layerRow.add('statictext', [0, 15, 100, 38], 'Enter layer name:');
    dialog.layerRow.titleEt = dialog.layerRow.add('edittext', [100, 15, 200, 38], "");
    dialog.layerRow.titleEt.onChanging = layerNameChanged;
    dialog.layerRow.titleEt.active = true;

    // Sort options
    dialog.optionsRow = dialog.add('group', undefined);
    dialog.optionsRow.orientation = 'row';
    dialog.optionsRow.alpha = dialog.optionsRow.add('radiobutton', [15,15,70,35], 'A-Z' );
    dialog.optionsRow.revAlpha = dialog.optionsRow.add('radiobutton', [15,15,70,35], 'Z-A' );
    dialog.optionsRow.alpha.value = true;

    // Buttons
    dialog.buttonPanel = dialog.add('group', undefined);
    dialog.buttonPanel.orientation = 'row';
    dialog.buttonPanel.buildBtn1 = dialog.buttonPanel.add('button',[15, 15, 115, 35], 'Cancel', {name:'cancel'});
    dialog.buttonPanel.buildBtn1.onClick= actionCanceled;
    dialog.buttonPanel.buildBtn2 = dialog.buttonPanel.add('button', [125, 15, 225, 35], 'Sort', {name:'sort'});
    dialog.buttonPanel.buildBtn2.onClick= run;

    dialog.show();
}


function run() {
  if (layerToSort !== undefined) {
    var foundLayers = findLayers();

    if (foundLayers.length > 0) {
      dialog.hide();

      // Sort each layer with this name:
      for (var i=0; i<foundLayers.length; i++) {
        sort(foundLayers[i]);
      }

    }
    else {
      alert('No layer found with the name "' + layerToSort + '"');
    }
  }
  else {
    alert("Please enter a valid layer name");
  }
}


function layerNameChanged() {
  layerToSort = dialog.layerRow.titleEt.text;
}


function findLayers(currentLayer, savedList) {
  /* Searches document layers recursively for layerToSort */
  if (currentLayer == undefined) {
    currentLayer = doc;
  }
  if (savedList == undefined) {
    savedList = [];
  }

  for(var i=0; i<currentLayer.layers.length; i++) {
    if (currentLayer.layers[i].name.toLowerCase() == layerToSort.toLowerCase()) {
      savedList.push(currentLayer.layers[i]);
    }
    else {
      findLayers(currentLayer.layers[i], savedList);
    }
  }

  return savedList;
}


function sort(currentLayer) {
  /* Bubble sort */
  var swapped;

  do {
    swapped = false;
    for (var i=0; i<currentLayer.layers.length - 1; i++) {

      if (dialog.optionsRow.alpha.value == true && (currentLayer.layers[i].name.toLowerCase() > currentLayer.layers[i+1].name.toLowerCase())) {
        currentLayer.layers[i].move(currentLayer.layers[i+1], ElementPlacement.PLACEAFTER);
        swapped = true;
      }
      else if (dialog.optionsRow.revAlpha.value == true && (currentLayer.layers[i].name.toLowerCase() < currentLayer.layers[i+1].name.toLowerCase())) {
        currentLayer.layers[i].move(currentLayer.layers[i+1], ElementPlacement.PLACEAFTER);
        swapped = true;
      }

    }
  } while (swapped);

}


function actionCanceled() {
  dialog.hide();
}
