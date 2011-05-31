var DBHelper = function (appVersion) {
	console.log('DBHelper.DBHelper() : Initialisation of DBHelper');
	
	this.nullHandleCount = 0;
	this.db = null;
	this.appVersion = appVersion;
	
	this.DATABASE_NAME = "SatellitePlayer";
	
	this.DATABASE_SESSION_TABLE = "session";
	this.DATABASE_ARTIST_TABLE = "artist";
	this.DATABASE_GENRE_TABLE = "genre";
	this.DATABASE_ALBUM_TABLE = "album";
	this.DATABASE_TITLE_TABLE = "title";
	this.DATABASE_VERSION_TABLE = "version";
	this.DATABASE_PREFERENCES_TABLE = "preferences";
	
	/* TABLE FIELDS */
	this.KEY_SESSION_ACCESS_TOKEN = "access_token";
	this.KEY_SESSION_REFRESH_TOKEN = "refresh_token";
	this.KEY_SESSION_HELPER_STATUS = "helper_status";
	this.KEY_SESSION_NICKNAME = "nickname";
	this.KEY_SESSION_SCAN_STATE = "scan_state";
	this.KEY_SESSION_HELPER_VERSION = "helper_version";
	this.KEY_SESSION_ETAG = "etag";
	
	this.KEY_VERSION_DB = "db_version";
	this.KEY_VERSION_APP = "app_version";
	
	/* CREATE SCRIPTS*/
	this.DATABASE_CREATE_SESSION_TABLE = null;
	this.DATABASE_CREATE_VERSION_TABLE = null;
	this.DATABASE_CREATE_PREFERENCES_TABLE = null;
		
	this.DATABASE_VERSION_WEBOS = 3;
	this.DATABASE_VERSION = 1;
	
	this.callBackMethodInit = null;
}

/* Init the database and create the table if don't exists*/
DBHelper.prototype.initDataBase = function (onSuccess) {
	try {
		//Data base will have 1M
		this.db = openDatabase(this.DATABASE_NAME, this.DATABASE_VERSION_WEBOS, 'SatellitePlayer Data Store', 1024000);		
		this.callBackMethodInit = onSuccess;
		
		this.createTables();
	} catch (e)
	{
		console.log('DBHelper.initDataBase : Error during initDataBase : '+e.message);
	}
};

DBHelper.prototype.createTables = function () {
	try {
	
		this.DATABASE_CREATE_SESSION_TABLE = " CREATE TABLE IF NOT EXISTS " + this.DATABASE_SESSION_TABLE
		+ " (" + this.KEY_SESSION_ACCESS_TOKEN + " text "
		+ ", " + this.KEY_SESSION_REFRESH_TOKEN + " text " 
		+ ", " + this.KEY_SESSION_HELPER_STATUS + " text " 
		+ ", " + this.KEY_SESSION_NICKNAME + " text " 
		+ ", " + this.KEY_SESSION_SCAN_STATE + " text " 
		+ ", " + this.KEY_SESSION_HELPER_VERSION + " text " 
		+ ", " + this.KEY_SESSION_ETAG + " text " 
		+ ");";
		
		this.DATABASE_CREATE_VERSION_TABLE = " CREATE TABLE IF NOT EXISTS " + this.DATABASE_VERSION_TABLE
		+ " (" + this.KEY_VERSION_DB + " integer primary key"
		+ ", " + this.KEY_VERSION_APP + " text " 
		+ ");";
		
		this.actionTableDataBase(this.DATABASE_CREATE_VERSION_TABLE, this.DATABASE_VERSION_TABLE);	// Création de la table version si besoin
		this.extractVersionDataBase(this.callBackVersions.bind(this));	// Récupération de la version de la base/appli pour savoir quelles tables créer
			
	} catch (e)
	{
		console.log('DBHelper.createTables : Error during createTables : '+e.message);
	}
};

/* Function for creation of table */
DBHelper.prototype.actionTableDataBase = function (scriptAction, tableName) {
	try {
		this.nullHandleCount = 0;
		this.db.transaction( 
			enyo.bind(this, (function (transaction) { 
				transaction.executeSql(scriptAction, [], 
					function(transaction, result){
						console.log('DBHelper.actionTableDataBase : Action OK on table ' + tableName);
						return true;
					}, 
					function(transaction, error){
						console.log('DBHelper.actionTableDataBase : Error was '+error.message+' (Code '+error.code+')'+' | script : '+scriptAction+' | '+ JSON.stringify(error)); 
						return true;
					});
			}))
		);
	}
	catch (e) {
		console.log('DBHelper.actionTableDataBase : Error during action on table ' + tableName + ' : '+e.message);
	}
};

DBHelper.prototype.extractVersionDataBase = function (onSuccess) {
	// Version 1 : Nothing to do
	var version = null;
	onSuccess(version);
};

DBHelper.prototype.callBackVersions = function(version) {
	try {
		this.insertVersion(version);
		this.actionTableDataBase(this.DATABASE_CREATE_SESSION_TABLE, this.DATABASE_SESSION_TABLE);	// Création de la table version si besoin
	} catch(e) {
		console.log('DBHelper.callBackVersions : Error during the structure creation : ' + e.message);
	}
};

DBHelper.prototype.insertVersion = function (appVersion) {
	this.nullHandleCount = 0;
	var dbVersion = parseInt(this.DATABASE_VERSION);
	var appVersionInsert = this.appVersion;
	if (appVersion != null){
		appVersionInsert = appVersion;
	}
	
	var insertRequest = " INSERT INTO " + this.DATABASE_VERSION_TABLE
		+ " (" + this.KEY_VERSION_DB 
		+ ", " + this.KEY_VERSION_APP  
		+ ") VALUES(?,?);"; 
		
	this.clearVersion();
	this.db.transaction( 
		enyo.bind(this, (function (transaction) { 
				transaction.executeSql(insertRequest
						, [dbVersion, appVersionInsert]
						, function(transaction, result){
							console.log('DBHelper.insertVersion : version created');
							return true;
						}
						, function(transaction, error) { 
							console.log('DBHelper.insertVersion : Error was ' + error.message+' (Code '+error.code+')'); 
							return true;
						}); 
		}))
	); 
};

DBHelper.prototype.clearVersion = function () {
	this.nullHandleCount = 0;
	var deleteRequest = 'DELETE FROM ' + this.DATABASE_VERSION_TABLE +';';	
	
	this.db.transaction( 
		enyo.bind(this, (function (transaction) { 
				transaction.executeSql(deleteRequest
						, []
						,function(transaction, results) {
							console.log('DBHelper.clearVersion : version was removed.');
							return true;
						}
						,function(transaction, error) {
							console.log('DBHelper.clearVersion : Error was ' + error.message+' (Code '+error.code+')'); 
							return true;
						}
					); 
			}))
	);
};