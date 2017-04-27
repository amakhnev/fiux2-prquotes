// Functions supporting the approval dialog

sap.ui.define([
	"sap/ui/base/Object"
], function(Object) {
	"use strict";

	return Object.extend("edu.opensap.fiux2.am.controller.QuoteRejectionDialog", {
		//_oParentView: parent view

		getId: function(){
			return "edu.opensap.fiux2.am.controller.QuoteRejectionDialog";
		},
		
		constructor: function(oParentView) {
			this._oParentView = oParentView;
		},

		// Opens the approval dialog
		openDialog: function(oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment(this.getId(), "edu.opensap.fiux2.am.view.QuoteRejectionDialog", this);

				this._oParentView.addDependent(this._oDialog);
			}

			this._oDialog.open();
		},

		// Event handler for the confirm action of the approval dialog. Note that this event handler is attached declaratively
		// in the definition of fragment nw.epm.refapps.ext.po.apv.view.fragment.ApprovalDialog.
		onConfirmAction: function() {

			this._oDialog.close();
			this._oParentView.getController().onRejectButtonPress();
		},

		// Event handler for the cancel action of the approval dialog. Note that this event handler is attached declaratively
		// in the definition of fragment nw.epm.refapps.ext.po.apv.view.fragment.ApprovalDialog.
		onCancelAction: function() {
			this._oDialog.close();
		}
	});
});