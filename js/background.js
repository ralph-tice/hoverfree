// Copyright (c) 2013 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

// True if the current version of the extension has something to show in an update notification
var hasReleaseNotes = true;

var options, viewWindow = null;

// Performs an ajax request
function ajaxRequest(request, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                callback(xhr.responseText);
            } else {
                callback(null);
            }
        }
    };
    xhr.open(request.method, request.url, true);
    for (var i in request.headers) {
        xhr.setRequestHeader(request.headers[i].header, request.headers[i].value);
    }
    xhr.send(request.data);
}

function onRequest(request, sender, callback) {
    switch (request.action) {
        case 'ajaxGet':
            ajaxRequest({url:request.url, method:'GET'}, callback);
            break;
        case 'ajaxRequest':
            ajaxRequest(request, callback);
            break;
        case 'showPageAction':
            showPageAction(sender.tab);
            callback();
            break;
        case 'addUrlToHistory':
            chrome.history.addUrl({url:request.url});
            break;
        case 'getOptions':
            callback(options);
            break;
        case 'setOption':
            options[request.name] = request.value;
            localStorage.options = JSON.stringify(options);
            sendOptions(request.options);
            break;
        case 'optionsChanged':
            options = request.options;
            break;
        case 'saveOptions':
            localStorage.options = JSON.stringify(request.options);
            sendOptions(request.options);
            break;
        case 'setItem':
            localStorage.setItem(request.id, request.data);
            break;
        case 'getItem':
            callback(localStorage.getItem(request.id));
            break;
        case 'removeItem':
            localStorage.removeItem(request.id);
            break;
        case 'openViewWindow':
            chrome.windows.create(request.createData, function (window) {
                chrome.tabs.executeScript(window.tabs[0].id, {file:'js/viewWindow.js'});
            });
            break;
        case 'openViewTab':
            chrome.tabs.getSelected(null, function (currentTab) {
                request.createData.index = currentTab.index;
                if (!request.createData.active)
                    request.createData.index++;
                chrome.tabs.create(request.createData, function (tab) {
                    chrome.tabs.executeScript(tab.id, {file:'js/viewTab.js'});
                });
            });
            break;
    }
}

function showPageAction(tab) {
    if (!tab) {
        return;
    }
    if (!options.extensionEnabled || isExcludedSite(tab.url)) {
        chrome.pageAction.setIcon({tabId:tab.id, path:'../images/icon19d.png'});
    } else {
        chrome.pageAction.setIcon({tabId:tab.id, path:'../images/icon19.png'});
    }
    chrome.pageAction.show(tab.id);
}

// Checks if the extension has been updated.
// Displays a notification if necessary.
function checkUpdate() {
    var currVersion = chrome.app.getDetails().version,
        prevVersion = localStorage.hzVersion;
    if (hasReleaseNotes && options.updateNotifications && currVersion != prevVersion && typeof prevVersion != 'undefined') {
        showUpdateNotification();
    }
    localStorage.hzVersion = currVersion;
}

function init() {
    // Load options
    options = loadOptions();

    // Bind events
    chrome.extension.onRequest.addListener(onRequest);

    checkUpdate();
}

init();
