
sap.ui.controller("ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S2Custom", /**
 * @author SAGARWA2
 *
 */
{

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S2Custom
*/
//	onInit: function() {
//	//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S2Custom
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S2Custom
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S2Custom
*/
//	onExit: function() {
//
//	},
 
/**
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S2Custom* 
*/
	getHeaderFooterOptions : function() {
		 var that = this;
		return {
			sI18NMasterTitle : "view.Master.title",
			sI18NSearchFieldPlaceholder: "Search for a requisition...",		
			oFilterOptions:{
				sId:"openBtn2",			
				sI18nBtnTxt: 'Filter',
				onFilterPressed: jQuery.proxy(this._handleOptions,that)
			},
			onBack: function(){
				window.history.go(-1);
			}
		};
	},
	
	/**
	* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S2Custom	* 
	* Method to Open Action Sheet for Task Filter Options. filters are defined in XML Fragment
	*/	
	
	_handleOptions: function(oEvent){
		var oButton = oEvent.getSource();
		 if (!this._actionSheet) {
		      this._actionSheet = sap.ui.xmlfragment(
		        "ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.TaskFilterOptions",
		        this
		      );
		      this.getView().addDependent(this._actionSheet);
		    }		 
		    this._actionSheet.openBy(oButton);
	},
	
	/**
	* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S2Custom	* 
	* Method to handle Task Filter Types
	*/	
	
	_selectFilterOption: function(oEvent){
		var sButtonId = oEvent.getSource().getId();
		var sButtonText = oEvent.getSource().getText();
		var that = this;
		var aFilters = [];	
		
		oListBindings = this.getList().getBinding('items');
		this.byId("listInfoToolbarLabel").setText(sButtonText);
		
		//Hide the Approve & Reject Buttons if its not My Approval.		
		 
		//set the filter based on the id
		var oFilter = new sap.ui.model.Filter(sButtonId,"EQ","X");
		aFilters.push(oFilter);
		oListBindings.filter(aFilters);
		
		sap.ui.controller("ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S3_headerCustom");
		
		//Get the event bus of the core and publish event with the Button ID...	
		var c = sap.ui.core.Component.getOwnerIdFor(this.getView()),
		C = sap.ui.component(c);
		C.oEventBus.publish("zPrApp","showHideApprovalButtons",{id:sButtonId});		
		
		// Once the data filtering is done and received by the client, select the first item only if the client is not a Phone
		oListBindings.attachDataReceived(function(oEvent){
			//that.registerMasterListBind();
		

			//sap.ui.controller("ui.s2p.mm.requisition.approve.view.S3_header");
		
			
			
			if (that.getList().getItems().length > 0) {						
				if(!sap.ui.Device.system.phone){
			    	 that.selectFirstItem();
				}
			}else{ //display no items found view if no Items while filtering and the client is not a phone
				 if(!sap.ui.Device.system.phone){
			    	 that.showEmptyView("DETAIL_TITLE", "NO_ITEMS_AVAILABLE");
			    	 that.oRouter.navTo("master");		
				 }
			}
		});			
		

	},
});