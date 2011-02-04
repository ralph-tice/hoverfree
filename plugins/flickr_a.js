// Copyright (c) 2011 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
var hoverZoomPluginFlickerA = {
	name: 'Flickr (a)',
	version: '0.2',
	prepareImgLinks: function(callback) {
		var res = [];
		
		// Thumbnails
		// First processing: no API calls, only medium size images
		$('a img[src*=static.flickr.com]').filter(function() {
			return this.src.match(/_[mst]\./);
		}).each(function() {
			var _this = $(this),
				link = _this.parents('a:eq(0)'),
				src = _this.attr('src');
			if (link.data('hoverZoomSrc')) { return; }
			src = src.replace(/_[mst]\./, '.');
			link.data('hoverZoomSrc', [src]);
			res.push(link);
			
			// Second processing, this time with API calls.
			// Will overwrite values from first processing if larger images are found.
			if (options.showHighRes) {
				hoverZoomPluginFlickerA.prepareImgLinkFromSrc(link, src, callback);
			}
		});
		callback($(res));
		
		// Links to flickr pages. Requires API calls.
		// Disabled for the moment (API key expired).
		/*var filter = 'a[href*=flickr.com/photos/]';
		if (document.location.hostname == 'www.flickr.com') {
			filter = 'a[href*=/photos/]';
		}
		$(filter).each(function() {
			hoverZoomPluginFlickerA.prepareImgLinkFromHref($(this), callback);
		});*/
	},
	
	// Get details from this URL: http://www.flickr.com/photos/{user-id}/{photo-id}
	prepareImgLinkFromHref: function(link, callback) {
		var href = link.attr('href'),
			aHref = href.split('/'),
			photoIdIndex = 5;
		if (aHref[0].indexOf('http') == -1) { photoIdIndex = 3; }	// If relative URL
		if (aHref.length < photoIdIndex + 1) { return; }
		var photoId = aHref[photoIdIndex];
		if (parseInt(photoId) != photoId) { return; }
		hoverZoomPluginFlickerA.prepareImgLinkFromPhotoId(link, photoId, callback);
	},
	
	// Get details from this URL: http://farm{farm-id}.static.flickr.com/{server-id}/{id}_{secret}_[mstbo].(jpg|gif|png)
	prepareImgLinkFromSrc: function(link, src, callback) {
		var aSrc = src.split('/');
		if (aSrc.length < 5) { return };
		var photoId = aSrc[4];
		photoId = photoId.substr(0, photoId.indexOf('_'));
		hoverZoomPluginFlickerA.prepareImgLinkFromPhotoId(link, photoId, callback);		
	},
	
	// Prepares a link by making a Flickr API call.
	prepareImgLinkFromPhotoId: function(link, photoId, callback) {
		if (!link || !photoId) { return; }
		// Check if the url was stored
		var cachePrefix = 'cache_FlickrPhoto_' + (options.showHighRes ? 'hi' : 'lo') + '_';
		var storedUrl = localStorage[cachePrefix + photoId];		
		if (storedUrl) {
			link.data('hoverZoomSrc', [storedUrl]);
			callback(link);
		} else {
			var apiKey = '0bb8ac4ab9a737b644c407ba8f59e9e7';
			var requestUrl = 'http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=' + apiKey + '&photo_id=' + photoId + '&format=json&nojsoncallback=1';			
			chrome.extension.sendRequest({action: 'ajaxGet', url: requestUrl}, function(data) {
				var rsp = JSON.parse(data);
				if (rsp.stat != 'ok') {
					console.warn('[HoverZoom] Flickr API call failed. Photo ID: ' + photoId + '. Error #' + rsp.code + ': ' + rsp.message);
					return;
				}
				var src = '';
				for (var i=0; i<rsp.sizes.size.length; i++) {
					if (options.showHighRes && rsp.sizes.size[i].label == 'Original' || options.showHighRes && rsp.sizes.size[i].label == 'Large' || rsp.sizes.size[i].label == 'Medium') {
						src = rsp.sizes.size[i].source;
					}
				}
				if (src != '') {
					link.data('hoverZoomSrc', [src]);
					callback(link);
					
					// Items are stored to lessen API calls
					localStorage[cachePrefix + photoId] = src;
				}
			});
		}
	}
};
hoverZoomPlugins.push(hoverZoomPluginFlickerA);