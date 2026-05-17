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
 * Function to validate extracted values
 */
export type ValidateFunction = (value: any) => boolean;

/**
 * Conditional function to determine if extraction should proceed
 */
export type IfFunction = ($: cheerio.CheerioAPI, context?: cheerio.Cheerio<cheerio.AnyNode>) => boolean;

/**
 * Text extraction mode
 */
export type TextMode = 'text' | 'ownText' | 'deepText';

/**
 * Whitespace handling mode
 */
export type WhitespaceMode = 'normal' | 'collapse' | 'preserve';

/**
 * Sibling navigation direction
 */
export type SiblingDirection = 'next' | 'prev' | 'nextAll' | 'prevAll';

/**
 * Table parsing options
 */
export interface TableOptions {
  /**
   * Whether the first row contains headers
   */
  headers?: boolean;

  /**
   * Selector for table rows (default: 'tr')
   */
  selector?: string;
}

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

  // NEW FEATURES

  /**
   * Navigate to parent element(s)
   * - Number: Move up N levels
   * - String: Find parent matching selector
   */
  parent?: number | string;

  /**
   * Find ancestor element matching selector (returns first match)
   */
  parents?: string;

  /**
   * Navigate to sibling elements
   */
  siblings?: SiblingDirection;

  /**
   * Selector to filter siblings
   */
  siblingSelector?: string;

  /**
   * Text extraction mode
   * - 'text': All text including descendants (default)
   * - 'ownText': Only direct text nodes
   * - 'deepText': All text including nested elements
   */
  textMode?: TextMode;

  /**
   * Separator for joining multiple text nodes
   */
  separator?: string;

  /**
   * Resolve relative URLs to absolute using baseUrl option
   */
  resolveUrl?: boolean;

  /**
   * Conditional function - only extract if returns true
   */
  if?: IfFunction;

  /**
   * Only extract if this selector exists in context
   */
  ifExists?: string;

  /**
   * Only extract if this selector does NOT exist in context
   */
  ifNotExists?: string;

  /**
   * Array slice operation [start, end]
   * Applied after unique but before limit
   */
  slice?: [number, number];

  /**
   * Limit number of items in array
   * Applied after unique and slice
   */
  limit?: number;

  /**
   * Remove duplicate values from array
   * Applied before slice and limit
   */
  unique?: boolean;

  /**
   * Flatten nested arrays
   * - true or 1: Flatten one level
   * - number: Flatten N levels
   */
  flatten?: boolean | number;

  /**
   * Validation function - must return true for value to be accepted
   */
  validate?: ValidateFunction;

  /**
   * Field is required - throws error if missing or empty
   */
  required?: boolean;

/**
 * Parse HTML table
 */
  table?: TableOptions;

  /**
   * Decode HTML entities for this field
   */
  decodeEntities?: boolean;

  /**
   * Extract all text nodes as array
   */
  textnodes?: boolean;

  /**
   * Whitespace handling mode
   * - 'normal': trim
   * - 'collapse': collapse whitespace to single space
   * - 'preserve': keep all whitespace
   */
  whitespace?: WhitespaceMode;

  /**
   * Schema reference name (for reuse with registerRef)
   */
  $ref?: string;
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

  /**
   * Base URL for resolving relative URLs
   * Used when resolveUrl option is true on fields
   */
  baseUrl?: string;

  /**
   * Enable debug logging
   */
  debug?: boolean;
}

/**
 * Helper functions for common transformations
 */
export const helpers: {
  /**
   * Parse number from string, removing non-numeric characters
   */
  toNumber: (val: any) => number | null;

  /**
   * Parse integer from string, removing non-numeric characters
   */
  toInt: (val: any) => number | null;

  /**
   * Convert value to Date object
   */
  toDate: (val: any) => Date;

  /**
   * Convert string to boolean
   * Accepts: 'true', 'yes', '1', 'on' (case-insensitive)
   */
  toBoolean: (val: any) => boolean;

  /**
   * Extract first URL from text
   */
  extractUrl: (val: any) => string | null;

  /**
   * Extract first email address from text
   */
  extractEmail: (val: any) => string | null;

  /**
   * Strip HTML tags and return plain text
   */
  stripHtml: (html: string) => string;

  /**
   * Parse JSON string
   */
  parseJson: (val: string) => any | null;

  /**
   * Capitalize first letter, lowercase rest
   */
  capitalize: (val: any) => string;

  /**
   * Convert string to URL-friendly slug
   */
  slug: (val: any) => string;
};

/**
 * Schema presets for common patterns
 */
export const presets: {
  /**
   * Extract href from link
   * @param selector - CSS selector (default: 'a')
   */
  link: (selector?: string) => ScrapeOptions;

  /**
   * Extract src and alt from image
   * @param selector - CSS selector (default: 'img')
   */
  image: (selector?: string) => ScrapeOptions;

  /**
   * Extract meta tag content by name
   * @param name - Meta tag name attribute
   */
  meta: (name: string) => ScrapeOptions;

  /**
   * Extract Open Graph meta tag
   * @param property - OG property (without 'og:' prefix)
   */
  ogMeta: (property: string) => ScrapeOptions;

  /**
   * Extract Twitter Card meta tag
   * @param name - Twitter meta name (without 'twitter:' prefix)
   */
  twitterMeta: (name: string) => ScrapeOptions;

  /**
   * Extract and parse JSON-LD structured data
   * @param selector - CSS selector (default: 'script[type="application/ld+json"]')
   */
  jsonLd: (selector?: string) => ScrapeOptions;
};

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

/**
 * Quick one-liner extraction - pass selector string directly
 * @param input - HTML string or cheerio instance
 * @param selector - CSS selector
 * @param options - Parsing options
 * @returns Extracted text/value
 */
export declare function pluck(
  input: string | cheerio.CheerioAPI,
  selector: string,
  options?: EasyScrapeOptions
): any;

/**
 * Extract all matching elements as array without schema wrapper
 * @param input - HTML string or cheerio instance
 * @param selector - CSS selector
 * @param options - Parsing options
 * @returns Array of Cheerio elements
 */
export declare function extractAll(
  input: string | cheerio.CheerioAPI,
  selector: string,
  options?: EasyScrapeOptions
): cheerio.Cheerio<cheerio.AnyNode>[];

/**
 * Create schema reference for reuse
 * @param name - Reference name
 * @param schema - Schema to reference
 * @returns Reference object
 */
export declare function createRef(name: string, schema: ScrapeOptions): { $ref: string };

/**
 * Register a schema for reference reuse
 * @param name - Reference name
 * @param schema - Schema to register
 */
export declare function registerRef(name: string, schema: ScrapeOptions): void;

/**
 * Clear all registered schema references
 */
export declare function clearRefs(): void;

declare const _default: typeof easyScrape;
export default _default;