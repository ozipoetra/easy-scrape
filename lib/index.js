import * as cheerio from 'cheerio';

/**
 * Helper functions for common transformations
 */
export const helpers = {
  toNumber: (val) => {
    if (typeof val === 'number') return val;
    const str = String(val).replace(/[^0-9.-]/g, '');
    return str ? parseFloat(str) : null;
  },
  toInt: (val) => {
    const num = helpers.toNumber(val);
    return num !== null ? Math.floor(num) : null;
  },
  toDate: (val) => new Date(val),
  toBoolean: (val) => {
    if (typeof val === 'boolean') return val;
    return ['true', 'yes', '1', 'on'].includes(String(val).toLowerCase().trim());
  },
  extractUrl: (val) => val?.match(/https?:\/\/[^\s]+/)?.[0] || null,
  extractEmail: (val) => val?.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] || null,
  stripHtml: (html) => cheerio.load(html || '').text(),
  parseJson: (val) => {
    try {
      return JSON.parse(val);
    } catch {
      return null;
    }
  },
  capitalize: (val) => String(val).charAt(0).toUpperCase() + String(val).slice(1).toLowerCase(),
  slug: (val) => String(val).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
};

/**
 * Schema presets for common patterns
 */
export const presets = {
  link: (selector = 'a') => ({ selector, attr: 'href' }),
  image: (selector = 'img') => ({ selector, attrs: ['src', 'alt'] }),
  meta: (name) => ({ selector: `meta[name="${name}"]`, attr: 'content' }),
  ogMeta: (property) => ({ selector: `meta[property="og:${property}"]`, attr: 'content' }),
  twitterMeta: (name) => ({ selector: `meta[name="twitter:${name}"]`, attr: 'content' }),
  jsonLd: (selector = 'script[type="application/ld+json"]') => ({
    selector,
    how: ($el) => $el.html(),
    convert: helpers.parseJson,
  }),
};

/**
 * Resolve relative URL to absolute
 */
function resolveUrl(url, baseUrl) {
  if (!url || !baseUrl) return url;
  try {
    return new URL(url, baseUrl).href;
  } catch {
    return url;
  }
}

/**
 * easyScrape
 * Core scraping logic for scrape-it.
 * @param {string|import('cheerio').CheerioAPI} input - HTML string or cheerio instance
 * @param {Object} schema - Scraping schema
 * @param {Object} options - Parsing options
 * @returns {Object} Scraped result
 */
export function easyScrape(input, schema, options = {}) {
  if (!input) {
    throw new Error('Input cannot be null or undefined');
  }

  const parseOptions = {
    xmlMode: options.xmlMode || false,
    decodeEntities: options.decodeEntities !== false,
    ...options.cheerioOptions
  };

  let $;
  try {
    $ = typeof input === "string" 
      ? cheerio.load(input, parseOptions) 
      : input;
  } catch (error) {
    throw new Error(`Failed to parse HTML: ${error.message}`);
  }

  const normalizeOpt = (opt) => {
    if (typeof opt === "string") opt = { selector: opt };

    // Determine the extraction method
    let howMethod;
    if (opt.attr) {
      howMethod = ($el) => $el.attr(opt.attr);
    } else if (opt.html) {
      howMethod = ($el) => $el.html();
    } else if (opt.outerHtml) {
      howMethod = ($el) => $.html($el);
    } else if (typeof opt.how === "function") {
      howMethod = opt.how;
    } else {
      howMethod = opt.how || "text";
    }

    return {
      selector: opt.selector ?? "",
      data: opt.data ?? {},
      how: howMethod,
      attr: opt.attr,
      attrs: opt.attrs,
      html: opt.html,
      outerHtml: opt.outerHtml,
      convert: opt.convert || ((x) => x),
      trimValue: opt.trimValue !== false,
      closest: opt.closest || "",
      eq: Number.isInteger(opt.eq) ? opt.eq : undefined,
      texteq: Number.isInteger(opt.texteq) ? opt.texteq : undefined,
      listItem: opt.listItem,
      map: typeof opt.map === 'function' ? opt.map : undefined,
      multiple: opt.multiple || false,
      filter: typeof opt.filter === 'function' ? opt.filter : undefined,
      defaultValue: opt.default,
      strict: opt.strict === true,
      regex: opt.regex,
      regexGroup: opt.regexGroup || 0,
      transform: Array.isArray(opt.transform) ? opt.transform : 
                 opt.transform ? [opt.transform] : [],
      includeIndex: opt.includeIndex || false,
      
      // New features
      parent: opt.parent,
      parents: opt.parents,
      siblings: opt.siblings,
      siblingSelector: opt.siblingSelector,
      textMode: opt.textMode || 'text',
      separator: opt.separator,
      resolveUrl: opt.resolveUrl,
      if: opt.if,
      ifExists: opt.ifExists,
      ifNotExists: opt.ifNotExists,
      slice: opt.slice,
      limit: opt.limit,
      unique: opt.unique,
      flatten: opt.flatten,
      validate: opt.validate,
      required: opt.required,
      table: opt.table,
    };
  };

  const handleDataObj = (data, context = $) => {
    const pageData = {};

    for (const [name, rawOpt] of Object.entries(data)) {
      const opt = normalizeOpt(rawOpt);

      // Check conditional extraction
      if (opt.if && typeof opt.if === 'function') {
        if (!opt.if($, context)) {
          pageData[name] = opt.defaultValue !== undefined ? opt.defaultValue : null;
          continue;
        }
      }

      if (opt.ifExists) {
        const checkContext = context === $ ? undefined : context;
        if (!$(opt.ifExists, checkContext).length) {
          pageData[name] = opt.defaultValue !== undefined ? opt.defaultValue : null;
          continue;
        }
      }

      if (opt.ifNotExists) {
        const checkContext = context === $ ? undefined : context;
        if ($(opt.ifNotExists, checkContext).length) {
          pageData[name] = opt.defaultValue !== undefined ? opt.defaultValue : null;
          continue;
        }
      }

      // Determine context
      let $context = context === $ ? undefined : context;
      
      if (!opt.listItem && !opt.map && !opt.table) {
        if (!$context && !opt.selector) {
          if (opt.strict || opt.required) {
            throw new Error(`No selector specified for field "${name}".`);
          }
          pageData[name] = opt.defaultValue !== undefined ? opt.defaultValue : null;
          continue;
        }
      }

      let $el = opt.selector ? $(opt.selector, $context) : $context;

      // Check if element exists BEFORE navigation
      if (!opt.listItem && !opt.map && !opt.table) {
        if ((!$el || !$el.length)) {
          if (opt.strict || opt.required) {
            throw new Error(
              `Element not found for selector "${opt.selector}" in field "${name}"`
            );
          }
          pageData[name] = opt.defaultValue !== undefined ? opt.defaultValue : null;
          continue;
        }
      }

      // Handle navigation AFTER confirming element exists
      if (opt.closest) {
        $el = $el.closest(opt.closest);
        if (!$el.length) {
          pageData[name] = opt.defaultValue !== undefined ? opt.defaultValue : null;
          continue;
        }
      }

      if (opt.parent) {
        if (typeof opt.parent === 'number') {
          for (let i = 0; i < opt.parent; i++) {
            $el = $el.parent();
            if (!$el.length) break;
          }
        } else {
          $el = $el.parent(opt.parent);
        }
        if (!$el.length) {
          pageData[name] = opt.defaultValue !== undefined ? opt.defaultValue : null;
          continue;
        }
      }

      if (opt.parents) {
        $el = $el.parents(opt.parents).first();
        if (!$el.length) {
          pageData[name] = opt.defaultValue !== undefined ? opt.defaultValue : null;
          continue;
        }
      }

      if (opt.siblings) {
        const sibMethod = opt.siblings === 'next' ? 'next' :
                         opt.siblings === 'prev' ? 'prev' :
                         opt.siblings === 'nextAll' ? 'nextAll' :
                         opt.siblings === 'prevAll' ? 'prevAll' : null;
        if (sibMethod) {
          $el = opt.siblingSelector ? $el[sibMethod](opt.siblingSelector) : $el[sibMethod]();
        }
      }

      // Handle filter
      if (opt.filter) {
        $el = $el.filter((i, elem) => opt.filter($(elem), i));
        if (!$el.length) {
          pageData[name] = opt.defaultValue !== undefined ? opt.defaultValue : null;
          continue;
        }
      }

      // Handle table parsing
      if (opt.table) {
        const tableData = [];
        const rows = $(opt.table.selector || 'tr', $el);
        let headers = [];

        rows.each((i, row) => {
          const $row = $(row);
          const cells = $row.find('th, td');
          
          if (i === 0 && opt.table.headers) {
            cells.each((j, cell) => {
              headers.push($(cell).text().trim());
            });
          } else {
            const rowData = opt.table.headers ? {} : [];
            cells.each((j, cell) => {
              const value = $(cell).text().trim();
              if (opt.table.headers) {
                rowData[headers[j] || `column_${j}`] = value;
              } else {
                rowData.push(value);
              }
            });
            if (opt.table.headers || rowData.length > 0) {
              tableData.push(rowData);
            }
          }
        });

        pageData[name] = tableData;
        continue;
      }

      // Handle map
      if (opt.map) {
        const elements = $el && $el.length ? $el : $($el);
        let mapped = [];
        elements.each((i, el) => {
          try {
            const mappedValue = opt.map($(el), $, i);
            if (mappedValue !== null && mappedValue !== undefined) {
              mapped.push(mappedValue);
            }
          } catch (error) {
            if (opt.strict) {
              throw new Error(`Map function failed for element ${i} in field "${name}": ${error.message}`);
            }
            console.warn(`Map function failed for element ${i} in field "${name}":`, error);
          }
        });

        // Apply array operations
        mapped = applyArrayOperations(mapped, opt);
        
        pageData[name] = mapped;
        continue;
      }

      // Handle list
      if (opt.listItem) {
        const items = $(opt.listItem, $context);
        let listData = [];

        if (Object.keys(opt.data).length === 0) {
          for (let i = 0; i < items.length; i++) {
            const item = items.eq(i);
            try {
              const value = extractText(item, opt);
              const itemData = opt.includeIndex 
                ? { text: value, _index: i }
                : value;
              listData.push(opt.convert(itemData, item));
            } catch (error) {
              if (opt.strict) {
                throw error;
              }
              console.warn(`Failed to extract list item ${i} in field "${name}":`, error);
            }
          }
        } else {
          for (let i = 0; i < items.length; i++) {
            const item = items.eq(i);
            try {
              const childData = handleDataObj(opt.data, item);
              const itemData = {
                ...childData,
                ...(opt.includeIndex && { _index: i })
              };
              listData.push(opt.convert(itemData, item));
            } catch (error) {
              if (opt.strict) {
                throw error;
              }
              console.warn(`Failed to extract list item ${i} in field "${name}":`, error);
            }
          }
        }

        // Apply array operations
        listData = applyArrayOperations(listData, opt);

        pageData[name] = listData;
        continue;
      }

      // Handle multiple elements
      if (opt.multiple && !opt.listItem) {
        let values = [];
        $el.each((i, elem) => {
          try {
            const $elem = $(elem);
            let val = extractValue($elem, opt, $);

            // Apply regex
            if (opt.regex && typeof val === "string") {
              const match = val.match(opt.regex);
              val = match ? match[opt.regexGroup] : (opt.defaultValue !== undefined ? opt.defaultValue : "");
            }

            // Resolve URL if needed
            if (opt.resolveUrl && options.baseUrl && typeof val === 'string') {
              val = resolveUrl(val, options.baseUrl);
            }

            let finalValue = opt.convert(val, $elem);
            
            for (const transform of opt.transform) {
              finalValue = transform(finalValue, $elem, $);
            }

            values.push(finalValue);
          } catch (error) {
            if (opt.strict) {
              throw new Error(`Failed to extract element ${i} in field "${name}": ${error.message}`);
            }
            console.warn(`Failed to extract element ${i} in field "${name}":`, error);
          }
        });

        // Apply array operations
        values = applyArrayOperations(values, opt);

        pageData[name] = values;
        continue;
      }

      // Handle eq
      if (opt.eq !== undefined) {
        $el = $el.eq(opt.eq);
        if (!$el.length) {
          pageData[name] = opt.defaultValue !== undefined ? opt.defaultValue : null;
          continue;
        }
      }

      // Handle texteq
      if (opt.texteq !== undefined) {
        const children = $el.contents().filter((i, el) => el.type === "text");
        const textNode = children[opt.texteq];
        if (!textNode) {
          pageData[name] = opt.defaultValue !== undefined ? opt.defaultValue : "";
          continue;
        }
        const textValue = textNode.data.trim();
        try {
          let finalValue = opt.convert(textValue);
          for (const transform of opt.transform) {
            finalValue = transform(finalValue, $el, $);
          }
          pageData[name] = finalValue;
        } catch (error) {
          if (opt.strict) {
            throw new Error(`Failed to convert texteq value in field "${name}": ${error.message}`);
          }
          pageData[name] = opt.defaultValue !== undefined ? opt.defaultValue : textValue;
        }
        continue;
      }

      // Handle nested data
      if (Object.keys(opt.data).length) {
        try {
          pageData[name] = handleDataObj(opt.data, $el);
        } catch (error) {
          if (opt.strict) {
            throw error;
          }
          console.warn(`Failed to extract nested data for field "${name}":`, error);
          pageData[name] = opt.defaultValue !== undefined ? opt.defaultValue : {};
        }
        continue;
      }

      // Handle multiple attributes
      if (opt.attrs) {
        const attrObj = {};
        opt.attrs.forEach(attr => {
          let val = $el.attr(attr);
          if (opt.resolveUrl && options.baseUrl && (attr === 'href' || attr === 'src') && val) {
            val = resolveUrl(val, options.baseUrl);
          }
          attrObj[attr] = val;
        });
        try {
          let finalValue = opt.convert(attrObj, $el);
          for (const transform of opt.transform) {
            finalValue = transform(finalValue, $el, $);
          }
          
          // Validate if needed
          if (opt.validate && !opt.validate(finalValue)) {
            throw new Error('Validation failed');
          }
          
          pageData[name] = finalValue;
        } catch (error) {
          if (opt.strict || opt.required) {
            throw new Error(`Failed to convert attrs in field "${name}": ${error.message}`);
          }
          pageData[name] = opt.defaultValue !== undefined ? opt.defaultValue : attrObj;
        }
        continue;
      }

      // Extract value
      let value;
      try {
        value = extractValue($el, opt, $);
      } catch (error) {
        if (opt.strict || opt.required) {
          throw new Error(`Failed to extract value for field "${name}": ${error.message}`);
        }
        value = opt.defaultValue !== undefined ? opt.defaultValue : "";
      }

      // Apply regex
      if (opt.regex && typeof value === "string") {
        const match = value.match(opt.regex);
        value = match ? match[opt.regexGroup] : (opt.defaultValue !== undefined ? opt.defaultValue : "");
      }

      // Resolve URL if needed
      if (opt.resolveUrl && options.baseUrl && typeof value === 'string') {
        value = resolveUrl(value, options.baseUrl);
      }

      // Convert and transform
      try {
        let finalValue = opt.convert(value, $el);
        
        for (const transform of opt.transform) {
          finalValue = transform(finalValue, $el, $);
        }
        
        // Validate if needed
        if (opt.validate && !opt.validate(finalValue)) {
          throw new Error('Validation failed');
        }

        // Check required
        if (opt.required && (finalValue === null || finalValue === undefined || finalValue === '')) {
          throw new Error(`Required field "${name}" is empty`);
        }
        
        pageData[name] = finalValue;
      } catch (error) {
        if (opt.strict || opt.required) {
          throw new Error(`Failed to convert/transform value in field "${name}": ${error.message}`);
        }
        console.warn(`Convert/transform function failed for field "${name}":`, error);
        pageData[name] = opt.defaultValue !== undefined ? opt.defaultValue : value;
      }
    }

    return pageData;
  };

  return handleDataObj(schema);
}

/**
 * Extract text based on textMode
 */
function extractText($el, opt) {
  if (opt.textMode === 'ownText') {
    return $el.contents()
      .filter((i, el) => el.type === 'text')
      .text()
      .trim();
  } else if (opt.textMode === 'deepText') {
    return $el.text().trim();
  }
  return $el.text().trim();
}

/**
 * Extract value from element
 */
function extractValue($el, opt, $) {
  let value = typeof opt.how === "function"
    ? opt.how($el)
    : typeof $el[opt.how] === "function"
    ? $el[opt.how]()
    : $el.text();

  if (typeof value === "string" && opt.trimValue) {
    value = value.trim();
  }

  // Handle text mode for string values
  if (opt.textMode && opt.textMode !== 'text' && typeof value === 'string') {
    value = extractText($el, opt);
  }

  // Handle separator for multiple text nodes
  if (opt.separator && typeof value === 'string') {
    const texts = $el.contents()
      .filter((i, el) => el.type === 'text')
      .map((i, el) => el.data.trim())
      .get()
      .filter(t => t);
    value = texts.join(opt.separator);
  }

  return value;
}

/**
 * Apply array operations (slice, limit, unique, flatten)
 */
function applyArrayOperations(arr, opt) {
  let result = arr;

  if (opt.unique) {
    result = [...new Set(result)];
  }

  if (opt.slice) {
    result = result.slice(opt.slice[0], opt.slice[1]);
  }

  if (opt.limit) {
    result = result.slice(0, opt.limit);
  }

  if (opt.flatten) {
    result = result.flat(opt.flatten === true ? 1 : opt.flatten);
  }

  return result;
}

export default easyScrape;