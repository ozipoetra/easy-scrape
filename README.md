# 🕸️ easy-scrape

A minimal and modern HTML parsing utility for Node.js using **Cheerio**.  
Perfect for transforming, testing, or scraping existing HTML content safely and efficiently.

---

## ✨ Features

- ⚡ **Fast & lightweight** – Uses `cheerio` under the hood  
- 🧩 **Modular** – Just a single function that parses HTML  
- 💡 **Flexible** – Works with both simple selectors and complex structures  
- 🔥 **ESM only** – Modern import syntax, no CommonJS support  

---

## 📦 Installation

```bash
npm install easy-scrape
````

or

```bash
pnpm add easy-scrape
# or
yarn add easy-scrape
```

---

## 🪄 Quick Start

```js
import easyScrape from "easy-scrape";

// Example HTML
const html = `
<html>
  <body>
    <h1>Hello World</h1>
    <p>Welcome to easy-scrape!</p>
  </body>
</html>
`;

// Extract only <h1> text
const result = easyScrape(html, {
  header: 'h1',
});

console.log(result);
```

### Output

```json
{
  "header": "Hello World"
}
```

---

## ⚙️ API Reference

### `easyScrape(html, schema)`

The main function that parses HTML content using a selector-based schema.

#### **Parameters**

| Name     | Type     | Required | Description                         |
| -------- | -------- | -------- | ----------------------------------- |
| `html`   | `string` | ✅        | HTML string to parse                |
| `schema` | `object` | ✅        | Schema defining how to extract data |

---

### **Schema Options**

| Option      | Type                                  | Description                                                   |
| ----------- | ------------------------------------- | ------------------------------------------------------------- |
| `selector`  | `string`                              | CSS selector to locate elements                               |
| `listItem`  | `string`                              | CSS selector for repeating elements (lists)                   |
| `data`      | `object`                              | Nested schema for complex structures                          |
| `attr`      | `string`                              | Extract a specific attribute instead of text (e.g., `"href"`) |
| `how`       | `"text"` | `"html"` | `function($el)` | How to extract the value                                      |
| `convert`   | `function(value, $el)`                | Transform the extracted value                                 |
| `trimValue` | `boolean`                             | Trim whitespace (default: `true`)                             |
| `closest`   | `string`                              | Get the closest ancestor matching the selector                |
| `eq`        | `number`                              | Select a specific element by index                            |
| `texteq`    | `number`                              | Select the nth text node child                                |
| `map`       | `function($el, $)`                    | Custom mapping function for each element                      |

> ⚠️ Every field must have either `selector`, `listItem`, or `map` defined.

---

## 🧠 Example: Using `listItem` and `data`

```js
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
      title: 'a',
      link: { selector: 'a', attr: 'href' }
    }
  }
});

console.log(result);
```

Output:

```json
{
  "anime": [
    { "title": "Naruto", "link": "/anime/1" },
    { "title": "One Piece", "link": "/anime/2" }
  ]
}
```

---

## 🗺️ Example: Using `map` for Custom Extraction

```js
import easyScrape from './lib/index.js';

const html = `
<ul>
  <li><a href="/anime/1">Naruto</a></li>
  <li><a href="/anime/2">One Piece</a></li>
  <li><a href="/anime/3">Bleach</a></li>
</ul>
`;

const result = easyScrape(html, {
  anime: {
    selector: 'li', // must define selector or listItem
    map: ($el) => ({
      title: $el.find('a').text(),
      link: $el.find('a').attr('href')
    })
  }
});

console.log(result);
```

Output:

```json
{
  "anime": [
    { "title": "Naruto", "link": "/anime/1" },
    { "title": "One Piece", "link": "/anime/2" },
    { "title": "Bleach", "link": "/anime/3" }
  ]
}
```

> 💡 `map` allows full control of each element and can skip items by returning `null` or `undefined`.

---

## 🧩 Nested Scraping Example

```js
const html = `
<div class="article">
  <h2>My Blog Post</h2>
  <ul class="tags">
    <li>JavaScript</li>
    <li>Node.js</li>
  </ul>
</div>
`;

const result = easyScrape(html, {
  listItem: '.article',
  data: {
    title: 'h2',
    tags: {
      listItem: '.tags li',
      how: 'text'
    }
  }
});

console.log(result);
```

Output:

```json
{
  "data": [
    {
      "title": "My Blog Post",
      "tags": ["JavaScript", "Node.js"]
    }
  ]
}
```

---

## 🧪 Development

Clone and test locally:

```bash
git clone https://github.com/ozipoetra/easy-scrape.git
cd easy-scrape
npm install
npm test
```

## Note
```
This code is made possible by IonicaBizau with a lot of changes that I need and some additional features.
```