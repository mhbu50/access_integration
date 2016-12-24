frappe.pages['import-db'].on_page_load = function(wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Import DB',
        single_column: true
    });
    $("<input type='file' name='xlfile' id='xlf' accept='.xls,.xlsx ,csv'/><br>")
        .appendTo(page.page_form);
  // page.add_button("sssss", function() {
  //   console.log("fff",$('div[id*="fountainG_"]'));
  // });
    page.add_button("parse", function() {


        var fileUpload = document.getElementById("xlf");
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
        console.log("fileUpload",fileUpload.files[0]);
        if (fileUpload.files[0]) {
            if (typeof(FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function(e) {

                    var rows = e.target.result.split("\n");
                    rows.shift(); //to remove first row
                    rows.pop(); //to remove last row
                    data = [];
                    for (var i = 0; i < rows.length; i++) {
                        var cells = rows[i].split(",");
                        data.push({
                                0: getCode(0, cells),
                                1: getName1(1, cells),
                                2: getName2(6, cells),
                                3: getParent(0, i, rows),
                                4: getParent2(0, i, rows),
                                5: is_group(0, i, rows)
                            })
                        // console.log(" name1 = " + getName1(1, cells).trim() + " parent = " + getParent(0, i, rows) + " parent2 = " + getParent2(1, i, rows));
                    }
                      grid = new Slick.Grid("#newCSV", data, columns, options);
                };
                reader.readAsText(fileUpload.files[0]);
            } else {
                alert("This browser does not support HTML5.");
            }
        } else {
            alert("Please upload a valid CSV file.");
        }
    });

$("<div id='newCSV' style='width: 100%; height: 700px; overflow: hidden; outline: 0px; position: relative;'></div>").appendTo(page.page_form);
var grid;
var grid2;
var data = [];

var options = {
    editable: true,
    enableAddRow: true,
    enableCellNavigation: true,
    asyncEditorLoading: false,
    autoEdit: false
};

var undoRedoBuffer = {
    commandQueue: [],
    commandCtr: 0,

    queueAndExecuteCommand: function(editCommand) {
        this.commandQueue[this.commandCtr] = editCommand;
        this.commandCtr++;
        editCommand.execute();
    },

    undo: function() {
        if (this.commandCtr === 0)
            return;

        this.commandCtr--;
        var command = this.commandQueue[this.commandCtr];

        if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
            command.undo();
        }
    },
    redo: function() {
        if (this.commandCtr >= this.commandQueue.length)
            return;
        var command = this.commandQueue[this.commandCtr];
        this.commandCtr++;
        if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
            command.execute();
        }
    }
};

// undo shortcut
$(document).keydown(function(e) {
    if (e.which == 90 && (e.ctrlKey || e.metaKey)) { // CTRL + (shift) + Z
        if (e.shiftKey) {
            undoRedoBuffer.redo();
        } else {
            undoRedoBuffer.undo();
        }
    }
});

var pluginOptions = {
    clipboardCommandHandler: function(editCommand) {
        undoRedoBuffer.queueAndExecuteCommand.call(undoRedoBuffer, editCommand);
    },
    includeHeaderWhenCopying: false
};

var columns = [{
    id: "selector",
    name: "",
    field: "num",
    width: 30
}];

for (var i = 0; i < 7; i++) {
    columns.push({
        id: i,
        name: String.fromCharCode("A".charCodeAt(0) + i),
        field: i,
        width: 157,
        editor: Slick.Editors.Text
    });
}

grid = new Slick.Grid("#newCSV", data, columns, options);
grid.setSelectionModel(new Slick.CellSelectionModel());
grid.registerPlugin(new Slick.AutoTooltips());
console.log("grid", grid);
// set keyboard focus on the grid
//  grid.getCanvasNode().focus();

grid.registerPlugin(new Slick.CellExternalCopyManager(pluginOptions));


grid.onAddNewRow.subscribe(function(e, args) {
    var item = args.item;
    var column = args.column;
    grid.invalidateRow(data.length);
    data.push(item);
    grid.updateRowCount();
    grid.render();
});

};


function getCode(position, cells) {
    return cells[position];
}

function getName1(position, cells) {
    return cells[position];
}

function getName2(position, cells) {
    return cells[position];
}

function lastParent(position, rows, currentRowPosition, count) {

    var previousRow = rows[currentRowPosition - count];
    var previousCells = previousRow.split(",");
    var id_2 = previousCells[position];
    return id_2;
}

function afterParent(position, rows, currentRowPosition, count) {

    var previousRow = rows[currentRowPosition + count];
    if (previousRow) {
        var previousCells = previousRow.split(",");
        var id_2 = previousCells[position];
        return id_2;
    }
}

function getParent(position, currentRowPosition, rows) {
    var currentRow = rows[currentRowPosition];
    var currentCells = currentRow.split(",");
    var id_1 = currentCells[position];

    var count = 0;
    do {
        if (currentRowPosition - count < 0)
            break;
        var id_2 = lastParent(position, rows, currentRowPosition, count);
        if (id_1.indexOf(id_2) != -1 && id_1 != id_2) {
            return id_2;
        } else {
            count++;
        }
    }
    while (true);
    return "";
}

function getParent2(position, currentRowPosition, rows) {

    var currentRow = rows[currentRowPosition];
    var currentCells = currentRow.split(",");
    var id_1 = currentCells[position];

    var count = 0;
    do {
        if (currentRowPosition - count < 0)
            break;
        var id_2 = lastParent(position, rows, currentRowPosition, count);
        if (id_1.indexOf(id_2) != -1 && id_1 != id_2) {
            return lastParent(1, rows, currentRowPosition, count);
        } else {
            count++;
        }
    }
    while (true);
    return "";
}

function is_group(position, currentRowPosition, rows) {
    var currentRow = rows[currentRowPosition];
    var currentCells = currentRow.split(",");
    var id_1 = currentCells[position];
    // debugger;
    var count = 0;
    do {
        if (currentRowPosition - count < 0)
            break;
        var id_2 = afterParent(position, rows, currentRowPosition, count);
        if (id_2 === undefined) {
            id_2 = "";
        }
        var x0 = id_1 + "0";
        var len0 = x0.length;
        var x1 = id_1 + "1";
        var len1 = x1.length;
        // console.log("x0 = " + x0 + " len0 = " + len0 + " substring = " + id_2.substring(len0) + " id_1 = " + id_1 + " id_2 = " + id_2);
        // console.log("x0 = " + x0 + " id_2 = " + id_2 + " id_2.substring(0,len0) = " + id_2.substring(0, len0));
        if (x0 == id_2.substring(0, len0) || x1 == id_2.substring(0, len1)) {
            return 1;
        } else {
            count++;
        }
    }
    while (true);
    return "0";
}
