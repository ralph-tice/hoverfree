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
	
	options.extensionEnabled = options.hasOwnProperty('extensionEnabled') ? options.extensionEnabled : true;
	options.pageActionEnabled = options.hasOwnProperty('pageActionEnabled') ? options.pageActionEnabled : true;
	options.showCaptions = options.hasOwnProperty('showCaptions') ? options.showCaptions : true;
	options.addToHistory = options.hasOwnProperty('addToHistory') ? options.addToHistory : false;
	options.displayDelay = options.hasOwnProperty('displayDelay') ? options.displayDelay : 200;
	options.fadeDuration = options.hasOwnProperty('fadeDuration') ? options.fadeDuration : 200;
	
	localStorage.options = JSON.stringify(options);
	return options;
}

// Send options to all tabs and extension pages
function sendOptions(options) {
	var request = {action: 'optionsChanged', 'options': options};
	
	// Send options to all tabs
	chrome.windows.getAll(null, function (windows) {
		for (i in windows) {
			chrome.tabs.getAllInWindow(windows[i].id, function(tabs) {
				for (j in tabs) {
					chrome.tabs.sendRequest(tabs[j].id, request);
				}
			});
		}
	});
	
	// Send options to other extension pages
	chrome.extension.sendRequest(request);
}
			