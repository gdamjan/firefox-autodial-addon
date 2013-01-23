self.port.on('history', function(history) {
   var html = '<ul>';
   for (var i=0; i<history.length; i++) {
       var node = history[i];
       html += '<li>';
       if (node.icon) {
            var favicon = node.icon.slice(17); // remove the "moz-pack:favicon:" prefix
            html += '<img height=16 width=16 src="' + favicon + '">';
       }
       html += '<a href="' + node.uri + '">';
       if (node.title) {
            html += node.title;
       } else {
           html += node.uri;
       }
       html += '</a>';
   }
   html += '</ul>';

   document.body.innerHTML = html;
});


/* inject the CSS link. I coudn't find another way in `tab.attach` */
self.port.on('css', function(csslink) {
   var fileref = document.createElement("link");
   fileref.setAttribute("rel", "stylesheet");
   fileref.setAttribute("type", "text/css");
   fileref.setAttribute("href", csslink);
   document.head.appendChild(fileref);
});