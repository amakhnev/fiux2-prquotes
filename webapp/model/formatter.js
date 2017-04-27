sap.ui.define([], function() {
	"use strict";

	return {
		/**
		 * Rounds the currency value to 2 digits
		 *
		 * @public
		 * @param {string} sValue value to be formatted
		 * @returns {string} formatted currency value with 2 digits
		 */
		currencyValue: function(sValue) {
			if (!sValue) {
				return "";
			}

			return parseFloat(sValue).toFixed(2);
		},

		prstatus: function(sDeliveryDate) {

			var today = new Date();
			var today30 = new Date();
			today30.setDate(today.getDate() + 30);
			var today60 = new Date();
			today60.setDate(today.getDate() + 60);

			if (sDeliveryDate > today60) {
				return "Success";
			} else if ((sDeliveryDate < today60) && (sDeliveryDate >= today30)) {
				return "Warning";
			} else if (sDeliveryDate < today30) {
				return "Error";
			} else {
				return "None";
			}
		},

		quotestatus: function(sStatus) {

			if (sStatus === "Accepted") {
				return "Success";
			} else if (sStatus === "Rejected") {
				return "Error";
			} else {
				return "None";
			}
		},

		dateValue: function(sValue) {
			if (!sValue) {
				return "";
			}
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "YYYY/MM/dd"
			});
			return dateFormat.format(sValue);
		},

		dateTimeValue: function(sValue) {
			if (!sValue) {
				return "";
			}
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "YYYY/MM/dd HH:mm"
			});
			return dateFormat.format(sValue);
		},

		dateForCompare: function(sValue) {
			if (!sValue) {
				return "";
			}
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "YYYYMMdd"
			});
			return dateFormat.format(sValue);
		},

		objJson: function(sValue) {
			if (!sValue) {
				return "no Object!";
			}

			return JSON.stringify(sValue);
		},

		divide: function(sValue1, sValue2) {
			if (!sValue1) {
				return "";
			}
			if (!sValue2) {
				return "";
			}
			var result = parseFloat(sValue1) / parseFloat(sValue2);
			return result.toFixed(2);
		},

		multiply: function(sValue1, sValue2) {
			if (!sValue1) {
				return "";
			}
			if (!sValue2) {
				return "";
			}
			var result = parseFloat(sValue1) * parseFloat(sValue2);
			return result.toFixed(2);
		},

		getAttachmentIcon: function(sMimeType) {
			if (sMimeType === "application/vnd.ms-excel") {
				return "sap-icon://excel-attachment";
			} else if (sMimeType === "application/pdf") {
				return "sap-icon://pdf-attachment";
			} else {
				return "sap-icon://attachment";
			}

		}

	};

});