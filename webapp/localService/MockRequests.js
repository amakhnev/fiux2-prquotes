// In mock mode, the mock server intercepts HTTP calls and provides fake output to the
// client without involving a backend system. But special backend logic, such as that
// performed by function imports, is not automatically known to the mock server. To handle
// such cases, the app needs to define specific mock requests that simulate the backend
// logic using standard HTTP requests (that are again interpreted by the mock server) as
// shown below.

sap.ui.define(["sap/ui/base/Object"], function(Object) {
	"use strict";

	return Object.extend("edu.opensap.fiux2.am.localService.MockRequests", {
		constructor: function(oMockServer) {
			this._oMockServer = oMockServer;
		},

		getRequests: function() {
			return [this.mockApproveQuote(), this.mockRejectQuote(), this.mockRejectPR(), this.mockAddComment()];
		},

		mockApproveQuote: function() {
			return {
				// This mock request simulates the function import "ApproveQuote",
				// which is triggered when the user chooses the "Approve" button on the Quote.
				// It removes the approved purchase requisition from the mock data.
				method: "POST",
				path: new RegExp("ApproveQuote\\?PRKey='(.*)'&Note='(.*)'&QuoteKey='(.*)'"),
				response: this.deletePr.bind(this)
			};
		},
		mockRejectPR: function() {
			return {
				// This mock request simulates the function import "RejectPurchaseRequisition",
				// which is triggered when the user chooses the "Reject" button on Purchase Requisition.
				// It removes the approved purchase requisition from the mock data.
				method: "POST",
				path: new RegExp("RejectPurchaseRequisition\\?PRKey='(.*)'&Note='(.*)'"),
				response: this.deletePr.bind(this)
			};
		},

		mockRejectQuote: function() {
			return {
				// This mock request simulates the function import "RejectPurchaseOrder",
				// which is triggered when the user chooses the "Reject" button.
				// It removes the rejected purchase order from the mock data.
				method: "POST",
				path: new RegExp("RejectQuote\\?QuoteKey='(.*)'&Note='(.*)'"),
				response: this.rejectQuote.bind(this)
			};
		},

		mockAddComment: function() {
			return {
				// This mock request simulates the function import "AddComment",
				// which is triggered when the user chooses the "addcomment" button.
				// It adds new comment into the mock data.
				method: "POST",
				path: new RegExp("AddComment\\?Comment='(.*)'&MessageHeader='(.*)'&ReferenceKey='(.*)'"),
				response: this.addComment.bind(this)
			};
		},

		deletePr: function(oXhr, sPRKey) {
			var aPurchaseRequisitions = this._oMockServer.getEntitySetData("PurchaseRequisitions"),
				aQuotes = this._oMockServer.getEntitySetData("Quotes"),
				filterPR = function(oPurchaseRequisitionOrQuote) {
					return oPurchaseRequisitionOrQuote.PurchaseRequisitionKey !== sPRKey;
				};

			aPurchaseRequisitions = aPurchaseRequisitions.filter(filterPR);
			this._oMockServer.setEntitySetData("PurchaseRequisitions", aPurchaseRequisitions);
			aQuotes = aQuotes.filter(filterPR);
			this._oMockServer.setEntitySetData("Quotes", aQuotes);

			oXhr.respondJSON(200, {}, JSON.stringify({
				d: {
					results: []
				}
			}));
		},

		rejectQuote: function(oXhr, sQuoteKey) {
			var aQuotes = this._oMockServer.getEntitySetData("Quotes"),
				i;
			for (i = 0; i < aQuotes.length; i++) {
				if (aQuotes[i].QuoteKey === sQuoteKey) {
					aQuotes[i].Status = "Rejected";
					break;
				}
			}
			this._oMockServer.setEntitySetData("Quotes", aQuotes);

			oXhr.respondJSON(200, {}, JSON.stringify({
				d: {
					results: []
				}
			}));
		},

		addComment: function(oXhr, sComment, sMessageHeader, sReferenceKey) {
            
			// update comment count
			var aQuotes = this._oMockServer.getEntitySetData("Quotes"),
				i;
			for (i = 0; i < aQuotes.length; i++) {
				if (aQuotes[i].QuoteKey === sReferenceKey) {
					aQuotes[i].CommentsCount = aQuotes[i].CommentsCount + 1;
					break;
				}
			}
			this._oMockServer.setEntitySetData("Quotes", aQuotes);

			var maxCommentId = 0,
				aComments = this._oMockServer.getEntitySetData("Comments"),
				oNewComment, today = new Date();
			for (i = 0; i < aComments.length; i++) {
				if (parseInt(aComments[i].CommentExtKey) > maxCommentId) {
					maxCommentId = parseInt(aComments[i].CommentExtKey);
				}
			}
			oNewComment = {
				"CommentExtKey": maxCommentId + 1,
				"CreationDate": "/Date(" + today.getTime() + ")/",
				"ReferenceKey": sReferenceKey,
				"MessageHeader": decodeURI(sMessageHeader),
				"Comment": decodeURI(sComment),
				"__metadata": {
					"uri": "Comments('CommentExtKey " + (maxCommentId + 1) + "')",
					"type": "MyModel.CommentExt"
				}
			};

			aComments.push(oNewComment);

			this._oMockServer.setEntitySetData("Comments", aComments);

			oXhr.respondJSON(200, {}, JSON.stringify({
				d: {
					results: []
				}
			}));

		}

	});
});