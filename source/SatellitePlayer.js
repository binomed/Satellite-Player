/* Copyright 2009-2011 Hewlett-Packard Development Company, L.P. All rights reserved. */
enyo.kind({
	name: "SatellitePlayer",
	kind: enyo.VFlexBox,
	components: [
		{name: "pane", kind: "Pane", flex: 1, onSelectView: "viewSelected", components: [
			{name: "login", kind:"SP.Login", onSelect: "loginSelected", onLoginSucceeded: "loginSucceeded"},
			{name: "player", kind:"SP.Player", onSelect: "playerSelected"}
		]}
	],
	create: function() {
		this.inherited(arguments);
		console.log("SatellitePlayer.js : create : app version " + enyo.fetchAppInfo().version);
		DBhelper.initDataBase(this.callBackInitDB.bind(this));
	},
	loginSucceeded: function(response) {
		this.$.pane.selectViewByName("player");
		this.$.player.updateHeader();
	},
	callBackInitDB: function() {
		console.log("SatellitePlayer.js : callBackInitDB : Init OK");
	}
});