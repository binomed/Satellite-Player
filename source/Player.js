/* Copyright 2009-2011 Hewlett-Packard Development Company, L.P. All rights reserved. */
enyo.kind({
	name: "SP.Player",
	kind: enyo.VFlexBox,
	resources: null,
	components: [
		{name: "getResources", kind: "WebService",
		  url: SatelliteConstants.AG_RESOURCE_URL,
		  method: "GET",
		  onSuccess: "gotResources",
		  onFailure: "gotResourcesFailure"},
		{name: "slidingPane", kind: "SlidingPane", flex: 1, components: [
			{name: "left", width: "320px", kind:"SlidingView", components: [
					{kind: "Header", name: "header1", content:"Panel 1"},
					// Scroller
					{kind: "Scroller", flex: 1, components: [
						// FadeScroller permet de montrer qu'il y a d'autres éléments
						{kind: "FadeScroller", flex: 1, components: [
							// Ici les éléments de la liste
							{kind: "TypePanel", className: "enyo-bg"}
						]}
					]},
					{kind: "Toolbar", components: [
						{kind: "GrabButton"}
					]}
			]},
			{name: "middle", kind:"SlidingView", peekWidth: 50, components: [
					{kind: "Header", name: "header2", content:"Sélectionnez une ressource"},
					{kind: "Scroller", flex: 1, components: [
						{kind: "FadeScroller", flex: 1, components: [
							//Insert your components here
							{kind: "VirtualList", name: "resourceList", onSetupRow: "setupRow", components: [
								{kind: "Item", layoutKind: "HFlexLayout", onclick: "selectResource", components: [
									{name: "caption", flex: 1},
									{name: "description", className: "enyo-item-secondary"}
								]}
							]}
						]}
					]},
					{kind: "Toolbar", components: [
						{kind: "GrabButton"}
					]}
			]}
		]}
	],
	
	create: function() {
		this.inherited(arguments);
	},
	
	updateHeader: function() {
		this.$.header1.setContent(Session.nickname);
	},
		
	getResources: function(type) {
		console.log("Player.js - getResources - type : " + type);
		this.resources = new DP.Resource(type);
		
		this.$.getResources.call({
			client_id: SatelliteConstants.AG_API_KEY,
			access_token: Session.access_token,
			img_size: "medium",
			offset: 0, 
			"type": type});
	},
	
	gotResources: function (inSender, inResponse, inRequest) { 
		console.log("Player.js - gotResources - Token : " + JSON.stringify(inResponse));
		
		// Si une erreur est parvenue
		if(inResponse.error) {
			console.log("Player.js - gotResources - Error : " + inResponse.error);
		} else {
			this.resources.getResource(inResponse);
			this.$.header2.setContent(this.resources.type);
			this.$.resourceList.refresh();
			//this.resources.save();
		}
	},
	
	gotResourcesFailure: function (inSender, inResponse) { 
		console.log("Player.js - gotResourcesFailure - Token : " + inResponse);
	},
	
	setupRow: function (inSender, inIndex) {
		var row = this.resources.resources[inIndex];
		
		if(row) {
			this.$.caption.setContent(row.title);
			this.$.description.setContent(row.subtitle);
			return true;
		}
	},
	
	selectResource: function (inSender, inEvent) {
		console.log("Player.js - selectResource - " + inEvent.rowIndex);
	}
});