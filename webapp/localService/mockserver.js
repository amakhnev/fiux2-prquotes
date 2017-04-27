sap.ui.define([
	"sap/ui/core/util/MockServer",
	"edu/opensap/fiux2/am/localService/MockRequests"
], function(MockServer, MockRequests) {
	"use strict";

	return {
		/**
		 * Initializes the mock server. You can configure the delay with the URL parameter "serverDelay"
		 * The local mock data in this folder is returned instead of the real data for testing.
		 *
		 * @public
		 */
		init: function() {
			var oUriParameters = jQuery.sap.getUriParameters(),
				oMockServer = new MockServer({
					rootUri: "/edu/opensap/fiux2/am/data/"
				}),
				oRequests = new MockRequests(oMockServer),
				sPath = jQuery.sap.getModulePath("edu.opensap.fiux2.am.localService"),
				aRequests;

			// configure mock server with a delay of 1s
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: (oUriParameters.get("serverDelay") || 0)
			});

			// load local mock data
			oMockServer.simulate(sPath + "/metadata.xml", {
				sMockdataBaseUrl: sPath + "/mockdata"
			});
			aRequests = oMockServer.getRequests();
			oMockServer.setRequests(aRequests.concat(oRequests.getRequests()));
			oMockServer.start();
			
			// change dates for mock data here - we assume demostration is happening on 20 Apr 2016 so all dates in mock data set 
			// should be shifted in order to get correct flow for simulation. So below we are adding days between now and 20 Apr 2016 (without time components).
            var v20AprDate =  new Date("2016-04-20T12:24:00"), vToday = new Date(),
            vDiff = Math.ceil((vToday.getTime()-v20AprDate.getTime())/(1000 * 3600 * 24))*(1000 * 3600 * 24),
            i;

			var aPurchaseRequisitions = oMockServer.getEntitySetData("PurchaseRequisitions");
			for (i = 0; i < aPurchaseRequisitions.length; i++) {
			    aPurchaseRequisitions[i].CreatedAt = "/Date("+(parseInt(aPurchaseRequisitions[i].CreatedAt.substr(6,13))+vDiff)+")/";
			    aPurchaseRequisitions[i].QuotationDeadline = "/Date("+(parseInt(aPurchaseRequisitions[i].QuotationDeadline.substr(6,13))+vDiff)+")/";
			    aPurchaseRequisitions[i].SelectionDeadline = "/Date("+(parseInt(aPurchaseRequisitions[i].SelectionDeadline.substr(6,13))+vDiff)+")/";
			    aPurchaseRequisitions[i].DeliveryDate = "/Date("+(parseInt(aPurchaseRequisitions[i].DeliveryDate.substr(6,13))+vDiff)+")/";
			}
            oMockServer.setEntitySetData("PurchaseRequisitions", aPurchaseRequisitions);

			var aQuotes = oMockServer.getEntitySetData("Quotes");
			for (i = 0; i < aQuotes.length; i++) {
			    aQuotes[i].CreatedAt = "/Date("+(parseInt(aQuotes[i].CreatedAt.substr(6,13))+vDiff)+")/";
			    aQuotes[i].ExpirationDate = "/Date("+(parseInt(aQuotes[i].ExpirationDate.substr(6,13))+vDiff)+")/";
			    aQuotes[i].DeliveryDate = "/Date("+(parseInt(aQuotes[i].DeliveryDate.substr(6,13))+vDiff)+")/";
			}
            oMockServer.setEntitySetData("Quotes", aQuotes);

			var aAttachments = oMockServer.getEntitySetData("Attachments");
			for (i = 0; i < aAttachments.length; i++) {
			    aAttachments[i].UploadDate = "/Date("+(parseInt(aAttachments[i].UploadDate.substr(6,13))+vDiff)+")/";
			}
            oMockServer.setEntitySetData("Attachments", aAttachments);
            
			var aComments = oMockServer.getEntitySetData("Comments");
			for (i = 0; i < aComments.length; i++) {
			    aComments[i].CreationDate = "/Date("+(parseInt(aComments[i].CreationDate.substr(6,13))+vDiff)+")/";
			}
            oMockServer.setEntitySetData("Comments", aComments);
            // end of dates shift code
            
			jQuery.sap.log.info("Running the app with mock data");
		}
	};
});