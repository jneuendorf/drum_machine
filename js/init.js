var getCompletePath = function(kitName, instrumentPath)	{
	var getPathFromKitName = function(name)	{
		return name.replace(" ", "_").toLowerCase();
	};

	return "kits/" + getPathFromKitName(kitName) + "/" + instrumentPath;
};

$(document).ready(function()	{
	var makeInstruments = function(drumkits)	{
		var category, instrumentDiv, instrumentName, instrumentPath, drumkitDiv, file, kitFiles, kitName, res;

		res = $("<div class='drumkits' />");
		for(kitName in drumkits)	{
			kitFiles = drumkits[kitName];
			drumkitDiv = $("<div class='drumkit' />");
			for(instrumentName in kitFiles)	{
				instrumentPath = kitFiles[instrumentName];
				instrumentDiv = $("<div class='instrument' />");
				instrumentDiv.text(instrumentName)
				drumkitDiv.append(instrumentDiv);

				// modify drumkits object
				kitFiles[instrumentName] = new App.Instrument(instrumentName, kitName, getCompletePath(kitName, instrumentPath), 80);
			}

			res.append(drumkitDiv);
		}

		return drumkits;
	};


	soundManager.setup({
		url:	"../swf/",
		onready: function()	{
			var dm;

			console.log("soundmanager is ready");

			dm = new App.DrumMachine($(document.body), makeInstruments(App.drumkits), [
				App.drumkits.Rock["Hihat Default"],
				App.drumkits.Rock["Snare Default"],
				App.drumkits.Rock["Bass Kick Default"],
				null
			]);

			dm._popup.find(".text").val('{"instruments":[{"name":"Bass Kick Default","kitName":"Rock","volume":80},{"name":"Snare Default","kitName":"Rock","volume":80},{"name":"Hihat Default","kitName":"Rock","volume":80}],"measures":[{"beats":4,"bpm":120,"data":[[1,0,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,0,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]},{"beats":3,"bpm":120,"data":[[1,0,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,0,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]}]}');
			dm["import"]();

			dm.draw();
		}
	});

});

