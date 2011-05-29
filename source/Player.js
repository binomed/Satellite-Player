/* Copyright 2009-2011 Hewlett-Packard Development Company, L.P. All rights reserved. */
enyo.kind({
	name: "SP.Player",
	kind: enyo.VFlexBox,
	components: [
		{name: "slidingPane", kind: "SlidingPane", flex: 1, components: [
			{name: "left", width: "320px", kind:"SlidingView", components: [
					{kind: "Header", content:"Panel 1"},
					// Scroller
					{kind: "Scroller", flex: 1, components: [
						// FadeScroller permet de montrer qu'il y a d'autres éléments
						{kind: "FadeScroller", flex: 1, components: [
							// Ici les éléments de la liste
							{name: "actionlist", kind: "VirtualRepeater", onSetupRow: "getActionListItem",
								components: [
									{kind: "SwipeableItem", layoutKind: "VFlexLayout", components: [
										{name: "description"}
									]}
								]
							}
						]}
					]},
					{kind: "Toolbar", components: [
						{kind: "GrabButton"}
					]}
			]},
			{name: "middle", width: "320px", kind:"SlidingView", peekWidth: 50, components: [
					{kind: "Header", content:"Panel 2"},
					{kind: "Scroller", flex: 1, components: [
						//Insert your components here
					]},
					{kind: "Toolbar", components: [
						{kind: "GrabButton"}
					]}
			]},
			{name: "right", kind:"SlidingView", flex: 1, components: [
					{kind: "Header", content:"Panel 3"},
					{kind: "Scroller", flex: 1, components: [
						//Insert your components here
					]},
					{kind: "Toolbar", components: [
						{kind: "GrabButton"}
					]}
			]}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.applyActionListChanges();
	},
	applyActionListChanges: function() {
		this.actions = ["Playlists", "Artists", "Albums"];
		this.$.actionlist.render();
	},
	getActionListItem: function(inSender, inIndex) {
		var r = this.actions[inIndex];
		if (r) {
			this.$.description.setContent(r);
			return true;
		}
	}
});