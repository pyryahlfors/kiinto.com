/*jshint esversion: 6 */

(function() {
	if (window.contentful) {
		let client = contentful.createClient({space: 'mtdtfk8wt9f8', accessToken: 'aff9afcceeb8549ff1c488ad9190133337681d2ea0b7c154b229b0246aa980fb'});

		client.getEntries({content_type: 'intro'}).then(function(entry) {
			let nakki = document.querySelector('*[data-fplFragment="intro"]');
			let temp = fpLayout.set(nakki.innerHTML, {
				title: entry.items[0].fields.title,
				ingress: entry.items[0].fields.ingress
			});

			nakki.innerHTML = temp;
		});
	}
})();
