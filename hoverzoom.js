var hoverZoomPlugins = hoverZoomPlugins ? hoverZoomPlugins : [];
function hoverZoom() {

	var wnd = $(window);
	var doc = $(document);

	// Div containing the full size image
	var hoverZoomImg = $('<div id="hoverZoomImg"></div>');
	hoverZoomImg.appendTo('body');
	
	var imgLoading = $('<img>').attr('src', chrome.extension.getURL('loading.gif'));
	
	var lastSrc = '';
	var mousePos;
	var loading = false;
	
	function posImg(position) {
		position.top -= hoverZoomImg.height() / 2;
		if (!loading && hoverZoomImg.height() > wnd.height())
			$('#hoverZoomImg img').height(wnd.height() - 10);
		if (position.top + hoverZoomImg.height() >= wnd.scrollTop() + wnd.height() - 10)
			position.top = wnd.scrollTop() + wnd.height() - hoverZoomImg.height() - 15;
		if (position.top < wnd.scrollTop())
			position.top = wnd.scrollTop();
		if (position.left + hoverZoomImg.width() > wnd.scrollLeft() + wnd.width() && position.left > wnd.scrollLeft() + wnd.width() / 2) {
			position.left -= hoverZoomImg.width() + 20;			
		} else {
			position.left += 10;
		}
		hoverZoomImg.offset(position);
	}

	var documentMouseMove = function(event) {	
		mousePos = {top:event.pageY, left:event.pageX};
		posImg(mousePos);
	};
	
	// Mouse enters link
	function imgLinkMouseEnter(event) {
		//if ($(this).data('hoverzoomsrc') != '')
			//return;
			
		posImg({top:event.pageY, left:event.pageX});
		doc.bind('mousemove', documentMouseMove);
		
		// Loading image
		loading = true;
		imgLoading.appendTo(hoverZoomImg);
		hoverZoomImg.show();
		
		// Full size image
		lastSrc = $(this).data('hoverzoomsrc');
		$('<img>').attr('src', $(this).data('hoverzoomsrc')).load(function () {
			if (lastSrc == $(this).attr('src')) {
				loading = false;
				hoverZoomImg.empty();
				$(this).appendTo(hoverZoomImg);
				posImg(mousePos);	
console.log(lastSrc);				
			}
		});
	}
	
	// Mouse leaves link 
	function imgLinkMouseLeave(event) {
		doc.unbind('mousemove', documentMouseMove);
		hoverZoomImg.hide();
		hoverZoomImg.empty();
	}
	
	function bindImgLinks() {
		for (i in hoverZoomPlugins) {
			var imgLinks = hoverZoomPlugins[i].prepareImgLinks();
			imgLinks.unbind('mouseenter', imgLinkMouseEnter);
			imgLinks.unbind('mouseleave', imgLinkMouseLeave);
			imgLinks.unbind('mousedown', imgLinkMouseLeave);
			imgLinks.bind('mouseenter', imgLinkMouseEnter);
			imgLinks.bind('mouseleave', imgLinkMouseLeave);
			imgLinks.bind('mousedown', imgLinkMouseLeave);
		}
	}
	
	bindImgLinks();
	
	$(window).bind('DOMNodeInserted', function(event) {
		if (event.srcElement && (
		   (event.srcElement.nodeName && event.srcElement.nodeName.toLowerCase() == 'a') ||
		   $(event.srcElement).find('a[href]').length))
			bindImgLinks();
	});
};

hoverZoom();