/*
  This addon implements a simple autodial kind of content on new empty tabs
*/

const {Cc, Ci, Cr, Cu} = require("chrome");
const MAXRESULTS = 35;

var tabs = require('tabs');
var data = require('self').data;

function get_history_by_frecency (maxResults) {
    var historyService = Cc["@mozilla.org/browser/nav-history-service;1"]
                                   .getService(Ci.nsINavHistoryService);
    var query = historyService.getNewQuery();
    var options = historyService.getNewQueryOptions();
    options.sortingMode = options.SORT_BY_FRECENCY_DESCENDING;
    options.maxResults = maxResults || MAXRESULTS;

    // execute the query
    var result = historyService.executeQuery(query, options);
    
    // iterate over the results and populate a list of serializable objects
    var history = [];
    result.root.containerOpen = true;
    var count = result.root.childCount;
    for (var i = 0; i < count; i++) {
        var node = result.root.getChild(i);
        var n = {title: node.title, uri: node.uri, icon: node.icon, frecency: node.frecency};
        history.push(n);
    }
    result.root.containerOpen = false;

    return history;
}

exports.main = function() {

    tabs.on('open', function(tab) {
      tab.on('ready', function(tab) {
        if (tab.url == 'about:blank') {
            var t = tab.attach({
               contentScriptFile: data.url("frontend.js")
            });
            // inject css. no other way in tab.attach
            t.port.emit('css', data.url("frontend.css"));
            // inject the history array
            t.port.emit('history', get_history_by_frecency());
        }
      });
    });

};
