/*jshint esversion: 6 */

(function() {
	/*
	if (window.contentful) {
		var client = contentful.createClient({space: 'mtdtfk8wt9f8', accessToken: 'aff9afcceeb8549ff1c488ad9190133337681d2ea0b7c154b229b0246aa980fb'});

		client.getEntries({content_type: 'intro'}).then(function(entry) {
			console.log(entry.items[0].fields.title);
			console.log(entry.items[0].fields.ingress);
		});
	}
	*/

	var scrollButton = document.querySelector('a.scroll');
	scrollButton.addEventListener('click', function() {
		window.scroll(0, Math.max(document.documentElement.clientHeight, window.innerHeight || 0));
	}, false);

/*
Kiinto parallax -->
*/
	var cssEngine = ( function ( ) {
		var navUA = navigator.userAgent.toLowerCase();
		if ( navUA.indexOf('webkit') != -1 ) { return 'webkit'; }
		else if ( navUA.indexOf('safari') != -1 ) { return 'webkit'; }
		else if ( navUA.indexOf('opera') != -1) { return 'O'; }
		else if ( navUA.indexOf ('msie') != -1 ) { return 'ms'; }		// < IE 11
		else if ( navUA.indexOf ('iemobile') != -1 ) { return 'ms'; } 	// IE 11
		else if ( navUA.indexOf ('trident') != -1 ) { return 'ms'; } 	// IE 11
		else if ( navUA.indexOf ('mozilla') != -1 ) { return 'Moz'; }
		else { return '';}
		})();

	var initParallax = function() {
		var parallaxElem = document.querySelectorAll("DIV.article-container, .intro");
		var scrollPos = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
		for (var i = 0, j = parallaxElem.length; i < j; i++) {
			parallaxElem[i].parallaxBottom = parallaxElem[i].getBoundingClientRect().bottom + scrollPos;
			parallaxElem[i].parallaxTop = parallaxElem[i].getBoundingClientRect().top + scrollPos;
			parallaxElem[i].parallaxHeight = parallaxElem[i].getBoundingClientRect().height;
			parallaxElem[i].parallaxTopOffset = (parallaxElem[i].parallaxHeight - window.innerHeight);
			parallaxElem[i].contentContainer = parallaxElem[i].querySelector('.article-content');
		}

		function checkScrollPos() {
			requestAnimationFrame(function() {
				let y = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
				let nakki = [];
				for (var i = 0, j = parallaxElem.length; i < j; i++) {
					if (parallaxElem[i].parallaxBottom < y + window.innerHeight && parallaxElem[i].parallaxBottom > y) {
						nakki[i] = (y - parallaxElem[i].parallaxTop - (parallaxElem[i].parallaxTopOffset)) - ((y - parallaxElem[i].parallaxTop - (parallaxElem[i].parallaxTopOffset)) * 0.6);
					} else {
						nakki[i] = 0;
					}
					parallaxElem[i].style[cssEngine + 'Transform'] = `translate3d(0, ${nakki[i].toFixed(2)}px, 0)`;
					if (parallaxElem[i].contentContainer) {
						parallaxElem[i].contentContainer.style.opacity = (1 - nakki[i] / window.innerHeight).toFixed(2);
						console.log( (1 - nakki[i] / window.innerHeight).toFixed(2));
					}
				}
			});
			//			requestAnimationFrame(checkScrollPos);
		}

		//			document.querySelector('.snap-container').addEventListener('scroll', function ( a ) {checkScrollPos ( this.scrollTop );}, false);
		//			checkScrollPos ( document.querySelector('.snap-container').scrollTop );
		scrollIntervalID = setInterval(checkScrollPos, 10);
	};

	window.addEventListener('DOMContentLoaded', initParallax, false);
	window.addEventListener('resize', initParallax, false);
/*
</-- Kiinto Parallax
*/

function isElementInViewport() {
	var rect = this.getBoundingClientRect();
	return rect.bottom > 0 && rect.right > 0 && rect.left < (window.innerWidth || document.documentElement.clientWidth) && rect.top < (window.innerHeight || document.documentElement.clientHeight);
}

(function() {
	var animateElements = document.querySelectorAll('.animate-on-screen');
	for (var i = 0, j = animateElements.length; i < j; i++) {
		var el = animateElements[i];
		el.onScreen = isElementInViewport.bind(el);
	}
})();

addAnimations = function() {
	var animateElements = document.querySelectorAll('.animate-on-screen');
	for (var i = 0, j = animateElements.length; i < j; i++) {
		var el = animateElements[i];
		if (el.onScreen()) {
			el.classList.add('inViewPort');
		} else {
			el.classList.remove('inViewPort');
		}
	}
};

//document.querySelector('.snap-container').addEventListener('scroll', addAnimations, false);
window.addEventListener('scroll', addAnimations, false);
window.addEventListener('DOMContentLoaded', addAnimations, false);

})();
