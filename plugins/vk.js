// Copyright (c) 2011 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'VK.com',
	version: '0.1',
	prepareImgLinks: function(callback) {

		function prepareFromPhotoId(link, photoId, listId) {
			chrome.extension.sendRequest({action: 'ajaxGet', url: 'http://vk.com/al_photos.php?al=1&act=show&photo=' + photoId + '&list=' + listId}, function(data) {
				var photos, url;
				try {
					photos = JSON.parse(data.match(/<!json>(.*)<!>/)[1]);
				} catch(e) {
					//console.log('photoId: ' + photoId);
					//console.log(data);
					return; 
				}
				for (var i in photos) {
					if (photos[i].id == photoId) {
						link.data('hoverZoomSrc', [photos[i].x_src]).addClass('hoverZoomLink');
					} else {
						// in case the request fetched details on another photo on the page
						$('a[href^=/photo' + photos[i].id + ']').data('hoverZoomSrc', [photos[i].x_src]).addClass('hoverZoomLink');
					}
				}
				if (!link.data('hoverZoomMouseLeft')) {
					hoverZoom.displayPicFromElement(link);
				}
			});
		}
	
		$('a[href^=/photo]').mouseenter(function () {
			var link = $(this);
			if (link.data('hoverZoomSrc')) { return; }
			if (this.onclick) {
				var onclick = this.onclick.toString();
				if (onclick.indexOf('x_src:') > -1) {
					link.data('hoverZoomSrc', [onclick.match(/x_src\s*:\s*"(.*)"/)[1]]).addClass('hoverZoomLink');
				}
			}
			if (link.data('hoverZoomSrc') || link.data('hoverZoomRequested')) { return; }
			link.data('hoverZoomRequested', true);
			var listId, photoId = this.href.match(/\/photo(-?\d+_\d+).*/)[1];
			if (this.href.indexOf('tag=') > -1) {
				listId = 'tag' + this.href.match(/tag=(\d+)/)[1];
			}
			prepareFromPhotoId(link, photoId, listId);
		}).mouseleave(function () {
			$(this).data('hoverZoomMouseLeft', true);
		});
	
		$('img[src*=/u]').filter(function() {
			return this.src.match(/\/u\d+\/[ed]_/);
		}).mouseenter(function () {
			var img = $(this);
			if (img.data('hoverZoomRequested') || img.data('hoverZoomSrc')) { return; }
			img.data('hoverZoomRequested', true);
			var userId = this.src.match(/\/u(\d+)\//)[1];
			//console.log('userId: ' + userId);
			chrome.extension.sendRequest({action: 'ajaxGet', url: 'http://vk.com/al_profile.php?al=1&act=get_profile_photos&offset=0&skip_one=0&id=' + userId}, function(data) {
				var photos;
				try {
					photos = JSON.parse(data.match(/<!json>(.*)$/)[1]);
				} catch(e) {
					//console.log(data);
					return; 
				}
				if (photos.length) {
					prepareFromPhotoId(img, photos[0][1].match(/\/photo(\d+_\d+)/)[1], '');
				}
			});
		}).mouseleave(function () {
			$(this).data('hoverZoomMouseLeft', true);
		});
	
	}
});