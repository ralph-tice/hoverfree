var hoverZoomPlugins = hoverZoomPlugins ? hoverZoomPlugins : [];
hoverZoomPlugins.push( {
	"name": "Facebook",
	"version": "1.0",
	"prepareImgLinks": function() {
		var links = $("a.uiPhotoThumb,a.UIImageBlock_MED_Image,a.UIImageBlock_SMALL_Image");
		links.each(function(index, el) {
			var src = $(el).find('img')[0].src;
			if (src.indexOf('safe_image.php') > -1) {
				src = unescape(src.substr(src.indexOf('&url=') + 5));				
			} else {
				src = src.replace(/photos-\w/, 'sphotos').replace(/_[sq]\./, '_n.').replace(/\/q/, '/n');
			}
			$(el).data('hoverzoomsrc', src);
		});
		return links;		
	}
});