/*jshint esversion: 6 */

(function() {
/*
Kiinto parallax -->
*/
	let cssEngine = ( function ( ) {
		let navUA = navigator.userAgent.toLowerCase();
		if ( navUA.indexOf('webkit') != -1 ) { return 'webkit'; }
		else if ( navUA.indexOf('safari') != -1 ) { return 'webkit'; }
		else if ( navUA.indexOf('opera') != -1) { return 'O'; }
		else if ( navUA.indexOf ('msie') != -1 ) { return 'ms'; }		// < IE 11
		else if ( navUA.indexOf ('iemobile') != -1 ) { return 'ms'; } 	// IE 11
		else if ( navUA.indexOf ('trident') != -1 ) { return 'ms'; } 	// IE 11
		else if ( navUA.indexOf ('mozilla') != -1 ) { return 'Moz'; }
		else { return '';}
		})();

	let initParallax = function() {
		let parallaxElem = document.querySelectorAll('*[data-fpParallax="true"]');
		let scrollPos = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
		for (let i = 0, j = parallaxElem.length; i < j; i++) {
			parallaxElem[i].parallaxBottom = parallaxElem[i].getBoundingClientRect().bottom + scrollPos;
			parallaxElem[i].parallaxTop = parallaxElem[i].getBoundingClientRect().top + scrollPos;
			parallaxElem[i].parallaxHeight = parallaxElem[i].getBoundingClientRect().height;
			parallaxElem[i].parallaxTopOffset = (parallaxElem[i].parallaxHeight - window.innerHeight);
			parallaxElem[i].contentContainer = parallaxElem[i].querySelector('.article-content');
			parallaxElem[i].parallaxStrength = parallaxElem[i].getAttribute('data-fpParallaxStrength');
			parallaxElem[i].parallaxRotateMax = parallaxElem[i].getAttribute('data-fpParallaxRotateMax');
		}

		function checkScrollPos() {
			let windowHeight = window.innerHeight;
			requestAnimationFrame(function() {
				let y = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
				let parallaxAmount = [];
				for (let i = 0, j = parallaxElem.length; i < j; i++) {
					if (parallaxElem[i].parallaxBottom < y + windowHeight && parallaxElem[i].parallaxBottom > y) {
						parallaxAmount[i] = ((100 / windowHeight) * (y - parallaxElem[i].parallaxTop - (parallaxElem[i].parallaxTopOffset))).toFixed(2);
					} else {
						parallaxAmount[i] = 0;
					}
					parallaxElem[i].style[cssEngine + 'Transform'] = `translate3d(0, ${parallaxAmount[i]*parallaxElem[i].parallaxStrength}px, 0) perspective(${windowHeight*2}px) rotateX(${(-1*parallaxAmount[i]*(parallaxElem[i].parallaxRotateMax / 100)).toFixed(2)}deg)`;
					if (parallaxElem[i].contentContainer) {
						parallaxElem[i].contentContainer.style.opacity = (1-Math.abs(parallaxAmount[i])/100).toFixed(2);
					}
				}
			});
		}
		if(window.fpParallaxInterval) {
			clearInterval(window.fpParallaxInterval);
		}
		window.fpParallaxInterval = setInterval(checkScrollPos, 10);
	};

	document.addEventListener('contentfulFetchDone', function(){
//		initParallax();
	}, false);

	window.addEventListener('DOMContentLoaded', initParallax, false);
	window.addEventListener('resize', initParallax, false);
/*
</-- Kiinto Parallax
*/

function isElementInViewport() {
	let rect = this.getBoundingClientRect();
	return rect.bottom > 0 && rect.right > 0 && rect.left < (window.innerWidth || document.documentElement.clientWidth) && rect.top < (window.innerHeight || document.documentElement.clientHeight);
}

(function() {
	let animateElements = document.querySelectorAll('.animate-on-screen');
	for (let i = 0, j = animateElements.length; i < j; i++) {
		let el = animateElements[i];
		el.onScreen = isElementInViewport.bind(el);
	}
})();

addAnimations = function() {
	let animateElements = document.querySelectorAll('.animate-on-screen');
	for (let i = 0, j = animateElements.length; i < j; i++) {
		let el = animateElements[i];
		if (el.onScreen()) {
			el.classList.add('inViewPort');
		} else {
			el.classList.remove('inViewPort');
		}
	}
};

window.addEventListener('scroll', addAnimations, false);
window.addEventListener('DOMContentLoaded', addAnimations, false);
})();
