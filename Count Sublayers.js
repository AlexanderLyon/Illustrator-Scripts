/**
 * This script counts layers, symbol items, path items, and group items inside a given layer.
 * It is not recursive, and will only count the layer's immediate children.
 *
 * @author Alexander Lyon
 */

 if (app.documents.length === 0) {
   alert("No Open / Active Document Found");
 }
 else {
   var doc = app.activeDocument;
   var dialog = new Window("dialog", "Count");
   var chosenLayer;

   // Enter layer name
   dialog.layerRow = dialog.add('group', undefined);
   dialog.layerRow.orientation = 'row';
   dialog.layerRow.titleSt = dialog.layerRow.add('statictext', [0, 15, 110, 38], 'Enter layer name:');
   dialog.layerRow.titleEt = dialog.layerRow.add('edittext', [111, 15, 250, 38], "");
   dialog.layerRow.titleEt.onChanging = layerNameChanged;
   dialog.layerRow.titleEt.active = true;

   // Options
   dialog.optionsRow = dialog.add('group', undefined);
   dialog.optionsRow.orientation = 'row';
   dialog.optionsRow.sublayers = dialog.optionsRow.add('radiobutton', [10,15,90,35], 'Sublayers' );
   dialog.optionsRow.symbols = dialog.optionsRow.add('radiobutton', [91,15,165,35], 'Symbols' );
   dialog.optionsRow.pathItems = dialog.optionsRow.add('radiobutton', [166,15,226,35], 'Paths' );
   dialog.optionsRow.groupItems = dialog.optionsRow.add('radiobutton', [227,36,287,56], 'Groups' );
   dialog.optionsRow.sublayers.value = true;

   dialog.buttonPanel = dialog.add('group', undefined);
   dialog.buttonPanel.orientation = 'row';
   dialog.buttonPanel.quitBtn = dialog.buttonPanel.add('button',[15, 15, 115, 35], 'Quit', {name:'cancel'});
   dialog.buttonPanel.quitBtn.onClick = actionCanceled;
   dialog.buttonPanel.countBtn = dialog.buttonPanel.add('button', [125, 15, 225, 35], 'Count', {name:'Count'});
   dialog.buttonPanel.countBtn.onClick = run;

   dialog.show();
 }


 function run() {
   if (chosenLayer !== undefined) {
     var count = 0;
     var itemType;
     var foundLayers = findLayers();

     // Count items for each found layer
     if (foundLayers.length > 0) {
       for (var i=0; i<foundLayers.length; i++) {
         if (dialog.optionsRow.sublayers.value === true) {
           itemType = "sublayers";
           count = foundLayers[i].layers.length;
         }
         else if (dialog.optionsRow.symbols.value === true) {
           itemType = "symbols";
           count = foundLayers[i].symbolItems.length;
         }
         else if (dialog.optionsRow.pathItems.value === true) {
           itemType = "paths";
           count = foundLayers[i].pathItems.length;
         }
         else if (dialog.optionsRow.groupItems.value === true) {
           itemType = "groups";
           count = foundLayers[i].groupItems.length;
         }

         if (count === 0) {
           alert('"' + chosenLayer + '" (' + (i+1) + '/' + foundLayers.length + ') ' + ' does not contain any ' + itemType);
         } else {
           alert('"' + chosenLayer + '" (' + (i+1) + '/' + foundLayers.length + ') ' + itemType + ': ' + count);
         }
       }
     }
     else {
       alert('Could not find a layer named "' + chosenLayer + '"');
     }
   }
   else {
     alert("Please enter a valid layer name");
   }

 }


 function findLayers(currentLayer, matches) {
   /* Searches document layers recursively for chosenLayer */
   if (currentLayer == undefined) {
     currentLayer = doc;
   }
   if (matches == undefined) {
     matches = [];
   }

   for(var i=0; i<currentLayer.layers.length; i++) {
     if (currentLayer.layers[i].name.toLowerCase() == chosenLayer.toLowerCase()) {
       matches.push(currentLayer.layers[i]);
     }
     else {
       findLayers(currentLayer.layers[i], matches);
     }
   }

   return matches;
 }


 function layerNameChanged() {
   chosenLayer = dialog.layerRow.titleEt.text;
 }


 function actionCanceled() {
   dialog.hide();
 }
