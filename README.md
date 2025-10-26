# Easy Scrape

A powerful and flexible HTML scraping library built on top of Cheerio. Easy Scrape provides a declarative way to extract data from HTML with support for nested structures, transformations, advanced filtering, and much more.

## Features

✨ **Simple & Declarative** - Define your scraping schema in plain JavaScript objects  
🎯 **Flexible Selectors** - Use CSS selectors to target any element  
🔄 **Data Transformation** - Built-in conversion and transformation pipeline  
📋 **List Handling** - Easy extraction of arrays and nested lists  
🎨 **Multiple Extraction Modes** - Text, HTML, attributes, or custom functions  
🔍 **Advanced Filtering** - Filter elements before extraction  
🧭 **Navigation** - Parent, siblings, and ancestor traversal  
🌐 **URL Resolution** - Automatically resolve relative URLs  
📊 **Table Parsing** - Built-in support for HTML tables  
✅ **Validation** - Validate extracted data with custom functions  
🎭 **Conditional Extraction** - Extract based on conditions  
🛠️ **Helper Functions** - Common transformations included (toNumber, toDate, etc.)  
📦 **Presets** - Ready-to-use patterns for common tasks  
🛡️ **Error Handling** - Strict mode for validation or graceful fallbacks  
📘 **TypeScript Support** - Full TypeScript definitions included

## Installation

```bash
npm install easy-scrape
```

## Quick Start

```javascript
import { easyScrape } from 'easy-scrape';

const html = `
  <div class="product">
    <h2>Laptop</h2>
    <span class="price">$999</span>
  </div>
`;

const result = easyScrape(html, {
  title: 'h2',
  price: '.price'
});

console.log(result);
// { title: 'Laptop', price: '$999' }
```

## Table of Contents

- [API Reference](#api-reference)
- [Schema Options](#schema-options)
  - [Basic Options](#basic-options)
  - [Data Transformation](#data-transformation)
  - [Element Selection & Navigation](#element-selection--navigation)
  - [Lists and Arrays](#lists-and-arrays)
  - [Advanced Features](#advanced-features)
  - [Conditional Extraction](#conditional-extraction)
  - [Array Operations](#array-operations)
  - [Validation](#validation)
  - [Table Parsing](#table-parsing)
- [Helper Functions](#helper-functions)
- [Presets](#presets)
- [Complex Examples](#complex-examples)
- [TypeScript Support](#typescript-support)

## API Reference

### `easyScrape(input, schema, options?)`

**Parameters:**
- `input` - HTML string or Cheerio instance
- `schema` - Scraping schema defining what to extract
- `options` (optional) - Parsing options

**Returns:** Object with extracted data

### Parsing Options

#### `baseUrl` (string)
Base URL for resolving relative URLs when `resolveUrl` is used.

```javascript
const result = easyScrape(html, schema, {
  baseUrl: 'https://example.com'
});
```

#### `xmlMode` (boolean)
Parse as XML instead of HTML.

```javascript
const xml = `<?xml version="1.0"?><root><item>Value</item></root>`;

const result = easyScrape(xml, {
  value: 'item'
}, {
  xmlMode: true
});
// { value: 'Value' }
```

#### `decodeEntities` (boolean)
Decode HTML entities. Default: `true`.

#### `cheerioOptions` (object)
Additional Cheerio load options.

## Schema Options

### Basic Options

#### `selector` (string)
CSS selector to find the element(s).

```javascript
const result = easyScrape(html, {
  title: {
    selector: '.title'
  }
});
```

Or use shorthand:
```javascript
const result = easyScrape(html, {
  title: '.title'  // String shorthand
});
```

#### `attr` (string)
Extract a specific attribute value.

```javascript
const html = `<a href="https://example.com" class="link">Click</a>`;

const result = easyScrape(html, {
  url: {
    selector: '.link',
    attr: 'href'
  }
});
// { url: 'https://example.com' }
```

#### `attrs` (string[])
Extract multiple attributes as an object.

```javascript
const html = `<a href="/page" class="nav-link" title="Go to page">Link</a>`;

const result = easyScrape(html, {
  linkData: {
    selector: '.nav-link',
    attrs: ['href', 'class', 'title']
  }
});
// { linkData: { href: '/page', class: 'nav-link', title: 'Go to page' } }
```

#### `html` (boolean)
Extract inner HTML instead of text.

```javascript
const html = `<div class="box"><strong>Bold</strong> text</div>`;

const result = easyScrape(html, {
  content: {
    selector: '.box',
    html: true
  }
});
// { content: '<strong>Bold</strong> text' }
```

#### `outerHtml` (boolean)
Extract outer HTML including the element itself.

```javascript
const html = `<div class="container"><p>Text</p></div>`;

const result = easyScrape(html, {
  fullHtml: {
    selector: 'p',
    outerHtml: true
  }
});
// { fullHtml: '<p>Text</p>' }
```

#### `textMode` (string)
Control how text is extracted. Options: `'text'` (default), `'ownText'`, `'deepText'`.

```javascript
const html = `<div class="wrapper">Direct text<span>Nested text</span>More direct</div>`;

const result = easyScrape(html, {
  allText: {
    selector: '.wrapper',
    textMode: 'text'  // All text including descendants
  },
  ownText: {
    selector: '.wrapper',
    textMode: 'ownText'  // Only direct text nodes
  }
});
// { allText: 'Direct textNested textMore direct', ownText: 'Direct textMore direct' }
```

#### `separator` (string)
Join multiple text nodes with a separator.

```javascript
const html = `<div class="list">Apple<br>Banana<br>Cherry</div>`;

const result = easyScrape(html, {
  joined: {
    selector: '.list',
    separator: ', '
  }
});
// { joined: 'Apple, Banana, Cherry' }
```

#### `trimValue` (boolean)
Whether to trim whitespace from extracted values. Default: `true`.

#### `resolveUrl` (boolean)
Resolve relative URLs to absolute using `baseUrl` option.

```javascript
const html = `<a href="/about">About</a>`;

const result = easyScrape(html, {
  url: {
    selector: 'a',
    attr: 'href',
    resolveUrl: true
  }
}, {
  baseUrl: 'https://example.com'
});
// { url: 'https://example.com/about' }
```

### Data Transformation

#### `convert` (function)
Transform the extracted value.

```javascript
const html = `<span class="price">$99.99</span>`;

const result = easyScrape(html, {
  price: {
    selector: '.price',
    convert: (value) => parseFloat(value.replace('$', ''))
  }
});
// { price: 99.99 }
```

#### `transform` (function | function[])
Apply transformation pipeline after conversion.

```javascript
const html = `<span class="amount">  100  </span>`;

const result = easyScrape(html, {
  amount: {
    selector: '.amount',
    transform: [
      (val) => val.trim(),
      (val) => parseInt(val),
      (val) => val * 2
    ]
  }
});
// { amount: 200 }
```

#### `how` (string | function)
Custom extraction method.

```javascript
const html = `<div class="item" data-id="123">Item</div>`;

const result = easyScrape(html, {
  itemId: {
    selector: '.item',
    how: ($el) => $el.attr('data-id')
  }
});
// { itemId: '123' }
```

### Element Selection & Navigation

#### `eq` (number)
Select a specific element by index (0-based).

```javascript
const html = `
  <ul>
    <li>First</li>
    <li>Second</li>
    <li>Third</li>
  </ul>
`;

const result = easyScrape(html, {
  secondItem: {
    selector: 'li',
    eq: 1
  }
});
// { secondItem: 'Second' }
```

#### `texteq` (number)
Select a specific text node by index.

```javascript
const html = `<div>Text1<span>Span</span>Text2</div>`;

const result = easyScrape(html, {
  firstText: { selector: 'div', texteq: 0 },
  secondText: { selector: 'div', texteq: 1 }
});
// { firstText: 'Text1', secondText: 'Text2' }
```

#### `closest` (string)
Find the closest ancestor matching the selector.

```javascript
const html = `
  <div class="container">
    <div class="item">
      <span class="text">Click</span>
    </div>
  </div>
`;

const result = easyScrape(html, {
  containerClass: {
    selector: '.text',
    closest: '.container',
    how: ($el) => $el.attr('class')
  }
});
// { containerClass: 'container' }
```

#### `parent` (number | string)
Navigate to parent element(s).
- **Number**: Move up N levels
- **String**: Find parent matching selector

```javascript
const html = `
  <div class="grandparent">
    <div class="parent">
      <span class="child">Text</span>
    </div>
  </div>
`;

const result = easyScrape(html, {
  parentText: {
    selector: '.child',
    parent: 1  // Go up 1 level
  },
  grandparentText: {
    selector: '.child',
    parent: 2  // Go up 2 levels
  }
});
```

#### `parents` (string)
Find ancestor element matching selector.

```javascript
const result = easyScrape(html, {
  outerDiv: {
    selector: '.child',
    parents: '.grandparent'
  }
});
```

#### `siblings` (string)
Navigate to sibling elements. Options: `'next'`, `'prev'`, `'nextAll'`, `'prevAll'`.

```javascript
const html = `
  <div>
    <span class="first">First</span>
    <span class="target">Target</span>
    <span class="last">Last</span>
  </div>
`;

const result = easyScrape(html, {
  nextSibling: {
    selector: '.target',
    siblings: 'next'
  },
  prevSibling: {
    selector: '.target',
    siblings: 'prev'
  }
});
// { nextSibling: 'Last', prevSibling: 'First' }
```

#### `siblingSelector` (string)
Filter siblings by selector.

```javascript
const result = easyScrape(html, {
  nextItems: {
    selector: '.marker',
    siblings: 'nextAll',
    siblingSelector: '.item',
    multiple: true
  }
});
```

### Lists and Arrays

#### `listItem` (string)
Extract an array of items with nested data.

```javascript
const html = `
  <ul>
    <li class="item">
      <span class="name">Item 1</span>
      <span class="value">10</span>
    </li>
    <li class="item">
      <span class="name">Item 2</span>
      <span class="value">20</span>
    </li>
  </ul>
`;

const result = easyScrape(html, {
  items: {
    listItem: '.item',
    data: {
      name: '.name',
      value: {
        selector: '.value',
        convert: (v) => parseInt(v)
      }
    }
  }
});
// { items: [{ name: 'Item 1', value: 10 }, { name: 'Item 2', value: 20 }] }
```

#### `multiple` (boolean)
Extract all matching elements as an array.

```javascript
const html = `
  <span class="tag">JS</span>
  <span class="tag">CSS</span>
  <span class="tag">HTML</span>
`;

const result = easyScrape(html, {
  tags: {
    selector: '.tag',
    multiple: true
  }
});
// { tags: ['JS', 'CSS', 'HTML'] }
```

#### `includeIndex` (boolean)
Add `_index` property to list items.

```javascript
const result = easyScrape(html, {
  fruits: {
    listItem: 'li',
    includeIndex: true
  }
});
// { fruits: [{ text: 'Apple', _index: 0 }, { text: 'Banana', _index: 1 }, ...] }
```

### Advanced Features

#### `map` (function)
Map over elements with custom transformation.

```javascript
const html = `
  <div class="product">Product 1</div>
  <div class="product">Product 2</div>
  <div class="product">Product 3</div>
`;

const result = easyScrape(html, {
  products: {
    selector: '.product',
    map: ($el, $, index) => ({
      id: index + 1,
      name: $el.text(),
      upper: $el.text().toUpperCase()
    })
  }
});
// { products: [{ id: 1, name: 'Product 1', upper: 'PRODUCT 1' }, ...] }
```

**Filtering within map:** Return `null` or `undefined` to exclude items.

```javascript
const result = easyScrape(html, {
  expensive: {
    selector: '.item',
    map: ($el) => {
      const price = parseInt($el.attr('data-price'));
      if (price < 50) return null;  // Filter out
      return { name: $el.text(), price };
    }
  }
});
```

#### `filter` (function)
Filter elements before extraction.

```javascript
const html = `
  <div class="item active">Active 1</div>
  <div class="item">Inactive</div>
  <div class="item active">Active 2</div>
`;

const result = easyScrape(html, {
  activeItems: {
    selector: '.item',
    filter: ($el) => $el.hasClass('active'),
    multiple: true
  }
});
// { activeItems: ['Active 1', 'Active 2'] }
```

#### `regex` (RegExp) & `regexGroup` (number)
Extract data using regular expressions.

```javascript
const html = `<div class="price">Price: $99.99 USD</div>`;

const result = easyScrape(html, {
  amount: {
    selector: '.price',
    regex: /\$(\d+\.\d+)/,
    regexGroup: 1,  // Capture group (default: 0)
    convert: (val) => parseFloat(val)
  }
});
// { amount: 99.99 }
```

### Conditional Extraction

#### `if` (function)
Only extract if condition function returns true.

```javascript
const html = `<div class="product" data-available="true"><span class="price">$50</span></div>`;

const result = easyScrape(html, {
  price: {
    selector: '.price',
    if: ($) => $('.product').attr('data-available') === 'true'
  }
});
// { price: '$50' }
```

#### `ifExists` (string)
Only extract if selector exists in context.

```javascript
const html = `
  <div class="container">
    <span class="badge">New</span>
    <span class="price">$99</span>
  </div>
`;

const result = easyScrape(html, {
  price: {
    selector: '.price',
    ifExists: '.badge'  // Only extract if badge exists
  }
});
// { price: '$99' }
```

#### `ifNotExists` (string)
Only extract if selector does NOT exist.

```javascript
const result = easyScrape(html, {
  regularPrice: {
    selector: '.regular-price',
    ifNotExists: '.sale-price'
  }
});
```

### Array Operations

Array operations are applied in this order: `unique` → `slice` → `limit` → `flatten`

#### `unique` (boolean)
Remove duplicate values from array.

```javascript
const html = `
  <div class="tag">JavaScript</div>
  <div class="tag">Python</div>
  <div class="tag">JavaScript</div>
`;

const result = easyScrape(html, {
  uniqueTags: {
    selector: '.tag',
    multiple: true,
    unique: true
  }
});
// { uniqueTags: ['JavaScript', 'Python'] }
```

#### `slice` (array)
Array slice operation `[start, end]`.

```javascript
const result = easyScrape(html, {
  middleItems: {
    selector: '.item',
    multiple: true,
    slice: [1, 4]  // Get items at index 1, 2, 3
  }
});
```

#### `limit` (number)
Limit number of items in array.

```javascript
const result = easyScrape(html, {
  topItems: {
    selector: '.item',
    multiple: true,
    limit: 3  // Only get first 3 items
  }
});
```

#### `flatten` (boolean | number)
Flatten nested arrays.

```javascript
const result = easyScrape(html, {
  allTags: {
    listItem: '.category',
    data: {
      tags: {
        selector: '.tag',
        multiple: true
      }
    },
    flatten: true  // Flatten one level
  }
});
```

**Combining array operations:**

```javascript
const result = easyScrape(html, {
  topUnique: {
    selector: '.item',
    multiple: true,
    unique: true,    // Remove duplicates first
    limit: 3         // Then take first 3
  }
});
```

### Validation

#### `validate` (function)
Validate extracted value with custom function.

```javascript
const html = `<div class="email">user@example.com</div>`;

const result = easyScrape(html, {
  email: {
    selector: '.email',
    validate: (value) => value.includes('@')
  }
});
// { email: 'user@example.com' }
```

#### `required` (boolean)
Field is required - throws error if missing or empty.

```javascript
try {
  const result = easyScrape(html, {
    title: {
      selector: '.missing-title',
      required: true  // Will throw error
    }
  });
} catch (error) {
  console.error('Required field missing:', error.message);
}
```

### Table Parsing

Extract data from HTML tables.

```javascript
const html = `
  <table class="data-table">
    <tr>
      <th>Name</th>
      <th>Age</th>
      <th>City</th>
    </tr>
    <tr>
      <td>John</td>
      <td>30</td>
      <td>NYC</td>
    </tr>
    <tr>
      <td>Jane</td>
      <td>25</td>
      <td>LA</td>
    </tr>
  </table>
`;

const result = easyScrape(html, {
  users: {
    selector: '.data-table',
    table: {
      headers: true,
      selector: 'tr'
    }
  }
});
/*
{
  users: [
    { "Name": "John", "Age": "30", "City": "NYC" },
    { "Name": "Jane", "Age": "25", "City": "LA" }
  ]
}
*/
```

**Without headers:**

```javascript
const result = easyScrape(html, {
  data: {
    selector: 'table',
    table: {
      headers: false
    }
  }
});
// { data: [['Item 1', 'Value 1'], ['Item 2', 'Value 2']] }
```

**Custom table conversion:**

```javascript
const result = easyScrape(html, {
  specs: {
    selector: '.spec-table',
    table: {
      headers: false
    },
    convert: (rows) => {
      const specs = {};
      rows.forEach(row => {
        if (row.length >= 2) {
          specs[row[0]] = row[1];
        }
      });
      return specs;
    }
  }
});
// { specs: { "CPU": "Intel i7", "RAM": "16GB" } }
```

### Error Handling

#### `default` (any)
Default value when element is not found.

```javascript
const result = easyScrape(html, {
  missing: {
    selector: '.not-exist',
    default: 'Not Found'
  }
});
```

#### `strict` (boolean)
Throw errors instead of returning null. Default: `false`.

```javascript
try {
  const result = easyScrape(html, {
    required: {
      selector: '.not-exist',
      strict: true  // Will throw error
    }
  });
} catch (error) {
  console.error('Missing required field:', error.message);
}
```

### Nested Data

Extract nested objects using the `data` property.

```javascript
const html = `
  <div class="card">
    <h2 class="title">Product</h2>
    <div class="meta">
      <span class="price">$50</span>
      <span class="stock">In Stock</span>
    </div>
  </div>
`;

const result = easyScrape(html, {
  product: {
    selector: '.card',
    data: {
      title: '.title',
      price: '.price',
      stock: '.stock'
    }
  }
});
// { product: { title: 'Product', price: '$50', stock: 'In Stock' } }
```

## Helper Functions

Easy Scrape includes common transformation helpers:

```javascript
import { easyScrape, helpers } from 'easy-scrape';

const result = easyScrape(html, {
  price: {
    selector: '.price',
    convert: helpers.toNumber  // Parse number from "$1,234.56"
  },
  isAvailable: {
    selector: '.status',
    convert: helpers.toBoolean  // Convert "yes" to true
  },
  publishDate: {
    selector: 'time',
    attr: 'datetime',
    convert: helpers.toDate  // Convert to Date object
  }
});
```

### Available Helpers

- **`helpers.toNumber(val)`** - Parse number from string (removes non-numeric chars)
- **`helpers.toInt(val)`** - Parse integer from string
- **`helpers.toBoolean(val)`** - Convert to boolean (accepts: true, yes, 1, on)
- **`helpers.toDate(val)`** - Convert to Date object
- **`helpers.extractUrl(val)`** - Extract first URL from text
- **`helpers.extractEmail(val)`** - Extract first email from text
- **`helpers.stripHtml(html)`** - Remove HTML tags
- **`helpers.parseJson(val)`** - Parse JSON string
- **`helpers.capitalize(val)`** - Capitalize first letter
- **`helpers.slug(val)`** - Convert to URL-friendly slug

**Example:**

```javascript
const html = `
  <div class="data">
    <span class="price">$1,234.56</span>
    <span class="status">yes</span>
    <span class="email">Contact: admin@site.com</span>
  </div>
`;

const result = easyScrape(html, {
  price: { selector: '.price', convert: helpers.toNumber },
  isActive: { selector: '.status', convert: helpers.toBoolean },
  email: { selector: '.email', convert: helpers.extractEmail }
});
// { price: 1234.56, isActive: true, email: 'admin@site.com' }
```

## Presets

Ready-to-use patterns for common scraping tasks:

```javascript
import { easyScrape, presets } from 'easy-scrape';

const result = easyScrape(html, {
  logo: presets.image('.logo'),
  aboutLink: presets.link('.nav a'),
  description: presets.meta('description'),
  ogImage: presets.ogMeta('image'),
  structuredData: presets.jsonLd()
});
```

### Available Presets

- **`presets.link(selector)`** - Extract href from link
- **`presets.image(selector)`** - Extract src and alt from image
- **`presets.meta(name)`** - Extract meta tag content by name
- **`presets.ogMeta(property)`** - Extract Open Graph meta tag
- **`presets.twitterMeta(name)`** - Extract Twitter Card meta tag
- **`presets.jsonLd(selector)`** - Extract and parse JSON-LD structured data

**Example:**

```javascript
const html = `
  <head>
    <meta name="description" content="Page description">
    <meta property="og:title" content="Page Title">
    <script type="application/ld+json">
    {"@type": "Product", "name": "Widget"}
    </script>
  </head>
  <body>
    <img src="/logo.png" alt="Company Logo">
    <a href="/about">About</a>
  </body>
`;

const result = easyScrape(html, {
  logo: presets.image('img'),
  aboutLink: presets.link('a'),
  description: presets.meta('description'),
  ogTitle: presets.ogMeta('title'),
  productData: presets.jsonLd()
});
/*
{
  logo: { src: '/logo.png', alt: 'Company Logo' },
  aboutLink: '/about',
  description: 'Page description',
  ogTitle: 'Page Title',
  productData: { '@type': 'Product', name: 'Widget' }
}
*/
```

## Complex Examples

### E-commerce Product Scraping

```javascript
const result = easyScrape(html, {
  products: {
    listItem: '.product',
    data: {
      id: {
        selector: '',
        how: ($el) => $el.attr('data-id'),
        convert: helpers.toInt
      },
      title: '.title',
      price: {
        selector: '.price',
        convert: helpers.toNumber
      },
      originalPrice: {
        selector: '.original-price',
        convert: helpers.toNumber,
        default: null
      },
      discount: {
        selector: '.discount',
        regex: /(\d+)%/,
        regexGroup: 1,
        convert: helpers.toInt,
        ifExists: '.discount'
      },
      rating: {
        selector: '.rating',
        attr: 'data-rating',
        convert: helpers.toNumber
      },
      inStock: {
        selector: '.stock-status',
        convert: helpers.toBoolean
      },
      images: {
        selector: '.gallery img',
        multiple: true,
        attr: 'src',
        resolveUrl: true
      },
      features: {
        selector: '.features li',
        multiple: true
      }
    }
  }
}, {
  baseUrl: 'https://example.com'
});
```

### Blog Article Extraction

```javascript
const result = easyScrape(html, {
  article: {
    selector: 'article',
    data: {
      title: 'h1',
      author: {
        selector: '.author',
        regex: /By (.+)/,
        regexGroup: 1
      },
      publishDate: {
        selector: 'time',
        attr: 'datetime',
        convert: helpers.toDate
      },
      readTime: {
        selector: '.read-time',
        regex: /(\d+)/,
        regexGroup: 1,
        convert: helpers.toInt
      },
      tags: {
        selector: '.tag',
        multiple: true
      },
      content: {
        selector: '.article-body',
        html: true
      },
      headings: {
        selector: 'h2, h3',
        multiple: true
      },
      relatedPosts: {
        selector: '.related a',
        map: ($el) => ({
          title: $el.text(),
          url: $el.attr('href')
        }),
        limit: 5
      }
    }
  }
});
```

### Complete E-commerce Page

```javascript
const result = easyScrape(html, {
  // Meta data
  meta: {
    selector: 'head',
    data: {
      description: presets.meta('description'),
      ogImage: {
        ...presets.ogMeta('image'),
        resolveUrl: true
      },
      structuredData: presets.jsonLd()
    }
  },
  
  // Navigation
  breadcrumb: {
    selector: '.breadcrumb a',
    map: ($el) => ({
      text: $el.text(),
      url: $el.attr('href')
    })
  },
  
  // Product details
  title: '.product-title',
  
  images: {
    selector: '.gallery img',
    multiple: true,
    attr: 'src',
    resolveUrl: true
  },
  
  pricing: {
    selector: '.pricing',
    data: {
      current: {
        selector: '.sale-price',
        convert: helpers.toNumber,
        required: true
      },
      original: {
        selector: '.original-price',
        convert: helpers.toNumber,
        ifExists: '.sale-price'
      },
      savings: {
        selector: '.discount',
        regex: /\$(\d+)/,
        regexGroup: 1,
        convert: helpers.toNumber
      }
    }
  },
  
  availability: {
    selector: '.stock-info',
    data: {
      inStock: {
        selector: '',
        how: ($el) => $el.attr('data-available'),
        convert: helpers.toBoolean
      },
      quantity: {
        selector: '.quantity',
        regex: /(\d+)/,
        regexGroup: 1,
        convert: helpers.toInt
      }
    }
  },
  
  specifications: {
    selector: '.spec-table',
    table: {
      headers: false
    },
    convert: (rows) => {
      const specs = {};
      rows.forEach(([key, value]) => {
        specs[key] = value;
      });
      return specs;
    }
  },
  
  reviews: {
    listItem: '.review',
    data: {
      author: '.author',
      rating: {
        selector: '.rating',
        attr: 'data-rating',
        convert: helpers.toInt
      },
      comment: '.comment',
      date: {
        selector: 'time',
        attr: 'datetime',
        convert: helpers.toDate
      },
      helpful: {
        selector: '.helpful-count',
        regex: /(\d+)/,
        regexGroup: 1,
        convert: helpers.toInt,
        default: 0
      }
    },
    // Only show reviews with 4+ stars
    filter: ($el) => parseInt($el.find('.rating').attr('data-rating')) >= 4,
    limit: 10
  }
}, {
  baseUrl: 'https://shop.example.com'
});
```

### Social Media Profile Scraping

```javascript
const result = easyScrape(html, {
  profile: {
    selector: '.profile-card',
    data: {
      name: '.profile-name',
      username: {
        selector: '.username',
        regex: /@(.+)/,
        regexGroup: 1
      },
      bio: '.bio',
      avatar: {
        selector: '.avatar',
        attr: 'src',
        resolveUrl: true
      },
      stats: {
        selector: '.stats',
        data: {
          followers: {
            selector: '.followers-count',
            convert: helpers.toNumber
          },
          following: {
            selector: '.following-count',
            convert: helpers.toNumber
          },
          posts: {
            selector: '.posts-count',
            convert: helpers.toNumber
          }
        }
      },
      verified: {
        selector: '.verified-badge',
        how: ($el) => $el.length > 0,
        default: false
      },
      links: {
        selector: '.profile-links a',
        map: ($el) => ({
          text: $el.text(),
          url: $el.attr('href')
        })
      }
    }
  },
  
  posts: {
    listItem: '.post',
    data: {
      id: {
        selector: '',
        how: ($el) => $el.attr('data-post-id')
      },
      content: '.post-content',
      timestamp: {
        selector: 'time',
        attr: 'datetime',
        convert: helpers.toDate
      },
      likes: {
        selector: '.likes-count',
        convert: helpers.toNumber
      },
      comments: {
        selector: '.comments-count',
        convert: helpers.toNumber
      },
      media: {
        selector: '.post-media img',
        multiple: true,
        attr: 'src'
      },
      hashtags: {
        selector: '.hashtag',
        multiple: true,
        unique: true
      }
    },
    limit: 20
  }
});
```

### News Article Aggregation

```javascript
const result = easyScrape(html, {
  articles: {
    listItem: 'article.news-item',
    data: {
      headline: 'h2',
      summary: '.summary',
      category: {
        selector: '.category',
        convert: (val) => val.trim().toUpperCase()
      },
      author: {
        selector: '.author',
        ifExists: '.author'
      },
      publishDate: {
        selector: 'time',
        attr: 'datetime',
        convert: helpers.toDate
      },
      url: {
        selector: 'a',
        attr: 'href',
        resolveUrl: true
      },
      thumbnail: {
        selector: 'img',
        attr: 'src',
        resolveUrl: true
      },
      readTime: {
        selector: '.read-time',
        regex: /(\d+)/,
        regexGroup: 1,
        convert: helpers.toInt,
        default: null
      },
      isPremium: {
        selector: '.premium-badge',
        how: ($el) => $el.length > 0,
        default: false
      }
    },
    // Filter out old articles (older than 7 days)
    filter: ($el) => {
      const dateStr = $el.find('time').attr('datetime');
      const date = new Date(dateStr);
      const daysDiff = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }
  }
});
```

### Restaurant Menu Scraping

```javascript
const result = easyScrape(html, {
  restaurant: {
    selector: '.restaurant-info',
    data: {
      name: 'h1',
      cuisine: '.cuisine-type',
      rating: {
        selector: '.rating',
        attr: 'data-rating',
        convert: helpers.toNumber
      },
      priceRange: '.price-range',
      address: '.address',
      phone: {
        selector: '.phone',
        convert: (val) => val.replace(/\D/g, '')
      }
    }
  },
  
  menu: {
    listItem: '.menu-category',
    data: {
      category: '.category-name',
      items: {
        listItem: '.menu-item',
        data: {
          name: '.item-name',
          description: '.item-description',
          price: {
            selector: '.price',
            convert: helpers.toNumber
          },
          calories: {
            selector: '.calories',
            regex: /(\d+)/,
            regexGroup: 1,
            convert: helpers.toInt,
            default: null
          },
          isVegetarian: {
            selector: '.veg-icon',
            how: ($el) => $el.length > 0,
            default: false
          },
          isSpicy: {
            selector: '.spicy-icon',
            how: ($el) => $el.length > 0,
            default: false
          },
          allergens: {
            selector: '.allergen',
            multiple: true,
            default: []
          }
        }
      }
    }
  }
});
```

## Use Cases

### Scraping E-commerce Sites

```javascript
const productData = easyScrape(html, {
  products: {
    listItem: '.product-card',
    data: {
      name: '.product-name',
      price: {
        selector: '.price',
        convert: helpers.toNumber
      },
      rating: {
        selector: '.rating',
        attr: 'data-rating',
        convert: helpers.toNumber
      },
      inStock: {
        selector: '.stock-status',
        convert: helpers.toBoolean
      }
    }
  }
});
```

### Extracting Article Metadata

```javascript
const article = easyScrape(html, {
  title: 'h1',
  author: '.author-name',
  publishDate: {
    selector: 'time',
    attr: 'datetime',
    convert: helpers.toDate
  },
  tags: {
    selector: '.tag',
    multiple: true
  },
  content: {
    selector: '.article-body',
    html: true
  }
});
```

### Job Listings Scraper

```javascript
const jobs = easyScrape(html, {
  listings: {
    listItem: '.job-listing',
    data: {
      title: '.job-title',
      company: '.company-name',
      location: '.location',
      salary: {
        selector: '.salary',
        regex: /\$([\d,]+)\s*-\s*\$([\d,]+)/,
        convert: (val) => {
          const match = val.match(/\$([\d,]+)\s*-\s*\$([\d,]+)/);
          if (match) {
            return {
              min: parseInt(match[1].replace(/,/g, '')),
              max: parseInt(match[2].replace(/,/g, ''))
            };
          }
          return null;
        }
      },
      type: '.job-type',
      remote: {
        selector: '.remote-badge',
        how: ($el) => $el.length > 0,
        default: false
      },
      postedDate: {
        selector: '.posted-date',
        attr: 'data-date',
        convert: helpers.toDate
      },
      description: '.job-description',
      requirements: {
        selector: '.requirements li',
        multiple: true
      },
      benefits: {
        selector: '.benefits li',
        multiple: true
      }
    }
  }
});
```

### Real Estate Listings

```javascript
const properties = easyScrape(html, {
  listings: {
    listItem: '.property-card',
    data: {
      address: '.address',
      price: {
        selector: '.price',
        convert: helpers.toNumber
      },
      bedrooms: {
        selector: '.bedrooms',
        regex: /(\d+)/,
        regexGroup: 1,
        convert: helpers.toInt
      },
      bathrooms: {
        selector: '.bathrooms',
        regex: /(\d+\.?\d*)/,
        regexGroup: 1,
        convert: helpers.toNumber
      },
      sqft: {
        selector: '.sqft',
        convert: helpers.toNumber
      },
      images: {
        selector: '.gallery img',
        multiple: true,
        attr: 'src',
        limit: 10
      },
      features: {
        selector: '.features li',
        multiple: true
      },
      description: '.description',
      listingUrl: {
        selector: 'a.property-link',
        attr: 'href',
        resolveUrl: true
      }
    }
  }
}, {
  baseUrl: 'https://realestate.example.com'
});
```

## TypeScript Support

Easy Scrape includes full TypeScript definitions:

```typescript
import { easyScrape, ScrapeSchema, ScrapeOptions, helpers } from 'easy-scrape';

interface Product {
  title: string;
  price: number;
  inStock: boolean;
}

const schema: ScrapeSchema = {
  products: {
    listItem: '.product',
    data: {
      title: '.title',
      price: {
        selector: '.price',
        convert: helpers.toNumber
      },
      inStock: {
        selector: '.stock',
        convert: helpers.toBoolean
      }
    }
  }
};

const result = easyScrape(html, schema);
const products: Product[] = result.products;
```

### Type-safe Options

```typescript
import { ScrapeOptions, HowFunction, ConvertFunction } from 'easy-scrape';

const customHow: HowFunction = ($el) => $el.attr('data-id');

const customConvert: ConvertFunction = (val) => parseInt(val);

const options: ScrapeOptions = {
  selector: '.item',
  how: customHow,
  convert: customConvert,
  multiple: true,
  filter: ($el) => $el.hasClass('active'),
  validate: (val) => val > 0,
  required: true
};
```

## Error Handling Best Practices

### 1. Use Default Values for Optional Fields

```javascript
const result = easyScrape(html, {
  optionalField: {
    selector: '.optional',
    default: 'N/A'
  },
  optionalNumber: {
    selector: '.number',
    convert: helpers.toNumber,
    default: 0
  }
});
```

### 2. Use Strict Mode for Required Fields

```javascript
const result = easyScrape(html, {
  requiredField: {
    selector: '.required',
    strict: true  // Throws if missing
  }
});
```

### 3. Use Required Flag with Validation

```javascript
const result = easyScrape(html, {
  email: {
    selector: '.email',
    required: true,
    validate: (val) => val.includes('@')
  }
});
```

### 4. Wrap in Try-Catch for Production

```javascript
try {
  const result = easyScrape(html, schema, { baseUrl });
  // Process result
} catch (error) {
  console.error('Scraping failed:', error.message);
  // Handle error (log, retry, fallback)
}
```

### 5. Use Conditional Extraction

```javascript
const result = easyScrape(html, {
  salePrice: {
    selector: '.sale-price',
    ifExists: '.on-sale',  // Only extract if on sale
    convert: helpers.toNumber
  },
  regularPrice: {
    selector: '.regular-price',
    ifNotExists: '.sale-price',  // Only if no sale
    convert: helpers.toNumber
  }
});
```

## Performance Tips

### 1. Use Specific Selectors
More specific selectors are faster:
```javascript
// Slower
const result = easyScrape(html, { title: 'div span' });

// Faster
const result = easyScrape(html, { title: '.product-title' });
```

### 2. Avoid Deep Nesting
Flatten your data structure when possible:
```javascript
// Less efficient
const result = easyScrape(html, {
  level1: {
    selector: '.level1',
    data: {
      level2: {
        selector: '.level2',
        data: {
          level3: '.level3'
        }
      }
    }
  }
});

// More efficient
const result = easyScrape(html, {
  level3: '.level1 .level2 .level3'
});
```

### 3. Use `multiple` Instead of `map` for Simple Text
```javascript
// Less efficient (creates function overhead)
const result = easyScrape(html, {
  tags: {
    selector: '.tag',
    map: ($el) => $el.text()
  }
});

// More efficient
const result = easyScrape(html, {
  tags: {
    selector: '.tag',
    multiple: true
  }
});
```

### 4. Cache Cheerio Instances
Reuse parsed HTML for multiple extractions:
```javascript
import * as cheerio from 'cheerio';

const $ = cheerio.load(html);

const result1 = easyScrape($, schema1);
const result2 = easyScrape($, schema2);
```

### 5. Use Array Operations Wisely
Apply filters early to reduce processing:
```javascript
// Process less data
const result = easyScrape(html, {
  items: {
    selector: '.item',
    filter: ($el) => $el.hasClass('active'),
    multiple: true,
    limit: 10
  }
});
```

## Migration Guide

If you're migrating from other scraping libraries:

### From Cheerio Direct Usage

**Before:**
```javascript
const $ = cheerio.load(html);
const products = [];
$('.product').each((i, el) => {
  products.push({
    title: $(el).find('.title').text(),
    price: parseFloat($(el).find('.price').text().replace('$', ''))
  });
});
```

**After:**
```javascript
const result = easyScrape(html, {
  products: {
    listItem: '.product',
    data: {
      title: '.title',
      price: {
        selector: '.price',
        convert: helpers.toNumber
      }
    }
  }
});
```

### From scrape-it

Easy Scrape is inspired by scrape-it and offers similar API with enhanced features:

```javascript
// scrape-it style (still works!)
const result = easyScrape(html, {
  title: '.title',
  price: {
    selector: '.price',
    convert: x => parseFloat(x)
  }
});

// Enhanced with new features
const result = easyScrape(html, {
  title: '.title',
  price: {
    selector: '.price',
    convert: helpers.toNumber,
    required: true,
    validate: (val) => val > 0
  }
});
```

## Common Patterns

### Extract Links with Text

```javascript
const links = easyScrape(html, {
  navigation: {
    selector: 'nav a',
    map: ($el) => ({
      text: $el.text(),
      href: $el.attr('href')
    })
  }
});
```

### Extract Meta Tags

```javascript
const meta = easyScrape(html, {
  title: 'title',
  description: presets.meta('description'),
  keywords: {
    ...presets.meta('keywords'),
    convert: (val) => val.split(',').map(k => k.trim())
  },
  ogTitle: presets.ogMeta('title'),
  ogImage: presets.ogMeta('image')
});
```

### Extract Breadcrumbs

```javascript
const breadcrumbs = easyScrape(html, {
  trail: {
    selector: '.breadcrumb a',
    map: ($el, $, index) => ({
      position: index + 1,
      name: $el.text(),
      url: $el.attr('href')
    })
  }
});
```

### Extract Pagination Info

```javascript
const pagination = easyScrape(html, {
  currentPage: {
    selector: '.pagination .active',
    convert: helpers.toInt
  },
  totalPages: {
    selector: '.pagination a:last',
    convert: helpers.toInt
  },
  nextPage: {
    selector: '.pagination .next',
    attr: 'href',
    default: null
  }
});
```

## Debugging Tips

### 1. Test Selectors Separately

```javascript
// Test each selector individually
const test = easyScrape(html, {
  test1: '.selector1',
  test2: '.selector2'
});
console.log(test);
```

### 2. Use Default Values During Development

```javascript
const result = easyScrape(html, {
  field: {
    selector: '.test',
    default: 'DEBUG: Not found'  // Makes missing fields obvious
  }
});
```

### 3. Log Transform Steps

```javascript
const result = easyScrape(html, {
  price: {
    selector: '.price',
    transform: [
      (val) => { console.log('1:', val); return val; },
      (val) => val.replace('$', ''),
      (val) => { console.log('2:', val); return val; },
      (val) => parseFloat(val)
    ]
  }
});
```

### 4. Inspect Extracted HTML

```javascript
const result = easyScrape(html, {
  debug: {
    selector: '.target',
    outerHtml: true  // See the actual HTML
  }
});
console.log(result.debug);
```

## FAQ

### Q: How do I extract data from a specific element without a selector?

Use an empty selector with context:
```javascript
{
  id: {
    selector: '',  // Use context element
    how: ($el) => $el.attr('data-id')
  }
}
```

### Q: Can I use custom Cheerio methods?

Yes, via the `how` function:
```javascript
{
  custom: {
    selector: '.item',
    how: ($el) => $el.prev().text()  // Any Cheerio method
  }
}
```

### Q: How do I handle missing nested elements?

Use `default` or `ifExists`:
```javascript
{
  optional: {
    selector: '.nested .deep',
    default: null,
    ifExists: '.nested'
  }
}
```

### Q: Can I extract data from multiple pages?

Yes, fetch and scrape each page:
```javascript
const results = [];
for (const url of urls) {
  const html = await fetch(url).then(r => r.text());
  const data = easyScrape(html, schema);
  results.push(data);
}
```

### Q: How do I handle dynamic content (JavaScript-rendered)?

Easy Scrape works with static HTML. For JavaScript-rendered content, use tools like Puppeteer or Playwright to get the HTML first:

```javascript
import puppeteer from 'puppeteer';
import { easyScrape } from 'easy-scrape';

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto(url);
const html = await page.content();
await browser.close();

const result = easyScrape(html, schema);
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Credits

Built on top of [Cheerio](https://cheerio.js.org/) - Fast, flexible & lean implementation of core jQuery designed specifically for the server.

Inspired by [scrape-it](https://github.com/IonicaBizau/scrape-it) - A Node.js scraper for humans.