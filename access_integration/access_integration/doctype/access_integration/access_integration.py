#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from frappe.utils import strip, get_files_path, get_path, get_site_base_path
import subprocess
import frappe
import collections
import json
from frappe.model.document import Document
import sys
reload(sys)
sys.setdefaultencoding("utf-8")

class Accessintegration(Document):
	pass

def byteify(input):
    if isinstance(input, dict):
        return {byteify(key): byteify(value)
                for key, value in input.iteritems()}
    elif isinstance(input, list):
        return [byteify(element) for element in input]
    elif isinstance(input, unicode):
        return input.encode('utf-8')
    else:
        return input

@frappe.whitelist()
def get_db(file):
    # print "file = ", "/home/mohd/frappe-bench/sites/afnan.com", str(file)
    # DATABASE = "/home/mohd/frappe-bench/sites/afnan.com" + str(file)

    print "file = ", "/home/mohd/frappe-bench/sites/afnan.com/private/files/", str(file)
    DATABASE = "/home/mohd/frappe-bench/sites/afnan.com/private/files/vv.mdb"

    tables = subprocess.Popen(["mdb-tables", "-1", DATABASE],
                              stdout=subprocess.PIPE).communicate()[0]

    tables = tables.split('\n')
    print "tables> {0}".format(tables)
    dict = {}
    for table in tables:
        if table != '':
            print("table =" + table)
            table_col = subprocess.Popen(["mdb-prop", DATABASE, table],
                                         stdout=subprocess.PIPE).communicate()[0]
            # table_col = table_col.decode("UTF", "ignore")

            dict[table]=table
            table_col = table_col.decode("UTF", "ignore").encode('utf-8')
            col = table_col.split('name')
            v_proprty =[]
            for c in col:
                fields = c.split('\n')
                fields = [x for x in fields if x != '']

                v_fields = {}
                v_fields["fieldtype"] =  "Data"
                for f in fields:
                    if(f.lstrip().startswith(": (none)")):
                        continue
                    if(f.startswith(":")):
                        print "------------"
                        print "column = ", f.lstrip()
                        v_fields["fieldname"] = f.lstrip()[1:]
                        continue
                    if(f.lstrip().startswith("GUID:")):
                        continue
                    if(f.lstrip().startswith("Required: yes")):
                        v_fields["reqd"] = 1
                    if(f.lstrip().startswith("Description:")):
                        v_fields["label"] = f.lstrip().split(':')[1]
                    if(f.lstrip().startswith("DecimalPlaces")):
                        v_fields["fieldtype"] = "Int"
                    print "field = ", f.lstrip()
                v_proprty.append(v_fields)
                # print "v_proprty = ",v_proprty
            dict[table]=v_proprty
            print "/////////////////////////////////////////"
            role = frappe.get_doc({"doctype": "DocPerm", "role": "Administrator"})

            doc = frappe.get_doc({
                "doctype": "DocType",
                "name": table,
                # "description": "test",
                "module": "Core",
                "quick_entry": 0,
                "fields": v_proprty,
            })
            doc.append("permissions", role)
            # doc.insert()
    return json.dumps(dict, encoding='latin1');

    def do_insert(data):
        role = frappe.get_doc({"doctype": "DocPerm", "role": "Administrator"})

        doc = frappe.get_doc({
            "doctype": "DocType",
            "name": table,
            # "description": "test",
            "module": "Core",
            "quick_entry": 0,
            "fields": v_proprty,
        })
        doc.append("permissions", role)
