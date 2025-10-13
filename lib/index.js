import * as cheerio from 'cheerio';

/**
 * easyScrape
 * Core scraping logic for scrape-it.
 * @param {string|import('cheerio').CheerioAPI} input - HTML string or cheerio instance
 * @param {Object} schema - Scraping schema
 * @returns {Object} Scraped result
 */
export function easyScrape(input, schema) {
  const $ = typeof input === "string" ? cheerio.load(input) : input;

  const normalizeOpt = (opt) => {
    if (typeof opt === "string") opt = { selector: opt };

    return {
      selector: opt.selector ?? "",
      data: opt.data ?? {},
      how: opt.attr
        ? ($el) => $el.attr(opt.attr)
        : typeof opt.how === "function"
        ? opt.how
        : opt.how || "text",
      attr: opt.attr,
      convert: opt.convert || ((x) => x),
      trimValue: opt.trimValue !== false,
      closest: opt.closest || "",
      eq: Number.isInteger(opt.eq) ? opt.eq : undefined,
      texteq: Number.isInteger(opt.texteq) ? opt.texteq : undefined,
      listItem: opt.listItem,
      map: typeof opt.map === 'function' ? opt.map : undefined, // new map support
    };
  };

  const handleDataObj = (data, context = $) => {
    const pageData = {};

    for (const [name, rawOpt] of Object.entries(data)) {
      const opt = normalizeOpt(rawOpt);

      // Determine context
      let $context = context === $ ? undefined : context;
      if (!$context && !opt.selector && !opt.listItem && !opt.map) {
        throw new Error(
          `No selector, listItem, or map function specified for field "${name}".`
        );
      }

      let $el = opt.selector ? $(opt.selector, $context) : $context;

      // Handle map
      if (opt.map) {
        const elements = $el instanceof $ ? $el : $($el);
        const mapped = [];
        elements.each((i, el) => {
          const mappedValue = opt.map($(el), $);
          if (mappedValue !== null && mappedValue !== undefined) {
            mapped.push(mappedValue);
          }
        });
        pageData[name] = mapped;
        continue;
      }

      // Handle list
      if (opt.listItem) {
        const items = $(opt.listItem, $context);
        const listData = [];

        for (let i = 0; i < items.length; i++) {
          const item = items.eq(i);
          const childData = handleDataObj(opt.data, item);
          listData.push(opt.convert(childData));
        }

        pageData[name] = listData;
        continue;
      }

      // Handle eq
      if (opt.eq !== undefined) {
        $el = $el.eq(opt.eq);
      }

      // Handle texteq
      if (opt.texteq !== undefined) {
        const children = $el.contents().filter((i, el) => el.type === "text");
        const textNode = children[opt.texteq];
        if (!textNode) {
          pageData[name] = "";
          continue;
        }
        const textValue = textNode.data.trim();
        pageData[name] = opt.convert(textValue);
        continue;
      }

      // Handle closest
      if (opt.closest) {
        $el = $el.closest(opt.closest);
      }

      // Handle nested data
      if (Object.keys(opt.data).length) {
        pageData[name] = handleDataObj(opt.data, $el);
        continue;
      }

      // Extract value
      let value =
        typeof opt.how === "function"
          ? opt.how($el)
          : typeof $el[opt.how] === "function"
          ? $el[opt.how]()
          : $el.text();

      if (typeof value === "string" && opt.trimValue) {
        value = value.trim();
      }

      pageData[name] = opt.convert(value, $el);
    }

    return pageData;
  };

  return handleDataObj(schema);
}

export default easyScrape;
