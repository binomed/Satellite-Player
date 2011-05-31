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
		+ "); GO;";
		
		this.DATABASE_CREATE_VERSION_TABLE = " CREATE TABLE IF NOT EXISTS " + this.DATABASE_VERSION_TABLE
		+ " (" + this.KEY_VERSION_DB + " integer primary key"
		+ ", " + this.KEY_VERSION_APP + " text " 
		+ "); GO;";
		
		this.createTableDataBase(this.DATABASE_CREATE_VERSION_TABLE, this.DATABASE_VERSION_TABLE);
		//this.extractVersionDataBase(this.callBackVersions.bind(this));
			
	} catch (e)
	{
		console.log('DBHelper.createTables : Error during createTables : '+e.message);
	}
};

/* Function for creation of table */
DBHelper.prototype.createTableDataBase = function (scriptCreation, tableName) {
	try {
		this.nullHandleCount = 0;
		this.db.transaction( 
			enyo.bind(this,(function (transaction) { 
				transaction.executeSql(scriptCreation, [], 
					function(transaction, result){
						console.log('DBHelper.createTableDataBase : table created ! '+tableName);
						return true;
					}, 
					function(transaction, result){
						console.log('DBHelper.createTableDataBase : table created ! '+tableName);
						return true;
					});
			}))
		);
	}
	catch (e) {
		console.log('DBHelper.createTableDataBase : Error during create table ' + tableName + ' : '+e.message);
	}
};