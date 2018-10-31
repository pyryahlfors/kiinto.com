/*jshint esversion: 6 */

(function() {
/*
	Kiinto parallax -->
*/
	let cssEngine = (function() {
		let navUA = navigator.userAgent.toLowerCase();
		if (navUA.indexOf('webkit') != -1) {
			return 'webkit';
		} else if (navUA.indexOf('safari') != -1) {
			return 'webkit';
		} else if (navUA.indexOf('opera') != -1) {
			return 'O';
		} else if (navUA.indexOf('msie') != -1) {
			return 'ms'; // < IE 11
		} else if (navUA.indexOf('iemobile') != -1) {
			return 'ms'; // IE 11
		} else if (navUA.indexOf('trident') != -1) {
			return 'ms'; // IE 11
		} else if (navUA.indexOf('mozilla') != -1) {
			return 'Moz';
		} else {
			return '';
		}
	})();

	var initParallax = () => {
		let elAspect = 1445/1024; // size of parallax images

		if ((window.innerWidth / window.innerHeight) < elAspect ) {
			document.body.classList.remove('landscape');
			document.body.classList.add('portrait');
		} else {
			document.body.classList.remove('portrait');
			document.body.classList.add('landscape');
		}

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
			parallaxElem[i].parallaxInit = parallaxElem[i].getAttribute('data-fpParallaxInit');
		}

		var checkScrollPos = () => {
			let windowHeight = window.innerHeight;

			//			requestAnimationFrame(function() {
			let y = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

			let parallaxAmount = [];
			for (let i = 0, j = parallaxElem.length; i < j; i++) {
				switch (parallaxElem[i].parallaxInit) {
					case('exit'):
						if (parallaxElem[i].parallaxBottom < y + windowHeight && parallaxElem[i].parallaxBottom > y) {
							parallaxAmount[i] = ((100 / windowHeight) * (y - parallaxElem[i].parallaxTop - (parallaxElem[i].parallaxTopOffset))).toFixed(2);
						} else {
							parallaxAmount[i] = 0;
						}
						break;

					default:
						if (parallaxElem[i].parallaxInit === 'enter') {
							if (parallaxElem[i].parallaxTop < y + windowHeight && parallaxElem[i].parallaxBottom > y) {
								parallaxAmount[i] = ((100 / windowHeight) * (y - parallaxElem[i].parallaxTop - (parallaxElem[i].parallaxTopOffset))).toFixed(2);
							} else {
								parallaxAmount[i] = 0;
							}
						}
						break;
				}

				parallaxElem[i].style[cssEngine + 'Transform'] = `translate3d(0, ${parallaxAmount[i] * parallaxElem[i].parallaxStrength}px, 0) perspective(${windowHeight * 2}px) rotateX(${ (-1 * parallaxAmount[i] * (parallaxElem[i].parallaxRotateMax / 100)).toFixed(2)}deg)`;
			}
			//			});
			window.requestAnimationFrame(checkScrollPos);
		}
		window.requestAnimationFrame(checkScrollPos);
	};

	document.addEventListener('contentfulFetchDone', function() {
		initParallax();
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

	var addAnimations = () => {
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

	window.addEventListener('load', addAnimations, false);
	window.addEventListener('scroll', addAnimations, false);
	window.addEventListener('DOMContentLoaded', addAnimations, false);

// WP8 Tilt

	var wp8tilt = ( params ) =>  {
		let elem = params.el;

		elem.elemBounding = params.container.getBoundingClientRect();
		elem.perspective = params.container.getBoundingClientRect().height;

		elem.width = elem.elemBounding.width;
		elem.height = elem.elemBounding.height;
		elem.top = elem.elemBounding.top;
		elem.left = elem.elemBounding.left;

		let touchEvent = (function(){
			var testTouch = document.createElement("DIV");
			testTouch.setAttribute('ontouchstart', 'return;');
			var isTouchDevice = (typeof testTouch.ontouchstart == 'function' && window.screenX === 0) ? true : false;
			return (isTouchDevice) ? 'touchmove' : 'mousemove';
			})();


		params.container.addEventListener(touchEvent, function(e){
			e.preventDefault();
			if(e.touches) e = e.touches[0];
			let rotaX = (20/elem.width) * (elem.width/2 -(e.pageX -elem.left));
			let rotaY = (20/elem.height) * (elem.height/2 -(e.pageY -elem.top));
			elem.style.cssText = `transition-duration: 0ms; transform: perspective(${elem.perspective}px) rotateY(${-1*rotaX}deg) rotateX(${rotaY}deg)`;
			}, false);
		};

	window.addEventListener('DOMContentLoaded', function(){
		let container = document.querySelector('.intro');
		wp8tilt({'container': container, 'el': container.querySelector('ARTICLE')});
	}, false);


})();
