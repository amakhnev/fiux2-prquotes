/*global location */
sap.ui.define([
	"edu/opensap/fiux2/am/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"edu/opensap/fiux2/am/model/formatter",
	"edu/opensap/fiux2/am/model/approver",
	"edu/opensap/fiux2/am/controller/QuoteRejectionDialog",
	"edu/opensap/fiux2/am/controller/QuoteApprovalDialog",
	"edu/opensap/fiux2/am/controller/AddCommentDialog",
	"sap/ui/Device"
], function(BaseController, JSONModel, formatter, approver, QuoteRejectionDialog, QuoteApprovalDialog, AddCommentDialog, Device) {
	"use strict";

	return BaseController.extend("edu.opensap.fiux2.am.controller.QuoteDetail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				lineItemListTitle: this.getResourceBundle().getText("detailLineItemTableHeading")
			});

			this.getRouter().getRoute("quote").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "quoteDetailView");

			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));

		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress: function() {
			var oViewModel = this.getModel("quoteDetailView");

			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},

		onRejectionButtonPressed: function(oEvent) {

			if (!this._oSubControllerForRejection) {
				this._oSubControllerForRejection = new QuoteRejectionDialog(this.getView());
			}
			this._oSubControllerForRejection.openDialog(oEvent);
		},

		onApprovalButtonPressed: function(oEvent) {

			if (!this._oSubControllerForApproval) {
				this._oSubControllerForApproval = new QuoteApprovalDialog(this.getView());
			}
			this._oSubControllerForApproval.openDialog(oEvent);
		},

		onRejectButtonPress: function(note) {
			var oQuote = this.getView().getBindingContext().getObject();
			approver.rejectQuote(this.getView(), oQuote.QuoteKey, "");

		},

		onApproveButtonPress: function(note) {
			var oQuote = this.getView().getBindingContext().getObject();
			approver.approveQuote(this.getView(), oQuote.QuoteKey, oQuote.PurchaseRequisitionKey, "");

		},

		onRejectQuote: function() {
			var oQuote = this.getView().getBindingContext().getObject();
			var bReplace = !Device.system.phone;
			this.getRouter().navTo("object", {
				objectId: oQuote.PurchaseRequisitionKey
			}, bReplace);

		},

		onAddCommentButtonPress: function(oEvent) {

			if (!this._oSubControllerForAddComment) {
				this._oSubControllerForAddComment = new AddCommentDialog(this.getView());
			}
			this._oSubControllerForAddComment.openDialog(oEvent);
		},

		onAddCommentButtonPressedInDialog: function(sComment, sMessageHeader) {
			var oQuote = this.getView().getBindingContext().getObject();
			var key = oQuote.QuoteKey;

			approver.addComment(this.getView(), sComment, sMessageHeader, key);

		},

		onCommentAdded: function() {
			this.byId("quoteCommentsList").getBinding("items").refresh();
			var iCommentCount = this.byId("iconTabBarFilter3").getCount();
			this.byId("iconTabBarFilter3").setCount(parseInt(iCommentCount) + 1);

		},

		/**
		 * Updates the item count within the line item table's header
		 * @param {object} oEvent an event containing the total number of items in the list
		 * @private
		 */
		onListUpdateFinished: function(oEvent) {
			var sTitle,
				iTotalItems = oEvent.getParameter("total"),
				oViewModel = this.getModel("detailView");

			// only update the counter if the length is final
			if (this.byId("lineItemsList").getBinding("items").isLengthFinal()) {
				if (iTotalItems) {
					sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
				} else {
					//Display 'Line Items' instead of 'Line items (0)'
					sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
				}
				oViewModel.setProperty("/lineItemListTitle", sTitle);
			}
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function(oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("Quotes", {
					QuoteKey: sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		/**
		 * Binds the view to the object path. Makes sure that detail view displays
		 * a busy indicator while data for the corresponding element binding is loaded.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound to the view.
		 * @private
		 */
		_bindView: function(sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("quoteDetailView");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function() {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("quoteDetailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}

			var sPath = oElementBinding.getPath()				;

			this.getOwnerComponent().oListSelector.selectAListItem(sPath);

		},

		_onMetadataLoaded: function() {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("quoteDetailView");

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);
			oViewModel.setProperty("/lineItemTableDelay", 0);


			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		}

	});

});