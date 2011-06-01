/* Copyright 2009-2011 Hewlett-Packard Development Company, L.P. All rights reserved. */
enyo.kind({
	name: "SP.Login",
	
	kind: enyo.VFlexBox,
	
	events: { 
		onLoginSucceeded: "",
		onLoginFailed: ""
	},
	
	components: [
		{name: "doLogin", kind: "WebService",
		  url: SatelliteConstants.AG_LOGIN_URL,
		  method: "POST",
		  onSuccess: "gotLogged",
		  onFailure: "gotLoggedFailure"},
		  
		{name: "doState", kind: "WebService",
		  url: SatelliteConstants.AG_STATE_URL,
		  method: "POST",
		  onSuccess: "gotState",
		  onFailure: "gotStateFailure"},
		  
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
		
		this.$.doLogin.call({
			client_id: SatelliteConstants.AG_API_KEY,
			client_secret: SatelliteConstants.AG_API_SECRET,
			grant_type: "password",
			user_email: this.$.username.getValue(), 
			user_password: this.$.password.getValue()});
	},
	
	gotLogged: function (inSender, inResponse, inRequest) { 
		console.log("Login.js - gotLogged - Token : " + JSON.stringify(inResponse));
		
		// Si une erreur est parvenue
		if(inResponse.error) {
			console.log("Login.js - gotLogged - Error : " + inResponse.error);
			this.doLoginFailed();
		} else {
			Session.getSession(inResponse);
			Session.save();
			
			this.$.doState.call({
				client_id: SatelliteConstants.AG_API_KEY,
				access_token: Session.access_token});
			
			//this.doLoginSucceeded(inResponse); 
		}
	},
	
	gotLoggedFailure: function (inSender, inResponse) { 
		console.log("Login.js - gotLoggedFailure - Token : " + inResponse);
		this.doLoginFailed(); 
	},
	
	gotState: function (inSender, inResponse, inRequest) { 
		console.log("Login.js - gotState - Token : " + JSON.stringify(inResponse));
		
		// Si une erreur est parvenue
		if(inResponse.error) {
			console.log("Login.js - gotState - Error : " + inResponse.error);
			this.doLoginFailed();
		} else {
			Session.getState(inResponse);
			Session.save();
			
			this.doLoginSucceeded(inResponse); 
		}
	},
	
	gotStateFailure: function (inSender, inResponse) { 
		console.log("Login.js - gotStateFailure - Token : " + inResponse);
		this.doLoginFailed(); 
	}
});