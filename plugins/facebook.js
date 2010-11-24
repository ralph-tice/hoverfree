// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Facebook',
	version: '0.7',
	prepareImgLinks: function(callback) {
	
		function srcReplace(src) {
			return src.replace(/_[sqta]\./, '_n.').replace(/\/[sqta](\d)/, '/n$1');
		}
		
		function getTooltip(link) {
			var tooltip = link.find('[title], [alt]').add(link.parent('[title], [alt]')).add(link);
			var tooltipText = tooltip.attr('title') || tooltip.attr('alt');
			if (tooltipText) {
				return tooltipText;
			}
			tooltip = link.find('.uiTooltipText:eq(0)');
			var filter = '.actorName:eq(0), .passiveName:eq(0), .ego_title:eq(0), .uiAttachmentTitle:eq(0), .UIIntentionalStory_Names:eq(0), .fsl:eq(0)';
			if (!tooltip.text()) {
				tooltip = link.parent().find(filter).eq(0);
			}
			if (!tooltip.text()) {
				tooltip = link.parent().parent().find(filter).eq(0);
			}
			while (tooltip.children().length) {
				tooltip = tooltip.children().eq(0);
			}
			if (!tooltip.text()) {
				tooltip = link.parents('.album:eq(0)').find('.desc a');
			}
			if (!tooltip.text()) {
				tooltip = link.parents('.UIObjectListing:eq(0)').find('.UIObjectListing_Title');
			}
			if (!tooltip.text()) {
				tooltip = link.parents('.UIStoryAttachment:eq(0)').find('.UIStoryAttachment_Title');
			}
			if (!tooltip.text()) {
				tooltip = link.parents('.buddyRow:eq(0)').find('.UIImageBlock_Content');
			}
			return tooltip.text();
		}
	
		var res = [];
		
		$('a img.img, a img.UIProfileImage, .itemsbox a img').each(function() {			
			var img = $(this);
			if (img.parents('.uiSideNav').length) { return; }
			
			// Thumbnail URL
			var src = hoverZoom.getThumbUrl(this);
			if (!src || src.indexOf('static.ak.fbcdn.net') > -1) { return; }
			src = unescape(src);

			// If image URL is included as a querystring parameter
			var indexQS = src.lastIndexOf('&url=');
			if (indexQS == -1) {
				indexQS = src.lastIndexOf('&src=');
			}

			if (indexQS > -1) {
				src = unescape(src.substr(indexQS + 5));
				if (!src) { return; }
			} else {
				src = srcReplace(src);
			}
			if (src.indexOf('?') > -1) {
				src = src.substr(0, src.indexOf('?'));
			}
			if (src.indexOf('&') > -1) {
				src = src.substr(0, src.indexOf('&'));
			}
			
			var srcs = [];
			
			// Payvment webstore items 
			if (src.indexOf('payvment') > -1) {
				if (src.indexOf('noimageavailable') > -1) { return; }
				if (src.indexOf('_125.') > -1) {
					srcs.push(src.replace('_125.', '_230.'));				
				} else {
					srcs.push(src.replace(/\.(jpg|gif|png)$/, '_lg.$1'));				
				}
			}
			
			// Picasa hosted images
			if (src.indexOf('ggpht.com') > -1 || src.indexOf('blogspot.com') > -1) {
				srcs.push(src.replace(/\/s\d+(-c)?\//, options.showHighRes ? '/' : '/s800/'));				
			}
			
			srcs.push(src);
			
			var tooltip;
			
			var uiFacepileItem = img.parents('.uiFacepileItem');
			if (uiFacepileItem.length) {
				img = uiFacepileItem.find('a');
				tooltip = getTooltip(img.parents('li:eq(0)'));
			} else {
				tooltip = getTooltip(img.parents('a:eq(0)'));
			}
			
			if (tooltip) {
				img.data('hoverZoomCaption', tooltip);
			}
			
			img.data('hoverZoomSrc', srcs);
			res.push(img);
			
		});
		
		// Photo albums		
		function preparePhotoAlbumLink() {
			var _this = $(this);
			var i = _this.find('i:eq(0)');
			var src = i.attr('style');
			if (src) {
				src = src.substring(src.indexOf('http'), src.lastIndexOf(')'));
				src = srcReplace(src);
				_this.data('hoverZoomSrc', [src]);
				res.push(_this);
			}
		}
		
		$('.uiMediaThumb').each(preparePhotoAlbumLink).mouseenter(preparePhotoAlbumLink);
		
		// Photo albums covers
		$('.album_thumb a.album_link').each(function() {
			var _this = $(this);
			var div = _this.parent();
			var src = div.attr('style');
			if (src) {
				src = src.substring(src.indexOf('http'), src.lastIndexOf(')'));
				src = srcReplace(src);
				_this.data('hoverZoomSrc', [src]);
				res.push(_this);
			}
		});
		
		callback($(res));
		
		/*function loadHiProfilePics() {
			//console.log('loadHiProfilePics');
			if (!FB) { return; }
			FB.init({
				appId  : '154110331291837',
				status : true, // check login status
				cookie : true, // enable cookies to allow the server to access the session
				xfbml  : true  // parse XFBML
			});
			// We try to find a bigger version of the profile picture
			$('.hoverZoomLink').each(function() {
				var _this = $(this),
					srcs = _this.data('hoverZoomSrc');
				if (srcs[0].indexOf('/profile.') == -1) { return; }
				var aUrl = srcs[0].split('/');
				var id = aUrl[aUrl.length-1];
				var aId = id.split('_');
				if (aId.length < 2) { return; }
				id = aId[1];
				//console.log('id:'+id);
				FB.api(id + '/albums', function(albums) {
					for (var i=0; i<albums.data.length; i++) {
						var album = albums.data[i];
						console.log(album);
						if (album.type == 'profile') {
							window.FB.api(album.id + '/photos', function(photos) {
								for (var j=0; j<photos.data.length; j++) {
									var photo = photos.data[j];
									console.log(photo);
									if (photo.position == 1) {
										if (photo.source) {
											srcs.splice(0, 0, photo.source);
											_this.data('hoverZoomSrc', srcs);
										}
										return;
									}
								}
							});
							return;
						}
					}
				});
			});
		}
		
		//console.log(typeof(FB));
		if (typeof(FB) != 'undefined') {
			loadHiProfilePics();
		} else {
			var fbRoot = $('#fb-root');
			if (!fbRoot.length) {
				fbRoot = $('<div id="fb-root"></div>').appendTo(document.body);
			}
			var sdkUrl = document.location.protocol + '//connect.facebook.net/en_US/all.js';
			//console.log(sdkUrl);
			chrome.extension.sendRequest(
				{action: 'ajaxGet', url: sdkUrl},
				function(data) {
					//console.log(data);
					eval(data);
					loadHiProfilePics();
				}
			);
		}*/
	}
});