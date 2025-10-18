# Easy Scrape

A powerful and flexible HTML scraping library built on top of Cheerio. Easy Scrape provides a declarative way to extract data from HTML with support for nested structures, transformations, and advanced filtering.

## Features

✨ **Simple & Declarative** - Define your scraping schema in plain JavaScript objects  
🎯 **Flexible Selectors** - Use CSS selectors to target any element  
🔄 **Data Transformation** - Built-in conversion and transformation pipeline  
📋 **List Handling** - Easy extraction of arrays and nested lists  
🎨 **Multiple Extraction Modes** - Text, HTML, attributes, or custom functions  
🔍 **Advanced Filtering** - Filter elements before extraction  
🛡️ **Error Handling** - Strict mode for validation or graceful fallbacks  
📦 **TypeScript Support** - Full TypeScript definitions included

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

## API Reference

### `easyScrape(input, schema, options?)`

**Parameters:**
- `input` - HTML string or Cheerio instance
- `schema` - Scraping schema defining what to extract
- `options` (optional) - Parsing options

**Returns:** Object with extracted data

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

#### `trimValue` (boolean)
Whether to trim whitespace from extracted values. Default: `true`.

```javascript
const result = easyScrape(html, {
  content: {
    selector: '.content',
    trimValue: false  // Keep whitespace
  }
});
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

### Element Selection

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
  firstText: {
    selector: 'div',
    texteq: 0
  },
  secondText: {
    selector: 'div',
    texteq: 1
  }
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
const html = `
  <ul>
    <li>Apple</li>
    <li>Banana</li>
    <li>Cherry</li>
  </ul>
`;

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
const html = `
  <div class="item" data-price="10">Cheap</div>
  <div class="item" data-price="50">Mid</div>
  <div class="item" data-price="100">Expensive</div>
`;

const result = easyScrape(html, {
  expensive: {
    selector: '.item',
    map: ($el) => {
      const price = parseInt($el.attr('data-price'));
      if (price < 50) return null;  // Filter out cheap items
      return { name: $el.text(), price };
    }
  }
});
// { expensive: [{ name: 'Mid', price: 50 }, { name: 'Expensive', price: 100 }] }
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

### Error Handling

#### `default` (any)
Default value when element is not found.

```javascript
const html = `<div class="content">Text</div>`;

const result = easyScrape(html, {
  missing: {
    selector: '.not-exist',
    default: 'Not Found'
  },
  existing: {
    selector: '.content'
  }
});
// { missing: 'Not Found', existing: 'Text' }
```

#### `strict` (boolean)
Throw errors instead of returning null for missing elements. Default: `false`.

```javascript
const html = `<div class="content">Text</div>`;

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
// Error: Element not found for selector ".not-exist" in field "required"
```

### Nested Data

Extract nested objects by using the `data` property.

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

## Parsing Options

### `xmlMode` (boolean)
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

### `decodeEntities` (boolean)
Decode HTML entities. Default: `true`.

```javascript
const result = easyScrape(html, schema, {
  decodeEntities: false
});
```

### `cheerioOptions` (object)
Additional Cheerio load options.

```javascript
const result = easyScrape(html, schema, {
  cheerioOptions: {
    normalizeWhitespace: true
  }
});
```

## Complex Example

```javascript
const html = `
  <div class="product-list">
    <article class="product" data-id="1">
      <h3 class="title">Laptop</h3>
      <div class="price">$999.99</div>
      <div class="details">
        <span class="brand">TechBrand</span>
        <span class="rating">4.5</span>
      </div>
      <ul class="features">
        <li>16GB RAM</li>
        <li>512GB SSD</li>
      </ul>
    </article>
    <article class="product" data-id="2">
      <h3 class="title">Mouse</h3>
      <div class="price">$29.99</div>
      <div class="details">
        <span class="brand">TechBrand</span>
        <span class="rating">4.0</span>
      </div>
      <ul class="features">
        <li>Wireless</li>
        <li>Ergonomic</li>
      </ul>
    </article>
  </div>
`;

const result = easyScrape(html, {
  products: {
    listItem: '.product',
    data: {
      id: {
        how: ($el) => $el.attr('data-id'),
        convert: (val) => parseInt(val)
      },
      title: '.title',
      price: {
        selector: '.price',
        convert: (val) => parseFloat(val.replace('$', ''))
      },
      brand: '.brand',
      rating: {
        selector: '.rating',
        convert: (val) => parseFloat(val)
      },
      features: {
        selector: '.features li',
        multiple: true
      }
    }
  }
});

console.log(result);
/*
{
  "products": [
    {
      "id": 1,
      "title": "Laptop",
      "price": 999.99,
      "brand": "TechBrand",
      "rating": 4.5,
      "features": ["16GB RAM", "512GB SSD"]
    },
    {
      "id": 2,
      "title": "Mouse",
      "price": 29.99,
      "brand": "TechBrand",
      "rating": 4.0,
      "features": ["Wireless", "Ergonomic"]
    }
  ]
}
*/
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
        convert: (val) => parseFloat(val.replace(/[^0-9.]/g, ''))
      },
      rating: {
        selector: '.rating',
        attr: 'data-rating',
        convert: parseFloat
      },
      inStock: {
        selector: '.stock-status',
        convert: (val) => val.toLowerCase() === 'in stock'
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
    attr: 'datetime'
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

### Scraping Tables

```javascript
const tableData = easyScrape(html, {
  rows: {
    listItem: 'tbody tr',
    data: {
      cells: {
        selector: 'td',
        multiple: true
      }
    }
  }
});
```

## TypeScript Support

Easy Scrape includes full TypeScript definitions:

```typescript
import { easyScrape, ScrapeSchema, ScrapeOptions } from 'easy-scrape';

const schema: ScrapeSchema = {
  title: '.title',
  price: {
    selector: '.price',
    convert: (val: string) => parseFloat(val)
  }
};

const result = easyScrape(html, schema);
```

## Error Handling Best Practices

1. **Use default values for optional fields:**
```javascript
const result = easyScrape(html, {
  optionalField: {
    selector: '.optional',
    default: 'N/A'
  }
});
```

2. **Use strict mode for required fields:**
```javascript
const result = easyScrape(html, {
  requiredField: {
    selector: '.required',
    strict: true  // Throws if missing
  }
});
```

3. **Wrap in try-catch for validation:**
```javascript
try {
  const result = easyScrape(html, schema);
  // Process result
} catch (error) {
  console.error('Scraping failed:', error.message);
}
```

## Performance Tips

1. **Use specific selectors** - More specific selectors are faster
2. **Avoid deep nesting** - Flatten your data structure when possible
3. **Use `multiple` instead of `map`** - When you only need text extraction
4. **Cache Cheerio instances** - Reuse parsed HTML for multiple extractions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Credits

Built on top of [Cheerio](https://cheerio.js.org/) - Fast, flexible & lean implementation of core jQuery designed specifically for the server.
Inspired from [Scrape-It](https://github.com/IonicaBizau/scrape-it)