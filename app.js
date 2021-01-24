const hoverFetch = require('@nfalcone/hover-fetch');

const addLink = document.querySelector('#addLinks');
const linkList = document.querySelector('.list-of-links');

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

const anchors = [...document.querySelectorAll('a')];

anchors.forEach((anchor) => {
  hoverFetch(anchor);
});
