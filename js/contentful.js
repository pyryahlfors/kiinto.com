/*jshint esversion: 6 */

(function() {
	/* Templates */
	let introTemplate = (tmplData) => {
		return `
		<h1>
			${tmplData.title}
		</h1>
		<p>
			${tmplData.ingress}
		</p>
		<a href="#projects" class="button scroll">
			<span class="arrow">
				<span></span>
				<span></span>
			</span>
		</a>
		`;
	};

	let projectTemplate = (tmplData) => {
		return `
			<div class="article-container no-padding project" data-fpParallax="true" data-fpParallaxStrength="0" data-fpParallaxRotateMax="20">
			  <div class="article-content">
				<div class="project-container">
				  <div class="project-info">
					<div class="article-title">
					  <div>
						${tmplData.title.split(" ")[0]}<br />
						<span>${tmplData.title.split(" ")[1]}</span>
					  </div>
					</div>

					<p class="intro-text">
					  ${tmplData.ingress}
					</p>

					<div class="tags">
						<span>${tmplData.tags.join(`</span><span>`)}</span>
					</div>
				  </div>
				</div>
				<div class="hero-container">
					${(tmplData.images && tmplData.images[0]) ? '<img src="https:'+tmplData.images[0].fields.file.url+'" alt="" class="hero" />' : ''}
				  	${tmplData.link ? '<a class="button" href="'+tmplData.link+'">LAUNCH</a>' : ''}
				</div>
			  </div>
			</div>
			`;
		};

	if (window.contentful) {
		let client = contentful.createClient({space: 'mtdtfk8wt9f8', accessToken: 'aff9afcceeb8549ff1c488ad9190133337681d2ea0b7c154b229b0246aa980fb'});

// Get intro text
		client.getEntries({content_type: 'intro'}).then(function(entry) {
			let introPlaceholder = document.querySelector('*[data-fplFragment="intro"]');
			introPlaceholder.innerHTML = [entry.items[0].fields].map(introTemplate).join('');
			});

// Get projects

		let projectsPlaceholder = document.querySelector('*[data-fplFragment="projects"]');
		let temp = "";
		client.getEntries({content_type: 'project'}).then(function(entry) {
			let count = 0;
			entry.items.forEach(function(el){
				if(count === 0) el.fields.isFirst = true;
				temp+=([el.fields].map(projectTemplate).join(''));
				count++;
				});
			docFrag = document.createDocumentFragment();
			let tempNode = document.createElement("span");
			tempNode.innerHTML = temp;
			docFrag.appendChild(tempNode);

			let anchor = document.createElement("A");
			anchor.setAttribute('name', 'projects');
			tempNode.insertBefore(anchor, tempNode.firstChild);

			projectsPlaceholder.parentNode.insertBefore(docFrag, projectsPlaceholder.nextSibling);
			projectsPlaceholder.parentNode.removeChild(projectsPlaceholder);


			var event = new CustomEvent("contentfulFetchDone", {
				detail: {
					ready: true
					}
				});
			document.dispatchEvent(event);
			});
		}
	})();
