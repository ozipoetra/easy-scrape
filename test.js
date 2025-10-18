import { easyScrape } from './lib/index.js';

// ============================================
// 1. BASIC STRING SELECTOR
// ============================================
const html1 = `<h1 class="title">Hello World</h1>`;

const result1 = easyScrape(html1, {
  title: '.title'  // Simple string selector
});
console.log('1. Basic:', result1);
// { title: 'Hello World' }


// ============================================
// 2. SELECTOR WITH OPTIONS
// ============================================
const html2 = `<div class="content">  Some text  </div>`;

const result2 = easyScrape(html2, {
  content: {
    selector: '.content',
    trimValue: true  // default is true
  }
});
console.log('2. Selector:', result2);
// { content: 'Some text' }


// ============================================
// 3. ATTRIBUTE EXTRACTION (attr)
// ============================================
const html3 = `<a href="https://example.com" class="link">Click</a>`;

const result3 = easyScrape(html3, {
  url: {
    selector: '.link',
    attr: 'href'
  }
});
console.log('3. Attr:', result3);
// { url: 'https://example.com' }


// ============================================
// 4. MULTIPLE ATTRIBUTES (attrs)
// ============================================
const html4 = `<a href="/page" class="nav-link" title="Go to page">Link</a>`;

const result4 = easyScrape(html4, {
  linkData: {
    selector: '.nav-link',
    attrs: ['href', 'class', 'title']
  }
});
console.log('4. Multiple Attrs:', result4);
// { linkData: { href: '/page', class: 'nav-link', title: 'Go to page' } }


// ============================================
// 5. HTML CONTENT (html)
// ============================================
const html5 = `<div class="box"><strong>Bold</strong> text</div>`;

const result5 = easyScrape(html5, {
  content: {
    selector: '.box',
    html: true
  }
});
console.log('5. HTML:', result5);
// { content: '<strong>Bold</strong> text' }


// ============================================
// 6. OUTER HTML (outerHtml)
// ============================================
const html6 = `<div class="container"><p>Text</p></div>`;

const result6 = easyScrape(html6, {
  fullHtml: {
    selector: 'p',
    outerHtml: true
  }
});
console.log('6. Outer HTML:', result6);
// { fullHtml: '<p>Text</p>' }


// ============================================
// 7. CUSTOM HOW FUNCTION
// ============================================
const html7 = `<div class="item" data-id="123">Item</div>`;

const result7 = easyScrape(html7, {
  itemId: {
    selector: '.item',
    how: ($el) => $el.attr('data-id')
  }
});
console.log('7. Custom How:', result7);
// { itemId: '123' }


// ============================================
// 8. CONVERT FUNCTION
// ============================================
const html8 = `<span class="price">$99.99</span>`;

const result8 = easyScrape(html8, {
  price: {
    selector: '.price',
    convert: (value) => parseFloat(value.replace('$', ''))
  }
});
console.log('8. Convert:', result8);
// { price: 99.99 }


// ============================================
// 9. TRANSFORM PIPELINE
// ============================================
const html9 = `<span class="amount">  100  </span>`;

const result9 = easyScrape(html9, {
  amount: {
    selector: '.amount',
    transform: [
      (val) => val.trim(),
      (val) => parseInt(val),
      (val) => val * 2
    ]
  }
});
console.log('9. Transform:', result9);
// { amount: 200 }


// ============================================
// 10. EQ (Select by index)
// ============================================
const html10 = `
  <ul>
    <li>First</li>
    <li>Second</li>
    <li>Third</li>
  </ul>
`;

const result10 = easyScrape(html10, {
  secondItem: {
    selector: 'li',
    eq: 1  // 0-indexed
  }
});
console.log('10. Eq:', result10);
// { secondItem: 'Second' }


// ============================================
// 11. TEXTEQ (Select text node by index)
// ============================================
const html11 = `<div>Text1<span>Span</span>Text2</div>`;

const result11 = easyScrape(html11, {
  firstText: {
    selector: 'div',
    texteq: 0
  },
  secondText: {
    selector: 'div',
    texteq: 1
  }
});
console.log('11. TextEq:', result11);
// { firstText: 'Text1', secondText: 'Text2' }


// ============================================
// 12. CLOSEST (Find ancestor)
// ============================================
const html12 = `
  <div class="container">
    <div class="item">
      <span class="text">Click</span>
    </div>
  </div>
`;

const result12 = easyScrape(html12, {
  containerClass: {
    selector: '.text',
    closest: '.container',
    how: ($el) => $el.attr('class')
  }
});
console.log('12. Closest:', result12);
// { containerClass: 'container' }


// ============================================
// 13. NESTED DATA
// ============================================
const html13 = `
  <div class="card">
    <h2 class="title">Product</h2>
    <div class="meta">
      <span class="price">$50</span>
      <span class="stock">In Stock</span>
    </div>
  </div>
`;

const result13 = easyScrape(html13, {
  product: {
    selector: '.card',
    data: {
      title: '.title',
      price: '.price',
      stock: '.stock'
    }
  }
});
console.log('13. Nested Data:', result13);
// { product: { title: 'Product', price: '$50', stock: 'In Stock' } }


// ============================================
// 14. LIST ITEM
// ============================================
const html14 = `
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

const result14 = easyScrape(html14, {
  items: {
    listItem: '.item',
    data: {
      name: '.name',
      value: '.value'
    }
  }
});
console.log('14. List Item:', result14);
// { items: [{ name: 'Item 1', value: '10' }, { name: 'Item 2', value: '20' }] }


// ============================================
// 15. LIST WITH INCLUDE INDEX
// ============================================
const html15 = `
  <ul>
    <li>Apple</li>
    <li>Banana</li>
    <li>Cherry</li>
  </ul>
`;

const result15 = easyScrape(html15, {
  fruits: {
    listItem: 'li',
    includeIndex: true
    // No data property - will extract text and add index
  }
});
console.log('15. List with Index:', result15);
// { fruits: [{ text: 'Apple', _index: 0 }, { text: 'Banana', _index: 1 }, { text: 'Cherry', _index: 2 }] }


// ============================================
// 16. MAP FUNCTION
// ============================================
const html16 = `
  <div class="product">Product 1</div>
  <div class="product">Product 2</div>
  <div class="product">Product 3</div>
`;

const result16 = easyScrape(html16, {
  products: {
    selector: '.product',
    map: ($el, $, index) => ({
      id: index + 1,
      name: $el.text(),
      upper: $el.text().toUpperCase()
    })
  }
});
console.log('16. Map:', result16);
// { products: [{ id: 1, name: 'Product 1', upper: 'PRODUCT 1' }, ...] }


// ============================================
// 17. MAP WITH FILTERING (return null)
// ============================================
const html17 = `
  <div class="item" data-price="10">Cheap</div>
  <div class="item" data-price="50">Mid</div>
  <div class="item" data-price="100">Expensive</div>
`;

const result17 = easyScrape(html17, {
  expensive: {
    selector: '.item',
    map: ($el) => {
      const price = parseInt($el.attr('data-price'));
      if (price < 50) return null;  // Filter out
      return { name: $el.text(), price };
    }
  }
});
console.log('17. Map with Filter:', result17);
// { expensive: [{ name: 'Mid', price: 50 }, { name: 'Expensive', price: 100 }] }


// ============================================
// 18. MULTIPLE (Extract array)
// ============================================
const html18 = `
  <span class="tag">JS</span>
  <span class="tag">CSS</span>
  <span class="tag">HTML</span>
`;

const result18 = easyScrape(html18, {
  tags: {
    selector: '.tag',
    multiple: true
  }
});
console.log('18. Multiple:', result18);
// { tags: ['JS', 'CSS', 'HTML'] }


// ============================================
// 19. FILTER FUNCTION
// ============================================
const html19 = `
  <div class="item active">Active 1</div>
  <div class="item">Inactive</div>
  <div class="item active">Active 2</div>
`;

const result19 = easyScrape(html19, {
  activeItems: {
    selector: '.item',
    filter: ($el) => $el.hasClass('active'),
    multiple: true
  }
});
console.log('19. Filter:', result19);
// { activeItems: ['Active 1', 'Active 2'] }


// ============================================
// 20. DEFAULT VALUE
// ============================================
const html20 = `<div class="content">Text</div>`;

const result20 = easyScrape(html20, {
  missing: {
    selector: '.not-exist',
    default: 'Not Found'
  },
  existing: {
    selector: '.content'
  }
});
console.log('20. Default:', result20);
// { missing: 'Not Found', existing: 'Text' }


// ============================================
// 21. STRICT MODE
// ============================================
const html21 = `<div class="content">Text</div>`;

try {
  const result21 = easyScrape(html21, {
    missing: {
      selector: '.not-exist',
      strict: true  // Will throw error
    }
  });
} catch (error) {
  console.log('21. Strict Error:', error.message);
}
// 21. Strict Error: Element not found for selector ".not-exist" in field "missing"


// ============================================
// 22. REGEX EXTRACTION
// ============================================
const html22 = `<div class="price">Price: $99.99 USD</div>`;

const result22 = easyScrape(html22, {
  amount: {
    selector: '.price',
    regex: /\$(\d+\.\d+)/,
    regexGroup: 1
  }
});
console.log('22. Regex:', result22);
// { amount: '99.99' }


// ============================================
// 23. REGEX WITH CONVERT
// ============================================
const html23 = `<div class="info">ID: 12345, Status: Active</div>`;

const result23 = easyScrape(html23, {
  id: {
    selector: '.info',
    regex: /ID: (\d+)/,
    regexGroup: 1,
    convert: (val) => parseInt(val)
  }
});
console.log('23. Regex + Convert:', result23);
// { id: 12345 }


// ============================================
// 24. PARSING OPTIONS (xmlMode)
// ============================================
const xml = `<?xml version="1.0"?><root><item>Value</item></root>`;

const result24 = easyScrape(xml, {
  value: 'item'
}, {
  xmlMode: true
});
console.log('24. XML Mode:', result24);
// { value: 'Value' }


// ============================================
// 25. COMPLEX REAL-WORLD EXAMPLE
// ============================================
const html25 = `
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

const result25 = easyScrape(html25, {
  products: {
    listItem: '.product',
    data: {
      id: {
        // No selector needed - context is already .product
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
console.log('25. Complex Example:', JSON.stringify(result25, null, 2));
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


// ============================================
// 26. COMBINING MULTIPLE FEATURES
// ============================================
const html26 = `
  <div class="container">
    <a href="/page1" class="link active">Link 1</a>
    <a href="/page2" class="link">Link 2</a>
    <a href="/page3" class="link active">Link 3</a>
  </div>
`;

const result26 = easyScrape(html26, {
  activeLinks: {
    selector: '.link',
    filter: ($el) => $el.hasClass('active'),
    map: ($el, $, index) => ({
      index: index,
      text: $el.text(),
      url: $el.attr('href'),
      fullUrl: `https://example.com${$el.attr('href')}`
    })
  }
});
console.log('26. Combined Features:', result26);
/*
{
  activeLinks: [
    { index: 0, text: 'Link 1', url: '/page1', fullUrl: 'https://example.com/page1' },
    { index: 1, text: 'Link 3', url: '/page3', fullUrl: 'https://example.com/page3' }
  ]
}
*/