// Utility for performing an approve/reject action

sap.ui.define([
	"sap/m/MessageToast"
], function(MessageToast) {
	"use strict";

	return {
		// This method performs approve/reject action on an array of PO IDs which of course might also contain only a single PO ID.
		// More precisely, it offers the following services
		// - Perform the function import for approving/rejecting in the backend
		// - Generic error handling
		// - Generic hiding of BusyIndicator
		// - Generic success message
		// Parameters:
		// - oView         - the view using this service (actually only used for retrieving models)
		// - sPRKey       - purchaseRequisitionKey
		// - sApprovalNote - note for this approval/rejection
		// - fnSuccess     - optional custom success handler
		rejectPR: function(oView, sPRKey, sApprovalNote) {
			var sFunction = "/RejectPurchaseRequisition",
				oModel = oView.getModel(),
				oController = oView.getController(),

				fnOnError = function(oResponse) {
					MessageToast.show("Error here: " + JSON.stringify(oResponse));
				},
				fnOk = function() {

					MessageToast.show("Purchase Requisition was successfully rejected.");
					oController.getEventBus().publish("edu.opensap.fiux2.am", "approvalExecuted", {
						prKey: sPRKey
					});
				};

			oModel.callFunction(sFunction, {
				method: "POST",
				urlParameters: {
					PRKey: sPRKey,
					Note: sApprovalNote
				},
				success: fnOk,
				error: fnOnError
			});

		},

		rejectQuote: function(oView, sQKey, sApprovalNote) {
			var sFunction = "/RejectQuote",
				oModel = oView.getModel(),
				oController = oView.getController(),

				fnOnError = function(oResponse) {
					MessageToast.show("Error here: " + JSON.stringify(oResponse));
				},
				fnOk = function() {

					MessageToast.show("Quote was successfully rejected.");
					oController.getEventBus().publish("edu.opensap.fiux2.am", "quoteRejectionExecuted", {
						quoteKey: sQKey
					});
					oController.onRejectQuote();
				};

			oModel.callFunction(sFunction, {
				method: "POST",
				urlParameters: {
					QuoteKey: sQKey,
					Note: sApprovalNote
				},
				success: fnOk,
				error: fnOnError
			});

		},

		approveQuote: function(oView, sQKey, sPRKey, sApprovalNote) {
			var sFunction = "/ApproveQuote",
				oModel = oView.getModel(),
				oController = oView.getController(),

				fnOnError = function(oResponse) {
					MessageToast.show("Error here: " + JSON.stringify(oResponse));
				},
				fnOk = function() {

					MessageToast.show("Quote was successfully accepted.");
					oController.getEventBus().publish("edu.opensap.fiux2.am", "approvalExecuted", {
						prKey: sPRKey
					});
				};

			oModel.callFunction(sFunction, {
				method: "POST",
				urlParameters: {
					QuoteKey: sQKey,
					Note: sApprovalNote,
					PRKey: sPRKey
				},
				success: fnOk,
				error: fnOnError
			});

		},

		addComment: function(oView, sComment, sMessageHeader, sReferenceKey) {
			var sFunction = "/AddComment",
				oModel = oView.getModel(),
				oController = oView.getController(),

				fnOnError = function(oResponse) {
					MessageToast.show("Error here: " + JSON.stringify(oResponse));
				},
				fnOk = function() {

					MessageToast.show("Comment was successfully posted.");
					oController.onCommentAdded();
				};

			oModel.callFunction(sFunction, {
				method: "POST",
				urlParameters: {
					Comment: sComment,
					MessageHeader: sMessageHeader,
					ReferenceKey: sReferenceKey
				},
				success: fnOk,
				error: fnOnError
			});

		},
		addAttachment: function(oView, sFileName, sMimeType, sFileSize, sDescription, sReferenceKey) {
			var sFunction = "/AddAttachment",
				oModel = oView.getModel(),
				oController = oView.getController(),

				fnOnError = function(oResponse) {
					MessageToast.show("Error here: " + JSON.stringify(oResponse));
				},
				fnOk = function() {

					MessageToast.show("Attachment was successfully posted.");
					oController.onAttachmentAdded();
				};

			oModel.callFunction(sFunction, {
				method: "POST",
				urlParameters: {
					FileName: sFileName,
					MimeType: sMimeType,
					FileSize: sFileSize,
					Description: sDescription,
					ReferenceKey: sReferenceKey
				},
				success: fnOk,
				error: fnOnError
			});

		}

	};
});