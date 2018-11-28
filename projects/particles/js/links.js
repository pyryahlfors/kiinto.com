let linksContainer = document.createElement("DIV");
linksContainer.className = 'links-holder';

const linkArray = {
  Starfield : 'particles/index.html',
  Sand : 'particles/sand.html',
  Sperm : 'particles/sperm.html',
  Electricity : 'particles/electricity.html',
  Plasma : 'particles/plasma.html',
  'Ascii Plasma' : 'particles/ascii_plasma.html',
  Medusa : 'particles/medusa.html',
  Wormhole : 'particles/wormhole.html',
  Walker : 'particles/walker.html'
};

let navigationToggle = document.createElement('span');
navigationToggle.className = 'menu-trigger';
navigationToggle.addEventListener('click', () => {document.body.classList.toggle('nav-open')}, false);

let navIconContainer = document.createElement('span');
let barTop = document.createElement('i');
barTop.className = 'menu-trigger-bar top';
let barMiddle = document.createElement('i');
barMiddle.className = 'menu-trigger-bar middle';
let barBottom = document.createElement('i');
barBottom.className = 'menu-trigger-bar bottom';

navIconContainer.appendChild(barTop);
navIconContainer.appendChild(barMiddle);
navIconContainer.appendChild(barBottom);

navigationToggle.appendChild(navIconContainer);

document.body.appendChild(navigationToggle);

Object.keys(linkArray).forEach((a) => {
	const experimentLink = document.createElement("A");
	experimentLink.setAttribute('href', `/projects/${linkArray[a]}`);
	experimentLink.appendChild(document.createTextNode(a));
	linksContainer.appendChild(experimentLink);
	linksContainer.appendChild(document.createElement('BR'));
	});

document.body.appendChild(linksContainer);
