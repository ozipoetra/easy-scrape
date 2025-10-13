import type { CheerioAPI, Cheerio } from "cheerio";

export interface ScrapeField {
  selector?: string;
  how?: string | (($el: Cheerio) => any);
  convert?: (val: any, el: Cheerio) => any;
  attr?: string;
  eq?: number;
  texteq?: number;
  trimValue?: boolean;
  closest?: string;
  listItem?: string;
  data?: Record<string, ScrapeField | string>;
}

export function easyScrape(
  input: string | CheerioAPI,
  schema: Record<string, ScrapeField | string>
): Record<string, any>;

export default easyScrape;
