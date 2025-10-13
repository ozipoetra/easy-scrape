import easyScrape from './lib/index.js';

const html = `
<ul>
  <li><a href="/anime/1">Naruto</a></li>
  <li><a href="/anime/2">One Piece</a></li>
</ul>
`;

const result = easyScrape(html, {
  anime: {
    listItem: 'li',
    data: {
      title: 'a',         // extracts text from <a>
      link: { selector: 'a', attr: 'href' } // extracts href attribute
    }
  }
});

console.log(result);
