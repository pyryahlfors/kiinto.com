let linksContainer = document.createElement("DIV");
linksContainer.className = 'links-holder';

const linkArray = {
  Starfield : '/projects/particles/index.html',
  Sand : '/projects/particles/sand.html',
  Sperm : '/projects/particles/sperm.html',
  Electricity : '/projects/particles/electricity.html',
  Plasma : '/projects/particles/plasma.html',
  Medusa : '/projects/particles/medusa.html',
  Wormhole : '/projects/particles/wormhole.html',
  Walker : '/projects/particles/walker.html'
};

Object.keys(linkArray).forEach((a) => {
	const experimentLink = document.createElement("A");
	experimentLink.setAttribute('href', `./${linkArray[a]}`);
	experimentLink.appendChild(document.createTextNode(a));
	linksContainer.appendChild(experimentLink);
	linksContainer.appendChild(document.createElement('BR'));
	});

document.body.appendChild(linksContainer)
