// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

// Load options from local storage
// Return default values if none exist
function loadOptions() {
	var options;
	if (localStorage.options == null) {
		localStorage.options = '{}';
	}
	options = JSON.parse(localStorage.options);
	
	options.extensionEnabled = 	options.hasOwnProperty('extensionEnabled') ? options.extensionEnabled : true;
	options.pageActionEnabled = options.hasOwnProperty('pageActionEnabled') ? options.pageActionEnabled : true;
	options.showCaptions = 		options.hasOwnProperty('showCaptions') ? options.showCaptions : true;
	options.showHighRes = 		options.hasOwnProperty('showHighRes') ? options.showHighRes : false;
	options.addToHistory = 		options.hasOwnProperty('addToHistory') ? options.addToHistory : false;
	options.alwaysPreload = 	options.hasOwnProperty('alwaysPreload') ? options.alwaysPreload : false;
	options.displayDelay = 		options.hasOwnProperty('displayDelay') ? options.displayDelay : 100;
	options.fadeDuration = 		options.hasOwnProperty('fadeDuration') ? options.fadeDuration : 200;
	options.excludedSites = 	options.hasOwnProperty('excludedSites') ? options.excludedSites : [];
	options.whiteListMode = 	options.hasOwnProperty('whiteListMode') ? options.whiteListMode : false;
	options.picturesOpacity = 	options.hasOwnProperty('picturesOpacity') ? options.picturesOpacity : 1;
	
	// Action keys
	options.actionKey = 		options.hasOwnProperty('actionKey') ? options.actionKey : 0;
	options.fullZoomKey = 		options.hasOwnProperty('fullZoomKey') ? options.fullZoomKey : 0;
	
	localStorage.options = JSON.stringify(options);
	
	return options;
}

// Send options to all tabs and extension pages
function sendOptions(options) {
	var request = {action: 'optionsChanged', 'options': options};
	
	// Send options to all tabs
	chrome.windows.getAll(null, function (windows) {
		for (var i=0; i<windows.length; i++) {
			chrome.tabs.getAllInWindow(windows[i].id, function(tabs) {
				for (var j=0; j<tabs.length; j++) {
					chrome.tabs.sendRequest(tabs[j].id, request);
				}
			});
		}
	});
	
	// Send options to other extension pages
	chrome.extension.sendRequest(request);
}

// Return true is the url is part of an excluded site
function isExcludedSite(url) {
	var excluded = !options.whiteListMode;
	var siteAddress = url.substr(url.indexOf('://') + 3);
	if (siteAddress.substr(0, 4) == 'www.') {
		siteAddress = siteAddress.substr(4);
	}
	for (var i = 0; i < options.excludedSites.length; i++) {
		var es = options.excludedSites[i];
		if (es.substr(0, 4) == 'www.') {
			es = es.substr(4);
		}
		if (es && es.length <= siteAddress.length) {
			if (siteAddress.substr(0, es.length) == es) {
				return excluded;
			}
		}
	}
	return !excluded;
}

// Return true if the version of Chrome is superior or equal to minVersion
function hasMinChromeVersion(minVersion) {
	var matches = navigator.appVersion.match(/Chrome\/([^\s]+)/);
	if (!matches || matches.length < 2) { return; }
	var currentVersion = matches[1];
	var aCV = currentVersion.split('.'), aMV = minVersion.split('.');
	for (var i=0; i<aMV.length; i++) {
		if (parseInt(aCV[i]) < parseInt(aMV[i])) {
			return false;
		} else if (parseInt(aCV[i]) > parseInt(aMV[i])) {
			return true;
		}
	}
	return true;
}