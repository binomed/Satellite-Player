enyo.kind({
	name: "TypePanel",
	kind: enyo.VFlexBox,
	flex: 1, 
	components: [
		{kind: "FadeScroller", flex: 1, components: [
			{defaultKind: "ViewItem", components: [
				{
					className: "enyo-first", 
					type: "playlists", 
					title: "Playlists",
					description: "Cherchez vos playlists"
				},
				{
					className: "enyo-first", 
					type: "artists", 
					title: "Artistes",
					description: "Retrouvez vos titres par artiste"
				},
				{
					className: "enyo-first", 
					type: "albums", 
					title: "Albums",
					description: "Parcourez la liste des albums"
				},
				{
					className: "enyo-first", 
					type: "genres", 
					title: "Genres",
					description: "Un genre de musique en particulier ?"
				}				
			]}
		]}
	]
});
