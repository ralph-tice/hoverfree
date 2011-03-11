// Copyright (c) 2011 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];

var hoverZoom = {
	
	options: {},
	currentLink: null,
	hzImg: null,
	hzImgCss: {
		'border': '1px solid #444', 
		'line-height': 0,
		'overflow': 'hidden',
		'padding': '2px',
		'margin': 0,
		'position': 'absolute',
		'z-index': 2147483647,
		'border-radius': '3px',
		'background': '-webkit-gradient(linear, left top, right bottom, from(#ffffff), to(#ededed), color-stop(0.5, #ffffff))',
		'-webkit-box-shadow': '2px 3px 12px rgba(0,0,0,0.6)'
	},
	imgLoading: null,
		
	loadHoverZoom: function () {
		var hz = hoverZoom,
			wnd = $(window),
			body = $(document.body),
			hzDownscaledImg = null,
			hzCaption = null,
			imgFullSize = null,
			imgSrc = '',
			imgHost = '',
			mousePos = {},
			loading = false,
			loadFullSizeImageTimeout,
			preloadTimeout,
			actionKeyDown = false,
			fullZoomKeyDown = false,
			pageActionShown = false,
			lastImgWidth = 0,
			skipFadeIn = false,
			titledElements = null,
			body100pct = true;
			
		var progressCss = {
			'opacity': '0.5',
			'position': 'absolute',
			'height': '22px',
			'width': '22px',
			'left': '3px',
			'top': '3px',
			'border-radius': '2px'
		},
		imgFullSizeCss = {
			'opacity': '1',
			'position': 'static',
			'height': 'auto',
			'width': 'auto',
			'left': 'auto',
			'top': 'auto',
			'border-radius': '0'
		},
		hzCaptionCss = {
			'font': 'menu',
			'font-size': '11px',
			'font-weight': 'bold',
			'color': '#333',
			'text-align': 'center',
			'max-height': '27px',
			'overflow': 'hidden',
			'vertical-align': 'top'
		},
		hzDownscaledImgCss = {
			'position': 'absolute',
			'top': '-9000px',
			'left': '-9000px'
		};

		// Calculate optimal image position and size
		function posImg(position) {
			if (!imgFullSize) {
				return;
			}
			position = position || {top: mousePos.top, left: mousePos.left};
			
			var offset = 20,
				padding = 10,
				statusBarHeight = 15,
				wndWidth = wnd.width(),
				wndHeight = wnd.height(),
				wndScrollLeft = wnd.scrollLeft(),
				wndScrollTop = wnd.scrollTop(),
				bodyWidth = body.width(),
				displayOnRight = (position.left - wndScrollLeft < wndWidth / 2);
				
			function posCaption() {
				if (hzCaption) {
					hzCaption.css('max-width', imgFullSize.width());
					if (hzCaption.height() > 20) {
						hzCaption.css('font-weight', 'normal');
					}
					// This is looped 10x max just in case something 
					// goes wrong, to avoid freezing the process.
					var i = 0;
					while (hz.hzImg.height() > wndHeight - statusBarHeight && i++ < 10) {
						imgFullSize.height(wndHeight - padding - statusBarHeight - hzCaption.height()).width('auto');
						hzCaption.css('max-width', imgFullSize.width());
					}
				}				
			}
			
			if (displayOnRight) {
				position.left += offset;
			} else {
				position.left -= offset;
			}
			
			if (hz.imgLoading) {
				position.top -= 10;
				if (!displayOnRight) {
					position.left -= 25;
				}
					
			} else if (fullZoomKeyDown) {
			
				imgFullSize.width(wndWidth - padding).height('auto');				
				if (hz.hzImg.height() > wndHeight) {
					imgFullSize.height(wndHeight - padding - statusBarHeight).width('auto');
					position.top = wndScrollTop;
					position.left = wndScrollLeft + wndWidth / 2 - hz.hzImg.width() / 2;
				} else {
					position.top = wndScrollTop + wndHeight / 2 - hz.hzImg.height() / 2;
					position.left = wndScrollLeft;
				}

				posCaption();
				
			} else {
				
				imgFullSize.width('auto').height('auto');
				
				// Image natural dimensions
				var naturalWidth = imgFullSize.width(),
					naturalHeight = imgFullSize.height();
				if (!naturalWidth || !naturalHeight) {
					return;
				}
				
				// Width adjustment
				if (displayOnRight) {
					if (naturalWidth + padding > wndWidth - position.left) {
						imgFullSize.width(wndWidth - position.left - padding + wndScrollLeft);
					}
				} else {
					if (naturalWidth + padding > position.left) {
						imgFullSize.width(position.left - padding - wndScrollLeft);
					}			
				}				
				
				// Height adjustment
				if (hz.hzImg.height() > wndHeight - padding - statusBarHeight) {
					imgFullSize.height(wndHeight - padding - statusBarHeight).width('auto');
				}

				posCaption();
				
				position.top -= hz.hzImg.height() / 2;

				// Display image on the left side if the mouse is on the right
				if (!displayOnRight) {
					position.left -= hz.hzImg.width() + padding;
				}
					
				// Vertical position adjustments
				var maxTop = wndScrollTop + wndHeight - hz.hzImg.height() - padding - statusBarHeight;
				if (position.top > maxTop) {
					position.top = maxTop;
				}
				if (position.top < wndScrollTop) {
					position.top = wndScrollTop;
				}
				
			}

			// This fixes positioning when the body's width is not 100%
			if (body100pct) {
				position.left -= (wndWidth - bodyWidth) / 2;
			}
			
			hz.hzImg.css({top: Math.round(position.top), left: Math.round(position.left)});
		}
		
		function posWhileLoading() {
			if (loading) {
				posImg();
				if (hz.imgLoading && hz.hzImg.width() > 40) {
					hz.imgLoading.remove();
					hz.imgLoading = null;
					posImg();
					setTimeout(function () { skipFadeIn = true; }, 200);
				} else {
					setTimeout(posWhileLoading, 100);
				}
			}
		}
		
		// Remove the 'title' attribute from all elements to prevent a tooltip from appearing above the zoomed image.
		// Titles are saved so they can be restored later.
		function removeTitles() {
			if (titledElements) { return; }
			titledElements = $('[title]').not('iframe, .lightbox, [rel^=lightbox]');
			titledElements.each(function () {
				$(this).data('hoverZoomTitle', this.getAttribute('title')).removeAttr('title');
			});
		}
		
		// Restore the 'title' attributes
		function restoreTitles() {
			if (!titledElements) { return; }
			titledElements.each(function () {
				this.setAttribute('title', $(this).data('hoverZoomTitle'));
			});
			titledElements = null;
		}
		
		function hideHoverZoomImg(now) {
			if (!now && !imgFullSize || !hz.hzImg || fullZoomKeyDown) {
				return;
			}
			imgFullSize = null;
			if (loading) { now = true; }
			hz.hzImg.stop(true, true).fadeOut(now ? 0 : options.fadeDuration, function () {
				hzCaption = null;
				hz.imgLoading = null;
				hz.hzImg.empty();
				restoreTitles();
			});
		}

		function documentMouseMove(event) {
			if (!options.extensionEnabled || fullZoomKeyDown || isExcludedSite() || wnd.height() < 30 || wnd.width() < 30) {
				return;
			}

			// Test if the action key was pressed without moving the mouse
			var explicitCall = event.pageY == undefined;

			// If so, the MouseMove event was triggered programmaticaly and we don't have details
			// about the mouse position and the event target, so we use the last saved ones.
			var links,
				target = $(event.target);
			if (explicitCall) {
				links = hz.currentLink;
			} else {
				mousePos = {top: event.pageY, left: event.pageX};
				links = target.parents('.hoverZoomLink');
				if (target.hasClass('hoverZoomLink')) {
					links = links.add(target);
				}
			}
			
			// Not finished
			/*if (target.hasClass('hoverZoomDownscaled')) {
				if (!target.hasClass('hoverZoomLink')) {
					var widthAttr = parseInt(event.target.getAttribute('width') || event.target.style.width || event.target.style.maxWidth),
						heightAttr = parseInt(event.target.getAttribute('height') || event.target.style.height || event.target.style.maxHeight);
					if (hzDownscaledImg) { hzDownscaledImg.remove(); }
					hzDownscaledImg = $('<img id="hzDownscaledImg">').css(hzDownscaledImgCss).load(function () {
						//console.log('Original: ' + hzDownscaledImg.width() + 'x' + hzDownscaledImg.height() + ' - Resized: ' + widthAttr + 'x' + heightAttr + ' - ' + hzDownscaledImg.attr('src'));
						if (hzDownscaledImg.height() > heightAttr + 10 || hzDownscaledImg.width() > widthAttr + 10) {
							target.data('hoverZoomSrc', [target.attr('src')]).addClass('hoverZoomLink');
							hzDownscaledImg.attr('src', '');
							links = links.add(target);
						}
					}).attr('src', event.target.src).appendTo(document.body);
				}
			}*/

			
			if (links && links.length > 0) {
				var hoverZoomSrcIndex = links.data('hoverZoomSrcIndex') || 0;
				if (links.data('hoverZoomSrc') && links.data('hoverZoomSrc') != 'undefined' && 
					links.data('hoverZoomSrc')[hoverZoomSrcIndex] && 
					links.data('hoverZoomSrc')[hoverZoomSrcIndex] != 'undefined') {
					// Happens when the mouse goes from an image to another without hovering the page background
					if (links.data('hoverZoomSrc')[hoverZoomSrcIndex] != imgSrc) {
						//console.log('data:   ' + links.data('hoverZoomSrc')[hoverZoomSrcIndex]);
						//console.log('imgSrc: ' + imgSrc);
						hideHoverZoomImg();
					}
					
					removeTitles();
					
					// Is the image source has not been set yet
					if (!imgFullSize) {
						hz.currentLink = links;
						if (!options.actionKey || actionKeyDown) {
							imgSrc = links.data('hoverZoomSrc')[hoverZoomSrcIndex];
							clearTimeout(loadFullSizeImageTimeout);
							
							// If the action key has been pressed over an image, no delay is applied
							var delay = explicitCall ? 0 : options.displayDelay;
							loadFullSizeImageTimeout = setTimeout(loadFullSizeImage, delay);
							loading = true;
						}
					} else {
						posImg();
					}
				} else {
					return;
				}			
			} else if (hz.currentLink) {
				cancelImageLoading();
			}
		}
		
		function documentMouseDown() {
			cancelImageLoading();
			restoreTitles();
		}
		
		function loadFullSizeImage() {
			// If no image is currently displayed...
			if (!imgFullSize) {
				
				hz.createHzImg();
				hz.createImgLoading();
				
				imgFullSize = $('<img style="border: none" />').appendTo(hz.hzImg).load(imgFullSizeOnLoad).error(imgFullSizeOnError).attr('src', imgSrc);
				imgHost = getHostFromUrl(imgSrc);
				
				skipFadeIn = false;
				var showWhileLoading = imgSrc.substr(-4).toLowerCase() == '.gif';
				if (showWhileLoading) {
					lastImgWidth = hz.hzImg.width();
					posWhileLoading();
				} else {
					imgFullSize.css(progressCss);
				}
				
				function imgFullSizeOnLoad() {
					// Only the last hovered link gets displayed
					if (imgSrc == $(imgFullSize).attr('src')) {
						loading = false;
						hz.hzImg.stop(true, true);
						hz.hzImg.offset({top:-9000, left:-9000});	// hides the image while making it available for size calculations
						hz.hzImg.empty();
						hz.imgLoading = null;
						imgFullSize.css(imgFullSizeCss).appendTo(hz.hzImg).mousemove(imgFullSizeOnMouseMove);
						if (options.showCaptions && hz.currentLink && hz.currentLink.data('hoverZoomCaption')) {
							hzCaption = $('<div/>', {id: 'hzCaption', text: hz.currentLink.data('hoverZoomCaption')}).css(hzCaptionCss).appendTo(hz.hzImg);
						}
						if (!skipFadeIn) {
							hz.hzImg.hide().fadeTo(options.fadeDuration, options.picturesOpacity);
						}
						setTimeout(posImg, 10);
						if (options.addToHistory && !chrome.extension.inIncognitoTab) {
							chrome.extension.sendRequest({action: 'addUrlToHistory', url: imgSrc});
						}
						chrome.extension.sendRequest({action: 'trackEvent', event: {category: 'Actions', action: 'ImageDisplayedOnSite', label: document.location.host}});
						chrome.extension.sendRequest({action: 'trackEvent', event: {category: 'Actions', action: 'ImageDisplayedFromSite', label: imgHost}});
					}
				}
				
				function imgFullSizeOnError() {
					if (imgSrc == $(this).attr('src')) {
						var hoverZoomSrcIndex = hz.currentLink ? hz.currentLink.data('hoverZoomSrcIndex') : 0;
						if (hz.currentLink && hoverZoomSrcIndex < hz.currentLink.data('hoverZoomSrc').length - 1) {
							// If the link has several possible sources, we try to load the next one
							imgFullSize.remove();
							imgFullSize = null;
							hoverZoomSrcIndex++;
							hz.currentLink.data('hoverZoomSrcIndex', hoverZoomSrcIndex);
							console.info('[HoverZoom] Failed to load image: ' + imgSrc + '\nTrying next one...');
							imgSrc = hz.currentLink.data('hoverZoomSrc')[hoverZoomSrcIndex];
							setTimeout(loadFullSizeImage, 100);
						} else {
							hideHoverZoomImg();
							console.warn('[HoverZoom] Failed to load image: ' + imgSrc);
							chrome.extension.sendRequest({action: 'trackEvent', event: {category: 'Errors', action: 'LoadingErrorFromSite', label: imgHost}});
						}
					}
				}
				
				function imgFullSizeOnMouseMove() {
					if (!imgFullSize) {
						hideHoverZoomImg(true);
					}
				}
			}
			posImg();
		}

		function cancelImageLoading() {
			hz.currentLink = null;
			clearTimeout(loadFullSizeImageTimeout);
			hideHoverZoomImg();
		}
		
		function prepareImgCaption(link) {
			var titledElement = null;
			if (link.attr('title')) {
				titledElement = link;
			} else {
				titledElement = link.find('[title]');
				if (!titledElement.length) {
					titledElement = link.parents('[title]');
				}
			}
			if (titledElement && titledElement.length) {
				link.data('hoverZoomCaption', titledElement.attr('title'));
			} else {
				var alt = link.attr('alt') || link.find('[alt]').attr('alt');
				if (alt && alt.length > 6 && !/^\d+$/.test(alt)) {
					link.data('hoverZoomCaption', alt);
				}
			}
		}
		
		// Callback function called by plugins after they finished preparing the links
		function imgLinksPrepared(links) {	
			var showPageAction = false;
			links.each(function () {
				var _this = $(this);
				if (!_this.data('hoverZoomSrc')) {

					prepareImgLinksAsync(true);
			
				} else {
								
					// Skip if the image has the same URL as the thumbnail.
					try {
						var url = _this.data('hoverZoomSrc')[0],
							skip = (url == _this.attr('src'));
						if (!skip) {
							_this.find('img[src]').each(function() {
								if (this.src == url) {
									skip = true;
								}
							});
						}
						if (skip) { return; }
					} catch(e) {
						console.error(e);
					}
				
					showPageAction = true;
					
					// If the extension is disabled or the site is excluded, we only need to know 
					// whether the page action needs to be shown or not.
					if (!options.extensionEnabled || isExcludedSite()) {
						return;
					}

					_this.addClass('hoverZoomLink');
					
					// Convert URL special characters
					var srcs = _this.data('hoverZoomSrc');
					for (var i=0; i<srcs.length; i++) {
						srcs[i] = deepUnescape(srcs[i]);
					}
					_this.data('hoverZoomSrc', srcs);
					
					_this.data('hoverZoomSrcIndex', 0);
					
					// Caption
					if (options.showCaptions && !_this.data('hoverZoomCaption')) {
						prepareImgCaption(_this);
					}
				}
			});
			
			if (options.pageActionEnabled && !pageActionShown && showPageAction) {
				chrome.extension.sendRequest({action : 'showPageAction'});
				pageActionShown = true;
			}
		}
		
		function prepareImgLinks() {
			pageActionShown = false;
			$('.hoverZoomLink').removeClass('hoverZoomLink').removeData('hoverZoomSrc');
			for (var i = 0; i < hoverZoomPlugins.length; i++) {
				hoverZoomPlugins[i].prepareImgLinks(imgLinksPrepared);
			}
			prepareImgLinksTimeout = null;
			
			if (options.alwaysPreload) {
				clearTimeout(preloadTimeout);
				preloadTimeout = setTimeout(hz.preloadImages, 800);
			} else {
				chrome.extension.sendRequest({action : 'preloadAvailable'});
			}
			
			//prepareScaledImages();
		}
		
		// Not finished
		function prepareScaledImages() {
			$('img').filter(function () {
				return this.getAttribute('width') || this.getAttribute('height') || 
					this.style && (this.style.width || this.style.height || this.style.maxWidth || this.style.maxHeight);
			}).addClass('hoverZoomDownscaled');
			/*.mouseenter(function () {
				var img = $(this),
					widthAttr = parseInt(this.getAttribute('width') || this.style.width || this.style.maxWidth),
					heightAttr = parseInt(this.getAttribute('height') || this.style.height || this.style.maxHeight);
				if (!img.hasClass('hoverZoomLink')) {
					if (hzDownscaledImg) { hzDownscaledImg.remove(); }
					hzDownscaledImg = $('<img id="hzDownscaledImg">').appendTo(document.body);
					hzDownscaledImg.load(function () {
							//console.log(this.complete);
							//console.log('Original: ' + hzDownscaledImg.width() + 'x' + hzDownscaledImg.height() + ' - Resized: ' + widthAttr + 'x' + heightAttr);
						if (hzDownscaledImg.height() > heightAttr + 10 || hzDownscaledImg.width() > widthAttr + 10) {
							img.data('hoverZoomSrc', [img.attr('src')]).addClass('hoverZoomLink');
							hzDownscaledImg.attr('src', '');
						}
					}).attr('src', this.src);
				}
				$(document).mousemove();
			});*/
		}
		
		var prepareImgLinksDelay = 500, prepareImgLinksTimeout;
		function prepareImgLinksAsync(dontResetDelay) {
			if (!options.extensionEnabled || isExcludedSite()) {
				return;
			}
			if (!dontResetDelay) {
				prepareImgLinksDelay = 500;
			}
			clearTimeout(prepareImgLinksTimeout);
			prepareImgLinksTimeout = setTimeout(prepareImgLinks, prepareImgLinksDelay);
			prepareImgLinksDelay *= 2;
		}
		
		function deepUnescape(url) {
			var ueUrl = unescape(encodeURIComponent(url));
			while (url != ueUrl) {
				url = ueUrl;
				ueUrl = unescape(url);
			}
			return decodeURIComponent(escape(url));
		}
		
		function applyOptions() {
			init();
			if (!options.extensionEnabled || isExcludedSite()) {
				hideHoverZoomImg();
				$(document).unbind('mousemove', documentMouseMove);
			}
		}
		
		var webSiteExcluded = null;
		function isExcludedSite() {
			
			// If site exclusion has already been tested
			if (webSiteExcluded != null) {
				return webSiteExcluded;
			}
			
			var excluded = !options.whiteListMode;
			var siteAddress = location.href.substr(location.protocol.length+2);
			if (siteAddress.substr(0, 4) == 'www.') {
				siteAddress = siteAddress.substr(4);
			}
			for (var i = 0; i < options.excludedSites.length; i++) {
				var es = options.excludedSites[i];
				if (es.substr(0, 4) == 'www.') {
					es = es.substr(4);
				}
				if (es && es.length <= siteAddress.length) {
					if (siteAddress.substr(0, es.length) == es) {
						webSiteExcluded = excluded;
						return excluded;
					}
				}
			}
			webSiteExcluded = !excluded;
			return !excluded;
		}
		
		function loadOptions() {
			chrome.extension.sendRequest({action : 'getOptions'}, function (result) {
				options = result;
				applyOptions();
			});
		}
		
		function onRequest(request, sender, sendResponse) {
			if (request.action == 'optionsChanged') {
				options = request.options;
				applyOptions();
			}
		}
		
		function windowOnDOMNodeInserted(event) {
			if (event.srcElement) {
				var srcElement = $(event.srcElement);
				if (srcElement.parents('#hzImg').length) { return; }
				if (event.srcElement.nodeName == 'A' || event.srcElement.nodeName == 'IMG' || srcElement.find('a, img').length || srcElement.parents('a, img').length) {
					prepareImgLinksAsync();
				} else if (event.srcElement.nodeName == 'EMBED' || event.srcElement.nodeName == 'OBJECT') {
					fixFlash();
				}
			}
		}
		
		function windowOnLoad(event) {
			prepareImgLinksAsync();
		}
		
		function bindEvents() {
			$(document).mousemove(documentMouseMove).mouseleave(cancelImageLoading).mousedown(documentMouseDown);

			wnd.bind('DOMNodeInserted', windowOnDOMNodeInserted).load(windowOnLoad).scroll(cancelImageLoading);
			
			if (options.actionKey || options.fullZoomKey) {
				$(document).keydown(function (event) {
					if (event.which == options.actionKey && !actionKeyDown) {
						actionKeyDown = true;
						$(this).mousemove();
						if (loading || imgFullSize) {
							return false;
						}
					}
					if (event.which == options.fullZoomKey && !fullZoomKeyDown) {
						fullZoomKeyDown = true;
						posImg();
						if (imgFullSize) {
							return false;
						}
					}
					if (imgFullSize && (event.which == options.actionKey || event.which == options.fullZoomKey)) {
						return false;
					}
				}).keyup(function (event) {
					if (event.which == options.actionKey) {
						actionKeyDown = false;
						hideHoverZoomImg();
					}
					if (event.which == options.fullZoomKey) {
						fullZoomKeyDown = false;
						$(this).mousemove();
					}
				});
			}		
		}
		
		function fixFlash() {
			if ($('.hoverZoomLink').length == 0) { return; }
			$('embed:not([wmode]), embed[wmode=window], object[type=application/x-shockwave-flash]').each(function () {
				if (this.type.toLowerCase() != 'application/x-shockwave-flash') { return; }
				var embed = this.cloneNode(true);
				embed.setAttribute('wmode', 'opaque');
				$(this).replaceWith(embed);
			});
			$('object').filter(function () {
				var param = $(this).children('param[name=wmode]');
				return param.length == 0 || param.attr('value').toLowerCase() == 'window';
			}).each(function () {
				var object = this.cloneNode(true);
				object.children('param[name=wmode]').remove();
				$('<param name="wmode" value="opaque">').appendTo(object);
				$(this).replaceWith(object);
			});
		}
		
		function getHostFromUrl(url) {
			var host = '';
			if (url.indexOf('://') > -1) {
				host = url.replace(/.+:\/\/([^\/]*).*/, '$1');
			} else {
				host = window.location.host;
			}
			var aHost = host.split('.'),
				maxItems = 2;
			if (aHost.length > 2) {
				var preTld = aHost[aHost.length - 2];
				if (preTld == 'co' || preTld == 'com' || preTld == 'net' || preTld == 'org') {
					maxItems = 3;
				}
			}
			while (aHost.length > maxItems) {
				aHost.shift();
			}
			return aHost.join('.');
		}
		
		function init() {
			if (!window.innerHeight || !window.innerWidth) { return; }
			
			webSiteExcluded = null;
			body100pct = (body.css('position') != 'static') || 
						 (body.css('padding-left') == '0px' && body.css('padding-right') == '0px' && body.css('margin-left') == '0px' && body.css('margin-right') == '0px');
			prepareImgLinks();		
			bindEvents();
			fixFlash();
		}
		
		chrome.extension.onRequest.addListener(onRequest);		
		loadOptions();
	},
	
	// __________________________________________________________________
	// Public functions
	
	// Search for links or images using the 'filter' parameter,
	// process their src or href attribute using the 'search' and 'replace' values,
	// store the result in the link and add the link to the 'res' array.
	urlReplace: function (res, filter, search, replace, parentFilter) {
		$(filter).each(function () {
			var _this = $(this), link, url;
			if (parentFilter) {
				link = _this.parents(parentFilter);
			} else {
				link = _this;
			}
			url = hoverZoom.getThumbUrl(this);
			if (!url) {	return;	}
			if (Array.isArray(search)) {
				for (var i=0; i<search.length; i++) {
					url = url.replace(search[i], replace[i]);
				}
			} else {
				url = url.replace(search, replace);
			}
			var data = link.data('hoverZoomSrc');
			if (Object.prototype.toString.call(data) === '[object Array]') {
				data.splice(0, 0, url);
			} else {
				data = [url];
			}
			link.data('hoverZoomSrc', data);
			res.push(link);
		});
	},
	
	// Extract a thumbnail url from an element, whether it be a link, 
	// an image or a element with a background image.
	getThumbUrl: function (el) {
		if (el.style && el.style.backgroundImage && el.style.backgroundImage.indexOf('url') > -1) {
			return el.style.backgroundImage.replace(/.*url\s*\(\s*(.*)\s*\).*/i, '$1');
		} else {
			return el.src || el.href;
		}
	},
	
	// Simulates a mousemove event to force a zoom call
	displayPicFromElement: function (el) {
		hoverZoom.currentLink = el;
		$(document).mousemove();
	},
	
	// Create and displays the zoomed image container
	createHzImg: function () {
		hoverZoom.hzImg = hoverZoom.hzImg || $('<div id="hzImg"></div>').appendTo(document.body);			
		hoverZoom.hzImg.css(hoverZoom.hzImgCss);
		hoverZoom.hzImg.empty();
		hoverZoom.hzImg.stop(true, true).fadeTo(options.fadeDuration, options.picturesOpacity);
	},
	
	// Create and displays the loading image container
	createImgLoading: function () {
		hoverZoom.imgLoading = hoverZoom.imgLoading || $('<img src="' + chrome.extension.getURL('images/loading.gif') + '" style="opacity: 0.8" />');
		hoverZoom.imgLoading.appendTo(hoverZoom.hzImg);
	},
	
	// Preloads zoomed images
	preloadImages: function() {
		
		var links = $('.hoverZoomLink'),
			preloadIndex = 0,
			preloadDelay = 200;
	
		function preloadNextImage() {
			if (preloadIndex >= links.length) { return; }
			var link = links.eq(preloadIndex++);
			if (link.data('hoverZoomPreloaded')) {
				preloadNextImage();
				chrome.extension.sendRequest({action: 'preloadProgress', value: preloadIndex, max: links.length});
			} else {
				var hoverZoomSrcIndex = link.data('hoverZoomSrcIndex') || 0;
				$('<img src="' + link.data('hoverZoomSrc')[hoverZoomSrcIndex] + '">').load(function() {
					link.data('hoverZoomPreloaded', true);
					setTimeout(preloadNextImage, preloadDelay);
					chrome.extension.sendRequest({action: 'preloadProgress', value: preloadIndex, max: links.length});
				}).error(function() {
					if (hoverZoomSrcIndex < link.data('hoverZoomSrc').length - 1) {
						link.data('hoverZoomSrcIndex', hoverZoomSrcIndex + 1);
						preloadIndex--;
					}
					setTimeout(preloadNextImage, preloadDelay);
				});
			}
		}
	
		setTimeout(preloadNextImage, preloadDelay);
	}
};

hoverZoom.loadHoverZoom();