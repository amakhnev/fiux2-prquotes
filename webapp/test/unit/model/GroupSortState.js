sap.ui.define([
		"edu/opensap/fiux2/am/model/GroupSortState",
		"sap/ui/model/json/JSONModel",
		"sap/ui/thirdparty/sinon",
		"sap/ui/thirdparty/sinon-qunit"
	], function (GroupSortState, JSONModel) {
	"use strict";

	QUnit.module("GroupSortState - grouping and sorting", {
		beforeEach: function () {
			this.oModel = new JSONModel({});
			// System under test
			this.oGroupSortState = new GroupSortState(this.oModel, function() {});
		}
	});

	QUnit.test("Should always return a sorter when sorting", function (assert) {
		// Act + Assert
		assert.strictEqual(this.oGroupSortState.sort("Quantity").length, 1, "The sorting by Quantity returned a sorter");
		assert.strictEqual(this.oGroupSortState.sort("ProductDescription").length, 1, "The sorting by ProductDescription returned a sorter");
	});

	QUnit.test("Should return a grouper when grouping", function (assert) {
		// Act + Assert
		assert.strictEqual(this.oGroupSortState.group("Quantity").length, 1, "The group by Quantity returned a sorter");
		assert.strictEqual(this.oGroupSortState.group("None").length, 0, "The sorting by None returned no sorter");
	});


	QUnit.test("Should set the sorting to Quantity if the user groupes by Quantity", function (assert) {
		// Act + Assert
		this.oGroupSortState.group("Quantity");
		assert.strictEqual(this.oModel.getProperty("/sortBy"), "Quantity", "The sorting is the same as the grouping");
	});

	QUnit.test("Should set the grouping to None if the user sorts by ProductDescription and there was a grouping before", function (assert) {
		// Arrange
		this.oModel.setProperty("/groupBy", "Quantity");

		this.oGroupSortState.sort("ProductDescription");

		// Assert
		assert.strictEqual(this.oModel.getProperty("/groupBy"), "None", "The grouping got reset");
	});
});