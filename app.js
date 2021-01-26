const hoverFetch = require('@nfalcone/hover-fetch');

const addLink = document.querySelector('#addLinks');
const linkList = document.querySelector('.list-of-links');

// Dynamically added links
addLink.addEventListener('click', () => {
  const listItem = document.createElement('li');
  const textNode = document.createTextNode(
    'a dynamically added link',
  );
  const anchor = document.createElement('a');
  listItem.appendChild(textNode);
  anchor.appendChild(listItem);
  anchor.href = 'https://www.example.com/';

  linkList.appendChild(anchor);
});

// Links at build time
const anchors = [...document.querySelectorAll('a')];

// Initiate a prefetch request on hover
anchors.forEach((anchor) => {
  hoverFetch(anchor);
});
