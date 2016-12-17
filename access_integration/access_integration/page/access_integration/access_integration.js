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
                    console.log("attach", this.fields_dict.attach.fileobj.filename);
                }

                frappe.call({
                    "method": "access_integration.access_integration.doctype.access_integration.access_integration.do_insert",
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
                            name: 'OrderID'
                        }, {
                            name: 'OrderDate',
                            type: 'date'
                        }, {
                            name: 'ShippedDate',
                            type: 'date'
                        }, {
                            name: 'ShipName'
                        }, {
                            name: 'ShipCountry'
                        }];

                        var subSource = {
                            datafields: dataFields,
                            localdata: [{
                                "OrderID": 10248,
                                "Table": "tbl_Used",
                                "EmployeeID": 5,
                                "OrderDate": "1996-07-04 00:00:00",
                                "RequiredDate": "1996-08-01 00:00:00",
                                "ShippedDate": "1996-07-16 00:00:00",
                                "ShipVia": 3,
                                "Freight": 32.3800,
                                "ShipName": "Vins et alcools Chevalier",
                                "ShipAddress": "59 rue de l-Abbaye",
                                "ShipCity": "Reims",
                                "ShipRegion": null,
                                "ShipPostalCode": 51100,
                                "ShipCountry": "France"
                            }]
                        };
                        for (var variable in d) {
                            if (d.hasOwnProperty(variable)) {
                                console.log("variable", d[variable]);
                                source.localdata.push({
                                    "Table": variable,
                                    "table": variable
                                });
                                for (var x in d[variable]) {
                                    if (d[variable].hasOwnProperty(x)) {
                                        console.log("x", d[variable][x]);
                                    }
                                }
                            }
                        }

                        console.log("source = ", source);
                        var dataAdapter = new $.jqx.dataAdapter(source);
                        $("#customersGrid").jqxGrid({
                            source: dataAdapter,
                            editable: true,
                            editmode: 'click'
                        });

                        for (var y in d) {
                            if (d.hasOwnProperty(variable)) {
                                console.log("x", variable);

                            }
                        }
  debugger;
                        $("#customersGrid").on('cellselect', function(event) {
                            console.log("event.args.row. = ", event);
                            debugger;
                            var Table = event.args.row.Table;
                            var records = new Array();
                            var length = dataAdapter.records.length;
                            for (var i = 0; i < length; i++) {
                                var record = dataAdapter.records[i];
                                if (record.Table == Table) {
                                    records[records.length] = record;
                                }
                            }


                            var dataSource = {
                                datafields: dataFields,
                                localdata: records
                            }
                            var adapter = new $.jqx.dataAdapter(dataSource);

                            // update data source.
                            $("#ordersGrid").jqxGrid({
                                source: adapter,
                                editable: true
                            });
                        });

                    }
                });

            }
        });
        d.show();
    });

    $(frappe.render_template("table")).appendTo(page.page_form);

    $(document).ready(function() {
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

        $("#Cancel").jqxButton({ theme: theme });
          $("#Save").jqxButton({ theme: theme });
          // update the edited row when the user clicks the 'Save' button.
          $("#Save").click(function () {
              if (editrow >= 0) {
                  var row = { table: $("#tabletName").val() };
                  var rowID = $('#customersGrid').jqxGrid('getrowid', editrow);
                  $('#customersGrid').jqxGrid('updaterow', rowID, row);
                  $("#popupWindow").jqxWindow('hide');
              }
          });
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
        $("#customersGrid").jqxGrid({
            width: 250,
            height: 250,
            source: dataAdapter,
            editable: true,
            editmode: 'click',
            selectionmode: 'singlecell',
            keyboardnavigation: false,
            columns: [
              {
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
                    var offset = $("#customersGrid").offset();
                    $("#popupWindow").jqxWindow({
                        position: {
                            x: parseInt(offset.left) + 60,
                            y: parseInt(offset.top) + 60
                        }
                    });
                    // get the clicked row's data and initialize the input fields.
                    var dataRecord = $("#customersGrid").jqxGrid('getrowdata', editrow);
                    $("#tabletName").val(dataRecord.table);
                    // show the popup window.
                    $("#popupWindow").jqxWindow('open');
                }
            }]
        });
        // Orders Grid
        // prepare the data
        var dataFields = [{
            name: 'Table'
        }, {
            name: 'OrderID'
        }, {
            name: 'OrderDate',
            type: 'date'
        }, {
            name: 'ShippedDate',
            type: 'date'
        }, {
            name: 'ShipName'
        }, {
            name: 'ShipCountry'
        }];
        var source = {
            datafields: dataFields,
            localdata: [{
                "OrderID": 10248,
                "Table": "WILMK",
                "EmployeeID": 5,
                "OrderDate": "1996-07-04 00:00:00",
                "RequiredDate": "1996-08-01 00:00:00",
                "ShippedDate": "1996-07-16 00:00:00",
                "ShipVia": 3,
                "Freight": 32.3800,
                "ShipName": "Vins et alcools Chevalier",
                "ShipAddress": "59 rue de l-Abbaye",
                "ShipCity": "Reims",
                "ShipRegion": null,
                "ShipPostalCode": 51100,
                "ShipCountry": "France"
            }, {
                "OrderID": 10249,
                "Table": "TOMSP",
                "EmployeeID": 6,
                "OrderDate": "1996-07-05 00:00:00",
                "RequiredDate": "1996-08-16 00:00:00",
                "ShippedDate": "1996-07-10 00:00:00",
                "ShipVia": 1,
                "Freight": 11.6100,
                "ShipName": "Toms Spezialitten",
                "ShipAddress": "Luisenstr. 48",
                "ShipCity": "Mnster",
                "ShipRegion": null,
                "ShipPostalCode": 44087,
                "ShipCountry": "Germany"
            }, {
                "OrderID": 10250,
                "Table": "HANAR",
                "EmployeeID": 4,
                "OrderDate": "1996-07-08 00:00:00",
                "RequiredDate": "1996-08-05 00:00:00",
                "ShippedDate": "1996-07-12 00:00:00",
                "ShipVia": 2,
                "Freight": 65.8300,
                "ShipName": "Hanari Carnes",
                "ShipAddress": "Rua do Pao, 67",
                "ShipCity": "Rio de Janeiro",
                "ShipRegion": "RJ",
                "ShipPostalCode": "05454-876",
                "ShipCountry": "Brazil"
            }, {
                "OrderID": 11066,
                "Table": "WHITC",
                "EmployeeID": 7,
                "OrderDate": "1998-05-01 00:00:00",
                "RequiredDate": "1998-05-29 00:00:00",
                "ShippedDate": "1998-05-04 00:00:00",
                "ShipVia": 2,
                "Freight": 44.7200,
                "ShipName": "White Clover Markets",
                "ShipAddress": "1029 - 12th Ave. S.",
                "ShipCity": "Seattle",
                "ShipRegion": "WA",
                "ShipPostalCode": 98124,
                "ShipCountry": "USA"
            }, ]
        };
        var dataAdapter = new $.jqx.dataAdapter(source);
        dataAdapter.dataBind();


        $("#ordersGrid").jqxGrid({
            width: 850,
            height: 250,
            keyboardnavigation: false,
            columns: [{
                text: 'Column Name',
                datafield: 'OrderID',
                width: 100
            }, {
                text: 'Label',
                datafield: 'OrderDate',
                cellsformat: 'd',
                width: 150
            }, {
                text: 'Required',
                datafield: 'ShippedDate',
                cellsformat: 'd',
                width: 150
            }, {
                text: 'Type',
                datafield: 'ShipName'
            }]
        });

        $("#customersGrid").jqxGrid('selectrow', 0);
    });

}
