// import { easyScrape } from "easy-scrape";
import { easyScrape } from "./lib/index.js";

const html = `
  <div class="article">
    <h1>Hello World</h1>
    <p class="date">2025-10-14</p>
  </div>
`;

const schema = {
  title: "h1",
  date: {
    selector: ".date",
    convert: (x) => new Date(x),
  },
};

const result = easyScrape(html, schema);
console.log(result);
// { title: "Hello World", date: 2025-10-14T00:00:00.000Z }
