import * as cheerio from 'cheerio';

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

    return {
      selector: opt.selector ?? "",
      data: opt.data ?? {},
      how: opt.attr
        ? ($el) => $el.attr(opt.attr)
        : opt.html
        ? ($el) => $el.html()
        : opt.outerHtml
        ? ($el) => $.html($el)
        : typeof opt.how === "function"
        ? opt.how
        : opt.how || "text",
      attr: opt.attr,
      attrs: opt.attrs, // Multiple attributes
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
    };
  };

  const handleDataObj = (data, context = $) => {
    const pageData = {};

    for (const [name, rawOpt] of Object.entries(data)) {
      const opt = normalizeOpt(rawOpt);

      // Determine context
      let $context = context === $ ? undefined : context;
      
      // Skip validation if we have listItem or map (they handle their own context)
      if (!opt.listItem && !opt.map) {
        if (!$context && !opt.selector) {
          if (opt.strict) {
            throw new Error(
              `No selector specified for field "${name}".`
            );
          }
          pageData[name] = opt.defaultValue !== undefined ? opt.defaultValue : null;
          continue;
        }
      }

      let $el = opt.selector ? $(opt.selector, $context) : $context;

      // Check if element exists (skip for listItem as it handles its own elements)
      if (!opt.listItem && (!$el || !$el.length) && !opt.map) {
        if (opt.strict) {
          throw new Error(
            `Element not found for selector "${opt.selector}" in field "${name}"`
          );
        }
        pageData[name] = opt.defaultValue !== undefined ? opt.defaultValue : null;
        continue;
      }

      // Handle filter
      if (opt.filter) {
        $el = $el.filter((i, elem) => opt.filter($(elem), i));
        if (!$el.length) {
          pageData[name] = opt.defaultValue !== undefined ? opt.defaultValue : null;
          continue;
        }
      }

      // Handle map
      if (opt.map) {
        const elements = $el && $el.length ? $el : $($el);
        const mapped = [];
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
        pageData[name] = mapped;
        continue;
      }

      // Handle list
      if (opt.listItem) {
        const items = $(opt.listItem, $context);
        const listData = [];

        // If no nested data specified, just extract text from each item
        if (Object.keys(opt.data).length === 0) {
          for (let i = 0; i < items.length; i++) {
            const item = items.eq(i);
            try {
              const value = item.text().trim();
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
          // Extract nested data
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

        pageData[name] = listData;
        continue;
      }

      // Handle multiple elements (array mode)
      if (opt.multiple && !opt.listItem) {
        const values = [];
        $el.each((i, elem) => {
          try {
            const $elem = $(elem);
            let val = typeof opt.how === "function"
              ? opt.how($elem)
              : typeof $elem[opt.how] === "function"
              ? $elem[opt.how]()
              : $elem.text();
            
            if (typeof val === "string" && opt.trimValue) {
              val = val.trim();
            }

            // Apply regex if specified
            if (opt.regex && typeof val === "string") {
              const match = val.match(opt.regex);
              val = match ? match[opt.regexGroup] : (opt.defaultValue !== undefined ? opt.defaultValue : "");
            }

            let finalValue = opt.convert(val, $elem);
            
            // Apply transforms
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

      // Handle closest
      if (opt.closest) {
        $el = $el.closest(opt.closest);
        if (!$el.length) {
          pageData[name] = opt.defaultValue !== undefined ? opt.defaultValue : null;
          continue;
        }
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
          attrObj[attr] = $el.attr(attr);
        });
        try {
          let finalValue = opt.convert(attrObj, $el);
          for (const transform of opt.transform) {
            finalValue = transform(finalValue, $el, $);
          }
          pageData[name] = finalValue;
        } catch (error) {
          if (opt.strict) {
            throw new Error(`Failed to convert attrs in field "${name}": ${error.message}`);
          }
          pageData[name] = opt.defaultValue !== undefined ? opt.defaultValue : attrObj;
        }
        continue;
      }

      // Extract value
      let value;
      try {
        value = typeof opt.how === "function"
          ? opt.how($el)
          : typeof $el[opt.how] === "function"
          ? $el[opt.how]()
          : $el.text();
      } catch (error) {
        if (opt.strict) {
          throw new Error(`Failed to extract value for field "${name}": ${error.message}`);
        }
        value = opt.defaultValue !== undefined ? opt.defaultValue : "";
      }

      if (typeof value === "string" && opt.trimValue) {
        value = value.trim();
      }

      // Apply regex if specified
      if (opt.regex && typeof value === "string") {
        const match = value.match(opt.regex);
        value = match ? match[opt.regexGroup] : (opt.defaultValue !== undefined ? opt.defaultValue : "");
      }

      // Convert and transform
      try {
        let finalValue = opt.convert(value, $el);
        
        // Apply transforms
        for (const transform of opt.transform) {
          finalValue = transform(finalValue, $el, $);
        }
        
        pageData[name] = finalValue;
      } catch (error) {
        if (opt.strict) {
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

export default easyScrape;