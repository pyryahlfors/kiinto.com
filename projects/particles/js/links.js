let linksContainer = document.createElement("DIV");
linksContainer.className = 'links-holder';

const linkArray = {
  Starfield : '/particles/index.html',
  Sand : '/particles/sand.html',
  Sperm : '/particles/sperm.html',
  Electricity : '/particles/electricity.html',
  Plasma : '/particles/plasma.html',
  Medusa : '/particles/medusa.html',
  Wormhole : '/particles/wormhole.html',
  Walker : '/particles/walker.html'
};

Object.keys(linkArray).forEach((a) => {
	const experimentLink = document.createElement("A");
	experimentLink.setAttribute('href', `${linkArray[a]}`);
	experimentLink.appendChild(document.createTextNode(a));
	linksContainer.appendChild(experimentLink);
	linksContainer.appendChild(document.createElement('BR'));
	});

document.body.appendChild(linksContainer)
