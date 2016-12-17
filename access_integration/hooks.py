# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "access_integration"
app_title = "Access integration"
app_publisher = "Accurate Systems"
app_description = "Access integration"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "info@accuratesystems.com.sa"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
app_include_css = "assets/css/access_integration.css"
app_include_js = "assets/js/access_integration.js"

# include js, css files in header of web template
# web_include_css = "/assets/access_integration/css/access_integration.css"
# web_include_js = "/assets/access_integration/js/access_integration.js"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "access_integration.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "access_integration.install.before_install"
# after_install = "access_integration.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "access_integration.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"access_integration.tasks.all"
# 	],
# 	"daily": [
# 		"access_integration.tasks.daily"
# 	],
# 	"hourly": [
# 		"access_integration.tasks.hourly"
# 	],
# 	"weekly": [
# 		"access_integration.tasks.weekly"
# 	]
# 	"monthly": [
# 		"access_integration.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "access_integration.install.before_tests"

# Overriding Whitelisted Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "access_integration.event.get_events"
# }
