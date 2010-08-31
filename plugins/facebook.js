// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Facebook',
	version: '0.6',
	prepareImgLinks: function(callback) {
	
		function srcReplace(src) {
			return src.replace(/photos-\w/, 'sphotos').replace(/_[sqta]\./, '_n.').replace(/\/[sqta](\d)/, '/n$1');
		}
	
		var res = [];
		
		$('a img.img:not([src^="http://static.ak.fbcdn.net"]),a img.UIProfileImage').each(function() {			
			var _this = $(this);
			var link = _this.parents('a:eq(0)');
			
			// Thumbnail URL
			var src = _this.attr('src');
			if (!src) { return; }
			src = unescape(src);
			
			// If image URL is included as a querystring parameter
			var indexQS = src.lastIndexOf('&url=');
			if (indexQS == -1) {
				indexQS = src.lastIndexOf('&src=');
			}
				
			if (indexQS > -1) {
				src = unescape(src.substr(indexQS + 5));
				if (!src) { return; }
				if (src.indexOf('&') > -1) {
					src = src.substr(0, src.indexOf('&'));
				}
			} else {
				src = srcReplace(src);
			}
			
			link.data('hoverZoomSrc', [src]);
			
			var tooltip = _this.find('.uiTooltipText:eq(0)');
			if (tooltip.length) {
				link.data('hoverZoomCaption', tooltip.text());
			}
			
			res.push(link);
		});
		
		// Photo albums		
		function preparePhotoAlbumLink() {
			var _this = $(this);
			var i = _this.find('i:eq(0)');
			var src = i.attr('style');
			if (src) {
				src = src.substring(src.indexOf('http:'), src.lastIndexOf(')'));
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
				src = src.substring(src.indexOf('http:'), src.lastIndexOf(')'));
				src = srcReplace(src);
				_this.data('hoverZoomSrc', [src]);
				res.push(_this);
			}
		});
		
		callback($(res));
	}
});