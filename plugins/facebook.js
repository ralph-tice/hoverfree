// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	"name": "Facebook",
	"version": "0.1",
	"prepareImgLinks": function() {
		var links = $("a.uiPhotoThumb,a.UIImageBlock_MED_Image,a.UIImageBlock_SMALL_Image,td.UIFullListing_Pic a,li.buddyRow a,a.chat_info_pic_link,a.UIPhotoGrid_PhotoLink,a.uiAttachmentMedia,div.uiFacepile a");
		links.each(function() {
			
			// Thumbnail URL
			var src = $(this).find('img')[0].src;
			
			// If image URL is included as a querystring parameter
			var indexQS = src.indexOf('&url=');
			if (indexQS == -1)
				indexQS = src.indexOf('&src=');
				
			if (indexQS > -1) {
				src = unescape(src.substr(indexQS + 5));
				if (src.indexOf('&') > -1)
					src = src.substr(0, src.indexOf('&'));
			} else {
				src = src.replace(/photos-\w/, 'sphotos').replace(/_[sqta]\./, '_n.').replace(/\/q/, '/n');
			}
			$(this).data('hoverzoomsrc', src);
		});
		return links;		
	}
});