jQuery.sap.require("ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.util.Conversions");
sap.ui.controller("ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S3_headerCustom", {
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S3_headerCustom
* Added By Sandip Agarwalla 9/16/2014
* Over-Riding the SetHeaderFooterOptions Method of the Parent Controller<S3_header.Contoller.js>. We need to hide Forward Button
*/
	onInit: function() {
		var that = this;		
		//subscribe to the Events from S2 Custom View - On Hide/Show Approval Buttons. The Event Handler will read the Button ID	
		  var c = sap.ui.core.Component.getOwnerIdFor(this.oView),
		  C = sap.ui.component(c);
		  C.oEventBus.subscribe("zPrApp","showHideApprovalButtons", that._handleApprovalButtonsVisibility, that);	
		  
		  this.oRouter
			.attachRouteMatched(
					function(e) {
						if (e.getParameter("name") === "headerDetail") {
							var d = e.getParameter("arguments").contextPath+ "/HeaderDetails";
							d = d.replace("WorkflowTaskCollection","/WorkflowTaskCollection");
							this.getView().bindElement(
											d,
											{
												expand : 'HeaderItemDetails,Notes,Attachments,ZApproverHistory,ZHeaderDetailExt'
											});
							if (this.oView.byId("tabBar").getSelectedKey() !== "Info") {
								this.oView.byId("tabBar").setSelectedKey("Info")
							}
						}
					}, this);							  
		  		
					  // Accept & Footer Buttons					
					  this.oHeaderFooterOptions = {
					   oPositiveAction: {						
					    sI18nBtnTxt: that.resourceBundle.getText("XBUT_APPROVE"),
					    //sI18nBtnTxt : "Appr",   
					    sId :"btn_approve",
					    onBtnPressed: jQuery.proxy(that.handleApprove, that)
					   },

					   oNegativeAction: {					
					   sI18nBtnTxt: that.resourceBundle.getText("XBUT_REJECT"),
					   //sI18nBtnTxt : "Rej",   
						sId :"btn_reject",
					    onBtnPressed: jQuery.proxy(that.handleReject, that)
					   },
					   
					   onBack : jQuery.proxy(function() {
							var d = sap.ui.core.routing.History
									.getInstance().getDirection(
											this.oRouter.getURL("master"));
							if (d === "Backwards") {
								window.history.go(-1);
							} else {
								this.oRouter.navTo("master");
							}
						}, this)
					  };

					  this.setHeaderFooterOptions(this.oHeaderFooterOptions);
	},
	
	_handleApprovalButtonsVisibility: function(channelId, eventId, data){		
			//alert(eventId);
			if(data.id==='ZOpenActive' || data.id==='Z30DayHistory'){
				//Hide the Reject, Approve Buttons
				this._oControlStore.oButtonListHelper.mButtons['btn_approve'].setVisible(false);					
				if(this._oControlStore.oButtonListHelper.bHasOverflow) {  //true on iPhones. The Reject Button shows up in Overflow
					this._oControlStore.oButtonListHelper.oOverflowList.mButtons['btn_reject'].setVisible(false);
				}else{
					this._oControlStore.oButtonListHelper.mButtons['btn_reject'].setVisible(false);
				}	
				
			}else if(data.id==='ZMyApprovals'){
				//show the Approve, Reject Buttons
				this._oControlStore.oButtonListHelper.mButtons['btn_approve'].setVisible(true);				
				if(this._oControlStore.oButtonListHelper.bHasOverflow) {  //true on iPhones
					this._oControlStore.oButtonListHelper.oOverflowList.mButtons['btn_reject'].setVisible(true);
				}else{
					this._oControlStore.oButtonListHelper.mButtons['btn_reject'].setVisible(true);
				}	

			}	
	},
	
	//
	launchEmployeeInfo: function(e){
		var that=this;
		//alert('link clicked');
		//that.openEmployeeLaunch(e, "CreatedByID");
		var c = e.getSource();
		var r = "ZHeaderDetailExt/ZRequestor";
		var t = this.resourceBundle.getText("BusinessCard.employee");
		var o = function(d) {
			var a = d.results[0],
			E = {
				title : t,
				name : a.FullName,
				imgurl : ui.s2p.mm.requisition.approve.util.Conversions
						.businessCardImg(a.Mime_Type,
								a.__metadata.media_src),
				department : a.Department,
				contactmobile : a.MobilePhone,
				contactphone : a.WorkPhone,
				contactemail : a.EMail,
				companyname : a.CompanyName,
				companyaddress : a.AddressString
			}, b = new sap.ca.ui.quickoverview.EmployeeLaunch(E);
			b.openBy(c);
		};
		var O = e.getSource().getBindingContext().getProperty(
				"SAP__Origin");
		var u = e.getSource().getBindingContext()
				.getProperty(r);
		var f = "$filter="
				+ encodeURIComponent("UserID eq '" + u
						+ "' and SAP__Origin eq '" + O + "'");
		this.oDataModel.read("UserDetailsCollection", null,
				[ f ], true, jQuery.proxy(o, this), jQuery
						.proxy(this.onRequestFailed, this));
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S3_headerCustom
*/
//	onBeforeRendering: function() {
//		var c2 = sap.ui.core.Component.getOwnerIdFor(this.getView());
//		  var localEventBus2 = sap.ui.component(c2).getEventBus();					  
//	  localEventBus2.subscribe("zPrApp","showHideApprovalButtons", this.handleApprovalButtonsVisibility,this);		
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S3_headerCustom
*/
	onAfterRendering: function() {

	
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S3_headerCustom
*/
//	onExit: function() {
//
//	},
 
/**
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S3_headerCustom
*/
//	navToItemDetails : function(e) {
//
//	},
 
/**
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S3_headerCustom
*/
//	handleApprove : function() {
//
//	},
 
/**
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S3_headerCustom
*/
//	handleReject : function() {
//
//	},
 
/**
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S3_headerCustom
*/
//	handleApproveRejectExecute : function(r, a, d) {
//
//	},
 
/**
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S3_headerCustom
*/
//	_handleApproveRejectSuccess : function(s) {
//
//	},
 
/**
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S3_headerCustom
*/
//	_handleApproveRejectForwardFail : function(e) {
//
//	},
 
/**
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S3_headerCustom
*/
//	handleForward : function(e) {
//
//	},
 
/**
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S3_headerCustom
*/
//	onNamePress : function(e) {
//
//	},
 
/**
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S3_headerCustom
*/
//	onForwardedPress : function(e) {
//
//	},
 
/**
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S3_headerCustom
*/
//	onSubstitutingPress : function(e) {
//
//	},
 
/**
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S3_headerCustom
*/
//	onNoteSenderPress : function(e) {
//
//	},
 
/**
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S3_headerCustom
*/
//	openEmployeeLaunch : function(e, r) {
//
//	},
 
/**
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S3_headerCustom
*/
//	onSupplierPress : function(e) {
//
//	},
 
/**
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S3_headerCustom
*/
//	onCompanyLaunch : function(e, r) {
//
//	},
 
/**
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S3_headerCustom
*/
//	handleServiceLineItemPress : function(e) {
//
//	},
 
/**
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S3_headerCustom
*/
//	handleLimitLineItemPress : function(e) {
//
//	},
 
/**
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S3_headerCustom
*/
//	onAttachment : function(e) {
//
//	},
 
/**
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S3_headerCustom
*/
//	handleNavBack : function() {
//
//	},
 
/**
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S3_headerCustom
*/
//	onRequestFailed : function(e) {
//
//	},
 
/**
* @memberOf ui.s2p.mm.requisition.approve.zmm_pr_apv_ext.view.S3_headerCustom
*/
//	isMainScreen : function() {
//
//	}
});