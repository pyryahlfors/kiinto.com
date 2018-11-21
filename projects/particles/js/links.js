let linksContainer = document.createElement("DIV");
linksContainer.className = 'links-holder';

const linkArray = {
  Starfield : 'index.html',
  Sand : 'sand.html',
  Sperm : 'sperm.html',
  Electricity : 'electricity.html',
  Plasma : 'plasma.html',
  Medusa : 'medusa.html',
  Wormhole : 'wormhole.html',
  Walker : 'walker.html'
};

Object.keys(linkArray).forEach((a) => {
	const experimentLink = document.createElement("A");
	experimentLink.setAttribute('href', `./${linkArray[a]}`);
	experimentLink.appendChild(document.createTextNode(a));
	linksContainer.appendChild(experimentLink);
	linksContainer.appendChild(document.createElement('BR'));
	});

document.body.appendChild(linksContainer)
