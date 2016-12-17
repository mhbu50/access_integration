frappe.pages['access-integration'].on_page_load = function(wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Access integration',
        single_column: true
    });

    var upload = page.add_field({
        fieldname: "upload",
        label: __("Upload"),
        fieldtype: "Button",
        icon: "fa fa-upload"
    });

    upload.$input.on("click", function() {
        var d = new frappe.ui.Dialog({
            title: __("Upload User Permissions"),
            fields: [{
                fieldtype: "HTML",
                options: '<p class="text-muted"><ol>' +
                    "<li>" + __("Upload CSV file containing all user permissions in the same format as Download.") + "</li>" +
                    "<li><strong>" + __("Any existing permission will be deleted / overwritten.") + "</strong></li>" +
                    '</p>'
            }, {
                fieldtype: "Attach",
                fieldname: "attach",
            }],
            primary_action_label: __("Upload and Sync"),
            primary_action: function() {
                var file = "vv.mdb"
                if (this.fields_dict.attach.fileobj) {
                    file = this.fields_dict.attach.fileobj.filename;
                }

                frappe.call({
                    "method": "access_integration.access_integration.doctype.access_integration.access_integration.get_db",
                    args: {
                        file: file
                    },
                    callback: function(data) {

                        var d = JSON.parse(data.message);
                        console.log(d);

                        var source = {
                            datafields: [{
                                name: 'Table'
                            }, {
                                name: 'table'
                            }, ],
                            localdata: []
                        };
                        var dataFields = [{
                            name: 'Table'
                        }, {
                            name: 'fieldname'
                        }, {
                            name: 'reqd'
                        }, {
                            name: 'label'
                        }, {
                            name: 'fieldtype'
                        }];

                        var subSource = {
                            datafields: dataFields,
                            localdata: []
                        };
                        for (var variable in d) {
                            if (d.hasOwnProperty(variable)) {
                                console.log("variable", d[variable]);
                                source.localdata.push({
                                    "Table": variable,
                                    "table": variable
                                });
                            }
                        }

                        console.log("source = ", source);
                        var dataAdapter = new $.jqx.dataAdapter(source);
                        $("#tableGrid").jqxGrid({
                            source: dataAdapter,
                            editable: true,
                            editmode: 'click'
                        });
                        //
                        // for (var y in d) {
                        //     if (d.hasOwnProperty(variable)) {
                        //         console.log("x", variable);
                        //
                        //     }
                        // }

                        $("#tableGrid").on('rowselect', function(event) {
                            var dataRecord = $("#tableGrid").jqxGrid('getrowdata', event);
                            var Table = event.args.row.Table;

                            console.log("Table ", d[Table]);
                            var dataSource = {
                                datafields: dataFields,
                                localdata: []
                            }

                            for (var x in d[Table]) {
                                if (d[Table].hasOwnProperty(x)) {
                                    if (d[Table][x].fieldname)
                                        dataSource.localdata.push({
                                            "fieldname": d[Table][x].fieldname,
                                            "fieldtype": d[Table][x].fieldtype,
                                            "label": d[Table][x].label,
                                            "reqd":d[Table][x].reqd
                                        });
                                }
                            }

                            var adapter = new $.jqx.dataAdapter(dataSource);
                            // update data source.
                            $("#columnsGrid").jqxGrid({
                                source: adapter,
                                editable: true
                            });
                        });
                    }
                });
                d.hide();
            }
        });
        d.show();
    });

    $(frappe.render_template("table")).appendTo(page.page_form);

    $(document).ready(function() {
        init_pops();
        // prepare the data
        var source = {
            datafields: [{
                name: 'Table'
            }, {
                name: 'table'
            }, ],
            localdata: []
        };


        var dataAdapter = new $.jqx.dataAdapter(source);
        $("#tableGrid").jqxGrid({
            width: 250,
            height: 250,
            source: dataAdapter,
            editable: true,
            editmode: 'click',
            selectionmode: 'singlerow',
            keyboardnavigation: false,
            columns: [{
                text: 'Table Name',
                datafield: 'table',
                width: 200,

            }, {
                text: 'Edit',
                datafield: 'Edit',
                columntype: 'button',
                cellsrenderer: function() {
                    return "Edit";
                },
                buttonclick: function(row) {
                    // open the popup window when the user clicks a button.
                    editrow = row;
                    var offset = $("#tableGrid").offset();
                    $("#popupWindow").jqxWindow({
                        position: {
                            x: parseInt(offset.left) + 60,
                            y: parseInt(offset.top) + 60
                        }
                    });
                    // get the clicked row's data and initialize the input fields.
                    var dataRecord = $("#tableGrid").jqxGrid('getrowdata', editrow);
                    console.log("dataRecord", dataRecord);
                    $("#tabletName").val(dataRecord.table);
                    // show the popup window.
                    $("#popupWindow").jqxWindow('open');
                }
            }]
        });
        // columns Grid
        // prepare the data
        var dataFields = [{
            name: 'Table'
        }, {
            name: 'fieldname'
        }, {
            name: 'reqd'
        }, {
            name: 'label'
        }, {
            name: 'fieldtype'
        }];
        var source;

        var dataAdapter = new $.jqx.dataAdapter(source);
        dataAdapter.dataBind();


        $("#columnsGrid").jqxGrid({
            width: 850,
            height: 250,
            keyboardnavigation: false,
            columns: [{
                text: 'fieldname',
                datafield: 'fieldname',
                width: 150
            }, {
                text: 'fieldtype',
                datafield: 'fieldtype',
                width: 150
            }, {
                text: 'label',
                datafield: 'label'
            }, {
                text: 'Required',
                datafield: 'reqd',
                cellsformat: 'd',
                width: 150
            }, {
                text: 'Edit',
                datafield: 'Edit',
                columntype: 'button',
                cellsrenderer: function() {
                    return "Edit";
                },
                buttonclick: function(row) {
                    // open the popup window when the user clicks a button.
                    editrow = row;
                    var offset = $("#columnsGrid").offset();
                    $("#popupWindow2").jqxWindow({
                        position: {
                            x: parseInt(offset.left) + 60,
                            y: parseInt(offset.top) + 60
                        }
                    });
                    // get the clicked row's data and initialize the input fields.
                    var dataRecord = $("#columnsGrid").jqxGrid('getrowdata', editrow);
                    console.log("dataRecord", dataRecord);
                    $("#fieldname").val(dataRecord.fieldname);
                    $("#fieldtype").val(dataRecord.fieldtype)
                    $("#label").val(dataRecord.label)
                    $("#reqd").val(dataRecord.reqd)
                        // show the popup window.
                    $("#popupWindow2").jqxWindow('open');
                }
            }]
        });

        $("#tableGrid").jqxGrid('selectrow', 0);
    });

    function init_pops() {
        // initialize the popup window and buttons.
        $("#popupWindow").jqxWindow({
            width: 250,
            resizable: false,
            isModal: true,
            autoOpen: false,
            cancelButton: $("#Cancel"),
            modalOpacity: 0.01
        });

        $("#popupWindow").on('open', function() {
            $("#tabletName").jqxInput('selectAll');
        });

        $("#Cancel").jqxButton({
            theme: theme
        });
        $("#Save").jqxButton({
            theme: theme
        });

        $("#insert").jqxButton({
            theme: theme
        });
        $("#insertall").jqxButton({
            theme: theme
        });

        $("#insert").click(function() {
                var rowindex = $('#tableGrid').jqxGrid('getselectedrowindex');
                var rowID = $('#tableGrid').jqxGrid('getrowdata', rowindex);
                var table = rowID.table;
                var fields = [];

           var rows = $('#columnsGrid').jqxGrid('getrows');


           for (var r in rows) {
             if (rows.hasOwnProperty(r)) {

               fields.push({
                    "fieldname": rows[r].fieldname,
                    "fieldtype": rows[r].fieldtype,
                    "label": rows[r].label,
                    "reqd":rows[r].reqd
                });
             }
           }
           console.log("table",table);
           console.log("fields",fields);
           frappe.call({
          "method": "access_integration.access_integration.doctype.access_integration.access_integration.do_insert",
          args: {
              table: table,
              fields:fields
          },
          callback: function (data) {
            console.log(data);
          }
      });


          //  dataSource.localdata.push({
          //      "fieldname": d[Table][x].fieldname,
          //      "fieldtype": d[Table][x].fieldtype,
          //      "label": d[Table][x].label,
          //      "reqd":d[Table][x].reqd
          //  });
         });



    // update the edited row when the user clicks the 'Save' button.
    $("#Save").click(function() {
        if (editrow >= 0) {
            var row = {
                table: $("#tabletName").val()
            };
            var rowID = $('#tableGrid').jqxGrid('getrowid', editrow);
            $('#tableGrid').jqxGrid('updaterow', rowID, row);
            $("#popupWindow").jqxWindow('hide');
        }
    });


    $("#popupWindow2").jqxWindow({
        width: 250,
        resizable: false,
        isModal: true,
        autoOpen: false,
        cancelButton: $("#Cancel2"),
        modalOpacity: 0.01
    });

    $("#popupWindow2").on('open', function() {
        $("#tabletName").jqxInput('selectAll');
    });

    $("#Cancel2").jqxButton({
        theme: theme
    });
    $("#Save2").jqxButton({
        theme: theme
    });
    // update the edited row when the user clicks the 'Save' button.
    $("#Save2").click(function() {
        if (editrow >= 0) {
            var row = {
                fieldname: $("#fieldname").val(),
                fieldtype: $("#fieldtype").val(),
                label: $("#label").val(),
                reqd: $("#reqd").val(),
            };

            var rowID = $('#columnsGrid').jqxGrid('getrowid', editrow);
            $('#columnsGrid').jqxGrid('updaterow', rowID, row);
            $("#popupWindow2").jqxWindow('hide');
        }
    });
}

};
