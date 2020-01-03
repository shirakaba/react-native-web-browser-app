/* Safer regex of the two given in: https://stackoverflow.com/a/4749397/5951226 */
// The original Regex written and escaped for usage in Obj-C: "(?i)\\b((?:[a-z][\\w-]+:(?:/{1,3}|[a-z0-9%])|www\\d{0,3}[.]|[a-z0-9.\\-]+[.][a-z]{2,4}/?)(?:[^\\s()<>]+|\\(([^\\s()<>]+|(\\([^\\s()<>]+\\)))*\\))*(?:\\(([^\\s()<>]+|(\\([^\\s()<>]+\\)))*\\)|[^\\s`!()\\[\\]{};:'\".,<>?«»“”‘’])*)"

const urlRegEx: RegExp = /^((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/?)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))*(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’])*)/i

export function isValidUrl(text: string): boolean {
    return urlRegEx.test(text);
}

export enum SearchProvider {
    Bing = "Bing",

    /* I'll support these later */
    // Cliqz = "Cliqz",
    DuckDuckGo = "DuckDuckGo",
    Google = "Google",
    // Yahoo = "Yahoo",
}

export function convertTextToSearchQuery(text: string, searchProvider: SearchProvider): string {
    let searchQuery: string = "";
    switch(searchProvider){
        case SearchProvider.Bing:
            {
                const termDelimiter: string = "+";
                const params: string = text.split(" ").reduce((acc, term, i) => acc + (i > 0 ? termDelimiter : "") + encodeURIComponent(term), "")
                searchQuery = "https://www.bing.com/search?q=" + params;
            }
            break;
        case SearchProvider.Google:
            {
                const termDelimiter: string = "%20";
                const params: string = text.split(" ").reduce((acc, term, i) => acc + (i > 0 ? termDelimiter : "") + encodeURIComponent(term), "")
                searchQuery = "https://www.google.com/search?q=" + params;
            }
            break;
        case SearchProvider.DuckDuckGo:
            {
                // Seems to accept either "+" or "%20" as a term delimeter.
                const termDelimiter: string = "+";
                const params: string = text.split(" ").reduce((acc, term, i) => acc + (i > 0 ? termDelimiter : "") + encodeURIComponent(term), "")
                searchQuery = "https://www.duckduckgo.com/?q=" + params;
            }
            break;
    }

    return searchQuery;
}