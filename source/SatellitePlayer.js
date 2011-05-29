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
	loginSucceeded: function() {
		this.$.pane.selectViewByName("player");
	}
});