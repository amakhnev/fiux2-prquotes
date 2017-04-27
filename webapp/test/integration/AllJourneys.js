jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 PurchaseRequisitions in the list
// * All 3 PurchaseRequisitions have at least one Quotes

sap.ui.require([
	"sap/ui/test/Opa5",
	"edu/opensap/fiux2/am/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"edu/opensap/fiux2/am/test/integration/pages/App",
	"edu/opensap/fiux2/am/test/integration/pages/Browser",
	"edu/opensap/fiux2/am/test/integration/pages/Master",
	"edu/opensap/fiux2/am/test/integration/pages/Detail",
	"edu/opensap/fiux2/am/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "edu.opensap.fiux2.am.view."
	});

	sap.ui.require([
		"edu/opensap/fiux2/am/test/integration/MasterJourney",
		"edu/opensap/fiux2/am/test/integration/NavigationJourney",
		"edu/opensap/fiux2/am/test/integration/NotFoundJourney",
		"edu/opensap/fiux2/am/test/integration/BusyJourney"
	], function () {
		QUnit.start();
	});
});