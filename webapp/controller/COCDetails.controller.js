sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("mycoc.rep.mycocrep.controller.COCDetails", {
        onInit: function () {
            debugger;
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("COCDetails").attachMatched(this._onRouteMatched, this);
            debugger;
            oRouter.attachRouteMatched(function (oEvent){
				var sRouteName, oArgs, oView;
                debugger;
				sRouteName = oEvent.getParameter('name');
				if (sRouteName === "COCDetails"){
					this._onRouteMatched(oEvent);
				}
			}, this);

        },
        _onRouteMatched : function (oEvent) {
            var oArgs, oView;

			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();

            oView.bindElement({
                path : "/COCDataSet('" + oArgs.VBELN + "')",
                events: {
                    change: this._onBindingChange.bind(this),
					dataRequested: function (oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function (oEvent) {
						oView.setBusy(false);
					}
                }
            })
        },

		_onBindingChange : function (oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
                debugger;
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.getTargets().display("TargetView2");
			}
		}        

	});

});
