// Functions supporting the approval dialog

sap.ui.define([
	"edu/opensap/fiux2/am/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("edu.opensap.fiux2.am.controller.AddCommentDialog", {
		//_oParentView: parent view

		constructor: function(oParentView) {
			this._oParentView = oParentView;
		},
		getId: function() {
			return "edu.opensap.fiux2.am.controller.AddCommentDialog";
		},

		// Opens the approval dialog
		openDialog: function(oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment(this.getId(), "edu.opensap.fiux2.am.view.AddCommentDialog", this);

				this._oParentView.addDependent(this._oDialog);
			}

			this._oDialog.open();
		},

		// Event handler for the confirm action of the approval dialog. Note that this event handler is attached declaratively
		// in the definition of fragment nw.epm.refapps.ext.po.apv.view.fragment.ApprovalDialog.
		onConfirmAction: function() {
			var sComment, sMessageHeader;
			//todo get sComment and sMessageHeader from dialog
			sComment = sap.ui.core.Fragment.byId(this.getId(), "comment").getValue();
			sMessageHeader = sap.ui.core.Fragment.byId(this.getId(), "messageHeaderSelect").getSelectedKey();

			this._oDialog.close();
			this._oParentView.getController().onAddCommentButtonPressedInDialog(sComment, sMessageHeader);
		},

		// Event handler for the cancel action of the approval dialog. Note that this event handler is attached declaratively
		// in the definition of fragment nw.epm.refapps.ext.po.apv.view.fragment.ApprovalDialog.
		onCancelAction: function() {
			this._oDialog.close();
		}
	});
});