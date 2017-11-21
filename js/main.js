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

	// Randomize 'hero' widget
	var widgets = [
		function() {
			starfield.init();
		},
		function() {
			particles.init();
		},
		function() {
			wormhole.init();
		},
		//		function() {medusa.init()}
		//    function(){new plasma()},
		//    function(){walker.init();},
	];

	var rand = Math.round(Math.random() * (widgets.length - 1));
	widgets[rand]();

	var scrollButton = document.querySelector('a.scroll');
	scrollButton.addEventListener('click', function() {
		window.scroll(0, Math.max(document.documentElement.clientHeight, window.innerHeight || 0));
	}, false);
})();

//
function isElementInViewport() {
	var rect = this.getBoundingClientRect();
	return rect.bottom > 0 && rect.right > 0 && rect.left < (window.innerWidth || document.documentElement.clientWidth) && rect.top < (window.innerHeight || document.documentElement.clientHeight);
}(function() {
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

document.querySelector('.snap-container').addEventListener('scroll', addAnimations, false);
window.addEventListener('scroll', addAnimations, false);
window.addEventListener('DOMContentLoaded', addAnimations, false);
