/* Copyright 2009-2011 Hewlett-Packard Development Company, L.P. All rights reserved. */
enyo.kind({
	name: "SP.Login",
	kind: enyo.VFlexBox,
	events: { 
		onLoginSucceeded: "",
	},
	components: [
		{name: "doLogin", kind: "WebService",
		  url: SatelliteConstants.AG_LOGIN_URL,
		  method: "POST",
		  onSuccess: "gotLogged",
		  onFailure: "gotLoggedFailure"},
		{kind: "PageHeader", components: [
			{content: "Audiogalaxy Login"}
		]},
		{flex: 1, kind: "Pane", components: [
			{flex: 1, kind: "Scroller", components: [
				{kind: "HtmlContent", name: "results", content: "Connectez-vous !"},
				{kind: "RowGroup", caption: "Username", components: [
					{kind: "Input", name: "username"}
				]},
				{kind: "RowGroup", caption: "Password", components: [
					{kind: "PasswordInput", name: "password"}
				]},
				{kind: "ActivityButton", caption: "Login", onclick: "loginAction"}
			]}
		]},
		{kind: "Toolbar", components: [
		]}
	],
	loginAction: function(inSender) {
		var a = inSender.getActive();
		inSender.setActive(!a);
		console.log("API KEY : " + SatelliteConstants.AG_API_KEY);
		this.$.doLogin.call({
			client_id: SatelliteConstants.AG_API_KEY,
			client_secret: SatelliteConstants.AG_API_SECRET,
			grant_type: "password",
			user_email: this.$.username.getValue(), 
			user_password: this.$.password.getValue()});
	},
	gotLogged: function (inSender, inResponse, inRequest) { 
		console.log("Login.js - gotLogged - Token : " + JSON.stringify(inResponse));
		this.doLoginSucceeded(); 
	},
	gotLoggedFailure: function () { }
});