sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/ui/core/Fragment"
], function (Controller, JSONModel, MessageToast, Sorter, Filter, FilterOperator, FilterType, Fragment) {
	"use strict";

	return Controller.extend("com.table.ZTEST2.controller.View1", {

		onInit: function () {

			this.oModel = this.getOwnerComponent().getModel();
			this.readData();

		},

		onFilterPosts: function (oEvent) {

			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("Matnr", FilterOperator.Contains, sQuery));
			}

			// filter binding
			var oTable = this.byId("task1_table");
			var oBinding = oTable.getBinding("items");
			oBinding.filter(aFilter);
		},

		_getText: function (sTextId, aArgs) {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sTextId, aArgs);

		},

		onSort: function () {
			var oView = this.getView(),
				aStates = [undefined, "asc", "desc"],
				aStateTextIds = ["sortNone", "sortAscending", "sortDescending"],
				sMessage,
				iOrder = oView.getModel("localModel").getProperty("/Order");

			iOrder = (iOrder + 1) % aStates.length;
			var sOrder = aStates[iOrder];

			oView.getModel("localModel").setProperty("/Order", iOrder);
			oView.byId("task1_table").getBinding("items").sort(sOrder && new Sorter("Matnr", sOrder === "desc"));

			sMessage = this._getText("sortMessage", [this._getText(aStateTextIds[iOrder])]);
			MessageToast.show(sMessage);
		},

		onOpenDialog: function (oEvent) {
			this._showObject(oEvent.getSource());
			if (!this.pDialog) {
				this.pDialog = this.loadFragment({
					name: "com.table.ZTEST2.view.Dialog"
				});
			}
			this.pDialog.then(function (oDialog) {
				oDialog.open();
			});
		},
		onCloseDialog: function () {
			this.byId("helloDialog").close();
		},
		
		_showObject: function(oItem){
			objectId: oItem.getBindingContext().getProperty("Matnr");
			},
		
	

		readData: function () {
			this.localModel = new JSONModel({
				//busy: true,
				Order: 0

			});
			this.oModel.read("/MaterialSet", {
				success: function (oReceivedData) {
					MessageToast.show("Congratulations, Task Complete!");
					this.localModel.setProperty("/Material", oReceivedData.results);

					var count = oReceivedData.results.length;
					this.getView().byId("count").setText("Material" + "(" + count + ")");

					this.getOwnerComponent().setModel(this.localModel, "localModel");
				}.bind(this),
				error: function (oNotReceived) {
					MessageToast.show("Firse Try Kar");
				}
			});
		}
	});
});