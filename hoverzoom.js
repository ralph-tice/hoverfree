var hoverZoomPlugins = hoverZoomPlugins ? hoverZoomPlugins : [];
function hoverZoom() {

	var wnd = $(window);

	var hoverZoomImg = $('<div id="hoverZoomImg"></div>');
	hoverZoomImg.appendTo('body');
	var imgFullSize = null;		
	var imgLoading = $('<img />').attr('src', chrome.extension.getURL('loading.gif'));
	
	var imgSrc = '';
	var mousePos = {};
	var loading = false;
	var bindLinksTimeout;
	
	function posImg(position) {
		if (!imgFullSize)
			return;
		position = position || {top:mousePos.top, left:mousePos.left};
		
		var offset = 20;
		
		if (loading) {
			position.left += offset;
			position.top -= 10;
		} else {
			var margin = 8;
			var padding = 6;
			
			imgFullSize.width('auto').height('auto');
			var naturalWidth = imgFullSize.width();
			var naturalHeight = imgFullSize.height();
			if (!naturalWidth || !naturalHeight)
				return;
			
			var displayOnRight = true;
			if (position.left - wnd.scrollLeft() < wnd.width() / 2) {
				position.left += offset;
				if (naturalWidth + padding > wnd.width() - position.left) {
					imgFullSize.width(wnd.width() - position.left - padding + wnd.scrollLeft());
				}
			} else {
				displayOnRight = false;
				position.left -= offset;
				if (naturalWidth + padding > position.left) {
					imgFullSize.width(position.left - padding - wnd.scrollLeft());
				}			
			}
			position.top -= hoverZoomImg.height() / 2;
			if (hoverZoomImg.height() > wnd.height())
				imgFullSize.height(wnd.height() - padding).width('auto');
			if (!displayOnRight) 
				position.left -= hoverZoomImg.width() + padding;
			if (position.top + hoverZoomImg.height() >= wnd.scrollTop() + wnd.height())
				position.top = wnd.scrollTop() + wnd.height() - hoverZoomImg.height() - padding;
			if (position.top < wnd.scrollTop())
				position.top = wnd.scrollTop();	
		}
		
		hoverZoomImg.offset(position);
	}

	function documentMouseMove(event) {
		mousePos = {top:event.pageY, left:event.pageX};
		var links = $(event.target).parents('.hoverZoomLink');
		if ($(event.target).hasClass('hoverZoomLink'))
			links = links.add($(event.target));
		if (links.length > 0) {
		
			// Happens when the mouse goes from an image to another without hovering the page background
			if (links.data('hoverzoomsrc') != imgSrc) {
				hoverZoomImg.empty();
				imgFullSize = null;
			}
			
			imgSrc = links.data('hoverzoomsrc');
			
			// If no image is currently displayed...
			if (!imgFullSize) {
				loading = true;
				imgLoading.appendTo(hoverZoomImg);
				//$('<span>' + imgSrc + '</span>').appendTo(hoverZoomImg);
				hoverZoomImg.show();
				imgFullSize = $('<img />').attr('src', imgSrc).load(function () {				
					// Only the last hovered link gets displayed
					if (imgSrc == $(this).attr('src')) {
						loading = false;
						hoverZoomImg.offset({top:-9000, left:-9000}); 	// hides the image while making it available for size calculations
						hoverZoomImg.empty();
						$(this).appendTo(hoverZoomImg);
						posImg();
					}
				});
			}
			posImg();
		} else {
			imgFullSize = null;
			hoverZoomImg.empty();
			hoverZoomImg.hide();
		}
	}	
	
	function bindImgLinks() {
		for (i in hoverZoomPlugins) {
			hoverZoomPlugins[i].prepareImgLinks().each(function() {
				$(this).addClass('hoverZoomLink');
				if (!$(this).data('hoverzoomsrc')) {
					bindImgLinksAsync();
				}
			});
		}
	}
	
	function bindImgLinksAsync() {
		window.clearTimeout(bindLinksTimeout);
		bindLinksTimeout = window.setTimeout(bindImgLinks, 500);
	}
	
	bindImgLinks();
	
	$(document).bind('mousemove', documentMouseMove);
		
	wnd.bind('DOMNodeInserted', function(event) {
		//console.log(event.srcElement);
		if (event.srcElement && (
		   (event.srcElement.nodeName && event.srcElement.nodeName.toLowerCase() == 'a') ||
		   $(event.srcElement).find('a').length) ||
		   (event.relatedNode && event.relatedNode.nodeName && event.relatedNode.nodeName.toLowerCase() == 'a')) {
			bindImgLinksAsync();
		}
	});
};

hoverZoom();