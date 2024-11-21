sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast"    
],
function (Controller,MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("mycoc.rep.mycocrep.controller.View1", {
        onInit: function () {
            this.onreadData();
        },

        onreadData: function() {
            var oDataModel = this.getOwnerComponent().getModel();
            var oJSONModel = new sap.ui.model.json.JSONModel();
            var oBusyDialog = new sap.m.BusyDialog({
                title: "Loading Data",
                text: "Please wait for Data Loading",

            });
            oBusyDialog.open();
            oDataModel.read("/COCDataSet",{
                success: function(oResponse){
                    oJSONModel.setProperty("/COCData",oResponse.results);
                    this.getView().setModel(oJSONModel,"oCOCJSONModel");
                    oBusyDialog.close();
                }.bind(this),
                error: function(oError){
                    oBusyDialog.close();
                }.bind(this)
            });

        },
        onDeleteRecord: function(oEvent){
            var oContext = oEvent.getSource().getBindingContext("oCOCJSONModel").getObject();
            MessageBox.confirm("You want to delete the Record? Click confirm to continue",{
                title: "Confirm",
                onClose: function(sAction)
                {
                    if(sAction === 'OK'){
                        debugger;
                        this.oDeleteRecord(oContext);
                    }
                }.bind(this),        
                actions: [sap.m.MessageBox.Action.OK,
                sap.m.MessageBox.Action.CANCEL],
                emphasizedAction: sap.m.MessageBox.Action.OK
            });
        },
        oDeleteRecord: function(oRecord){
            var oDataModel = this.getOwnerComponent().getModel();
            var oBusyDialog = new sap.m.BusyDialog({
                title: "Deleting Data",
                text: "Please wait for Data Deletion",
            });
            oBusyDialog.open();   
            oDataModel.remove("/COCDataSet(VBELN='"+ oRecord.VBELN +"')",{
                success: function(oResponse){
                    oBusyDialog.close();
                    this.onreadData();
                }.bind(this),
                error: function(oError){
                    oBusyDialog.close();
                }.bind(this)
            });                    
        },
        onUpdateRecord: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("oCOCJSONModel").getObject();
            this.getView().setModel(new sap.ui.model.json.JSONModel({
                "oPayload": oContext
            }),"oCOCPayloadModel");
            if (!this.oDialog) {
                this.loadFragment({
                    name: "mycoc.rep.mycocrep.fragments.UpdateDialog"
                }).then(function (oDialog) {
                    this.oDialog = oDialog;
                    this.oDialog.open();
                }.bind(this));
            } else {
                this.oDialog.open();
            }   
        },
        onSaveRecord: function (oEvent) {
            debugger;
            this.oDialog.close();
            var oContext = this.getView().getModel('oCOCPayloadModel').getProperty("/oPayload");
            var oDataModel = this.getOwnerComponent().getModel();
            var oBusyDialog = new sap.m.BusyDialog({
                title: "Updating Data",
                text: "Please wait for Data Updation",
            });
            oBusyDialog.open();                 
            oDataModel.update("/COCDataSet(VBELN='"+ oContext.VBELN +"')", oContext, {
                success: function(oResponse){
                    oBusyDialog.close();
                    var msg = 'Data Update Successfully';
                    MessageToast.show(msg);
                    this.onreadData();
                }.bind(this),
                error: function(oError){
                    oBusyDialog.close();
                    var msg = 'Data Update failed';
                    MessageToast.show(msg);                        
                }.bind(this)
            });  

        },
        onCancelRecord: function (oRecord) {
            this.oDialog.close();
           debugger; 
        },
        onListItemPressed : function(oEvent){
			var oItem, oCtx;

			oItem = oEvent.getSource();
			oCtx = oItem.getBindingContext('oCOCJSONModel');
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			oRouter.navTo("COCDetails",{
				VBELN : oCtx.getProperty("VBELN")
			});

		}

    });
});
