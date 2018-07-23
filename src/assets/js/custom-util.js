function scopeSelectorAll(selector, context) {
  context = context || document;
  var nodes = [];

  selector.split(',').forEach(function (each) {
    var n = [];

    each.trim().split(' ').reverse().forEach(function (selector) {
      var ns = [];

      if (!n.length) {
        n = Array.prototype.slice.call(context.querySelectorAll(selector));
      } else {
        n.forEach(function (nss) {
          var nsss = Array.prototype.slice.call(nss.querySelectorAll(selector));
          if (nsss.length) {
            ns.push(nsss);
          }
        });
        n = ns;
      }

    });

    n.forEach(function (node) {
      nodes.push(node);
    });
  });

  return nodes;
};

