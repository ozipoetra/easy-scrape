import * as cheerio from 'cheerio';

/**
 * Function to extract data from a Cheerio element
 */
export type HowFunction = (element: cheerio.Cheerio<cheerio.AnyNode>) => any;

/**
 * Function to convert extracted values
 */
export type ConvertFunction = (value: any, element?: cheerio.Cheerio<cheerio.AnyNode>) => any;

/**
 * Function to transform values in a pipeline
 */
export type TransformFunction = (value: any, element: cheerio.Cheerio<cheerio.AnyNode>, $: cheerio.CheerioAPI) => any;

/**
 * Function to map over elements
 */
export type MapFunction = (element: cheerio.Cheerio<cheerio.AnyNode>, $: cheerio.CheerioAPI, index: number) => any;

/**
 * Function to filter elements
 */
export type FilterFunction = (element: cheerio.Cheerio<cheerio.AnyNode>, index: number) => boolean;

/**
 * Scraping options for a field
 */
export interface ScrapeOptions {
  /**
   * CSS selector to find the element(s)
   */
  selector?: string;

  /**
   * Nested data schema for extracting structured data
   */
  data?: Record<string, string | ScrapeOptions>;

  /**
   * Attribute name to extract (e.g., 'href', 'src')
   */
  attr?: string;

  /**
   * Array of attribute names to extract multiple attributes
   * Returns an object with attribute names as keys
   */
  attrs?: string[];

  /**
   * Extract inner HTML instead of text
   */
  html?: boolean;

  /**
   * Extract outer HTML (including the element itself)
   */
  outerHtml?: boolean;

  /**
   * How to extract the value - can be a method name or function
   */
  how?: string | HowFunction;

  /**
   * Function to convert the extracted value
   */
  convert?: ConvertFunction;

  /**
   * Array of transform functions to apply after conversion
   * Functions are applied in order
   */
  transform?: TransformFunction | TransformFunction[];

  /**
   * Whether to trim whitespace from extracted values (default: true)
   */
  trimValue?: boolean;

  /**
   * CSS selector to find the closest ancestor element
   */
  closest?: string;

  /**
   * Select a specific element by index
   */
  eq?: number;

  /**
   * Select a specific text node by index
   */
  texteq?: number;

  /**
   * CSS selector for list items to iterate over
   */
  listItem?: string;

  /**
   * Function to map over elements and extract values
   */
  map?: MapFunction;

  /**
   * Extract all matching elements as an array (instead of just the first)
   */
  multiple?: boolean;

  /**
   * Function to filter elements before extraction
   */
  filter?: FilterFunction;

  /**
   * Default value to use when element is not found or extraction fails
   */
  default?: any;

  /**
   * Throw errors instead of using default values or logging warnings (default: false)
   */
  strict?: boolean;

  /**
   * Regular expression to extract part of the text
   */
  regex?: RegExp;

  /**
   * Capture group index to use from regex match (default: 0)
   */
  regexGroup?: number;

  /**
   * Include _index property in list items
   */
  includeIndex?: boolean;
}

/**
 * Scraping schema - maps field names to scraping options
 */
export type ScrapeSchema = Record<string, string | ScrapeOptions>;

/**
 * Options for HTML parsing
 */
export interface EasyScrapeOptions {
  /**
   * Parse as XML instead of HTML
   */
  xmlMode?: boolean;

  /**
   * Decode HTML entities (default: true)
   */
  decodeEntities?: boolean;

  /**
   * Additional Cheerio load options
   */
  cheerioOptions?: cheerio.CheerioOptions;
}

/**
 * easyScrape
 * Core scraping logic for scrape-it.
 * @param input - HTML string or cheerio instance
 * @param schema - Scraping schema
 * @param options - Parsing options
 * @returns Scraped result
 */
export declare function easyScrape(
  input: string | cheerio.CheerioAPI,
  schema: ScrapeSchema,
  options?: EasyScrapeOptions
): Record<string, any>;

declare const _default: typeof easyScrape;
export default _default;