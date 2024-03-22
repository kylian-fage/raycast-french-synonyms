import got from "got";
import * as cheerio from "cheerio";
import { removeDuplicates } from "./utils/functions";
import { getPreferenceValues } from "@raycast/api";
import { SearchType, Word } from "./types";

export default async function searchWords(word: string, searchType: SearchType): Promise<Word[]> {
  const url: URL = new URL("https://crisco4.unicaen.fr/des/synonymes/");
  url.pathname += encodeURIComponent(word).replace(/%20/g, "+");

  try {
    const response = await got(url);
    const $ = cheerio.load(response.body);
    let synonyms: Word[] = [];
    const firstSynonyms: Word[] = [];

    const mostRelevantFirst = getPreferenceValues<Preferences>().mostRelevantFirst;

    if (searchType === SearchType.SYNONYM && mostRelevantFirst) {
      $("table a").each((index: number, element: Element) => {
        const text: string = $(element).text().trim();
        firstSynonyms.push(text);
      });
    }
    $(`div:has(i.titre:contains('${searchType}')) ~ a`).each((index: number, element: Element) => {
      const text: string = $(element).text();
      if (!firstSynonyms.includes(text)) {
        synonyms.push(text);
      }
    });

    synonyms.sort((a, b) => a.localeCompare(b, "fr"));
    synonyms = [...firstSynonyms, ...synonyms];

    return removeDuplicates(synonyms);
  } catch (err) {
    return [];
  }
}
