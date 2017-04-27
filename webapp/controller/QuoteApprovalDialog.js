// Functions supporting the approval dialog

sap.ui.define([
	"sap/ui/base/Object"
], function(Object) {
	"use strict";

	return Object.extend("edu.opensap.fiux2.am.controller.QuoteApprovalDialog", {
		//_oParentView: parent view
		
		getId: function(){
			return "edu.opensap.fiux2.am.controller.QuoteApprovalDialog";
		},

		constructor: function(oParentView) {
			this._oParentView = oParentView;
		},

		// Opens the approval dialog
		openDialog: function(oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment(this.getId(), "edu.opensap.fiux2.am.view.QuoteApprovalDialog", this);

				this._oParentView.addDependent(this._oDialog);
			}

			this._oDialog.open();
		},


		onConfirmAction: function() {

			this._oDialog.close();
			this._oParentView.getController().onApproveButtonPress();
		},


		onCancelAction: function() {
			this._oDialog.close();
		}
	});
});