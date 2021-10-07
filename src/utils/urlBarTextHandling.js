"use strict";
/* Safer regex of the two given in: https://stackoverflow.com/a/4749397/5951226 */
// The original Regex written and escaped for usage in Obj-C: "(?i)\\b((?:[a-z][\\w-]+:(?:/{1,3}|[a-z0-9%])|www\\d{0,3}[.]|[a-z0-9.\\-]+[.][a-z]{2,4}/?)(?:[^\\s()<>]+|\\(([^\\s()<>]+|(\\([^\\s()<>]+\\)))*\\))*(?:\\(([^\\s()<>]+|(\\([^\\s()<>]+\\)))*\\)|[^\\s`!()\\[\\]{};:'\".,<>?«»“”‘’])*)"
exports.__esModule = true;
exports.convertTextToSearchQuery = exports.SearchProvider = exports.isValidUrl = void 0;
var urlRegEx = /^((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/?)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))*(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’])*)/i;
function isValidUrl(text) {
    return urlRegEx.test(text);
}
exports.isValidUrl = isValidUrl;
var SearchProvider;
(function (SearchProvider) {
    SearchProvider["Bing"] = "Bing";
    /* I'll support these later */
    // Cliqz = "Cliqz",
    SearchProvider["DuckDuckGo"] = "DuckDuckGo";
    SearchProvider["Google"] = "Google";
    // Yahoo = "Yahoo",
})(SearchProvider = exports.SearchProvider || (exports.SearchProvider = {}));
function convertTextToSearchQuery(text, searchProvider) {
    var searchQuery = "";
    switch (searchProvider) {
        case SearchProvider.Bing:
            {
                var termDelimiter_1 = "+";
                var params = text.split(" ").reduce(function (acc, term, i) { return acc + (i > 0 ? termDelimiter_1 : "") + encodeURIComponent(term); }, "");
                searchQuery = "https://www.bing.com/search?q=" + params;
            }
            break;
        case SearchProvider.Google:
            {
                var termDelimiter_2 = "%20";
                var params = text.split(" ").reduce(function (acc, term, i) { return acc + (i > 0 ? termDelimiter_2 : "") + encodeURIComponent(term); }, "");
                searchQuery = "https://www.google.com/search?q=" + params;
            }
            break;
        case SearchProvider.DuckDuckGo:
            {
                // Seems to accept either "+" or "%20" as a term delimeter.
                var termDelimiter_3 = "+";
                var params = text.split(" ").reduce(function (acc, term, i) { return acc + (i > 0 ? termDelimiter_3 : "") + encodeURIComponent(term); }, "");
                searchQuery = "https://www.duckduckgo.com/?q=" + params;
            }
            break;
    }
    return searchQuery;
}
exports.convertTextToSearchQuery = convertTextToSearchQuery;
