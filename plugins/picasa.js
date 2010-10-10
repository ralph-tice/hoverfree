// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

// The dynamic loading of images in Picasa Web Albums makes it difficult to handle with this extension.
// The function that "prepares" a link has been isolated (prepareImgLink) and is called whenever the
// user move the mouse over a link.

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push({
	name: 'Picasa Web Albums',
	version: '0.5',
	prepareImgLinks: function(callback) {
	
		function prepareImgLink() {
			var _this = $(this);
			var src = _this.find('img')[0].src;
			src = src.replace(/\/(s128|s144-c)\//, '/s800/');
			_this.data('hoverZoomSrc', [src]);
			_this.addClass('hoverZoomLink');
			
			var tooltip = _this.parent().find('.goog-icon-list-icon-meta:eq(0)');
			if (tooltip.length) {
				_this.data('hoverZoomCaption', tooltip.text());
			}
		}
	
		var links = $("a.goog-icon-list-icon-link,div.gphoto-grid-cell a");
		links.each(prepareImgLink).mouseenter(prepareImgLink);
		callback(links);
	}
});