/* This script exports all symbols in a file to individual .AI files. They're automatically sized to the symbol's boundaries and
   named according to the symbol's name. Please follow the below instructions carefully

INSTRUCTIONS:
  1. Arrange all symbols on top of eachother in the AI file
	2. Hide all layers in the file containing your symbols, then close the file
	3. Run this script from Illustrator File > Scripts and choose the AI file containing your hidden symbols
	4. The exported AI files will be in a "Symbols" folder whereever this script is located
*/

function getFileName(symbolName) {
  symbolName = symbolName.replace(/[\\\/:*?\'"<>|]/g, "");

  if (symbolName.indexOf(".ai") === -1) {
    symbolName = symbolName + ".ai";
  }

  return symbolName;
}

function findAndPlaceSymbol(runLimit, outputPath) {
  var result = {};
  var FileName;
  var ResizePercentage = 500; // 5x bigger than it was
  result.SymbolPlaced = false;
  for (var i=runLimit; i>0; i--) {
    if (!result.SymbolPlaced) {
      FileName = getFileName(doc.symbols[i-1].name);
      var outputFile = outputPath + "/" + FileName;

      result.file = new File(outputFile);
      if (result.file.exists) {
        doc.symbols[i-1].remove();
      } 
      else {
        // does not exist, placing
        result.SymbolPlaced = true;

        // create temp layer
        doc.layers.add();

        // place a symbol instance - temp
        result.SymbolInstance = doc.symbolItems.add(doc.symbols[i-1]);
        result.SymbolInstance.resize(ResizePercentage, ResizePercentage, true, true, true, true, ResizePercentage, undefined);
        // select the symbol that has been added in a new layer
        doc.layers[0].hasSelectedArtwork = true;
        doc.artboards[0].artboardRect = doc.visibleBounds;
        app.redraw();
      }
    } 
    else {
      // a symbol has already been placed, just delete this one
      try {
        doc.symbols[i-1].remove();
      }
      catch (e) {}
    }
    //redraw();
  }

  return result;
}

function handleFile() {
  redraw();
  var SaveOptions = new IllustratorSaveOptions();
  var runLimit = doc.symbols.length;

  // Create output folder:
  var thisScript = new File($.fileName);
  var outputFolder = new Folder(thisScript.path + "/Symbols/");
  if (!outputFolder.exists) {
    outputFolder.create();
  }

  /* loop through all the symbols until we find one that does not have a corresponding
  *  file saved. Place that symbol, delete ALL the others
  */
  var result = findAndPlaceSymbol(runLimit, outputFolder);
  if (result.SymbolPlaced) {
    redraw();
    doc.saveAs(result.file, SaveOptions);
  }
}


var doc;
var symbolCount;
var rootDir = new Folder();
var thisFile = rootDir.openDlg('Choose an AI File', '*.ai');

if (thisFile) {
  for (var i=0; i<=119; i++) {
    app.open(thisFile);
    doc = app.activeDocument;
    symbolCount = doc.symbols.length;
    handleFile();
    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
  }
}
else {
  // Quit
}
