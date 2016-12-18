// Copyright (c) 2016, Accurate Systems and contributors
// For license information, please see license.txt
var data;
var table = "";
frappe.ui.form.on('Access integration', {
    do: function(frm) {
        frappe.call({
            "method": "access_integration.access_integration.doctype.access_integration.access_integration.get_db",
            args: {
                file: frm.doc.file
            },
            callback: function(data) {

                data = JSON.parse(data.message);
                console.log("1data", data);
                for (var variable in data) {
                    if (data.hasOwnProperty(variable)) {
                        var new_row4 = frm.add_child("tables");
                        console.log("variable = ", variable);
                        new_row4.table = variable;
                    }
                }
                refresh_field("tables");
                frm.refresh();
            }
        });
    },
    insert: function(frm) {
        var fields = [];
        console.log("table", table);
        var x = $(frm.get_field("fields"));
        console.log("x", x);
        var grid = x[0].grid;
        for (var g in grid.grid_rows) {
            if (grid.grid_rows.hasOwnProperty(g)) {
                fields.push(grid.grid_rows[g].doc);
                //  console.log("grid.grid_rows = ",grid.grid_rows[g].doc);
            }
        }
        console.log("fields", fields);
        frappe.call({
            "method": "access_integration.access_integration.doctype.access_integration.access_integration.do_insert",
            args: {
                table: table,
                fields:fields

            },
            callback: function(data) {
                console.log(data);
            }
        });
    },
    refresh: function(frm) {

        var x = $(frm.get_field("tables"));

        setTimeout(function() {
            var grid = x[0].grid;
            for (var g in grid.grid_rows) {
                if (grid.grid_rows.hasOwnProperty(g)) {
                    var me = this;
                    $(grid.grid_rows[g].wrapper[0]).on('click', function() {
                        var $this = $(this);
                        var $row = $($this[0].children[0].children[1].children[1]);
                        table = $row[0].innerText
                        console.log("$table", table);

                        frappe.call({
                            "method": "access_integration.access_integration.doctype.access_integration.access_integration.get_db",
                            args: {
                                file: frm.doc.file
                            },
                            callback: function(data) {

                                data = JSON.parse(data.message);
                                console.log("2 data", data[table]);
                                frm.clear_table("fields");
                                refresh_field("fields");

                                for (var variable in data[table]) {
                                    if (data[table].hasOwnProperty(variable)) {
                                        row = data[table][variable];
                                        if (row.fieldname) {
                                            console.log("variable", data[table][variable]);
                                            var new_row = frm.add_child("fields");
                                            new_row.label = row.label;
                                            new_row.fieldtype = row.fieldtype;
                                            new_row.reqd = row.reqd;
                                            new_row.fieldname = row.fieldname;
                                        }
                                    }
                                }
                                refresh_field("fields");
                                // frm.refresh();
                            }
                        });
                    });
                }
            }
        }, 500);
    }
});
