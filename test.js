import { easyScrape, helpers, presets, pluck, extractAll, registerRef, clearRefs, createRef } from './lib/index.js';

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
        selector: '', // FIXED: Empty selector to use context element
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


// ============================================
// NEW FEATURES TESTS START HERE
// ============================================


// ============================================
// 27. HELPER FUNCTIONS - toNumber
// ============================================
const html27 = `<div class="price">Price: $1,234.56</div>`;

const result27 = easyScrape(html27, {
  price: {
    selector: '.price',
    convert: helpers.toNumber
  }
});
console.log('27. Helper toNumber:', result27);
// { price: 1234.56 }


// ============================================
// 28. HELPER FUNCTIONS - toBoolean
// ============================================
const html28 = `
  <div class="status1">true</div>
  <div class="status2">yes</div>
  <div class="status3">no</div>
`;

const result28 = easyScrape(html28, {
  isActive1: { selector: '.status1', convert: helpers.toBoolean },
  isActive2: { selector: '.status2', convert: helpers.toBoolean },
  isActive3: { selector: '.status3', convert: helpers.toBoolean }
});
console.log('28. Helper toBoolean:', result28);
// { isActive1: true, isActive2: true, isActive3: false }


// ============================================
// 29. HELPER FUNCTIONS - extractUrl & extractEmail
// ============================================
const html29 = `<div class="contact">Visit https://example.com or email test@example.com</div>`;

const result29 = easyScrape(html29, {
  url: { selector: '.contact', convert: helpers.extractUrl },
  email: { selector: '.contact', convert: helpers.extractEmail }
});
console.log('29. Helper extractUrl & extractEmail:', result29);
// { url: 'https://example.com', email: 'test@example.com' }


// ============================================
// 30. HELPER FUNCTIONS - slug
// ============================================
const html30 = `<h1 class="title">Hello World! This is a Test</h1>`;

const result30 = easyScrape(html30, {
  slug: { selector: '.title', convert: helpers.slug }
});
console.log('30. Helper slug:', result30);
// { slug: 'hello-world-this-is-a-test' }


// ============================================
// 31. PRESETS - link
// ============================================
const html31 = `<a href="/about" class="nav-link">About Us</a>`;

const result31 = easyScrape(html31, {
  aboutLink: presets.link('.nav-link')
});
console.log('31. Preset link:', result31);
// { aboutLink: '/about' }


// ============================================
// 32. PRESETS - image
// ============================================
const html32 = `<img src="/logo.png" alt="Company Logo" class="logo">`;

const result32 = easyScrape(html32, {
  logo: presets.image('.logo')
});
console.log('32. Preset image:', result32);
// { logo: { src: '/logo.png', alt: 'Company Logo' } }


// ============================================
// 33. PRESETS - meta tags
// ============================================
const html33 = `
  <head>
    <meta name="description" content="This is a description">
    <meta property="og:title" content="Page Title">
  </head>
`;

const result33 = easyScrape(html33, {
  description: presets.meta('description'),
  ogTitle: presets.ogMeta('title')
});
console.log('33. Preset meta:', result33);
// { description: 'This is a description', ogTitle: 'Page Title' }


// ============================================
// 34. PRESETS - JSON-LD
// ============================================
const html34 = `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Widget",
    "price": "19.99"
  }
  </script>
`;

const result34 = easyScrape(html34, {
  productData: presets.jsonLd()
});
console.log('34. Preset JSON-LD:', result34);
// { productData: { '@context': 'https://schema.org', '@type': 'Product', name: 'Widget', price: '19.99' } }


// ============================================
// 35. PARENT NAVIGATION
// ============================================
const html35 = `
  <div class="grandparent" data-level="0">
    <div class="parent" data-level="1">
      <span class="child" data-level="2">Text</span>
    </div>
  </div>
`;

const result35 = easyScrape(html35, {
  parentLevel: {
    selector: '.child',
    parent: 1,
    how: ($el) => $el.attr('data-level')
  },
  grandparentLevel: {
    selector: '.child',
    parent: 2,
    how: ($el) => $el.attr('data-level')
  }
});
console.log('35. Parent Navigation:', result35);
// { parentLevel: '1', grandparentLevel: '0' }


// ============================================
// 36. PARENTS NAVIGATION (by selector)
// ============================================
const html36 = `
  <div class="outer">
    <div class="inner">
      <div class="nested">
        <span class="target">Find me</span>
      </div>
    </div>
  </div>
`;

const result36 = easyScrape(html36, {
  outerClass: {
    selector: '.target',
    parents: '.outer',
    how: ($el) => $el.attr('class')
  }
});
console.log('36. Parents Navigation:', result36);
// { outerClass: 'outer' }


// ============================================
// 37. SIBLINGS NAVIGATION - next/prev
// ============================================
const html37 = `
  <div>
    <span class="first">First</span>
    <span class="target">Target</span>
    <span class="last">Last</span>
  </div>
`;

const result37 = easyScrape(html37, {
  nextSibling: {
    selector: '.target',
    siblings: 'next'
  },
  prevSibling: {
    selector: '.target',
    siblings: 'prev'
  }
});
console.log('37. Siblings next/prev:', result37);
// { nextSibling: 'Last', prevSibling: 'First' }


// ============================================
// 38. SIBLINGS NAVIGATION - nextAll/prevAll
// ============================================
const html38 = `
  <div>
    <span>Item 1</span>
    <span class="marker">Marker</span>
    <span>Item 2</span>
    <span>Item 3</span>
  </div>
`;

const result38 = easyScrape(html38, {
  nextItems: {
    selector: '.marker',
    siblings: 'nextAll',
    multiple: true
  }
});
console.log('38. Siblings nextAll:', result38);
// { nextItems: ['Item 2', 'Item 3'] }


// ============================================
// 39. TEXT MODE - ownText
// ============================================
const html39 = `<div class="wrapper">Direct text<span>Nested text</span>More direct</div>`;

const result39 = easyScrape(html39, {
  allText: {
    selector: '.wrapper',
    textMode: 'text'  // default, gets all text
  },
  ownText: {
    selector: '.wrapper',
    textMode: 'ownText'  // only direct text nodes
  }
});
console.log('39. Text Mode:', result39);
// { allText: 'Direct textNested textMore direct', ownText: 'Direct textMore direct' }


// ============================================
// 40. SEPARATOR for multiple text nodes
// ============================================
const html40 = `<div class="list">Apple<br>Banana<br>Cherry</div>`;

const result40 = easyScrape(html40, {
  joined: {
    selector: '.list',
    separator: ', '
  }
});
console.log('40. Separator:', result40);
// { joined: 'Apple, Banana, Cherry' }


// ============================================
// 41. URL RESOLUTION
// ============================================
const html41 = `
  <a href="/about" class="link1">About</a>
  <a href="contact" class="link2">Contact</a>
  <img src="/images/logo.png" class="logo">
`;

const result41 = easyScrape(html41, {
  aboutUrl: {
    selector: '.link1',
    attr: 'href',
    resolveUrl: true
  },
  contactUrl: {
    selector: '.link2',
    attr: 'href',
    resolveUrl: true
  },
  logoUrl: {
    selector: '.logo',
    attr: 'src',
    resolveUrl: true
  }
}, {
  baseUrl: 'https://example.com'
});
console.log('41. URL Resolution:', result41);
// { aboutUrl: 'https://example.com/about', contactUrl: 'https://example.com/contact', logoUrl: 'https://example.com/images/logo.png' }


// ============================================
// 42. CONDITIONAL EXTRACTION - if function
// ============================================
const html42 = `
  <div class="product" data-available="true">
    <span class="price">$50</span>
  </div>
`;

const result42 = easyScrape(html42, {
  price: {
    selector: '.price',
    if: ($) => $('.product').attr('data-available') === 'true'
  }
});
console.log('42. Conditional if:', result42);
// { price: '$50' }


// ============================================
// 43. CONDITIONAL EXTRACTION - ifExists
// ============================================
const html43 = `
  <div class="container">
    <span class="badge">New</span>
    <span class="price">$99</span>
  </div>
`;

const result43 = easyScrape(html43, {
  price: {
    selector: '.price',
    ifExists: '.badge'  // Only extract if badge exists
  }
});
console.log('43. Conditional ifExists:', result43);
// { price: '$99' }


// ============================================
// 44. CONDITIONAL EXTRACTION - ifNotExists
// ============================================
const html44 = `
  <div class="container">
    <span class="regular-price">$99</span>
  </div>
`;

const result44 = easyScrape(html44, {
  regularPrice: {
    selector: '.regular-price',
    ifNotExists: '.sale-price'  // Only extract if no sale price
  }
});
console.log('44. Conditional ifNotExists:', result44);
// { regularPrice: '$99' }


// ============================================
// 45. ARRAY OPERATIONS - slice
// ============================================
const html45 = `
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <div class="item">Item 3</div>
  <div class="item">Item 4</div>
  <div class="item">Item 5</div>
`;

const result45 = easyScrape(html45, {
  middleItems: {
    selector: '.item',
    multiple: true,
    slice: [1, 4]  // Get items at index 1, 2, 3
  }
});
console.log('45. Array slice:', result45);
// { middleItems: ['Item 2', 'Item 3', 'Item 4'] }


// ============================================
// 46. ARRAY OPERATIONS - limit
// ============================================
const html46 = `
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <div class="item">Item 3</div>
  <div class="item">Item 4</div>
`;

const result46 = easyScrape(html46, {
  topItems: {
    selector: '.item',
    multiple: true,
    limit: 2  // Only get first 2 items
  }
});
console.log('46. Array limit:', result46);
// { topItems: ['Item 1', 'Item 2'] }


// ============================================
// 47. ARRAY OPERATIONS - unique
// ============================================
const html47 = `
  <div class="tag">JavaScript</div>
  <div class="tag">Python</div>
  <div class="tag">JavaScript</div>
  <div class="tag">Python</div>
`;

const result47 = easyScrape(html47, {
  uniqueTags: {
    selector: '.tag',
    multiple: true,
    unique: true
  }
});
console.log('47. Array unique:', result47);
// { uniqueTags: ['JavaScript', 'Python'] }


// ============================================
// 48. ARRAY OPERATIONS - flatten
// ============================================
const html48 = `
  <ul>
    <li class="category">
      <span class="tag">Tag1</span>
      <span class="tag">Tag2</span>
    </li>
    <li class="category">
      <span class="tag">Tag3</span>
    </li>
  </ul>
`;

const result48 = easyScrape(html48, {
  allTags: {
    listItem: '.category',
    data: {
      tags: {
        selector: '.tag',
        multiple: true
      }
    },
    flatten: true  // FIXED: Remove map, flatten works on nested arrays
  }
});
console.log('48. Array flatten:', result48);
// { allTags: [['Tag1', 'Tag2'], ['Tag3']] } - Note: listItem creates nested structure


// ============================================
// 49. VALIDATION
// ============================================
const html49 = `<div class="email">user@example.com</div>`;

const result49 = easyScrape(html49, {
  email: {
    selector: '.email',
    validate: (value) => value.includes('@')  // Simple email validation
  }
});
console.log('49. Validation:', result49);
// { email: 'user@example.com' }


// ============================================
// 50. REQUIRED FIELD
// ============================================
const html50 = `<div class="content">Text</div>`;

try {
  const result50 = easyScrape(html50, {
    title: {
      selector: '.missing-title',
      required: true  // Will throw error if missing or empty
    }
  });
} catch (error) {
  console.log('50. Required Error:', error.message);
}
// 50. Required Error: Required field "title" is empty


// ============================================
// 51. TABLE PARSING - with headers
// ============================================
const html51 = `
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

const result51 = easyScrape(html51, {
  users: {
    selector: '.data-table',
    table: {
      headers: true,
      selector: 'tr'
    }
  }
});
console.log('51. Table with Headers:', JSON.stringify(result51, null, 2));
/*
{
  "users": [
    { "Name": "John", "Age": "30", "City": "NYC" },
    { "Name": "Jane", "Age": "25", "City": "LA" }
  ]
}
*/


// ============================================
// 52. TABLE PARSING - without headers
// ============================================
const html52 = `
  <table class="simple-table">
    <tr>
      <td>Item 1</td>
      <td>Value 1</td>
    </tr>
    <tr>
      <td>Item 2</td>
      <td>Value 2</td>
    </tr>
  </table>
`;

const result52 = easyScrape(html52, {
  data: {
    selector: '.simple-table',
    table: {
      headers: false,
      selector: 'tr'
    }
  }
});
console.log('52. Table without Headers:', result52);
// { data: [['Item 1', 'Value 1'], ['Item 2', 'Value 2']] }


// ============================================
// 53. COMBINING ARRAY OPERATIONS
// ============================================
const html53 = `
  <div class="item">Apple</div>
  <div class="item">Banana</div>
  <div class="item">Apple</div>
  <div class="item">Cherry</div>
  <div class="item">Banana</div>
  <div class="item">Date</div>
`;

const result53 = easyScrape(html53, {
  topUnique: {
    selector: '.item',
    multiple: true,
    unique: true,    // Remove duplicates first
    limit: 3         // Then take first 3 unique items
  }
});
console.log('53. Combined Array Operations:', result53);
// { topUnique: ['Apple', 'Banana', 'Cherry'] }


// ============================================
// 54. URL RESOLUTION with attrs
// ============================================
const html54 = `<a href="/contact" title="Contact Us" class="link">Contact</a>`;

const result54 = easyScrape(html54, {
  linkInfo: {
    selector: '.link',
    attrs: ['href', 'title'],
    resolveUrl: true
  }
}, {
  baseUrl: 'https://example.com'
});
console.log('54. URL Resolution with attrs:', result54);
// { linkInfo: { href: 'https://example.com/contact', title: 'Contact Us' } }


// ============================================
// 55. COMPLEX: Navigation + Helpers + Validation
// ============================================
const html55 = `
  <div class="product-card">
    <div class="header">
      <h3 class="title">Laptop</h3>
      <span class="price">$1,299.99</span>
    </div>
    <div class="body">
      <div class="stock" data-available="true">In Stock</div>
    </div>
  </div>
`;

const result55 = easyScrape(html55, {
  product: {
    selector: '.product-card',
    data: {
      title: '.title',
      price: {
        selector: '.price',
        convert: helpers.toNumber,
        validate: (val) => val > 0
      },
      isAvailable: {
        selector: '.stock',  // FIXED: Direct selector
        how: ($el) => $el.attr('data-available'),
        convert: helpers.toBoolean
      }
    }
  }
});
console.log('55. Complex Navigation + Helpers:', result55);
// { product: { title: 'Laptop', price: 1299.99, isAvailable: true } }


// ============================================
// 56. CONDITIONAL + ARRAY OPERATIONS
// ============================================
const html56 = `
  <div class="sale-section">
    <div class="product" data-discount="20">Product 1</div>
    <div class="product" data-discount="5">Product 2</div>
    <div class="product" data-discount="30">Product 3</div>
    <div class="product" data-discount="15">Product 4</div>
  </div>
`;

const result56 = easyScrape(html56, {
  bigDiscounts: {
    selector: '.product',
    // FIXED: Removed ifExists - .sale-section is parent, always exists
    map: ($el) => {
      const discount = parseInt($el.attr('data-discount'));
      if (discount < 15) return null;
      return {
        name: $el.text(),
        discount: discount + '%'
      };
    },
    limit: 2
  }
});
console.log('56. Conditional + Array Ops:', result56);
// { bigDiscounts: [{ name: 'Product 1', discount: '20%' }, { name: 'Product 3', discount: '30%' }] }


// ============================================
// 57. REAL-WORLD: E-commerce Product Page
// ============================================
const html57 = `
  <html>
  <head>
    <meta name="description" content="Premium laptop with best features">
    <meta property="og:image" content="/images/laptop.jpg">
    <script type="application/ld+json">
    {
      "@type": "Product",
      "sku": "LAP-001"
    }
    </script>
  </head>
  <body>
    <div class="product-page">
      <div class="breadcrumb">
        <a href="/">Home</a>
        <a href="/electronics">Electronics</a>
        <a href="/laptops">Laptops</a>
      </div>
      <div class="product-main">
        <div class="gallery">
          <img src="/img1.jpg" alt="Main image">
          <img src="/img2.jpg" alt="Side view">
        </div>
        <div class="details">
          <h1 class="product-title">Premium Laptop Pro 2024</h1>
          <div class="pricing">
            <span class="original-price">$1,499.99</span>
            <span class="sale-price">$1,299.99</span>
            <span class="discount">Save $200</span>
          </div>
          <div class="stock-info" data-available="yes">
            <span class="status">In Stock</span>
            <span class="quantity">23 available</span>
          </div>
          <div class="specs">
            <table class="spec-table">
              <tr><th>CPU</th><td>Intel i7</td></tr>
              <tr><th>RAM</th><td>16GB</td></tr>
              <tr><th>Storage</th><td>512GB SSD</td></tr>
            </table>
          </div>
        </div>
      </div>
      <div class="reviews">
        <div class="review" data-rating="5">
          <span class="author">John D.</span>
          <span class="comment">Excellent laptop!</span>
        </div>
        <div class="review" data-rating="4">
          <span class="author">Jane S.</span>
          <span class="comment">Very good value</span>
        </div>
        <div class="review" data-rating="5">
          <span class="author">Mike R.</span>
          <span class="comment">Best purchase ever</span>
        </div>
      </div>
    </div>
  </body>
  </html>
`;

const result57 = easyScrape(html57, {
  // SEO Meta Data - FIXED
  meta: {
    selector: 'head',
    data: {
      description: {
        selector: 'meta[name="description"]',
        attr: 'content'
      },
      ogImage: {
        selector: 'meta[property="og:image"]',
        attr: 'content',
        resolveUrl: true
      },
      structuredData: presets.jsonLd()
    }
  },
  
  // Breadcrumb
  breadcrumb: {
    selector: '.breadcrumb a',
    map: ($el) => ({
      text: $el.text(),
      url: $el.attr('href')
    })
  },
  
  // Images - FIXED: resolveUrl in map transform
  images: {
    selector: '.gallery img',
    multiple: true,
    attr: 'src',
    resolveUrl: true
  },
  
  // Product Info
  title: '.product-title',
  
  pricing: {
    selector: '.pricing',
    data: {
      original: {
        selector: '.original-price',
        convert: helpers.toNumber
      },
      sale: {
        selector: '.sale-price',
        convert: helpers.toNumber
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
        selector: '',  // FIXED: Use context
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
  
  // Specs Table - FIXED: Convert to object
  specifications: {
    selector: '.spec-table',
    table: {
      headers: false,
      selector: 'tr'
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
  },
  
  // Reviews - only 5-star reviews, limit to 2
  topReviews: {
    selector: '.review',
    map: ($el) => {
      const rating = parseInt($el.attr('data-rating'));
      if (rating < 5) return null;
      return {
        author: $el.find('.author').text(),
        comment: $el.find('.comment').text(),
        rating: rating
      };
    },
    limit: 2
  }
}, {
  baseUrl: 'https://shop.example.com'
});

console.log('57. Real-World E-commerce:', JSON.stringify(result57, null, 2));
/*
{
  "meta": {
    "description": "Premium laptop with best features",
    "ogImage": "https://shop.example.com/images/laptop.jpg",
    "structuredData": {
      "@type": "Product",
      "sku": "LAP-001"
    }
  },
  "breadcrumb": [
    { "text": "Home", "url": "/" },
    { "text": "Electronics", "url": "/electronics" },
    { "text": "Laptops", "url": "/laptops" }
  ],
  "images": [
    "https://shop.example.com/img1.jpg",
    "https://shop.example.com/img2.jpg"
  ],
  "title": "Premium Laptop Pro 2024",
  "pricing": {
    "original": 1499.99,
    "sale": 1299.99,
    "savings": 200
  },
  "availability": {
    "inStock": true,
    "quantity": 23
  },
  "specifications": {
    "CPU": "Intel i7",
    "RAM": "16GB",
    "Storage": "512GB SSD"
  },
  "topReviews": [
    { "author": "John D.", "comment": "Excellent laptop!", "rating": 5 },
    { "author": "Mike R.", "comment": "Best purchase ever", "rating": 5 }
  ]
}
*/


// ============================================
// 58. REAL-WORLD: Blog Article Scraping
// ============================================
const html58 = `
  <article class="blog-post">
    <header>
      <h1 class="post-title">10 Tips for Better Web Scraping</h1>
      <div class="post-meta">
        <span class="author">By Jane Developer</span>
        <time datetime="2024-03-15">March 15, 2024</time>
        <span class="read-time">5 min read</span>
      </div>
      <div class="tags">
        <a href="/tag/scraping" class="tag">Scraping</a>
        <a href="/tag/javascript" class="tag">JavaScript</a>
        <a href="/tag/tutorial" class="tag">Tutorial</a>
      </div>
    </header>
    <div class="post-content">
      <p>Introduction text here...</p>
      <h2>1. Use the Right Tools</h2>
      <p>Content for tip 1...</p>
      <h2>2. Respect robots.txt</h2>
      <p>Content for tip 2...</p>
    </div>
    <div class="related-posts">
      <article class="related">
        <a href="/post1">Related Post 1</a>
      </article>
      <article class="related">
        <a href="/post2">Related Post 2</a>
      </article>
    </div>
  </article>
`;

const result58 = easyScrape(html58, {
  article: {
    selector: '.blog-post',
    data: {
      title: '.post-title',
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
      headings: {
        selector: '.post-content h2',
        multiple: true
      },
      relatedPosts: {
        selector: '.related a',
        map: ($el) => ({
          title: $el.text(),
          url: $el.attr('href')
        }),
        limit: 3
      }
    }
  }
});

console.log('58. Real-World Blog:', JSON.stringify(result58, null, 2));
/*
{
  "article": {
    "title": "10 Tips for Better Web Scraping",
    "author": "Jane Developer",
    "publishDate": "2024-03-15T00:00:00.000Z",
    "readTime": 5,
    "tags": ["Scraping", "JavaScript", "Tutorial"],
    "headings": ["1. Use the Right Tools", "2. Respect robots.txt"],
    "relatedPosts": [
      { "title": "Related Post 1", "url": "/post1" },
      { "title": "Related Post 2", "url": "/post2" }
    ]
  }
}
*/


// ============================================
// 59. HELPERS - All in One Demo
// ============================================
const html59 = `
  <div class="data">
    <span class="number">$1,234.56</span>
    <span class="integer">42px</span>
    <span class="bool">yes</span>
    <span class="date">2024-03-15</span>
    <span class="url">Check https://example.com for more</span>
    <span class="email">Contact: admin@site.com</span>
    <span class="text">  HELLO WORLD  </span>
    <span class="json">{"key": "value"}</span>
  </div>
`;

const result59 = easyScrape(html59, {
  asNumber: { selector: '.number', convert: helpers.toNumber },
  asInt: { selector: '.integer', convert: helpers.toInt },
  asBool: { selector: '.bool', convert: helpers.toBoolean },
  asDate: { selector: '.date', convert: helpers.toDate },
  extractedUrl: { selector: '.url', convert: helpers.extractUrl },
  extractedEmail: { selector: '.email', convert: helpers.extractEmail },
  capitalized: {
    selector: '.text',
    transform: [
      (val) => val.trim().toLowerCase(),
      helpers.capitalize
    ]
  },
  slugified: { selector: '.text', convert: helpers.slug },
  parsedJson: { selector: '.json', convert: helpers.parseJson }
});

console.log('59. All Helpers Demo:', result59);
/*
{
  asNumber: 1234.56,
  asInt: 42,
  asBool: true,
  asDate: 2024-03-15T00:00:00.000Z,
  extractedUrl: 'https://example.com',
  extractedEmail: 'admin@site.com',
  capitalized: 'Hello world',
  slugified: 'hello-world',
  parsedJson: { key: 'value' }
}
*/


// ============================================
// 60. EDGE CASE: Empty Values with Defaults
// ============================================
const html60 = `
  <div class="container">
    <span class="empty"></span>
    <span class="whitespace">   </span>
  </div>
`;

const result60 = easyScrape(html60, {
  emptyWithDefault: {
    selector: '.empty',
    default: 'N/A'
  },
  whitespaceWithDefault: {
    selector: '.whitespace',
    default: 'N/A'
  },
  missingWithDefault: {
    selector: '.not-exists',
    default: 'Not Found'
  }
});

console.log('60. Edge Case - Empty Values:', result60);
// { emptyWithDefault: '', whitespaceWithDefault: '', missingWithDefault: 'Not Found' }


console.log('\n========== NEW FEATURES TESTS ==========');


// ============================================
// 61. PLUCK - Quick one-liner
// ============================================
const html61 = `<h1 class="title">Hello World</h1>`;

const result61 = pluck(html61, '.title');
console.log('61. Pluck:', result61);
// 'Hello World'


// ============================================
// 62. EXTRACT ALL - All elements
// ============================================
const html62 = `<li>Item 1</li><li>Item 2</li><li>Item 3</li>`;

const result62 = extractAll(html62, 'li');
console.log('62. Extract All:', result62.length);
// 3


// ============================================
// 63. REGISTER REF - Schema reuse
// ============================================
clearRefs();
registerRef('link', { selector: 'a', attr: 'href' });

const html63 = `<a href="/page">Link</a>`;

const result63 = easyScrape(html63, {
  url: createRef('link')
});
console.log('63. Register Ref:', result63);
// { url: '/page' }

clearRefs();


// ============================================
// 64. DEBUG MODE
// ============================================
const html64 = `<div class="item">Text</div>`;

const result64 = easyScrape(html64, {
  text: '.item'
}, { debug: true });
console.log('64. Debug Mode:', result64);
// { text: 'Text' }


// ============================================
// 65. WHITESPACE - collapse mode
// ============================================
const html65 = `<div class="text">  Hello    World   </div>`;

const result65 = easyScrape(html65, {
  collapse: { selector: '.text', whitespace: 'collapse' },
  preserve: { selector: '.text', whitespace: 'preserve', trimValue: false }
});
console.log('65. Whitespace:', result65);
// { collapse: 'Hello World', preserve: '  Hello    World   ' }


// ============================================
// 66. MALFORMED HTML - graceful handling
// ============================================
const html66 = `<div><script>bad</script><style>ugly</style><span>Good</span></div>`;

const result66 = easyScrape(html66, {
  text: 'span'
}, { xmlMode: false });  // Will try fallback
console.log('66. Malformed:', result66);
// { text: 'Good' }


console.log('\n✅ All new features tests completed!');

console.log('\n✅ ALL TESTS COMPLETED!');