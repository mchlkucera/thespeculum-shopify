/* ==================================================
#Zoom
#Cookie
#Waypoints
#Responsive iFrames
#Pointer events polyfill
#Flickity
#URL parser
#Object-fit polyfill
#Offscreen check
#Lazyframe
#Fancybox
#Plyr

/* ===============================================
  #Zoom
================================================== */

/*!
  Zoom 1.7.15
  license: MIT
  http://www.jacklmoore.com/zoom
*/
(function ($) {
   var defaults = {
      url: false,
      callback: false,
      target: false,
      duration: 120,
      on: "mouseover",
      touch: true,
      onZoomIn: false,
      onZoomOut: false,
      magnify: 1,
   };
   $.zoom = function (target, source, img, magnify) {
      var targetHeight,
         targetWidth,
         sourceHeight,
         sourceWidth,
         xRatio,
         yRatio,
         offset,
         $target = $(target),
         position = $target.css("position"),
         $source = $(source);
      $target.css(
         "position",
         /(absolute|fixed)/.test(position) ? position : "relative"
      );
      $target.css("overflow", "hidden");
      img.style.width = img.style.height = "";
      $(img)
         .addClass("zoomImg")
         .css({
            position: "absolute",
            top: 0,
            left: 0,
            opacity: 0,
            width: img.width * magnify,
            height: img.height * magnify,
            border: "none",
            maxWidth: "none",
            maxHeight: "none",
         })
         .appendTo(target);
      return {
         init: function () {
            targetWidth = $target.outerWidth();
            targetHeight = $target.outerHeight();
            if (source === $target[0]) {
               sourceWidth = targetWidth;
               sourceHeight = targetHeight;
            } else {
               sourceWidth = $source.outerWidth();
               sourceHeight = $source.outerHeight();
            }
            xRatio = (img.width - targetWidth) / sourceWidth;
            yRatio = (img.height - targetHeight) / sourceHeight;
            offset = $source.offset();
         },
         move: function (e) {
            var left = e.pageX - offset.left,
               top = e.pageY - offset.top;
            top = Math.max(Math.min(top, sourceHeight), 0);
            left = Math.max(Math.min(left, sourceWidth), 0);
            img.style.left = left * -xRatio + "px";
            img.style.top = top * -yRatio + "px";
         },
      };
   };
   $.fn.zoom = function (options) {
      return this.each(function () {
         var settings = $.extend({}, defaults, options || {}),
            target = settings.target || this,
            source = this,
            $source = $(source),
            $target = $(target),
            img = document.createElement("img"),
            $img = $(img),
            mousemove = "mousemove.zoom",
            clicked = false,
            touched = false,
            $urlElement;
         if (!settings.url) {
            $urlElement = $source.find("img");
            if ($urlElement[0]) {
               settings.url =
                  $urlElement.data("src") || $urlElement.attr("src");
            }
            if (!settings.url) {
               return;
            }
         }
         (function () {
            var position = $target.css("position");
            var overflow = $target.css("overflow");
            $source.one("zoom.destroy", function () {
               $source.off(".zoom");
               $target.css("position", position);
               $target.css("overflow", overflow);
               $img.remove();
            });
         })();
         img.onload = function () {
            var zoom = $.zoom(target, source, img, settings.magnify);
            function start(e) {
               zoom.init();
               zoom.move(e);
               $img
                  .stop()
                  .fadeTo(
                     $.support.opacity ? settings.duration : 0,
                     1,
                     $.isFunction(settings.onZoomIn)
                        ? settings.onZoomIn.call(img)
                        : false
                  );
            }
            function stop() {
               $img
                  .stop()
                  .fadeTo(
                     settings.duration,
                     0,
                     $.isFunction(settings.onZoomOut)
                        ? settings.onZoomOut.call(img)
                        : false
                  );
            }
            if (settings.on === "grab") {
               $source.on("mousedown.zoom", function (e) {
                  if (e.which === 1) {
                     $(document).one("mouseup.zoom", function () {
                        stop();
                        $(document).off(mousemove, zoom.move);
                     });
                     start(e);
                     $(document).on(mousemove, zoom.move);
                     e.preventDefault();
                  }
               });
            } else if (settings.on === "click") {
               $source.on("click.zoom", function (e) {
                  if (clicked) {
                     return;
                  } else {
                     clicked = true;
                     start(e);
                     $(document).on(mousemove, zoom.move);
                     $(document).one("click.zoom", function () {
                        stop();
                        clicked = false;
                        $(document).off(mousemove, zoom.move);
                     });
                     return false;
                  }
               });
            } else if (settings.on === "toggle") {
               $source.on("click.zoom", function (e) {
                  if (clicked) {
                     stop();
                  } else {
                     start(e);
                  }
                  clicked = !clicked;
               });
            } else if (settings.on === "mouseover") {
               zoom.init();
               $source
                  .on("mouseenter.zoom", start)
                  .on("mouseleave.zoom", stop)
                  .on(mousemove, zoom.move);
            }
            if (settings.touch) {
               $source
                  .on("touchstart.zoom", function (e) {
                     e.preventDefault();
                     if (touched) {
                        touched = false;
                        stop();
                     } else {
                        touched = true;
                        start(
                           e.originalEvent.touches[0] ||
                              e.originalEvent.changedTouches[0]
                        );
                     }
                  })
                  .on("touchmove.zoom", function (e) {
                     e.preventDefault();
                     zoom.move(
                        e.originalEvent.touches[0] ||
                           e.originalEvent.changedTouches[0]
                     );
                  })
                  .on("touchend.zoom", function (e) {
                     e.preventDefault();
                     if (touched) {
                        touched = false;
                        stop();
                     }
                  });
            }
            if ($.isFunction(settings.callback)) {
               settings.callback.call(img);
            }
         };
         img.src = settings.url;
      });
   };
   $.fn.zoom.defaults = defaults;
})(window.jQuery);

/* ===============================================
  #Remodal
================================================== */

/* ===============================================
  #Cookie
================================================== */

/*!
 * JavaScript Cookie v2.1.4
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */

!(function (e) {
   var n = !1;
   if (
      ("function" == typeof define && define.amd && (define(e), (n = !0)),
      "object" == typeof exports && ((module.exports = e()), (n = !0)),
      !n)
   ) {
      var o = window.Cookies,
         t = (window.Cookies = e());
      t.noConflict = function () {
         return (window.Cookies = o), t;
      };
   }
})(function () {
   function e() {
      for (var e = 0, n = {}; e < arguments.length; e++) {
         var o = arguments[e];
         for (var t in o) n[t] = o[t];
      }
      return n;
   }
   function n(o) {
      function t(n, r, i) {
         var c;
         if ("undefined" != typeof document) {
            if (arguments.length > 1) {
               if (
                  "number" ==
                  typeof (i = e({ path: "/" }, t.defaults, i)).expires
               ) {
                  var a = new Date();
                  a.setMilliseconds(a.getMilliseconds() + 864e5 * i.expires),
                     (i.expires = a);
               }
               i.expires = i.expires ? i.expires.toUTCString() : "";
               try {
                  (c = JSON.stringify(r)), /^[\{\[]/.test(c) && (r = c);
               } catch (e) {}
               (r = o.write
                  ? o.write(r, n)
                  : encodeURIComponent(String(r)).replace(
                       /%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,
                       decodeURIComponent
                    )),
                  (n = (n = (n = encodeURIComponent(String(n))).replace(
                     /%(23|24|26|2B|5E|60|7C)/g,
                     decodeURIComponent
                  )).replace(/[\(\)]/g, escape));
               var f = "";
               for (var s in i)
                  i[s] && ((f += "; " + s), !0 !== i[s] && (f += "=" + i[s]));
               return (document.cookie = n + "=" + r + f);
            }
            n || (c = {});
            for (
               var p = document.cookie ? document.cookie.split("; ") : [],
                  d = /(%[0-9A-Z]{2})+/g,
                  u = 0;
               u < p.length;
               u++
            ) {
               var l = p[u].split("="),
                  C = l.slice(1).join("=");
               '"' === C.charAt(0) && (C = C.slice(1, -1));
               try {
                  var g = l[0].replace(d, decodeURIComponent);
                  if (
                     ((C = o.read
                        ? o.read(C, g)
                        : o(C, g) || C.replace(d, decodeURIComponent)),
                     this.json)
                  )
                     try {
                        C = JSON.parse(C);
                     } catch (e) {}
                  if (n === g) {
                     c = C;
                     break;
                  }
                  n || (c[g] = C);
               } catch (e) {}
            }
            return c;
         }
      }
      return (
         (t.set = t),
         (t.get = function (e) {
            return t.call(t, e);
         }),
         (t.getJSON = function () {
            return t.apply({ json: !0 }, [].slice.call(arguments));
         }),
         (t.defaults = {}),
         (t.remove = function (n, o) {
            t(n, "", e(o, { expires: -1 }));
         }),
         (t.withConverter = n),
         t
      );
   }
   return n(function () {});
});

/* ===============================================
  #Waypoints
================================================== */

/*!
Waypoints - 4.0.0
Copyright © 2011-2015 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blob/master/licenses.txt
*/
!(function () {
   "use strict";
   function t(o) {
      if (!o) throw new Error("No options passed to Waypoint constructor");
      if (!o.element)
         throw new Error("No element option passed to Waypoint constructor");
      if (!o.handler)
         throw new Error("No handler option passed to Waypoint constructor");
      (this.key = "waypoint-" + e),
         (this.options = t.Adapter.extend({}, t.defaults, o)),
         (this.element = this.options.element),
         (this.adapter = new t.Adapter(this.element)),
         (this.callback = o.handler),
         (this.axis = this.options.horizontal ? "horizontal" : "vertical"),
         (this.enabled = this.options.enabled),
         (this.triggerPoint = null),
         (this.group = t.Group.findOrCreate({
            name: this.options.group,
            axis: this.axis,
         })),
         (this.context = t.Context.findOrCreateByElement(this.options.context)),
         t.offsetAliases[this.options.offset] &&
            (this.options.offset = t.offsetAliases[this.options.offset]),
         this.group.add(this),
         this.context.add(this),
         (i[this.key] = this),
         (e += 1);
   }
   var e = 0,
      i = {};
   (t.prototype.queueTrigger = function (t) {
      this.group.queueTrigger(this, t);
   }),
      (t.prototype.trigger = function (t) {
         this.enabled && this.callback && this.callback.apply(this, t);
      }),
      (t.prototype.destroy = function () {
         this.context.remove(this), this.group.remove(this), delete i[this.key];
      }),
      (t.prototype.disable = function () {
         return (this.enabled = !1), this;
      }),
      (t.prototype.enable = function () {
         return this.context.refresh(), (this.enabled = !0), this;
      }),
      (t.prototype.next = function () {
         return this.group.next(this);
      }),
      (t.prototype.previous = function () {
         return this.group.previous(this);
      }),
      (t.invokeAll = function (t) {
         var e = [];
         for (var o in i) e.push(i[o]);
         for (var n = 0, r = e.length; r > n; n++) e[n][t]();
      }),
      (t.destroyAll = function () {
         t.invokeAll("destroy");
      }),
      (t.disableAll = function () {
         t.invokeAll("disable");
      }),
      (t.enableAll = function () {
         t.invokeAll("enable");
      }),
      (t.refreshAll = function () {
         t.Context.refreshAll();
      }),
      (t.viewportHeight = function () {
         return window.innerHeight || document.documentElement.clientHeight;
      }),
      (t.viewportWidth = function () {
         return document.documentElement.clientWidth;
      }),
      (t.adapters = []),
      (t.defaults = {
         context: window,
         continuous: !0,
         enabled: !0,
         group: "default",
         horizontal: !1,
         offset: 0,
      }),
      (t.offsetAliases = {
         "bottom-in-view": function () {
            return this.context.innerHeight() - this.adapter.outerHeight();
         },
         "right-in-view": function () {
            return this.context.innerWidth() - this.adapter.outerWidth();
         },
      }),
      (window.Waypoint = t);
})(),
   (function () {
      "use strict";
      function t(t) {
         window.setTimeout(t, 1e3 / 60);
      }
      function e(t) {
         (this.element = t),
            (this.Adapter = n.Adapter),
            (this.adapter = new this.Adapter(t)),
            (this.key = "waypoint-context-" + i),
            (this.didScroll = !1),
            (this.didResize = !1),
            (this.oldScroll = {
               x: this.adapter.scrollLeft(),
               y: this.adapter.scrollTop(),
            }),
            (this.waypoints = { vertical: {}, horizontal: {} }),
            (t.waypointContextKey = this.key),
            (o[t.waypointContextKey] = this),
            (i += 1),
            this.createThrottledScrollHandler(),
            this.createThrottledResizeHandler();
      }
      var i = 0,
         o = {},
         n = window.Waypoint,
         r = window.onload;
      (e.prototype.add = function (t) {
         var e = t.options.horizontal ? "horizontal" : "vertical";
         (this.waypoints[e][t.key] = t), this.refresh();
      }),
         (e.prototype.checkEmpty = function () {
            var t = this.Adapter.isEmptyObject(this.waypoints.horizontal),
               e = this.Adapter.isEmptyObject(this.waypoints.vertical);
            t && e && (this.adapter.off(".waypoints"), delete o[this.key]);
         }),
         (e.prototype.createThrottledResizeHandler = function () {
            function t() {
               e.handleResize(), (e.didResize = !1);
            }
            var e = this;
            this.adapter.on("resize.waypoints", function () {
               e.didResize || ((e.didResize = !0), n.requestAnimationFrame(t));
            });
         }),
         (e.prototype.createThrottledScrollHandler = function () {
            function t() {
               e.handleScroll(), (e.didScroll = !1);
            }
            var e = this;
            this.adapter.on("scroll.waypoints", function () {
               (!e.didScroll || n.isTouch) &&
                  ((e.didScroll = !0), n.requestAnimationFrame(t));
            });
         }),
         (e.prototype.handleResize = function () {
            n.Context.refreshAll();
         }),
         (e.prototype.handleScroll = function () {
            var t = {},
               e = {
                  horizontal: {
                     newScroll: this.adapter.scrollLeft(),
                     oldScroll: this.oldScroll.x,
                     forward: "right",
                     backward: "left",
                  },
                  vertical: {
                     newScroll: this.adapter.scrollTop(),
                     oldScroll: this.oldScroll.y,
                     forward: "down",
                     backward: "up",
                  },
               };
            for (var i in e) {
               var o = e[i],
                  n = o.newScroll > o.oldScroll,
                  r = n ? o.forward : o.backward;
               for (var s in this.waypoints[i]) {
                  var a = this.waypoints[i][s],
                     l = o.oldScroll < a.triggerPoint,
                     h = o.newScroll >= a.triggerPoint,
                     p = l && h,
                     u = !l && !h;
                  (p || u) && (a.queueTrigger(r), (t[a.group.id] = a.group));
               }
            }
            for (var c in t) t[c].flushTriggers();
            this.oldScroll = {
               x: e.horizontal.newScroll,
               y: e.vertical.newScroll,
            };
         }),
         (e.prototype.innerHeight = function () {
            return this.element == this.element.window
               ? n.viewportHeight()
               : this.adapter.innerHeight();
         }),
         (e.prototype.remove = function (t) {
            delete this.waypoints[t.axis][t.key], this.checkEmpty();
         }),
         (e.prototype.innerWidth = function () {
            return this.element == this.element.window
               ? n.viewportWidth()
               : this.adapter.innerWidth();
         }),
         (e.prototype.destroy = function () {
            var t = [];
            for (var e in this.waypoints)
               for (var i in this.waypoints[e]) t.push(this.waypoints[e][i]);
            for (var o = 0, n = t.length; n > o; o++) t[o].destroy();
         }),
         (e.prototype.refresh = function () {
            var t,
               e = this.element == this.element.window,
               i = e ? void 0 : this.adapter.offset(),
               o = {};
            this.handleScroll(),
               (t = {
                  horizontal: {
                     contextOffset: e ? 0 : i.left,
                     contextScroll: e ? 0 : this.oldScroll.x,
                     contextDimension: this.innerWidth(),
                     oldScroll: this.oldScroll.x,
                     forward: "right",
                     backward: "left",
                     offsetProp: "left",
                  },
                  vertical: {
                     contextOffset: e ? 0 : i.top,
                     contextScroll: e ? 0 : this.oldScroll.y,
                     contextDimension: this.innerHeight(),
                     oldScroll: this.oldScroll.y,
                     forward: "down",
                     backward: "up",
                     offsetProp: "top",
                  },
               });
            for (var r in t) {
               var s = t[r];
               for (var a in this.waypoints[r]) {
                  var l,
                     h,
                     p,
                     u,
                     c,
                     d = this.waypoints[r][a],
                     f = d.options.offset,
                     w = d.triggerPoint,
                     y = 0,
                     g = null == w;
                  d.element !== d.element.window &&
                     (y = d.adapter.offset()[s.offsetProp]),
                     "function" == typeof f
                        ? (f = f.apply(d))
                        : "string" == typeof f &&
                          ((f = parseFloat(f)),
                          d.options.offset.indexOf("%") > -1 &&
                             (f = Math.ceil((s.contextDimension * f) / 100))),
                     (l = s.contextScroll - s.contextOffset),
                     (d.triggerPoint = y + l - f),
                     (h = w < s.oldScroll),
                     (p = d.triggerPoint >= s.oldScroll),
                     (u = h && p),
                     (c = !h && !p),
                     !g && u
                        ? (d.queueTrigger(s.backward),
                          (o[d.group.id] = d.group))
                        : !g && c
                        ? (d.queueTrigger(s.forward), (o[d.group.id] = d.group))
                        : g &&
                          s.oldScroll >= d.triggerPoint &&
                          (d.queueTrigger(s.forward),
                          (o[d.group.id] = d.group));
               }
            }
            return (
               n.requestAnimationFrame(function () {
                  for (var t in o) o[t].flushTriggers();
               }),
               this
            );
         }),
         (e.findOrCreateByElement = function (t) {
            return e.findByElement(t) || new e(t);
         }),
         (e.refreshAll = function () {
            for (var t in o) o[t].refresh();
         }),
         (e.findByElement = function (t) {
            return o[t.waypointContextKey];
         }),
         (window.onload = function () {
            r && r(), e.refreshAll();
         }),
         (n.requestAnimationFrame = function (e) {
            var i =
               window.requestAnimationFrame ||
               window.mozRequestAnimationFrame ||
               window.webkitRequestAnimationFrame ||
               t;
            i.call(window, e);
         }),
         (n.Context = e);
   })(),
   (function () {
      "use strict";
      function t(t, e) {
         return t.triggerPoint - e.triggerPoint;
      }
      function e(t, e) {
         return e.triggerPoint - t.triggerPoint;
      }
      function i(t) {
         (this.name = t.name),
            (this.axis = t.axis),
            (this.id = this.name + "-" + this.axis),
            (this.waypoints = []),
            this.clearTriggerQueues(),
            (o[this.axis][this.name] = this);
      }
      var o = { vertical: {}, horizontal: {} },
         n = window.Waypoint;
      (i.prototype.add = function (t) {
         this.waypoints.push(t);
      }),
         (i.prototype.clearTriggerQueues = function () {
            this.triggerQueues = { up: [], down: [], left: [], right: [] };
         }),
         (i.prototype.flushTriggers = function () {
            for (var i in this.triggerQueues) {
               var o = this.triggerQueues[i],
                  n = "up" === i || "left" === i;
               o.sort(n ? e : t);
               for (var r = 0, s = o.length; s > r; r += 1) {
                  var a = o[r];
                  (a.options.continuous || r === o.length - 1) &&
                     a.trigger([i]);
               }
            }
            this.clearTriggerQueues();
         }),
         (i.prototype.next = function (e) {
            this.waypoints.sort(t);
            var i = n.Adapter.inArray(e, this.waypoints),
               o = i === this.waypoints.length - 1;
            return o ? null : this.waypoints[i + 1];
         }),
         (i.prototype.previous = function (e) {
            this.waypoints.sort(t);
            var i = n.Adapter.inArray(e, this.waypoints);
            return i ? this.waypoints[i - 1] : null;
         }),
         (i.prototype.queueTrigger = function (t, e) {
            this.triggerQueues[e].push(t);
         }),
         (i.prototype.remove = function (t) {
            var e = n.Adapter.inArray(t, this.waypoints);
            e > -1 && this.waypoints.splice(e, 1);
         }),
         (i.prototype.first = function () {
            return this.waypoints[0];
         }),
         (i.prototype.last = function () {
            return this.waypoints[this.waypoints.length - 1];
         }),
         (i.findOrCreate = function (t) {
            return o[t.axis][t.name] || new i(t);
         }),
         (n.Group = i);
   })(),
   (function () {
      "use strict";
      function t(t) {
         this.$element = e(t);
      }
      var e = window.jQuery,
         i = window.Waypoint;
      e.each(
         [
            "innerHeight",
            "innerWidth",
            "off",
            "offset",
            "on",
            "outerHeight",
            "outerWidth",
            "scrollLeft",
            "scrollTop",
         ],
         function (e, i) {
            t.prototype[i] = function () {
               var t = Array.prototype.slice.call(arguments);
               return this.$element[i].apply(this.$element, t);
            };
         }
      ),
         e.each(["extend", "inArray", "isEmptyObject"], function (i, o) {
            t[o] = e[o];
         }),
         i.adapters.push({ name: "jquery", Adapter: t }),
         (i.Adapter = t);
   })(),
   (function () {
      "use strict";
      function t(t) {
         return function () {
            var i = [],
               o = arguments[0];
            return (
               t.isFunction(arguments[0]) &&
                  ((o = t.extend({}, arguments[1])),
                  (o.handler = arguments[0])),
               this.each(function () {
                  var n = t.extend({}, o, { element: this });
                  "string" == typeof n.context &&
                     (n.context = t(this).closest(n.context)[0]),
                     i.push(new e(n));
               }),
               i
            );
         };
      }
      var e = window.Waypoint;
      window.jQuery && (window.jQuery.fn.waypoint = t(window.jQuery)),
         window.Zepto && (window.Zepto.fn.waypoint = t(window.Zepto));
   })();

/*!
Waypoints Infinite Scroll Shortcut - 4.0.0
Copyright © 2011-2015 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blob/master/licenses.txt
*/
!(function () {
   "use strict";
   function t(n) {
      (this.options = i.extend({}, t.defaults, n)),
         (this.container = this.options.element),
         "auto" !== this.options.container &&
            (this.container = this.options.container),
         (this.$container = i(this.container)),
         (this.$more = i(this.options.more)),
         this.$more.length &&
            (this.setupHandler(), (this.waypoint = new o(this.options)));
   }
   var i = window.jQuery,
      o = window.Waypoint;
   (t.prototype.setupHandler = function () {
      this.options.handler = i.proxy(function () {
         this.options.onBeforePageLoad(),
            this.destroy(),
            this.$container.addClass(this.options.loadingClass),
            i.get(
               i(this.options.more).attr("href"),
               i.proxy(function (t) {
                  var n = i(i.parseHTML(t)),
                     e = n.find(this.options.more),
                     s = n.find(this.options.items);
                  s.length || (s = n.filter(this.options.items)),
                     this.$container.append(s),
                     this.$container.removeClass(this.options.loadingClass),
                     e.length || (e = n.filter(this.options.more)),
                     e.length
                        ? (this.$more.replaceWith(e),
                          (this.$more = e),
                          (this.waypoint = new o(this.options)))
                        : this.$more.remove(),
                     this.options.onAfterPageLoad(s);
               }, this)
            );
      }, this);
   }),
      (t.prototype.destroy = function () {
         this.waypoint && this.waypoint.destroy();
      }),
      (t.defaults = {
         container: "auto",
         items: ".infinite-item",
         more: ".infinite-more-link",
         offset: "bottom-in-view",
         loadingClass: "infinite-loading",
         onBeforePageLoad: i.noop,
         onAfterPageLoad: i.noop,
      }),
      (o.Infinite = t);
})();

/* ===============================================
  #Pointer events polyfill
================================================== */

/*
 * Pointer Events Polyfill: Adds support for the style attribute "pointer-events: none" to browsers without this feature (namely, IE).
 * (c) 2013, Kent Mewhort, licensed under BSD. See LICENSE.txt for details.
 */

function PointerEventsPolyfill(t) {
   if (
      ((this.options = {
         selector: "*",
         mouseEvents: ["click", "dblclick", "mousedown", "mouseup"],
         usePolyfillIf: function () {
            if ("Microsoft Internet Explorer" == navigator.appName) {
               var t = navigator.userAgent;
               if (null != t.match(/MSIE ([0-9]{1,}[\.0-9]{0,})/)) {
                  var e = parseFloat(RegExp.$1);
                  if (11 > e) return !0;
               }
            }
            return !1;
         },
      }),
      t)
   ) {
      var e = this;
      $.each(t, function (t, n) {
         e.options[t] = n;
      });
   }
   this.options.usePolyfillIf() && this.register_mouse_events();
}
(PointerEventsPolyfill.initialize = function (t) {
   return (
      null == PointerEventsPolyfill.singleton &&
         (PointerEventsPolyfill.singleton = new PointerEventsPolyfill(t)),
      PointerEventsPolyfill.singleton
   );
}),
   (PointerEventsPolyfill.prototype.register_mouse_events = function () {
      $(document).on(
         this.options.mouseEvents.join(" "),
         this.options.selector,
         function (t) {
            if ("none" == $(this).css("pointer-events")) {
               var e = $(this).css("display");
               $(this).css("display", "none");
               var n = document.elementFromPoint(t.clientX, t.clientY);
               return (
                  e ? $(this).css("display", e) : $(this).css("display", ""),
                  (t.target = n),
                  $(n).trigger(t),
                  !1
               );
            }
            return !0;
         }
      );
   });

/*
 * startsWith Polyfill: Adds support for the startsWith() method in IE 11.
 */

if (!String.prototype.startsWith) {
   String.prototype.startsWith = function (searchString, position) {
      position = position || 0;
      return this.indexOf(searchString, position) === position;
   };
}

/* ===============================================
  #Flickity
================================================== */

/*!
 * Flickity PACKAGED v2.1.2
 * Touch, responsive, flickable carousels
 *
 * Licensed GPLv3 for open source use
 * or Flickity Commercial License for commercial use
 *
 * https://flickity.metafizzy.co
 * Copyright 2015-2018 Metafizzy
 */

!(function (t, e) {
   "function" == typeof define && define.amd
      ? define("jquery-bridget/jquery-bridget", ["jquery"], function (i) {
           return e(t, i);
        })
      : "object" == typeof module && module.exports
      ? (module.exports = e(t, require("jquery")))
      : (t.jQueryBridget = e(t, t.jQuery));
})(window, function (t, e) {
   "use strict";
   function i(i, o, a) {
      function l(t, e, n) {
         var s,
            o = "$()." + i + '("' + e + '")';
         return (
            t.each(function (t, l) {
               var h = a.data(l, i);
               if (!h)
                  return void r(
                     i + " not initialized. Cannot call methods, i.e. " + o
                  );
               var c = h[e];
               if (!c || "_" == e.charAt(0))
                  return void r(o + " is not a valid method");
               var d = c.apply(h, n);
               s = void 0 === s ? d : s;
            }),
            void 0 !== s ? s : t
         );
      }
      function h(t, e) {
         t.each(function (t, n) {
            var s = a.data(n, i);
            s ? (s.option(e), s._init()) : ((s = new o(n, e)), a.data(n, i, s));
         });
      }
      (a = a || e || t.jQuery),
         a &&
            (o.prototype.option ||
               (o.prototype.option = function (t) {
                  a.isPlainObject(t) &&
                     (this.options = a.extend(!0, this.options, t));
               }),
            (a.fn[i] = function (t) {
               if ("string" == typeof t) {
                  var e = s.call(arguments, 1);
                  return l(this, t, e);
               }
               return h(this, t), this;
            }),
            n(a));
   }
   function n(t) {
      !t || (t && t.bridget) || (t.bridget = i);
   }
   var s = Array.prototype.slice,
      o = t.console,
      r =
         "undefined" == typeof o
            ? function () {}
            : function (t) {
                 o.error(t);
              };
   return n(e || t.jQuery), i;
}),
   (function (t, e) {
      "function" == typeof define && define.amd
         ? define("ev-emitter/ev-emitter", e)
         : "object" == typeof module && module.exports
         ? (module.exports = e())
         : (t.EvEmitter = e());
   })("undefined" != typeof window ? window : this, function () {
      function t() {}
      var e = t.prototype;
      return (
         (e.on = function (t, e) {
            if (t && e) {
               var i = (this._events = this._events || {}),
                  n = (i[t] = i[t] || []);
               return n.indexOf(e) == -1 && n.push(e), this;
            }
         }),
         (e.once = function (t, e) {
            if (t && e) {
               this.on(t, e);
               var i = (this._onceEvents = this._onceEvents || {}),
                  n = (i[t] = i[t] || {});
               return (n[e] = !0), this;
            }
         }),
         (e.off = function (t, e) {
            var i = this._events && this._events[t];
            if (i && i.length) {
               var n = i.indexOf(e);
               return n != -1 && i.splice(n, 1), this;
            }
         }),
         (e.emitEvent = function (t, e) {
            var i = this._events && this._events[t];
            if (i && i.length) {
               (i = i.slice(0)), (e = e || []);
               for (
                  var n = this._onceEvents && this._onceEvents[t], s = 0;
                  s < i.length;
                  s++
               ) {
                  var o = i[s],
                     r = n && n[o];
                  r && (this.off(t, o), delete n[o]), o.apply(this, e);
               }
               return this;
            }
         }),
         (e.allOff = function () {
            delete this._events, delete this._onceEvents;
         }),
         t
      );
   }),
   (function (t, e) {
      "function" == typeof define && define.amd
         ? define("get-size/get-size", e)
         : "object" == typeof module && module.exports
         ? (module.exports = e())
         : (t.getSize = e());
   })(window, function () {
      "use strict";
      function t(t) {
         var e = parseFloat(t),
            i = t.indexOf("%") == -1 && !isNaN(e);
         return i && e;
      }
      function e() {}
      function i() {
         for (
            var t = {
                  width: 0,
                  height: 0,
                  innerWidth: 0,
                  innerHeight: 0,
                  outerWidth: 0,
                  outerHeight: 0,
               },
               e = 0;
            e < h;
            e++
         ) {
            var i = l[e];
            t[i] = 0;
         }
         return t;
      }
      function n(t) {
         var e = getComputedStyle(t);
         return (
            e ||
               a(
                  "Style returned " +
                     e +
                     ". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1"
               ),
            e
         );
      }
      function s() {
         if (!c) {
            c = !0;
            var e = document.createElement("div");
            (e.style.width = "200px"),
               (e.style.padding = "1px 2px 3px 4px"),
               (e.style.borderStyle = "solid"),
               (e.style.borderWidth = "1px 2px 3px 4px"),
               (e.style.boxSizing = "border-box");
            var i = document.body || document.documentElement;
            i.appendChild(e);
            var s = n(e);
            (r = 200 == Math.round(t(s.width))),
               (o.isBoxSizeOuter = r),
               i.removeChild(e);
         }
      }
      function o(e) {
         if (
            (s(),
            "string" == typeof e && (e = document.querySelector(e)),
            e && "object" == typeof e && e.nodeType)
         ) {
            var o = n(e);
            if ("none" == o.display) return i();
            var a = {};
            (a.width = e.offsetWidth), (a.height = e.offsetHeight);
            for (
               var c = (a.isBorderBox = "border-box" == o.boxSizing), d = 0;
               d < h;
               d++
            ) {
               var u = l[d],
                  f = o[u],
                  p = parseFloat(f);
               a[u] = isNaN(p) ? 0 : p;
            }
            var g = a.paddingLeft + a.paddingRight,
               v = a.paddingTop + a.paddingBottom,
               m = a.marginLeft + a.marginRight,
               y = a.marginTop + a.marginBottom,
               b = a.borderLeftWidth + a.borderRightWidth,
               E = a.borderTopWidth + a.borderBottomWidth,
               S = c && r,
               C = t(o.width);
            C !== !1 && (a.width = C + (S ? 0 : g + b));
            var x = t(o.height);
            return (
               x !== !1 && (a.height = x + (S ? 0 : v + E)),
               (a.innerWidth = a.width - (g + b)),
               (a.innerHeight = a.height - (v + E)),
               (a.outerWidth = a.width + m),
               (a.outerHeight = a.height + y),
               a
            );
         }
      }
      var r,
         a =
            "undefined" == typeof console
               ? e
               : function (t) {
                    console.error(t);
                 },
         l = [
            "paddingLeft",
            "paddingRight",
            "paddingTop",
            "paddingBottom",
            "marginLeft",
            "marginRight",
            "marginTop",
            "marginBottom",
            "borderLeftWidth",
            "borderRightWidth",
            "borderTopWidth",
            "borderBottomWidth",
         ],
         h = l.length,
         c = !1;
      return o;
   }),
   (function (t, e) {
      "use strict";
      "function" == typeof define && define.amd
         ? define("desandro-matches-selector/matches-selector", e)
         : "object" == typeof module && module.exports
         ? (module.exports = e())
         : (t.matchesSelector = e());
   })(window, function () {
      "use strict";
      var t = (function () {
         var t = window.Element.prototype;
         if (t.matches) return "matches";
         if (t.matchesSelector) return "matchesSelector";
         for (var e = ["webkit", "moz", "ms", "o"], i = 0; i < e.length; i++) {
            var n = e[i],
               s = n + "MatchesSelector";
            if (t[s]) return s;
         }
      })();
      return function (e, i) {
         return e[t](i);
      };
   }),
   (function (t, e) {
      "function" == typeof define && define.amd
         ? define("fizzy-ui-utils/utils", [
              "desandro-matches-selector/matches-selector",
           ], function (i) {
              return e(t, i);
           })
         : "object" == typeof module && module.exports
         ? (module.exports = e(t, require("desandro-matches-selector")))
         : (t.fizzyUIUtils = e(t, t.matchesSelector));
   })(window, function (t, e) {
      var i = {};
      (i.extend = function (t, e) {
         for (var i in e) t[i] = e[i];
         return t;
      }),
         (i.modulo = function (t, e) {
            return ((t % e) + e) % e;
         });
      var n = Array.prototype.slice;
      (i.makeArray = function (t) {
         if (Array.isArray(t)) return t;
         if (null === t || void 0 === t) return [];
         var e = "object" == typeof t && "number" == typeof t.length;
         return e ? n.call(t) : [t];
      }),
         (i.removeFrom = function (t, e) {
            var i = t.indexOf(e);
            i != -1 && t.splice(i, 1);
         }),
         (i.getParent = function (t, i) {
            for (; t.parentNode && t != document.body; )
               if (((t = t.parentNode), e(t, i))) return t;
         }),
         (i.getQueryElement = function (t) {
            return "string" == typeof t ? document.querySelector(t) : t;
         }),
         (i.handleEvent = function (t) {
            var e = "on" + t.type;
            this[e] && this[e](t);
         }),
         (i.filterFindElements = function (t, n) {
            t = i.makeArray(t);
            var s = [];
            return (
               t.forEach(function (t) {
                  if (t instanceof HTMLElement) {
                     if (!n) return void s.push(t);
                     e(t, n) && s.push(t);
                     for (
                        var i = t.querySelectorAll(n), o = 0;
                        o < i.length;
                        o++
                     )
                        s.push(i[o]);
                  }
               }),
               s
            );
         }),
         (i.debounceMethod = function (t, e, i) {
            i = i || 100;
            var n = t.prototype[e],
               s = e + "Timeout";
            t.prototype[e] = function () {
               var t = this[s];
               clearTimeout(t);
               var e = arguments,
                  o = this;
               this[s] = setTimeout(function () {
                  n.apply(o, e), delete o[s];
               }, i);
            };
         }),
         (i.docReady = function (t) {
            var e = document.readyState;
            "complete" == e || "interactive" == e
               ? setTimeout(t)
               : document.addEventListener("DOMContentLoaded", t);
         }),
         (i.toDashed = function (t) {
            return t
               .replace(/(.)([A-Z])/g, function (t, e, i) {
                  return e + "-" + i;
               })
               .toLowerCase();
         });
      var s = t.console;
      return (
         (i.htmlInit = function (e, n) {
            i.docReady(function () {
               var o = i.toDashed(n),
                  r = "data-" + o,
                  a = document.querySelectorAll("[" + r + "]"),
                  l = document.querySelectorAll(".js-" + o),
                  h = i.makeArray(a).concat(i.makeArray(l)),
                  c = r + "-options",
                  d = t.jQuery;
               h.forEach(function (t) {
                  var i,
                     o = t.getAttribute(r) || t.getAttribute(c);
                  try {
                     i = o && JSON.parse(o);
                  } catch (a) {
                     return void (
                        s &&
                        s.error(
                           "Error parsing " +
                              r +
                              " on " +
                              t.className +
                              ": " +
                              a
                        )
                     );
                  }
                  var l = new e(t, i);
                  d && d.data(t, n, l);
               });
            });
         }),
         i
      );
   }),
   (function (t, e) {
      "function" == typeof define && define.amd
         ? define("flickity/js/cell", ["get-size/get-size"], function (i) {
              return e(t, i);
           })
         : "object" == typeof module && module.exports
         ? (module.exports = e(t, require("get-size")))
         : ((t.Flickity = t.Flickity || {}),
           (t.Flickity.Cell = e(t, t.getSize)));
   })(window, function (t, e) {
      function i(t, e) {
         (this.element = t), (this.parent = e), this.create();
      }
      var n = i.prototype;
      return (
         (n.create = function () {
            (this.element.style.position = "absolute"),
               this.element.setAttribute("aria-selected", "false"),
               (this.x = 0),
               (this.shift = 0);
         }),
         (n.destroy = function () {
            this.element.style.position = "";
            var t = this.parent.originSide;
            this.element.removeAttribute("aria-selected"),
               (this.element.style[t] = "");
         }),
         (n.getSize = function () {
            this.size = e(this.element);
         }),
         (n.setPosition = function (t) {
            (this.x = t), this.updateTarget(), this.renderPosition(t);
         }),
         (n.updateTarget = n.setDefaultTarget = function () {
            var t =
               "left" == this.parent.originSide ? "marginLeft" : "marginRight";
            this.target =
               this.x + this.size[t] + this.size.width * this.parent.cellAlign;
         }),
         (n.renderPosition = function (t) {
            var e = this.parent.originSide;
            this.element.style[e] = this.parent.getPositionValue(t);
         }),
         (n.wrapShift = function (t) {
            (this.shift = t),
               this.renderPosition(this.x + this.parent.slideableWidth * t);
         }),
         (n.remove = function () {
            this.element.parentNode.removeChild(this.element);
         }),
         i
      );
   }),
   (function (t, e) {
      "function" == typeof define && define.amd
         ? define("flickity/js/slide", e)
         : "object" == typeof module && module.exports
         ? (module.exports = e())
         : ((t.Flickity = t.Flickity || {}), (t.Flickity.Slide = e()));
   })(window, function () {
      "use strict";
      function t(t) {
         (this.parent = t),
            (this.isOriginLeft = "left" == t.originSide),
            (this.cells = []),
            (this.outerWidth = 0),
            (this.height = 0);
      }
      var e = t.prototype;
      return (
         (e.addCell = function (t) {
            if (
               (this.cells.push(t),
               (this.outerWidth += t.size.outerWidth),
               (this.height = Math.max(t.size.outerHeight, this.height)),
               1 == this.cells.length)
            ) {
               this.x = t.x;
               var e = this.isOriginLeft ? "marginLeft" : "marginRight";
               this.firstMargin = t.size[e];
            }
         }),
         (e.updateTarget = function () {
            var t = this.isOriginLeft ? "marginRight" : "marginLeft",
               e = this.getLastCell(),
               i = e ? e.size[t] : 0,
               n = this.outerWidth - (this.firstMargin + i);
            this.target = this.x + this.firstMargin + n * this.parent.cellAlign;
         }),
         (e.getLastCell = function () {
            return this.cells[this.cells.length - 1];
         }),
         (e.select = function () {
            this.changeSelected(!0);
         }),
         (e.unselect = function () {
            this.changeSelected(!1);
         }),
         (e.changeSelected = function (t) {
            var e = t ? "add" : "remove";
            this.cells.forEach(function (i) {
               i.element.classList[e]("is-selected"),
                  i.element.setAttribute("aria-selected", t.toString());
            });
         }),
         (e.getCellElements = function () {
            return this.cells.map(function (t) {
               return t.element;
            });
         }),
         t
      );
   }),
   (function (t, e) {
      "function" == typeof define && define.amd
         ? define("flickity/js/animate", ["fizzy-ui-utils/utils"], function (
              i
           ) {
              return e(t, i);
           })
         : "object" == typeof module && module.exports
         ? (module.exports = e(t, require("fizzy-ui-utils")))
         : ((t.Flickity = t.Flickity || {}),
           (t.Flickity.animatePrototype = e(t, t.fizzyUIUtils)));
   })(window, function (t, e) {
      var i = {};
      return (
         (i.startAnimation = function () {
            this.isAnimating ||
               ((this.isAnimating = !0),
               (this.restingFrames = 0),
               this.animate());
         }),
         (i.animate = function () {
            this.applyDragForce(), this.applySelectedAttraction();
            var t = this.x;
            if (
               (this.integratePhysics(),
               this.positionSlider(),
               this.settle(t),
               this.isAnimating)
            ) {
               var e = this;
               requestAnimationFrame(function () {
                  e.animate();
               });
            }
         }),
         (i.positionSlider = function () {
            var t = this.x;
            this.options.wrapAround &&
               this.cells.length > 1 &&
               ((t = e.modulo(t, this.slideableWidth)),
               (t -= this.slideableWidth),
               this.shiftWrapCells(t)),
               (t += this.cursorPosition),
               (t = this.options.rightToLeft ? -t : t);
            var i = this.getPositionValue(t);
            this.slider.style.transform = this.isAnimating
               ? "translate3d(" + i + ",0,0)"
               : "translateX(" + i + ")";
            var n = this.slides[0];
            if (n) {
               var s = -this.x - n.target,
                  o = s / this.slidesWidth;
               this.dispatchEvent("scroll", null, [o, s]);
            }
         }),
         (i.positionSliderAtSelected = function () {
            this.cells.length &&
               ((this.x = -this.selectedSlide.target),
               (this.velocity = 0),
               this.positionSlider());
         }),
         (i.getPositionValue = function (t) {
            return this.options.percentPosition
               ? 0.01 * Math.round((t / this.size.innerWidth) * 1e4) + "%"
               : Math.round(t) + "px";
         }),
         (i.settle = function (t) {
            this.isPointerDown ||
               Math.round(100 * this.x) != Math.round(100 * t) ||
               this.restingFrames++,
               this.restingFrames > 2 &&
                  ((this.isAnimating = !1),
                  delete this.isFreeScrolling,
                  this.positionSlider(),
                  this.dispatchEvent("settle", null, [this.selectedIndex]));
         }),
         (i.shiftWrapCells = function (t) {
            var e = this.cursorPosition + t;
            this._shiftCells(this.beforeShiftCells, e, -1);
            var i =
               this.size.innerWidth -
               (t + this.slideableWidth + this.cursorPosition);
            this._shiftCells(this.afterShiftCells, i, 1);
         }),
         (i._shiftCells = function (t, e, i) {
            for (var n = 0; n < t.length; n++) {
               var s = t[n],
                  o = e > 0 ? i : 0;
               s.wrapShift(o), (e -= s.size.outerWidth);
            }
         }),
         (i._unshiftCells = function (t) {
            if (t && t.length)
               for (var e = 0; e < t.length; e++) t[e].wrapShift(0);
         }),
         (i.integratePhysics = function () {
            (this.x += this.velocity),
               (this.velocity *= this.getFrictionFactor());
         }),
         (i.applyForce = function (t) {
            this.velocity += t;
         }),
         (i.getFrictionFactor = function () {
            return (
               1 -
               this.options[
                  this.isFreeScrolling ? "freeScrollFriction" : "friction"
               ]
            );
         }),
         (i.getRestingPosition = function () {
            return this.x + this.velocity / (1 - this.getFrictionFactor());
         }),
         (i.applyDragForce = function () {
            if (this.isDraggable && this.isPointerDown) {
               var t = this.dragX - this.x,
                  e = t - this.velocity;
               this.applyForce(e);
            }
         }),
         (i.applySelectedAttraction = function () {
            var t = this.isDraggable && this.isPointerDown;
            if (!t && !this.isFreeScrolling && this.slides.length) {
               var e = this.selectedSlide.target * -1 - this.x,
                  i = e * this.options.selectedAttraction;
               this.applyForce(i);
            }
         }),
         i
      );
   }),
   (function (t, e) {
      if ("function" == typeof define && define.amd)
         define("flickity/js/flickity", [
            "ev-emitter/ev-emitter",
            "get-size/get-size",
            "fizzy-ui-utils/utils",
            "./cell",
            "./slide",
            "./animate",
         ], function (i, n, s, o, r, a) {
            return e(t, i, n, s, o, r, a);
         });
      else if ("object" == typeof module && module.exports)
         module.exports = e(
            t,
            require("ev-emitter"),
            require("get-size"),
            require("fizzy-ui-utils"),
            require("./cell"),
            require("./slide"),
            require("./animate")
         );
      else {
         var i = t.Flickity;
         t.Flickity = e(
            t,
            t.EvEmitter,
            t.getSize,
            t.fizzyUIUtils,
            i.Cell,
            i.Slide,
            i.animatePrototype
         );
      }
   })(window, function (t, e, i, n, s, o, r) {
      function a(t, e) {
         for (t = n.makeArray(t); t.length; ) e.appendChild(t.shift());
      }
      function l(t, e) {
         var i = n.getQueryElement(t);
         if (!i)
            return void (d && d.error("Bad element for Flickity: " + (i || t)));
         if (((this.element = i), this.element.flickityGUID)) {
            var s = f[this.element.flickityGUID];
            return s.option(e), s;
         }
         h && (this.$element = h(this.element)),
            (this.options = n.extend({}, this.constructor.defaults)),
            this.option(e),
            this._create();
      }
      var h = t.jQuery,
         c = t.getComputedStyle,
         d = t.console,
         u = 0,
         f = {};
      (l.defaults = {
         accessibility: !0,
         cellAlign: "center",
         freeScrollFriction: 0.075,
         friction: 0.28,
         namespaceJQueryEvents: !0,
         percentPosition: !0,
         resize: !0,
         selectedAttraction: 0.025,
         setGallerySize: !0,
      }),
         (l.createMethods = []);
      var p = l.prototype;
      n.extend(p, e.prototype),
         (p._create = function () {
            var e = (this.guid = ++u);
            (this.element.flickityGUID = e),
               (f[e] = this),
               (this.selectedIndex = 0),
               (this.restingFrames = 0),
               (this.x = 0),
               (this.velocity = 0),
               (this.originSide = this.options.rightToLeft ? "right" : "left"),
               (this.viewport = document.createElement("div")),
               (this.viewport.className = "flickity-viewport"),
               this._createSlider(),
               (this.options.resize || this.options.watchCSS) &&
                  t.addEventListener("resize", this);
            for (var i in this.options.on) {
               var n = this.options.on[i];
               this.on(i, n);
            }
            l.createMethods.forEach(function (t) {
               this[t]();
            }, this),
               this.options.watchCSS ? this.watchCSS() : this.activate();
         }),
         (p.option = function (t) {
            n.extend(this.options, t);
         }),
         (p.activate = function () {
            if (!this.isActive) {
               (this.isActive = !0),
                  this.element.classList.add("flickity-enabled"),
                  this.options.rightToLeft &&
                     this.element.classList.add("flickity-rtl"),
                  this.getSize();
               var t = this._filterFindCellElements(this.element.children);
               a(t, this.slider),
                  this.viewport.appendChild(this.slider),
                  this.element.appendChild(this.viewport),
                  this.reloadCells(),
                  this.options.accessibility &&
                     ((this.element.tabIndex = 0),
                     this.element.addEventListener("keydown", this)),
                  this.emitEvent("activate");
               var e,
                  i = this.options.initialIndex;
               (e = this.isInitActivated
                  ? this.selectedIndex
                  : void 0 !== i && this.cells[i]
                  ? i
                  : 0),
                  this.select(e, !1, !0),
                  (this.isInitActivated = !0),
                  this.dispatchEvent("ready");
            }
         }),
         (p._createSlider = function () {
            var t = document.createElement("div");
            (t.className = "flickity-slider"),
               (t.style[this.originSide] = 0),
               (this.slider = t);
         }),
         (p._filterFindCellElements = function (t) {
            return n.filterFindElements(t, this.options.cellSelector);
         }),
         (p.reloadCells = function () {
            (this.cells = this._makeCells(this.slider.children)),
               this.positionCells(),
               this._getWrapShiftCells(),
               this.setGallerySize();
         }),
         (p._makeCells = function (t) {
            var e = this._filterFindCellElements(t),
               i = e.map(function (t) {
                  return new s(t, this);
               }, this);
            return i;
         }),
         (p.getLastCell = function () {
            return this.cells[this.cells.length - 1];
         }),
         (p.getLastSlide = function () {
            return this.slides[this.slides.length - 1];
         }),
         (p.positionCells = function () {
            this._sizeCells(this.cells), this._positionCells(0);
         }),
         (p._positionCells = function (t) {
            (t = t || 0),
               (this.maxCellHeight = t ? this.maxCellHeight || 0 : 0);
            var e = 0;
            if (t > 0) {
               var i = this.cells[t - 1];
               e = i.x + i.size.outerWidth;
            }
            for (var n = this.cells.length, s = t; s < n; s++) {
               var o = this.cells[s];
               o.setPosition(e),
                  (e += o.size.outerWidth),
                  (this.maxCellHeight = Math.max(
                     o.size.outerHeight,
                     this.maxCellHeight
                  ));
            }
            (this.slideableWidth = e),
               this.updateSlides(),
               this._containSlides(),
               (this.slidesWidth = n
                  ? this.getLastSlide().target - this.slides[0].target
                  : 0);
         }),
         (p._sizeCells = function (t) {
            t.forEach(function (t) {
               t.getSize();
            });
         }),
         (p.updateSlides = function () {
            if (((this.slides = []), this.cells.length)) {
               var t = new o(this);
               this.slides.push(t);
               var e = "left" == this.originSide,
                  i = e ? "marginRight" : "marginLeft",
                  n = this._getCanCellFit();
               this.cells.forEach(function (e, s) {
                  if (!t.cells.length) return void t.addCell(e);
                  var r =
                     t.outerWidth -
                     t.firstMargin +
                     (e.size.outerWidth - e.size[i]);
                  n.call(this, s, r)
                     ? t.addCell(e)
                     : (t.updateTarget(),
                       (t = new o(this)),
                       this.slides.push(t),
                       t.addCell(e));
               }, this),
                  t.updateTarget(),
                  this.updateSelectedSlide();
            }
         }),
         (p._getCanCellFit = function () {
            var t = this.options.groupCells;
            if (!t)
               return function () {
                  return !1;
               };
            if ("number" == typeof t) {
               var e = parseInt(t, 10);
               return function (t) {
                  return t % e !== 0;
               };
            }
            var i = "string" == typeof t && t.match(/^(\d+)%$/),
               n = i ? parseInt(i[1], 10) / 100 : 1;
            return function (t, e) {
               return e <= (this.size.innerWidth + 1) * n;
            };
         }),
         (p._init = p.reposition = function () {
            this.positionCells(), this.positionSliderAtSelected();
         }),
         (p.getSize = function () {
            (this.size = i(this.element)),
               this.setCellAlign(),
               (this.cursorPosition = this.size.innerWidth * this.cellAlign);
         });
      var g = {
         center: { left: 0.5, right: 0.5 },
         left: { left: 0, right: 1 },
         right: { right: 0, left: 1 },
      };
      return (
         (p.setCellAlign = function () {
            var t = g[this.options.cellAlign];
            this.cellAlign = t ? t[this.originSide] : this.options.cellAlign;
         }),
         (p.setGallerySize = function () {
            if (this.options.setGallerySize) {
               var t =
                  this.options.adaptiveHeight && this.selectedSlide
                     ? this.selectedSlide.height
                     : this.maxCellHeight;
               this.viewport.style.height = t + "px";
            }
         }),
         (p._getWrapShiftCells = function () {
            if (this.options.wrapAround) {
               this._unshiftCells(this.beforeShiftCells),
                  this._unshiftCells(this.afterShiftCells);
               var t = this.cursorPosition,
                  e = this.cells.length - 1;
               (this.beforeShiftCells = this._getGapCells(t, e, -1)),
                  (t = this.size.innerWidth - this.cursorPosition),
                  (this.afterShiftCells = this._getGapCells(t, 0, 1));
            }
         }),
         (p._getGapCells = function (t, e, i) {
            for (var n = []; t > 0; ) {
               var s = this.cells[e];
               if (!s) break;
               n.push(s), (e += i), (t -= s.size.outerWidth);
            }
            return n;
         }),
         (p._containSlides = function () {
            if (
               this.options.contain &&
               !this.options.wrapAround &&
               this.cells.length
            ) {
               var t = this.options.rightToLeft,
                  e = t ? "marginRight" : "marginLeft",
                  i = t ? "marginLeft" : "marginRight",
                  n = this.slideableWidth - this.getLastCell().size[i],
                  s = n < this.size.innerWidth,
                  o = this.cursorPosition + this.cells[0].size[e],
                  r = n - this.size.innerWidth * (1 - this.cellAlign);
               this.slides.forEach(function (t) {
                  s
                     ? (t.target = n * this.cellAlign)
                     : ((t.target = Math.max(t.target, o)),
                       (t.target = Math.min(t.target, r)));
               }, this);
            }
         }),
         (p.dispatchEvent = function (t, e, i) {
            var n = e ? [e].concat(i) : i;
            if ((this.emitEvent(t, n), h && this.$element)) {
               t += this.options.namespaceJQueryEvents ? ".flickity" : "";
               var s = t;
               if (e) {
                  var o = h.Event(e);
                  (o.type = t), (s = o);
               }
               this.$element.trigger(s, i);
            }
         }),
         (p.select = function (t, e, i) {
            if (
               this.isActive &&
               ((t = parseInt(t, 10)),
               this._wrapSelect(t),
               (this.options.wrapAround || e) &&
                  (t = n.modulo(t, this.slides.length)),
               this.slides[t])
            ) {
               var s = this.selectedIndex;
               (this.selectedIndex = t),
                  this.updateSelectedSlide(),
                  i ? this.positionSliderAtSelected() : this.startAnimation(),
                  this.options.adaptiveHeight && this.setGallerySize(),
                  this.dispatchEvent("select", null, [t]),
                  t != s && this.dispatchEvent("change", null, [t]),
                  this.dispatchEvent("cellSelect");
            }
         }),
         (p._wrapSelect = function (t) {
            var e = this.slides.length,
               i = this.options.wrapAround && e > 1;
            if (!i) return t;
            var s = n.modulo(t, e),
               o = Math.abs(s - this.selectedIndex),
               r = Math.abs(s + e - this.selectedIndex),
               a = Math.abs(s - e - this.selectedIndex);
            !this.isDragSelect && r < o
               ? (t += e)
               : !this.isDragSelect && a < o && (t -= e),
               t < 0
                  ? (this.x -= this.slideableWidth)
                  : t >= e && (this.x += this.slideableWidth);
         }),
         (p.previous = function (t, e) {
            this.select(this.selectedIndex - 1, t, e);
         }),
         (p.next = function (t, e) {
            this.select(this.selectedIndex + 1, t, e);
         }),
         (p.updateSelectedSlide = function () {
            var t = this.slides[this.selectedIndex];
            t &&
               (this.unselectSelectedSlide(),
               (this.selectedSlide = t),
               t.select(),
               (this.selectedCells = t.cells),
               (this.selectedElements = t.getCellElements()),
               (this.selectedCell = t.cells[0]),
               (this.selectedElement = this.selectedElements[0]));
         }),
         (p.unselectSelectedSlide = function () {
            this.selectedSlide && this.selectedSlide.unselect();
         }),
         (p.selectCell = function (t, e, i) {
            var n = this.queryCell(t);
            if (n) {
               var s = this.getCellSlideIndex(n);
               this.select(s, e, i);
            }
         }),
         (p.getCellSlideIndex = function (t) {
            for (var e = 0; e < this.slides.length; e++) {
               var i = this.slides[e],
                  n = i.cells.indexOf(t);
               if (n != -1) return e;
            }
         }),
         (p.getCell = function (t) {
            for (var e = 0; e < this.cells.length; e++) {
               var i = this.cells[e];
               if (i.element == t) return i;
            }
         }),
         (p.getCells = function (t) {
            t = n.makeArray(t);
            var e = [];
            return (
               t.forEach(function (t) {
                  var i = this.getCell(t);
                  i && e.push(i);
               }, this),
               e
            );
         }),
         (p.getCellElements = function () {
            return this.cells.map(function (t) {
               return t.element;
            });
         }),
         (p.getParentCell = function (t) {
            var e = this.getCell(t);
            return e
               ? e
               : ((t = n.getParent(t, ".flickity-slider > *")),
                 this.getCell(t));
         }),
         (p.getAdjacentCellElements = function (t, e) {
            if (!t) return this.selectedSlide.getCellElements();
            e = void 0 === e ? this.selectedIndex : e;
            var i = this.slides.length;
            if (1 + 2 * t >= i) return this.getCellElements();
            for (var s = [], o = e - t; o <= e + t; o++) {
               var r = this.options.wrapAround ? n.modulo(o, i) : o,
                  a = this.slides[r];
               a && (s = s.concat(a.getCellElements()));
            }
            return s;
         }),
         (p.queryCell = function (t) {
            return "number" == typeof t
               ? this.cells[t]
               : ("string" == typeof t && (t = this.element.querySelector(t)),
                 this.getCell(t));
         }),
         (p.uiChange = function () {
            this.emitEvent("uiChange");
         }),
         (p.childUIPointerDown = function (t) {
            this.emitEvent("childUIPointerDown", [t]);
         }),
         (p.onresize = function () {
            this.watchCSS(), this.resize();
         }),
         n.debounceMethod(l, "onresize", 150),
         (p.resize = function () {
            if (this.isActive) {
               this.getSize(),
                  this.options.wrapAround &&
                     (this.x = n.modulo(this.x, this.slideableWidth)),
                  this.positionCells(),
                  this._getWrapShiftCells(),
                  this.setGallerySize(),
                  this.emitEvent("resize");
               var t = this.selectedElements && this.selectedElements[0];
               this.selectCell(t, !1, !0);
            }
         }),
         (p.watchCSS = function () {
            var t = this.options.watchCSS;
            if (t) {
               var e = c(this.element, ":after").content;
               e.indexOf("flickity") != -1
                  ? this.activate()
                  : this.deactivate();
            }
         }),
         (p.onkeydown = function (t) {
            var e =
               document.activeElement && document.activeElement != this.element;
            if (this.options.accessibility && !e) {
               var i = l.keyboardHandlers[t.keyCode];
               i && i.call(this);
            }
         }),
         (l.keyboardHandlers = {
            37: function () {
               var t = this.options.rightToLeft ? "next" : "previous";
               this.uiChange(), this[t]();
            },
            39: function () {
               var t = this.options.rightToLeft ? "previous" : "next";
               this.uiChange(), this[t]();
            },
         }),
         (p.focus = function () {
            var e = t.pageYOffset;
            this.element.focus({ preventScroll: !0 }),
               t.pageYOffset != e && t.scrollTo(t.pageXOffset, e);
         }),
         (p.deactivate = function () {
            this.isActive &&
               (this.element.classList.remove("flickity-enabled"),
               this.element.classList.remove("flickity-rtl"),
               this.unselectSelectedSlide(),
               this.cells.forEach(function (t) {
                  t.destroy();
               }),
               this.element.removeChild(this.viewport),
               a(this.slider.children, this.element),
               this.options.accessibility &&
                  (this.element.removeAttribute("tabIndex"),
                  this.element.removeEventListener("keydown", this)),
               (this.isActive = !1),
               this.emitEvent("deactivate"));
         }),
         (p.destroy = function () {
            this.deactivate(),
               t.removeEventListener("resize", this),
               this.emitEvent("destroy"),
               h && this.$element && h.removeData(this.element, "flickity"),
               delete this.element.flickityGUID,
               delete f[this.guid];
         }),
         n.extend(p, r),
         (l.data = function (t) {
            t = n.getQueryElement(t);
            var e = t && t.flickityGUID;
            return e && f[e];
         }),
         n.htmlInit(l, "flickity"),
         h && h.bridget && h.bridget("flickity", l),
         (l.setJQuery = function (t) {
            h = t;
         }),
         (l.Cell = s),
         l
      );
   }),
   (function (t, e) {
      "function" == typeof define && define.amd
         ? define("unipointer/unipointer", ["ev-emitter/ev-emitter"], function (
              i
           ) {
              return e(t, i);
           })
         : "object" == typeof module && module.exports
         ? (module.exports = e(t, require("ev-emitter")))
         : (t.Unipointer = e(t, t.EvEmitter));
   })(window, function (t, e) {
      function i() {}
      function n() {}
      var s = (n.prototype = Object.create(e.prototype));
      (s.bindStartEvent = function (t) {
         this._bindStartEvent(t, !0);
      }),
         (s.unbindStartEvent = function (t) {
            this._bindStartEvent(t, !1);
         }),
         (s._bindStartEvent = function (e, i) {
            i = void 0 === i || i;
            var n = i ? "addEventListener" : "removeEventListener",
               s = "mousedown";
            t.PointerEvent
               ? (s = "pointerdown")
               : "ontouchstart" in t && (s = "touchstart"),
               e[n](s, this);
         }),
         (s.handleEvent = function (t) {
            var e = "on" + t.type;
            this[e] && this[e](t);
         }),
         (s.getTouch = function (t) {
            for (var e = 0; e < t.length; e++) {
               var i = t[e];
               if (i.identifier == this.pointerIdentifier) return i;
            }
         }),
         (s.onmousedown = function (t) {
            var e = t.button;
            (e && 0 !== e && 1 !== e) || this._pointerDown(t, t);
         }),
         (s.ontouchstart = function (t) {
            this._pointerDown(t, t.changedTouches[0]);
         }),
         (s.onpointerdown = function (t) {
            this._pointerDown(t, t);
         }),
         (s._pointerDown = function (t, e) {
            t.button ||
               this.isPointerDown ||
               ((this.isPointerDown = !0),
               (this.pointerIdentifier =
                  void 0 !== e.pointerId ? e.pointerId : e.identifier),
               this.pointerDown(t, e));
         }),
         (s.pointerDown = function (t, e) {
            this._bindPostStartEvents(t), this.emitEvent("pointerDown", [t, e]);
         });
      var o = {
         mousedown: ["mousemove", "mouseup"],
         touchstart: ["touchmove", "touchend", "touchcancel"],
         pointerdown: ["pointermove", "pointerup", "pointercancel"],
      };
      return (
         (s._bindPostStartEvents = function (e) {
            if (e) {
               var i = o[e.type];
               i.forEach(function (e) {
                  t.addEventListener(e, this);
               }, this),
                  (this._boundPointerEvents = i);
            }
         }),
         (s._unbindPostStartEvents = function () {
            this._boundPointerEvents &&
               (this._boundPointerEvents.forEach(function (e) {
                  t.removeEventListener(e, this);
               }, this),
               delete this._boundPointerEvents);
         }),
         (s.onmousemove = function (t) {
            this._pointerMove(t, t);
         }),
         (s.onpointermove = function (t) {
            t.pointerId == this.pointerIdentifier && this._pointerMove(t, t);
         }),
         (s.ontouchmove = function (t) {
            var e = this.getTouch(t.changedTouches);
            e && this._pointerMove(t, e);
         }),
         (s._pointerMove = function (t, e) {
            this.pointerMove(t, e);
         }),
         (s.pointerMove = function (t, e) {
            this.emitEvent("pointerMove", [t, e]);
         }),
         (s.onmouseup = function (t) {
            this._pointerUp(t, t);
         }),
         (s.onpointerup = function (t) {
            t.pointerId == this.pointerIdentifier && this._pointerUp(t, t);
         }),
         (s.ontouchend = function (t) {
            var e = this.getTouch(t.changedTouches);
            e && this._pointerUp(t, e);
         }),
         (s._pointerUp = function (t, e) {
            this._pointerDone(), this.pointerUp(t, e);
         }),
         (s.pointerUp = function (t, e) {
            this.emitEvent("pointerUp", [t, e]);
         }),
         (s._pointerDone = function () {
            this._pointerReset(),
               this._unbindPostStartEvents(),
               this.pointerDone();
         }),
         (s._pointerReset = function () {
            (this.isPointerDown = !1), delete this.pointerIdentifier;
         }),
         (s.pointerDone = i),
         (s.onpointercancel = function (t) {
            t.pointerId == this.pointerIdentifier && this._pointerCancel(t, t);
         }),
         (s.ontouchcancel = function (t) {
            var e = this.getTouch(t.changedTouches);
            e && this._pointerCancel(t, e);
         }),
         (s._pointerCancel = function (t, e) {
            this._pointerDone(), this.pointerCancel(t, e);
         }),
         (s.pointerCancel = function (t, e) {
            this.emitEvent("pointerCancel", [t, e]);
         }),
         (n.getPointerPoint = function (t) {
            return { x: t.pageX, y: t.pageY };
         }),
         n
      );
   }),
   (function (t, e) {
      "function" == typeof define && define.amd
         ? define("unidragger/unidragger", ["unipointer/unipointer"], function (
              i
           ) {
              return e(t, i);
           })
         : "object" == typeof module && module.exports
         ? (module.exports = e(t, require("unipointer")))
         : (t.Unidragger = e(t, t.Unipointer));
   })(window, function (t, e) {
      function i() {}
      var n = (i.prototype = Object.create(e.prototype));
      (n.bindHandles = function () {
         this._bindHandles(!0);
      }),
         (n.unbindHandles = function () {
            this._bindHandles(!1);
         }),
         (n._bindHandles = function (e) {
            e = void 0 === e || e;
            for (
               var i = e ? "addEventListener" : "removeEventListener",
                  n = e ? this._touchActionValue : "",
                  s = 0;
               s < this.handles.length;
               s++
            ) {
               var o = this.handles[s];
               this._bindStartEvent(o, e),
                  o[i]("click", this),
                  t.PointerEvent && (o.style.touchAction = n);
            }
         }),
         (n._touchActionValue = "none"),
         (n.pointerDown = function (t, e) {
            var i = this.okayPointerDown(t);
            i &&
               ((this.pointerDownPointer = e),
               t.preventDefault(),
               this.pointerDownBlur(),
               this._bindPostStartEvents(t),
               this.emitEvent("pointerDown", [t, e]));
         });
      var s = { TEXTAREA: !0, INPUT: !0, SELECT: !0, OPTION: !0 },
         o = {
            radio: !0,
            checkbox: !0,
            button: !0,
            submit: !0,
            image: !0,
            file: !0,
         };
      return (
         (n.okayPointerDown = function (t) {
            var e = s[t.target.nodeName],
               i = o[t.target.type],
               n = !e || i;
            return n || this._pointerReset(), n;
         }),
         (n.pointerDownBlur = function () {
            var t = document.activeElement,
               e = t && t.blur && t != document.body;
            e && t.blur();
         }),
         (n.pointerMove = function (t, e) {
            var i = this._dragPointerMove(t, e);
            this.emitEvent("pointerMove", [t, e, i]), this._dragMove(t, e, i);
         }),
         (n._dragPointerMove = function (t, e) {
            var i = {
               x: e.pageX - this.pointerDownPointer.pageX,
               y: e.pageY - this.pointerDownPointer.pageY,
            };
            return (
               !this.isDragging &&
                  this.hasDragStarted(i) &&
                  this._dragStart(t, e),
               i
            );
         }),
         (n.hasDragStarted = function (t) {
            return Math.abs(t.x) > 3 || Math.abs(t.y) > 3;
         }),
         (n.pointerUp = function (t, e) {
            this.emitEvent("pointerUp", [t, e]), this._dragPointerUp(t, e);
         }),
         (n._dragPointerUp = function (t, e) {
            this.isDragging ? this._dragEnd(t, e) : this._staticClick(t, e);
         }),
         (n._dragStart = function (t, e) {
            (this.isDragging = !0),
               (this.isPreventingClicks = !0),
               this.dragStart(t, e);
         }),
         (n.dragStart = function (t, e) {
            this.emitEvent("dragStart", [t, e]);
         }),
         (n._dragMove = function (t, e, i) {
            this.isDragging && this.dragMove(t, e, i);
         }),
         (n.dragMove = function (t, e, i) {
            t.preventDefault(), this.emitEvent("dragMove", [t, e, i]);
         }),
         (n._dragEnd = function (t, e) {
            (this.isDragging = !1),
               setTimeout(
                  function () {
                     delete this.isPreventingClicks;
                  }.bind(this)
               ),
               this.dragEnd(t, e);
         }),
         (n.dragEnd = function (t, e) {
            this.emitEvent("dragEnd", [t, e]);
         }),
         (n.onclick = function (t) {
            this.isPreventingClicks && t.preventDefault();
         }),
         (n._staticClick = function (t, e) {
            (this.isIgnoringMouseUp && "mouseup" == t.type) ||
               (this.staticClick(t, e),
               "mouseup" != t.type &&
                  ((this.isIgnoringMouseUp = !0),
                  setTimeout(
                     function () {
                        delete this.isIgnoringMouseUp;
                     }.bind(this),
                     400
                  )));
         }),
         (n.staticClick = function (t, e) {
            this.emitEvent("staticClick", [t, e]);
         }),
         (i.getPointerPoint = e.getPointerPoint),
         i
      );
   }),
   (function (t, e) {
      "function" == typeof define && define.amd
         ? define("flickity/js/drag", [
              "./flickity",
              "unidragger/unidragger",
              "fizzy-ui-utils/utils",
           ], function (i, n, s) {
              return e(t, i, n, s);
           })
         : "object" == typeof module && module.exports
         ? (module.exports = e(
              t,
              require("./flickity"),
              require("unidragger"),
              require("fizzy-ui-utils")
           ))
         : (t.Flickity = e(t, t.Flickity, t.Unidragger, t.fizzyUIUtils));
   })(window, function (t, e, i, n) {
      function s() {
         return { x: t.pageXOffset, y: t.pageYOffset };
      }
      n.extend(e.defaults, { draggable: ">1", dragThreshold: 3 }),
         e.createMethods.push("_createDrag");
      var o = e.prototype;
      n.extend(o, i.prototype), (o._touchActionValue = "pan-y");
      var r = "createTouch" in document,
         a = !1;
      (o._createDrag = function () {
         this.on("activate", this.onActivateDrag),
            this.on("uiChange", this._uiChangeDrag),
            this.on("childUIPointerDown", this._childUIPointerDownDrag),
            this.on("deactivate", this.onDeactivateDrag),
            this.on("cellChange", this.updateDraggable),
            r &&
               !a &&
               (t.addEventListener("touchmove", function () {}), (a = !0));
      }),
         (o.onActivateDrag = function () {
            (this.handles = [this.viewport]),
               this.bindHandles(),
               this.updateDraggable();
         }),
         (o.onDeactivateDrag = function () {
            this.unbindHandles(), this.element.classList.remove("is-draggable");
         }),
         (o.updateDraggable = function () {
            ">1" == this.options.draggable
               ? (this.isDraggable = this.slides.length > 1)
               : (this.isDraggable = this.options.draggable),
               this.isDraggable
                  ? this.element.classList.add("is-draggable")
                  : this.element.classList.remove("is-draggable");
         }),
         (o.bindDrag = function () {
            (this.options.draggable = !0), this.updateDraggable();
         }),
         (o.unbindDrag = function () {
            (this.options.draggable = !1), this.updateDraggable();
         }),
         (o._uiChangeDrag = function () {
            delete this.isFreeScrolling;
         }),
         (o._childUIPointerDownDrag = function (t) {
            t.preventDefault(), this.pointerDownFocus(t);
         }),
         (o.pointerDown = function (e, i) {
            if (!this.isDraggable) return void this._pointerDownDefault(e, i);
            var n = this.okayPointerDown(e);
            n &&
               (this._pointerDownPreventDefault(e),
               this.pointerDownFocus(e),
               document.activeElement != this.element && this.pointerDownBlur(),
               (this.dragX = this.x),
               this.viewport.classList.add("is-pointer-down"),
               (this.pointerDownScroll = s()),
               t.addEventListener("scroll", this),
               this._pointerDownDefault(e, i));
         }),
         (o._pointerDownDefault = function (t, e) {
            (this.pointerDownPointer = e),
               this._bindPostStartEvents(t),
               this.dispatchEvent("pointerDown", t, [e]);
         });
      var l = { INPUT: !0, TEXTAREA: !0, SELECT: !0 };
      return (
         (o.pointerDownFocus = function (t) {
            var e = l[t.target.nodeName];
            e || this.focus();
         }),
         (o._pointerDownPreventDefault = function (t) {
            var e = "touchstart" == t.type,
               i = "touch" == t.pointerType,
               n = l[t.target.nodeName];
            e || i || n || t.preventDefault();
         }),
         (o.hasDragStarted = function (t) {
            return Math.abs(t.x) > this.options.dragThreshold;
         }),
         (o.pointerUp = function (t, e) {
            delete this.isTouchScrolling,
               this.viewport.classList.remove("is-pointer-down"),
               this.dispatchEvent("pointerUp", t, [e]),
               this._dragPointerUp(t, e);
         }),
         (o.pointerDone = function () {
            t.removeEventListener("scroll", this),
               delete this.pointerDownScroll;
         }),
         (o.dragStart = function (e, i) {
            this.isDraggable &&
               ((this.dragStartPosition = this.x),
               this.startAnimation(),
               t.removeEventListener("scroll", this),
               this.dispatchEvent("dragStart", e, [i]));
         }),
         (o.pointerMove = function (t, e) {
            var i = this._dragPointerMove(t, e);
            this.dispatchEvent("pointerMove", t, [e, i]),
               this._dragMove(t, e, i);
         }),
         (o.dragMove = function (t, e, i) {
            if (this.isDraggable) {
               t.preventDefault(), (this.previousDragX = this.dragX);
               var n = this.options.rightToLeft ? -1 : 1;
               this.options.wrapAround && (i.x = i.x % this.slideableWidth);
               var s = this.dragStartPosition + i.x * n;
               if (!this.options.wrapAround && this.slides.length) {
                  var o = Math.max(
                     -this.slides[0].target,
                     this.dragStartPosition
                  );
                  s = s > o ? 0.5 * (s + o) : s;
                  var r = Math.min(
                     -this.getLastSlide().target,
                     this.dragStartPosition
                  );
                  s = s < r ? 0.5 * (s + r) : s;
               }
               (this.dragX = s),
                  (this.dragMoveTime = new Date()),
                  this.dispatchEvent("dragMove", t, [e, i]);
            }
         }),
         (o.dragEnd = function (t, e) {
            if (this.isDraggable) {
               this.options.freeScroll && (this.isFreeScrolling = !0);
               var i = this.dragEndRestingSelect();
               if (this.options.freeScroll && !this.options.wrapAround) {
                  var n = this.getRestingPosition();
                  this.isFreeScrolling =
                     -n > this.slides[0].target &&
                     -n < this.getLastSlide().target;
               } else
                  this.options.freeScroll ||
                     i != this.selectedIndex ||
                     (i += this.dragEndBoostSelect());
               delete this.previousDragX,
                  (this.isDragSelect = this.options.wrapAround),
                  this.select(i),
                  delete this.isDragSelect,
                  this.dispatchEvent("dragEnd", t, [e]);
            }
         }),
         (o.dragEndRestingSelect = function () {
            var t = this.getRestingPosition(),
               e = Math.abs(this.getSlideDistance(-t, this.selectedIndex)),
               i = this._getClosestResting(t, e, 1),
               n = this._getClosestResting(t, e, -1),
               s = i.distance < n.distance ? i.index : n.index;
            return s;
         }),
         (o._getClosestResting = function (t, e, i) {
            for (
               var n = this.selectedIndex,
                  s = 1 / 0,
                  o =
                     this.options.contain && !this.options.wrapAround
                        ? function (t, e) {
                             return t <= e;
                          }
                        : function (t, e) {
                             return t < e;
                          };
               o(e, s) &&
               ((n += i),
               (s = e),
               (e = this.getSlideDistance(-t, n)),
               null !== e);

            )
               e = Math.abs(e);
            return { distance: s, index: n - i };
         }),
         (o.getSlideDistance = function (t, e) {
            var i = this.slides.length,
               s = this.options.wrapAround && i > 1,
               o = s ? n.modulo(e, i) : e,
               r = this.slides[o];
            if (!r) return null;
            var a = s ? this.slideableWidth * Math.floor(e / i) : 0;
            return t - (r.target + a);
         }),
         (o.dragEndBoostSelect = function () {
            if (
               void 0 === this.previousDragX ||
               !this.dragMoveTime ||
               new Date() - this.dragMoveTime > 100
            )
               return 0;
            var t = this.getSlideDistance(-this.dragX, this.selectedIndex),
               e = this.previousDragX - this.dragX;
            return t > 0 && e > 0 ? 1 : t < 0 && e < 0 ? -1 : 0;
         }),
         (o.staticClick = function (t, e) {
            var i = this.getParentCell(t.target),
               n = i && i.element,
               s = i && this.cells.indexOf(i);
            this.dispatchEvent("staticClick", t, [e, n, s]);
         }),
         (o.onscroll = function () {
            var t = s(),
               e = this.pointerDownScroll.x - t.x,
               i = this.pointerDownScroll.y - t.y;
            (Math.abs(e) > 3 || Math.abs(i) > 3) && this._pointerDone();
         }),
         e
      );
   }),
   (function (t, e) {
      "function" == typeof define && define.amd
         ? define("tap-listener/tap-listener", [
              "unipointer/unipointer",
           ], function (i) {
              return e(t, i);
           })
         : "object" == typeof module && module.exports
         ? (module.exports = e(t, require("unipointer")))
         : (t.TapListener = e(t, t.Unipointer));
   })(window, function (t, e) {
      function i(t) {
         this.bindTap(t);
      }
      var n = (i.prototype = Object.create(e.prototype));
      return (
         (n.bindTap = function (t) {
            t &&
               (this.unbindTap(),
               (this.tapElement = t),
               this._bindStartEvent(t, !0));
         }),
         (n.unbindTap = function () {
            this.tapElement &&
               (this._bindStartEvent(this.tapElement, !0),
               delete this.tapElement);
         }),
         (n.pointerUp = function (i, n) {
            if (!this.isIgnoringMouseUp || "mouseup" != i.type) {
               var s = e.getPointerPoint(n),
                  o = this.tapElement.getBoundingClientRect(),
                  r = t.pageXOffset,
                  a = t.pageYOffset,
                  l =
                     s.x >= o.left + r &&
                     s.x <= o.right + r &&
                     s.y >= o.top + a &&
                     s.y <= o.bottom + a;
               if ((l && this.emitEvent("tap", [i, n]), "mouseup" != i.type)) {
                  this.isIgnoringMouseUp = !0;
                  var h = this;
                  setTimeout(function () {
                     delete h.isIgnoringMouseUp;
                  }, 400);
               }
            }
         }),
         (n.destroy = function () {
            this.pointerDone(), this.unbindTap();
         }),
         i
      );
   }),
   (function (t, e) {
      "function" == typeof define && define.amd
         ? define("flickity/js/prev-next-button", [
              "./flickity",
              "tap-listener/tap-listener",
              "fizzy-ui-utils/utils",
           ], function (i, n, s) {
              return e(t, i, n, s);
           })
         : "object" == typeof module && module.exports
         ? (module.exports = e(
              t,
              require("./flickity"),
              require("tap-listener"),
              require("fizzy-ui-utils")
           ))
         : e(t, t.Flickity, t.TapListener, t.fizzyUIUtils);
   })(window, function (t, e, i, n) {
      "use strict";
      function s(t, e) {
         (this.direction = t), (this.parent = e), this._create();
      }
      function o(t) {
         return "string" == typeof t
            ? t
            : "M " +
                 t.x0 +
                 ",50 L " +
                 t.x1 +
                 "," +
                 (t.y1 + 50) +
                 " L " +
                 t.x2 +
                 "," +
                 (t.y2 + 50) +
                 " L " +
                 t.x3 +
                 ",50  L " +
                 t.x2 +
                 "," +
                 (50 - t.y2) +
                 " L " +
                 t.x1 +
                 "," +
                 (50 - t.y1) +
                 " Z";
      }
      var r = "http://www.w3.org/2000/svg";
      (s.prototype = Object.create(i.prototype)),
         (s.prototype._create = function () {
            (this.isEnabled = !0), (this.isPrevious = this.direction == -1);
            var t = this.parent.options.rightToLeft ? 1 : -1;
            this.isLeft = this.direction == t;
            var e = (this.element = document.createElement("button"));
            (e.className = "flickity-button flickity-prev-next-button"),
               (e.className += this.isPrevious ? " previous" : " next"),
               e.setAttribute("type", "button"),
               this.disable(),
               e.setAttribute(
                  "aria-label",
                  this.isPrevious ? "Previous" : "Next"
               );
            var i = this.createSVG();
            e.appendChild(i),
               this.on("tap", this.onTap),
               this.parent.on("select", this.update.bind(this)),
               this.on(
                  "pointerDown",
                  this.parent.childUIPointerDown.bind(this.parent)
               );
         }),
         (s.prototype.activate = function () {
            this.bindTap(this.element),
               this.element.addEventListener("click", this),
               this.parent.element.appendChild(this.element);
         }),
         (s.prototype.deactivate = function () {
            this.parent.element.removeChild(this.element),
               i.prototype.destroy.call(this),
               this.element.removeEventListener("click", this);
         }),
         (s.prototype.createSVG = function () {
            var t = document.createElementNS(r, "svg");
            t.setAttribute("class", "flickity-button-icon"),
               t.setAttribute("viewBox", "0 0 100 100");
            var e = document.createElementNS(r, "path"),
               i = o(this.parent.options.arrowShape);
            return (
               e.setAttribute("d", i),
               e.setAttribute("class", "arrow"),
               this.isLeft ||
                  e.setAttribute(
                     "transform",
                     "translate(100, 100) rotate(180) "
                  ),
               t.appendChild(e),
               t
            );
         }),
         (s.prototype.onTap = function () {
            if (this.isEnabled) {
               this.parent.uiChange();
               var t = this.isPrevious ? "previous" : "next";
               this.parent[t]();
            }
         }),
         (s.prototype.handleEvent = n.handleEvent),
         (s.prototype.onclick = function (t) {
            var e = document.activeElement;
            e && e == this.element && this.onTap(t, t);
         }),
         (s.prototype.enable = function () {
            this.isEnabled ||
               ((this.element.disabled = !1), (this.isEnabled = !0));
         }),
         (s.prototype.disable = function () {
            this.isEnabled &&
               ((this.element.disabled = !0), (this.isEnabled = !1));
         }),
         (s.prototype.update = function () {
            var t = this.parent.slides;
            if (this.parent.options.wrapAround && t.length > 1)
               return void this.enable();
            var e = t.length ? t.length - 1 : 0,
               i = this.isPrevious ? 0 : e,
               n = this.parent.selectedIndex == i ? "disable" : "enable";
            this[n]();
         }),
         (s.prototype.destroy = function () {
            this.deactivate();
         }),
         n.extend(e.defaults, {
            prevNextButtons: !0,
            arrowShape: { x0: 10, x1: 60, y1: 50, x2: 70, y2: 40, x3: 30 },
         }),
         e.createMethods.push("_createPrevNextButtons");
      var a = e.prototype;
      return (
         (a._createPrevNextButtons = function () {
            this.options.prevNextButtons &&
               ((this.prevButton = new s(-1, this)),
               (this.nextButton = new s(1, this)),
               this.on("activate", this.activatePrevNextButtons));
         }),
         (a.activatePrevNextButtons = function () {
            this.prevButton.activate(),
               this.nextButton.activate(),
               this.on("deactivate", this.deactivatePrevNextButtons);
         }),
         (a.deactivatePrevNextButtons = function () {
            this.prevButton.deactivate(),
               this.nextButton.deactivate(),
               this.off("deactivate", this.deactivatePrevNextButtons);
         }),
         (e.PrevNextButton = s),
         e
      );
   }),
   (function (t, e) {
      "function" == typeof define && define.amd
         ? define("flickity/js/page-dots", [
              "./flickity",
              "tap-listener/tap-listener",
              "fizzy-ui-utils/utils",
           ], function (i, n, s) {
              return e(t, i, n, s);
           })
         : "object" == typeof module && module.exports
         ? (module.exports = e(
              t,
              require("./flickity"),
              require("tap-listener"),
              require("fizzy-ui-utils")
           ))
         : e(t, t.Flickity, t.TapListener, t.fizzyUIUtils);
   })(window, function (t, e, i, n) {
      function s(t) {
         (this.parent = t), this._create();
      }
      (s.prototype = new i()),
         (s.prototype._create = function () {
            (this.holder = document.createElement("ol")),
               (this.holder.className = "flickity-page-dots"),
               (this.dots = []),
               this.on("tap", this.onTap),
               this.on(
                  "pointerDown",
                  this.parent.childUIPointerDown.bind(this.parent)
               );
         }),
         (s.prototype.activate = function () {
            this.setDots(),
               this.bindTap(this.holder),
               this.parent.element.appendChild(this.holder);
         }),
         (s.prototype.deactivate = function () {
            this.parent.element.removeChild(this.holder),
               i.prototype.destroy.call(this);
         }),
         (s.prototype.setDots = function () {
            var t = this.parent.slides.length - this.dots.length;
            t > 0 ? this.addDots(t) : t < 0 && this.removeDots(-t);
         }),
         (s.prototype.addDots = function (t) {
            for (
               var e = document.createDocumentFragment(),
                  i = [],
                  n = this.dots.length,
                  s = n + t,
                  o = n;
               o < s;
               o++
            ) {
               var r = document.createElement("li");
               (r.className = "dot"),
                  r.setAttribute("aria-label", "Page dot " + (o + 1)),
                  e.appendChild(r),
                  i.push(r);
            }
            this.holder.appendChild(e), (this.dots = this.dots.concat(i));
         }),
         (s.prototype.removeDots = function (t) {
            var e = this.dots.splice(this.dots.length - t, t);
            e.forEach(function (t) {
               this.holder.removeChild(t);
            }, this);
         }),
         (s.prototype.updateSelected = function () {
            this.selectedDot &&
               ((this.selectedDot.className = "dot"),
               this.selectedDot.removeAttribute("aria-current")),
               this.dots.length &&
                  ((this.selectedDot = this.dots[this.parent.selectedIndex]),
                  (this.selectedDot.className = "dot is-selected"),
                  this.selectedDot.setAttribute("aria-current", "step"));
         }),
         (s.prototype.onTap = function (t) {
            var e = t.target;
            if ("LI" == e.nodeName) {
               this.parent.uiChange();
               var i = this.dots.indexOf(e);
               this.parent.select(i);
            }
         }),
         (s.prototype.destroy = function () {
            this.deactivate();
         }),
         (e.PageDots = s),
         n.extend(e.defaults, { pageDots: !0 }),
         e.createMethods.push("_createPageDots");
      var o = e.prototype;
      return (
         (o._createPageDots = function () {
            this.options.pageDots &&
               ((this.pageDots = new s(this)),
               this.on("activate", this.activatePageDots),
               this.on("select", this.updateSelectedPageDots),
               this.on("cellChange", this.updatePageDots),
               this.on("resize", this.updatePageDots),
               this.on("deactivate", this.deactivatePageDots));
         }),
         (o.activatePageDots = function () {
            this.pageDots.activate();
         }),
         (o.updateSelectedPageDots = function () {
            this.pageDots.updateSelected();
         }),
         (o.updatePageDots = function () {
            this.pageDots.setDots();
         }),
         (o.deactivatePageDots = function () {
            this.pageDots.deactivate();
         }),
         (e.PageDots = s),
         e
      );
   }),
   (function (t, e) {
      "function" == typeof define && define.amd
         ? define("flickity/js/player", [
              "ev-emitter/ev-emitter",
              "fizzy-ui-utils/utils",
              "./flickity",
           ], function (t, i, n) {
              return e(t, i, n);
           })
         : "object" == typeof module && module.exports
         ? (module.exports = e(
              require("ev-emitter"),
              require("fizzy-ui-utils"),
              require("./flickity")
           ))
         : e(t.EvEmitter, t.fizzyUIUtils, t.Flickity);
   })(window, function (t, e, i) {
      function n(t) {
         (this.parent = t),
            (this.state = "stopped"),
            (this.onVisibilityChange = this.visibilityChange.bind(this)),
            (this.onVisibilityPlay = this.visibilityPlay.bind(this));
      }
      (n.prototype = Object.create(t.prototype)),
         (n.prototype.play = function () {
            if ("playing" != this.state) {
               var t = document.hidden;
               if (t)
                  return void document.addEventListener(
                     "visibilitychange",
                     this.onVisibilityPlay
                  );
               (this.state = "playing"),
                  document.addEventListener(
                     "visibilitychange",
                     this.onVisibilityChange
                  ),
                  this.tick();
            }
         }),
         (n.prototype.tick = function () {
            if ("playing" == this.state) {
               var t = this.parent.options.autoPlay;
               t = "number" == typeof t ? t : 3e3;
               var e = this;
               this.clear(),
                  (this.timeout = setTimeout(function () {
                     e.parent.next(!0), e.tick();
                  }, t));
            }
         }),
         (n.prototype.stop = function () {
            (this.state = "stopped"),
               this.clear(),
               document.removeEventListener(
                  "visibilitychange",
                  this.onVisibilityChange
               );
         }),
         (n.prototype.clear = function () {
            clearTimeout(this.timeout);
         }),
         (n.prototype.pause = function () {
            "playing" == this.state && ((this.state = "paused"), this.clear());
         }),
         (n.prototype.unpause = function () {
            "paused" == this.state && this.play();
         }),
         (n.prototype.visibilityChange = function () {
            var t = document.hidden;
            this[t ? "pause" : "unpause"]();
         }),
         (n.prototype.visibilityPlay = function () {
            this.play(),
               document.removeEventListener(
                  "visibilitychange",
                  this.onVisibilityPlay
               );
         }),
         e.extend(i.defaults, { pauseAutoPlayOnHover: !0 }),
         i.createMethods.push("_createPlayer");
      var s = i.prototype;
      return (
         (s._createPlayer = function () {
            (this.player = new n(this)),
               this.on("activate", this.activatePlayer),
               this.on("uiChange", this.stopPlayer),
               this.on("pointerDown", this.stopPlayer),
               this.on("deactivate", this.deactivatePlayer);
         }),
         (s.activatePlayer = function () {
            this.options.autoPlay &&
               (this.player.play(),
               this.element.addEventListener("mouseenter", this));
         }),
         (s.playPlayer = function () {
            this.player.play();
         }),
         (s.stopPlayer = function () {
            this.player.stop();
         }),
         (s.pausePlayer = function () {
            this.player.pause();
         }),
         (s.unpausePlayer = function () {
            this.player.unpause();
         }),
         (s.deactivatePlayer = function () {
            this.player.stop(),
               this.element.removeEventListener("mouseenter", this);
         }),
         (s.onmouseenter = function () {
            this.options.pauseAutoPlayOnHover &&
               (this.player.pause(),
               this.element.addEventListener("mouseleave", this));
         }),
         (s.onmouseleave = function () {
            this.player.unpause(),
               this.element.removeEventListener("mouseleave", this);
         }),
         (i.Player = n),
         i
      );
   }),
   (function (t, e) {
      "function" == typeof define && define.amd
         ? define("flickity/js/add-remove-cell", [
              "./flickity",
              "fizzy-ui-utils/utils",
           ], function (i, n) {
              return e(t, i, n);
           })
         : "object" == typeof module && module.exports
         ? (module.exports = e(
              t,
              require("./flickity"),
              require("fizzy-ui-utils")
           ))
         : e(t, t.Flickity, t.fizzyUIUtils);
   })(window, function (t, e, i) {
      function n(t) {
         var e = document.createDocumentFragment();
         return (
            t.forEach(function (t) {
               e.appendChild(t.element);
            }),
            e
         );
      }
      var s = e.prototype;
      return (
         (s.insert = function (t, e) {
            var i = this._makeCells(t);
            if (i && i.length) {
               var s = this.cells.length;
               e = void 0 === e ? s : e;
               var o = n(i),
                  r = e == s;
               if (r) this.slider.appendChild(o);
               else {
                  var a = this.cells[e].element;
                  this.slider.insertBefore(o, a);
               }
               if (0 === e) this.cells = i.concat(this.cells);
               else if (r) this.cells = this.cells.concat(i);
               else {
                  var l = this.cells.splice(e, s - e);
                  this.cells = this.cells.concat(i).concat(l);
               }
               this._sizeCells(i), this.cellChange(e, !0);
            }
         }),
         (s.append = function (t) {
            this.insert(t, this.cells.length);
         }),
         (s.prepend = function (t) {
            this.insert(t, 0);
         }),
         (s.remove = function (t) {
            var e = this.getCells(t);
            if (e && e.length) {
               var n = this.cells.length - 1;
               e.forEach(function (t) {
                  t.remove();
                  var e = this.cells.indexOf(t);
                  (n = Math.min(e, n)), i.removeFrom(this.cells, t);
               }, this),
                  this.cellChange(n, !0);
            }
         }),
         (s.cellSizeChange = function (t) {
            var e = this.getCell(t);
            if (e) {
               e.getSize();
               var i = this.cells.indexOf(e);
               this.cellChange(i);
            }
         }),
         (s.cellChange = function (t, e) {
            var i = this.selectedElement;
            this._positionCells(t),
               this._getWrapShiftCells(),
               this.setGallerySize();
            var n = this.getCell(i);
            n && (this.selectedIndex = this.getCellSlideIndex(n)),
               (this.selectedIndex = Math.min(
                  this.slides.length - 1,
                  this.selectedIndex
               )),
               this.emitEvent("cellChange", [t]),
               this.select(this.selectedIndex),
               e && this.positionSliderAtSelected();
         }),
         e
      );
   }),
   (function (t, e) {
      "function" == typeof define && define.amd
         ? define("flickity/js/lazyload", [
              "./flickity",
              "fizzy-ui-utils/utils",
           ], function (i, n) {
              return e(t, i, n);
           })
         : "object" == typeof module && module.exports
         ? (module.exports = e(
              t,
              require("./flickity"),
              require("fizzy-ui-utils")
           ))
         : e(t, t.Flickity, t.fizzyUIUtils);
   })(window, function (t, e, i) {
      "use strict";
      function n(t) {
         if ("IMG" == t.nodeName) {
            var e = t.getAttribute("data-flickity-lazyload"),
               n = t.getAttribute("data-flickity-lazyload-src"),
               s = t.getAttribute("data-flickity-lazyload-srcset");
            if (e || n || s) return [t];
         }
         var o =
               "img[data-flickity-lazyload], img[data-flickity-lazyload-src], img[data-flickity-lazyload-srcset]",
            r = t.querySelectorAll(o);
         return i.makeArray(r);
      }
      function s(t, e) {
         (this.img = t), (this.flickity = e), this.load();
      }
      e.createMethods.push("_createLazyload");
      var o = e.prototype;
      return (
         (o._createLazyload = function () {
            this.on("select", this.lazyLoad);
         }),
         (o.lazyLoad = function () {
            var t = this.options.lazyLoad;
            if (t) {
               var e = "number" == typeof t ? t : 0,
                  i = this.getAdjacentCellElements(e),
                  o = [];
               i.forEach(function (t) {
                  var e = n(t);
                  o = o.concat(e);
               }),
                  o.forEach(function (t) {
                     new s(t, this);
                  }, this);
            }
         }),
         (s.prototype.handleEvent = i.handleEvent),
         (s.prototype.load = function () {
            this.img.addEventListener("load", this),
               this.img.addEventListener("error", this);
            var t =
                  this.img.getAttribute("data-flickity-lazyload") ||
                  this.img.getAttribute("data-flickity-lazyload-src"),
               e = this.img.getAttribute("data-flickity-lazyload-srcset");
            (this.img.src = t),
               e && this.img.setAttribute("srcset", e),
               this.img.removeAttribute("data-flickity-lazyload"),
               this.img.removeAttribute("data-flickity-lazyload-src"),
               this.img.removeAttribute("data-flickity-lazyload-srcset");
         }),
         (s.prototype.onload = function (t) {
            this.complete(t, "flickity-lazyloaded");
         }),
         (s.prototype.onerror = function (t) {
            this.complete(t, "flickity-lazyerror");
         }),
         (s.prototype.complete = function (t, e) {
            this.img.removeEventListener("load", this),
               this.img.removeEventListener("error", this);
            var i = this.flickity.getParentCell(this.img),
               n = i && i.element;
            this.flickity.cellSizeChange(n),
               this.img.classList.add(e),
               this.flickity.dispatchEvent("lazyLoad", t, n);
         }),
         (e.LazyLoader = s),
         e
      );
   }),
   (function (t, e) {
      "function" == typeof define && define.amd
         ? define("flickity/js/index", [
              "./flickity",
              "./drag",
              "./prev-next-button",
              "./page-dots",
              "./player",
              "./add-remove-cell",
              "./lazyload",
           ], e)
         : "object" == typeof module &&
           module.exports &&
           (module.exports = e(
              require("./flickity"),
              require("./drag"),
              require("./prev-next-button"),
              require("./page-dots"),
              require("./player"),
              require("./add-remove-cell"),
              require("./lazyload")
           ));
   })(window, function (t) {
      return t;
   }),
   (function (t, e) {
      "function" == typeof define && define.amd
         ? define("flickity-as-nav-for/as-nav-for", [
              "flickity/js/index",
              "fizzy-ui-utils/utils",
           ], e)
         : "object" == typeof module && module.exports
         ? (module.exports = e(require("flickity"), require("fizzy-ui-utils")))
         : (t.Flickity = e(t.Flickity, t.fizzyUIUtils));
   })(window, function (t, e) {
      function i(t, e, i) {
         return (e - t) * i + t;
      }
      t.createMethods.push("_createAsNavFor");
      var n = t.prototype;
      return (
         (n._createAsNavFor = function () {
            this.on("activate", this.activateAsNavFor),
               this.on("deactivate", this.deactivateAsNavFor),
               this.on("destroy", this.destroyAsNavFor);
            var t = this.options.asNavFor;
            if (t) {
               var e = this;
               setTimeout(function () {
                  e.setNavCompanion(t);
               });
            }
         }),
         (n.setNavCompanion = function (i) {
            i = e.getQueryElement(i);
            var n = t.data(i);
            if (n && n != this) {
               this.navCompanion = n;
               var s = this;
               (this.onNavCompanionSelect = function () {
                  s.navCompanionSelect();
               }),
                  n.on("select", this.onNavCompanionSelect),
                  this.on("staticClick", this.onNavStaticClick),
                  this.navCompanionSelect(!0);
            }
         }),
         (n.navCompanionSelect = function (t) {
            if (this.navCompanion) {
               var e = this.navCompanion.selectedCells[0],
                  n = this.navCompanion.cells.indexOf(e),
                  s = n + this.navCompanion.selectedCells.length - 1,
                  o = Math.floor(i(n, s, this.navCompanion.cellAlign));
               if (
                  (this.selectCell(o, !1, t),
                  this.removeNavSelectedElements(),
                  !(o >= this.cells.length))
               ) {
                  var r = this.cells.slice(n, s + 1);
                  (this.navSelectedElements = r.map(function (t) {
                     return t.element;
                  })),
                     this.changeNavSelectedClass("add");
               }
            }
         }),
         (n.changeNavSelectedClass = function (t) {
            this.navSelectedElements.forEach(function (e) {
               e.classList[t]("is-nav-selected");
            });
         }),
         (n.activateAsNavFor = function () {
            this.navCompanionSelect(!0);
         }),
         (n.removeNavSelectedElements = function () {
            this.navSelectedElements &&
               (this.changeNavSelectedClass("remove"),
               delete this.navSelectedElements);
         }),
         (n.onNavStaticClick = function (t, e, i, n) {
            "number" == typeof n && this.navCompanion.selectCell(n);
         }),
         (n.deactivateAsNavFor = function () {
            this.removeNavSelectedElements();
         }),
         (n.destroyAsNavFor = function () {
            this.navCompanion &&
               (this.navCompanion.off("select", this.onNavCompanionSelect),
               this.off("staticClick", this.onNavStaticClick),
               delete this.navCompanion);
         }),
         t
      );
   }),
   (function (t, e) {
      "use strict";
      "function" == typeof define && define.amd
         ? define("imagesloaded/imagesloaded", [
              "ev-emitter/ev-emitter",
           ], function (i) {
              return e(t, i);
           })
         : "object" == typeof module && module.exports
         ? (module.exports = e(t, require("ev-emitter")))
         : (t.imagesLoaded = e(t, t.EvEmitter));
   })("undefined" != typeof window ? window : this, function (t, e) {
      function i(t, e) {
         for (var i in e) t[i] = e[i];
         return t;
      }
      function n(t) {
         if (Array.isArray(t)) return t;
         var e = "object" == typeof t && "number" == typeof t.length;
         return e ? h.call(t) : [t];
      }
      function s(t, e, o) {
         if (!(this instanceof s)) return new s(t, e, o);
         var r = t;
         return (
            "string" == typeof t && (r = document.querySelectorAll(t)),
            r
               ? ((this.elements = n(r)),
                 (this.options = i({}, this.options)),
                 "function" == typeof e ? (o = e) : i(this.options, e),
                 o && this.on("always", o),
                 this.getImages(),
                 a && (this.jqDeferred = new a.Deferred()),
                 void setTimeout(this.check.bind(this)))
               : void l.error("Bad element for imagesLoaded " + (r || t))
         );
      }
      function o(t) {
         this.img = t;
      }
      function r(t, e) {
         (this.url = t), (this.element = e), (this.img = new Image());
      }
      var a = t.jQuery,
         l = t.console,
         h = Array.prototype.slice;
      (s.prototype = Object.create(e.prototype)),
         (s.prototype.options = {}),
         (s.prototype.getImages = function () {
            (this.images = []),
               this.elements.forEach(this.addElementImages, this);
         }),
         (s.prototype.addElementImages = function (t) {
            "IMG" == t.nodeName && this.addImage(t),
               this.options.background === !0 &&
                  this.addElementBackgroundImages(t);
            var e = t.nodeType;
            if (e && c[e]) {
               for (
                  var i = t.querySelectorAll("img"), n = 0;
                  n < i.length;
                  n++
               ) {
                  var s = i[n];
                  this.addImage(s);
               }
               if ("string" == typeof this.options.background) {
                  var o = t.querySelectorAll(this.options.background);
                  for (n = 0; n < o.length; n++) {
                     var r = o[n];
                     this.addElementBackgroundImages(r);
                  }
               }
            }
         });
      var c = { 1: !0, 9: !0, 11: !0 };
      return (
         (s.prototype.addElementBackgroundImages = function (t) {
            var e = getComputedStyle(t);
            if (e)
               for (
                  var i = /url\((['"])?(.*?)\1\)/gi,
                     n = i.exec(e.backgroundImage);
                  null !== n;

               ) {
                  var s = n && n[2];
                  s && this.addBackground(s, t),
                     (n = i.exec(e.backgroundImage));
               }
         }),
         (s.prototype.addImage = function (t) {
            var e = new o(t);
            this.images.push(e);
         }),
         (s.prototype.addBackground = function (t, e) {
            var i = new r(t, e);
            this.images.push(i);
         }),
         (s.prototype.check = function () {
            function t(t, i, n) {
               setTimeout(function () {
                  e.progress(t, i, n);
               });
            }
            var e = this;
            return (
               (this.progressedCount = 0),
               (this.hasAnyBroken = !1),
               this.images.length
                  ? void this.images.forEach(function (e) {
                       e.once("progress", t), e.check();
                    })
                  : void this.complete()
            );
         }),
         (s.prototype.progress = function (t, e, i) {
            this.progressedCount++,
               (this.hasAnyBroken = this.hasAnyBroken || !t.isLoaded),
               this.emitEvent("progress", [this, t, e]),
               this.jqDeferred &&
                  this.jqDeferred.notify &&
                  this.jqDeferred.notify(this, t),
               this.progressedCount == this.images.length && this.complete(),
               this.options.debug && l && l.log("progress: " + i, t, e);
         }),
         (s.prototype.complete = function () {
            var t = this.hasAnyBroken ? "fail" : "done";
            if (
               ((this.isComplete = !0),
               this.emitEvent(t, [this]),
               this.emitEvent("always", [this]),
               this.jqDeferred)
            ) {
               var e = this.hasAnyBroken ? "reject" : "resolve";
               this.jqDeferred[e](this);
            }
         }),
         (o.prototype = Object.create(e.prototype)),
         (o.prototype.check = function () {
            var t = this.getIsImageComplete();
            return t
               ? void this.confirm(0 !== this.img.naturalWidth, "naturalWidth")
               : ((this.proxyImage = new Image()),
                 this.proxyImage.addEventListener("load", this),
                 this.proxyImage.addEventListener("error", this),
                 this.img.addEventListener("load", this),
                 this.img.addEventListener("error", this),
                 void (this.proxyImage.src = this.img.src));
         }),
         (o.prototype.getIsImageComplete = function () {
            return this.img.complete && this.img.naturalWidth;
         }),
         (o.prototype.confirm = function (t, e) {
            (this.isLoaded = t),
               this.emitEvent("progress", [this, this.img, e]);
         }),
         (o.prototype.handleEvent = function (t) {
            var e = "on" + t.type;
            this[e] && this[e](t);
         }),
         (o.prototype.onload = function () {
            this.confirm(!0, "onload"), this.unbindEvents();
         }),
         (o.prototype.onerror = function () {
            this.confirm(!1, "onerror"), this.unbindEvents();
         }),
         (o.prototype.unbindEvents = function () {
            this.proxyImage.removeEventListener("load", this),
               this.proxyImage.removeEventListener("error", this),
               this.img.removeEventListener("load", this),
               this.img.removeEventListener("error", this);
         }),
         (r.prototype = Object.create(o.prototype)),
         (r.prototype.check = function () {
            this.img.addEventListener("load", this),
               this.img.addEventListener("error", this),
               (this.img.src = this.url);
            var t = this.getIsImageComplete();
            t &&
               (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"),
               this.unbindEvents());
         }),
         (r.prototype.unbindEvents = function () {
            this.img.removeEventListener("load", this),
               this.img.removeEventListener("error", this);
         }),
         (r.prototype.confirm = function (t, e) {
            (this.isLoaded = t),
               this.emitEvent("progress", [this, this.element, e]);
         }),
         (s.makeJQueryPlugin = function (e) {
            (e = e || t.jQuery),
               e &&
                  ((a = e),
                  (a.fn.imagesLoaded = function (t, e) {
                     var i = new s(this, t, e);
                     return i.jqDeferred.promise(a(this));
                  }));
         }),
         s.makeJQueryPlugin(),
         s
      );
   }),
   (function (t, e) {
      "function" == typeof define && define.amd
         ? define(["flickity/js/index", "imagesloaded/imagesloaded"], function (
              i,
              n
           ) {
              return e(t, i, n);
           })
         : "object" == typeof module && module.exports
         ? (module.exports = e(t, require("flickity"), require("imagesloaded")))
         : (t.Flickity = e(t, t.Flickity, t.imagesLoaded));
   })(window, function (t, e, i) {
      "use strict";
      e.createMethods.push("_createImagesLoaded");
      var n = e.prototype;
      return (
         (n._createImagesLoaded = function () {
            this.on("activate", this.imagesLoaded);
         }),
         (n.imagesLoaded = function () {
            function t(t, i) {
               var n = e.getParentCell(i.img);
               e.cellSizeChange(n && n.element),
                  e.options.freeScroll || e.positionSliderAtSelected();
            }
            if (this.options.imagesLoaded) {
               var e = this;
               i(this.slider).on("progress", t);
            }
         }),
         e
      );
   });

/* ===============================================
  #Modernizr
================================================== */

/*! modernizr 3.3.1 (Custom Build) | MIT *
 * https://modernizr.com/download/?-touchevents-setclasses !*/
!(function (e, n, t) {
   function o(e, n) {
      return typeof e === n;
   }
   function s() {
      var e, n, t, s, a, i, r;
      for (var l in c)
         if (c.hasOwnProperty(l)) {
            if (
               ((e = []),
               (n = c[l]),
               n.name &&
                  (e.push(n.name.toLowerCase()),
                  n.options && n.options.aliases && n.options.aliases.length))
            )
               for (t = 0; t < n.options.aliases.length; t++)
                  e.push(n.options.aliases[t].toLowerCase());
            for (
               s = o(n.fn, "function") ? n.fn() : n.fn, a = 0;
               a < e.length;
               a++
            )
               (i = e[a]),
                  (r = i.split(".")),
                  1 === r.length
                     ? (Modernizr[r[0]] = s)
                     : (!Modernizr[r[0]] ||
                          Modernizr[r[0]] instanceof Boolean ||
                          (Modernizr[r[0]] = new Boolean(Modernizr[r[0]])),
                       (Modernizr[r[0]][r[1]] = s)),
                  f.push((s ? "" : "no-") + r.join("-"));
         }
   }
   function a(e) {
      var n = u.className,
         t = Modernizr._config.classPrefix || "";
      if ((p && (n = n.baseVal), Modernizr._config.enableJSClass)) {
         var o = new RegExp("(^|\\s)" + t + "no-js(\\s|$)");
         n = n.replace(o, "$1" + t + "js$2");
      }
      Modernizr._config.enableClasses &&
         ((n += " " + t + e.join(" " + t)),
         p ? (u.className.baseVal = n) : (u.className = n));
   }
   function i() {
      return "function" != typeof n.createElement
         ? n.createElement(arguments[0])
         : p
         ? n.createElementNS.call(n, "http://www.w3.org/2000/svg", arguments[0])
         : n.createElement.apply(n, arguments);
   }
   function r() {
      var e = n.body;
      return e || ((e = i(p ? "svg" : "body")), (e.fake = !0)), e;
   }
   function l(e, t, o, s) {
      var a,
         l,
         f,
         c,
         d = "modernizr",
         p = i("div"),
         h = r();
      if (parseInt(o, 10))
         for (; o--; )
            (f = i("div")), (f.id = s ? s[o] : d + (o + 1)), p.appendChild(f);
      return (
         (a = i("style")),
         (a.type = "text/css"),
         (a.id = "s" + d),
         (h.fake ? h : p).appendChild(a),
         h.appendChild(p),
         a.styleSheet
            ? (a.styleSheet.cssText = e)
            : a.appendChild(n.createTextNode(e)),
         (p.id = d),
         h.fake &&
            ((h.style.background = ""),
            (h.style.overflow = "hidden"),
            (c = u.style.overflow),
            (u.style.overflow = "hidden"),
            u.appendChild(h)),
         (l = t(p, e)),
         h.fake
            ? (h.parentNode.removeChild(h),
              (u.style.overflow = c),
              u.offsetHeight)
            : p.parentNode.removeChild(p),
         !!l
      );
   }
   var f = [],
      c = [],
      d = {
         _version: "3.3.1",
         _config: {
            classPrefix: "",
            enableClasses: !0,
            enableJSClass: !0,
            usePrefixes: !0,
         },
         _q: [],
         on: function (e, n) {
            var t = this;
            setTimeout(function () {
               n(t[e]);
            }, 0);
         },
         addTest: function (e, n, t) {
            c.push({ name: e, fn: n, options: t });
         },
         addAsyncTest: function (e) {
            c.push({ name: null, fn: e });
         },
      },
      Modernizr = function () {};
   (Modernizr.prototype = d), (Modernizr = new Modernizr());
   var u = n.documentElement,
      p = "svg" === u.nodeName.toLowerCase(),
      h = d._config.usePrefixes
         ? " -webkit- -moz- -o- -ms- ".split(" ")
         : ["", ""];
   d._prefixes = h;
   var m = (d.testStyles = l);
   Modernizr.addTest("touchevents", function () {
      var t;
      if (
         "ontouchstart" in e ||
         (e.DocumentTouch && n instanceof DocumentTouch)
      )
         t = !0;
      else {
         var o = [
            "@media (",
            h.join("touch-enabled),("),
            "heartz",
            ")",
            "{#modernizr{top:9px;position:absolute}}",
         ].join("");
         m(o, function (e) {
            t = 9 === e.offsetTop;
         });
      }
      return t;
   }),
      s(),
      a(f),
      delete d.addTest,
      delete d.addAsyncTest;
   for (var v = 0; v < Modernizr._q.length; v++) Modernizr._q[v]();
   e.Modernizr = Modernizr;
})(window, document);

/* ===============================================
  #Headesive
================================================== */

/*!
 * Headhesive.js v1.2.3 - An on-demand sticky header
 * Author: Copyright (c) Mark Goodyear <@markgdyr> <http://markgoodyear.com>
 * Url: http://markgoodyear.com/labs/headhesive
 * License: MIT
 */
!(function (t, e) {
   "function" == typeof define && define.amd
      ? define([], function () {
           return e();
        })
      : "object" == typeof exports
      ? (module.exports = e())
      : (t.Headhesive = e());
})(this, function () {
   "use strict";
   var t = function (e, s) {
         for (var o in s)
            s.hasOwnProperty(o) &&
               (e[o] = "object" == typeof s[o] ? t(e[o], s[o]) : s[o]);
         return e;
      },
      e = function (t, e) {
         var s,
            o,
            i,
            n =
               Date.now ||
               function () {
                  return new Date().getTime();
               },
            l = null,
            c = 0,
            r = function () {
               (c = n()), (l = null), (i = t.apply(s, o)), (s = o = null);
            };
         return function () {
            var f = n(),
               h = e - (f - c);
            return (
               (s = this),
               (o = arguments),
               0 >= h
                  ? (clearTimeout(l),
                    (l = null),
                    (c = f),
                    (i = t.apply(s, o)),
                    (s = o = null))
                  : l || (l = setTimeout(r, h)),
               i
            );
         };
      },
      s = function () {
         return void 0 !== window.pageYOffset
            ? window.pageYOffset
            : (
                 document.documentElement ||
                 document.body.parentNode ||
                 document.body
              ).scrollTop;
      },
      o = function (t, e) {
         for (var s = 0, o = t.offsetHeight; t; )
            (s += t.offsetTop), (t = t.offsetParent);
         return "bottom" === e && (s += o), s;
      },
      i = function (e, s) {
         "querySelector" in document &&
            "addEventListener" in window &&
            ((this.visible = !1),
            (this.options = {
               offset: 300,
               offsetSide: "top",
               classes: {
                  clone: "headhesive",
                  stick: "headhesive--stick",
                  unstick: "headhesive--unstick",
               },
               throttle: 250,
               onInit: function () {},
               onStick: function () {},
               onUnstick: function () {},
               onDestroy: function () {},
            }),
            (this.elem = "string" == typeof e ? document.querySelector(e) : e),
            (this.options = t(this.options, s)),
            this.init());
      };
   return (
      (i.prototype = {
         constructor: i,
         init: function () {
            if (
               ((this.clonedElem = this.elem.cloneNode(!0)),
               (this.clonedElem.className += " " + this.options.classes.clone),
               document.body.insertBefore(
                  this.clonedElem,
                  document.body.firstChild
               ),
               "number" == typeof this.options.offset)
            )
               this.scrollOffset = this.options.offset;
            else {
               if ("string" != typeof this.options.offset)
                  throw new Error("Invalid offset: " + this.options.offset);
               this._setScrollOffset();
            }
            (this._throttleUpdate = e(
               this.update.bind(this),
               this.options.throttle
            )),
               (this._throttleScrollOffset = e(
                  this._setScrollOffset.bind(this),
                  this.options.throttle
               )),
               window.addEventListener("scroll", this._throttleUpdate, !1),
               window.addEventListener(
                  "resize",
                  this._throttleScrollOffset,
                  !1
               ),
               this.options.onInit.call(this);
         },
         _setScrollOffset: function () {
            "string" == typeof this.options.offset &&
               (this.scrollOffset = o(
                  document.querySelector(this.options.offset),
                  this.options.offsetSide
               ));
         },
         destroy: function () {
            document.body.removeChild(this.clonedElem),
               window.removeEventListener("scroll", this._throttleUpdate),
               window.removeEventListener("resize", this._throttleScrollOffset),
               this.options.onDestroy.call(this);
         },
         stick: function () {
            this.visible ||
               ((this.clonedElem.className = this.clonedElem.className.replace(
                  new RegExp(
                     "(^|\\s)*" + this.options.classes.unstick + "(\\s|$)*",
                     "g"
                  ),
                  ""
               )),
               (this.clonedElem.className += " " + this.options.classes.stick),
               (this.visible = !0),
               this.options.onStick.call(this));
         },
         unstick: function () {
            this.visible &&
               ((this.clonedElem.className = this.clonedElem.className.replace(
                  new RegExp(
                     "(^|\\s)*" + this.options.classes.stick + "(\\s|$)*",
                     "g"
                  ),
                  ""
               )),
               (this.clonedElem.className +=
                  " " + this.options.classes.unstick),
               (this.visible = !1),
               this.options.onUnstick.call(this));
         },
         update: function () {
            s() > this.scrollOffset ? this.stick() : this.unstick();
         },
      }),
      i
   );
});

/* ===============================================
  #URL parser
================================================== */

/*! js-url - v2.5.0 - 2017-04-22 */
!(function () {
   var a = (function () {
      function a() {}
      function b(a) {
         return decodeURIComponent(a.replace(/\+/g, " "));
      }
      function c(a, b) {
         var c = a.charAt(0),
            d = b.split(c);
         return c === a
            ? d
            : ((a = parseInt(a.substring(1), 10)),
              d[a < 0 ? d.length + a : a - 1]);
      }
      function d(a, c) {
         for (
            var d = a.charAt(0),
               e = c.split("&"),
               f = [],
               g = {},
               h = [],
               i = a.substring(1),
               j = 0,
               k = e.length;
            j < k;
            j++
         )
            if (
               ((f = e[j].match(/(.*?)=(.*)/)),
               f || (f = [e[j], e[j], ""]),
               "" !== f[1].replace(/\s/g, ""))
            ) {
               if (((f[2] = b(f[2] || "")), i === f[1])) return f[2];
               (h = f[1].match(/(.*)\[([0-9]+)\]/)),
                  h
                     ? ((g[h[1]] = g[h[1]] || []), (g[h[1]][h[2]] = f[2]))
                     : (g[f[1]] = f[2]);
            }
         return d === a ? g : g[i];
      }
      return function (b, e) {
         var f,
            g = {};
         if ("tld?" === b) return a();
         if (((e = e || window.location.toString()), !b)) return e;
         if (((b = b.toString()), (f = e.match(/^mailto:([^\/].+)/))))
            (g.protocol = "mailto"), (g.email = f[1]);
         else {
            if (
               ((f = e.match(/(.*?)\/#\!(.*)/)) && (e = f[1] + f[2]),
               (f = e.match(/(.*?)#(.*)/)) && ((g.hash = f[2]), (e = f[1])),
               g.hash && b.match(/^#/))
            )
               return d(b, g.hash);
            if (
               ((f = e.match(/(.*?)\?(.*)/)) && ((g.query = f[2]), (e = f[1])),
               g.query && b.match(/^\?/))
            )
               return d(b, g.query);
            if (
               ((f = e.match(/(.*?)\:?\/\/(.*)/)) &&
                  ((g.protocol = f[1].toLowerCase()), (e = f[2])),
               (f = e.match(/(.*?)(\/.*)/)) && ((g.path = f[2]), (e = f[1])),
               (g.path = (g.path || "").replace(/^([^\/])/, "/$1")),
               b.match(/^[\-0-9]+$/) && (b = b.replace(/^([^\/])/, "/$1")),
               b.match(/^\//))
            )
               return c(b, g.path.substring(1));
            if (
               ((f = c("/-1", g.path.substring(1))),
               f &&
                  (f = f.match(/(.*?)\.(.*)/)) &&
                  ((g.file = f[0]), (g.filename = f[1]), (g.fileext = f[2])),
               (f = e.match(/(.*)\:([0-9]+)$/)) &&
                  ((g.port = f[2]), (e = f[1])),
               (f = e.match(/(.*?)@(.*)/)) && ((g.auth = f[1]), (e = f[2])),
               g.auth &&
                  ((f = g.auth.match(/(.*)\:(.*)/)),
                  (g.user = f ? f[1] : g.auth),
                  (g.pass = f ? f[2] : void 0)),
               (g.hostname = e.toLowerCase()),
               "." === b.charAt(0))
            )
               return c(b, g.hostname);
            a() &&
               ((f = g.hostname.match(a())),
               f &&
                  ((g.tld = f[3]),
                  (g.domain = f[2] ? f[2] + "." + f[3] : void 0),
                  (g.sub = f[1] || void 0))),
               (g.port = g.port || ("https" === g.protocol ? "443" : "80")),
               (g.protocol =
                  g.protocol || ("443" === g.port ? "https" : "http"));
         }
         return b in g ? g[b] : "{}" === b ? g : void 0;
      };
   })();
   "function" == typeof window.define && window.define.amd
      ? window.define("js-url", [], function () {
           return a;
        })
      : ("undefined" != typeof window.jQuery &&
           window.jQuery.extend({
              url: function (a, b) {
                 return window.url(a, b);
              },
           }),
        (window.url = a));
})();

/* ===============================================
  #Object-fit polyfill
================================================== */

/*! npm.im/object-fit-images 3.2.3 */
var objectFitImages = (function () {
   "use strict";
   function t(t, e) {
      return (
         "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='" +
         t +
         "' height='" +
         e +
         "'%3E%3C/svg%3E"
      );
   }
   function e(t) {
      if (t.srcset && !m && window.picturefill) {
         var e = window.picturefill._;
         (t[e.ns] && t[e.ns].evaled) || e.fillImg(t, { reselect: !0 }),
            t[e.ns].curSrc ||
               ((t[e.ns].supported = !1), e.fillImg(t, { reselect: !0 })),
            (t.currentSrc = t[e.ns].curSrc || t.src);
      }
   }
   function i(t) {
      for (
         var e, i = getComputedStyle(t).fontFamily, r = {};
         null !== (e = l.exec(i));

      )
         r[e[1]] = e[2];
      return r;
   }
   function r(e, i, r) {
      var n = t(i || 1, r || 0);
      p.call(e, "src") !== n && b.call(e, "src", n);
   }
   function n(t, e) {
      t.naturalWidth ? e(t) : setTimeout(n, 100, t, e);
   }
   function c(t) {
      var c = i(t),
         o = t[a];
      if (((c["object-fit"] = c["object-fit"] || "fill"), !o.img)) {
         if ("fill" === c["object-fit"]) return;
         if (!o.skipTest && g && !c["object-position"]) return;
      }
      if (!o.img) {
         (o.img = new Image(t.width, t.height)),
            (o.img.srcset = p.call(t, "data-ofi-srcset") || t.srcset),
            (o.img.src = p.call(t, "data-ofi-src") || t.src),
            b.call(t, "data-ofi-src", t.src),
            t.srcset && b.call(t, "data-ofi-srcset", t.srcset),
            r(t, t.naturalWidth || t.width, t.naturalHeight || t.height),
            t.srcset && (t.srcset = "");
         try {
            s(t);
         } catch (t) {
            window.console && console.warn("https://bit.ly/ofi-old-browser");
         }
      }
      e(o.img),
         (t.style.backgroundImage =
            'url("' +
            (o.img.currentSrc || o.img.src).replace(/"/g, '\\"') +
            '")'),
         (t.style.backgroundPosition = c["object-position"] || "center"),
         (t.style.backgroundRepeat = "no-repeat"),
         (t.style.backgroundOrigin = "content-box"),
         /scale-down/.test(c["object-fit"])
            ? n(o.img, function () {
                 o.img.naturalWidth > t.width || o.img.naturalHeight > t.height
                    ? (t.style.backgroundSize = "contain")
                    : (t.style.backgroundSize = "auto");
              })
            : (t.style.backgroundSize = c["object-fit"]
                 .replace("none", "auto")
                 .replace("fill", "100% 100%")),
         n(o.img, function (e) {
            r(t, e.naturalWidth, e.naturalHeight);
         });
   }
   function s(t) {
      var e = {
         get: function (e) {
            return t[a].img[e || "src"];
         },
         set: function (e, i) {
            return (
               (t[a].img[i || "src"] = e),
               b.call(t, "data-ofi-" + i, e),
               c(t),
               e
            );
         },
      };
      Object.defineProperty(t, "src", e),
         Object.defineProperty(t, "currentSrc", {
            get: function () {
               return e.get("currentSrc");
            },
         }),
         Object.defineProperty(t, "srcset", {
            get: function () {
               return e.get("srcset");
            },
            set: function (t) {
               return e.set(t, "srcset");
            },
         });
   }
   function o(t, e) {
      var i = !h && !t;
      if (((e = e || {}), (t = t || "img"), (f && !e.skipTest) || !d))
         return !1;
      "img" === t
         ? (t = document.getElementsByTagName("img"))
         : "string" == typeof t
         ? (t = document.querySelectorAll(t))
         : "length" in t || (t = [t]);
      for (var r = 0; r < t.length; r++)
         (t[r][a] = t[r][a] || { skipTest: e.skipTest }), c(t[r]);
      i &&
         (document.body.addEventListener(
            "load",
            function (t) {
               "IMG" === t.target.tagName &&
                  o(t.target, { skipTest: e.skipTest });
            },
            !0
         ),
         (h = !0),
         (t = "img")),
         e.watchMQ &&
            window.addEventListener(
               "resize",
               o.bind(null, t, { skipTest: e.skipTest })
            );
   }
   var a = "bfred-it:object-fit-images",
      l = /(object-fit|object-position)\s*:\s*([-\w\s%]+)/g,
      u =
         "undefined" == typeof Image
            ? { style: { "object-position": 1 } }
            : new Image(),
      g = "object-fit" in u.style,
      f = "object-position" in u.style,
      d = "background-size" in u.style,
      m = "string" == typeof u.currentSrc,
      p = u.getAttribute,
      b = u.setAttribute,
      h = !1;
   return (
      (o.supportsObjectFit = g),
      (o.supportsObjectPosition = f),
      (function () {
         function t(t, e) {
            return t[a] && t[a].img && ("src" === e || "srcset" === e)
               ? t[a].img
               : t;
         }
         f ||
            ((HTMLImageElement.prototype.getAttribute = function (e) {
               return p.call(t(this, e), e);
            }),
            (HTMLImageElement.prototype.setAttribute = function (e, i) {
               return b.call(t(this, e), e, String(i));
            }));
      })(),
      o
   );
})();

/* ===============================================
  #Offscreen check
================================================== */

/*
 * jQuery offscreen plugin
 *
 * Copyright Cory LaViska for A Beautiful Site, LLC
 *
 * @license: http://opensource.org/licenses/MIT
 *
 */
(function ($) {
   $.extend($.expr[":"], {
      "off-top": function (el) {
         return $(el).offset().top < $(window).scrollTop();
      },
      "off-right": function (el) {
         return (
            $(el).offset().left + $(el).outerWidth() - $(window).scrollLeft() >
            $(window).width()
         );
      },
      "off-bottom": function (el) {
         return (
            $(el).offset().top + $(el).outerHeight() - $(window).scrollTop() >
            $(window).height()
         );
      },
      "off-left": function (el) {
         return $(el).offset().left < $(window).scrollLeft();
      },
      "off-screen": function (el) {
         return $(el).is(":off-top, :off-right, :off-bottom, :off-left");
      },
   });
})(jQuery);

/* ===============================================
  #Lazyframe
================================================== */
/* Lazyframe */
!(function (e, t) {
   "object" == typeof exports && "undefined" != typeof module
      ? (module.exports = t())
      : "function" == typeof define && define.amd
      ? define(t)
      : (e.lazyframe = t());
})(this, function () {
   "use strict";
   var e =
      Object.assign ||
      function (e) {
         for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var i in n)
               Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
         }
         return e;
      };
   return (function () {
      function t(t) {
         if (
            ((d = e({}, m, arguments.length <= 1 ? void 0 : arguments[1])),
            "string" == typeof t)
         )
            for (var i = document.querySelectorAll(t), o = 0; o < i.length; o++)
               n(i[o]);
         else if (void 0 === t.length) n(t);
         else if (t.length > 1) for (var r = 0; r < t.length; r++) n(t[r]);
         else n(t[0]);
         d.lazyload && a();
      }
      function n(e) {
         var t = this;
         if (
            e instanceof HTMLElement != !1 &&
            !e.classList.contains("lazyframe--loaded")
         ) {
            var n = { el: e, settings: i(e) };
            n.el.addEventListener("click", function () {
               n.el.appendChild(n.iframe);
               var i = e.querySelectorAll("iframe");
               n.settings.onAppend.call(t, i[0]);
            }),
               d.lazyload ? l(n) : u(n, !!n.settings.thumbnail);
         }
      }
      function i(t) {
         var n = Array.prototype.slice
               .apply(t.attributes)
               .filter(function (e) {
                  return "" !== e.value;
               })
               .reduce(function (e, t) {
                  return (
                     (e[
                        0 === t.name.indexOf("data-")
                           ? t.name.split("data-")[1]
                           : t.name
                     ] = t.value),
                     e
                  );
               }, {}),
            i = e({}, d, n, { y: t.offsetTop, parameters: o(n.src) });
         if (i.vendor) {
            var r = i.src.match(p.regex[i.vendor]);
            i.id = p.condition[i.vendor](r);
         }
         return i;
      }
      function o(e) {
         var t = e.split("?");
         if (t[1]) {
            t = t[1];
            return -1 !== t.indexOf("autoplay") ? t : t + "&autoplay=1";
         }
         return "autoplay=1";
      }
      function r(e) {
         return (
            !!e.vendor &&
            (!e.title || !e.thumbnail) &&
            (("youtube" !== e.vendor && "youtube_nocookie" !== e.vendor) ||
               !!e.apikey)
         );
      }
      function u(e) {
         var t = this;
         r(e.settings)
            ? s(e, function (n, i) {
                 if (!n) {
                    var o = i[0],
                       r = i[1];
                    if (
                       (r.settings.title ||
                          (r.settings.title = p.response[
                             r.settings.vendor
                          ].title(o)),
                       !r.settings.thumbnail)
                    ) {
                       var u = p.response[r.settings.vendor].thumbnail(o);
                       (r.settings.thumbnail = u),
                          e.settings.onThumbnailLoad.call(t, u);
                    }
                    l(r, !0);
                 }
              })
            : l(e, !0);
      }
      function s(e, t) {
         var n = p.endpoints[e.settings.vendor](e.settings),
            i = new XMLHttpRequest();
         i.open("GET", n, !0),
            (i.onload = function () {
               if (i.status >= 200 && i.status < 400) {
                  var n = JSON.parse(i.responseText);
                  t(null, [n, e]);
               } else t(!0);
            }),
            (i.onerror = function () {
               t(!0);
            }),
            i.send();
      }
      function a() {
         var e = this,
            t = window.innerHeight,
            n = f.length,
            i = function (t, i) {
               (t.settings.initialized = !0),
                  t.el.classList.add("lazyframe--loaded"),
                  n--,
                  u(t),
                  t.settings.initinview && t.el.click(),
                  t.settings.onLoad.call(e, t);
            };
         f.filter(function (e) {
            return e.settings.y < t;
         }).forEach(i);
         var o = (function (e, t, n) {
               var i = void 0;
               return function () {
                  var o = this,
                     r = arguments,
                     u = function () {
                        (i = null), n || e.apply(o, r);
                     },
                     s = n && !i;
                  clearTimeout(i), (i = setTimeout(u, t)), s && e.apply(o, r);
               };
            })(function () {
               (s = r < window.pageYOffset),
                  (r = window.pageYOffset),
                  s &&
                     f
                        .filter(function (e) {
                           return (
                              e.settings.y < t + r &&
                              !1 === e.settings.initialized
                           );
                        })
                        .forEach(i),
                  0 === n && window.removeEventListener("scroll", o, !1);
            }, d.debounce),
            r = 0,
            s = !1;
         window.addEventListener("scroll", o, !1);
      }
      function l(e, t) {
         if (
            ((e.iframe = c(e.settings)),
            e.settings.thumbnail &&
               t &&
               (e.el.style.backgroundImage =
                  "url(" + e.settings.thumbnail + ")"),
            e.settings.title && 0 === e.el.children.length)
         ) {
            var n = document.createDocumentFragment(),
               i = document.createElement("span");
            (i.className = "lazyframe__title"),
               (i.innerHTML = e.settings.title),
               n.appendChild(i),
               e.el.appendChild(n);
         }
         d.lazyload ||
            (e.el.classList.add("lazyframe--loaded"),
            e.settings.onLoad.call(this, e),
            f.push(e)),
            e.settings.initialized || f.push(e);
      }
      function c(e) {
         var t = document.createDocumentFragment(),
            n = document.createElement("iframe");
         if (
            (e.vendor && (e.src = p.src[e.vendor](e)),
            n.setAttribute("id", "lazyframe-" + e.id),
            n.setAttribute("src", e.src),
            n.setAttribute("frameborder", 0),
            n.setAttribute("allowfullscreen", ""),
            "vine" === e.vendor)
         ) {
            var i = document.createElement("script");
            i.setAttribute(
               "src",
               "https://platform.vine.co/static/scripts/embed.js"
            ),
               t.appendChild(i);
         }
         return t.appendChild(n), t;
      }
      var d = void 0,
         f = [],
         m = {
            vendor: void 0,
            id: void 0,
            src: void 0,
            thumbnail: void 0,
            title: void 0,
            apikey: void 0,
            initialized: !1,
            parameters: void 0,
            y: void 0,
            debounce: 250,
            lazyload: !0,
            initinview: !1,
            onLoad: function (e) {},
            onAppend: function (e) {},
            onThumbnailLoad: function (e) {},
         },
         p = {
            regex: {
               youtube_nocookie: /(?:youtube-nocookie\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=)))([a-zA-Z0-9_-]{6,11})/,
               youtube: /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/,
               vimeo: /vimeo\.com\/(?:video\/)?([0-9]*)(?:\?|)/,
               vine: /vine.co\/v\/(.*)/,
            },
            condition: {
               youtube: function (e) {
                  return !(!e || 11 != e[1].length) && e[1];
               },
               youtube_nocookie: function (e) {
                  return !(!e || 11 != e[1].length) && e[1];
               },
               vimeo: function (e) {
                  return (
                     !!((e && 9 === e[1].length) || 8 === e[1].length) && e[1]
                  );
               },
               vine: function (e) {
                  return !(!e || 11 !== e[1].length) && e[1];
               },
            },
            src: {
               youtube: function (e) {
                  return (
                     "https://www.youtube.com/embed/" +
                     e.id +
                     "/?" +
                     e.parameters
                  );
               },
               youtube_nocookie: function (e) {
                  return (
                     "https://www.youtube-nocookie.com/embed/" +
                     e.id +
                     "/?" +
                     e.parameters
                  );
               },
               vimeo: function (e) {
                  return (
                     "https://player.vimeo.com/video/" +
                     e.id +
                     "/?" +
                     e.parameters
                  );
               },
               vine: function (e) {
                  return "https://vine.co/v/" + e.id + "/embed/simple";
               },
            },
            endpoints: {
               youtube: function (e) {
                  return (
                     "https://www.googleapis.com/youtube/v3/videos?id=" +
                     e.id +
                     "&key=" +
                     e.apikey +
                     "&fields=items(snippet(title,thumbnails))&part=snippet"
                  );
               },
               youtube_nocookie: function (e) {
                  return (
                     "https://www.googleapis.com/youtube/v3/videos?id=" +
                     e.id +
                     "&key=" +
                     e.apikey +
                     "&fields=items(snippet(title,thumbnails))&part=snippet"
                  );
               },
               vimeo: function (e) {
                  return (
                     "https://vimeo.com/api/oembed.json?url=https%3A//vimeo.com/" +
                     e.id
                  );
               },
               vine: function (e) {
                  return (
                     "https://vine.co/oembed.json?url=https%3A%2F%2Fvine.co%2Fv%2F" +
                     e.id
                  );
               },
            },
            response: {
               youtube: {
                  title: function (e) {
                     return e.items[0].snippet.title;
                  },
                  thumbnail: function (e) {
                     var t = e.items[0].snippet.thumbnails;
                     return (
                        t.maxres ||
                        t.standard ||
                        t.high ||
                        t.medium ||
                        t.default
                     ).url;
                  },
               },
               youtube_nocookie: {
                  title: function (e) {
                     return e.items[0].snippet.title;
                  },
                  thumbnail: function (e) {
                     var t = e.items[0].snippet.thumbnails;
                     return (
                        t.maxres ||
                        t.standard ||
                        t.high ||
                        t.medium ||
                        t.default
                     ).url;
                  },
               },
               vimeo: {
                  title: function (e) {
                     return e.title;
                  },
                  thumbnail: function (e) {
                     return e.thumbnail_url;
                  },
               },
               vine: {
                  title: function (e) {
                     return e.title;
                  },
                  thumbnail: function (e) {
                     return e.thumbnail_url;
                  },
               },
            },
         };
      return t;
   })();
});

/* ===============================================
  #Fancybox
================================================== */

// ==================================================
// fancyBox v3.5.6
//
// Licensed GPLv3 for open source use
// or fancyBox Commercial License for commercial use
//
// http://fancyapps.com/fancybox/
// Copyright 2018 fancyApps
//
// ==================================================
!(function (t, e, n, o) {
   "use strict";
   function i(t, e) {
      var o,
         i,
         a,
         s = [],
         r = 0;
      (t && t.isDefaultPrevented()) ||
         (t.preventDefault(),
         (e = e || {}),
         t && t.data && (e = h(t.data.options, e)),
         (o = e.$target || n(t.currentTarget).trigger("blur")),
         ((a = n.fancybox.getInstance()) && a.$trigger && a.$trigger.is(o)) ||
            (e.selector
               ? (s = n(e.selector))
               : ((i = o.attr("data-fancybox") || ""),
                 i
                    ? ((s = t.data ? t.data.items : []),
                      (s = s.length
                         ? s.filter('[data-fancybox="' + i + '"]')
                         : n('[data-fancybox="' + i + '"]')))
                    : (s = [o])),
            (r = n(s).index(o)),
            r < 0 && (r = 0),
            (a = n.fancybox.open(s, e, r)),
            (a.$trigger = o)));
   }
   if (((t.console = t.console || { info: function (t) {} }), n)) {
      if (n.fn.fancybox)
         return void console.info("fancyBox already initialized");
      var a = {
            closeExisting: !1,
            loop: !1,
            gutter: 50,
            keyboard: !0,
            preventCaptionOverlap: !0,
            arrows: !0,
            infobar: !0,
            smallBtn: "auto",
            toolbar: "auto",
            buttons: ["zoom", "slideShow", "thumbs", "close"],
            idleTime: 3,
            protect: !1,
            modal: !1,
            image: { preload: !1 },
            ajax: { settings: { data: { fancybox: !0 } } },
            iframe: {
               tpl:
                  '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" allowfullscreen="allowfullscreen" allow="autoplay; fullscreen" src=""></iframe>',
               preload: !0,
               css: {},
               attr: { scrolling: "auto" },
            },
            video: {
               tpl:
                  '<video class="fancybox-video" controls controlsList="nodownload" poster="{{poster}}"><source src="{{src}}" type="{{format}}" />Sorry, your browser doesn\'t support embedded videos, <a href="{{src}}">download</a> and watch with your favorite video player!</video>',
               format: "",
               autoStart: !0,
            },
            defaultType: "image",
            animationEffect: "zoom",
            animationDuration: 366,
            zoomOpacity: "auto",
            transitionEffect: "fade",
            transitionDuration: 366,
            slideClass: "",
            baseClass: "",
            baseTpl:
               '<div class="fancybox-container" role="dialog" tabindex="-1"><div class="fancybox-bg"></div><div class="fancybox-inner"><div class="fancybox-infobar"><span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span></div><div class="fancybox-toolbar">{{buttons}}</div><div class="fancybox-navigation">{{arrows}}</div><div class="fancybox-stage"></div><div class="fancybox-caption"><div class="fancybox-caption__body"></div></div></div></div>',
            spinnerTpl: '<div class="fancybox-loading"></div>',
            errorTpl: '<div class="fancybox-error"><p>{{ERROR}}</p></div>',
            btnTpl: {
               download:
                  '<a download data-fancybox-download class="fancybox-button fancybox-button--download" title="{{DOWNLOAD}}" href="javascript:;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.62 17.09V19H5.38v-1.91zm-2.97-6.96L17 11.45l-5 4.87-5-4.87 1.36-1.32 2.68 2.64V5h1.92v7.77z"/></svg></a>',
               zoom:
                  '<button data-fancybox-zoom class="fancybox-button fancybox-button--zoom" title="{{ZOOM}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.7 17.3l-3-3a5.9 5.9 0 0 0-.6-7.6 5.9 5.9 0 0 0-8.4 0 5.9 5.9 0 0 0 0 8.4 5.9 5.9 0 0 0 7.7.7l3 3a1 1 0 0 0 1.3 0c.4-.5.4-1 0-1.5zM8.1 13.8a4 4 0 0 1 0-5.7 4 4 0 0 1 5.7 0 4 4 0 0 1 0 5.7 4 4 0 0 1-5.7 0z"/></svg></button>',
               close:
                  '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 10.6L6.6 5.2 5.2 6.6l5.4 5.4-5.4 5.4 1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4-1.4-1.4-5.4 5.4z"/></svg></button>',
               arrowLeft:
                  '<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}"><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.28 15.7l-1.34 1.37L5 12l4.94-5.07 1.34 1.38-2.68 2.72H19v1.94H8.6z"/></svg></div></button>',
               arrowRight:
                  '<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}"><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.4 12.97l-2.68 2.72 1.34 1.38L19 12l-4.94-5.07-1.34 1.38 2.68 2.72H5v1.94z"/></svg></div></button>',
               smallBtn:
                  '<button type="button" data-fancybox-close class="fancybox-button fancybox-close-small" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 24 24"><path d="M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z"/></svg></button>',
            },
            parentEl: "body",
            hideScrollbar: !0,
            autoFocus: !0,
            backFocus: !0,
            trapFocus: !0,
            fullScreen: { autoStart: !1 },
            touch: { vertical: !0, momentum: !0 },
            hash: null,
            media: {},
            slideShow: { autoStart: !1, speed: 3e3 },
            thumbs: {
               autoStart: !1,
               hideOnClose: !0,
               parentEl: ".fancybox-container",
               axis: "y",
            },
            wheel: "auto",
            onInit: n.noop,
            beforeLoad: n.noop,
            afterLoad: n.noop,
            beforeShow: n.noop,
            afterShow: n.noop,
            beforeClose: n.noop,
            afterClose: n.noop,
            onActivate: n.noop,
            onDeactivate: n.noop,
            clickContent: function (t, e) {
               return "image" === t.type && "zoom";
            },
            clickSlide: "close",
            clickOutside: "close",
            dblclickContent: !1,
            dblclickSlide: !1,
            dblclickOutside: !1,
            mobile: {
               preventCaptionOverlap: !1,
               idleTime: !1,
               clickContent: function (t, e) {
                  return "image" === t.type && "toggleControls";
               },
               clickSlide: function (t, e) {
                  return "image" === t.type ? "toggleControls" : "close";
               },
               dblclickContent: function (t, e) {
                  return "image" === t.type && "zoom";
               },
               dblclickSlide: function (t, e) {
                  return "image" === t.type && "zoom";
               },
            },
            lang: "en",
            i18n: {
               en: {
                  CLOSE: "Close",
                  NEXT: "Next",
                  PREV: "Previous",
                  ERROR:
                     "The requested content cannot be loaded. <br/> Please try again later.",
                  PLAY_START: "Start slideshow",
                  PLAY_STOP: "Pause slideshow",
                  FULL_SCREEN: "Full screen",
                  THUMBS: "Thumbnails",
                  DOWNLOAD: "Download",
                  SHARE: "Share",
                  ZOOM: "Zoom",
               },
               de: {
                  CLOSE: "Schlie&szlig;en",
                  NEXT: "Weiter",
                  PREV: "Zur&uuml;ck",
                  ERROR:
                     "Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es sp&auml;ter nochmal.",
                  PLAY_START: "Diaschau starten",
                  PLAY_STOP: "Diaschau beenden",
                  FULL_SCREEN: "Vollbild",
                  THUMBS: "Vorschaubilder",
                  DOWNLOAD: "Herunterladen",
                  SHARE: "Teilen",
                  ZOOM: "Vergr&ouml;&szlig;ern",
               },
            },
         },
         s = n(t),
         r = n(e),
         c = 0,
         l = function (t) {
            return t && t.hasOwnProperty && t instanceof n;
         },
         d = (function () {
            return (
               t.requestAnimationFrame ||
               t.webkitRequestAnimationFrame ||
               t.mozRequestAnimationFrame ||
               t.oRequestAnimationFrame ||
               function (e) {
                  return t.setTimeout(e, 1e3 / 60);
               }
            );
         })(),
         u = (function () {
            return (
               t.cancelAnimationFrame ||
               t.webkitCancelAnimationFrame ||
               t.mozCancelAnimationFrame ||
               t.oCancelAnimationFrame ||
               function (e) {
                  t.clearTimeout(e);
               }
            );
         })(),
         f = (function () {
            var t,
               n = e.createElement("fakeelement"),
               o = {
                  transition: "transitionend",
                  OTransition: "oTransitionEnd",
                  MozTransition: "transitionend",
                  WebkitTransition: "webkitTransitionEnd",
               };
            for (t in o) if (void 0 !== n.style[t]) return o[t];
            return "transitionend";
         })(),
         p = function (t) {
            return t && t.length && t[0].offsetHeight;
         },
         h = function (t, e) {
            var o = n.extend(!0, {}, t, e);
            return (
               n.each(e, function (t, e) {
                  n.isArray(e) && (o[t] = e);
               }),
               o
            );
         },
         g = function (t) {
            var o, i;
            return (
               !(!t || t.ownerDocument !== e) &&
               (n(".fancybox-container").css("pointer-events", "none"),
               (o = {
                  x: t.getBoundingClientRect().left + t.offsetWidth / 2,
                  y: t.getBoundingClientRect().top + t.offsetHeight / 2,
               }),
               (i = e.elementFromPoint(o.x, o.y) === t),
               n(".fancybox-container").css("pointer-events", ""),
               i)
            );
         },
         b = function (t, e, o) {
            var i = this;
            (i.opts = h({ index: o }, n.fancybox.defaults)),
               n.isPlainObject(e) && (i.opts = h(i.opts, e)),
               n.fancybox.isMobile && (i.opts = h(i.opts, i.opts.mobile)),
               (i.id = i.opts.id || ++c),
               (i.currIndex = parseInt(i.opts.index, 10) || 0),
               (i.prevIndex = null),
               (i.prevPos = null),
               (i.currPos = 0),
               (i.firstRun = !0),
               (i.group = []),
               (i.slides = {}),
               i.addContent(t),
               i.group.length && i.init();
         };
      n.extend(b.prototype, {
         init: function () {
            var o,
               i,
               a = this,
               s = a.group[a.currIndex],
               r = s.opts;
            r.closeExisting && n.fancybox.close(!0),
               n("body").addClass("fancybox-active"),
               !n.fancybox.getInstance() &&
                  !1 !== r.hideScrollbar &&
                  !n.fancybox.isMobile &&
                  e.body.scrollHeight > t.innerHeight &&
                  (n("head").append(
                     '<style id="fancybox-style-noscroll" type="text/css">.compensate-for-scrollbar{margin-right:' +
                        (t.innerWidth - e.documentElement.clientWidth) +
                        "px;}</style>"
                  ),
                  n("body").addClass("compensate-for-scrollbar")),
               (i = ""),
               n.each(r.buttons, function (t, e) {
                  i += r.btnTpl[e] || "";
               }),
               (o = n(
                  a.translate(
                     a,
                     r.baseTpl
                        .replace("{{buttons}}", i)
                        .replace(
                           "{{arrows}}",
                           r.btnTpl.arrowLeft + r.btnTpl.arrowRight
                        )
                  )
               )
                  .attr("id", "fancybox-container-" + a.id)
                  .addClass(r.baseClass)
                  .data("FancyBox", a)
                  .appendTo(r.parentEl)),
               (a.$refs = { container: o }),
               [
                  "bg",
                  "inner",
                  "infobar",
                  "toolbar",
                  "stage",
                  "caption",
                  "navigation",
               ].forEach(function (t) {
                  a.$refs[t] = o.find(".fancybox-" + t);
               }),
               a.trigger("onInit"),
               a.activate(),
               a.jumpTo(a.currIndex);
         },
         translate: function (t, e) {
            var n = t.opts.i18n[t.opts.lang] || t.opts.i18n.en;
            return e.replace(/\{\{(\w+)\}\}/g, function (t, e) {
               return void 0 === n[e] ? t : n[e];
            });
         },
         addContent: function (t) {
            var e,
               o = this,
               i = n.makeArray(t);
            n.each(i, function (t, e) {
               var i,
                  a,
                  s,
                  r,
                  c,
                  l = {},
                  d = {};
               n.isPlainObject(e)
                  ? ((l = e), (d = e.opts || e))
                  : "object" === n.type(e) && n(e).length
                  ? ((i = n(e)),
                    (d = i.data() || {}),
                    (d = n.extend(!0, {}, d, d.options)),
                    (d.$orig = i),
                    (l.src = o.opts.src || d.src || i.attr("href")),
                    l.type || l.src || ((l.type = "inline"), (l.src = e)))
                  : (l = { type: "html", src: e + "" }),
                  (l.opts = n.extend(!0, {}, o.opts, d)),
                  n.isArray(d.buttons) && (l.opts.buttons = d.buttons),
                  n.fancybox.isMobile &&
                     l.opts.mobile &&
                     (l.opts = h(l.opts, l.opts.mobile)),
                  (a = l.type || l.opts.type),
                  (r = l.src || ""),
                  !a &&
                     r &&
                     ((s = r.match(/\.(mp4|mov|ogv|webm)((\?|#).*)?$/i))
                        ? ((a = "video"),
                          l.opts.video.format ||
                             (l.opts.video.format =
                                "video/" + ("ogv" === s[1] ? "ogg" : s[1])))
                        : r.match(
                             /(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i
                          )
                        ? (a = "image")
                        : r.match(/\.(pdf)((\?|#).*)?$/i)
                        ? ((a = "iframe"),
                          (l = n.extend(!0, l, {
                             contentType: "pdf",
                             opts: { iframe: { preload: !1 } },
                          })))
                        : "#" === r.charAt(0) && (a = "inline")),
                  a ? (l.type = a) : o.trigger("objectNeedsType", l),
                  l.contentType ||
                     (l.contentType =
                        n.inArray(l.type, ["html", "inline", "ajax"]) > -1
                           ? "html"
                           : l.type),
                  (l.index = o.group.length),
                  "auto" == l.opts.smallBtn &&
                     (l.opts.smallBtn =
                        n.inArray(l.type, ["html", "inline", "ajax"]) > -1),
                  "auto" === l.opts.toolbar &&
                     (l.opts.toolbar = !l.opts.smallBtn),
                  (l.$thumb = l.opts.$thumb || null),
                  l.opts.$trigger &&
                     l.index === o.opts.index &&
                     ((l.$thumb = l.opts.$trigger.find("img:first")),
                     l.$thumb.length && (l.opts.$orig = l.opts.$trigger)),
                  (l.$thumb && l.$thumb.length) ||
                     !l.opts.$orig ||
                     (l.$thumb = l.opts.$orig.find("img:first")),
                  l.$thumb && !l.$thumb.length && (l.$thumb = null),
                  (l.thumb =
                     l.opts.thumb || (l.$thumb ? l.$thumb[0].src : null)),
                  "function" === n.type(l.opts.caption) &&
                     (l.opts.caption = l.opts.caption.apply(e, [o, l])),
                  "function" === n.type(o.opts.caption) &&
                     (l.opts.caption = o.opts.caption.apply(e, [o, l])),
                  l.opts.caption instanceof n ||
                     (l.opts.caption =
                        void 0 === l.opts.caption ? "" : l.opts.caption + ""),
                  "ajax" === l.type &&
                     ((c = r.split(/\s+/, 2)),
                     c.length > 1 &&
                        ((l.src = c.shift()), (l.opts.filter = c.shift()))),
                  l.opts.modal &&
                     (l.opts = n.extend(!0, l.opts, {
                        trapFocus: !0,
                        infobar: 0,
                        toolbar: 0,
                        smallBtn: 0,
                        keyboard: 0,
                        slideShow: 0,
                        fullScreen: 0,
                        thumbs: 0,
                        touch: 0,
                        clickContent: !1,
                        clickSlide: !1,
                        clickOutside: !1,
                        dblclickContent: !1,
                        dblclickSlide: !1,
                        dblclickOutside: !1,
                     })),
                  o.group.push(l);
            }),
               Object.keys(o.slides).length &&
                  (o.updateControls(),
                  (e = o.Thumbs) && e.isActive && (e.create(), e.focus()));
         },
         addEvents: function () {
            var e = this;
            e.removeEvents(),
               e.$refs.container
                  .on("click.fb-close", "[data-fancybox-close]", function (t) {
                     t.stopPropagation(), t.preventDefault(), e.close(t);
                  })
                  .on(
                     "touchstart.fb-prev click.fb-prev",
                     "[data-fancybox-prev]",
                     function (t) {
                        t.stopPropagation(), t.preventDefault(), e.previous();
                     }
                  )
                  .on(
                     "touchstart.fb-next click.fb-next",
                     "[data-fancybox-next]",
                     function (t) {
                        t.stopPropagation(), t.preventDefault(), e.next();
                     }
                  )
                  .on("click.fb", "[data-fancybox-zoom]", function (t) {
                     e[e.isScaledDown() ? "scaleToActual" : "scaleToFit"]();
                  }),
               s.on("orientationchange.fb resize.fb", function (t) {
                  t && t.originalEvent && "resize" === t.originalEvent.type
                     ? (e.requestId && u(e.requestId),
                       (e.requestId = d(function () {
                          e.update(t);
                       })))
                     : (e.current &&
                          "iframe" === e.current.type &&
                          e.$refs.stage.hide(),
                       setTimeout(
                          function () {
                             e.$refs.stage.show(), e.update(t);
                          },
                          n.fancybox.isMobile ? 600 : 250
                       ));
               }),
               r.on("keydown.fb", function (t) {
                  var o = n.fancybox ? n.fancybox.getInstance() : null,
                     i = o.current,
                     a = t.keyCode || t.which;
                  if (9 == a) return void (i.opts.trapFocus && e.focus(t));
                  if (
                     !(
                        !i.opts.keyboard ||
                        t.ctrlKey ||
                        t.altKey ||
                        t.shiftKey ||
                        n(t.target).is("input,textarea,video,audio")
                     )
                  )
                     return 8 === a || 27 === a
                        ? (t.preventDefault(), void e.close(t))
                        : 37 === a || 38 === a
                        ? (t.preventDefault(), void e.previous())
                        : 39 === a || 40 === a
                        ? (t.preventDefault(), void e.next())
                        : void e.trigger("afterKeydown", t, a);
               }),
               e.group[e.currIndex].opts.idleTime &&
                  ((e.idleSecondsCounter = 0),
                  r.on(
                     "mousemove.fb-idle mouseleave.fb-idle mousedown.fb-idle touchstart.fb-idle touchmove.fb-idle scroll.fb-idle keydown.fb-idle",
                     function (t) {
                        (e.idleSecondsCounter = 0),
                           e.isIdle && e.showControls(),
                           (e.isIdle = !1);
                     }
                  ),
                  (e.idleInterval = t.setInterval(function () {
                     ++e.idleSecondsCounter >=
                        e.group[e.currIndex].opts.idleTime &&
                        !e.isDragging &&
                        ((e.isIdle = !0),
                        (e.idleSecondsCounter = 0),
                        e.hideControls());
                  }, 1e3)));
         },
         removeEvents: function () {
            var e = this;
            s.off("orientationchange.fb resize.fb"),
               r.off("keydown.fb .fb-idle"),
               this.$refs.container.off(".fb-close .fb-prev .fb-next"),
               e.idleInterval &&
                  (t.clearInterval(e.idleInterval), (e.idleInterval = null));
         },
         previous: function (t) {
            return this.jumpTo(this.currPos - 1, t);
         },
         next: function (t) {
            return this.jumpTo(this.currPos + 1, t);
         },
         jumpTo: function (t, e) {
            var o,
               i,
               a,
               s,
               r,
               c,
               l,
               d,
               u,
               f = this,
               h = f.group.length;
            if (
               !(f.isDragging || f.isClosing || (f.isAnimating && f.firstRun))
            ) {
               if (
                  ((t = parseInt(t, 10)),
                  !(a = f.current ? f.current.opts.loop : f.opts.loop) &&
                     (t < 0 || t >= h))
               )
                  return !1;
               if (
                  ((o = f.firstRun = !Object.keys(f.slides).length),
                  (r = f.current),
                  (f.prevIndex = f.currIndex),
                  (f.prevPos = f.currPos),
                  (s = f.createSlide(t)),
                  h > 1 &&
                     ((a || s.index < h - 1) && f.createSlide(t + 1),
                     (a || s.index > 0) && f.createSlide(t - 1)),
                  (f.current = s),
                  (f.currIndex = s.index),
                  (f.currPos = s.pos),
                  f.trigger("beforeShow", o),
                  f.updateControls(),
                  (s.forcedDuration = void 0),
                  n.isNumeric(e)
                     ? (s.forcedDuration = e)
                     : (e =
                          s.opts[
                             o ? "animationDuration" : "transitionDuration"
                          ]),
                  (e = parseInt(e, 10)),
                  (i = f.isMoved(s)),
                  s.$slide.addClass("fancybox-slide--current"),
                  o)
               )
                  return (
                     s.opts.animationEffect &&
                        e &&
                        f.$refs.container.css("transition-duration", e + "ms"),
                     f.$refs.container
                        .addClass("fancybox-is-open")
                        .trigger("focus"),
                     f.loadSlide(s),
                     void f.preload("image")
                  );
               (c = n.fancybox.getTranslate(r.$slide)),
                  (l = n.fancybox.getTranslate(f.$refs.stage)),
                  n.each(f.slides, function (t, e) {
                     n.fancybox.stop(e.$slide, !0);
                  }),
                  r.pos !== s.pos && (r.isComplete = !1),
                  r.$slide.removeClass(
                     "fancybox-slide--complete fancybox-slide--current"
                  ),
                  i
                     ? ((u =
                          c.left - (r.pos * c.width + r.pos * r.opts.gutter)),
                       n.each(f.slides, function (t, o) {
                          o.$slide
                             .removeClass("fancybox-animated")
                             .removeClass(function (t, e) {
                                return (
                                   e.match(/(^|\s)fancybox-fx-\S+/g) || []
                                ).join(" ");
                             });
                          var i = o.pos * c.width + o.pos * o.opts.gutter;
                          n.fancybox.setTranslate(o.$slide, {
                             top: 0,
                             left: i - l.left + u,
                          }),
                             o.pos !== s.pos &&
                                o.$slide.addClass(
                                   "fancybox-slide--" +
                                      (o.pos > s.pos ? "next" : "previous")
                                ),
                             p(o.$slide),
                             n.fancybox.animate(
                                o.$slide,
                                {
                                   top: 0,
                                   left:
                                      (o.pos - s.pos) * c.width +
                                      (o.pos - s.pos) * o.opts.gutter,
                                },
                                e,
                                function () {
                                   o.$slide
                                      .css({ transform: "", opacity: "" })
                                      .removeClass(
                                         "fancybox-slide--next fancybox-slide--previous"
                                      ),
                                      o.pos === f.currPos && f.complete();
                                }
                             );
                       }))
                     : e &&
                       s.opts.transitionEffect &&
                       ((d =
                          "fancybox-animated fancybox-fx-" +
                          s.opts.transitionEffect),
                       r.$slide.addClass(
                          "fancybox-slide--" +
                             (r.pos > s.pos ? "next" : "previous")
                       ),
                       n.fancybox.animate(
                          r.$slide,
                          d,
                          e,
                          function () {
                             r.$slide
                                .removeClass(d)
                                .removeClass(
                                   "fancybox-slide--next fancybox-slide--previous"
                                );
                          },
                          !1
                       )),
                  s.isLoaded ? f.revealContent(s) : f.loadSlide(s),
                  f.preload("image");
            }
         },
         createSlide: function (t) {
            var e,
               o,
               i = this;
            return (
               (o = t % i.group.length),
               (o = o < 0 ? i.group.length + o : o),
               !i.slides[t] &&
                  i.group[o] &&
                  ((e = n('<div class="fancybox-slide"></div>').appendTo(
                     i.$refs.stage
                  )),
                  (i.slides[t] = n.extend(!0, {}, i.group[o], {
                     pos: t,
                     $slide: e,
                     isLoaded: !1,
                  })),
                  i.updateSlide(i.slides[t])),
               i.slides[t]
            );
         },
         scaleToActual: function (t, e, o) {
            var i,
               a,
               s,
               r,
               c,
               l = this,
               d = l.current,
               u = d.$content,
               f = n.fancybox.getTranslate(d.$slide).width,
               p = n.fancybox.getTranslate(d.$slide).height,
               h = d.width,
               g = d.height;
            l.isAnimating ||
               l.isMoved() ||
               !u ||
               "image" != d.type ||
               !d.isLoaded ||
               d.hasError ||
               ((l.isAnimating = !0),
               n.fancybox.stop(u),
               (t = void 0 === t ? 0.5 * f : t),
               (e = void 0 === e ? 0.5 * p : e),
               (i = n.fancybox.getTranslate(u)),
               (i.top -= n.fancybox.getTranslate(d.$slide).top),
               (i.left -= n.fancybox.getTranslate(d.$slide).left),
               (r = h / i.width),
               (c = g / i.height),
               (a = 0.5 * f - 0.5 * h),
               (s = 0.5 * p - 0.5 * g),
               h > f &&
                  ((a = i.left * r - (t * r - t)),
                  a > 0 && (a = 0),
                  a < f - h && (a = f - h)),
               g > p &&
                  ((s = i.top * c - (e * c - e)),
                  s > 0 && (s = 0),
                  s < p - g && (s = p - g)),
               l.updateCursor(h, g),
               n.fancybox.animate(
                  u,
                  { top: s, left: a, scaleX: r, scaleY: c },
                  o || 366,
                  function () {
                     l.isAnimating = !1;
                  }
               ),
               l.SlideShow && l.SlideShow.isActive && l.SlideShow.stop());
         },
         scaleToFit: function (t) {
            var e,
               o = this,
               i = o.current,
               a = i.$content;
            o.isAnimating ||
               o.isMoved() ||
               !a ||
               "image" != i.type ||
               !i.isLoaded ||
               i.hasError ||
               ((o.isAnimating = !0),
               n.fancybox.stop(a),
               (e = o.getFitPos(i)),
               o.updateCursor(e.width, e.height),
               n.fancybox.animate(
                  a,
                  {
                     top: e.top,
                     left: e.left,
                     scaleX: e.width / a.width(),
                     scaleY: e.height / a.height(),
                  },
                  t || 366,
                  function () {
                     o.isAnimating = !1;
                  }
               ));
         },
         getFitPos: function (t) {
            var e,
               o,
               i,
               a,
               s = this,
               r = t.$content,
               c = t.$slide,
               l = t.width || t.opts.width,
               d = t.height || t.opts.height,
               u = {};
            return (
               !!(t.isLoaded && r && r.length) &&
               ((e = n.fancybox.getTranslate(s.$refs.stage).width),
               (o = n.fancybox.getTranslate(s.$refs.stage).height),
               (e -=
                  parseFloat(c.css("paddingLeft")) +
                  parseFloat(c.css("paddingRight")) +
                  parseFloat(r.css("marginLeft")) +
                  parseFloat(r.css("marginRight"))),
               (o -=
                  parseFloat(c.css("paddingTop")) +
                  parseFloat(c.css("paddingBottom")) +
                  parseFloat(r.css("marginTop")) +
                  parseFloat(r.css("marginBottom"))),
               (l && d) || ((l = e), (d = o)),
               (i = Math.min(1, e / l, o / d)),
               (l *= i),
               (d *= i),
               l > e - 0.5 && (l = e),
               d > o - 0.5 && (d = o),
               "image" === t.type
                  ? ((u.top =
                       Math.floor(0.5 * (o - d)) +
                       parseFloat(c.css("paddingTop"))),
                    (u.left =
                       Math.floor(0.5 * (e - l)) +
                       parseFloat(c.css("paddingLeft"))))
                  : "video" === t.contentType &&
                    ((a =
                       t.opts.width && t.opts.height
                          ? l / d
                          : t.opts.ratio || 16 / 9),
                    d > l / a ? (d = l / a) : l > d * a && (l = d * a)),
               (u.width = l),
               (u.height = d),
               u)
            );
         },
         update: function (t) {
            var e = this;
            n.each(e.slides, function (n, o) {
               e.updateSlide(o, t);
            });
         },
         updateSlide: function (t, e) {
            var o = this,
               i = t && t.$content,
               a = t.width || t.opts.width,
               s = t.height || t.opts.height,
               r = t.$slide;
            o.adjustCaption(t),
               i &&
                  (a || s || "video" === t.contentType) &&
                  !t.hasError &&
                  (n.fancybox.stop(i),
                  n.fancybox.setTranslate(i, o.getFitPos(t)),
                  t.pos === o.currPos &&
                     ((o.isAnimating = !1), o.updateCursor())),
               o.adjustLayout(t),
               r.length &&
                  (r.trigger("refresh"),
                  t.pos === o.currPos &&
                     o.$refs.toolbar
                        .add(
                           o.$refs.navigation.find(
                              ".fancybox-button--arrow_right"
                           )
                        )
                        .toggleClass(
                           "compensate-for-scrollbar",
                           r.get(0).scrollHeight > r.get(0).clientHeight
                        )),
               o.trigger("onUpdate", t, e);
         },
         centerSlide: function (t) {
            var e = this,
               o = e.current,
               i = o.$slide;
            !e.isClosing &&
               o &&
               (i.siblings().css({ transform: "", opacity: "" }),
               i
                  .parent()
                  .children()
                  .removeClass("fancybox-slide--previous fancybox-slide--next"),
               n.fancybox.animate(
                  i,
                  { top: 0, left: 0, opacity: 1 },
                  void 0 === t ? 0 : t,
                  function () {
                     i.css({ transform: "", opacity: "" }),
                        o.isComplete || e.complete();
                  },
                  !1
               ));
         },
         isMoved: function (t) {
            var e,
               o,
               i = t || this.current;
            return (
               !!i &&
               ((o = n.fancybox.getTranslate(this.$refs.stage)),
               (e = n.fancybox.getTranslate(i.$slide)),
               !i.$slide.hasClass("fancybox-animated") &&
                  (Math.abs(e.top - o.top) > 0.5 ||
                     Math.abs(e.left - o.left) > 0.5))
            );
         },
         updateCursor: function (t, e) {
            var o,
               i,
               a = this,
               s = a.current,
               r = a.$refs.container;
            s &&
               !a.isClosing &&
               a.Guestures &&
               (r.removeClass(
                  "fancybox-is-zoomable fancybox-can-zoomIn fancybox-can-zoomOut fancybox-can-swipe fancybox-can-pan"
               ),
               (o = a.canPan(t, e)),
               (i = !!o || a.isZoomable()),
               r.toggleClass("fancybox-is-zoomable", i),
               n("[data-fancybox-zoom]").prop("disabled", !i),
               o
                  ? r.addClass("fancybox-can-pan")
                  : i &&
                    ("zoom" === s.opts.clickContent ||
                       (n.isFunction(s.opts.clickContent) &&
                          "zoom" == s.opts.clickContent(s)))
                  ? r.addClass("fancybox-can-zoomIn")
                  : s.opts.touch &&
                    (s.opts.touch.vertical || a.group.length > 1) &&
                    "video" !== s.contentType &&
                    r.addClass("fancybox-can-swipe"));
         },
         isZoomable: function () {
            var t,
               e = this,
               n = e.current;
            if (n && !e.isClosing && "image" === n.type && !n.hasError) {
               if (!n.isLoaded) return !0;
               if (
                  (t = e.getFitPos(n)) &&
                  (n.width > t.width || n.height > t.height)
               )
                  return !0;
            }
            return !1;
         },
         isScaledDown: function (t, e) {
            var o = this,
               i = !1,
               a = o.current,
               s = a.$content;
            return (
               void 0 !== t && void 0 !== e
                  ? (i = t < a.width && e < a.height)
                  : s &&
                    ((i = n.fancybox.getTranslate(s)),
                    (i = i.width < a.width && i.height < a.height)),
               i
            );
         },
         canPan: function (t, e) {
            var o = this,
               i = o.current,
               a = null,
               s = !1;
            return (
               "image" === i.type &&
                  (i.isComplete || (t && e)) &&
                  !i.hasError &&
                  ((s = o.getFitPos(i)),
                  void 0 !== t && void 0 !== e
                     ? (a = { width: t, height: e })
                     : i.isComplete &&
                       (a = n.fancybox.getTranslate(i.$content)),
                  a &&
                     s &&
                     (s =
                        Math.abs(a.width - s.width) > 1.5 ||
                        Math.abs(a.height - s.height) > 1.5)),
               s
            );
         },
         loadSlide: function (t) {
            var e,
               o,
               i,
               a = this;
            if (!t.isLoading && !t.isLoaded) {
               if (((t.isLoading = !0), !1 === a.trigger("beforeLoad", t)))
                  return (t.isLoading = !1), !1;
               switch (
                  ((e = t.type),
                  (o = t.$slide),
                  o
                     .off("refresh")
                     .trigger("onReset")
                     .addClass(t.opts.slideClass),
                  e)
               ) {
                  case "image":
                     a.setImage(t);
                     break;
                  case "iframe":
                     a.setIframe(t);
                     break;
                  case "html":
                     a.setContent(t, t.src || t.content);
                     break;
                  case "video":
                     a.setContent(
                        t,
                        t.opts.video.tpl
                           .replace(/\{\{src\}\}/gi, t.src)
                           .replace(
                              "{{format}}",
                              t.opts.videoFormat || t.opts.video.format || ""
                           )
                           .replace("{{poster}}", t.thumb || "")
                     );
                     break;
                  case "inline":
                     n(t.src).length
                        ? a.setContent(t, n(t.src))
                        : a.setError(t);
                     break;
                  case "ajax":
                     a.showLoading(t),
                        (i = n.ajax(
                           n.extend({}, t.opts.ajax.settings, {
                              url: t.src,
                              success: function (e, n) {
                                 "success" === n && a.setContent(t, e);
                              },
                              error: function (e, n) {
                                 e && "abort" !== n && a.setError(t);
                              },
                           })
                        )),
                        o.one("onReset", function () {
                           i.abort();
                        });
                     break;
                  default:
                     a.setError(t);
               }
               return !0;
            }
         },
         setImage: function (t) {
            var o,
               i = this;
            setTimeout(function () {
               var e = t.$image;
               i.isClosing ||
                  !t.isLoading ||
                  (e && e.length && e[0].complete) ||
                  t.hasError ||
                  i.showLoading(t);
            }, 50),
               i.checkSrcset(t),
               (t.$content = n('<div class="fancybox-content"></div>')
                  .addClass("fancybox-is-hidden")
                  .appendTo(t.$slide.addClass("fancybox-slide--image"))),
               !1 !== t.opts.preload &&
                  t.opts.width &&
                  t.opts.height &&
                  t.thumb &&
                  ((t.width = t.opts.width),
                  (t.height = t.opts.height),
                  (o = e.createElement("img")),
                  (o.onerror = function () {
                     n(this).remove(), (t.$ghost = null);
                  }),
                  (o.onload = function () {
                     i.afterLoad(t);
                  }),
                  (t.$ghost = n(o)
                     .addClass("fancybox-image")
                     .appendTo(t.$content)
                     .attr("src", t.thumb))),
               i.setBigImage(t);
         },
         checkSrcset: function (e) {
            var n,
               o,
               i,
               a,
               s = e.opts.srcset || e.opts.image.srcset;
            if (s) {
               (i = t.devicePixelRatio || 1),
                  (a = t.innerWidth * i),
                  (o = s.split(",").map(function (t) {
                     var e = {};
                     return (
                        t
                           .trim()
                           .split(/\s+/)
                           .forEach(function (t, n) {
                              var o = parseInt(
                                 t.substring(0, t.length - 1),
                                 10
                              );
                              if (0 === n) return (e.url = t);
                              o &&
                                 ((e.value = o), (e.postfix = t[t.length - 1]));
                           }),
                        e
                     );
                  })),
                  o.sort(function (t, e) {
                     return t.value - e.value;
                  });
               for (var r = 0; r < o.length; r++) {
                  var c = o[r];
                  if (
                     ("w" === c.postfix && c.value >= a) ||
                     ("x" === c.postfix && c.value >= i)
                  ) {
                     n = c;
                     break;
                  }
               }
               !n && o.length && (n = o[o.length - 1]),
                  n &&
                     ((e.src = n.url),
                     e.width &&
                        e.height &&
                        "w" == n.postfix &&
                        ((e.height = (e.width / e.height) * n.value),
                        (e.width = n.value)),
                     (e.opts.srcset = s));
            }
         },
         setBigImage: function (t) {
            var o = this,
               i = e.createElement("img"),
               a = n(i);
            (t.$image = a
               .one("error", function () {
                  o.setError(t);
               })
               .one("load", function () {
                  var e;
                  t.$ghost ||
                     (o.resolveImageSlideSize(
                        t,
                        this.naturalWidth,
                        this.naturalHeight
                     ),
                     o.afterLoad(t)),
                     o.isClosing ||
                        (t.opts.srcset &&
                           ((e = t.opts.sizes),
                           (e && "auto" !== e) ||
                              (e =
                                 (t.width / t.height > 1 &&
                                 s.width() / s.height() > 1
                                    ? "100"
                                    : Math.round((t.width / t.height) * 100)) +
                                 "vw"),
                           a.attr("sizes", e).attr("srcset", t.opts.srcset)),
                        t.$ghost &&
                           setTimeout(function () {
                              t.$ghost && !o.isClosing && t.$ghost.hide();
                           }, Math.min(300, Math.max(1e3, t.height / 1600))),
                        o.hideLoading(t));
               })
               .addClass("fancybox-image")
               .attr("src", t.src)
               .appendTo(t.$content)),
               (i.complete || "complete" == i.readyState) &&
               a.naturalWidth &&
               a.naturalHeight
                  ? a.trigger("load")
                  : i.error && a.trigger("error");
         },
         resolveImageSlideSize: function (t, e, n) {
            var o = parseInt(t.opts.width, 10),
               i = parseInt(t.opts.height, 10);
            (t.width = e),
               (t.height = n),
               o > 0 && ((t.width = o), (t.height = Math.floor((o * n) / e))),
               i > 0 && ((t.width = Math.floor((i * e) / n)), (t.height = i));
         },
         setIframe: function (t) {
            var e,
               o = this,
               i = t.opts.iframe,
               a = t.$slide;
            (t.$content = n(
               '<div class="fancybox-content' +
                  (i.preload ? " fancybox-is-hidden" : "") +
                  '"></div>'
            )
               .css(i.css)
               .appendTo(a)),
               a.addClass("fancybox-slide--" + t.contentType),
               (t.$iframe = e = n(
                  i.tpl.replace(/\{rnd\}/g, new Date().getTime())
               )
                  .attr(i.attr)
                  .appendTo(t.$content)),
               i.preload
                  ? (o.showLoading(t),
                    e.on("load.fb error.fb", function (e) {
                       (this.isReady = 1),
                          t.$slide.trigger("refresh"),
                          o.afterLoad(t);
                    }),
                    a.on("refresh.fb", function () {
                       var n,
                          o,
                          s = t.$content,
                          r = i.css.width,
                          c = i.css.height;
                       if (1 === e[0].isReady) {
                          try {
                             (n = e.contents()), (o = n.find("body"));
                          } catch (t) {}
                          o &&
                             o.length &&
                             o.children().length &&
                             (a.css("overflow", "visible"),
                             s.css({
                                width: "100%",
                                "max-width": "100%",
                                height: "9999px",
                             }),
                             void 0 === r &&
                                (r = Math.ceil(
                                   Math.max(o[0].clientWidth, o.outerWidth(!0))
                                )),
                             s.css("width", r || "").css("max-width", ""),
                             void 0 === c &&
                                (c = Math.ceil(
                                   Math.max(
                                      o[0].clientHeight,
                                      o.outerHeight(!0)
                                   )
                                )),
                             s.css("height", c || ""),
                             a.css("overflow", "auto")),
                             s.removeClass("fancybox-is-hidden");
                       }
                    }))
                  : o.afterLoad(t),
               e.attr("src", t.src),
               a.one("onReset", function () {
                  try {
                     n(this)
                        .find("iframe")
                        .hide()
                        .unbind()
                        .attr("src", "//about:blank");
                  } catch (t) {}
                  n(this).off("refresh.fb").empty(),
                     (t.isLoaded = !1),
                     (t.isRevealed = !1);
               });
         },
         setContent: function (t, e) {
            var o = this;
            o.isClosing ||
               (o.hideLoading(t),
               t.$content && n.fancybox.stop(t.$content),
               t.$slide.empty(),
               l(e) && e.parent().length
                  ? ((e.hasClass("fancybox-content") ||
                       e.parent().hasClass("fancybox-content")) &&
                       e.parents(".fancybox-slide").trigger("onReset"),
                    (t.$placeholder = n("<div>").hide().insertAfter(e)),
                    e.css("display", "inline-block"))
                  : t.hasError ||
                    ("string" === n.type(e) &&
                       (e = n("<div>").append(n.trim(e)).contents()),
                    t.opts.filter &&
                       (e = n("<div>").html(e).find(t.opts.filter))),
               t.$slide.one("onReset", function () {
                  n(this).find("video,audio").trigger("pause"),
                     t.$placeholder &&
                        (t.$placeholder
                           .after(e.removeClass("fancybox-content").hide())
                           .remove(),
                        (t.$placeholder = null)),
                     t.$smallBtn &&
                        (t.$smallBtn.remove(), (t.$smallBtn = null)),
                     t.hasError ||
                        (n(this).empty(),
                        (t.isLoaded = !1),
                        (t.isRevealed = !1));
               }),
               n(e).appendTo(t.$slide),
               n(e).is("video,audio") &&
                  (n(e).addClass("fancybox-video"),
                  n(e).wrap("<div></div>"),
                  (t.contentType = "video"),
                  (t.opts.width = t.opts.width || n(e).attr("width")),
                  (t.opts.height = t.opts.height || n(e).attr("height"))),
               (t.$content = t.$slide
                  .children()
                  .filter("div,form,main,video,audio,article,.fancybox-content")
                  .first()),
               t.$content.siblings().hide(),
               t.$content.length ||
                  (t.$content = t.$slide
                     .wrapInner("<div></div>")
                     .children()
                     .first()),
               t.$content.addClass("fancybox-content"),
               t.$slide.addClass("fancybox-slide--" + t.contentType),
               o.afterLoad(t));
         },
         setError: function (t) {
            (t.hasError = !0),
               t.$slide
                  .trigger("onReset")
                  .removeClass("fancybox-slide--" + t.contentType)
                  .addClass("fancybox-slide--error"),
               (t.contentType = "html"),
               this.setContent(t, this.translate(t, t.opts.errorTpl)),
               t.pos === this.currPos && (this.isAnimating = !1);
         },
         showLoading: function (t) {
            var e = this;
            (t = t || e.current) &&
               !t.$spinner &&
               (t.$spinner = n(e.translate(e, e.opts.spinnerTpl))
                  .appendTo(t.$slide)
                  .hide()
                  .fadeIn("fast"));
         },
         hideLoading: function (t) {
            var e = this;
            (t = t || e.current) &&
               t.$spinner &&
               (t.$spinner.stop().remove(), delete t.$spinner);
         },
         afterLoad: function (t) {
            var e = this;
            e.isClosing ||
               ((t.isLoading = !1),
               (t.isLoaded = !0),
               e.trigger("afterLoad", t),
               e.hideLoading(t),
               !t.opts.smallBtn ||
                  (t.$smallBtn && t.$smallBtn.length) ||
                  (t.$smallBtn = n(
                     e.translate(t, t.opts.btnTpl.smallBtn)
                  ).appendTo(t.$content)),
               t.opts.protect &&
                  t.$content &&
                  !t.hasError &&
                  (t.$content.on("contextmenu.fb", function (t) {
                     return 2 == t.button && t.preventDefault(), !0;
                  }),
                  "image" === t.type &&
                     n('<div class="fancybox-spaceball"></div>').appendTo(
                        t.$content
                     )),
               e.adjustCaption(t),
               e.adjustLayout(t),
               t.pos === e.currPos && e.updateCursor(),
               e.revealContent(t));
         },
         adjustCaption: function (t) {
            var e,
               n = this,
               o = t || n.current,
               i = o.opts.caption,
               a = o.opts.preventCaptionOverlap,
               s = n.$refs.caption,
               r = !1;
            s.toggleClass("fancybox-caption--separate", a),
               a &&
                  i &&
                  i.length &&
                  (o.pos !== n.currPos
                     ? ((e = s.clone().appendTo(s.parent())),
                       e.children().eq(0).empty().html(i),
                       (r = e.outerHeight(!0)),
                       e.empty().remove())
                     : n.$caption && (r = n.$caption.outerHeight(!0)),
                  o.$slide.css("padding-bottom", r || ""));
         },
         adjustLayout: function (t) {
            var e,
               n,
               o,
               i,
               a = this,
               s = t || a.current;
            s.isLoaded &&
               !0 !== s.opts.disableLayoutFix &&
               (s.$content.css("margin-bottom", ""),
               s.$content.outerHeight() > s.$slide.height() + 0.5 &&
                  ((o = s.$slide[0].style["padding-bottom"]),
                  (i = s.$slide.css("padding-bottom")),
                  parseFloat(i) > 0 &&
                     ((e = s.$slide[0].scrollHeight),
                     s.$slide.css("padding-bottom", 0),
                     Math.abs(e - s.$slide[0].scrollHeight) < 1 && (n = i),
                     s.$slide.css("padding-bottom", o))),
               s.$content.css("margin-bottom", n));
         },
         revealContent: function (t) {
            var e,
               o,
               i,
               a,
               s = this,
               r = t.$slide,
               c = !1,
               l = !1,
               d = s.isMoved(t),
               u = t.isRevealed;
            return (
               (t.isRevealed = !0),
               (e =
                  t.opts[s.firstRun ? "animationEffect" : "transitionEffect"]),
               (i =
                  t.opts[
                     s.firstRun ? "animationDuration" : "transitionDuration"
                  ]),
               (i = parseInt(
                  void 0 === t.forcedDuration ? i : t.forcedDuration,
                  10
               )),
               (!d && t.pos === s.currPos && i) || (e = !1),
               "zoom" === e &&
                  (t.pos === s.currPos &&
                  i &&
                  "image" === t.type &&
                  !t.hasError &&
                  (l = s.getThumbPos(t))
                     ? (c = s.getFitPos(t))
                     : (e = "fade")),
               "zoom" === e
                  ? ((s.isAnimating = !0),
                    (c.scaleX = c.width / l.width),
                    (c.scaleY = c.height / l.height),
                    (a = t.opts.zoomOpacity),
                    "auto" == a &&
                       (a =
                          Math.abs(t.width / t.height - l.width / l.height) >
                          0.1),
                    a && ((l.opacity = 0.1), (c.opacity = 1)),
                    n.fancybox.setTranslate(
                       t.$content.removeClass("fancybox-is-hidden"),
                       l
                    ),
                    p(t.$content),
                    void n.fancybox.animate(t.$content, c, i, function () {
                       (s.isAnimating = !1), s.complete();
                    }))
                  : (s.updateSlide(t),
                    e
                       ? (n.fancybox.stop(r),
                         (o =
                            "fancybox-slide--" +
                            (t.pos >= s.prevPos ? "next" : "previous") +
                            " fancybox-animated fancybox-fx-" +
                            e),
                         r.addClass(o).removeClass("fancybox-slide--current"),
                         t.$content.removeClass("fancybox-is-hidden"),
                         p(r),
                         "image" !== t.type && t.$content.hide().show(0),
                         void n.fancybox.animate(
                            r,
                            "fancybox-slide--current",
                            i,
                            function () {
                               r
                                  .removeClass(o)
                                  .css({ transform: "", opacity: "" }),
                                  t.pos === s.currPos && s.complete();
                            },
                            !0
                         ))
                       : (t.$content.removeClass("fancybox-is-hidden"),
                         u ||
                            !d ||
                            "image" !== t.type ||
                            t.hasError ||
                            t.$content.hide().fadeIn("fast"),
                         void (t.pos === s.currPos && s.complete())))
            );
         },
         getThumbPos: function (t) {
            var e,
               o,
               i,
               a,
               s,
               r = !1,
               c = t.$thumb;
            return (
               !(!c || !g(c[0])) &&
               ((e = n.fancybox.getTranslate(c)),
               (o = parseFloat(c.css("border-top-width") || 0)),
               (i = parseFloat(c.css("border-right-width") || 0)),
               (a = parseFloat(c.css("border-bottom-width") || 0)),
               (s = parseFloat(c.css("border-left-width") || 0)),
               (r = {
                  top: e.top + o,
                  left: e.left + s,
                  width: e.width - i - s,
                  height: e.height - o - a,
                  scaleX: 1,
                  scaleY: 1,
               }),
               e.width > 0 && e.height > 0 && r)
            );
         },
         complete: function () {
            var t,
               e = this,
               o = e.current,
               i = {};
            !e.isMoved() &&
               o.isLoaded &&
               (o.isComplete ||
                  ((o.isComplete = !0),
                  o.$slide.siblings().trigger("onReset"),
                  e.preload("inline"),
                  p(o.$slide),
                  o.$slide.addClass("fancybox-slide--complete"),
                  n.each(e.slides, function (t, o) {
                     o.pos >= e.currPos - 1 && o.pos <= e.currPos + 1
                        ? (i[o.pos] = o)
                        : o &&
                          (n.fancybox.stop(o.$slide), o.$slide.off().remove());
                  }),
                  (e.slides = i)),
               (e.isAnimating = !1),
               e.updateCursor(),
               e.trigger("afterShow"),
               o.opts.video.autoStart &&
                  o.$slide
                     .find("video,audio")
                     .filter(":visible:first")
                     .trigger("play")
                     .one("ended", function () {
                        this.webkitExitFullscreen &&
                           this.webkitExitFullscreen(),
                           e.next();
                     }),
               o.opts.autoFocus &&
                  "html" === o.contentType &&
                  ((t = o.$content.find(
                     "input[autofocus]:enabled:visible:first"
                  )),
                  t.length ? t.trigger("focus") : e.focus(null, !0)),
               o.$slide.scrollTop(0).scrollLeft(0));
         },
         preload: function (t) {
            var e,
               n,
               o = this;
            o.group.length < 2 ||
               ((n = o.slides[o.currPos + 1]),
               (e = o.slides[o.currPos - 1]),
               e && e.type === t && o.loadSlide(e),
               n && n.type === t && o.loadSlide(n));
         },
         focus: function (t, o) {
            var i,
               a,
               s = this,
               r = [
                  "a[href]",
                  "area[href]",
                  'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
                  "select:not([disabled]):not([aria-hidden])",
                  "textarea:not([disabled]):not([aria-hidden])",
                  "button:not([disabled]):not([aria-hidden])",
                  "iframe",
                  "object",
                  "embed",
                  "video",
                  "audio",
                  "[contenteditable]",
                  '[tabindex]:not([tabindex^="-"])',
               ].join(",");
            s.isClosing ||
               ((i =
                  !t && s.current && s.current.isComplete
                     ? s.current.$slide.find(
                          "*:visible" + (o ? ":not(.fancybox-close-small)" : "")
                       )
                     : s.$refs.container.find("*:visible")),
               (i = i.filter(r).filter(function () {
                  return (
                     "hidden" !== n(this).css("visibility") &&
                     !n(this).hasClass("disabled")
                  );
               })),
               i.length
                  ? ((a = i.index(e.activeElement)),
                    t && t.shiftKey
                       ? (a < 0 || 0 == a) &&
                         (t.preventDefault(),
                         i.eq(i.length - 1).trigger("focus"))
                       : (a < 0 || a == i.length - 1) &&
                         (t && t.preventDefault(), i.eq(0).trigger("focus")))
                  : s.$refs.container.trigger("focus"));
         },
         activate: function () {
            var t = this;
            n(".fancybox-container").each(function () {
               var e = n(this).data("FancyBox");
               e &&
                  e.id !== t.id &&
                  !e.isClosing &&
                  (e.trigger("onDeactivate"),
                  e.removeEvents(),
                  (e.isVisible = !1));
            }),
               (t.isVisible = !0),
               (t.current || t.isIdle) && (t.update(), t.updateControls()),
               t.trigger("onActivate"),
               t.addEvents();
         },
         close: function (t, e) {
            var o,
               i,
               a,
               s,
               r,
               c,
               l,
               u = this,
               f = u.current,
               h = function () {
                  u.cleanUp(t);
               };
            return (
               !u.isClosing &&
               ((u.isClosing = !0),
               !1 === u.trigger("beforeClose", t)
                  ? ((u.isClosing = !1),
                    d(function () {
                       u.update();
                    }),
                    !1)
                  : (u.removeEvents(),
                    (a = f.$content),
                    (o = f.opts.animationEffect),
                    (i = n.isNumeric(e) ? e : o ? f.opts.animationDuration : 0),
                    f.$slide.removeClass(
                       "fancybox-slide--complete fancybox-slide--next fancybox-slide--previous fancybox-animated"
                    ),
                    !0 !== t ? n.fancybox.stop(f.$slide) : (o = !1),
                    f.$slide.siblings().trigger("onReset").remove(),
                    i &&
                       u.$refs.container
                          .removeClass("fancybox-is-open")
                          .addClass("fancybox-is-closing")
                          .css("transition-duration", i + "ms"),
                    u.hideLoading(f),
                    u.hideControls(!0),
                    u.updateCursor(),
                    "zoom" !== o ||
                       (a &&
                          i &&
                          "image" === f.type &&
                          !u.isMoved() &&
                          !f.hasError &&
                          (l = u.getThumbPos(f))) ||
                       (o = "fade"),
                    "zoom" === o
                       ? (n.fancybox.stop(a),
                         (s = n.fancybox.getTranslate(a)),
                         (c = {
                            top: s.top,
                            left: s.left,
                            scaleX: s.width / l.width,
                            scaleY: s.height / l.height,
                            width: l.width,
                            height: l.height,
                         }),
                         (r = f.opts.zoomOpacity),
                         "auto" == r &&
                            (r =
                               Math.abs(
                                  f.width / f.height - l.width / l.height
                               ) > 0.1),
                         r && (l.opacity = 0),
                         n.fancybox.setTranslate(a, c),
                         p(a),
                         n.fancybox.animate(a, l, i, h),
                         !0)
                       : (o && i
                            ? n.fancybox.animate(
                                 f.$slide
                                    .addClass("fancybox-slide--previous")
                                    .removeClass("fancybox-slide--current"),
                                 "fancybox-animated fancybox-fx-" + o,
                                 i,
                                 h
                              )
                            : !0 === t
                            ? setTimeout(h, i)
                            : h(),
                         !0)))
            );
         },
         cleanUp: function (e) {
            var o,
               i,
               a,
               s = this,
               r = s.current.opts.$orig;
            s.current.$slide.trigger("onReset"),
               s.$refs.container.empty().remove(),
               s.trigger("afterClose", e),
               s.current.opts.backFocus &&
                  ((r && r.length && r.is(":visible")) || (r = s.$trigger),
                  r &&
                     r.length &&
                     ((i = t.scrollX),
                     (a = t.scrollY),
                     r.trigger("focus"),
                     n("html, body").scrollTop(a).scrollLeft(i))),
               (s.current = null),
               (o = n.fancybox.getInstance()),
               o
                  ? o.activate()
                  : (n("body").removeClass(
                       "fancybox-active compensate-for-scrollbar"
                    ),
                    n("#fancybox-style-noscroll").remove());
         },
         trigger: function (t, e) {
            var o,
               i = Array.prototype.slice.call(arguments, 1),
               a = this,
               s = e && e.opts ? e : a.current;
            if (
               (s ? i.unshift(s) : (s = a),
               i.unshift(a),
               n.isFunction(s.opts[t]) && (o = s.opts[t].apply(s, i)),
               !1 === o)
            )
               return o;
            "afterClose" !== t && a.$refs
               ? a.$refs.container.trigger(t + ".fb", i)
               : r.trigger(t + ".fb", i);
         },
         updateControls: function () {
            var t = this,
               o = t.current,
               i = o.index,
               a = t.$refs.container,
               s = t.$refs.caption,
               r = o.opts.caption;
            o.$slide.trigger("refresh"),
               r && r.length
                  ? ((t.$caption = s), s.children().eq(0).html(r))
                  : (t.$caption = null),
               t.hasHiddenControls || t.isIdle || t.showControls(),
               a.find("[data-fancybox-count]").html(t.group.length),
               a.find("[data-fancybox-index]").html(i + 1),
               a
                  .find("[data-fancybox-prev]")
                  .prop("disabled", !o.opts.loop && i <= 0),
               a
                  .find("[data-fancybox-next]")
                  .prop("disabled", !o.opts.loop && i >= t.group.length - 1),
               "image" === o.type
                  ? a
                       .find("[data-fancybox-zoom]")
                       .show()
                       .end()
                       .find("[data-fancybox-download]")
                       .attr("href", o.opts.image.src || o.src)
                       .show()
                  : o.opts.toolbar &&
                    a
                       .find("[data-fancybox-download],[data-fancybox-zoom]")
                       .hide(),
               n(e.activeElement).is(":hidden,[disabled]") &&
                  t.$refs.container.trigger("focus");
         },
         hideControls: function (t) {
            var e = this,
               n = ["infobar", "toolbar", "nav"];
            (!t && e.current.opts.preventCaptionOverlap) || n.push("caption"),
               this.$refs.container.removeClass(
                  n
                     .map(function (t) {
                        return "fancybox-show-" + t;
                     })
                     .join(" ")
               ),
               (this.hasHiddenControls = !0);
         },
         showControls: function () {
            var t = this,
               e = t.current ? t.current.opts : t.opts,
               n = t.$refs.container;
            (t.hasHiddenControls = !1),
               (t.idleSecondsCounter = 0),
               n
                  .toggleClass(
                     "fancybox-show-toolbar",
                     !(!e.toolbar || !e.buttons)
                  )
                  .toggleClass(
                     "fancybox-show-infobar",
                     !!(e.infobar && t.group.length > 1)
                  )
                  .toggleClass("fancybox-show-caption", !!t.$caption)
                  .toggleClass(
                     "fancybox-show-nav",
                     !!(e.arrows && t.group.length > 1)
                  )
                  .toggleClass("fancybox-is-modal", !!e.modal);
         },
         toggleControls: function () {
            this.hasHiddenControls ? this.showControls() : this.hideControls();
         },
      }),
         (n.fancybox = {
            version: "3.5.6",
            defaults: a,
            getInstance: function (t) {
               var e = n(
                     '.fancybox-container:not(".fancybox-is-closing"):last'
                  ).data("FancyBox"),
                  o = Array.prototype.slice.call(arguments, 1);
               return (
                  e instanceof b &&
                  ("string" === n.type(t)
                     ? e[t].apply(e, o)
                     : "function" === n.type(t) && t.apply(e, o),
                  e)
               );
            },
            open: function (t, e, n) {
               return new b(t, e, n);
            },
            close: function (t) {
               var e = this.getInstance();
               e && (e.close(), !0 === t && this.close(t));
            },
            destroy: function () {
               this.close(!0), r.add("body").off("click.fb-start", "**");
            },
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
               navigator.userAgent
            ),
            use3d: (function () {
               var n = e.createElement("div");
               return (
                  t.getComputedStyle &&
                  t.getComputedStyle(n) &&
                  t.getComputedStyle(n).getPropertyValue("transform") &&
                  !(e.documentMode && e.documentMode < 11)
               );
            })(),
            getTranslate: function (t) {
               var e;
               return (
                  !(!t || !t.length) &&
                  ((e = t[0].getBoundingClientRect()),
                  {
                     top: e.top || 0,
                     left: e.left || 0,
                     width: e.width,
                     height: e.height,
                     opacity: parseFloat(t.css("opacity")),
                  })
               );
            },
            setTranslate: function (t, e) {
               var n = "",
                  o = {};
               if (t && e)
                  return (
                     (void 0 === e.left && void 0 === e.top) ||
                        ((n =
                           (void 0 === e.left ? t.position().left : e.left) +
                           "px, " +
                           (void 0 === e.top ? t.position().top : e.top) +
                           "px"),
                        (n = this.use3d
                           ? "translate3d(" + n + ", 0px)"
                           : "translate(" + n + ")")),
                     void 0 !== e.scaleX && void 0 !== e.scaleY
                        ? (n += " scale(" + e.scaleX + ", " + e.scaleY + ")")
                        : void 0 !== e.scaleX &&
                          (n += " scaleX(" + e.scaleX + ")"),
                     n.length && (o.transform = n),
                     void 0 !== e.opacity && (o.opacity = e.opacity),
                     void 0 !== e.width && (o.width = e.width),
                     void 0 !== e.height && (o.height = e.height),
                     t.css(o)
                  );
            },
            animate: function (t, e, o, i, a) {
               var s,
                  r = this;
               n.isFunction(o) && ((i = o), (o = null)),
                  r.stop(t),
                  (s = r.getTranslate(t)),
                  t.on(f, function (c) {
                     (!c ||
                        !c.originalEvent ||
                        (t.is(c.originalEvent.target) &&
                           "z-index" != c.originalEvent.propertyName)) &&
                        (r.stop(t),
                        n.isNumeric(o) && t.css("transition-duration", ""),
                        n.isPlainObject(e)
                           ? void 0 !== e.scaleX &&
                             void 0 !== e.scaleY &&
                             r.setTranslate(t, {
                                top: e.top,
                                left: e.left,
                                width: s.width * e.scaleX,
                                height: s.height * e.scaleY,
                                scaleX: 1,
                                scaleY: 1,
                             })
                           : !0 !== a && t.removeClass(e),
                        n.isFunction(i) && i(c));
                  }),
                  n.isNumeric(o) && t.css("transition-duration", o + "ms"),
                  n.isPlainObject(e)
                     ? (void 0 !== e.scaleX &&
                          void 0 !== e.scaleY &&
                          (delete e.width,
                          delete e.height,
                          t.parent().hasClass("fancybox-slide--image") &&
                             t.parent().addClass("fancybox-is-scaling")),
                       n.fancybox.setTranslate(t, e))
                     : t.addClass(e),
                  t.data(
                     "timer",
                     setTimeout(function () {
                        t.trigger(f);
                     }, o + 33)
                  );
            },
            stop: function (t, e) {
               t &&
                  t.length &&
                  (clearTimeout(t.data("timer")),
                  e && t.trigger(f),
                  t.off(f).css("transition-duration", ""),
                  t.parent().removeClass("fancybox-is-scaling"));
            },
         }),
         (n.fn.fancybox = function (t) {
            var e;
            return (
               (t = t || {}),
               (e = t.selector || !1),
               e
                  ? n("body")
                       .off("click.fb-start", e)
                       .on("click.fb-start", e, { options: t }, i)
                  : this.off("click.fb-start").on(
                       "click.fb-start",
                       { items: this, options: t },
                       i
                    ),
               this
            );
         }),
         r.on("click.fb-start", "[data-fancybox]", i),
         r.on("click.fb-start", "[data-fancybox-trigger]", function (t) {
            n('[data-fancybox="' + n(this).attr("data-fancybox-trigger") + '"]')
               .eq(n(this).attr("data-fancybox-index") || 0)
               .trigger("click.fb-start", { $trigger: n(this) });
         }),
         (function () {
            var t = null;
            r.on(
               "mousedown mouseup focus blur",
               ".fancybox-button",
               function (e) {
                  switch (e.type) {
                     case "mousedown":
                        t = n(this);
                        break;
                     case "mouseup":
                        t = null;
                        break;
                     case "focusin":
                        n(".fancybox-button").removeClass("fancybox-focus"),
                           n(this).is(t) ||
                              n(this).is("[disabled]") ||
                              n(this).addClass("fancybox-focus");
                        break;
                     case "focusout":
                        n(".fancybox-button").removeClass("fancybox-focus");
                  }
               }
            );
         })();
   }
})(window, document, jQuery),
   (function (t) {
      "use strict";
      var e = {
            youtube: {
               matcher: /(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i,
               params: {
                  autoplay: 1,
                  autohide: 1,
                  fs: 1,
                  rel: 0,
                  hd: 1,
                  wmode: "transparent",
                  enablejsapi: 1,
                  html5: 1,
               },
               paramPlace: 8,
               type: "iframe",
               url: "https://www.youtube-nocookie.com/embed/$4",
               thumb: "https://img.youtube.com/vi/$4/hqdefault.jpg",
            },
            vimeo: {
               matcher: /^.+vimeo.com\/(.*\/)?([\d]+)(.*)?/,
               params: {
                  autoplay: 1,
                  hd: 1,
                  show_title: 1,
                  show_byline: 1,
                  show_portrait: 0,
                  fullscreen: 1,
               },
               paramPlace: 3,
               type: "iframe",
               url: "//player.vimeo.com/video/$2",
            },
            instagram: {
               matcher: /(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,
               type: "image",
               url: "//$1/p/$2/media/?size=l",
            },
            gmap_place: {
               matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i,
               type: "iframe",
               url: function (t) {
                  return (
                     "//maps.google." +
                     t[2] +
                     "/?ll=" +
                     (t[9]
                        ? t[9] +
                          "&z=" +
                          Math.floor(t[10]) +
                          (t[12] ? t[12].replace(/^\//, "&") : "")
                        : t[12] + ""
                     ).replace(/\?/, "&") +
                     "&output=" +
                     (t[12] && t[12].indexOf("layer=c") > 0
                        ? "svembed"
                        : "embed")
                  );
               },
            },
            gmap_search: {
               matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(maps\/search\/)(.*)/i,
               type: "iframe",
               url: function (t) {
                  return (
                     "//maps.google." +
                     t[2] +
                     "/maps?q=" +
                     t[5].replace("query=", "q=").replace("api=1", "") +
                     "&output=embed"
                  );
               },
            },
         },
         n = function (e, n, o) {
            if (e)
               return (
                  (o = o || ""),
                  "object" === t.type(o) && (o = t.param(o, !0)),
                  t.each(n, function (t, n) {
                     e = e.replace("$" + t, n || "");
                  }),
                  o.length && (e += (e.indexOf("?") > 0 ? "&" : "?") + o),
                  e
               );
         };
      t(document).on("objectNeedsType.fb", function (o, i, a) {
         var s,
            r,
            c,
            l,
            d,
            u,
            f,
            p = a.src || "",
            h = !1;
         (s = t.extend(!0, {}, e, a.opts.media)),
            t.each(s, function (e, o) {
               if ((c = p.match(o.matcher))) {
                  if (
                     ((h = o.type),
                     (f = e),
                     (u = {}),
                     o.paramPlace && c[o.paramPlace])
                  ) {
                     (d = c[o.paramPlace]),
                        "?" == d[0] && (d = d.substring(1)),
                        (d = d.split("&"));
                     for (var i = 0; i < d.length; ++i) {
                        var s = d[i].split("=", 2);
                        2 == s.length &&
                           (u[s[0]] = decodeURIComponent(
                              s[1].replace(/\+/g, " ")
                           ));
                     }
                  }
                  return (
                     (l = t.extend(!0, {}, o.params, a.opts[e], u)),
                     (p =
                        "function" === t.type(o.url)
                           ? o.url.call(this, c, l, a)
                           : n(o.url, c, l)),
                     (r =
                        "function" === t.type(o.thumb)
                           ? o.thumb.call(this, c, l, a)
                           : n(o.thumb, c)),
                     "youtube" === e
                        ? (p = p.replace(
                             /&t=((\d+)m)?(\d+)s/,
                             function (t, e, n, o) {
                                return (
                                   "&start=" +
                                   ((n ? 60 * parseInt(n, 10) : 0) +
                                      parseInt(o, 10))
                                );
                             }
                          ))
                        : "vimeo" === e && (p = p.replace("&%23", "#")),
                     !1
                  );
               }
            }),
            h
               ? (a.opts.thumb ||
                    (a.opts.$thumb && a.opts.$thumb.length) ||
                    (a.opts.thumb = r),
                 "iframe" === h &&
                    (a.opts = t.extend(!0, a.opts, {
                       iframe: { preload: !1, attr: { scrolling: "no" } },
                    })),
                 t.extend(a, {
                    type: h,
                    src: p,
                    origSrc: a.src,
                    contentSource: f,
                    contentType:
                       "image" === h
                          ? "image"
                          : "gmap_place" == f || "gmap_search" == f
                          ? "map"
                          : "video",
                 }))
               : p && (a.type = a.opts.defaultType);
      });
      var o = {
         youtube: {
            src: "https://www.youtube.com/iframe_api",
            class: "YT",
            loading: !1,
            loaded: !1,
         },
         vimeo: {
            src: "https://player.vimeo.com/api/player.js",
            class: "Vimeo",
            loading: !1,
            loaded: !1,
         },
         load: function (t) {
            var e,
               n = this;
            if (this[t].loaded)
               return void setTimeout(function () {
                  n.done(t);
               });
            this[t].loading ||
               ((this[t].loading = !0),
               (e = document.createElement("script")),
               (e.type = "text/javascript"),
               (e.src = this[t].src),
               "youtube" === t
                  ? (window.onYouTubeIframeAPIReady = function () {
                       (n[t].loaded = !0), n.done(t);
                    })
                  : (e.onload = function () {
                       (n[t].loaded = !0), n.done(t);
                    }),
               document.body.appendChild(e));
         },
         done: function (e) {
            var n, o, i;
            "youtube" === e && delete window.onYouTubeIframeAPIReady,
               (n = t.fancybox.getInstance()) &&
                  ((o = n.current.$content.find("iframe")),
                  "youtube" === e && void 0 !== YT && YT
                     ? (i = new YT.Player(o.attr("id"), {
                          events: {
                             onStateChange: function (t) {
                                0 == t.data && n.next();
                             },
                          },
                       }))
                     : "vimeo" === e &&
                       void 0 !== Vimeo &&
                       Vimeo &&
                       ((i = new Vimeo.Player(o)),
                       i.on("ended", function () {
                          n.next();
                       })));
         },
      };
      t(document).on({
         "afterShow.fb": function (t, e, n) {
            e.group.length > 1 &&
               ("youtube" === n.contentSource || "vimeo" === n.contentSource) &&
               o.load(n.contentSource);
         },
      });
   })(jQuery),
   (function (t, e, n) {
      "use strict";
      var o = (function () {
            return (
               t.requestAnimationFrame ||
               t.webkitRequestAnimationFrame ||
               t.mozRequestAnimationFrame ||
               t.oRequestAnimationFrame ||
               function (e) {
                  return t.setTimeout(e, 1e3 / 60);
               }
            );
         })(),
         i = (function () {
            return (
               t.cancelAnimationFrame ||
               t.webkitCancelAnimationFrame ||
               t.mozCancelAnimationFrame ||
               t.oCancelAnimationFrame ||
               function (e) {
                  t.clearTimeout(e);
               }
            );
         })(),
         a = function (e) {
            var n = [];
            (e = e.originalEvent || e || t.e),
               (e =
                  e.touches && e.touches.length
                     ? e.touches
                     : e.changedTouches && e.changedTouches.length
                     ? e.changedTouches
                     : [e]);
            for (var o in e)
               e[o].pageX
                  ? n.push({ x: e[o].pageX, y: e[o].pageY })
                  : e[o].clientX &&
                    n.push({ x: e[o].clientX, y: e[o].clientY });
            return n;
         },
         s = function (t, e, n) {
            return e && t
               ? "x" === n
                  ? t.x - e.x
                  : "y" === n
                  ? t.y - e.y
                  : Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2))
               : 0;
         },
         r = function (t) {
            if (
               t.is(
                  'a,area,button,[role="button"],input,label,select,summary,textarea,video,audio,iframe'
               ) ||
               n.isFunction(t.get(0).onclick) ||
               t.data("selectable")
            )
               return !0;
            for (var e = 0, o = t[0].attributes, i = o.length; e < i; e++)
               if ("data-fancybox-" === o[e].nodeName.substr(0, 14)) return !0;
            return !1;
         },
         c = function (e) {
            var n = t.getComputedStyle(e)["overflow-y"],
               o = t.getComputedStyle(e)["overflow-x"],
               i =
                  ("scroll" === n || "auto" === n) &&
                  e.scrollHeight > e.clientHeight,
               a =
                  ("scroll" === o || "auto" === o) &&
                  e.scrollWidth > e.clientWidth;
            return i || a;
         },
         l = function (t) {
            for (var e = !1; ; ) {
               if ((e = c(t.get(0)))) break;
               if (
                  ((t = t.parent()),
                  !t.length || t.hasClass("fancybox-stage") || t.is("body"))
               )
                  break;
            }
            return e;
         },
         d = function (t) {
            var e = this;
            (e.instance = t),
               (e.$bg = t.$refs.bg),
               (e.$stage = t.$refs.stage),
               (e.$container = t.$refs.container),
               e.destroy(),
               e.$container.on(
                  "touchstart.fb.touch mousedown.fb.touch",
                  n.proxy(e, "ontouchstart")
               );
         };
      (d.prototype.destroy = function () {
         var t = this;
         t.$container.off(".fb.touch"),
            n(e).off(".fb.touch"),
            t.requestId && (i(t.requestId), (t.requestId = null)),
            t.tapped && (clearTimeout(t.tapped), (t.tapped = null));
      }),
         (d.prototype.ontouchstart = function (o) {
            var i = this,
               c = n(o.target),
               d = i.instance,
               u = d.current,
               f = u.$slide,
               p = u.$content,
               h = "touchstart" == o.type;
            if (
               (h && i.$container.off("mousedown.fb.touch"),
               (!o.originalEvent || 2 != o.originalEvent.button) &&
                  f.length &&
                  c.length &&
                  !r(c) &&
                  !r(c.parent()) &&
                  (c.is("img") ||
                     !(
                        o.originalEvent.clientX >
                        c[0].clientWidth + c.offset().left
                     )))
            ) {
               if (
                  !u ||
                  d.isAnimating ||
                  u.$slide.hasClass("fancybox-animated")
               )
                  return o.stopPropagation(), void o.preventDefault();
               (i.realPoints = i.startPoints = a(o)),
                  i.startPoints.length &&
                     (u.touch && o.stopPropagation(),
                     (i.startEvent = o),
                     (i.canTap = !0),
                     (i.$target = c),
                     (i.$content = p),
                     (i.opts = u.opts.touch),
                     (i.isPanning = !1),
                     (i.isSwiping = !1),
                     (i.isZooming = !1),
                     (i.isScrolling = !1),
                     (i.canPan = d.canPan()),
                     (i.startTime = new Date().getTime()),
                     (i.distanceX = i.distanceY = i.distance = 0),
                     (i.canvasWidth = Math.round(f[0].clientWidth)),
                     (i.canvasHeight = Math.round(f[0].clientHeight)),
                     (i.contentLastPos = null),
                     (i.contentStartPos = n.fancybox.getTranslate(
                        i.$content
                     ) || { top: 0, left: 0 }),
                     (i.sliderStartPos = n.fancybox.getTranslate(f)),
                     (i.stagePos = n.fancybox.getTranslate(d.$refs.stage)),
                     (i.sliderStartPos.top -= i.stagePos.top),
                     (i.sliderStartPos.left -= i.stagePos.left),
                     (i.contentStartPos.top -= i.stagePos.top),
                     (i.contentStartPos.left -= i.stagePos.left),
                     n(e)
                        .off(".fb.touch")
                        .on(
                           h
                              ? "touchend.fb.touch touchcancel.fb.touch"
                              : "mouseup.fb.touch mouseleave.fb.touch",
                           n.proxy(i, "ontouchend")
                        )
                        .on(
                           h ? "touchmove.fb.touch" : "mousemove.fb.touch",
                           n.proxy(i, "ontouchmove")
                        ),
                     n.fancybox.isMobile &&
                        e.addEventListener("scroll", i.onscroll, !0),
                     (((i.opts || i.canPan) &&
                        (c.is(i.$stage) || i.$stage.find(c).length)) ||
                        (c.is(".fancybox-image") && o.preventDefault(),
                        n.fancybox.isMobile &&
                           c.parents(".fancybox-caption").length)) &&
                        ((i.isScrollable = l(c) || l(c.parent())),
                        (n.fancybox.isMobile && i.isScrollable) ||
                           o.preventDefault(),
                        (1 === i.startPoints.length || u.hasError) &&
                           (i.canPan
                              ? (n.fancybox.stop(i.$content),
                                (i.isPanning = !0))
                              : (i.isSwiping = !0),
                           i.$container.addClass("fancybox-is-grabbing")),
                        2 === i.startPoints.length &&
                           "image" === u.type &&
                           (u.isLoaded || u.$ghost) &&
                           ((i.canTap = !1),
                           (i.isSwiping = !1),
                           (i.isPanning = !1),
                           (i.isZooming = !0),
                           n.fancybox.stop(i.$content),
                           (i.centerPointStartX =
                              0.5 * (i.startPoints[0].x + i.startPoints[1].x) -
                              n(t).scrollLeft()),
                           (i.centerPointStartY =
                              0.5 * (i.startPoints[0].y + i.startPoints[1].y) -
                              n(t).scrollTop()),
                           (i.percentageOfImageAtPinchPointX =
                              (i.centerPointStartX - i.contentStartPos.left) /
                              i.contentStartPos.width),
                           (i.percentageOfImageAtPinchPointY =
                              (i.centerPointStartY - i.contentStartPos.top) /
                              i.contentStartPos.height),
                           (i.startDistanceBetweenFingers = s(
                              i.startPoints[0],
                              i.startPoints[1]
                           )))));
            }
         }),
         (d.prototype.onscroll = function (t) {
            var n = this;
            (n.isScrolling = !0),
               e.removeEventListener("scroll", n.onscroll, !0);
         }),
         (d.prototype.ontouchmove = function (t) {
            var e = this;
            return void 0 !== t.originalEvent.buttons &&
               0 === t.originalEvent.buttons
               ? void e.ontouchend(t)
               : e.isScrolling
               ? void (e.canTap = !1)
               : ((e.newPoints = a(t)),
                 void (
                    (e.opts || e.canPan) &&
                    e.newPoints.length &&
                    e.newPoints.length &&
                    ((e.isSwiping && !0 === e.isSwiping) || t.preventDefault(),
                    (e.distanceX = s(e.newPoints[0], e.startPoints[0], "x")),
                    (e.distanceY = s(e.newPoints[0], e.startPoints[0], "y")),
                    (e.distance = s(e.newPoints[0], e.startPoints[0])),
                    e.distance > 0 &&
                       (e.isSwiping
                          ? e.onSwipe(t)
                          : e.isPanning
                          ? e.onPan()
                          : e.isZooming && e.onZoom()))
                 ));
         }),
         (d.prototype.onSwipe = function (e) {
            var a,
               s = this,
               r = s.instance,
               c = s.isSwiping,
               l = s.sliderStartPos.left || 0;
            if (!0 !== c)
               "x" == c &&
                  (s.distanceX > 0 &&
                  (s.instance.group.length < 2 ||
                     (0 === s.instance.current.index &&
                        !s.instance.current.opts.loop))
                     ? (l += Math.pow(s.distanceX, 0.8))
                     : s.distanceX < 0 &&
                       (s.instance.group.length < 2 ||
                          (s.instance.current.index ===
                             s.instance.group.length - 1 &&
                             !s.instance.current.opts.loop))
                     ? (l -= Math.pow(-s.distanceX, 0.8))
                     : (l += s.distanceX)),
                  (s.sliderLastPos = {
                     top: "x" == c ? 0 : s.sliderStartPos.top + s.distanceY,
                     left: l,
                  }),
                  s.requestId && (i(s.requestId), (s.requestId = null)),
                  (s.requestId = o(function () {
                     s.sliderLastPos &&
                        (n.each(s.instance.slides, function (t, e) {
                           var o = e.pos - s.instance.currPos;
                           n.fancybox.setTranslate(e.$slide, {
                              top: s.sliderLastPos.top,
                              left:
                                 s.sliderLastPos.left +
                                 o * s.canvasWidth +
                                 o * e.opts.gutter,
                           });
                        }),
                        s.$container.addClass("fancybox-is-sliding"));
                  }));
            else if (Math.abs(s.distance) > 10) {
               if (
                  ((s.canTap = !1),
                  r.group.length < 2 && s.opts.vertical
                     ? (s.isSwiping = "y")
                     : r.isDragging ||
                       !1 === s.opts.vertical ||
                       ("auto" === s.opts.vertical && n(t).width() > 800)
                     ? (s.isSwiping = "x")
                     : ((a = Math.abs(
                          (180 * Math.atan2(s.distanceY, s.distanceX)) / Math.PI
                       )),
                       (s.isSwiping = a > 45 && a < 135 ? "y" : "x")),
                  "y" === s.isSwiping && n.fancybox.isMobile && s.isScrollable)
               )
                  return void (s.isScrolling = !0);
               (r.isDragging = s.isSwiping),
                  (s.startPoints = s.newPoints),
                  n.each(r.slides, function (t, e) {
                     var o, i;
                     n.fancybox.stop(e.$slide),
                        (o = n.fancybox.getTranslate(e.$slide)),
                        (i = n.fancybox.getTranslate(r.$refs.stage)),
                        e.$slide
                           .css({
                              transform: "",
                              opacity: "",
                              "transition-duration": "",
                           })
                           .removeClass("fancybox-animated")
                           .removeClass(function (t, e) {
                              return (
                                 e.match(/(^|\s)fancybox-fx-\S+/g) || []
                              ).join(" ");
                           }),
                        e.pos === r.current.pos &&
                           ((s.sliderStartPos.top = o.top - i.top),
                           (s.sliderStartPos.left = o.left - i.left)),
                        n.fancybox.setTranslate(e.$slide, {
                           top: o.top - i.top,
                           left: o.left - i.left,
                        });
                  }),
                  r.SlideShow && r.SlideShow.isActive && r.SlideShow.stop();
            }
         }),
         (d.prototype.onPan = function () {
            var t = this;
            if (
               s(t.newPoints[0], t.realPoints[0]) <
               (n.fancybox.isMobile ? 10 : 5)
            )
               return void (t.startPoints = t.newPoints);
            (t.canTap = !1),
               (t.contentLastPos = t.limitMovement()),
               t.requestId && i(t.requestId),
               (t.requestId = o(function () {
                  n.fancybox.setTranslate(t.$content, t.contentLastPos);
               }));
         }),
         (d.prototype.limitMovement = function () {
            var t,
               e,
               n,
               o,
               i,
               a,
               s = this,
               r = s.canvasWidth,
               c = s.canvasHeight,
               l = s.distanceX,
               d = s.distanceY,
               u = s.contentStartPos,
               f = u.left,
               p = u.top,
               h = u.width,
               g = u.height;
            return (
               (i = h > r ? f + l : f),
               (a = p + d),
               (t = Math.max(0, 0.5 * r - 0.5 * h)),
               (e = Math.max(0, 0.5 * c - 0.5 * g)),
               (n = Math.min(r - h, 0.5 * r - 0.5 * h)),
               (o = Math.min(c - g, 0.5 * c - 0.5 * g)),
               l > 0 && i > t && (i = t - 1 + Math.pow(-t + f + l, 0.8) || 0),
               l < 0 && i < n && (i = n + 1 - Math.pow(n - f - l, 0.8) || 0),
               d > 0 && a > e && (a = e - 1 + Math.pow(-e + p + d, 0.8) || 0),
               d < 0 && a < o && (a = o + 1 - Math.pow(o - p - d, 0.8) || 0),
               { top: a, left: i }
            );
         }),
         (d.prototype.limitPosition = function (t, e, n, o) {
            var i = this,
               a = i.canvasWidth,
               s = i.canvasHeight;
            return (
               n > a
                  ? ((t = t > 0 ? 0 : t), (t = t < a - n ? a - n : t))
                  : (t = Math.max(0, a / 2 - n / 2)),
               o > s
                  ? ((e = e > 0 ? 0 : e), (e = e < s - o ? s - o : e))
                  : (e = Math.max(0, s / 2 - o / 2)),
               { top: e, left: t }
            );
         }),
         (d.prototype.onZoom = function () {
            var e = this,
               a = e.contentStartPos,
               r = a.width,
               c = a.height,
               l = a.left,
               d = a.top,
               u = s(e.newPoints[0], e.newPoints[1]),
               f = u / e.startDistanceBetweenFingers,
               p = Math.floor(r * f),
               h = Math.floor(c * f),
               g = (r - p) * e.percentageOfImageAtPinchPointX,
               b = (c - h) * e.percentageOfImageAtPinchPointY,
               m =
                  (e.newPoints[0].x + e.newPoints[1].x) / 2 - n(t).scrollLeft(),
               v = (e.newPoints[0].y + e.newPoints[1].y) / 2 - n(t).scrollTop(),
               y = m - e.centerPointStartX,
               x = v - e.centerPointStartY,
               w = l + (g + y),
               $ = d + (b + x),
               S = { top: $, left: w, scaleX: f, scaleY: f };
            (e.canTap = !1),
               (e.newWidth = p),
               (e.newHeight = h),
               (e.contentLastPos = S),
               e.requestId && i(e.requestId),
               (e.requestId = o(function () {
                  n.fancybox.setTranslate(e.$content, e.contentLastPos);
               }));
         }),
         (d.prototype.ontouchend = function (t) {
            var o = this,
               s = o.isSwiping,
               r = o.isPanning,
               c = o.isZooming,
               l = o.isScrolling;
            if (
               ((o.endPoints = a(t)),
               (o.dMs = Math.max(new Date().getTime() - o.startTime, 1)),
               o.$container.removeClass("fancybox-is-grabbing"),
               n(e).off(".fb.touch"),
               e.removeEventListener("scroll", o.onscroll, !0),
               o.requestId && (i(o.requestId), (o.requestId = null)),
               (o.isSwiping = !1),
               (o.isPanning = !1),
               (o.isZooming = !1),
               (o.isScrolling = !1),
               (o.instance.isDragging = !1),
               o.canTap)
            )
               return o.onTap(t);
            (o.speed = 100),
               (o.velocityX = (o.distanceX / o.dMs) * 0.5),
               (o.velocityY = (o.distanceY / o.dMs) * 0.5),
               r ? o.endPanning() : c ? o.endZooming() : o.endSwiping(s, l);
         }),
         (d.prototype.endSwiping = function (t, e) {
            var o = this,
               i = !1,
               a = o.instance.group.length,
               s = Math.abs(o.distanceX),
               r = "x" == t && a > 1 && ((o.dMs > 130 && s > 10) || s > 50);
            (o.sliderLastPos = null),
               "y" == t && !e && Math.abs(o.distanceY) > 50
                  ? (n.fancybox.animate(
                       o.instance.current.$slide,
                       {
                          top:
                             o.sliderStartPos.top +
                             o.distanceY +
                             150 * o.velocityY,
                          opacity: 0,
                       },
                       200
                    ),
                    (i = o.instance.close(!0, 250)))
                  : r && o.distanceX > 0
                  ? (i = o.instance.previous(300))
                  : r && o.distanceX < 0 && (i = o.instance.next(300)),
               !1 !== i ||
                  ("x" != t && "y" != t) ||
                  o.instance.centerSlide(200),
               o.$container.removeClass("fancybox-is-sliding");
         }),
         (d.prototype.endPanning = function () {
            var t,
               e,
               o,
               i = this;
            i.contentLastPos &&
               (!1 === i.opts.momentum || i.dMs > 350
                  ? ((t = i.contentLastPos.left), (e = i.contentLastPos.top))
                  : ((t = i.contentLastPos.left + 500 * i.velocityX),
                    (e = i.contentLastPos.top + 500 * i.velocityY)),
               (o = i.limitPosition(
                  t,
                  e,
                  i.contentStartPos.width,
                  i.contentStartPos.height
               )),
               (o.width = i.contentStartPos.width),
               (o.height = i.contentStartPos.height),
               n.fancybox.animate(i.$content, o, 366));
         }),
         (d.prototype.endZooming = function () {
            var t,
               e,
               o,
               i,
               a = this,
               s = a.instance.current,
               r = a.newWidth,
               c = a.newHeight;
            a.contentLastPos &&
               ((t = a.contentLastPos.left),
               (e = a.contentLastPos.top),
               (i = {
                  top: e,
                  left: t,
                  width: r,
                  height: c,
                  scaleX: 1,
                  scaleY: 1,
               }),
               n.fancybox.setTranslate(a.$content, i),
               r < a.canvasWidth && c < a.canvasHeight
                  ? a.instance.scaleToFit(150)
                  : r > s.width || c > s.height
                  ? a.instance.scaleToActual(
                       a.centerPointStartX,
                       a.centerPointStartY,
                       150
                    )
                  : ((o = a.limitPosition(t, e, r, c)),
                    n.fancybox.animate(a.$content, o, 150)));
         }),
         (d.prototype.onTap = function (e) {
            var o,
               i = this,
               s = n(e.target),
               r = i.instance,
               c = r.current,
               l = (e && a(e)) || i.startPoints,
               d = l[0] ? l[0].x - n(t).scrollLeft() - i.stagePos.left : 0,
               u = l[0] ? l[0].y - n(t).scrollTop() - i.stagePos.top : 0,
               f = function (t) {
                  var o = c.opts[t];
                  if ((n.isFunction(o) && (o = o.apply(r, [c, e])), o))
                     switch (o) {
                        case "close":
                           r.close(i.startEvent);
                           break;
                        case "toggleControls":
                           r.toggleControls();
                           break;
                        case "next":
                           r.next();
                           break;
                        case "nextOrClose":
                           r.group.length > 1
                              ? r.next()
                              : r.close(i.startEvent);
                           break;
                        case "zoom":
                           "image" == c.type &&
                              (c.isLoaded || c.$ghost) &&
                              (r.canPan()
                                 ? r.scaleToFit()
                                 : r.isScaledDown()
                                 ? r.scaleToActual(d, u)
                                 : r.group.length < 2 && r.close(i.startEvent));
                     }
               };
            if (
               (!e.originalEvent || 2 != e.originalEvent.button) &&
               (s.is("img") || !(d > s[0].clientWidth + s.offset().left))
            ) {
               if (
                  s.is(
                     ".fancybox-bg,.fancybox-inner,.fancybox-outer,.fancybox-container"
                  )
               )
                  o = "Outside";
               else if (s.is(".fancybox-slide")) o = "Slide";
               else {
                  if (
                     !r.current.$content ||
                     !r.current.$content.find(s).addBack().filter(s).length
                  )
                     return;
                  o = "Content";
               }
               if (i.tapped) {
                  if (
                     (clearTimeout(i.tapped),
                     (i.tapped = null),
                     Math.abs(d - i.tapX) > 50 || Math.abs(u - i.tapY) > 50)
                  )
                     return this;
                  f("dblclick" + o);
               } else
                  (i.tapX = d),
                     (i.tapY = u),
                     c.opts["dblclick" + o] &&
                     c.opts["dblclick" + o] !== c.opts["click" + o]
                        ? (i.tapped = setTimeout(function () {
                             (i.tapped = null), r.isAnimating || f("click" + o);
                          }, 500))
                        : f("click" + o);
               return this;
            }
         }),
         n(e)
            .on("onActivate.fb", function (t, e) {
               e && !e.Guestures && (e.Guestures = new d(e));
            })
            .on("beforeClose.fb", function (t, e) {
               e && e.Guestures && e.Guestures.destroy();
            });
   })(window, document, jQuery),
   (function (t, e) {
      "use strict";
      e.extend(!0, e.fancybox.defaults, {
         btnTpl: {
            slideShow:
               '<button data-fancybox-play class="fancybox-button fancybox-button--play" title="{{PLAY_START}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.5 5.4v13.2l11-6.6z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8.33 5.75h2.2v12.5h-2.2V5.75zm5.15 0h2.2v12.5h-2.2V5.75z"/></svg></button>',
         },
         slideShow: { autoStart: !1, speed: 3e3, progress: !0 },
      });
      var n = function (t) {
         (this.instance = t), this.init();
      };
      e.extend(n.prototype, {
         timer: null,
         isActive: !1,
         $button: null,
         init: function () {
            var t = this,
               n = t.instance,
               o = n.group[n.currIndex].opts.slideShow;
            (t.$button = n.$refs.toolbar
               .find("[data-fancybox-play]")
               .on("click", function () {
                  t.toggle();
               })),
               n.group.length < 2 || !o
                  ? t.$button.hide()
                  : o.progress &&
                    (t.$progress = e(
                       '<div class="fancybox-progress"></div>'
                    ).appendTo(n.$refs.inner));
         },
         set: function (t) {
            var n = this,
               o = n.instance,
               i = o.current;
            i && (!0 === t || i.opts.loop || o.currIndex < o.group.length - 1)
               ? n.isActive &&
                 "video" !== i.contentType &&
                 (n.$progress &&
                    e.fancybox.animate(
                       n.$progress.show(),
                       { scaleX: 1 },
                       i.opts.slideShow.speed
                    ),
                 (n.timer = setTimeout(function () {
                    o.current.opts.loop || o.current.index != o.group.length - 1
                       ? o.next()
                       : o.jumpTo(0);
                 }, i.opts.slideShow.speed)))
               : (n.stop(), (o.idleSecondsCounter = 0), o.showControls());
         },
         clear: function () {
            var t = this;
            clearTimeout(t.timer),
               (t.timer = null),
               t.$progress && t.$progress.removeAttr("style").hide();
         },
         start: function () {
            var t = this,
               e = t.instance.current;
            e &&
               (t.$button
                  .attr(
                     "title",
                     (e.opts.i18n[e.opts.lang] || e.opts.i18n.en).PLAY_STOP
                  )
                  .removeClass("fancybox-button--play")
                  .addClass("fancybox-button--pause"),
               (t.isActive = !0),
               e.isComplete && t.set(!0),
               t.instance.trigger("onSlideShowChange", !0));
         },
         stop: function () {
            var t = this,
               e = t.instance.current;
            t.clear(),
               t.$button
                  .attr(
                     "title",
                     (e.opts.i18n[e.opts.lang] || e.opts.i18n.en).PLAY_START
                  )
                  .removeClass("fancybox-button--pause")
                  .addClass("fancybox-button--play"),
               (t.isActive = !1),
               t.instance.trigger("onSlideShowChange", !1),
               t.$progress && t.$progress.removeAttr("style").hide();
         },
         toggle: function () {
            var t = this;
            t.isActive ? t.stop() : t.start();
         },
      }),
         e(t).on({
            "onInit.fb": function (t, e) {
               e && !e.SlideShow && (e.SlideShow = new n(e));
            },
            "beforeShow.fb": function (t, e, n, o) {
               var i = e && e.SlideShow;
               o
                  ? i && n.opts.slideShow.autoStart && i.start()
                  : i && i.isActive && i.clear();
            },
            "afterShow.fb": function (t, e, n) {
               var o = e && e.SlideShow;
               o && o.isActive && o.set();
            },
            "afterKeydown.fb": function (n, o, i, a, s) {
               var r = o && o.SlideShow;
               !r ||
                  !i.opts.slideShow ||
                  (80 !== s && 32 !== s) ||
                  e(t.activeElement).is("button,a,input") ||
                  (a.preventDefault(), r.toggle());
            },
            "beforeClose.fb onDeactivate.fb": function (t, e) {
               var n = e && e.SlideShow;
               n && n.stop();
            },
         }),
         e(t).on("visibilitychange", function () {
            var n = e.fancybox.getInstance(),
               o = n && n.SlideShow;
            o && o.isActive && (t.hidden ? o.clear() : o.set());
         });
   })(document, jQuery),
   (function (t, e) {
      "use strict";
      var n = (function () {
         for (
            var e = [
                  [
                     "requestFullscreen",
                     "exitFullscreen",
                     "fullscreenElement",
                     "fullscreenEnabled",
                     "fullscreenchange",
                     "fullscreenerror",
                  ],
                  [
                     "webkitRequestFullscreen",
                     "webkitExitFullscreen",
                     "webkitFullscreenElement",
                     "webkitFullscreenEnabled",
                     "webkitfullscreenchange",
                     "webkitfullscreenerror",
                  ],
                  [
                     "webkitRequestFullScreen",
                     "webkitCancelFullScreen",
                     "webkitCurrentFullScreenElement",
                     "webkitCancelFullScreen",
                     "webkitfullscreenchange",
                     "webkitfullscreenerror",
                  ],
                  [
                     "mozRequestFullScreen",
                     "mozCancelFullScreen",
                     "mozFullScreenElement",
                     "mozFullScreenEnabled",
                     "mozfullscreenchange",
                     "mozfullscreenerror",
                  ],
                  [
                     "msRequestFullscreen",
                     "msExitFullscreen",
                     "msFullscreenElement",
                     "msFullscreenEnabled",
                     "MSFullscreenChange",
                     "MSFullscreenError",
                  ],
               ],
               n = {},
               o = 0;
            o < e.length;
            o++
         ) {
            var i = e[o];
            if (i && i[1] in t) {
               for (var a = 0; a < i.length; a++) n[e[0][a]] = i[a];
               return n;
            }
         }
         return !1;
      })();
      if (n) {
         var o = {
            request: function (e) {
               (e = e || t.documentElement),
                  e[n.requestFullscreen](e.ALLOW_KEYBOARD_INPUT);
            },
            exit: function () {
               t[n.exitFullscreen]();
            },
            toggle: function (e) {
               (e = e || t.documentElement),
                  this.isFullscreen() ? this.exit() : this.request(e);
            },
            isFullscreen: function () {
               return Boolean(t[n.fullscreenElement]);
            },
            enabled: function () {
               return Boolean(t[n.fullscreenEnabled]);
            },
         };
         e.extend(!0, e.fancybox.defaults, {
            btnTpl: {
               fullScreen:
                  '<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fsenter" title="{{FULL_SCREEN}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5zm3-8H5v2h5V5H8zm6 11h2v-3h3v-2h-5zm2-11V5h-2v5h5V8z"/></svg></button>',
            },
            fullScreen: { autoStart: !1 },
         }),
            e(t).on(n.fullscreenchange, function () {
               var t = o.isFullscreen(),
                  n = e.fancybox.getInstance();
               n &&
                  (n.current &&
                     "image" === n.current.type &&
                     n.isAnimating &&
                     ((n.isAnimating = !1),
                     n.update(!0, !0, 0),
                     n.isComplete || n.complete()),
                  n.trigger("onFullscreenChange", t),
                  n.$refs.container.toggleClass("fancybox-is-fullscreen", t),
                  n.$refs.toolbar
                     .find("[data-fancybox-fullscreen]")
                     .toggleClass("fancybox-button--fsenter", !t)
                     .toggleClass("fancybox-button--fsexit", t));
            });
      }
      e(t).on({
         "onInit.fb": function (t, e) {
            var i;
            if (!n)
               return void e.$refs.toolbar
                  .find("[data-fancybox-fullscreen]")
                  .remove();
            e && e.group[e.currIndex].opts.fullScreen
               ? ((i = e.$refs.container),
                 i.on(
                    "click.fb-fullscreen",
                    "[data-fancybox-fullscreen]",
                    function (t) {
                       t.stopPropagation(), t.preventDefault(), o.toggle();
                    }
                 ),
                 e.opts.fullScreen &&
                    !0 === e.opts.fullScreen.autoStart &&
                    o.request(),
                 (e.FullScreen = o))
               : e && e.$refs.toolbar.find("[data-fancybox-fullscreen]").hide();
         },
         "afterKeydown.fb": function (t, e, n, o, i) {
            e &&
               e.FullScreen &&
               70 === i &&
               (o.preventDefault(), e.FullScreen.toggle());
         },
         "beforeClose.fb": function (t, e) {
            e &&
               e.FullScreen &&
               e.$refs.container.hasClass("fancybox-is-fullscreen") &&
               o.exit();
         },
      });
   })(document, jQuery),
   (function (t, e) {
      "use strict";
      var n = "fancybox-thumbs";
      e.fancybox.defaults = e.extend(
         !0,
         {
            btnTpl: {
               thumbs:
                  '<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="{{THUMBS}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14.59 14.59h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76H5.65V5.65z"/></svg></button>',
            },
            thumbs: {
               autoStart: !1,
               hideOnClose: !0,
               parentEl: ".fancybox-container",
               axis: "y",
            },
         },
         e.fancybox.defaults
      );
      var o = function (t) {
         this.init(t);
      };
      e.extend(o.prototype, {
         $button: null,
         $grid: null,
         $list: null,
         isVisible: !1,
         isActive: !1,
         init: function (t) {
            var e = this,
               n = t.group,
               o = 0;
            (e.instance = t),
               (e.opts = n[t.currIndex].opts.thumbs),
               (t.Thumbs = e),
               (e.$button = t.$refs.toolbar.find("[data-fancybox-thumbs]"));
            for (
               var i = 0, a = n.length;
               i < a && (n[i].thumb && o++, !(o > 1));
               i++
            );
            o > 1 && e.opts
               ? (e.$button.removeAttr("style").on("click", function () {
                    e.toggle();
                 }),
                 (e.isActive = !0))
               : e.$button.hide();
         },
         create: function () {
            var t,
               o = this,
               i = o.instance,
               a = o.opts.parentEl,
               s = [];
            o.$grid ||
               ((o.$grid = e(
                  '<div class="' + n + " " + n + "-" + o.opts.axis + '"></div>'
               ).appendTo(i.$refs.container.find(a).addBack().filter(a))),
               o.$grid.on("click", "a", function () {
                  i.jumpTo(e(this).attr("data-index"));
               })),
               o.$list ||
                  (o.$list = e('<div class="' + n + '__list">').appendTo(
                     o.$grid
                  )),
               e.each(i.group, function (e, n) {
                  (t = n.thumb),
                     t || "image" !== n.type || (t = n.src),
                     s.push(
                        '<a href="javascript:;" tabindex="0" data-index="' +
                           e +
                           '"' +
                           (t && t.length
                              ? ' style="background-image:url(' + t + ')"'
                              : 'class="fancybox-thumbs-missing"') +
                           "></a>"
                     );
               }),
               (o.$list[0].innerHTML = s.join("")),
               "x" === o.opts.axis &&
                  o.$list.width(
                     parseInt(o.$grid.css("padding-right"), 10) +
                        i.group.length * o.$list.children().eq(0).outerWidth(!0)
                  );
         },
         focus: function (t) {
            var e,
               n,
               o = this,
               i = o.$list,
               a = o.$grid;
            o.instance.current &&
               ((e = i
                  .children()
                  .removeClass("fancybox-thumbs-active")
                  .filter('[data-index="' + o.instance.current.index + '"]')
                  .addClass("fancybox-thumbs-active")),
               (n = e.position()),
               "y" === o.opts.axis &&
               (n.top < 0 || n.top > i.height() - e.outerHeight())
                  ? i.stop().animate({ scrollTop: i.scrollTop() + n.top }, t)
                  : "x" === o.opts.axis &&
                    (n.left < a.scrollLeft() ||
                       n.left >
                          a.scrollLeft() + (a.width() - e.outerWidth())) &&
                    i.parent().stop().animate({ scrollLeft: n.left }, t));
         },
         update: function () {
            var t = this;
            t.instance.$refs.container.toggleClass(
               "fancybox-show-thumbs",
               this.isVisible
            ),
               t.isVisible
                  ? (t.$grid || t.create(),
                    t.instance.trigger("onThumbsShow"),
                    t.focus(0))
                  : t.$grid && t.instance.trigger("onThumbsHide"),
               t.instance.update();
         },
         hide: function () {
            (this.isVisible = !1), this.update();
         },
         show: function () {
            (this.isVisible = !0), this.update();
         },
         toggle: function () {
            (this.isVisible = !this.isVisible), this.update();
         },
      }),
         e(t).on({
            "onInit.fb": function (t, e) {
               var n;
               e &&
                  !e.Thumbs &&
                  ((n = new o(e)),
                  n.isActive && !0 === n.opts.autoStart && n.show());
            },
            "beforeShow.fb": function (t, e, n, o) {
               var i = e && e.Thumbs;
               i && i.isVisible && i.focus(o ? 0 : 250);
            },
            "afterKeydown.fb": function (t, e, n, o, i) {
               var a = e && e.Thumbs;
               a && a.isActive && 71 === i && (o.preventDefault(), a.toggle());
            },
            "beforeClose.fb": function (t, e) {
               var n = e && e.Thumbs;
               n && n.isVisible && !1 !== n.opts.hideOnClose && n.$grid.hide();
            },
         });
   })(document, jQuery),
   (function (t, e) {
      "use strict";
      function n(t) {
         var e = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
            "/": "&#x2F;",
            "`": "&#x60;",
            "=": "&#x3D;",
         };
         return String(t).replace(/[&<>"'`=\/]/g, function (t) {
            return e[t];
         });
      }
      e.extend(!0, e.fancybox.defaults, {
         btnTpl: {
            share:
               '<button data-fancybox-share class="fancybox-button fancybox-button--share" title="{{SHARE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.55 19c1.4-8.4 9.1-9.8 11.9-9.8V5l7 7-7 6.3v-3.5c-2.8 0-10.5 2.1-11.9 4.2z"/></svg></button>',
         },
         share: {
            url: function (t, e) {
               return (
                  (!t.currentHash &&
                     "inline" !== e.type &&
                     "html" !== e.type &&
                     (e.origSrc || e.src)) ||
                  window.location
               );
            },
            tpl:
               '<div class="fancybox-share"><h1>{{SHARE}}</h1><p><a class="fancybox-share__button fancybox-share__button--fb" href="https://www.facebook.com/sharer/sharer.php?u={{url}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m287 456v-299c0-21 6-35 35-35h38v-63c-7-1-29-3-55-3-54 0-91 33-91 94v306m143-254h-205v72h196" /></svg><span>Facebook</span></a><a class="fancybox-share__button fancybox-share__button--tw" href="https://twitter.com/intent/tweet?url={{url}}&text={{descr}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m456 133c-14 7-31 11-47 13 17-10 30-27 37-46-15 10-34 16-52 20-61-62-157-7-141 75-68-3-129-35-169-85-22 37-11 86 26 109-13 0-26-4-37-9 0 39 28 72 65 80-12 3-25 4-37 2 10 33 41 57 77 57-42 30-77 38-122 34 170 111 378-32 359-208 16-11 30-25 41-42z" /></svg><span>Twitter</span></a><a class="fancybox-share__button fancybox-share__button--pt" href="https://www.pinterest.com/pin/create/button/?url={{url}}&description={{descr}}&media={{media}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m265 56c-109 0-164 78-164 144 0 39 15 74 47 87 5 2 10 0 12-5l4-19c2-6 1-8-3-13-9-11-15-25-15-45 0-58 43-110 113-110 62 0 96 38 96 88 0 67-30 122-73 122-24 0-42-19-36-44 6-29 20-60 20-81 0-19-10-35-31-35-25 0-44 26-44 60 0 21 7 36 7 36l-30 125c-8 37-1 83 0 87 0 3 4 4 5 2 2-3 32-39 42-75l16-64c8 16 31 29 56 29 74 0 124-67 124-157 0-69-58-132-146-132z" fill="#fff"/></svg><span>Pinterest</span></a></p><p><input class="fancybox-share__input" type="text" value="{{url_raw}}" onclick="select()" /></p></div>',
         },
      }),
         e(t).on("click", "[data-fancybox-share]", function () {
            var t,
               o,
               i = e.fancybox.getInstance(),
               a = i.current || null;
            a &&
               ("function" === e.type(a.opts.share.url) &&
                  (t = a.opts.share.url.apply(a, [i, a])),
               (o = a.opts.share.tpl
                  .replace(
                     /\{\{media\}\}/g,
                     "image" === a.type ? encodeURIComponent(a.src) : ""
                  )
                  .replace(/\{\{url\}\}/g, encodeURIComponent(t))
                  .replace(/\{\{url_raw\}\}/g, n(t))
                  .replace(
                     /\{\{descr\}\}/g,
                     i.$caption ? encodeURIComponent(i.$caption.text()) : ""
                  )),
               e.fancybox.open({
                  src: i.translate(i, o),
                  type: "html",
                  opts: {
                     touch: !1,
                     animationEffect: !1,
                     afterLoad: function (t, e) {
                        i.$refs.container.one("beforeClose.fb", function () {
                           t.close(null, 0);
                        }),
                           e.$content
                              .find(".fancybox-share__button")
                              .click(function () {
                                 return (
                                    window.open(
                                       this.href,
                                       "Share",
                                       "width=550, height=450"
                                    ),
                                    !1
                                 );
                              });
                     },
                     mobile: { autoFocus: !1 },
                  },
               }));
         });
   })(document, jQuery),
   (function (t, e, n) {
      "use strict";
      function o() {
         var e = t.location.hash.substr(1),
            n = e.split("-"),
            o =
               n.length > 1 && /^\+?\d+$/.test(n[n.length - 1])
                  ? parseInt(n.pop(-1), 10) || 1
                  : 1,
            i = n.join("-");
         return { hash: e, index: o < 1 ? 1 : o, gallery: i };
      }
      function i(t) {
         "" !== t.gallery &&
            n("[data-fancybox='" + n.escapeSelector(t.gallery) + "']")
               .eq(t.index - 1)
               .focus()
               .trigger("click.fb-start");
      }
      function a(t) {
         var e, n;
         return (
            !!t &&
            ((e = t.current ? t.current.opts : t.opts),
            "" !==
               (n =
                  e.hash ||
                  (e.$orig
                     ? e.$orig.data("fancybox") ||
                       e.$orig.data("fancybox-trigger")
                     : "")) && n)
         );
      }
      n.escapeSelector ||
         (n.escapeSelector = function (t) {
            return (t + "").replace(
               /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g,
               function (t, e) {
                  return e
                     ? "\0" === t
                        ? "ï¿½"
                        : t.slice(0, -1) +
                          "\\" +
                          t.charCodeAt(t.length - 1).toString(16) +
                          " "
                     : "\\" + t;
               }
            );
         }),
         n(function () {
            !1 !== n.fancybox.defaults.hash &&
               (n(e).on({
                  "onInit.fb": function (t, e) {
                     var n, i;
                     !1 !== e.group[e.currIndex].opts.hash &&
                        ((n = o()),
                        (i = a(e)) &&
                           n.gallery &&
                           i == n.gallery &&
                           (e.currIndex = n.index - 1));
                  },
                  "beforeShow.fb": function (n, o, i, s) {
                     var r;
                     i &&
                        !1 !== i.opts.hash &&
                        (r = a(o)) &&
                        ((o.currentHash =
                           r + (o.group.length > 1 ? "-" + (i.index + 1) : "")),
                        t.location.hash !== "#" + o.currentHash &&
                           (s && !o.origHash && (o.origHash = t.location.hash),
                           o.hashTimer && clearTimeout(o.hashTimer),
                           (o.hashTimer = setTimeout(function () {
                              "replaceState" in t.history
                                 ? (t.history[s ? "pushState" : "replaceState"](
                                      {},
                                      e.title,
                                      t.location.pathname +
                                         t.location.search +
                                         "#" +
                                         o.currentHash
                                   ),
                                   s && (o.hasCreatedHistory = !0))
                                 : (t.location.hash = o.currentHash),
                                 (o.hashTimer = null);
                           }, 300))));
                  },
                  "beforeClose.fb": function (n, o, i) {
                     i &&
                        !1 !== i.opts.hash &&
                        (clearTimeout(o.hashTimer),
                        o.currentHash && o.hasCreatedHistory
                           ? t.history.back()
                           : o.currentHash &&
                             ("replaceState" in t.history
                                ? t.history.replaceState(
                                     {},
                                     e.title,
                                     t.location.pathname +
                                        t.location.search +
                                        (o.origHash || "")
                                  )
                                : (t.location.hash = o.origHash)),
                        (o.currentHash = null));
                  },
               }),
               n(t).on("hashchange.fb", function () {
                  var t = o(),
                     e = null;
                  n.each(
                     n(".fancybox-container").get().reverse(),
                     function (t, o) {
                        var i = n(o).data("FancyBox");
                        if (i && i.currentHash) return (e = i), !1;
                     }
                  ),
                     e
                        ? e.currentHash === t.gallery + "-" + t.index ||
                          (1 === t.index && e.currentHash == t.gallery) ||
                          ((e.currentHash = null), e.close())
                        : "" !== t.gallery && i(t);
               }),
               setTimeout(function () {
                  n.fancybox.getInstance() || i(o());
               }, 50));
         });
   })(window, document, jQuery),
   (function (t, e) {
      "use strict";
      var n = new Date().getTime();
      e(t).on({
         "onInit.fb": function (t, e, o) {
            e.$refs.stage.on(
               "mousewheel DOMMouseScroll wheel MozMousePixelScroll",
               function (t) {
                  var o = e.current,
                     i = new Date().getTime();
                  e.group.length < 2 ||
                     !1 === o.opts.wheel ||
                     ("auto" === o.opts.wheel && "image" !== o.type) ||
                     (t.preventDefault(),
                     t.stopPropagation(),
                     o.$slide.hasClass("fancybox-animated") ||
                        ((t = t.originalEvent || t),
                        i - n < 250 ||
                           ((n = i),
                           e[
                              (-t.deltaY ||
                                 -t.deltaX ||
                                 t.wheelDelta ||
                                 -t.detail) < 0
                                 ? "next"
                                 : "previous"
                           ]())));
               }
            );
         },
      });
   })(document, jQuery);

// plyr
// A simple HTML5, YouTube and Vimeo player
"object" == typeof navigator &&
   (function (e, t) {
      "object" == typeof exports && "undefined" != typeof module
         ? (module.exports = t())
         : "function" == typeof define && define.amd
         ? define("Plyr", t)
         : ((e = e || self).Plyr = t());
   })(this, function () {
      "use strict";
      !(function () {
         if ("undefined" != typeof window)
            try {
               var e = new window.CustomEvent("test", { cancelable: !0 });
               if ((e.preventDefault(), !0 !== e.defaultPrevented))
                  throw new Error("Could not prevent default");
            } catch (e) {
               var t = function (e, t) {
                  var n, i;
                  return (
                     ((t = t || {}).bubbles = !!t.bubbles),
                     (t.cancelable = !!t.cancelable),
                     (n = document.createEvent("CustomEvent")).initCustomEvent(
                        e,
                        t.bubbles,
                        t.cancelable,
                        t.detail
                     ),
                     (i = n.preventDefault),
                     (n.preventDefault = function () {
                        i.call(this);
                        try {
                           Object.defineProperty(this, "defaultPrevented", {
                              get: function () {
                                 return !0;
                              },
                           });
                        } catch (e) {
                           this.defaultPrevented = !0;
                        }
                     }),
                     n
                  );
               };
               (t.prototype = window.Event.prototype), (window.CustomEvent = t);
            }
      })();
      var e =
         "undefined" != typeof globalThis
            ? globalThis
            : "undefined" != typeof window
            ? window
            : "undefined" != typeof global
            ? global
            : "undefined" != typeof self
            ? self
            : {};
      function t(e, t) {
         return e((t = { exports: {} }), t.exports), t.exports;
      }
      var n = function (e) {
            return e && e.Math == Math && e;
         },
         i =
            n("object" == typeof globalThis && globalThis) ||
            n("object" == typeof window && window) ||
            n("object" == typeof self && self) ||
            n("object" == typeof e && e) ||
            Function("return this")(),
         r = function (e) {
            try {
               return !!e();
            } catch (e) {
               return !0;
            }
         },
         a = !r(function () {
            return (
               7 !=
               Object.defineProperty({}, 1, {
                  get: function () {
                     return 7;
                  },
               })[1]
            );
         }),
         o = {}.propertyIsEnumerable,
         s = Object.getOwnPropertyDescriptor,
         l = {
            f:
               s && !o.call({ 1: 2 }, 1)
                  ? function (e) {
                       var t = s(this, e);
                       return !!t && t.enumerable;
                    }
                  : o,
         },
         c = function (e, t) {
            return {
               enumerable: !(1 & e),
               configurable: !(2 & e),
               writable: !(4 & e),
               value: t,
            };
         },
         u = {}.toString,
         h = function (e) {
            return u.call(e).slice(8, -1);
         },
         f = "".split,
         d = r(function () {
            return !Object("z").propertyIsEnumerable(0);
         })
            ? function (e) {
                 return "String" == h(e) ? f.call(e, "") : Object(e);
              }
            : Object,
         p = function (e) {
            if (null == e) throw TypeError("Can't call method on " + e);
            return e;
         },
         m = function (e) {
            return d(p(e));
         },
         g = function (e) {
            return "object" == typeof e ? null !== e : "function" == typeof e;
         },
         v = function (e, t) {
            if (!g(e)) return e;
            var n, i;
            if (
               t &&
               "function" == typeof (n = e.toString) &&
               !g((i = n.call(e)))
            )
               return i;
            if ("function" == typeof (n = e.valueOf) && !g((i = n.call(e))))
               return i;
            if (
               !t &&
               "function" == typeof (n = e.toString) &&
               !g((i = n.call(e)))
            )
               return i;
            throw TypeError("Can't convert object to primitive value");
         },
         y = {}.hasOwnProperty,
         b = function (e, t) {
            return y.call(e, t);
         },
         w = i.document,
         k = g(w) && g(w.createElement),
         T = function (e) {
            return k ? w.createElement(e) : {};
         },
         S =
            !a &&
            !r(function () {
               return (
                  7 !=
                  Object.defineProperty(T("div"), "a", {
                     get: function () {
                        return 7;
                     },
                  }).a
               );
            }),
         E = Object.getOwnPropertyDescriptor,
         A = {
            f: a
               ? E
               : function (e, t) {
                    if (((e = m(e)), (t = v(t, !0)), S))
                       try {
                          return E(e, t);
                       } catch (e) {}
                    if (b(e, t)) return c(!l.f.call(e, t), e[t]);
                 },
         },
         x = function (e) {
            if (!g(e)) throw TypeError(String(e) + " is not an object");
            return e;
         },
         C = Object.defineProperty,
         P = {
            f: a
               ? C
               : function (e, t, n) {
                    if ((x(e), (t = v(t, !0)), x(n), S))
                       try {
                          return C(e, t, n);
                       } catch (e) {}
                    if ("get" in n || "set" in n)
                       throw TypeError("Accessors not supported");
                    return "value" in n && (e[t] = n.value), e;
                 },
         },
         I = a
            ? function (e, t, n) {
                 return P.f(e, t, c(1, n));
              }
            : function (e, t, n) {
                 return (e[t] = n), e;
              },
         O = function (e, t) {
            try {
               I(i, e, t);
            } catch (n) {
               i[e] = t;
            }
            return t;
         },
         L = i["__core-js_shared__"] || O("__core-js_shared__", {}),
         j = Function.toString;
      "function" != typeof L.inspectSource &&
         (L.inspectSource = function (e) {
            return j.call(e);
         });
      var M,
         N,
         R,
         _ = L.inspectSource,
         U = i.WeakMap,
         F = "function" == typeof U && /native code/.test(_(U)),
         D = t(function (e) {
            (e.exports = function (e, t) {
               return L[e] || (L[e] = void 0 !== t ? t : {});
            })("versions", []).push({
               version: "3.6.4",
               mode: "global",
               copyright: "© 2020 Denis Pushkarev (zloirock.ru)",
            });
         }),
         q = 0,
         H = Math.random(),
         B = function (e) {
            return (
               "Symbol(" +
               String(void 0 === e ? "" : e) +
               ")_" +
               (++q + H).toString(36)
            );
         },
         V = D("keys"),
         z = function (e) {
            return V[e] || (V[e] = B(e));
         },
         W = {},
         K = i.WeakMap;
      if (F) {
         var $ = new K(),
            Y = $.get,
            G = $.has,
            X = $.set;
         (M = function (e, t) {
            return X.call($, e, t), t;
         }),
            (N = function (e) {
               return Y.call($, e) || {};
            }),
            (R = function (e) {
               return G.call($, e);
            });
      } else {
         var Q = z("state");
         (W[Q] = !0),
            (M = function (e, t) {
               return I(e, Q, t), t;
            }),
            (N = function (e) {
               return b(e, Q) ? e[Q] : {};
            }),
            (R = function (e) {
               return b(e, Q);
            });
      }
      var J,
         Z = {
            set: M,
            get: N,
            has: R,
            enforce: function (e) {
               return R(e) ? N(e) : M(e, {});
            },
            getterFor: function (e) {
               return function (t) {
                  var n;
                  if (!g(t) || (n = N(t)).type !== e)
                     throw TypeError(
                        "Incompatible receiver, " + e + " required"
                     );
                  return n;
               };
            },
         },
         ee = t(function (e) {
            var t = Z.get,
               n = Z.enforce,
               r = String(String).split("String");
            (e.exports = function (e, t, a, o) {
               var s = !!o && !!o.unsafe,
                  l = !!o && !!o.enumerable,
                  c = !!o && !!o.noTargetGet;
               "function" == typeof a &&
                  ("string" != typeof t || b(a, "name") || I(a, "name", t),
                  (n(a).source = r.join("string" == typeof t ? t : ""))),
                  e !== i
                     ? (s ? !c && e[t] && (l = !0) : delete e[t],
                       l ? (e[t] = a) : I(e, t, a))
                     : l
                     ? (e[t] = a)
                     : O(t, a);
            })(Function.prototype, "toString", function () {
               return ("function" == typeof this && t(this).source) || _(this);
            });
         }),
         te = i,
         ne = function (e) {
            return "function" == typeof e ? e : void 0;
         },
         ie = function (e, t) {
            return arguments.length < 2
               ? ne(te[e]) || ne(i[e])
               : (te[e] && te[e][t]) || (i[e] && i[e][t]);
         },
         re = Math.ceil,
         ae = Math.floor,
         oe = function (e) {
            return isNaN((e = +e)) ? 0 : (e > 0 ? ae : re)(e);
         },
         se = Math.min,
         le = function (e) {
            return e > 0 ? se(oe(e), 9007199254740991) : 0;
         },
         ce = Math.max,
         ue = Math.min,
         he = function (e, t) {
            var n = oe(e);
            return n < 0 ? ce(n + t, 0) : ue(n, t);
         },
         fe = function (e) {
            return function (t, n, i) {
               var r,
                  a = m(t),
                  o = le(a.length),
                  s = he(i, o);
               if (e && n != n) {
                  for (; o > s; ) if ((r = a[s++]) != r) return !0;
               } else
                  for (; o > s; s++)
                     if ((e || s in a) && a[s] === n) return e || s || 0;
               return !e && -1;
            };
         },
         de = { includes: fe(!0), indexOf: fe(!1) },
         pe = de.indexOf,
         me = function (e, t) {
            var n,
               i = m(e),
               r = 0,
               a = [];
            for (n in i) !b(W, n) && b(i, n) && a.push(n);
            for (; t.length > r; )
               b(i, (n = t[r++])) && (~pe(a, n) || a.push(n));
            return a;
         },
         ge = [
            "constructor",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "toLocaleString",
            "toString",
            "valueOf",
         ],
         ve = ge.concat("length", "prototype"),
         ye = {
            f:
               Object.getOwnPropertyNames ||
               function (e) {
                  return me(e, ve);
               },
         },
         be = { f: Object.getOwnPropertySymbols },
         we =
            ie("Reflect", "ownKeys") ||
            function (e) {
               var t = ye.f(x(e)),
                  n = be.f;
               return n ? t.concat(n(e)) : t;
            },
         ke = function (e, t) {
            for (var n = we(t), i = P.f, r = A.f, a = 0; a < n.length; a++) {
               var o = n[a];
               b(e, o) || i(e, o, r(t, o));
            }
         },
         Te = /#|\.prototype\./,
         Se = function (e, t) {
            var n = Ae[Ee(e)];
            return (
               n == Ce || (n != xe && ("function" == typeof t ? r(t) : !!t))
            );
         },
         Ee = (Se.normalize = function (e) {
            return String(e).replace(Te, ".").toLowerCase();
         }),
         Ae = (Se.data = {}),
         xe = (Se.NATIVE = "N"),
         Ce = (Se.POLYFILL = "P"),
         Pe = Se,
         Ie = A.f,
         Oe = function (e, t) {
            var n,
               r,
               a,
               o,
               s,
               l = e.target,
               c = e.global,
               u = e.stat;
            if ((n = c ? i : u ? i[l] || O(l, {}) : (i[l] || {}).prototype))
               for (r in t) {
                  if (
                     ((o = t[r]),
                     (a = e.noTargetGet ? (s = Ie(n, r)) && s.value : n[r]),
                     !Pe(c ? r : l + (u ? "." : "#") + r, e.forced) &&
                        void 0 !== a)
                  ) {
                     if (typeof o == typeof a) continue;
                     ke(o, a);
                  }
                  (e.sham || (a && a.sham)) && I(o, "sham", !0), ee(n, r, o, e);
               }
         },
         Le =
            !!Object.getOwnPropertySymbols &&
            !r(function () {
               return !String(Symbol());
            }),
         je = Le && !Symbol.sham && "symbol" == typeof Symbol.iterator,
         Me =
            Array.isArray ||
            function (e) {
               return "Array" == h(e);
            },
         Ne = function (e) {
            return Object(p(e));
         },
         Re =
            Object.keys ||
            function (e) {
               return me(e, ge);
            },
         _e = a
            ? Object.defineProperties
            : function (e, t) {
                 x(e);
                 for (var n, i = Re(t), r = i.length, a = 0; r > a; )
                    P.f(e, (n = i[a++]), t[n]);
                 return e;
              },
         Ue = ie("document", "documentElement"),
         Fe = z("IE_PROTO"),
         De = function () {},
         qe = function (e) {
            return "<script>" + e + "</script>";
         },
         He = function () {
            try {
               J = document.domain && new ActiveXObject("htmlfile");
            } catch (e) {}
            var e, t;
            He = J
               ? (function (e) {
                    e.write(qe("")), e.close();
                    var t = e.parentWindow.Object;
                    return (e = null), t;
                 })(J)
               : (((t = T("iframe")).style.display = "none"),
                 Ue.appendChild(t),
                 (t.src = String("javascript:")),
                 (e = t.contentWindow.document).open(),
                 e.write(qe("document.F=Object")),
                 e.close(),
                 e.F);
            for (var n = ge.length; n--; ) delete He.prototype[ge[n]];
            return He();
         };
      W[Fe] = !0;
      var Be =
            Object.create ||
            function (e, t) {
               var n;
               return (
                  null !== e
                     ? ((De.prototype = x(e)),
                       (n = new De()),
                       (De.prototype = null),
                       (n[Fe] = e))
                     : (n = He()),
                  void 0 === t ? n : _e(n, t)
               );
            },
         Ve = ye.f,
         ze = {}.toString,
         We =
            "object" == typeof window && window && Object.getOwnPropertyNames
               ? Object.getOwnPropertyNames(window)
               : [],
         Ke = {
            f: function (e) {
               return We && "[object Window]" == ze.call(e)
                  ? (function (e) {
                       try {
                          return Ve(e);
                       } catch (e) {
                          return We.slice();
                       }
                    })(e)
                  : Ve(m(e));
            },
         },
         $e = D("wks"),
         Ye = i.Symbol,
         Ge = je ? Ye : (Ye && Ye.withoutSetter) || B,
         Xe = function (e) {
            return (
               b($e, e) ||
                  (Le && b(Ye, e)
                     ? ($e[e] = Ye[e])
                     : ($e[e] = Ge("Symbol." + e))),
               $e[e]
            );
         },
         Qe = { f: Xe },
         Je = P.f,
         Ze = function (e) {
            var t = te.Symbol || (te.Symbol = {});
            b(t, e) || Je(t, e, { value: Qe.f(e) });
         },
         et = P.f,
         tt = Xe("toStringTag"),
         nt = function (e, t, n) {
            e &&
               !b((e = n ? e : e.prototype), tt) &&
               et(e, tt, { configurable: !0, value: t });
         },
         it = function (e) {
            if ("function" != typeof e)
               throw TypeError(String(e) + " is not a function");
            return e;
         },
         rt = function (e, t, n) {
            if ((it(e), void 0 === t)) return e;
            switch (n) {
               case 0:
                  return function () {
                     return e.call(t);
                  };
               case 1:
                  return function (n) {
                     return e.call(t, n);
                  };
               case 2:
                  return function (n, i) {
                     return e.call(t, n, i);
                  };
               case 3:
                  return function (n, i, r) {
                     return e.call(t, n, i, r);
                  };
            }
            return function () {
               return e.apply(t, arguments);
            };
         },
         at = Xe("species"),
         ot = function (e, t) {
            var n;
            return (
               Me(e) &&
                  ("function" != typeof (n = e.constructor) ||
                  (n !== Array && !Me(n.prototype))
                     ? g(n) && null === (n = n[at]) && (n = void 0)
                     : (n = void 0)),
               new (void 0 === n ? Array : n)(0 === t ? 0 : t)
            );
         },
         st = [].push,
         lt = function (e) {
            var t = 1 == e,
               n = 2 == e,
               i = 3 == e,
               r = 4 == e,
               a = 6 == e,
               o = 5 == e || a;
            return function (s, l, c, u) {
               for (
                  var h,
                     f,
                     p = Ne(s),
                     m = d(p),
                     g = rt(l, c, 3),
                     v = le(m.length),
                     y = 0,
                     b = u || ot,
                     w = t ? b(s, v) : n ? b(s, 0) : void 0;
                  v > y;
                  y++
               )
                  if ((o || y in m) && ((f = g((h = m[y]), y, p)), e))
                     if (t) w[y] = f;
                     else if (f)
                        switch (e) {
                           case 3:
                              return !0;
                           case 5:
                              return h;
                           case 6:
                              return y;
                           case 2:
                              st.call(w, h);
                        }
                     else if (r) return !1;
               return a ? -1 : i || r ? r : w;
            };
         },
         ct = {
            forEach: lt(0),
            map: lt(1),
            filter: lt(2),
            some: lt(3),
            every: lt(4),
            find: lt(5),
            findIndex: lt(6),
         },
         ut = ct.forEach,
         ht = z("hidden"),
         ft = Xe("toPrimitive"),
         dt = Z.set,
         pt = Z.getterFor("Symbol"),
         mt = Object.prototype,
         gt = i.Symbol,
         vt = ie("JSON", "stringify"),
         yt = A.f,
         bt = P.f,
         wt = Ke.f,
         kt = l.f,
         Tt = D("symbols"),
         St = D("op-symbols"),
         Et = D("string-to-symbol-registry"),
         At = D("symbol-to-string-registry"),
         xt = D("wks"),
         Ct = i.QObject,
         Pt = !Ct || !Ct.prototype || !Ct.prototype.findChild,
         It =
            a &&
            r(function () {
               return (
                  7 !=
                  Be(
                     bt({}, "a", {
                        get: function () {
                           return bt(this, "a", { value: 7 }).a;
                        },
                     })
                  ).a
               );
            })
               ? function (e, t, n) {
                    var i = yt(mt, t);
                    i && delete mt[t],
                       bt(e, t, n),
                       i && e !== mt && bt(mt, t, i);
                 }
               : bt,
         Ot = function (e, t) {
            var n = (Tt[e] = Be(gt.prototype));
            return (
               dt(n, { type: "Symbol", tag: e, description: t }),
               a || (n.description = t),
               n
            );
         },
         Lt = je
            ? function (e) {
                 return "symbol" == typeof e;
              }
            : function (e) {
                 return Object(e) instanceof gt;
              },
         jt = function (e, t, n) {
            e === mt && jt(St, t, n), x(e);
            var i = v(t, !0);
            return (
               x(n),
               b(Tt, i)
                  ? (n.enumerable
                       ? (b(e, ht) && e[ht][i] && (e[ht][i] = !1),
                         (n = Be(n, { enumerable: c(0, !1) })))
                       : (b(e, ht) || bt(e, ht, c(1, {})), (e[ht][i] = !0)),
                    It(e, i, n))
                  : bt(e, i, n)
            );
         },
         Mt = function (e, t) {
            x(e);
            var n = m(t),
               i = Re(n).concat(Ut(n));
            return (
               ut(i, function (t) {
                  (a && !Nt.call(n, t)) || jt(e, t, n[t]);
               }),
               e
            );
         },
         Nt = function (e) {
            var t = v(e, !0),
               n = kt.call(this, t);
            return (
               !(this === mt && b(Tt, t) && !b(St, t)) &&
               (!(
                  n ||
                  !b(this, t) ||
                  !b(Tt, t) ||
                  (b(this, ht) && this[ht][t])
               ) ||
                  n)
            );
         },
         Rt = function (e, t) {
            var n = m(e),
               i = v(t, !0);
            if (n !== mt || !b(Tt, i) || b(St, i)) {
               var r = yt(n, i);
               return (
                  !r ||
                     !b(Tt, i) ||
                     (b(n, ht) && n[ht][i]) ||
                     (r.enumerable = !0),
                  r
               );
            }
         },
         _t = function (e) {
            var t = wt(m(e)),
               n = [];
            return (
               ut(t, function (e) {
                  b(Tt, e) || b(W, e) || n.push(e);
               }),
               n
            );
         },
         Ut = function (e) {
            var t = e === mt,
               n = wt(t ? St : m(e)),
               i = [];
            return (
               ut(n, function (e) {
                  !b(Tt, e) || (t && !b(mt, e)) || i.push(Tt[e]);
               }),
               i
            );
         };
      if (
         (Le ||
            (ee(
               (gt = function () {
                  if (this instanceof gt)
                     throw TypeError("Symbol is not a constructor");
                  var e =
                        arguments.length && void 0 !== arguments[0]
                           ? String(arguments[0])
                           : void 0,
                     t = B(e),
                     n = function (e) {
                        this === mt && n.call(St, e),
                           b(this, ht) && b(this[ht], t) && (this[ht][t] = !1),
                           It(this, t, c(1, e));
                     };
                  return (
                     a && Pt && It(mt, t, { configurable: !0, set: n }),
                     Ot(t, e)
                  );
               }).prototype,
               "toString",
               function () {
                  return pt(this).tag;
               }
            ),
            ee(gt, "withoutSetter", function (e) {
               return Ot(B(e), e);
            }),
            (l.f = Nt),
            (P.f = jt),
            (A.f = Rt),
            (ye.f = Ke.f = _t),
            (be.f = Ut),
            (Qe.f = function (e) {
               return Ot(Xe(e), e);
            }),
            a &&
               (bt(gt.prototype, "description", {
                  configurable: !0,
                  get: function () {
                     return pt(this).description;
                  },
               }),
               ee(mt, "propertyIsEnumerable", Nt, { unsafe: !0 }))),
         Oe({ global: !0, wrap: !0, forced: !Le, sham: !Le }, { Symbol: gt }),
         ut(Re(xt), function (e) {
            Ze(e);
         }),
         Oe(
            { target: "Symbol", stat: !0, forced: !Le },
            {
               for: function (e) {
                  var t = String(e);
                  if (b(Et, t)) return Et[t];
                  var n = gt(t);
                  return (Et[t] = n), (At[n] = t), n;
               },
               keyFor: function (e) {
                  if (!Lt(e)) throw TypeError(e + " is not a symbol");
                  if (b(At, e)) return At[e];
               },
               useSetter: function () {
                  Pt = !0;
               },
               useSimple: function () {
                  Pt = !1;
               },
            }
         ),
         Oe(
            { target: "Object", stat: !0, forced: !Le, sham: !a },
            {
               create: function (e, t) {
                  return void 0 === t ? Be(e) : Mt(Be(e), t);
               },
               defineProperty: jt,
               defineProperties: Mt,
               getOwnPropertyDescriptor: Rt,
            }
         ),
         Oe(
            { target: "Object", stat: !0, forced: !Le },
            { getOwnPropertyNames: _t, getOwnPropertySymbols: Ut }
         ),
         Oe(
            {
               target: "Object",
               stat: !0,
               forced: r(function () {
                  be.f(1);
               }),
            },
            {
               getOwnPropertySymbols: function (e) {
                  return be.f(Ne(e));
               },
            }
         ),
         vt)
      ) {
         var Ft =
            !Le ||
            r(function () {
               var e = gt();
               return (
                  "[null]" != vt([e]) ||
                  "{}" != vt({ a: e }) ||
                  "{}" != vt(Object(e))
               );
            });
         Oe(
            { target: "JSON", stat: !0, forced: Ft },
            {
               stringify: function (e, t, n) {
                  for (var i, r = [e], a = 1; arguments.length > a; )
                     r.push(arguments[a++]);
                  if (((i = t), (g(t) || void 0 !== e) && !Lt(e)))
                     return (
                        Me(t) ||
                           (t = function (e, t) {
                              if (
                                 ("function" == typeof i &&
                                    (t = i.call(this, e, t)),
                                 !Lt(t))
                              )
                                 return t;
                           }),
                        (r[1] = t),
                        vt.apply(null, r)
                     );
               },
            }
         );
      }
      gt.prototype[ft] || I(gt.prototype, ft, gt.prototype.valueOf),
         nt(gt, "Symbol"),
         (W[ht] = !0);
      var Dt = P.f,
         qt = i.Symbol;
      if (
         a &&
         "function" == typeof qt &&
         (!("description" in qt.prototype) || void 0 !== qt().description)
      ) {
         var Ht = {},
            Bt = function () {
               var e =
                     arguments.length < 1 || void 0 === arguments[0]
                        ? void 0
                        : String(arguments[0]),
                  t =
                     this instanceof Bt
                        ? new qt(e)
                        : void 0 === e
                        ? qt()
                        : qt(e);
               return "" === e && (Ht[t] = !0), t;
            };
         ke(Bt, qt);
         var Vt = (Bt.prototype = qt.prototype);
         Vt.constructor = Bt;
         var zt = Vt.toString,
            Wt = "Symbol(test)" == String(qt("test")),
            Kt = /^Symbol\((.*)\)[^)]+$/;
         Dt(Vt, "description", {
            configurable: !0,
            get: function () {
               var e = g(this) ? this.valueOf() : this,
                  t = zt.call(e);
               if (b(Ht, e)) return "";
               var n = Wt ? t.slice(7, -1) : t.replace(Kt, "$1");
               return "" === n ? void 0 : n;
            },
         }),
            Oe({ global: !0, forced: !0 }, { Symbol: Bt });
      }
      Ze("iterator");
      var $t = function (e, t) {
            var n = [][e];
            return (
               !!n &&
               r(function () {
                  n.call(
                     null,
                     t ||
                        function () {
                           throw 1;
                        },
                     1
                  );
               })
            );
         },
         Yt = Object.defineProperty,
         Gt = {},
         Xt = function (e) {
            throw e;
         },
         Qt = function (e, t) {
            if (b(Gt, e)) return Gt[e];
            t || (t = {});
            var n = [][e],
               i = !!b(t, "ACCESSORS") && t.ACCESSORS,
               o = b(t, 0) ? t[0] : Xt,
               s = b(t, 1) ? t[1] : void 0;
            return (Gt[e] =
               !!n &&
               !r(function () {
                  if (i && !a) return !0;
                  var e = { length: -1 };
                  i ? Yt(e, 1, { enumerable: !0, get: Xt }) : (e[1] = 1),
                     n.call(e, o, s);
               }));
         },
         Jt = ct.forEach,
         Zt = $t("forEach"),
         en = Qt("forEach"),
         tn =
            Zt && en
               ? [].forEach
               : function (e) {
                    return Jt(
                       this,
                       e,
                       arguments.length > 1 ? arguments[1] : void 0
                    );
                 };
      Oe(
         { target: "Array", proto: !0, forced: [].forEach != tn },
         { forEach: tn }
      );
      var nn = de.indexOf,
         rn = [].indexOf,
         an = !!rn && 1 / [1].indexOf(1, -0) < 0,
         on = $t("indexOf"),
         sn = Qt("indexOf", { ACCESSORS: !0, 1: 0 });
      Oe(
         { target: "Array", proto: !0, forced: an || !on || !sn },
         {
            indexOf: function (e) {
               return an
                  ? rn.apply(this, arguments) || 0
                  : nn(this, e, arguments.length > 1 ? arguments[1] : void 0);
            },
         }
      );
      var ln = Xe("unscopables"),
         cn = Array.prototype;
      null == cn[ln] && P.f(cn, ln, { configurable: !0, value: Be(null) });
      var un,
         hn,
         fn,
         dn = function (e) {
            cn[ln][e] = !0;
         },
         pn = {},
         mn = !r(function () {
            function e() {}
            return (
               (e.prototype.constructor = null),
               Object.getPrototypeOf(new e()) !== e.prototype
            );
         }),
         gn = z("IE_PROTO"),
         vn = Object.prototype,
         yn = mn
            ? Object.getPrototypeOf
            : function (e) {
                 return (
                    (e = Ne(e)),
                    b(e, gn)
                       ? e[gn]
                       : "function" == typeof e.constructor &&
                         e instanceof e.constructor
                       ? e.constructor.prototype
                       : e instanceof Object
                       ? vn
                       : null
                 );
              },
         bn = Xe("iterator"),
         wn = !1;
      [].keys &&
         ("next" in (fn = [].keys())
            ? (hn = yn(yn(fn))) !== Object.prototype && (un = hn)
            : (wn = !0)),
         null == un && (un = {}),
         b(un, bn) ||
            I(un, bn, function () {
               return this;
            });
      var kn = { IteratorPrototype: un, BUGGY_SAFARI_ITERATORS: wn },
         Tn = kn.IteratorPrototype,
         Sn = function () {
            return this;
         },
         En = function (e, t, n) {
            var i = t + " Iterator";
            return (
               (e.prototype = Be(Tn, { next: c(1, n) })),
               nt(e, i, !1),
               (pn[i] = Sn),
               e
            );
         },
         An =
            Object.setPrototypeOf ||
            ("__proto__" in {}
               ? (function () {
                    var e,
                       t = !1,
                       n = {};
                    try {
                       (e = Object.getOwnPropertyDescriptor(
                          Object.prototype,
                          "__proto__"
                       ).set).call(n, []),
                          (t = n instanceof Array);
                    } catch (e) {}
                    return function (n, i) {
                       return (
                          x(n),
                          (function (e) {
                             if (!g(e) && null !== e)
                                throw TypeError(
                                   "Can't set " + String(e) + " as a prototype"
                                );
                          })(i),
                          t ? e.call(n, i) : (n.__proto__ = i),
                          n
                       );
                    };
                 })()
               : void 0),
         xn = kn.IteratorPrototype,
         Cn = kn.BUGGY_SAFARI_ITERATORS,
         Pn = Xe("iterator"),
         In = function () {
            return this;
         },
         On = function (e, t, n, i, r, a, o) {
            En(n, t, i);
            var s,
               l,
               c,
               u = function (e) {
                  if (e === r && m) return m;
                  if (!Cn && e in d) return d[e];
                  switch (e) {
                     case "keys":
                     case "values":
                     case "entries":
                        return function () {
                           return new n(this, e);
                        };
                  }
                  return function () {
                     return new n(this);
                  };
               },
               h = t + " Iterator",
               f = !1,
               d = e.prototype,
               p = d[Pn] || d["@@iterator"] || (r && d[r]),
               m = (!Cn && p) || u(r),
               g = ("Array" == t && d.entries) || p;
            if (
               (g &&
                  ((s = yn(g.call(new e()))),
                  xn !== Object.prototype &&
                     s.next &&
                     (yn(s) !== xn &&
                        (An
                           ? An(s, xn)
                           : "function" != typeof s[Pn] && I(s, Pn, In)),
                     nt(s, h, !0))),
               "values" == r &&
                  p &&
                  "values" !== p.name &&
                  ((f = !0),
                  (m = function () {
                     return p.call(this);
                  })),
               d[Pn] !== m && I(d, Pn, m),
               (pn[t] = m),
               r)
            )
               if (
                  ((l = {
                     values: u("values"),
                     keys: a ? m : u("keys"),
                     entries: u("entries"),
                  }),
                  o)
               )
                  for (c in l) (!Cn && !f && c in d) || ee(d, c, l[c]);
               else Oe({ target: t, proto: !0, forced: Cn || f }, l);
            return l;
         },
         Ln = Z.set,
         jn = Z.getterFor("Array Iterator"),
         Mn = On(
            Array,
            "Array",
            function (e, t) {
               Ln(this, {
                  type: "Array Iterator",
                  target: m(e),
                  index: 0,
                  kind: t,
               });
            },
            function () {
               var e = jn(this),
                  t = e.target,
                  n = e.kind,
                  i = e.index++;
               return !t || i >= t.length
                  ? ((e.target = void 0), { value: void 0, done: !0 })
                  : "keys" == n
                  ? { value: i, done: !1 }
                  : "values" == n
                  ? { value: t[i], done: !1 }
                  : { value: [i, t[i]], done: !1 };
            },
            "values"
         );
      (pn.Arguments = pn.Array), dn("keys"), dn("values"), dn("entries");
      var Nn = [].join,
         Rn = d != Object,
         _n = $t("join", ",");
      Oe(
         { target: "Array", proto: !0, forced: Rn || !_n },
         {
            join: function (e) {
               return Nn.call(m(this), void 0 === e ? "," : e);
            },
         }
      );
      var Un,
         Fn,
         Dn = function (e, t, n) {
            var i = v(t);
            i in e ? P.f(e, i, c(0, n)) : (e[i] = n);
         },
         qn = ie("navigator", "userAgent") || "",
         Hn = i.process,
         Bn = Hn && Hn.versions,
         Vn = Bn && Bn.v8;
      Vn
         ? (Fn = (Un = Vn.split("."))[0] + Un[1])
         : qn &&
           (!(Un = qn.match(/Edge\/(\d+)/)) || Un[1] >= 74) &&
           (Un = qn.match(/Chrome\/(\d+)/)) &&
           (Fn = Un[1]);
      var zn = Fn && +Fn,
         Wn = Xe("species"),
         Kn = function (e) {
            return (
               zn >= 51 ||
               !r(function () {
                  var t = [];
                  return (
                     ((t.constructor = {})[Wn] = function () {
                        return { foo: 1 };
                     }),
                     1 !== t[e](Boolean).foo
                  );
               })
            );
         },
         $n = Kn("slice"),
         Yn = Qt("slice", { ACCESSORS: !0, 0: 0, 1: 2 }),
         Gn = Xe("species"),
         Xn = [].slice,
         Qn = Math.max;
      Oe(
         { target: "Array", proto: !0, forced: !$n || !Yn },
         {
            slice: function (e, t) {
               var n,
                  i,
                  r,
                  a = m(this),
                  o = le(a.length),
                  s = he(e, o),
                  l = he(void 0 === t ? o : t, o);
               if (
                  Me(a) &&
                  ("function" != typeof (n = a.constructor) ||
                  (n !== Array && !Me(n.prototype))
                     ? g(n) && null === (n = n[Gn]) && (n = void 0)
                     : (n = void 0),
                  n === Array || void 0 === n)
               )
                  return Xn.call(a, s, l);
               for (
                  i = new (void 0 === n ? Array : n)(Qn(l - s, 0)), r = 0;
                  s < l;
                  s++, r++
               )
                  s in a && Dn(i, r, a[s]);
               return (i.length = r), i;
            },
         }
      );
      var Jn = {};
      Jn[Xe("toStringTag")] = "z";
      var Zn = "[object z]" === String(Jn),
         ei = Xe("toStringTag"),
         ti =
            "Arguments" ==
            h(
               (function () {
                  return arguments;
               })()
            ),
         ni = Zn
            ? h
            : function (e) {
                 var t, n, i;
                 return void 0 === e
                    ? "Undefined"
                    : null === e
                    ? "Null"
                    : "string" ==
                      typeof (n = (function (e, t) {
                         try {
                            return e[t];
                         } catch (e) {}
                      })((t = Object(e)), ei))
                    ? n
                    : ti
                    ? h(t)
                    : "Object" == (i = h(t)) && "function" == typeof t.callee
                    ? "Arguments"
                    : i;
              },
         ii = Zn
            ? {}.toString
            : function () {
                 return "[object " + ni(this) + "]";
              };
      Zn || ee(Object.prototype, "toString", ii, { unsafe: !0 });
      var ri = function () {
         var e = x(this),
            t = "";
         return (
            e.global && (t += "g"),
            e.ignoreCase && (t += "i"),
            e.multiline && (t += "m"),
            e.dotAll && (t += "s"),
            e.unicode && (t += "u"),
            e.sticky && (t += "y"),
            t
         );
      };
      function ai(e, t) {
         return RegExp(e, t);
      }
      var oi = {
            UNSUPPORTED_Y: r(function () {
               var e = ai("a", "y");
               return (e.lastIndex = 2), null != e.exec("abcd");
            }),
            BROKEN_CARET: r(function () {
               var e = ai("^r", "gy");
               return (e.lastIndex = 2), null != e.exec("str");
            }),
         },
         si = RegExp.prototype.exec,
         li = String.prototype.replace,
         ci = si,
         ui = (function () {
            var e = /a/,
               t = /b*/g;
            return (
               si.call(e, "a"),
               si.call(t, "a"),
               0 !== e.lastIndex || 0 !== t.lastIndex
            );
         })(),
         hi = oi.UNSUPPORTED_Y || oi.BROKEN_CARET,
         fi = void 0 !== /()??/.exec("")[1];
      (ui || fi || hi) &&
         (ci = function (e) {
            var t,
               n,
               i,
               r,
               a = this,
               o = hi && a.sticky,
               s = ri.call(a),
               l = a.source,
               c = 0,
               u = e;
            return (
               o &&
                  (-1 === (s = s.replace("y", "")).indexOf("g") && (s += "g"),
                  (u = String(e).slice(a.lastIndex)),
                  a.lastIndex > 0 &&
                     (!a.multiline ||
                        (a.multiline && "\n" !== e[a.lastIndex - 1])) &&
                     ((l = "(?: " + l + ")"), (u = " " + u), c++),
                  (n = new RegExp("^(?:" + l + ")", s))),
               fi && (n = new RegExp("^" + l + "$(?!\\s)", s)),
               ui && (t = a.lastIndex),
               (i = si.call(o ? n : a, u)),
               o
                  ? i
                     ? ((i.input = i.input.slice(c)),
                       (i[0] = i[0].slice(c)),
                       (i.index = a.lastIndex),
                       (a.lastIndex += i[0].length))
                     : (a.lastIndex = 0)
                  : ui &&
                    i &&
                    (a.lastIndex = a.global ? i.index + i[0].length : t),
               fi &&
                  i &&
                  i.length > 1 &&
                  li.call(i[0], n, function () {
                     for (r = 1; r < arguments.length - 2; r++)
                        void 0 === arguments[r] && (i[r] = void 0);
                  }),
               i
            );
         });
      var di = ci;
      Oe(
         { target: "RegExp", proto: !0, forced: /./.exec !== di },
         { exec: di }
      );
      var pi = RegExp.prototype,
         mi = pi.toString,
         gi = r(function () {
            return "/a/b" != mi.call({ source: "a", flags: "b" });
         }),
         vi = "toString" != mi.name;
      (gi || vi) &&
         ee(
            RegExp.prototype,
            "toString",
            function () {
               var e = x(this),
                  t = String(e.source),
                  n = e.flags;
               return (
                  "/" +
                  t +
                  "/" +
                  String(
                     void 0 === n && e instanceof RegExp && !("flags" in pi)
                        ? ri.call(e)
                        : n
                  )
               );
            },
            { unsafe: !0 }
         );
      var yi = function (e) {
            return function (t, n) {
               var i,
                  r,
                  a = String(p(t)),
                  o = oe(n),
                  s = a.length;
               return o < 0 || o >= s
                  ? e
                     ? ""
                     : void 0
                  : (i = a.charCodeAt(o)) < 55296 ||
                    i > 56319 ||
                    o + 1 === s ||
                    (r = a.charCodeAt(o + 1)) < 56320 ||
                    r > 57343
                  ? e
                     ? a.charAt(o)
                     : i
                  : e
                  ? a.slice(o, o + 2)
                  : r - 56320 + ((i - 55296) << 10) + 65536;
            };
         },
         bi = { codeAt: yi(!1), charAt: yi(!0) },
         wi = bi.charAt,
         ki = Z.set,
         Ti = Z.getterFor("String Iterator");
      On(
         String,
         "String",
         function (e) {
            ki(this, { type: "String Iterator", string: String(e), index: 0 });
         },
         function () {
            var e,
               t = Ti(this),
               n = t.string,
               i = t.index;
            return i >= n.length
               ? { value: void 0, done: !0 }
               : ((e = wi(n, i)),
                 (t.index += e.length),
                 { value: e, done: !1 });
         }
      );
      var Si = Xe("species"),
         Ei = !r(function () {
            var e = /./;
            return (
               (e.exec = function () {
                  var e = [];
                  return (e.groups = { a: "7" }), e;
               }),
               "7" !== "".replace(e, "$<a>")
            );
         }),
         Ai = "$0" === "a".replace(/./, "$0"),
         xi = Xe("replace"),
         Ci = !!/./[xi] && "" === /./[xi]("a", "$0"),
         Pi = !r(function () {
            var e = /(?:)/,
               t = e.exec;
            e.exec = function () {
               return t.apply(this, arguments);
            };
            var n = "ab".split(e);
            return 2 !== n.length || "a" !== n[0] || "b" !== n[1];
         }),
         Ii = function (e, t, n, i) {
            var a = Xe(e),
               o = !r(function () {
                  var t = {};
                  return (
                     (t[a] = function () {
                        return 7;
                     }),
                     7 != ""[e](t)
                  );
               }),
               s =
                  o &&
                  !r(function () {
                     var t = !1,
                        n = /a/;
                     return (
                        "split" === e &&
                           (((n = {}).constructor = {}),
                           (n.constructor[Si] = function () {
                              return n;
                           }),
                           (n.flags = ""),
                           (n[a] = /./[a])),
                        (n.exec = function () {
                           return (t = !0), null;
                        }),
                        n[a](""),
                        !t
                     );
                  });
            if (
               !o ||
               !s ||
               ("replace" === e && (!Ei || !Ai || Ci)) ||
               ("split" === e && !Pi)
            ) {
               var l = /./[a],
                  c = n(
                     a,
                     ""[e],
                     function (e, t, n, i, r) {
                        return t.exec === di
                           ? o && !r
                              ? { done: !0, value: l.call(t, n, i) }
                              : { done: !0, value: e.call(n, t, i) }
                           : { done: !1 };
                     },
                     {
                        REPLACE_KEEPS_$0: Ai,
                        REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: Ci,
                     }
                  ),
                  u = c[0],
                  h = c[1];
               ee(String.prototype, e, u),
                  ee(
                     RegExp.prototype,
                     a,
                     2 == t
                        ? function (e, t) {
                             return h.call(e, this, t);
                          }
                        : function (e) {
                             return h.call(e, this);
                          }
                  );
            }
            i && I(RegExp.prototype[a], "sham", !0);
         },
         Oi = bi.charAt,
         Li = function (e, t, n) {
            return t + (n ? Oi(e, t).length : 1);
         },
         ji = function (e, t) {
            var n = e.exec;
            if ("function" == typeof n) {
               var i = n.call(e, t);
               if ("object" != typeof i)
                  throw TypeError(
                     "RegExp exec method returned something other than an Object or null"
                  );
               return i;
            }
            if ("RegExp" !== h(e))
               throw TypeError("RegExp#exec called on incompatible receiver");
            return di.call(e, t);
         },
         Mi = Math.max,
         Ni = Math.min,
         Ri = Math.floor,
         _i = /\$([$&'`]|\d\d?|<[^>]*>)/g,
         Ui = /\$([$&'`]|\d\d?)/g;
      Ii("replace", 2, function (e, t, n, i) {
         var r = i.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE,
            a = i.REPLACE_KEEPS_$0,
            o = r ? "$" : "$0";
         return [
            function (n, i) {
               var r = p(this),
                  a = null == n ? void 0 : n[e];
               return void 0 !== a ? a.call(n, r, i) : t.call(String(r), n, i);
            },
            function (e, i) {
               if ((!r && a) || ("string" == typeof i && -1 === i.indexOf(o))) {
                  var l = n(t, e, this, i);
                  if (l.done) return l.value;
               }
               var c = x(e),
                  u = String(this),
                  h = "function" == typeof i;
               h || (i = String(i));
               var f = c.global;
               if (f) {
                  var d = c.unicode;
                  c.lastIndex = 0;
               }
               for (var p = []; ; ) {
                  var m = ji(c, u);
                  if (null === m) break;
                  if ((p.push(m), !f)) break;
                  "" === String(m[0]) &&
                     (c.lastIndex = Li(u, le(c.lastIndex), d));
               }
               for (var g, v = "", y = 0, b = 0; b < p.length; b++) {
                  m = p[b];
                  for (
                     var w = String(m[0]),
                        k = Mi(Ni(oe(m.index), u.length), 0),
                        T = [],
                        S = 1;
                     S < m.length;
                     S++
                  )
                     T.push(void 0 === (g = m[S]) ? g : String(g));
                  var E = m.groups;
                  if (h) {
                     var A = [w].concat(T, k, u);
                     void 0 !== E && A.push(E);
                     var C = String(i.apply(void 0, A));
                  } else C = s(w, u, k, T, E, i);
                  k >= y && ((v += u.slice(y, k) + C), (y = k + w.length));
               }
               return v + u.slice(y);
            },
         ];
         function s(e, n, i, r, a, o) {
            var s = i + e.length,
               l = r.length,
               c = Ui;
            return (
               void 0 !== a && ((a = Ne(a)), (c = _i)),
               t.call(o, c, function (t, o) {
                  var c;
                  switch (o.charAt(0)) {
                     case "$":
                        return "$";
                     case "&":
                        return e;
                     case "`":
                        return n.slice(0, i);
                     case "'":
                        return n.slice(s);
                     case "<":
                        c = a[o.slice(1, -1)];
                        break;
                     default:
                        var u = +o;
                        if (0 === u) return t;
                        if (u > l) {
                           var h = Ri(u / 10);
                           return 0 === h
                              ? t
                              : h <= l
                              ? void 0 === r[h - 1]
                                 ? o.charAt(1)
                                 : r[h - 1] + o.charAt(1)
                              : t;
                        }
                        c = r[u - 1];
                  }
                  return void 0 === c ? "" : c;
               })
            );
         }
      });
      var Fi =
         Object.is ||
         function (e, t) {
            return e === t ? 0 !== e || 1 / e == 1 / t : e != e && t != t;
         };
      Ii("search", 1, function (e, t, n) {
         return [
            function (t) {
               var n = p(this),
                  i = null == t ? void 0 : t[e];
               return void 0 !== i ? i.call(t, n) : new RegExp(t)[e](String(n));
            },
            function (e) {
               var i = n(t, e, this);
               if (i.done) return i.value;
               var r = x(e),
                  a = String(this),
                  o = r.lastIndex;
               Fi(o, 0) || (r.lastIndex = 0);
               var s = ji(r, a);
               return (
                  Fi(r.lastIndex, o) || (r.lastIndex = o),
                  null === s ? -1 : s.index
               );
            },
         ];
      });
      var Di = Xe("match"),
         qi = function (e) {
            var t;
            return g(e) && (void 0 !== (t = e[Di]) ? !!t : "RegExp" == h(e));
         },
         Hi = Xe("species"),
         Bi = function (e, t) {
            var n,
               i = x(e).constructor;
            return void 0 === i || null == (n = x(i)[Hi]) ? t : it(n);
         },
         Vi = [].push,
         zi = Math.min,
         Wi = !r(function () {
            return !RegExp(4294967295, "y");
         });
      Ii(
         "split",
         2,
         function (e, t, n) {
            var i;
            return (
               (i =
                  "c" == "abbc".split(/(b)*/)[1] ||
                  4 != "test".split(/(?:)/, -1).length ||
                  2 != "ab".split(/(?:ab)*/).length ||
                  4 != ".".split(/(.?)(.?)/).length ||
                  ".".split(/()()/).length > 1 ||
                  "".split(/.?/).length
                     ? function (e, n) {
                          var i = String(p(this)),
                             r = void 0 === n ? 4294967295 : n >>> 0;
                          if (0 === r) return [];
                          if (void 0 === e) return [i];
                          if (!qi(e)) return t.call(i, e, r);
                          for (
                             var a,
                                o,
                                s,
                                l = [],
                                c =
                                   (e.ignoreCase ? "i" : "") +
                                   (e.multiline ? "m" : "") +
                                   (e.unicode ? "u" : "") +
                                   (e.sticky ? "y" : ""),
                                u = 0,
                                h = new RegExp(e.source, c + "g");
                             (a = di.call(h, i)) &&
                             !(
                                (o = h.lastIndex) > u &&
                                (l.push(i.slice(u, a.index)),
                                a.length > 1 &&
                                   a.index < i.length &&
                                   Vi.apply(l, a.slice(1)),
                                (s = a[0].length),
                                (u = o),
                                l.length >= r)
                             );

                          )
                             h.lastIndex === a.index && h.lastIndex++;
                          return (
                             u === i.length
                                ? (!s && h.test("")) || l.push("")
                                : l.push(i.slice(u)),
                             l.length > r ? l.slice(0, r) : l
                          );
                       }
                     : "0".split(void 0, 0).length
                     ? function (e, n) {
                          return void 0 === e && 0 === n
                             ? []
                             : t.call(this, e, n);
                       }
                     : t),
               [
                  function (t, n) {
                     var r = p(this),
                        a = null == t ? void 0 : t[e];
                     return void 0 !== a
                        ? a.call(t, r, n)
                        : i.call(String(r), t, n);
                  },
                  function (e, r) {
                     var a = n(i, e, this, r, i !== t);
                     if (a.done) return a.value;
                     var o = x(e),
                        s = String(this),
                        l = Bi(o, RegExp),
                        c = o.unicode,
                        u =
                           (o.ignoreCase ? "i" : "") +
                           (o.multiline ? "m" : "") +
                           (o.unicode ? "u" : "") +
                           (Wi ? "y" : "g"),
                        h = new l(Wi ? o : "^(?:" + o.source + ")", u),
                        f = void 0 === r ? 4294967295 : r >>> 0;
                     if (0 === f) return [];
                     if (0 === s.length) return null === ji(h, s) ? [s] : [];
                     for (var d = 0, p = 0, m = []; p < s.length; ) {
                        h.lastIndex = Wi ? p : 0;
                        var g,
                           v = ji(h, Wi ? s : s.slice(p));
                        if (
                           null === v ||
                           (g = zi(
                              le(h.lastIndex + (Wi ? 0 : p)),
                              s.length
                           )) === d
                        )
                           p = Li(s, p, c);
                        else {
                           if ((m.push(s.slice(d, p)), m.length === f))
                              return m;
                           for (var y = 1; y <= v.length - 1; y++)
                              if ((m.push(v[y]), m.length === f)) return m;
                           p = d = g;
                        }
                     }
                     return m.push(s.slice(d)), m;
                  },
               ]
            );
         },
         !Wi
      );
      var Ki = {
         CSSRuleList: 0,
         CSSStyleDeclaration: 0,
         CSSValueList: 0,
         ClientRectList: 0,
         DOMRectList: 0,
         DOMStringList: 0,
         DOMTokenList: 1,
         DataTransferItemList: 0,
         FileList: 0,
         HTMLAllCollection: 0,
         HTMLCollection: 0,
         HTMLFormElement: 0,
         HTMLSelectElement: 0,
         MediaList: 0,
         MimeTypeArray: 0,
         NamedNodeMap: 0,
         NodeList: 1,
         PaintRequestList: 0,
         Plugin: 0,
         PluginArray: 0,
         SVGLengthList: 0,
         SVGNumberList: 0,
         SVGPathSegList: 0,
         SVGPointList: 0,
         SVGStringList: 0,
         SVGTransformList: 0,
         SourceBufferList: 0,
         StyleSheetList: 0,
         TextTrackCueList: 0,
         TextTrackList: 0,
         TouchList: 0,
      };
      for (var $i in Ki) {
         var Yi = i[$i],
            Gi = Yi && Yi.prototype;
         if (Gi && Gi.forEach !== tn)
            try {
               I(Gi, "forEach", tn);
            } catch (e) {
               Gi.forEach = tn;
            }
      }
      var Xi = Xe("iterator"),
         Qi = Xe("toStringTag"),
         Ji = Mn.values;
      for (var Zi in Ki) {
         var er = i[Zi],
            tr = er && er.prototype;
         if (tr) {
            if (tr[Xi] !== Ji)
               try {
                  I(tr, Xi, Ji);
               } catch (e) {
                  tr[Xi] = Ji;
               }
            if ((tr[Qi] || I(tr, Qi, Zi), Ki[Zi]))
               for (var nr in Mn)
                  if (tr[nr] !== Mn[nr])
                     try {
                        I(tr, nr, Mn[nr]);
                     } catch (e) {
                        tr[nr] = Mn[nr];
                     }
         }
      }
      var ir = Xe("iterator"),
         rr = !r(function () {
            var e = new URL("b?a=1&b=2&c=3", "http://a"),
               t = e.searchParams,
               n = "";
            return (
               (e.pathname = "c%20d"),
               t.forEach(function (e, i) {
                  t.delete("b"), (n += i + e);
               }),
               !t.sort ||
                  "http://a/c%20d?a=1&c=3" !== e.href ||
                  "3" !== t.get("c") ||
                  "a=1" !== String(new URLSearchParams("?a=1")) ||
                  !t[ir] ||
                  "a" !== new URL("https://a@b").username ||
                  "b" !==
                     new URLSearchParams(new URLSearchParams("a=b")).get("a") ||
                  "xn--e1aybc" !== new URL("http://тест").host ||
                  "#%D0%B1" !== new URL("http://a#б").hash ||
                  "a1c3" !== n ||
                  "x" !== new URL("http://x", void 0).host
            );
         }),
         ar = function (e, t, n) {
            if (!(e instanceof t))
               throw TypeError(
                  "Incorrect " + (n ? n + " " : "") + "invocation"
               );
            return e;
         },
         or = Object.assign,
         sr = Object.defineProperty,
         lr =
            !or ||
            r(function () {
               if (
                  a &&
                  1 !==
                     or(
                        { b: 1 },
                        or(
                           sr({}, "a", {
                              enumerable: !0,
                              get: function () {
                                 sr(this, "b", { value: 3, enumerable: !1 });
                              },
                           }),
                           { b: 2 }
                        )
                     ).b
               )
                  return !0;
               var e = {},
                  t = {},
                  n = Symbol();
               return (
                  (e[n] = 7),
                  "abcdefghijklmnopqrst".split("").forEach(function (e) {
                     t[e] = e;
                  }),
                  7 != or({}, e)[n] ||
                     "abcdefghijklmnopqrst" != Re(or({}, t)).join("")
               );
            })
               ? function (e, t) {
                    for (
                       var n = Ne(e),
                          i = arguments.length,
                          r = 1,
                          o = be.f,
                          s = l.f;
                       i > r;

                    )
                       for (
                          var c,
                             u = d(arguments[r++]),
                             h = o ? Re(u).concat(o(u)) : Re(u),
                             f = h.length,
                             p = 0;
                          f > p;

                       )
                          (c = h[p++]), (a && !s.call(u, c)) || (n[c] = u[c]);
                    return n;
                 }
               : or,
         cr = function (e, t, n, i) {
            try {
               return i ? t(x(n)[0], n[1]) : t(n);
            } catch (t) {
               var r = e.return;
               throw (void 0 !== r && x(r.call(e)), t);
            }
         },
         ur = Xe("iterator"),
         hr = Array.prototype,
         fr = function (e) {
            return void 0 !== e && (pn.Array === e || hr[ur] === e);
         },
         dr = Xe("iterator"),
         pr = function (e) {
            if (null != e) return e[dr] || e["@@iterator"] || pn[ni(e)];
         },
         mr = function (e) {
            var t,
               n,
               i,
               r,
               a,
               o,
               s = Ne(e),
               l = "function" == typeof this ? this : Array,
               c = arguments.length,
               u = c > 1 ? arguments[1] : void 0,
               h = void 0 !== u,
               f = pr(s),
               d = 0;
            if (
               (h && (u = rt(u, c > 2 ? arguments[2] : void 0, 2)),
               null == f || (l == Array && fr(f)))
            )
               for (n = new l((t = le(s.length))); t > d; d++)
                  (o = h ? u(s[d], d) : s[d]), Dn(n, d, o);
            else
               for (
                  a = (r = f.call(s)).next, n = new l();
                  !(i = a.call(r)).done;
                  d++
               )
                  (o = h ? cr(r, u, [i.value, d], !0) : i.value), Dn(n, d, o);
            return (n.length = d), n;
         },
         gr = /[^\0-\u007E]/,
         vr = /[.\u3002\uFF0E\uFF61]/g,
         yr = "Overflow: input needs wider integers to process",
         br = Math.floor,
         wr = String.fromCharCode,
         kr = function (e) {
            return e + 22 + 75 * (e < 26);
         },
         Tr = function (e, t, n) {
            var i = 0;
            for (e = n ? br(e / 700) : e >> 1, e += br(e / t); e > 455; i += 36)
               e = br(e / 35);
            return br(i + (36 * e) / (e + 38));
         },
         Sr = function (e) {
            var t,
               n,
               i = [],
               r = (e = (function (e) {
                  for (var t = [], n = 0, i = e.length; n < i; ) {
                     var r = e.charCodeAt(n++);
                     if (r >= 55296 && r <= 56319 && n < i) {
                        var a = e.charCodeAt(n++);
                        56320 == (64512 & a)
                           ? t.push(((1023 & r) << 10) + (1023 & a) + 65536)
                           : (t.push(r), n--);
                     } else t.push(r);
                  }
                  return t;
               })(e)).length,
               a = 128,
               o = 0,
               s = 72;
            for (t = 0; t < e.length; t++) (n = e[t]) < 128 && i.push(wr(n));
            var l = i.length,
               c = l;
            for (l && i.push("-"); c < r; ) {
               var u = 2147483647;
               for (t = 0; t < e.length; t++)
                  (n = e[t]) >= a && n < u && (u = n);
               var h = c + 1;
               if (u - a > br((2147483647 - o) / h)) throw RangeError(yr);
               for (o += (u - a) * h, a = u, t = 0; t < e.length; t++) {
                  if ((n = e[t]) < a && ++o > 2147483647) throw RangeError(yr);
                  if (n == a) {
                     for (var f = o, d = 36; ; d += 36) {
                        var p = d <= s ? 1 : d >= s + 26 ? 26 : d - s;
                        if (f < p) break;
                        var m = f - p,
                           g = 36 - p;
                        i.push(wr(kr(p + (m % g)))), (f = br(m / g));
                     }
                     i.push(wr(kr(f))), (s = Tr(o, h, c == l)), (o = 0), ++c;
                  }
               }
               ++o, ++a;
            }
            return i.join("");
         },
         Er = function (e, t, n) {
            for (var i in t) ee(e, i, t[i], n);
            return e;
         },
         Ar = function (e) {
            var t = pr(e);
            if ("function" != typeof t)
               throw TypeError(String(e) + " is not iterable");
            return x(t.call(e));
         },
         xr = ie("fetch"),
         Cr = ie("Headers"),
         Pr = Xe("iterator"),
         Ir = Z.set,
         Or = Z.getterFor("URLSearchParams"),
         Lr = Z.getterFor("URLSearchParamsIterator"),
         jr = /\+/g,
         Mr = Array(4),
         Nr = function (e) {
            return (
               Mr[e - 1] ||
               (Mr[e - 1] = RegExp("((?:%[\\da-f]{2}){" + e + "})", "gi"))
            );
         },
         Rr = function (e) {
            try {
               return decodeURIComponent(e);
            } catch (t) {
               return e;
            }
         },
         _r = function (e) {
            var t = e.replace(jr, " "),
               n = 4;
            try {
               return decodeURIComponent(t);
            } catch (e) {
               for (; n; ) t = t.replace(Nr(n--), Rr);
               return t;
            }
         },
         Ur = /[!'()~]|%20/g,
         Fr = {
            "!": "%21",
            "'": "%27",
            "(": "%28",
            ")": "%29",
            "~": "%7E",
            "%20": "+",
         },
         Dr = function (e) {
            return Fr[e];
         },
         qr = function (e) {
            return encodeURIComponent(e).replace(Ur, Dr);
         },
         Hr = function (e, t) {
            if (t)
               for (var n, i, r = t.split("&"), a = 0; a < r.length; )
                  (n = r[a++]).length &&
                     ((i = n.split("=")),
                     e.push({ key: _r(i.shift()), value: _r(i.join("=")) }));
         },
         Br = function (e) {
            (this.entries.length = 0), Hr(this.entries, e);
         },
         Vr = function (e, t) {
            if (e < t) throw TypeError("Not enough arguments");
         },
         zr = En(
            function (e, t) {
               Ir(this, {
                  type: "URLSearchParamsIterator",
                  iterator: Ar(Or(e).entries),
                  kind: t,
               });
            },
            "Iterator",
            function () {
               var e = Lr(this),
                  t = e.kind,
                  n = e.iterator.next(),
                  i = n.value;
               return (
                  n.done ||
                     (n.value =
                        "keys" === t
                           ? i.key
                           : "values" === t
                           ? i.value
                           : [i.key, i.value]),
                  n
               );
            }
         ),
         Wr = function () {
            ar(this, Wr, "URLSearchParams");
            var e,
               t,
               n,
               i,
               r,
               a,
               o,
               s,
               l,
               c = arguments.length > 0 ? arguments[0] : void 0,
               u = this,
               h = [];
            if (
               (Ir(u, {
                  type: "URLSearchParams",
                  entries: h,
                  updateURL: function () {},
                  updateSearchParams: Br,
               }),
               void 0 !== c)
            )
               if (g(c))
                  if ("function" == typeof (e = pr(c)))
                     for (n = (t = e.call(c)).next; !(i = n.call(t)).done; ) {
                        if (
                           (o = (a = (r = Ar(x(i.value))).next).call(r)).done ||
                           (s = a.call(r)).done ||
                           !a.call(r).done
                        )
                           throw TypeError("Expected sequence with length 2");
                        h.push({ key: o.value + "", value: s.value + "" });
                     }
                  else
                     for (l in c)
                        b(c, l) && h.push({ key: l, value: c[l] + "" });
               else
                  Hr(
                     h,
                     "string" == typeof c
                        ? "?" === c.charAt(0)
                           ? c.slice(1)
                           : c
                        : c + ""
                  );
         },
         Kr = Wr.prototype;
      Er(
         Kr,
         {
            append: function (e, t) {
               Vr(arguments.length, 2);
               var n = Or(this);
               n.entries.push({ key: e + "", value: t + "" }), n.updateURL();
            },
            delete: function (e) {
               Vr(arguments.length, 1);
               for (
                  var t = Or(this), n = t.entries, i = e + "", r = 0;
                  r < n.length;

               )
                  n[r].key === i ? n.splice(r, 1) : r++;
               t.updateURL();
            },
            get: function (e) {
               Vr(arguments.length, 1);
               for (
                  var t = Or(this).entries, n = e + "", i = 0;
                  i < t.length;
                  i++
               )
                  if (t[i].key === n) return t[i].value;
               return null;
            },
            getAll: function (e) {
               Vr(arguments.length, 1);
               for (
                  var t = Or(this).entries, n = e + "", i = [], r = 0;
                  r < t.length;
                  r++
               )
                  t[r].key === n && i.push(t[r].value);
               return i;
            },
            has: function (e) {
               Vr(arguments.length, 1);
               for (var t = Or(this).entries, n = e + "", i = 0; i < t.length; )
                  if (t[i++].key === n) return !0;
               return !1;
            },
            set: function (e, t) {
               Vr(arguments.length, 1);
               for (
                  var n,
                     i = Or(this),
                     r = i.entries,
                     a = !1,
                     o = e + "",
                     s = t + "",
                     l = 0;
                  l < r.length;
                  l++
               )
                  (n = r[l]).key === o &&
                     (a ? r.splice(l--, 1) : ((a = !0), (n.value = s)));
               a || r.push({ key: o, value: s }), i.updateURL();
            },
            sort: function () {
               var e,
                  t,
                  n,
                  i = Or(this),
                  r = i.entries,
                  a = r.slice();
               for (r.length = 0, n = 0; n < a.length; n++) {
                  for (e = a[n], t = 0; t < n; t++)
                     if (r[t].key > e.key) {
                        r.splice(t, 0, e);
                        break;
                     }
                  t === n && r.push(e);
               }
               i.updateURL();
            },
            forEach: function (e) {
               for (
                  var t,
                     n = Or(this).entries,
                     i = rt(e, arguments.length > 1 ? arguments[1] : void 0, 3),
                     r = 0;
                  r < n.length;

               )
                  i((t = n[r++]).value, t.key, this);
            },
            keys: function () {
               return new zr(this, "keys");
            },
            values: function () {
               return new zr(this, "values");
            },
            entries: function () {
               return new zr(this, "entries");
            },
         },
         { enumerable: !0 }
      ),
         ee(Kr, Pr, Kr.entries),
         ee(
            Kr,
            "toString",
            function () {
               for (var e, t = Or(this).entries, n = [], i = 0; i < t.length; )
                  (e = t[i++]), n.push(qr(e.key) + "=" + qr(e.value));
               return n.join("&");
            },
            { enumerable: !0 }
         ),
         nt(Wr, "URLSearchParams"),
         Oe({ global: !0, forced: !rr }, { URLSearchParams: Wr }),
         rr ||
            "function" != typeof xr ||
            "function" != typeof Cr ||
            Oe(
               { global: !0, enumerable: !0, forced: !0 },
               {
                  fetch: function (e) {
                     var t,
                        n,
                        i,
                        r = [e];
                     return (
                        arguments.length > 1 &&
                           ((t = arguments[1]),
                           g(t) &&
                              ((n = t.body),
                              "URLSearchParams" === ni(n) &&
                                 ((i = t.headers
                                    ? new Cr(t.headers)
                                    : new Cr()).has("content-type") ||
                                    i.set(
                                       "content-type",
                                       "application/x-www-form-urlencoded;charset=UTF-8"
                                    ),
                                 (t = Be(t, {
                                    body: c(0, String(n)),
                                    headers: c(0, i),
                                 })))),
                           r.push(t)),
                        xr.apply(this, r)
                     );
                  },
               }
            );
      var $r,
         Yr = { URLSearchParams: Wr, getState: Or },
         Gr = bi.codeAt,
         Xr = i.URL,
         Qr = Yr.URLSearchParams,
         Jr = Yr.getState,
         Zr = Z.set,
         ea = Z.getterFor("URL"),
         ta = Math.floor,
         na = Math.pow,
         ia = /[A-Za-z]/,
         ra = /[\d+\-.A-Za-z]/,
         aa = /\d/,
         oa = /^(0x|0X)/,
         sa = /^[0-7]+$/,
         la = /^\d+$/,
         ca = /^[\dA-Fa-f]+$/,
         ua = /[\u0000\u0009\u000A\u000D #%/:?@[\\]]/,
         ha = /[\u0000\u0009\u000A\u000D #/:?@[\\]]/,
         fa = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g,
         da = /[\u0009\u000A\u000D]/g,
         pa = function (e, t) {
            var n, i, r;
            if ("[" == t.charAt(0)) {
               if ("]" != t.charAt(t.length - 1)) return "Invalid host";
               if (!(n = ga(t.slice(1, -1)))) return "Invalid host";
               e.host = n;
            } else if (Ea(e)) {
               if (
                  ((t = (function (e) {
                     var t,
                        n,
                        i = [],
                        r = e.toLowerCase().replace(vr, ".").split(".");
                     for (t = 0; t < r.length; t++)
                        (n = r[t]), i.push(gr.test(n) ? "xn--" + Sr(n) : n);
                     return i.join(".");
                  })(t)),
                  ua.test(t))
               )
                  return "Invalid host";
               if (null === (n = ma(t))) return "Invalid host";
               e.host = n;
            } else {
               if (ha.test(t)) return "Invalid host";
               for (n = "", i = mr(t), r = 0; r < i.length; r++)
                  n += Ta(i[r], ya);
               e.host = n;
            }
         },
         ma = function (e) {
            var t,
               n,
               i,
               r,
               a,
               o,
               s,
               l = e.split(".");
            if (
               (l.length && "" == l[l.length - 1] && l.pop(),
               (t = l.length) > 4)
            )
               return e;
            for (n = [], i = 0; i < t; i++) {
               if ("" == (r = l[i])) return e;
               if (
                  ((a = 10),
                  r.length > 1 &&
                     "0" == r.charAt(0) &&
                     ((a = oa.test(r) ? 16 : 8), (r = r.slice(8 == a ? 1 : 2))),
                  "" === r)
               )
                  o = 0;
               else {
                  if (!(10 == a ? la : 8 == a ? sa : ca).test(r)) return e;
                  o = parseInt(r, a);
               }
               n.push(o);
            }
            for (i = 0; i < t; i++)
               if (((o = n[i]), i == t - 1)) {
                  if (o >= na(256, 5 - t)) return null;
               } else if (o > 255) return null;
            for (s = n.pop(), i = 0; i < n.length; i++)
               s += n[i] * na(256, 3 - i);
            return s;
         },
         ga = function (e) {
            var t,
               n,
               i,
               r,
               a,
               o,
               s,
               l = [0, 0, 0, 0, 0, 0, 0, 0],
               c = 0,
               u = null,
               h = 0,
               f = function () {
                  return e.charAt(h);
               };
            if (":" == f()) {
               if (":" != e.charAt(1)) return;
               (h += 2), (u = ++c);
            }
            for (; f(); ) {
               if (8 == c) return;
               if (":" != f()) {
                  for (t = n = 0; n < 4 && ca.test(f()); )
                     (t = 16 * t + parseInt(f(), 16)), h++, n++;
                  if ("." == f()) {
                     if (0 == n) return;
                     if (((h -= n), c > 6)) return;
                     for (i = 0; f(); ) {
                        if (((r = null), i > 0)) {
                           if (!("." == f() && i < 4)) return;
                           h++;
                        }
                        if (!aa.test(f())) return;
                        for (; aa.test(f()); ) {
                           if (((a = parseInt(f(), 10)), null === r)) r = a;
                           else {
                              if (0 == r) return;
                              r = 10 * r + a;
                           }
                           if (r > 255) return;
                           h++;
                        }
                        (l[c] = 256 * l[c] + r), (2 != ++i && 4 != i) || c++;
                     }
                     if (4 != i) return;
                     break;
                  }
                  if (":" == f()) {
                     if ((h++, !f())) return;
                  } else if (f()) return;
                  l[c++] = t;
               } else {
                  if (null !== u) return;
                  h++, (u = ++c);
               }
            }
            if (null !== u)
               for (o = c - u, c = 7; 0 != c && o > 0; )
                  (s = l[c]), (l[c--] = l[u + o - 1]), (l[u + --o] = s);
            else if (8 != c) return;
            return l;
         },
         va = function (e) {
            var t, n, i, r;
            if ("number" == typeof e) {
               for (t = [], n = 0; n < 4; n++)
                  t.unshift(e % 256), (e = ta(e / 256));
               return t.join(".");
            }
            if ("object" == typeof e) {
               for (
                  t = "",
                     i = (function (e) {
                        for (
                           var t = null, n = 1, i = null, r = 0, a = 0;
                           a < 8;
                           a++
                        )
                           0 !== e[a]
                              ? (r > n && ((t = i), (n = r)),
                                (i = null),
                                (r = 0))
                              : (null === i && (i = a), ++r);
                        return r > n && ((t = i), (n = r)), t;
                     })(e),
                     n = 0;
                  n < 8;
                  n++
               )
                  (r && 0 === e[n]) ||
                     (r && (r = !1),
                     i === n
                        ? ((t += n ? ":" : "::"), (r = !0))
                        : ((t += e[n].toString(16)), n < 7 && (t += ":")));
               return "[" + t + "]";
            }
            return e;
         },
         ya = {},
         ba = lr({}, ya, { " ": 1, '"': 1, "<": 1, ">": 1, "`": 1 }),
         wa = lr({}, ba, { "#": 1, "?": 1, "{": 1, "}": 1 }),
         ka = lr({}, wa, {
            "/": 1,
            ":": 1,
            ";": 1,
            "=": 1,
            "@": 1,
            "[": 1,
            "\\": 1,
            "]": 1,
            "^": 1,
            "|": 1,
         }),
         Ta = function (e, t) {
            var n = Gr(e, 0);
            return n > 32 && n < 127 && !b(t, e) ? e : encodeURIComponent(e);
         },
         Sa = { ftp: 21, file: null, http: 80, https: 443, ws: 80, wss: 443 },
         Ea = function (e) {
            return b(Sa, e.scheme);
         },
         Aa = function (e) {
            return "" != e.username || "" != e.password;
         },
         xa = function (e) {
            return !e.host || e.cannotBeABaseURL || "file" == e.scheme;
         },
         Ca = function (e, t) {
            var n;
            return (
               2 == e.length &&
               ia.test(e.charAt(0)) &&
               (":" == (n = e.charAt(1)) || (!t && "|" == n))
            );
         },
         Pa = function (e) {
            var t;
            return (
               e.length > 1 &&
               Ca(e.slice(0, 2)) &&
               (2 == e.length ||
                  "/" === (t = e.charAt(2)) ||
                  "\\" === t ||
                  "?" === t ||
                  "#" === t)
            );
         },
         Ia = function (e) {
            var t = e.path,
               n = t.length;
            !n || ("file" == e.scheme && 1 == n && Ca(t[0], !0)) || t.pop();
         },
         Oa = function (e) {
            return "." === e || "%2e" === e.toLowerCase();
         },
         La = {},
         ja = {},
         Ma = {},
         Na = {},
         Ra = {},
         _a = {},
         Ua = {},
         Fa = {},
         Da = {},
         qa = {},
         Ha = {},
         Ba = {},
         Va = {},
         za = {},
         Wa = {},
         Ka = {},
         $a = {},
         Ya = {},
         Ga = {},
         Xa = {},
         Qa = {},
         Ja = function (e, t, n, i) {
            var r,
               a,
               o,
               s,
               l,
               c = n || La,
               u = 0,
               h = "",
               f = !1,
               d = !1,
               p = !1;
            for (
               n ||
                  ((e.scheme = ""),
                  (e.username = ""),
                  (e.password = ""),
                  (e.host = null),
                  (e.port = null),
                  (e.path = []),
                  (e.query = null),
                  (e.fragment = null),
                  (e.cannotBeABaseURL = !1),
                  (t = t.replace(fa, ""))),
                  t = t.replace(da, ""),
                  r = mr(t);
               u <= r.length;

            ) {
               switch (((a = r[u]), c)) {
                  case La:
                     if (!a || !ia.test(a)) {
                        if (n) return "Invalid scheme";
                        c = Ma;
                        continue;
                     }
                     (h += a.toLowerCase()), (c = ja);
                     break;
                  case ja:
                     if (a && (ra.test(a) || "+" == a || "-" == a || "." == a))
                        h += a.toLowerCase();
                     else {
                        if (":" != a) {
                           if (n) return "Invalid scheme";
                           (h = ""), (c = Ma), (u = 0);
                           continue;
                        }
                        if (
                           n &&
                           (Ea(e) != b(Sa, h) ||
                              ("file" == h && (Aa(e) || null !== e.port)) ||
                              ("file" == e.scheme && !e.host))
                        )
                           return;
                        if (((e.scheme = h), n))
                           return void (
                              Ea(e) &&
                              Sa[e.scheme] == e.port &&
                              (e.port = null)
                           );
                        (h = ""),
                           "file" == e.scheme
                              ? (c = za)
                              : Ea(e) && i && i.scheme == e.scheme
                              ? (c = Na)
                              : Ea(e)
                              ? (c = Fa)
                              : "/" == r[u + 1]
                              ? ((c = Ra), u++)
                              : ((e.cannotBeABaseURL = !0),
                                e.path.push(""),
                                (c = Ga));
                     }
                     break;
                  case Ma:
                     if (!i || (i.cannotBeABaseURL && "#" != a))
                        return "Invalid scheme";
                     if (i.cannotBeABaseURL && "#" == a) {
                        (e.scheme = i.scheme),
                           (e.path = i.path.slice()),
                           (e.query = i.query),
                           (e.fragment = ""),
                           (e.cannotBeABaseURL = !0),
                           (c = Qa);
                        break;
                     }
                     c = "file" == i.scheme ? za : _a;
                     continue;
                  case Na:
                     if ("/" != a || "/" != r[u + 1]) {
                        c = _a;
                        continue;
                     }
                     (c = Da), u++;
                     break;
                  case Ra:
                     if ("/" == a) {
                        c = qa;
                        break;
                     }
                     c = Ya;
                     continue;
                  case _a:
                     if (((e.scheme = i.scheme), a == $r))
                        (e.username = i.username),
                           (e.password = i.password),
                           (e.host = i.host),
                           (e.port = i.port),
                           (e.path = i.path.slice()),
                           (e.query = i.query);
                     else if ("/" == a || ("\\" == a && Ea(e))) c = Ua;
                     else if ("?" == a)
                        (e.username = i.username),
                           (e.password = i.password),
                           (e.host = i.host),
                           (e.port = i.port),
                           (e.path = i.path.slice()),
                           (e.query = ""),
                           (c = Xa);
                     else {
                        if ("#" != a) {
                           (e.username = i.username),
                              (e.password = i.password),
                              (e.host = i.host),
                              (e.port = i.port),
                              (e.path = i.path.slice()),
                              e.path.pop(),
                              (c = Ya);
                           continue;
                        }
                        (e.username = i.username),
                           (e.password = i.password),
                           (e.host = i.host),
                           (e.port = i.port),
                           (e.path = i.path.slice()),
                           (e.query = i.query),
                           (e.fragment = ""),
                           (c = Qa);
                     }
                     break;
                  case Ua:
                     if (!Ea(e) || ("/" != a && "\\" != a)) {
                        if ("/" != a) {
                           (e.username = i.username),
                              (e.password = i.password),
                              (e.host = i.host),
                              (e.port = i.port),
                              (c = Ya);
                           continue;
                        }
                        c = qa;
                     } else c = Da;
                     break;
                  case Fa:
                     if (((c = Da), "/" != a || "/" != h.charAt(u + 1)))
                        continue;
                     u++;
                     break;
                  case Da:
                     if ("/" != a && "\\" != a) {
                        c = qa;
                        continue;
                     }
                     break;
                  case qa:
                     if ("@" == a) {
                        f && (h = "%40" + h), (f = !0), (o = mr(h));
                        for (var m = 0; m < o.length; m++) {
                           var g = o[m];
                           if (":" != g || p) {
                              var v = Ta(g, ka);
                              p ? (e.password += v) : (e.username += v);
                           } else p = !0;
                        }
                        h = "";
                     } else if (
                        a == $r ||
                        "/" == a ||
                        "?" == a ||
                        "#" == a ||
                        ("\\" == a && Ea(e))
                     ) {
                        if (f && "" == h) return "Invalid authority";
                        (u -= mr(h).length + 1), (h = ""), (c = Ha);
                     } else h += a;
                     break;
                  case Ha:
                  case Ba:
                     if (n && "file" == e.scheme) {
                        c = Ka;
                        continue;
                     }
                     if (":" != a || d) {
                        if (
                           a == $r ||
                           "/" == a ||
                           "?" == a ||
                           "#" == a ||
                           ("\\" == a && Ea(e))
                        ) {
                           if (Ea(e) && "" == h) return "Invalid host";
                           if (n && "" == h && (Aa(e) || null !== e.port))
                              return;
                           if ((s = pa(e, h))) return s;
                           if (((h = ""), (c = $a), n)) return;
                           continue;
                        }
                        "[" == a ? (d = !0) : "]" == a && (d = !1), (h += a);
                     } else {
                        if ("" == h) return "Invalid host";
                        if ((s = pa(e, h))) return s;
                        if (((h = ""), (c = Va), n == Ba)) return;
                     }
                     break;
                  case Va:
                     if (!aa.test(a)) {
                        if (
                           a == $r ||
                           "/" == a ||
                           "?" == a ||
                           "#" == a ||
                           ("\\" == a && Ea(e)) ||
                           n
                        ) {
                           if ("" != h) {
                              var y = parseInt(h, 10);
                              if (y > 65535) return "Invalid port";
                              (e.port = Ea(e) && y === Sa[e.scheme] ? null : y),
                                 (h = "");
                           }
                           if (n) return;
                           c = $a;
                           continue;
                        }
                        return "Invalid port";
                     }
                     h += a;
                     break;
                  case za:
                     if (((e.scheme = "file"), "/" == a || "\\" == a)) c = Wa;
                     else {
                        if (!i || "file" != i.scheme) {
                           c = Ya;
                           continue;
                        }
                        if (a == $r)
                           (e.host = i.host),
                              (e.path = i.path.slice()),
                              (e.query = i.query);
                        else if ("?" == a)
                           (e.host = i.host),
                              (e.path = i.path.slice()),
                              (e.query = ""),
                              (c = Xa);
                        else {
                           if ("#" != a) {
                              Pa(r.slice(u).join("")) ||
                                 ((e.host = i.host),
                                 (e.path = i.path.slice()),
                                 Ia(e)),
                                 (c = Ya);
                              continue;
                           }
                           (e.host = i.host),
                              (e.path = i.path.slice()),
                              (e.query = i.query),
                              (e.fragment = ""),
                              (c = Qa);
                        }
                     }
                     break;
                  case Wa:
                     if ("/" == a || "\\" == a) {
                        c = Ka;
                        break;
                     }
                     i &&
                        "file" == i.scheme &&
                        !Pa(r.slice(u).join("")) &&
                        (Ca(i.path[0], !0)
                           ? e.path.push(i.path[0])
                           : (e.host = i.host)),
                        (c = Ya);
                     continue;
                  case Ka:
                     if (
                        a == $r ||
                        "/" == a ||
                        "\\" == a ||
                        "?" == a ||
                        "#" == a
                     ) {
                        if (!n && Ca(h)) c = Ya;
                        else if ("" == h) {
                           if (((e.host = ""), n)) return;
                           c = $a;
                        } else {
                           if ((s = pa(e, h))) return s;
                           if (("localhost" == e.host && (e.host = ""), n))
                              return;
                           (h = ""), (c = $a);
                        }
                        continue;
                     }
                     h += a;
                     break;
                  case $a:
                     if (Ea(e)) {
                        if (((c = Ya), "/" != a && "\\" != a)) continue;
                     } else if (n || "?" != a)
                        if (n || "#" != a) {
                           if (a != $r && ((c = Ya), "/" != a)) continue;
                        } else (e.fragment = ""), (c = Qa);
                     else (e.query = ""), (c = Xa);
                     break;
                  case Ya:
                     if (
                        a == $r ||
                        "/" == a ||
                        ("\\" == a && Ea(e)) ||
                        (!n && ("?" == a || "#" == a))
                     ) {
                        if (
                           (".." === (l = (l = h).toLowerCase()) ||
                           "%2e." === l ||
                           ".%2e" === l ||
                           "%2e%2e" === l
                              ? (Ia(e),
                                "/" == a ||
                                   ("\\" == a && Ea(e)) ||
                                   e.path.push(""))
                              : Oa(h)
                              ? "/" == a ||
                                ("\\" == a && Ea(e)) ||
                                e.path.push("")
                              : ("file" == e.scheme &&
                                   !e.path.length &&
                                   Ca(h) &&
                                   (e.host && (e.host = ""),
                                   (h = h.charAt(0) + ":")),
                                e.path.push(h)),
                           (h = ""),
                           "file" == e.scheme &&
                              (a == $r || "?" == a || "#" == a))
                        )
                           for (; e.path.length > 1 && "" === e.path[0]; )
                              e.path.shift();
                        "?" == a
                           ? ((e.query = ""), (c = Xa))
                           : "#" == a && ((e.fragment = ""), (c = Qa));
                     } else h += Ta(a, wa);
                     break;
                  case Ga:
                     "?" == a
                        ? ((e.query = ""), (c = Xa))
                        : "#" == a
                        ? ((e.fragment = ""), (c = Qa))
                        : a != $r && (e.path[0] += Ta(a, ya));
                     break;
                  case Xa:
                     n || "#" != a
                        ? a != $r &&
                          ("'" == a && Ea(e)
                             ? (e.query += "%27")
                             : (e.query += "#" == a ? "%23" : Ta(a, ya)))
                        : ((e.fragment = ""), (c = Qa));
                     break;
                  case Qa:
                     a != $r && (e.fragment += Ta(a, ba));
               }
               u++;
            }
         },
         Za = function (e) {
            var t,
               n,
               i = ar(this, Za, "URL"),
               r = arguments.length > 1 ? arguments[1] : void 0,
               o = String(e),
               s = Zr(i, { type: "URL" });
            if (void 0 !== r)
               if (r instanceof Za) t = ea(r);
               else if ((n = Ja((t = {}), String(r)))) throw TypeError(n);
            if ((n = Ja(s, o, null, t))) throw TypeError(n);
            var l = (s.searchParams = new Qr()),
               c = Jr(l);
            c.updateSearchParams(s.query),
               (c.updateURL = function () {
                  s.query = String(l) || null;
               }),
               a ||
                  ((i.href = to.call(i)),
                  (i.origin = no.call(i)),
                  (i.protocol = io.call(i)),
                  (i.username = ro.call(i)),
                  (i.password = ao.call(i)),
                  (i.host = oo.call(i)),
                  (i.hostname = so.call(i)),
                  (i.port = lo.call(i)),
                  (i.pathname = co.call(i)),
                  (i.search = uo.call(i)),
                  (i.searchParams = ho.call(i)),
                  (i.hash = fo.call(i)));
         },
         eo = Za.prototype,
         to = function () {
            var e = ea(this),
               t = e.scheme,
               n = e.username,
               i = e.password,
               r = e.host,
               a = e.port,
               o = e.path,
               s = e.query,
               l = e.fragment,
               c = t + ":";
            return (
               null !== r
                  ? ((c += "//"),
                    Aa(e) && (c += n + (i ? ":" + i : "") + "@"),
                    (c += va(r)),
                    null !== a && (c += ":" + a))
                  : "file" == t && (c += "//"),
               (c += e.cannotBeABaseURL
                  ? o[0]
                  : o.length
                  ? "/" + o.join("/")
                  : ""),
               null !== s && (c += "?" + s),
               null !== l && (c += "#" + l),
               c
            );
         },
         no = function () {
            var e = ea(this),
               t = e.scheme,
               n = e.port;
            if ("blob" == t)
               try {
                  return new URL(t.path[0]).origin;
               } catch (e) {
                  return "null";
               }
            return "file" != t && Ea(e)
               ? t + "://" + va(e.host) + (null !== n ? ":" + n : "")
               : "null";
         },
         io = function () {
            return ea(this).scheme + ":";
         },
         ro = function () {
            return ea(this).username;
         },
         ao = function () {
            return ea(this).password;
         },
         oo = function () {
            var e = ea(this),
               t = e.host,
               n = e.port;
            return null === t ? "" : null === n ? va(t) : va(t) + ":" + n;
         },
         so = function () {
            var e = ea(this).host;
            return null === e ? "" : va(e);
         },
         lo = function () {
            var e = ea(this).port;
            return null === e ? "" : String(e);
         },
         co = function () {
            var e = ea(this),
               t = e.path;
            return e.cannotBeABaseURL
               ? t[0]
               : t.length
               ? "/" + t.join("/")
               : "";
         },
         uo = function () {
            var e = ea(this).query;
            return e ? "?" + e : "";
         },
         ho = function () {
            return ea(this).searchParams;
         },
         fo = function () {
            var e = ea(this).fragment;
            return e ? "#" + e : "";
         },
         po = function (e, t) {
            return { get: e, set: t, configurable: !0, enumerable: !0 };
         };
      if (
         (a &&
            _e(eo, {
               href: po(to, function (e) {
                  var t = ea(this),
                     n = String(e),
                     i = Ja(t, n);
                  if (i) throw TypeError(i);
                  Jr(t.searchParams).updateSearchParams(t.query);
               }),
               origin: po(no),
               protocol: po(io, function (e) {
                  var t = ea(this);
                  Ja(t, String(e) + ":", La);
               }),
               username: po(ro, function (e) {
                  var t = ea(this),
                     n = mr(String(e));
                  if (!xa(t)) {
                     t.username = "";
                     for (var i = 0; i < n.length; i++)
                        t.username += Ta(n[i], ka);
                  }
               }),
               password: po(ao, function (e) {
                  var t = ea(this),
                     n = mr(String(e));
                  if (!xa(t)) {
                     t.password = "";
                     for (var i = 0; i < n.length; i++)
                        t.password += Ta(n[i], ka);
                  }
               }),
               host: po(oo, function (e) {
                  var t = ea(this);
                  t.cannotBeABaseURL || Ja(t, String(e), Ha);
               }),
               hostname: po(so, function (e) {
                  var t = ea(this);
                  t.cannotBeABaseURL || Ja(t, String(e), Ba);
               }),
               port: po(lo, function (e) {
                  var t = ea(this);
                  xa(t) ||
                     ("" == (e = String(e)) ? (t.port = null) : Ja(t, e, Va));
               }),
               pathname: po(co, function (e) {
                  var t = ea(this);
                  t.cannotBeABaseURL || ((t.path = []), Ja(t, e + "", $a));
               }),
               search: po(uo, function (e) {
                  var t = ea(this);
                  "" == (e = String(e))
                     ? (t.query = null)
                     : ("?" == e.charAt(0) && (e = e.slice(1)),
                       (t.query = ""),
                       Ja(t, e, Xa)),
                     Jr(t.searchParams).updateSearchParams(t.query);
               }),
               searchParams: po(ho),
               hash: po(fo, function (e) {
                  var t = ea(this);
                  "" != (e = String(e))
                     ? ("#" == e.charAt(0) && (e = e.slice(1)),
                       (t.fragment = ""),
                       Ja(t, e, Qa))
                     : (t.fragment = null);
               }),
            }),
         ee(
            eo,
            "toJSON",
            function () {
               return to.call(this);
            },
            { enumerable: !0 }
         ),
         ee(
            eo,
            "toString",
            function () {
               return to.call(this);
            },
            { enumerable: !0 }
         ),
         Xr)
      ) {
         var mo = Xr.createObjectURL,
            go = Xr.revokeObjectURL;
         mo &&
            ee(Za, "createObjectURL", function (e) {
               return mo.apply(Xr, arguments);
            }),
            go &&
               ee(Za, "revokeObjectURL", function (e) {
                  return go.apply(Xr, arguments);
               });
      }
      function vo(e) {
         return (vo =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
               ? function (e) {
                    return typeof e;
                 }
               : function (e) {
                    return e &&
                       "function" == typeof Symbol &&
                       e.constructor === Symbol &&
                       e !== Symbol.prototype
                       ? "symbol"
                       : typeof e;
                 })(e);
      }
      function yo(e, t) {
         if (!(e instanceof t))
            throw new TypeError("Cannot call a class as a function");
      }
      function bo(e, t) {
         for (var n = 0; n < t.length; n++) {
            var i = t[n];
            (i.enumerable = i.enumerable || !1),
               (i.configurable = !0),
               "value" in i && (i.writable = !0),
               Object.defineProperty(e, i.key, i);
         }
      }
      function wo(e, t, n) {
         return t && bo(e.prototype, t), n && bo(e, n), e;
      }
      function ko(e, t, n) {
         return (
            t in e
               ? Object.defineProperty(e, t, {
                    value: n,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                 })
               : (e[t] = n),
            e
         );
      }
      function To(e, t) {
         var n = Object.keys(e);
         if (Object.getOwnPropertySymbols) {
            var i = Object.getOwnPropertySymbols(e);
            t &&
               (i = i.filter(function (t) {
                  return Object.getOwnPropertyDescriptor(e, t).enumerable;
               })),
               n.push.apply(n, i);
         }
         return n;
      }
      function So(e) {
         for (var t = 1; t < arguments.length; t++) {
            var n = null != arguments[t] ? arguments[t] : {};
            t % 2
               ? To(Object(n), !0).forEach(function (t) {
                    ko(e, t, n[t]);
                 })
               : Object.getOwnPropertyDescriptors
               ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
               : To(Object(n)).forEach(function (t) {
                    Object.defineProperty(
                       e,
                       t,
                       Object.getOwnPropertyDescriptor(n, t)
                    );
                 });
         }
         return e;
      }
      function Eo(e, t) {
         return (
            (function (e) {
               if (Array.isArray(e)) return e;
            })(e) ||
            (function (e, t) {
               if (
                  !(
                     Symbol.iterator in Object(e) ||
                     "[object Arguments]" === Object.prototype.toString.call(e)
                  )
               )
                  return;
               var n = [],
                  i = !0,
                  r = !1,
                  a = void 0;
               try {
                  for (
                     var o, s = e[Symbol.iterator]();
                     !(i = (o = s.next()).done) &&
                     (n.push(o.value), !t || n.length !== t);
                     i = !0
                  );
               } catch (e) {
                  (r = !0), (a = e);
               } finally {
                  try {
                     i || null == s.return || s.return();
                  } finally {
                     if (r) throw a;
                  }
               }
               return n;
            })(e, t) ||
            (function () {
               throw new TypeError(
                  "Invalid attempt to destructure non-iterable instance"
               );
            })()
         );
      }
      function Ao(e) {
         return (
            (function (e) {
               if (Array.isArray(e)) {
                  for (var t = 0, n = new Array(e.length); t < e.length; t++)
                     n[t] = e[t];
                  return n;
               }
            })(e) ||
            (function (e) {
               if (
                  Symbol.iterator in Object(e) ||
                  "[object Arguments]" === Object.prototype.toString.call(e)
               )
                  return Array.from(e);
            })(e) ||
            (function () {
               throw new TypeError(
                  "Invalid attempt to spread non-iterable instance"
               );
            })()
         );
      }
      nt(Za, "URL"),
         Oe({ global: !0, forced: !rr, sham: !a }, { URL: Za }),
         (function (e) {
            var t = (function () {
                  try {
                     return !!Symbol.iterator;
                  } catch (e) {
                     return !1;
                  }
               })(),
               n = function (e) {
                  var n = {
                     next: function () {
                        var t = e.shift();
                        return { done: void 0 === t, value: t };
                     },
                  };
                  return (
                     t &&
                        (n[Symbol.iterator] = function () {
                           return n;
                        }),
                     n
                  );
               },
               i = function (e) {
                  return encodeURIComponent(e).replace(/%20/g, "+");
               },
               r = function (e) {
                  return decodeURIComponent(String(e).replace(/\+/g, " "));
               };
            (function () {
               try {
                  var t = e.URLSearchParams;
                  return (
                     "a=1" === new t("?a=1").toString() &&
                     "function" == typeof t.prototype.set
                  );
               } catch (e) {
                  return !1;
               }
            })() ||
               (function () {
                  var r = function e(t) {
                        Object.defineProperty(this, "_entries", {
                           writable: !0,
                           value: {},
                        });
                        var n = vo(t);
                        if ("undefined" === n);
                        else if ("string" === n)
                           "" !== t && this._fromString(t);
                        else if (t instanceof e) {
                           var i = this;
                           t.forEach(function (e, t) {
                              i.append(t, e);
                           });
                        } else {
                           if (null === t || "object" !== n)
                              throw new TypeError(
                                 "Unsupported input's type for URLSearchParams"
                              );
                           if (
                              "[object Array]" ===
                              Object.prototype.toString.call(t)
                           )
                              for (var r = 0; r < t.length; r++) {
                                 var a = t[r];
                                 if (
                                    "[object Array]" !==
                                       Object.prototype.toString.call(a) &&
                                    2 === a.length
                                 )
                                    throw new TypeError(
                                       "Expected [string, any] as entry at index " +
                                          r +
                                          " of URLSearchParams's input"
                                    );
                                 this.append(a[0], a[1]);
                              }
                           else
                              for (var o in t)
                                 t.hasOwnProperty(o) && this.append(o, t[o]);
                        }
                     },
                     a = r.prototype;
                  (a.append = function (e, t) {
                     e in this._entries
                        ? this._entries[e].push(String(t))
                        : (this._entries[e] = [String(t)]);
                  }),
                     (a.delete = function (e) {
                        delete this._entries[e];
                     }),
                     (a.get = function (e) {
                        return e in this._entries ? this._entries[e][0] : null;
                     }),
                     (a.getAll = function (e) {
                        return e in this._entries
                           ? this._entries[e].slice(0)
                           : [];
                     }),
                     (a.has = function (e) {
                        return e in this._entries;
                     }),
                     (a.set = function (e, t) {
                        this._entries[e] = [String(t)];
                     }),
                     (a.forEach = function (e, t) {
                        var n;
                        for (var i in this._entries)
                           if (this._entries.hasOwnProperty(i)) {
                              n = this._entries[i];
                              for (var r = 0; r < n.length; r++)
                                 e.call(t, n[r], i, this);
                           }
                     }),
                     (a.keys = function () {
                        var e = [];
                        return (
                           this.forEach(function (t, n) {
                              e.push(n);
                           }),
                           n(e)
                        );
                     }),
                     (a.values = function () {
                        var e = [];
                        return (
                           this.forEach(function (t) {
                              e.push(t);
                           }),
                           n(e)
                        );
                     }),
                     (a.entries = function () {
                        var e = [];
                        return (
                           this.forEach(function (t, n) {
                              e.push([n, t]);
                           }),
                           n(e)
                        );
                     }),
                     t && (a[Symbol.iterator] = a.entries),
                     (a.toString = function () {
                        var e = [];
                        return (
                           this.forEach(function (t, n) {
                              e.push(i(n) + "=" + i(t));
                           }),
                           e.join("&")
                        );
                     }),
                     (e.URLSearchParams = r);
               })();
            var a = e.URLSearchParams.prototype;
            "function" != typeof a.sort &&
               (a.sort = function () {
                  var e = this,
                     t = [];
                  this.forEach(function (n, i) {
                     t.push([i, n]), e._entries || e.delete(i);
                  }),
                     t.sort(function (e, t) {
                        return e[0] < t[0] ? -1 : e[0] > t[0] ? 1 : 0;
                     }),
                     e._entries && (e._entries = {});
                  for (var n = 0; n < t.length; n++)
                     this.append(t[n][0], t[n][1]);
               }),
               "function" != typeof a._fromString &&
                  Object.defineProperty(a, "_fromString", {
                     enumerable: !1,
                     configurable: !1,
                     writable: !1,
                     value: function (e) {
                        if (this._entries) this._entries = {};
                        else {
                           var t = [];
                           this.forEach(function (e, n) {
                              t.push(n);
                           });
                           for (var n = 0; n < t.length; n++) this.delete(t[n]);
                        }
                        var i,
                           a = (e = e.replace(/^\?/, "")).split("&");
                        for (n = 0; n < a.length; n++)
                           (i = a[n].split("=")),
                              this.append(r(i[0]), i.length > 1 ? r(i[1]) : "");
                     },
                  });
         })(
            void 0 !== e
               ? e
               : "undefined" != typeof window
               ? window
               : "undefined" != typeof self
               ? self
               : e
         ),
         (function (e) {
            if (
               ((function () {
                  try {
                     var t = new e.URL("b", "http://a");
                     return (
                        (t.pathname = "c d"),
                        "http://a/c%20d" === t.href && t.searchParams
                     );
                  } catch (e) {
                     return !1;
                  }
               })() ||
                  (function () {
                     var t = e.URL,
                        n = function (t, n) {
                           "string" != typeof t && (t = String(t));
                           var i,
                              r = document;
                           if (
                              n &&
                              (void 0 === e.location || n !== e.location.href)
                           ) {
                              ((i = (r = document.implementation.createHTMLDocument(
                                 ""
                              )).createElement("base")).href = n),
                                 r.head.appendChild(i);
                              try {
                                 if (0 !== i.href.indexOf(n))
                                    throw new Error(i.href);
                              } catch (e) {
                                 throw new Error(
                                    "URL unable to set base " +
                                       n +
                                       " due to " +
                                       e
                                 );
                              }
                           }
                           var a = r.createElement("a");
                           if (
                              ((a.href = t),
                              i && (r.body.appendChild(a), (a.href = a.href)),
                              ":" === a.protocol || !/:/.test(a.href))
                           )
                              throw new TypeError("Invalid URL");
                           Object.defineProperty(this, "_anchorElement", {
                              value: a,
                           });
                           var o = new e.URLSearchParams(this.search),
                              s = !0,
                              l = !0,
                              c = this;
                           ["append", "delete", "set"].forEach(function (e) {
                              var t = o[e];
                              o[e] = function () {
                                 t.apply(o, arguments),
                                    s &&
                                       ((l = !1),
                                       (c.search = o.toString()),
                                       (l = !0));
                              };
                           }),
                              Object.defineProperty(this, "searchParams", {
                                 value: o,
                                 enumerable: !0,
                              });
                           var u = void 0;
                           Object.defineProperty(this, "_updateSearchParams", {
                              enumerable: !1,
                              configurable: !1,
                              writable: !1,
                              value: function () {
                                 this.search !== u &&
                                    ((u = this.search),
                                    l &&
                                       ((s = !1),
                                       this.searchParams._fromString(
                                          this.search
                                       ),
                                       (s = !0)));
                              },
                           });
                        },
                        i = n.prototype;
                     ["hash", "host", "hostname", "port", "protocol"].forEach(
                        function (e) {
                           !(function (e) {
                              Object.defineProperty(i, e, {
                                 get: function () {
                                    return this._anchorElement[e];
                                 },
                                 set: function (t) {
                                    this._anchorElement[e] = t;
                                 },
                                 enumerable: !0,
                              });
                           })(e);
                        }
                     ),
                        Object.defineProperty(i, "search", {
                           get: function () {
                              return this._anchorElement.search;
                           },
                           set: function (e) {
                              (this._anchorElement.search = e),
                                 this._updateSearchParams();
                           },
                           enumerable: !0,
                        }),
                        Object.defineProperties(i, {
                           toString: {
                              get: function () {
                                 var e = this;
                                 return function () {
                                    return e.href;
                                 };
                              },
                           },
                           href: {
                              get: function () {
                                 return this._anchorElement.href.replace(
                                    /\?$/,
                                    ""
                                 );
                              },
                              set: function (e) {
                                 (this._anchorElement.href = e),
                                    this._updateSearchParams();
                              },
                              enumerable: !0,
                           },
                           pathname: {
                              get: function () {
                                 return this._anchorElement.pathname.replace(
                                    /(^\/?)/,
                                    "/"
                                 );
                              },
                              set: function (e) {
                                 this._anchorElement.pathname = e;
                              },
                              enumerable: !0,
                           },
                           origin: {
                              get: function () {
                                 var e = {
                                       "http:": 80,
                                       "https:": 443,
                                       "ftp:": 21,
                                    }[this._anchorElement.protocol],
                                    t =
                                       this._anchorElement.port != e &&
                                       "" !== this._anchorElement.port;
                                 return (
                                    this._anchorElement.protocol +
                                    "//" +
                                    this._anchorElement.hostname +
                                    (t ? ":" + this._anchorElement.port : "")
                                 );
                              },
                              enumerable: !0,
                           },
                           password: {
                              get: function () {
                                 return "";
                              },
                              set: function (e) {},
                              enumerable: !0,
                           },
                           username: {
                              get: function () {
                                 return "";
                              },
                              set: function (e) {},
                              enumerable: !0,
                           },
                        }),
                        (n.createObjectURL = function (e) {
                           return t.createObjectURL.apply(t, arguments);
                        }),
                        (n.revokeObjectURL = function (e) {
                           return t.revokeObjectURL.apply(t, arguments);
                        }),
                        (e.URL = n);
                  })(),
               void 0 !== e.location && !("origin" in e.location))
            ) {
               var t = function () {
                  return (
                     e.location.protocol +
                     "//" +
                     e.location.hostname +
                     (e.location.port ? ":" + e.location.port : "")
                  );
               };
               try {
                  Object.defineProperty(e.location, "origin", {
                     get: t,
                     enumerable: !0,
                  });
               } catch (n) {
                  setInterval(function () {
                     e.location.origin = t();
                  }, 100);
               }
            }
         })(
            void 0 !== e
               ? e
               : "undefined" != typeof window
               ? window
               : "undefined" != typeof self
               ? self
               : e
         );
      var xo = Xe("isConcatSpreadable"),
         Co =
            zn >= 51 ||
            !r(function () {
               var e = [];
               return (e[xo] = !1), e.concat()[0] !== e;
            }),
         Po = Kn("concat"),
         Io = function (e) {
            if (!g(e)) return !1;
            var t = e[xo];
            return void 0 !== t ? !!t : Me(e);
         };
      Oe(
         { target: "Array", proto: !0, forced: !Co || !Po },
         {
            concat: function (e) {
               var t,
                  n,
                  i,
                  r,
                  a,
                  o = Ne(this),
                  s = ot(o, 0),
                  l = 0;
               for (t = -1, i = arguments.length; t < i; t++)
                  if (((a = -1 === t ? o : arguments[t]), Io(a))) {
                     if (l + (r = le(a.length)) > 9007199254740991)
                        throw TypeError("Maximum allowed index exceeded");
                     for (n = 0; n < r; n++, l++) n in a && Dn(s, l, a[n]);
                  } else {
                     if (l >= 9007199254740991)
                        throw TypeError("Maximum allowed index exceeded");
                     Dn(s, l++, a);
                  }
               return (s.length = l), s;
            },
         }
      );
      var Oo = ct.filter,
         Lo = Kn("filter"),
         jo = Qt("filter");
      Oe(
         { target: "Array", proto: !0, forced: !Lo || !jo },
         {
            filter: function (e) {
               return Oo(this, e, arguments.length > 1 ? arguments[1] : void 0);
            },
         }
      );
      var Mo = ct.find,
         No = !0,
         Ro = Qt("find");
      "find" in [] &&
         Array(1).find(function () {
            No = !1;
         }),
         Oe(
            { target: "Array", proto: !0, forced: No || !Ro },
            {
               find: function (e) {
                  return Mo(
                     this,
                     e,
                     arguments.length > 1 ? arguments[1] : void 0
                  );
               },
            }
         ),
         dn("find");
      var _o = Xe("iterator"),
         Uo = !1;
      try {
         var Fo = 0,
            Do = {
               next: function () {
                  return { done: !!Fo++ };
               },
               return: function () {
                  Uo = !0;
               },
            };
         (Do[_o] = function () {
            return this;
         }),
            Array.from(Do, function () {
               throw 2;
            });
      } catch (e) {}
      var qo = function (e, t) {
            if (!t && !Uo) return !1;
            var n = !1;
            try {
               var i = {};
               (i[_o] = function () {
                  return {
                     next: function () {
                        return { done: (n = !0) };
                     },
                  };
               }),
                  e(i);
            } catch (e) {}
            return n;
         },
         Ho = !qo(function (e) {
            Array.from(e);
         });
      Oe({ target: "Array", stat: !0, forced: Ho }, { from: mr });
      var Bo = de.includes,
         Vo = Qt("indexOf", { ACCESSORS: !0, 1: 0 });
      Oe(
         { target: "Array", proto: !0, forced: !Vo },
         {
            includes: function (e) {
               return Bo(this, e, arguments.length > 1 ? arguments[1] : void 0);
            },
         }
      ),
         dn("includes");
      var zo = ct.map,
         Wo = Kn("map"),
         Ko = Qt("map");
      Oe(
         { target: "Array", proto: !0, forced: !Wo || !Ko },
         {
            map: function (e) {
               return zo(this, e, arguments.length > 1 ? arguments[1] : void 0);
            },
         }
      );
      var $o = function (e, t, n) {
            var i, r;
            return (
               An &&
                  "function" == typeof (i = t.constructor) &&
                  i !== n &&
                  g((r = i.prototype)) &&
                  r !== n.prototype &&
                  An(e, r),
               e
            );
         },
         Yo = "\t\n\v\f\r                　\u2028\u2029\ufeff",
         Go = "[" + Yo + "]",
         Xo = RegExp("^" + Go + Go + "*"),
         Qo = RegExp(Go + Go + "*$"),
         Jo = function (e) {
            return function (t) {
               var n = String(p(t));
               return (
                  1 & e && (n = n.replace(Xo, "")),
                  2 & e && (n = n.replace(Qo, "")),
                  n
               );
            };
         },
         Zo = { start: Jo(1), end: Jo(2), trim: Jo(3) },
         es = ye.f,
         ts = A.f,
         ns = P.f,
         is = Zo.trim,
         rs = i.Number,
         as = rs.prototype,
         os = "Number" == h(Be(as)),
         ss = function (e) {
            var t,
               n,
               i,
               r,
               a,
               o,
               s,
               l,
               c = v(e, !1);
            if ("string" == typeof c && c.length > 2)
               if (43 === (t = (c = is(c)).charCodeAt(0)) || 45 === t) {
                  if (88 === (n = c.charCodeAt(2)) || 120 === n) return NaN;
               } else if (48 === t) {
                  switch (c.charCodeAt(1)) {
                     case 66:
                     case 98:
                        (i = 2), (r = 49);
                        break;
                     case 79:
                     case 111:
                        (i = 8), (r = 55);
                        break;
                     default:
                        return +c;
                  }
                  for (o = (a = c.slice(2)).length, s = 0; s < o; s++)
                     if ((l = a.charCodeAt(s)) < 48 || l > r) return NaN;
                  return parseInt(a, i);
               }
            return +c;
         };
      if (Pe("Number", !rs(" 0o1") || !rs("0b1") || rs("+0x1"))) {
         for (
            var ls,
               cs = function (e) {
                  var t = arguments.length < 1 ? 0 : e,
                     n = this;
                  return n instanceof cs &&
                     (os
                        ? r(function () {
                             as.valueOf.call(n);
                          })
                        : "Number" != h(n))
                     ? $o(new rs(ss(t)), n, cs)
                     : ss(t);
               },
               us = a
                  ? es(rs)
                  : "MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(
                       ","
                    ),
               hs = 0;
            us.length > hs;
            hs++
         )
            b(rs, (ls = us[hs])) && !b(cs, ls) && ns(cs, ls, ts(rs, ls));
         (cs.prototype = as), (as.constructor = cs), ee(i, "Number", cs);
      }
      var fs = r(function () {
         Re(1);
      });
      Oe(
         { target: "Object", stat: !0, forced: fs },
         {
            keys: function (e) {
               return Re(Ne(e));
            },
         }
      );
      var ds = function (e) {
            if (qi(e))
               throw TypeError("The method doesn't accept regular expressions");
            return e;
         },
         ps = Xe("match"),
         ms = function (e) {
            var t = /./;
            try {
               "/./"[e](t);
            } catch (n) {
               try {
                  return (t[ps] = !1), "/./"[e](t);
               } catch (e) {}
            }
            return !1;
         };
      Oe(
         { target: "String", proto: !0, forced: !ms("includes") },
         {
            includes: function (e) {
               return !!~String(p(this)).indexOf(
                  ds(e),
                  arguments.length > 1 ? arguments[1] : void 0
               );
            },
         }
      );
      var gs = !r(function () {
            return Object.isExtensible(Object.preventExtensions({}));
         }),
         vs = t(function (e) {
            var t = P.f,
               n = B("meta"),
               i = 0,
               r =
                  Object.isExtensible ||
                  function () {
                     return !0;
                  },
               a = function (e) {
                  t(e, n, { value: { objectID: "O" + ++i, weakData: {} } });
               },
               o = (e.exports = {
                  REQUIRED: !1,
                  fastKey: function (e, t) {
                     if (!g(e))
                        return "symbol" == typeof e
                           ? e
                           : ("string" == typeof e ? "S" : "P") + e;
                     if (!b(e, n)) {
                        if (!r(e)) return "F";
                        if (!t) return "E";
                        a(e);
                     }
                     return e[n].objectID;
                  },
                  getWeakData: function (e, t) {
                     if (!b(e, n)) {
                        if (!r(e)) return !0;
                        if (!t) return !1;
                        a(e);
                     }
                     return e[n].weakData;
                  },
                  onFreeze: function (e) {
                     return gs && o.REQUIRED && r(e) && !b(e, n) && a(e), e;
                  },
               });
            W[n] = !0;
         }),
         ys =
            (vs.REQUIRED,
            vs.fastKey,
            vs.getWeakData,
            vs.onFreeze,
            t(function (e) {
               var t = function (e, t) {
                  (this.stopped = e), (this.result = t);
               };
               (e.exports = function (e, n, i, r, a) {
                  var o,
                     s,
                     l,
                     c,
                     u,
                     h,
                     f,
                     d = rt(n, i, r ? 2 : 1);
                  if (a) o = e;
                  else {
                     if ("function" != typeof (s = pr(e)))
                        throw TypeError("Target is not iterable");
                     if (fr(s)) {
                        for (l = 0, c = le(e.length); c > l; l++)
                           if (
                              (u = r ? d(x((f = e[l]))[0], f[1]) : d(e[l])) &&
                              u instanceof t
                           )
                              return u;
                        return new t(!1);
                     }
                     o = s.call(e);
                  }
                  for (h = o.next; !(f = h.call(o)).done; )
                     if (
                        "object" == typeof (u = cr(o, d, f.value, r)) &&
                        u &&
                        u instanceof t
                     )
                        return u;
                  return new t(!1);
               }).stop = function (e) {
                  return new t(!0, e);
               };
            })),
         bs = vs.getWeakData,
         ws = Z.set,
         ks = Z.getterFor,
         Ts = ct.find,
         Ss = ct.findIndex,
         Es = 0,
         As = function (e) {
            return e.frozen || (e.frozen = new xs());
         },
         xs = function () {
            this.entries = [];
         },
         Cs = function (e, t) {
            return Ts(e.entries, function (e) {
               return e[0] === t;
            });
         };
      xs.prototype = {
         get: function (e) {
            var t = Cs(this, e);
            if (t) return t[1];
         },
         has: function (e) {
            return !!Cs(this, e);
         },
         set: function (e, t) {
            var n = Cs(this, e);
            n ? (n[1] = t) : this.entries.push([e, t]);
         },
         delete: function (e) {
            var t = Ss(this.entries, function (t) {
               return t[0] === e;
            });
            return ~t && this.entries.splice(t, 1), !!~t;
         },
      };
      var Ps = {
            getConstructor: function (e, t, n, i) {
               var r = e(function (e, a) {
                     ar(e, r, t),
                        ws(e, { type: t, id: Es++, frozen: void 0 }),
                        null != a && ys(a, e[i], e, n);
                  }),
                  a = ks(t),
                  o = function (e, t, n) {
                     var i = a(e),
                        r = bs(x(t), !0);
                     return !0 === r ? As(i).set(t, n) : (r[i.id] = n), e;
                  };
               return (
                  Er(r.prototype, {
                     delete: function (e) {
                        var t = a(this);
                        if (!g(e)) return !1;
                        var n = bs(e);
                        return !0 === n
                           ? As(t).delete(e)
                           : n && b(n, t.id) && delete n[t.id];
                     },
                     has: function (e) {
                        var t = a(this);
                        if (!g(e)) return !1;
                        var n = bs(e);
                        return !0 === n ? As(t).has(e) : n && b(n, t.id);
                     },
                  }),
                  Er(
                     r.prototype,
                     n
                        ? {
                             get: function (e) {
                                var t = a(this);
                                if (g(e)) {
                                   var n = bs(e);
                                   return !0 === n
                                      ? As(t).get(e)
                                      : n
                                      ? n[t.id]
                                      : void 0;
                                }
                             },
                             set: function (e, t) {
                                return o(this, e, t);
                             },
                          }
                        : {
                             add: function (e) {
                                return o(this, e, !0);
                             },
                          }
                  ),
                  r
               );
            },
         },
         Is =
            (t(function (e) {
               var t,
                  n = Z.enforce,
                  a = !i.ActiveXObject && "ActiveXObject" in i,
                  o = Object.isExtensible,
                  s = function (e) {
                     return function () {
                        return e(
                           this,
                           arguments.length ? arguments[0] : void 0
                        );
                     };
                  },
                  l = (e.exports = (function (e, t, n) {
                     var a = -1 !== e.indexOf("Map"),
                        o = -1 !== e.indexOf("Weak"),
                        s = a ? "set" : "add",
                        l = i[e],
                        c = l && l.prototype,
                        u = l,
                        h = {},
                        f = function (e) {
                           var t = c[e];
                           ee(
                              c,
                              e,
                              "add" == e
                                 ? function (e) {
                                      return (
                                         t.call(this, 0 === e ? 0 : e), this
                                      );
                                   }
                                 : "delete" == e
                                 ? function (e) {
                                      return (
                                         !(o && !g(e)) &&
                                         t.call(this, 0 === e ? 0 : e)
                                      );
                                   }
                                 : "get" == e
                                 ? function (e) {
                                      return o && !g(e)
                                         ? void 0
                                         : t.call(this, 0 === e ? 0 : e);
                                   }
                                 : "has" == e
                                 ? function (e) {
                                      return (
                                         !(o && !g(e)) &&
                                         t.call(this, 0 === e ? 0 : e)
                                      );
                                   }
                                 : function (e, n) {
                                      return (
                                         t.call(this, 0 === e ? 0 : e, n), this
                                      );
                                   }
                           );
                        };
                     if (
                        Pe(
                           e,
                           "function" != typeof l ||
                              !(
                                 o ||
                                 (c.forEach &&
                                    !r(function () {
                                       new l().entries().next();
                                    }))
                              )
                        )
                     )
                        (u = n.getConstructor(t, e, a, s)), (vs.REQUIRED = !0);
                     else if (Pe(e, !0)) {
                        var d = new u(),
                           p = d[s](o ? {} : -0, 1) != d,
                           m = r(function () {
                              d.has(1);
                           }),
                           v = qo(function (e) {
                              new l(e);
                           }),
                           y =
                              !o &&
                              r(function () {
                                 for (var e = new l(), t = 5; t--; ) e[s](t, t);
                                 return !e.has(-0);
                              });
                        v ||
                           (((u = t(function (t, n) {
                              ar(t, u, e);
                              var i = $o(new l(), t, u);
                              return null != n && ys(n, i[s], i, a), i;
                           })).prototype = c),
                           (c.constructor = u)),
                           (m || y) && (f("delete"), f("has"), a && f("get")),
                           (y || p) && f(s),
                           o && c.clear && delete c.clear;
                     }
                     return (
                        (h[e] = u),
                        Oe({ global: !0, forced: u != l }, h),
                        nt(u, e),
                        o || n.setStrong(u, e, a),
                        u
                     );
                  })("WeakMap", s, Ps));
               if (F && a) {
                  (t = Ps.getConstructor(s, "WeakMap", !0)), (vs.REQUIRED = !0);
                  var c = l.prototype,
                     u = c.delete,
                     h = c.has,
                     f = c.get,
                     d = c.set;
                  Er(c, {
                     delete: function (e) {
                        if (g(e) && !o(e)) {
                           var i = n(this);
                           return (
                              i.frozen || (i.frozen = new t()),
                              u.call(this, e) || i.frozen.delete(e)
                           );
                        }
                        return u.call(this, e);
                     },
                     has: function (e) {
                        if (g(e) && !o(e)) {
                           var i = n(this);
                           return (
                              i.frozen || (i.frozen = new t()),
                              h.call(this, e) || i.frozen.has(e)
                           );
                        }
                        return h.call(this, e);
                     },
                     get: function (e) {
                        if (g(e) && !o(e)) {
                           var i = n(this);
                           return (
                              i.frozen || (i.frozen = new t()),
                              h.call(this, e)
                                 ? f.call(this, e)
                                 : i.frozen.get(e)
                           );
                        }
                        return f.call(this, e);
                     },
                     set: function (e, i) {
                        if (g(e) && !o(e)) {
                           var r = n(this);
                           r.frozen || (r.frozen = new t()),
                              h.call(this, e)
                                 ? d.call(this, e, i)
                                 : r.frozen.set(e, i);
                        } else d.call(this, e, i);
                        return this;
                     },
                  });
               }
            }),
            ct.every),
         Os = $t("every"),
         Ls = Qt("every");
      Oe(
         { target: "Array", proto: !0, forced: !Os || !Ls },
         {
            every: function (e) {
               return Is(this, e, arguments.length > 1 ? arguments[1] : void 0);
            },
         }
      ),
         Oe(
            { target: "Object", stat: !0, forced: Object.assign !== lr },
            { assign: lr }
         );
      var js = Zo.trim;
      Oe(
         {
            target: "String",
            proto: !0,
            forced: (function (e) {
               return r(function () {
                  return !!Yo[e]() || "​᠎" != "​᠎"[e]() || Yo[e].name !== e;
               });
            })("trim"),
         },
         {
            trim: function () {
               return js(this);
            },
         }
      );
      var Ms = ct.some,
         Ns = $t("some"),
         Rs = Qt("some");
      Oe(
         { target: "Array", proto: !0, forced: !Ns || !Rs },
         {
            some: function (e) {
               return Ms(this, e, arguments.length > 1 ? arguments[1] : void 0);
            },
         }
      );
      var _s =
            "".repeat ||
            function (e) {
               var t = String(p(this)),
                  n = "",
                  i = oe(e);
               if (i < 0 || i == 1 / 0)
                  throw RangeError("Wrong number of repetitions");
               for (; i > 0; (i >>>= 1) && (t += t)) 1 & i && (n += t);
               return n;
            },
         Us = (1).toFixed,
         Fs = Math.floor,
         Ds = function (e, t, n) {
            return 0 === t
               ? n
               : t % 2 == 1
               ? Ds(e, t - 1, n * e)
               : Ds(e * e, t / 2, n);
         },
         qs =
            (Us &&
               ("0.000" !== (8e-5).toFixed(3) ||
                  "1" !== (0.9).toFixed(0) ||
                  "1.25" !== (1.255).toFixed(2) ||
                  "1000000000000000128" !== (0xde0b6b3a7640080).toFixed(0))) ||
            !r(function () {
               Us.call({});
            });
      Oe(
         { target: "Number", proto: !0, forced: qs },
         {
            toFixed: function (e) {
               var t,
                  n,
                  i,
                  r,
                  a = (function (e) {
                     if ("number" != typeof e && "Number" != h(e))
                        throw TypeError("Incorrect invocation");
                     return +e;
                  })(this),
                  o = oe(e),
                  s = [0, 0, 0, 0, 0, 0],
                  l = "",
                  c = "0",
                  u = function (e, t) {
                     for (var n = -1, i = t; ++n < 6; )
                        (i += e * s[n]), (s[n] = i % 1e7), (i = Fs(i / 1e7));
                  },
                  f = function (e) {
                     for (var t = 6, n = 0; --t >= 0; )
                        (n += s[t]), (s[t] = Fs(n / e)), (n = (n % e) * 1e7);
                  },
                  d = function () {
                     for (var e = 6, t = ""; --e >= 0; )
                        if ("" !== t || 0 === e || 0 !== s[e]) {
                           var n = String(s[e]);
                           t =
                              "" === t ? n : t + _s.call("0", 7 - n.length) + n;
                        }
                     return t;
                  };
               if (o < 0 || o > 20)
                  throw RangeError("Incorrect fraction digits");
               if (a != a) return "NaN";
               if (a <= -1e21 || a >= 1e21) return String(a);
               if ((a < 0 && ((l = "-"), (a = -a)), a > 1e-21))
                  if (
                     ((n =
                        (t =
                           (function (e) {
                              for (var t = 0, n = e; n >= 4096; )
                                 (t += 12), (n /= 4096);
                              for (; n >= 2; ) (t += 1), (n /= 2);
                              return t;
                           })(a * Ds(2, 69, 1)) - 69) < 0
                           ? a * Ds(2, -t, 1)
                           : a / Ds(2, t, 1)),
                     (n *= 4503599627370496),
                     (t = 52 - t) > 0)
                  ) {
                     for (u(0, n), i = o; i >= 7; ) u(1e7, 0), (i -= 7);
                     for (u(Ds(10, i, 1), 0), i = t - 1; i >= 23; )
                        f(1 << 23), (i -= 23);
                     f(1 << i), u(1, 1), f(2), (c = d());
                  } else u(0, n), u(1 << -t, 0), (c = d() + _s.call("0", o));
               return (c =
                  o > 0
                     ? l +
                       ((r = c.length) <= o
                          ? "0." + _s.call("0", o - r) + c
                          : c.slice(0, r - o) + "." + c.slice(r - o))
                     : l + c);
            },
         }
      );
      var Hs = l.f,
         Bs = function (e) {
            return function (t) {
               for (
                  var n, i = m(t), r = Re(i), o = r.length, s = 0, l = [];
                  o > s;

               )
                  (n = r[s++]),
                     (a && !Hs.call(i, n)) || l.push(e ? [n, i[n]] : i[n]);
               return l;
            };
         },
         Vs = { entries: Bs(!0), values: Bs(!1) },
         zs = Vs.entries;
      Oe(
         { target: "Object", stat: !0 },
         {
            entries: function (e) {
               return zs(e);
            },
         }
      );
      var Ws = Vs.values;
      Oe(
         { target: "Object", stat: !0 },
         {
            values: function (e) {
               return Ws(e);
            },
         }
      );
      var Ks = { addCSS: !0, thumbWidth: 15, watch: !0 };
      function $s(e, t) {
         return function () {
            return Array.from(document.querySelectorAll(t)).includes(this);
         }.call(e, t);
      }
      Oe(
         { target: "Number", stat: !0 },
         {
            isNaN: function (e) {
               return e != e;
            },
         }
      );
      var Ys = function (e) {
            return null != e ? e.constructor : null;
         },
         Gs = function (e, t) {
            return Boolean(e && t && e instanceof t);
         },
         Xs = function (e) {
            return null == e;
         },
         Qs = function (e) {
            return Ys(e) === Object;
         },
         Js = function (e) {
            return Ys(e) === String;
         },
         Zs = function (e) {
            return Array.isArray(e);
         },
         el = function (e) {
            return Gs(e, NodeList);
         },
         tl = Js,
         nl = Zs,
         il = el,
         rl = function (e) {
            return Gs(e, Element);
         },
         al = function (e) {
            return Gs(e, Event);
         },
         ol = function (e) {
            return (
               Xs(e) ||
               ((Js(e) || Zs(e) || el(e)) && !e.length) ||
               (Qs(e) && !Object.keys(e).length)
            );
         };
      function sl(e, t) {
         if (t < 1) {
            var n = (function (e) {
               var t = "".concat(e).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
               return t
                  ? Math.max(0, (t[1] ? t[1].length : 0) - (t[2] ? +t[2] : 0))
                  : 0;
            })(t);
            return parseFloat(e.toFixed(n));
         }
         return Math.round(e / t) * t;
      }
      Ii("match", 1, function (e, t, n) {
         return [
            function (t) {
               var n = p(this),
                  i = null == t ? void 0 : t[e];
               return void 0 !== i ? i.call(t, n) : new RegExp(t)[e](String(n));
            },
            function (e) {
               var i = n(t, e, this);
               if (i.done) return i.value;
               var r = x(e),
                  a = String(this);
               if (!r.global) return ji(r, a);
               var o = r.unicode;
               r.lastIndex = 0;
               for (var s, l = [], c = 0; null !== (s = ji(r, a)); ) {
                  var u = String(s[0]);
                  (l[c] = u),
                     "" === u && (r.lastIndex = Li(a, le(r.lastIndex), o)),
                     c++;
               }
               return 0 === c ? null : l;
            },
         ];
      });
      var ll,
         cl,
         ul,
         hl = (function () {
            function e(t, n) {
               yo(this, e),
                  rl(t)
                     ? (this.element = t)
                     : tl(t) && (this.element = document.querySelector(t)),
                  rl(this.element) &&
                     ol(this.element.rangeTouch) &&
                     ((this.config = Object.assign({}, Ks, n)), this.init());
            }
            return (
               wo(
                  e,
                  [
                     {
                        key: "init",
                        value: function () {
                           e.enabled &&
                              (this.config.addCSS &&
                                 ((this.element.style.userSelect = "none"),
                                 (this.element.style.webKitUserSelect = "none"),
                                 (this.element.style.touchAction =
                                    "manipulation")),
                              this.listeners(!0),
                              (this.element.rangeTouch = this));
                        },
                     },
                     {
                        key: "destroy",
                        value: function () {
                           e.enabled &&
                              (this.listeners(!1),
                              (this.element.rangeTouch = null));
                        },
                     },
                     {
                        key: "listeners",
                        value: function (e) {
                           var t = this,
                              n = e
                                 ? "addEventListener"
                                 : "removeEventListener";
                           ["touchstart", "touchmove", "touchend"].forEach(
                              function (e) {
                                 t.element[n](
                                    e,
                                    function (e) {
                                       return t.set(e);
                                    },
                                    !1
                                 );
                              }
                           );
                        },
                     },
                     {
                        key: "get",
                        value: function (t) {
                           if (!e.enabled || !al(t)) return null;
                           var n,
                              i = t.target,
                              r = t.changedTouches[0],
                              a = parseFloat(i.getAttribute("min")) || 0,
                              o = parseFloat(i.getAttribute("max")) || 100,
                              s = parseFloat(i.getAttribute("step")) || 1,
                              l = o - a,
                              c = i.getBoundingClientRect(),
                              u =
                                 ((100 / c.width) *
                                    (this.config.thumbWidth / 2)) /
                                 100;
                           return (
                              (n = (100 / c.width) * (r.clientX - c.left)) < 0
                                 ? (n = 0)
                                 : n > 100 && (n = 100),
                              n < 50
                                 ? (n -= (100 - 2 * n) * u)
                                 : n > 50 && (n += 2 * (n - 50) * u),
                              a + sl(l * (n / 100), s)
                           );
                        },
                     },
                     {
                        key: "set",
                        value: function (t) {
                           e.enabled &&
                              al(t) &&
                              !t.target.disabled &&
                              (t.preventDefault(),
                              (t.target.value = this.get(t)),
                              (function (e, t) {
                                 if (e && t) {
                                    var n = new Event(t);
                                    e.dispatchEvent(n);
                                 }
                              })(
                                 t.target,
                                 "touchend" === t.type ? "change" : "input"
                              ));
                        },
                     },
                  ],
                  [
                     {
                        key: "setup",
                        value: function (t) {
                           var n =
                                 arguments.length > 1 && void 0 !== arguments[1]
                                    ? arguments[1]
                                    : {},
                              i = null;
                           if (
                              (ol(t) || tl(t)
                                 ? (i = Array.from(
                                      document.querySelectorAll(
                                         tl(t) ? t : 'input[type="range"]'
                                      )
                                   ))
                                 : rl(t)
                                 ? (i = [t])
                                 : il(t)
                                 ? (i = Array.from(t))
                                 : nl(t) && (i = t.filter(rl)),
                              ol(i))
                           )
                              return null;
                           var r = Object.assign({}, Ks, n);
                           if (tl(t) && r.watch) {
                              var a = new MutationObserver(function (n) {
                                 Array.from(n).forEach(function (n) {
                                    Array.from(n.addedNodes).forEach(function (
                                       n
                                    ) {
                                       if (rl(n) && $s(n, t)) new e(n, r);
                                    });
                                 });
                              });
                              a.observe(document.body, {
                                 childList: !0,
                                 subtree: !0,
                              });
                           }
                           return i.map(function (t) {
                              return new e(t, n);
                           });
                        },
                     },
                     {
                        key: "enabled",
                        get: function () {
                           return "ontouchstart" in document.documentElement;
                        },
                     },
                  ]
               ),
               e
            );
         })(),
         fl = i.Promise,
         dl = Xe("species"),
         pl = function (e) {
            var t = ie(e),
               n = P.f;
            a &&
               t &&
               !t[dl] &&
               n(t, dl, {
                  configurable: !0,
                  get: function () {
                     return this;
                  },
               });
         },
         ml = /(iphone|ipod|ipad).*applewebkit/i.test(qn),
         gl = i.location,
         vl = i.setImmediate,
         yl = i.clearImmediate,
         bl = i.process,
         wl = i.MessageChannel,
         kl = i.Dispatch,
         Tl = 0,
         Sl = {},
         El = function (e) {
            if (Sl.hasOwnProperty(e)) {
               var t = Sl[e];
               delete Sl[e], t();
            }
         },
         Al = function (e) {
            return function () {
               El(e);
            };
         },
         xl = function (e) {
            El(e.data);
         },
         Cl = function (e) {
            i.postMessage(e + "", gl.protocol + "//" + gl.host);
         };
      (vl && yl) ||
         ((vl = function (e) {
            for (var t = [], n = 1; arguments.length > n; )
               t.push(arguments[n++]);
            return (
               (Sl[++Tl] = function () {
                  ("function" == typeof e ? e : Function(e)).apply(void 0, t);
               }),
               ll(Tl),
               Tl
            );
         }),
         (yl = function (e) {
            delete Sl[e];
         }),
         "process" == h(bl)
            ? (ll = function (e) {
                 bl.nextTick(Al(e));
              })
            : kl && kl.now
            ? (ll = function (e) {
                 kl.now(Al(e));
              })
            : wl && !ml
            ? ((ul = (cl = new wl()).port2),
              (cl.port1.onmessage = xl),
              (ll = rt(ul.postMessage, ul, 1)))
            : !i.addEventListener ||
              "function" != typeof postMessage ||
              i.importScripts ||
              r(Cl)
            ? (ll =
                 "onreadystatechange" in T("script")
                    ? function (e) {
                         Ue.appendChild(
                            T("script")
                         ).onreadystatechange = function () {
                            Ue.removeChild(this), El(e);
                         };
                      }
                    : function (e) {
                         setTimeout(Al(e), 0);
                      })
            : ((ll = Cl), i.addEventListener("message", xl, !1)));
      var Pl,
         Il,
         Ol,
         Ll,
         jl,
         Ml,
         Nl,
         Rl,
         _l = { set: vl, clear: yl },
         Ul = A.f,
         Fl = _l.set,
         Dl = i.MutationObserver || i.WebKitMutationObserver,
         ql = i.process,
         Hl = i.Promise,
         Bl = "process" == h(ql),
         Vl = Ul(i, "queueMicrotask"),
         zl = Vl && Vl.value;
      zl ||
         ((Pl = function () {
            var e, t;
            for (Bl && (e = ql.domain) && e.exit(); Il; ) {
               (t = Il.fn), (Il = Il.next);
               try {
                  t();
               } catch (e) {
                  throw (Il ? Ll() : (Ol = void 0), e);
               }
            }
            (Ol = void 0), e && e.enter();
         }),
         Bl
            ? (Ll = function () {
                 ql.nextTick(Pl);
              })
            : Dl && !ml
            ? ((jl = !0),
              (Ml = document.createTextNode("")),
              new Dl(Pl).observe(Ml, { characterData: !0 }),
              (Ll = function () {
                 Ml.data = jl = !jl;
              }))
            : Hl && Hl.resolve
            ? ((Nl = Hl.resolve(void 0)),
              (Rl = Nl.then),
              (Ll = function () {
                 Rl.call(Nl, Pl);
              }))
            : (Ll = function () {
                 Fl.call(i, Pl);
              }));
      var Wl,
         Kl,
         $l,
         Yl,
         Gl =
            zl ||
            function (e) {
               var t = { fn: e, next: void 0 };
               Ol && (Ol.next = t), Il || ((Il = t), Ll()), (Ol = t);
            },
         Xl = function (e) {
            var t, n;
            (this.promise = new e(function (e, i) {
               if (void 0 !== t || void 0 !== n)
                  throw TypeError("Bad Promise constructor");
               (t = e), (n = i);
            })),
               (this.resolve = it(t)),
               (this.reject = it(n));
         },
         Ql = {
            f: function (e) {
               return new Xl(e);
            },
         },
         Jl = function (e, t) {
            if ((x(e), g(t) && t.constructor === e)) return t;
            var n = Ql.f(e);
            return (0, n.resolve)(t), n.promise;
         },
         Zl = function (e) {
            try {
               return { error: !1, value: e() };
            } catch (e) {
               return { error: !0, value: e };
            }
         },
         ec = _l.set,
         tc = Xe("species"),
         nc = "Promise",
         ic = Z.get,
         rc = Z.set,
         ac = Z.getterFor(nc),
         oc = fl,
         sc = i.TypeError,
         lc = i.document,
         cc = i.process,
         uc = ie("fetch"),
         hc = Ql.f,
         fc = hc,
         dc = "process" == h(cc),
         pc = !!(lc && lc.createEvent && i.dispatchEvent),
         mc = Pe(nc, function () {
            if (!(_(oc) !== String(oc))) {
               if (66 === zn) return !0;
               if (!dc && "function" != typeof PromiseRejectionEvent) return !0;
            }
            if (zn >= 51 && /native code/.test(oc)) return !1;
            var e = oc.resolve(1),
               t = function (e) {
                  e(
                     function () {},
                     function () {}
                  );
               };
            return (
               ((e.constructor = {})[tc] = t),
               !(e.then(function () {}) instanceof t)
            );
         }),
         gc =
            mc ||
            !qo(function (e) {
               oc.all(e).catch(function () {});
            }),
         vc = function (e) {
            var t;
            return !(!g(e) || "function" != typeof (t = e.then)) && t;
         },
         yc = function (e, t, n) {
            if (!t.notified) {
               t.notified = !0;
               var i = t.reactions;
               Gl(function () {
                  for (
                     var r = t.value, a = 1 == t.state, o = 0;
                     i.length > o;

                  ) {
                     var s,
                        l,
                        c,
                        u = i[o++],
                        h = a ? u.ok : u.fail,
                        f = u.resolve,
                        d = u.reject,
                        p = u.domain;
                     try {
                        h
                           ? (a ||
                                (2 === t.rejection && Tc(e, t),
                                (t.rejection = 1)),
                             !0 === h
                                ? (s = r)
                                : (p && p.enter(),
                                  (s = h(r)),
                                  p && (p.exit(), (c = !0))),
                             s === u.promise
                                ? d(sc("Promise-chain cycle"))
                                : (l = vc(s))
                                ? l.call(s, f, d)
                                : f(s))
                           : d(r);
                     } catch (e) {
                        p && !c && p.exit(), d(e);
                     }
                  }
                  (t.reactions = []),
                     (t.notified = !1),
                     n && !t.rejection && wc(e, t);
               });
            }
         },
         bc = function (e, t, n) {
            var r, a;
            pc
               ? (((r = lc.createEvent("Event")).promise = t),
                 (r.reason = n),
                 r.initEvent(e, !1, !0),
                 i.dispatchEvent(r))
               : (r = { promise: t, reason: n }),
               (a = i["on" + e])
                  ? a(r)
                  : "unhandledrejection" === e &&
                    (function (e, t) {
                       var n = i.console;
                       n &&
                          n.error &&
                          (1 === arguments.length ? n.error(e) : n.error(e, t));
                    })("Unhandled promise rejection", n);
         },
         wc = function (e, t) {
            ec.call(i, function () {
               var n,
                  i = t.value;
               if (
                  kc(t) &&
                  ((n = Zl(function () {
                     dc
                        ? cc.emit("unhandledRejection", i, e)
                        : bc("unhandledrejection", e, i);
                  })),
                  (t.rejection = dc || kc(t) ? 2 : 1),
                  n.error)
               )
                  throw n.value;
            });
         },
         kc = function (e) {
            return 1 !== e.rejection && !e.parent;
         },
         Tc = function (e, t) {
            ec.call(i, function () {
               dc
                  ? cc.emit("rejectionHandled", e)
                  : bc("rejectionhandled", e, t.value);
            });
         },
         Sc = function (e, t, n, i) {
            return function (r) {
               e(t, n, r, i);
            };
         },
         Ec = function (e, t, n, i) {
            t.done ||
               ((t.done = !0),
               i && (t = i),
               (t.value = n),
               (t.state = 2),
               yc(e, t, !0));
         },
         Ac = function (e, t, n, i) {
            if (!t.done) {
               (t.done = !0), i && (t = i);
               try {
                  if (e === n) throw sc("Promise can't be resolved itself");
                  var r = vc(n);
                  r
                     ? Gl(function () {
                          var i = { done: !1 };
                          try {
                             r.call(n, Sc(Ac, e, i, t), Sc(Ec, e, i, t));
                          } catch (n) {
                             Ec(e, i, n, t);
                          }
                       })
                     : ((t.value = n), (t.state = 1), yc(e, t, !1));
               } catch (n) {
                  Ec(e, { done: !1 }, n, t);
               }
            }
         };
      mc &&
         ((oc = function (e) {
            ar(this, oc, nc), it(e), Wl.call(this);
            var t = ic(this);
            try {
               e(Sc(Ac, this, t), Sc(Ec, this, t));
            } catch (e) {
               Ec(this, t, e);
            }
         }),
         ((Wl = function (e) {
            rc(this, {
               type: nc,
               done: !1,
               notified: !1,
               parent: !1,
               reactions: [],
               rejection: !1,
               state: 0,
               value: void 0,
            });
         }).prototype = Er(oc.prototype, {
            then: function (e, t) {
               var n = ac(this),
                  i = hc(Bi(this, oc));
               return (
                  (i.ok = "function" != typeof e || e),
                  (i.fail = "function" == typeof t && t),
                  (i.domain = dc ? cc.domain : void 0),
                  (n.parent = !0),
                  n.reactions.push(i),
                  0 != n.state && yc(this, n, !1),
                  i.promise
               );
            },
            catch: function (e) {
               return this.then(void 0, e);
            },
         })),
         (Kl = function () {
            var e = new Wl(),
               t = ic(e);
            (this.promise = e),
               (this.resolve = Sc(Ac, e, t)),
               (this.reject = Sc(Ec, e, t));
         }),
         (Ql.f = hc = function (e) {
            return e === oc || e === $l ? new Kl(e) : fc(e);
         }),
         "function" == typeof fl &&
            ((Yl = fl.prototype.then),
            ee(
               fl.prototype,
               "then",
               function (e, t) {
                  var n = this;
                  return new oc(function (e, t) {
                     Yl.call(n, e, t);
                  }).then(e, t);
               },
               { unsafe: !0 }
            ),
            "function" == typeof uc &&
               Oe(
                  { global: !0, enumerable: !0, forced: !0 },
                  {
                     fetch: function (e) {
                        return Jl(oc, uc.apply(i, arguments));
                     },
                  }
               ))),
         Oe({ global: !0, wrap: !0, forced: mc }, { Promise: oc }),
         nt(oc, nc, !1),
         pl(nc),
         ($l = ie(nc)),
         Oe(
            { target: nc, stat: !0, forced: mc },
            {
               reject: function (e) {
                  var t = hc(this);
                  return t.reject.call(void 0, e), t.promise;
               },
            }
         ),
         Oe(
            { target: nc, stat: !0, forced: mc },
            {
               resolve: function (e) {
                  return Jl(this, e);
               },
            }
         ),
         Oe(
            { target: nc, stat: !0, forced: gc },
            {
               all: function (e) {
                  var t = this,
                     n = hc(t),
                     i = n.resolve,
                     r = n.reject,
                     a = Zl(function () {
                        var n = it(t.resolve),
                           a = [],
                           o = 0,
                           s = 1;
                        ys(e, function (e) {
                           var l = o++,
                              c = !1;
                           a.push(void 0),
                              s++,
                              n.call(t, e).then(function (e) {
                                 c || ((c = !0), (a[l] = e), --s || i(a));
                              }, r);
                        }),
                           --s || i(a);
                     });
                  return a.error && r(a.value), n.promise;
               },
               race: function (e) {
                  var t = this,
                     n = hc(t),
                     i = n.reject,
                     r = Zl(function () {
                        var r = it(t.resolve);
                        ys(e, function (e) {
                           r.call(t, e).then(n.resolve, i);
                        });
                     });
                  return r.error && i(r.value), n.promise;
               },
            }
         );
      var xc,
         Cc = A.f,
         Pc = "".startsWith,
         Ic = Math.min,
         Oc = ms("startsWith"),
         Lc = !(
            Oc ||
            ((xc = Cc(String.prototype, "startsWith")), !xc || xc.writable)
         );
      Oe(
         { target: "String", proto: !0, forced: !Lc && !Oc },
         {
            startsWith: function (e) {
               var t = String(p(this));
               ds(e);
               var n = le(
                     Ic(arguments.length > 1 ? arguments[1] : void 0, t.length)
                  ),
                  i = String(e);
               return Pc ? Pc.call(t, i, n) : t.slice(n, n + i.length) === i;
            },
         }
      );
      var jc,
         Mc,
         Nc,
         Rc = function (e) {
            return null != e ? e.constructor : null;
         },
         _c = function (e, t) {
            return Boolean(e && t && e instanceof t);
         },
         Uc = function (e) {
            return null == e;
         },
         Fc = function (e) {
            return Rc(e) === Object;
         },
         Dc = function (e) {
            return Rc(e) === String;
         },
         qc = function (e) {
            return Array.isArray(e);
         },
         Hc = function (e) {
            return _c(e, NodeList);
         },
         Bc = function (e) {
            return (
               Uc(e) ||
               ((Dc(e) || qc(e) || Hc(e)) && !e.length) ||
               (Fc(e) && !Object.keys(e).length)
            );
         },
         Vc = Uc,
         zc = Fc,
         Wc = function (e) {
            return Rc(e) === Number && !Number.isNaN(e);
         },
         Kc = Dc,
         $c = function (e) {
            return Rc(e) === Boolean;
         },
         Yc = function (e) {
            return Rc(e) === Function;
         },
         Gc = qc,
         Xc = Hc,
         Qc = function (e) {
            return _c(e, Element);
         },
         Jc = function (e) {
            return _c(e, Event);
         },
         Zc = function (e) {
            return _c(e, KeyboardEvent);
         },
         eu = function (e) {
            return _c(e, TextTrack) || (!Uc(e) && Dc(e.kind));
         },
         tu = function (e) {
            if (_c(e, window.URL)) return !0;
            if (!Dc(e)) return !1;
            var t = e;
            (e.startsWith("http://") && e.startsWith("https://")) ||
               (t = "http://".concat(e));
            try {
               return !Bc(new URL(t).hostname);
            } catch (e) {
               return !1;
            }
         },
         nu = Bc,
         iu =
            ((jc = document.createElement("span")),
            (Mc = {
               WebkitTransition: "webkitTransitionEnd",
               MozTransition: "transitionend",
               OTransition: "oTransitionEnd otransitionend",
               transition: "transitionend",
            }),
            (Nc = Object.keys(Mc).find(function (e) {
               return void 0 !== jc.style[e];
            })),
            !!Kc(Nc) && Mc[Nc]);
      function ru(e, t) {
         setTimeout(function () {
            try {
               (e.hidden = !0), e.offsetHeight, (e.hidden = !1);
            } catch (e) {}
         }, t);
      }
      var au = {
            isIE:
               /* @cc_on!@ */
               !!document.documentMode,
            isEdge: window.navigator.userAgent.includes("Edge"),
            isWebkit:
               "WebkitAppearance" in document.documentElement.style &&
               !/Edge/.test(navigator.userAgent),
            isIPhone: /(iPhone|iPod)/gi.test(navigator.platform),
            isIos: /(iPad|iPhone|iPod)/gi.test(navigator.platform),
         },
         ou = function (e) {
            return function (t, n, i, r) {
               it(n);
               var a = Ne(t),
                  o = d(a),
                  s = le(a.length),
                  l = e ? s - 1 : 0,
                  c = e ? -1 : 1;
               if (i < 2)
                  for (;;) {
                     if (l in o) {
                        (r = o[l]), (l += c);
                        break;
                     }
                     if (((l += c), e ? l < 0 : s <= l))
                        throw TypeError(
                           "Reduce of empty array with no initial value"
                        );
                  }
               for (; e ? l >= 0 : s > l; l += c)
                  l in o && (r = n(r, o[l], l, a));
               return r;
            };
         },
         su = { left: ou(!1), right: ou(!0) }.left,
         lu = $t("reduce"),
         cu = Qt("reduce", { 1: 0 });
      function uu(e, t) {
         return t.split(".").reduce(function (e, t) {
            return e && e[t];
         }, e);
      }
      function hu() {
         for (
            var e =
                  arguments.length > 0 && void 0 !== arguments[0]
                     ? arguments[0]
                     : {},
               t = arguments.length,
               n = new Array(t > 1 ? t - 1 : 0),
               i = 1;
            i < t;
            i++
         )
            n[i - 1] = arguments[i];
         if (!n.length) return e;
         var r = n.shift();
         return zc(r)
            ? (Object.keys(r).forEach(function (t) {
                 zc(r[t])
                    ? (Object.keys(e).includes(t) ||
                         Object.assign(e, ko({}, t, {})),
                      hu(e[t], r[t]))
                    : Object.assign(e, ko({}, t, r[t]));
              }),
              hu.apply(void 0, [e].concat(n)))
            : e;
      }
      function fu(e, t) {
         var n = e.length ? e : [e];
         Array.from(n)
            .reverse()
            .forEach(function (e, n) {
               var i = n > 0 ? t.cloneNode(!0) : t,
                  r = e.parentNode,
                  a = e.nextSibling;
               i.appendChild(e), a ? r.insertBefore(i, a) : r.appendChild(i);
            });
      }
      function du(e, t) {
         Qc(e) &&
            !nu(t) &&
            Object.entries(t)
               .filter(function (e) {
                  var t = Eo(e, 2)[1];
                  return !Vc(t);
               })
               .forEach(function (t) {
                  var n = Eo(t, 2),
                     i = n[0],
                     r = n[1];
                  return e.setAttribute(i, r);
               });
      }
      function pu(e, t, n) {
         var i = document.createElement(e);
         return zc(t) && du(i, t), Kc(n) && (i.innerText = n), i;
      }
      function mu(e, t, n, i) {
         Qc(t) && t.appendChild(pu(e, n, i));
      }
      function gu(e) {
         Xc(e) || Gc(e)
            ? Array.from(e).forEach(gu)
            : Qc(e) && Qc(e.parentNode) && e.parentNode.removeChild(e);
      }
      function vu(e) {
         if (Qc(e))
            for (var t = e.childNodes.length; t > 0; )
               e.removeChild(e.lastChild), (t -= 1);
      }
      function yu(e, t) {
         return Qc(t) && Qc(t.parentNode) && Qc(e)
            ? (t.parentNode.replaceChild(e, t), e)
            : null;
      }
      function bu(e, t) {
         if (!Kc(e) || nu(e)) return {};
         var n = {},
            i = hu({}, t);
         return (
            e.split(",").forEach(function (e) {
               var t = e.trim(),
                  r = t.replace(".", ""),
                  a = t.replace(/[[\]]/g, "").split("="),
                  o = Eo(a, 1)[0],
                  s = a.length > 1 ? a[1].replace(/["']/g, "") : "";
               switch (t.charAt(0)) {
                  case ".":
                     Kc(i.class)
                        ? (n.class = "".concat(i.class, " ").concat(r))
                        : (n.class = r);
                     break;
                  case "#":
                     n.id = t.replace("#", "");
                     break;
                  case "[":
                     n[o] = s;
               }
            }),
            hu(i, n)
         );
      }
      function wu(e, t) {
         if (Qc(e)) {
            var n = t;
            $c(n) || (n = !e.hidden), (e.hidden = n);
         }
      }
      function ku(e, t, n) {
         if (Xc(e))
            return Array.from(e).map(function (e) {
               return ku(e, t, n);
            });
         if (Qc(e)) {
            var i = "toggle";
            return (
               void 0 !== n && (i = n ? "add" : "remove"),
               e.classList[i](t),
               e.classList.contains(t)
            );
         }
         return !1;
      }
      function Tu(e, t) {
         return Qc(e) && e.classList.contains(t);
      }
      function Su(e, t) {
         return function () {
            return Array.from(document.querySelectorAll(t)).includes(this);
         }.call(e, t);
      }
      function Eu(e) {
         return this.elements.container.querySelectorAll(e);
      }
      function Au(e) {
         return this.elements.container.querySelector(e);
      }
      function xu() {
         var e =
               arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : null,
            t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
         Qc(e) &&
            (e.focus({ preventScroll: !0 }),
            t && ku(e, this.config.classNames.tabFocus));
      }
      Oe(
         { target: "Array", proto: !0, forced: !lu || !cu },
         {
            reduce: function (e) {
               return su(
                  this,
                  e,
                  arguments.length,
                  arguments.length > 1 ? arguments[1] : void 0
               );
            },
         }
      );
      var Cu,
         Pu = {
            "audio/ogg": "vorbis",
            "audio/wav": "1",
            "video/webm": "vp8, vorbis",
            "video/mp4": "avc1.42E01E, mp4a.40.2",
            "video/ogg": "theora",
         },
         Iu = {
            audio: "canPlayType" in document.createElement("audio"),
            video: "canPlayType" in document.createElement("video"),
            check: function (e, t, n) {
               var i = au.isIPhone && n && Iu.playsinline,
                  r = Iu[e] || "html5" !== t;
               return {
                  api: r,
                  ui:
                     r && Iu.rangeInput && ("video" !== e || !au.isIPhone || i),
               };
            },
            pip: !(
               au.isIPhone ||
               (!Yc(pu("video").webkitSetPresentationMode) &&
                  (!document.pictureInPictureEnabled ||
                     pu("video").disablePictureInPicture))
            ),
            airplay: Yc(window.WebKitPlaybackTargetAvailabilityEvent),
            playsinline: "playsInline" in document.createElement("video"),
            mime: function (e) {
               if (nu(e)) return !1;
               var t = Eo(e.split("/"), 1)[0],
                  n = e;
               if (!this.isHTML5 || t !== this.type) return !1;
               Object.keys(Pu).includes(n) &&
                  (n += '; codecs="'.concat(Pu[e], '"'));
               try {
                  return Boolean(
                     n && this.media.canPlayType(n).replace(/no/, "")
                  );
               } catch (e) {
                  return !1;
               }
            },
            textTracks: "textTracks" in document.createElement("video"),
            rangeInput:
               ((Cu = document.createElement("input")),
               (Cu.type = "range"),
               "range" === Cu.type),
            touch: "ontouchstart" in document.documentElement,
            transitions: !1 !== iu,
            reducedMotion:
               "matchMedia" in window &&
               window.matchMedia("(prefers-reduced-motion)").matches,
         },
         Ou = (function () {
            var e = !1;
            try {
               var t = Object.defineProperty({}, "passive", {
                  get: function () {
                     return (e = !0), null;
                  },
               });
               window.addEventListener("test", null, t),
                  window.removeEventListener("test", null, t);
            } catch (e) {}
            return e;
         })();
      function Lu(e, t, n) {
         var i = this,
            r = arguments.length > 3 && void 0 !== arguments[3] && arguments[3],
            a =
               !(arguments.length > 4 && void 0 !== arguments[4]) ||
               arguments[4],
            o = arguments.length > 5 && void 0 !== arguments[5] && arguments[5];
         if (e && "addEventListener" in e && !nu(t) && Yc(n)) {
            var s = t.split(" "),
               l = o;
            Ou && (l = { passive: a, capture: o }),
               s.forEach(function (t) {
                  i &&
                     i.eventListeners &&
                     r &&
                     i.eventListeners.push({
                        element: e,
                        type: t,
                        callback: n,
                        options: l,
                     }),
                     e[r ? "addEventListener" : "removeEventListener"](t, n, l);
               });
         }
      }
      function ju(e) {
         var t =
               arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : "",
            n = arguments.length > 2 ? arguments[2] : void 0,
            i =
               !(arguments.length > 3 && void 0 !== arguments[3]) ||
               arguments[3],
            r = arguments.length > 4 && void 0 !== arguments[4] && arguments[4];
         Lu.call(this, e, t, n, !0, i, r);
      }
      function Mu(e) {
         var t =
               arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : "",
            n = arguments.length > 2 ? arguments[2] : void 0,
            i =
               !(arguments.length > 3 && void 0 !== arguments[3]) ||
               arguments[3],
            r = arguments.length > 4 && void 0 !== arguments[4] && arguments[4];
         Lu.call(this, e, t, n, !1, i, r);
      }
      function Nu(e) {
         var t = this,
            n =
               arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : "",
            i = arguments.length > 2 ? arguments[2] : void 0,
            r =
               !(arguments.length > 3 && void 0 !== arguments[3]) ||
               arguments[3],
            a = arguments.length > 4 && void 0 !== arguments[4] && arguments[4],
            o = function o() {
               Mu(e, n, o, r, a);
               for (
                  var s = arguments.length, l = new Array(s), c = 0;
                  c < s;
                  c++
               )
                  l[c] = arguments[c];
               i.apply(t, l);
            };
         Lu.call(this, e, n, o, !0, r, a);
      }
      function Ru(e) {
         var t =
               arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : "",
            n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
            i =
               arguments.length > 3 && void 0 !== arguments[3]
                  ? arguments[3]
                  : {};
         if (Qc(e) && !nu(t)) {
            var r = new CustomEvent(t, {
               bubbles: n,
               detail: So({}, i, { plyr: this }),
            });
            e.dispatchEvent(r);
         }
      }
      function _u() {
         this &&
            this.eventListeners &&
            (this.eventListeners.forEach(function (e) {
               var t = e.element,
                  n = e.type,
                  i = e.callback,
                  r = e.options;
               t.removeEventListener(n, i, r);
            }),
            (this.eventListeners = []));
      }
      function Uu() {
         var e = this;
         return new Promise(function (t) {
            return e.ready
               ? setTimeout(t, 0)
               : ju.call(e, e.elements.container, "ready", t);
         }).then(function () {});
      }
      function Fu(e) {
         return (
            !!(Gc(e) || (Kc(e) && e.includes(":"))) &&
            (Gc(e) ? e : e.split(":")).map(Number).every(Wc)
         );
      }
      function Du(e) {
         if (!Gc(e) || !e.every(Wc)) return null;
         var t = Eo(e, 2),
            n = t[0],
            i = t[1],
            r = (function e(t, n) {
               return 0 === n ? t : e(n, t % n);
            })(n, i);
         return [n / r, i / r];
      }
      function qu(e) {
         var t = function (e) {
               return Fu(e) ? e.split(":").map(Number) : null;
            },
            n = t(e);
         if (
            (null === n && (n = t(this.config.ratio)),
            null === n &&
               !nu(this.embed) &&
               Gc(this.embed.ratio) &&
               (n = this.embed.ratio),
            null === n && this.isHTML5)
         ) {
            var i = this.media;
            n = Du([i.videoWidth, i.videoHeight]);
         }
         return n;
      }
      function Hu(e) {
         if (!this.isVideo) return {};
         var t = this.elements.wrapper,
            n = qu.call(this, e),
            i = Eo(Gc(n) ? n : [0, 0], 2),
            r = (100 / i[0]) * i[1];
         if (
            ((t.style.paddingBottom = "".concat(r, "%")),
            this.isVimeo && this.supported.ui)
         ) {
            var a = (240 - r) / 4.8;
            this.media.style.transform = "translateY(-".concat(a, "%)");
         } else this.isHTML5 && t.classList.toggle(this.config.classNames.videoFixedRatio, null !== n);
         return { padding: r, ratio: n };
      }
      var Bu = {
         getSources: function () {
            var e = this;
            return this.isHTML5
               ? Array.from(this.media.querySelectorAll("source")).filter(
                    function (t) {
                       var n = t.getAttribute("type");
                       return !!nu(n) || Iu.mime.call(e, n);
                    }
                 )
               : [];
         },
         getQualityOptions: function () {
            return this.config.quality.forced
               ? this.config.quality.options
               : Bu.getSources
                    .call(this)
                    .map(function (e) {
                       return Number(e.getAttribute("size"));
                    })
                    .filter(Boolean);
         },
         setup: function () {
            if (this.isHTML5) {
               var e = this;
               (e.options.speed = e.config.speed.options),
                  nu(this.config.ratio) || Hu.call(e),
                  Object.defineProperty(e.media, "quality", {
                     get: function () {
                        var t = Bu.getSources.call(e).find(function (t) {
                           return t.getAttribute("src") === e.source;
                        });
                        return t && Number(t.getAttribute("size"));
                     },
                     set: function (t) {
                        if (e.quality !== t) {
                           if (
                              e.config.quality.forced &&
                              Yc(e.config.quality.onChange)
                           )
                              e.config.quality.onChange(t);
                           else {
                              var n = Bu.getSources.call(e).find(function (e) {
                                 return Number(e.getAttribute("size")) === t;
                              });
                              if (!n) return;
                              var i = e.media,
                                 r = i.currentTime,
                                 a = i.paused,
                                 o = i.preload,
                                 s = i.readyState,
                                 l = i.playbackRate;
                              (e.media.src = n.getAttribute("src")),
                                 ("none" !== o || s) &&
                                    (e.once("loadedmetadata", function () {
                                       (e.speed = l),
                                          (e.currentTime = r),
                                          a || e.play();
                                    }),
                                    e.media.load());
                           }
                           Ru.call(e, e.media, "qualitychange", !1, {
                              quality: t,
                           });
                        }
                     },
                  });
            }
         },
         cancelRequests: function () {
            this.isHTML5 &&
               (gu(Bu.getSources.call(this)),
               this.media.setAttribute("src", this.config.blankVideo),
               this.media.load(),
               this.debug.log("Cancelled network requests"));
         },
      };
      function Vu(e) {
         return Gc(e)
            ? e.filter(function (t, n) {
                 return e.indexOf(t) === n;
              })
            : e;
      }
      var zu = P.f,
         Wu = ye.f,
         Ku = Z.set,
         $u = Xe("match"),
         Yu = i.RegExp,
         Gu = Yu.prototype,
         Xu = /a/g,
         Qu = /a/g,
         Ju = new Yu(Xu) !== Xu,
         Zu = oi.UNSUPPORTED_Y;
      if (
         a &&
         Pe(
            "RegExp",
            !Ju ||
               Zu ||
               r(function () {
                  return (
                     (Qu[$u] = !1),
                     Yu(Xu) != Xu || Yu(Qu) == Qu || "/a/i" != Yu(Xu, "i")
                  );
               })
         )
      ) {
         for (
            var eh = function (e, t) {
                  var n,
                     i = this instanceof eh,
                     r = qi(e),
                     a = void 0 === t;
                  if (!i && r && e.constructor === eh && a) return e;
                  Ju
                     ? r && !a && (e = e.source)
                     : e instanceof eh &&
                       (a && (t = ri.call(e)), (e = e.source)),
                     Zu &&
                        (n = !!t && t.indexOf("y") > -1) &&
                        (t = t.replace(/y/g, ""));
                  var o = $o(Ju ? new Yu(e, t) : Yu(e, t), i ? this : Gu, eh);
                  return Zu && n && Ku(o, { sticky: n }), o;
               },
               th = function (e) {
                  (e in eh) ||
                     zu(eh, e, {
                        configurable: !0,
                        get: function () {
                           return Yu[e];
                        },
                        set: function (t) {
                           Yu[e] = t;
                        },
                     });
               },
               nh = Wu(Yu),
               ih = 0;
            nh.length > ih;

         )
            th(nh[ih++]);
         (Gu.constructor = eh), (eh.prototype = Gu), ee(i, "RegExp", eh);
      }
      function rh(e) {
         for (
            var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1;
            i < t;
            i++
         )
            n[i - 1] = arguments[i];
         return nu(e)
            ? e
            : e.toString().replace(/{(\d+)}/g, function (e, t) {
                 return n[t].toString();
              });
      }
      function ah() {
         var e =
               arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : "",
            t =
               arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : "",
            n =
               arguments.length > 2 && void 0 !== arguments[2]
                  ? arguments[2]
                  : "";
         return e.replace(
            new RegExp(
               t.toString().replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1"),
               "g"
            ),
            n.toString()
         );
      }
      function oh() {
         var e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
         return e.toString().replace(/\w\S*/g, function (e) {
            return e.charAt(0).toUpperCase() + e.substr(1).toLowerCase();
         });
      }
      function sh() {
         var e =
               arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : "",
            t = e.toString();
         return (
            (t = ah(t, "-", " ")),
            (t = ah(t, "_", " ")),
            ah((t = oh(t)), " ", "")
         );
      }
      function lh(e) {
         var t = document.createElement("div");
         return t.appendChild(e), t.innerHTML;
      }
      pl("RegExp");
      var ch = {
            pip: "PIP",
            airplay: "AirPlay",
            html5: "HTML5",
            vimeo: "Vimeo",
            youtube: "YouTube",
         },
         uh = function () {
            var e =
                  arguments.length > 0 && void 0 !== arguments[0]
                     ? arguments[0]
                     : "",
               t =
                  arguments.length > 1 && void 0 !== arguments[1]
                     ? arguments[1]
                     : {};
            if (nu(e) || nu(t)) return "";
            var n = uu(t.i18n, e);
            if (nu(n)) return Object.keys(ch).includes(e) ? ch[e] : "";
            var i = { "{seektime}": t.seekTime, "{title}": t.title };
            return (
               Object.entries(i).forEach(function (e) {
                  var t = Eo(e, 2),
                     i = t[0],
                     r = t[1];
                  n = ah(n, i, r);
               }),
               n
            );
         },
         hh = (function () {
            function e(t) {
               yo(this, e),
                  (this.enabled = t.config.storage.enabled),
                  (this.key = t.config.storage.key);
            }
            return (
               wo(
                  e,
                  [
                     {
                        key: "get",
                        value: function (t) {
                           if (!e.supported || !this.enabled) return null;
                           var n = window.localStorage.getItem(this.key);
                           if (nu(n)) return null;
                           var i = JSON.parse(n);
                           return Kc(t) && t.length ? i[t] : i;
                        },
                     },
                     {
                        key: "set",
                        value: function (t) {
                           if (e.supported && this.enabled && zc(t)) {
                              var n = this.get();
                              nu(n) && (n = {}),
                                 hu(n, t),
                                 window.localStorage.setItem(
                                    this.key,
                                    JSON.stringify(n)
                                 );
                           }
                        },
                     },
                  ],
                  [
                     {
                        key: "supported",
                        get: function () {
                           try {
                              if (!("localStorage" in window)) return !1;
                              return (
                                 window.localStorage.setItem(
                                    "___test",
                                    "___test"
                                 ),
                                 window.localStorage.removeItem("___test"),
                                 !0
                              );
                           } catch (e) {
                              return !1;
                           }
                        },
                     },
                  ]
               ),
               e
            );
         })();
      function fh(e) {
         var t =
            arguments.length > 1 && void 0 !== arguments[1]
               ? arguments[1]
               : "text";
         return new Promise(function (n, i) {
            try {
               var r = new XMLHttpRequest();
               if (!("withCredentials" in r)) return;
               r.addEventListener("load", function () {
                  if ("text" === t)
                     try {
                        n(JSON.parse(r.responseText));
                     } catch (e) {
                        n(r.responseText);
                     }
                  else n(r.response);
               }),
                  r.addEventListener("error", function () {
                     throw new Error(r.status);
                  }),
                  r.open("GET", e, !0),
                  (r.responseType = t),
                  r.send();
            } catch (e) {
               i(e);
            }
         });
      }
      function dh(e, t) {
         if (Kc(e)) {
            var n = Kc(t),
               i = function () {
                  return null !== document.getElementById(t);
               },
               r = function (e, t) {
                  (e.innerHTML = t),
                     (n && i()) ||
                        document.body.insertAdjacentElement("afterbegin", e);
               };
            if (!n || !i()) {
               var a = hh.supported,
                  o = document.createElement("div");
               if (
                  (o.setAttribute("hidden", ""),
                  n && o.setAttribute("id", t),
                  a)
               ) {
                  var s = window.localStorage.getItem(
                     "".concat("cache", "-").concat(t)
                  );
                  if (null !== s) {
                     var l = JSON.parse(s);
                     r(o, l.content);
                  }
               }
               fh(e)
                  .then(function (e) {
                     nu(e) ||
                        (a &&
                           window.localStorage.setItem(
                              "".concat("cache", "-").concat(t),
                              JSON.stringify({ content: e })
                           ),
                        r(o, e));
                  })
                  .catch(function () {});
            }
         }
      }
      var ph = Math.ceil,
         mh = Math.floor;
      Oe(
         { target: "Math", stat: !0 },
         {
            trunc: function (e) {
               return (e > 0 ? mh : ph)(e);
            },
         }
      );
      var gh = function (e) {
            return Math.trunc((e / 60 / 60) % 60, 10);
         },
         vh = function (e) {
            return Math.trunc((e / 60) % 60, 10);
         },
         yh = function (e) {
            return Math.trunc(e % 60, 10);
         };
      function bh() {
         var e =
               arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : 0,
            t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
            n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
         if (!Wc(e)) return bh(void 0, t, n);
         var i = function (e) {
               return "0".concat(e).slice(-2);
            },
            r = gh(e),
            a = vh(e),
            o = yh(e);
         return (
            (r = t || r > 0 ? "".concat(r, ":") : ""),
            ""
               .concat(n && e > 0 ? "-" : "")
               .concat(r)
               .concat(i(a), ":")
               .concat(i(o))
         );
      }
      var wh = {
         getIconUrl: function () {
            var e =
               new URL(this.config.iconUrl, window.location).host !==
                  window.location.host ||
               (au.isIE && !window.svg4everybody);
            return { url: this.config.iconUrl, cors: e };
         },
         findElements: function () {
            try {
               return (
                  (this.elements.controls = Au.call(
                     this,
                     this.config.selectors.controls.wrapper
                  )),
                  (this.elements.buttons = {
                     play: Eu.call(this, this.config.selectors.buttons.play),
                     pause: Au.call(this, this.config.selectors.buttons.pause),
                     restart: Au.call(
                        this,
                        this.config.selectors.buttons.restart
                     ),
                     rewind: Au.call(
                        this,
                        this.config.selectors.buttons.rewind
                     ),
                     fastForward: Au.call(
                        this,
                        this.config.selectors.buttons.fastForward
                     ),
                     mute: Au.call(this, this.config.selectors.buttons.mute),
                     pip: Au.call(this, this.config.selectors.buttons.pip),
                     airplay: Au.call(
                        this,
                        this.config.selectors.buttons.airplay
                     ),
                     settings: Au.call(
                        this,
                        this.config.selectors.buttons.settings
                     ),
                     captions: Au.call(
                        this,
                        this.config.selectors.buttons.captions
                     ),
                     fullscreen: Au.call(
                        this,
                        this.config.selectors.buttons.fullscreen
                     ),
                  }),
                  (this.elements.progress = Au.call(
                     this,
                     this.config.selectors.progress
                  )),
                  (this.elements.inputs = {
                     seek: Au.call(this, this.config.selectors.inputs.seek),
                     volume: Au.call(this, this.config.selectors.inputs.volume),
                  }),
                  (this.elements.display = {
                     buffer: Au.call(
                        this,
                        this.config.selectors.display.buffer
                     ),
                     currentTime: Au.call(
                        this,
                        this.config.selectors.display.currentTime
                     ),
                     duration: Au.call(
                        this,
                        this.config.selectors.display.duration
                     ),
                  }),
                  Qc(this.elements.progress) &&
                     (this.elements.display.seekTooltip = this.elements.progress.querySelector(
                        ".".concat(this.config.classNames.tooltip)
                     )),
                  !0
               );
            } catch (e) {
               return (
                  this.debug.warn(
                     "It looks like there is a problem with your custom controls HTML",
                     e
                  ),
                  this.toggleNativeControls(!0),
                  !1
               );
            }
         },
         createIcon: function (e, t) {
            var n = wh.getIconUrl.call(this),
               i = ""
                  .concat(n.cors ? "" : n.url, "#")
                  .concat(this.config.iconPrefix),
               r = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "svg"
               );
            du(r, hu(t, { role: "presentation", focusable: "false" }));
            var a = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "use"
               ),
               o = "".concat(i, "-").concat(e);
            return (
               "href" in a &&
                  a.setAttributeNS("http://www.w3.org/1999/xlink", "href", o),
               a.setAttributeNS(
                  "http://www.w3.org/1999/xlink",
                  "xlink:href",
                  o
               ),
               r.appendChild(a),
               r
            );
         },
         createLabel: function (e) {
            var t =
                  arguments.length > 1 && void 0 !== arguments[1]
                     ? arguments[1]
                     : {},
               n = uh(e, this.config),
               i = So({}, t, {
                  class: [t.class, this.config.classNames.hidden]
                     .filter(Boolean)
                     .join(" "),
               });
            return pu("span", i, n);
         },
         createBadge: function (e) {
            if (nu(e)) return null;
            var t = pu("span", { class: this.config.classNames.menu.value });
            return (
               t.appendChild(
                  pu("span", { class: this.config.classNames.menu.badge }, e)
               ),
               t
            );
         },
         createButton: function (e, t) {
            var n = this,
               i = hu({}, t),
               r = (function () {
                  var e =
                        arguments.length > 0 && void 0 !== arguments[0]
                           ? arguments[0]
                           : "",
                     t = e.toString();
                  return (t = sh(t)).charAt(0).toLowerCase() + t.slice(1);
               })(e),
               a = {
                  element: "button",
                  toggle: !1,
                  label: null,
                  icon: null,
                  labelPressed: null,
                  iconPressed: null,
               };
            switch (
               (["element", "icon", "label"].forEach(function (e) {
                  Object.keys(i).includes(e) && ((a[e] = i[e]), delete i[e]);
               }),
               "button" !== a.element ||
                  Object.keys(i).includes("type") ||
                  (i.type = "button"),
               Object.keys(i).includes("class")
                  ? i.class.split(" ").some(function (e) {
                       return e === n.config.classNames.control;
                    }) ||
                    hu(i, {
                       class: ""
                          .concat(i.class, " ")
                          .concat(this.config.classNames.control),
                    })
                  : (i.class = this.config.classNames.control),
               e)
            ) {
               case "play":
                  (a.toggle = !0),
                     (a.label = "play"),
                     (a.labelPressed = "pause"),
                     (a.icon = "play"),
                     (a.iconPressed = "pause");
                  break;
               case "mute":
                  (a.toggle = !0),
                     (a.label = "mute"),
                     (a.labelPressed = "unmute"),
                     (a.icon = "volume"),
                     (a.iconPressed = "muted");
                  break;
               case "captions":
                  (a.toggle = !0),
                     (a.label = "enableCaptions"),
                     (a.labelPressed = "disableCaptions"),
                     (a.icon = "captions-off"),
                     (a.iconPressed = "captions-on");
                  break;
               case "fullscreen":
                  (a.toggle = !0),
                     (a.label = "enterFullscreen"),
                     (a.labelPressed = "exitFullscreen"),
                     (a.icon = "enter-fullscreen"),
                     (a.iconPressed = "exit-fullscreen");
                  break;
               case "play-large":
                  (i.class += " ".concat(
                     this.config.classNames.control,
                     "--overlaid"
                  )),
                     (r = "play"),
                     (a.label = "play"),
                     (a.icon = "play");
                  break;
               default:
                  nu(a.label) && (a.label = r), nu(a.icon) && (a.icon = e);
            }
            var o = pu(a.element);
            return (
               a.toggle
                  ? (o.appendChild(
                       wh.createIcon.call(this, a.iconPressed, {
                          class: "icon--pressed",
                       })
                    ),
                    o.appendChild(
                       wh.createIcon.call(this, a.icon, {
                          class: "icon--not-pressed",
                       })
                    ),
                    o.appendChild(
                       wh.createLabel.call(this, a.labelPressed, {
                          class: "label--pressed",
                       })
                    ),
                    o.appendChild(
                       wh.createLabel.call(this, a.label, {
                          class: "label--not-pressed",
                       })
                    ))
                  : (o.appendChild(wh.createIcon.call(this, a.icon)),
                    o.appendChild(wh.createLabel.call(this, a.label))),
               hu(i, bu(this.config.selectors.buttons[r], i)),
               du(o, i),
               "play" === r
                  ? (Gc(this.elements.buttons[r]) ||
                       (this.elements.buttons[r] = []),
                    this.elements.buttons[r].push(o))
                  : (this.elements.buttons[r] = o),
               o
            );
         },
         createRange: function (e, t) {
            var n = pu(
               "input",
               hu(
                  bu(this.config.selectors.inputs[e]),
                  {
                     type: "range",
                     min: 0,
                     max: 100,
                     step: 0.01,
                     value: 0,
                     autocomplete: "off",
                     role: "slider",
                     "aria-label": uh(e, this.config),
                     "aria-valuemin": 0,
                     "aria-valuemax": 100,
                     "aria-valuenow": 0,
                  },
                  t
               )
            );
            return (
               (this.elements.inputs[e] = n),
               wh.updateRangeFill.call(this, n),
               hl.setup(n),
               n
            );
         },
         createProgress: function (e, t) {
            var n = pu(
               "progress",
               hu(
                  bu(this.config.selectors.display[e]),
                  {
                     min: 0,
                     max: 100,
                     value: 0,
                     role: "progressbar",
                     "aria-hidden": !0,
                  },
                  t
               )
            );
            if ("volume" !== e) {
               n.appendChild(pu("span", null, "0"));
               var i = { played: "played", buffer: "buffered" }[e],
                  r = i ? uh(i, this.config) : "";
               n.innerText = "% ".concat(r.toLowerCase());
            }
            return (this.elements.display[e] = n), n;
         },
         createTime: function (e, t) {
            var n = bu(this.config.selectors.display[e], t),
               i = pu(
                  "div",
                  hu(n, {
                     class: ""
                        .concat(n.class ? n.class : "", " ")
                        .concat(this.config.classNames.display.time, " ")
                        .trim(),
                     "aria-label": uh(e, this.config),
                  }),
                  "00:00"
               );
            return (this.elements.display[e] = i), i;
         },
         bindMenuItemShortcuts: function (e, t) {
            var n = this;
            ju.call(
               this,
               e,
               "keydown keyup",
               function (i) {
                  if (
                     [32, 38, 39, 40].includes(i.which) &&
                     (i.preventDefault(),
                     i.stopPropagation(),
                     "keydown" !== i.type)
                  ) {
                     var r,
                        a = Su(e, '[role="menuitemradio"]');
                     if (!a && [32, 39].includes(i.which))
                        wh.showMenuPanel.call(n, t, !0);
                     else
                        32 !== i.which &&
                           (40 === i.which || (a && 39 === i.which)
                              ? ((r = e.nextElementSibling),
                                Qc(r) || (r = e.parentNode.firstElementChild))
                              : ((r = e.previousElementSibling),
                                Qc(r) || (r = e.parentNode.lastElementChild)),
                           xu.call(n, r, !0));
                  }
               },
               !1
            ),
               ju.call(this, e, "keyup", function (e) {
                  13 === e.which && wh.focusFirstMenuItem.call(n, null, !0);
               });
         },
         createMenuItem: function (e) {
            var t = this,
               n = e.value,
               i = e.list,
               r = e.type,
               a = e.title,
               o = e.badge,
               s = void 0 === o ? null : o,
               l = e.checked,
               c = void 0 !== l && l,
               u = bu(this.config.selectors.inputs[r]),
               h = pu(
                  "button",
                  hu(u, {
                     type: "button",
                     role: "menuitemradio",
                     class: ""
                        .concat(this.config.classNames.control, " ")
                        .concat(u.class ? u.class : "")
                        .trim(),
                     "aria-checked": c,
                     value: n,
                  })
               ),
               f = pu("span");
            (f.innerHTML = a),
               Qc(s) && f.appendChild(s),
               h.appendChild(f),
               Object.defineProperty(h, "checked", {
                  enumerable: !0,
                  get: function () {
                     return "true" === h.getAttribute("aria-checked");
                  },
                  set: function (e) {
                     e &&
                        Array.from(h.parentNode.children)
                           .filter(function (e) {
                              return Su(e, '[role="menuitemradio"]');
                           })
                           .forEach(function (e) {
                              return e.setAttribute("aria-checked", "false");
                           }),
                        h.setAttribute("aria-checked", e ? "true" : "false");
                  },
               }),
               this.listeners.bind(
                  h,
                  "click keyup",
                  function (e) {
                     if (!Zc(e) || 32 === e.which) {
                        switch (
                           (e.preventDefault(),
                           e.stopPropagation(),
                           (h.checked = !0),
                           r)
                        ) {
                           case "language":
                              t.currentTrack = Number(n);
                              break;
                           case "quality":
                              t.quality = n;
                              break;
                           case "speed":
                              t.speed = parseFloat(n);
                        }
                        wh.showMenuPanel.call(t, "home", Zc(e));
                     }
                  },
                  r,
                  !1
               ),
               wh.bindMenuItemShortcuts.call(this, h, r),
               i.appendChild(h);
         },
         formatTime: function () {
            var e =
                  arguments.length > 0 && void 0 !== arguments[0]
                     ? arguments[0]
                     : 0,
               t =
                  arguments.length > 1 &&
                  void 0 !== arguments[1] &&
                  arguments[1];
            if (!Wc(e)) return e;
            var n = gh(this.duration) > 0;
            return bh(e, n, t);
         },
         updateTimeDisplay: function () {
            var e =
                  arguments.length > 0 && void 0 !== arguments[0]
                     ? arguments[0]
                     : null,
               t =
                  arguments.length > 1 && void 0 !== arguments[1]
                     ? arguments[1]
                     : 0,
               n =
                  arguments.length > 2 &&
                  void 0 !== arguments[2] &&
                  arguments[2];
            Qc(e) && Wc(t) && (e.innerText = wh.formatTime(t, n));
         },
         updateVolume: function () {
            this.supported.ui &&
               (Qc(this.elements.inputs.volume) &&
                  wh.setRange.call(
                     this,
                     this.elements.inputs.volume,
                     this.muted ? 0 : this.volume
                  ),
               Qc(this.elements.buttons.mute) &&
                  (this.elements.buttons.mute.pressed =
                     this.muted || 0 === this.volume));
         },
         setRange: function (e) {
            var t =
               arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : 0;
            Qc(e) && ((e.value = t), wh.updateRangeFill.call(this, e));
         },
         updateProgress: function (e) {
            var t = this;
            if (this.supported.ui && Jc(e)) {
               var n = 0;
               if (e)
                  switch (e.type) {
                     case "timeupdate":
                     case "seeking":
                     case "seeked":
                        (n = (function (e, t) {
                           return 0 === e ||
                              0 === t ||
                              Number.isNaN(e) ||
                              Number.isNaN(t)
                              ? 0
                              : ((e / t) * 100).toFixed(2);
                        })(this.currentTime, this.duration)),
                           "timeupdate" === e.type &&
                              wh.setRange.call(
                                 this,
                                 this.elements.inputs.seek,
                                 n
                              );
                        break;
                     case "playing":
                     case "progress":
                        !(function (e, n) {
                           var i = Wc(n) ? n : 0,
                              r = Qc(e) ? e : t.elements.display.buffer;
                           if (Qc(r)) {
                              r.value = i;
                              var a = r.getElementsByTagName("span")[0];
                              Qc(a) && (a.childNodes[0].nodeValue = i);
                           }
                        })(this.elements.display.buffer, 100 * this.buffered);
                  }
            }
         },
         updateRangeFill: function (e) {
            var t = Jc(e) ? e.target : e;
            if (Qc(t) && "range" === t.getAttribute("type")) {
               if (Su(t, this.config.selectors.inputs.seek)) {
                  t.setAttribute("aria-valuenow", this.currentTime);
                  var n = wh.formatTime(this.currentTime),
                     i = wh.formatTime(this.duration),
                     r = uh("seekLabel", this.config);
                  t.setAttribute(
                     "aria-valuetext",
                     r.replace("{currentTime}", n).replace("{duration}", i)
                  );
               } else if (Su(t, this.config.selectors.inputs.volume)) {
                  var a = 100 * t.value;
                  t.setAttribute("aria-valuenow", a),
                     t.setAttribute(
                        "aria-valuetext",
                        "".concat(a.toFixed(1), "%")
                     );
               } else t.setAttribute("aria-valuenow", t.value);
               au.isWebkit &&
                  t.style.setProperty(
                     "--value",
                     "".concat((t.value / t.max) * 100, "%")
                  );
            }
         },
         updateSeekTooltip: function (e) {
            var t = this;
            if (
               this.config.tooltips.seek &&
               Qc(this.elements.inputs.seek) &&
               Qc(this.elements.display.seekTooltip) &&
               0 !== this.duration
            ) {
               var n = "".concat(this.config.classNames.tooltip, "--visible"),
                  i = function (e) {
                     return ku(t.elements.display.seekTooltip, n, e);
                  };
               if (this.touch) i(!1);
               else {
                  var r = 0,
                     a = this.elements.progress.getBoundingClientRect();
                  if (Jc(e)) r = (100 / a.width) * (e.pageX - a.left);
                  else {
                     if (!Tu(this.elements.display.seekTooltip, n)) return;
                     r = parseFloat(
                        this.elements.display.seekTooltip.style.left,
                        10
                     );
                  }
                  r < 0 ? (r = 0) : r > 100 && (r = 100),
                     wh.updateTimeDisplay.call(
                        this,
                        this.elements.display.seekTooltip,
                        (this.duration / 100) * r
                     ),
                     (this.elements.display.seekTooltip.style.left = "".concat(
                        r,
                        "%"
                     )),
                     Jc(e) &&
                        ["mouseenter", "mouseleave"].includes(e.type) &&
                        i("mouseenter" === e.type);
               }
            }
         },
         timeUpdate: function (e) {
            var t =
               !Qc(this.elements.display.duration) && this.config.invertTime;
            wh.updateTimeDisplay.call(
               this,
               this.elements.display.currentTime,
               t ? this.duration - this.currentTime : this.currentTime,
               t
            ),
               (e && "timeupdate" === e.type && this.media.seeking) ||
                  wh.updateProgress.call(this, e);
         },
         durationUpdate: function () {
            if (
               this.supported.ui &&
               (this.config.invertTime || !this.currentTime)
            ) {
               if (this.duration >= Math.pow(2, 32))
                  return (
                     wu(this.elements.display.currentTime, !0),
                     void wu(this.elements.progress, !0)
                  );
               Qc(this.elements.inputs.seek) &&
                  this.elements.inputs.seek.setAttribute(
                     "aria-valuemax",
                     this.duration
                  );
               var e = Qc(this.elements.display.duration);
               !e &&
                  this.config.displayDuration &&
                  this.paused &&
                  wh.updateTimeDisplay.call(
                     this,
                     this.elements.display.currentTime,
                     this.duration
                  ),
                  e &&
                     wh.updateTimeDisplay.call(
                        this,
                        this.elements.display.duration,
                        this.duration
                     ),
                  wh.updateSeekTooltip.call(this);
            }
         },
         toggleMenuButton: function (e, t) {
            wu(this.elements.settings.buttons[e], !t);
         },
         updateSetting: function (e, t, n) {
            var i = this.elements.settings.panels[e],
               r = null,
               a = t;
            if ("captions" === e) r = this.currentTrack;
            else {
               if (
                  ((r = nu(n) ? this[e] : n),
                  nu(r) && (r = this.config[e].default),
                  !nu(this.options[e]) && !this.options[e].includes(r))
               )
                  return void this.debug.warn(
                     "Unsupported value of '".concat(r, "' for ").concat(e)
                  );
               if (!this.config[e].options.includes(r))
                  return void this.debug.warn(
                     "Disabled value of '".concat(r, "' for ").concat(e)
                  );
            }
            if ((Qc(a) || (a = i && i.querySelector('[role="menu"]')), Qc(a))) {
               this.elements.settings.buttons[e].querySelector(
                  ".".concat(this.config.classNames.menu.value)
               ).innerHTML = wh.getLabel.call(this, e, r);
               var o = a && a.querySelector('[value="'.concat(r, '"]'));
               Qc(o) && (o.checked = !0);
            }
         },
         getLabel: function (e, t) {
            switch (e) {
               case "speed":
                  return 1 === t
                     ? uh("normal", this.config)
                     : "".concat(t, "&times;");
               case "quality":
                  if (Wc(t)) {
                     var n = uh("qualityLabel.".concat(t), this.config);
                     return n.length ? n : "".concat(t, "p");
                  }
                  return oh(t);
               case "captions":
                  return Sh.getLabel.call(this);
               default:
                  return null;
            }
         },
         setQualityMenu: function (e) {
            var t = this;
            if (Qc(this.elements.settings.panels.quality)) {
               var n = this.elements.settings.panels.quality.querySelector(
                  '[role="menu"]'
               );
               Gc(e) &&
                  (this.options.quality = Vu(e).filter(function (e) {
                     return t.config.quality.options.includes(e);
                  }));
               var i =
                  !nu(this.options.quality) && this.options.quality.length > 1;
               if (
                  (wh.toggleMenuButton.call(this, "quality", i),
                  vu(n),
                  wh.checkMenu.call(this),
                  i)
               ) {
                  var r = function (e) {
                     var n = uh("qualityBadge.".concat(e), t.config);
                     return n.length ? wh.createBadge.call(t, n) : null;
                  };
                  this.options.quality
                     .sort(function (e, n) {
                        var i = t.config.quality.options;
                        return i.indexOf(e) > i.indexOf(n) ? 1 : -1;
                     })
                     .forEach(function (e) {
                        wh.createMenuItem.call(t, {
                           value: e,
                           list: n,
                           type: "quality",
                           title: wh.getLabel.call(t, "quality", e),
                           badge: r(e),
                        });
                     }),
                     wh.updateSetting.call(this, "quality", n);
               }
            }
         },
         setCaptionsMenu: function () {
            var e = this;
            if (Qc(this.elements.settings.panels.captions)) {
               var t = this.elements.settings.panels.captions.querySelector(
                     '[role="menu"]'
                  ),
                  n = Sh.getTracks.call(this),
                  i = Boolean(n.length);
               if (
                  (wh.toggleMenuButton.call(this, "captions", i),
                  vu(t),
                  wh.checkMenu.call(this),
                  i)
               ) {
                  var r = n.map(function (n, i) {
                     return {
                        value: i,
                        checked: e.captions.toggled && e.currentTrack === i,
                        title: Sh.getLabel.call(e, n),
                        badge:
                           n.language &&
                           wh.createBadge.call(e, n.language.toUpperCase()),
                        list: t,
                        type: "language",
                     };
                  });
                  r.unshift({
                     value: -1,
                     checked: !this.captions.toggled,
                     title: uh("disabled", this.config),
                     list: t,
                     type: "language",
                  }),
                     r.forEach(wh.createMenuItem.bind(this)),
                     wh.updateSetting.call(this, "captions", t);
               }
            }
         },
         setSpeedMenu: function () {
            var e = this;
            if (Qc(this.elements.settings.panels.speed)) {
               var t = this.elements.settings.panels.speed.querySelector(
                  '[role="menu"]'
               );
               this.options.speed = this.options.speed.filter(function (t) {
                  return t >= e.minimumSpeed && t <= e.maximumSpeed;
               });
               var n = !nu(this.options.speed) && this.options.speed.length > 1;
               wh.toggleMenuButton.call(this, "speed", n),
                  vu(t),
                  wh.checkMenu.call(this),
                  n &&
                     (this.options.speed.forEach(function (n) {
                        wh.createMenuItem.call(e, {
                           value: n,
                           list: t,
                           type: "speed",
                           title: wh.getLabel.call(e, "speed", n),
                        });
                     }),
                     wh.updateSetting.call(this, "speed", t));
            }
         },
         checkMenu: function () {
            var e = this.elements.settings.buttons,
               t =
                  !nu(e) &&
                  Object.values(e).some(function (e) {
                     return !e.hidden;
                  });
            wu(this.elements.settings.menu, !t);
         },
         focusFirstMenuItem: function (e) {
            var t =
               arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
            if (!this.elements.settings.popup.hidden) {
               var n = e;
               Qc(n) ||
                  (n = Object.values(this.elements.settings.panels).find(
                     function (e) {
                        return !e.hidden;
                     }
                  ));
               var i = n.querySelector('[role^="menuitem"]');
               xu.call(this, i, t);
            }
         },
         toggleMenu: function (e) {
            var t = this.elements.settings.popup,
               n = this.elements.buttons.settings;
            if (Qc(t) && Qc(n)) {
               var i = t.hidden,
                  r = i;
               if ($c(e)) r = e;
               else if (Zc(e) && 27 === e.which) r = !1;
               else if (Jc(e)) {
                  var a = Yc(e.composedPath) ? e.composedPath()[0] : e.target,
                     o = t.contains(a);
                  if (o || (!o && e.target !== n && r)) return;
               }
               n.setAttribute("aria-expanded", r),
                  wu(t, !r),
                  ku(
                     this.elements.container,
                     this.config.classNames.menu.open,
                     r
                  ),
                  r && Zc(e)
                     ? wh.focusFirstMenuItem.call(this, null, !0)
                     : r || i || xu.call(this, n, Zc(e));
            }
         },
         getMenuSize: function (e) {
            var t = e.cloneNode(!0);
            (t.style.position = "absolute"),
               (t.style.opacity = 0),
               t.removeAttribute("hidden"),
               e.parentNode.appendChild(t);
            var n = t.scrollWidth,
               i = t.scrollHeight;
            return gu(t), { width: n, height: i };
         },
         showMenuPanel: function () {
            var e = this,
               t =
                  arguments.length > 0 && void 0 !== arguments[0]
                     ? arguments[0]
                     : "",
               n =
                  arguments.length > 1 &&
                  void 0 !== arguments[1] &&
                  arguments[1],
               i = this.elements.container.querySelector(
                  "#plyr-settings-".concat(this.id, "-").concat(t)
               );
            if (Qc(i)) {
               var r = i.parentNode,
                  a = Array.from(r.children).find(function (e) {
                     return !e.hidden;
                  });
               if (Iu.transitions && !Iu.reducedMotion) {
                  (r.style.width = "".concat(a.scrollWidth, "px")),
                     (r.style.height = "".concat(a.scrollHeight, "px"));
                  var o = wh.getMenuSize.call(this, i),
                     s = function t(n) {
                        n.target === r &&
                           ["width", "height"].includes(n.propertyName) &&
                           ((r.style.width = ""),
                           (r.style.height = ""),
                           Mu.call(e, r, iu, t));
                     };
                  ju.call(this, r, iu, s),
                     (r.style.width = "".concat(o.width, "px")),
                     (r.style.height = "".concat(o.height, "px"));
               }
               wu(a, !0), wu(i, !1), wh.focusFirstMenuItem.call(this, i, n);
            }
         },
         setDownloadUrl: function () {
            var e = this.elements.buttons.download;
            Qc(e) && e.setAttribute("href", this.download);
         },
         create: function (e) {
            var t = this,
               n = wh.bindMenuItemShortcuts,
               i = wh.createButton,
               r = wh.createProgress,
               a = wh.createRange,
               o = wh.createTime,
               s = wh.setQualityMenu,
               l = wh.setSpeedMenu,
               c = wh.showMenuPanel;
            (this.elements.controls = null),
               this.config.controls.includes("play-large") &&
                  this.elements.container.appendChild(
                     i.call(this, "play-large")
                  );
            var u = pu("div", bu(this.config.selectors.controls.wrapper));
            this.elements.controls = u;
            var h = { class: "plyr__controls__item" };
            return (
               Vu(this.config.controls).forEach(function (s) {
                  if (
                     ("restart" === s && u.appendChild(i.call(t, "restart", h)),
                     "rewind" === s && u.appendChild(i.call(t, "rewind", h)),
                     "play" === s && u.appendChild(i.call(t, "play", h)),
                     "fast-forward" === s &&
                        u.appendChild(i.call(t, "fast-forward", h)),
                     "progress" === s)
                  ) {
                     var l = pu("div", {
                           class: "".concat(
                              h.class,
                              " plyr__progress__container"
                           ),
                        }),
                        f = pu("div", bu(t.config.selectors.progress));
                     if (
                        (f.appendChild(
                           a.call(t, "seek", { id: "plyr-seek-".concat(e.id) })
                        ),
                        f.appendChild(r.call(t, "buffer")),
                        t.config.tooltips.seek)
                     ) {
                        var d = pu(
                           "span",
                           { class: t.config.classNames.tooltip },
                           "00:00"
                        );
                        f.appendChild(d), (t.elements.display.seekTooltip = d);
                     }
                     (t.elements.progress = f),
                        l.appendChild(t.elements.progress),
                        u.appendChild(l);
                  }
                  if (
                     ("current-time" === s &&
                        u.appendChild(o.call(t, "currentTime", h)),
                     "duration" === s &&
                        u.appendChild(o.call(t, "duration", h)),
                     "mute" === s || "volume" === s)
                  ) {
                     var p = t.elements.volume;
                     if (
                        ((Qc(p) && u.contains(p)) ||
                           ((p = pu(
                              "div",
                              hu({}, h, {
                                 class: ""
                                    .concat(h.class, " plyr__volume")
                                    .trim(),
                              })
                           )),
                           (t.elements.volume = p),
                           u.appendChild(p)),
                        "mute" === s && p.appendChild(i.call(t, "mute")),
                        "volume" === s && !au.isIos)
                     ) {
                        var m = { max: 1, step: 0.05, value: t.config.volume };
                        p.appendChild(
                           a.call(
                              t,
                              "volume",
                              hu(m, { id: "plyr-volume-".concat(e.id) })
                           )
                        );
                     }
                  }
                  if (
                     ("captions" === s &&
                        u.appendChild(i.call(t, "captions", h)),
                     "settings" === s && !nu(t.config.settings))
                  ) {
                     var g = pu(
                        "div",
                        hu({}, h, {
                           class: "".concat(h.class, " plyr__menu").trim(),
                           hidden: "",
                        })
                     );
                     g.appendChild(
                        i.call(t, "settings", {
                           "aria-haspopup": !0,
                           "aria-controls": "plyr-settings-".concat(e.id),
                           "aria-expanded": !1,
                        })
                     );
                     var v = pu("div", {
                           class: "plyr__menu__container",
                           id: "plyr-settings-".concat(e.id),
                           hidden: "",
                        }),
                        y = pu("div"),
                        b = pu("div", {
                           id: "plyr-settings-".concat(e.id, "-home"),
                        }),
                        w = pu("div", { role: "menu" });
                     b.appendChild(w),
                        y.appendChild(b),
                        (t.elements.settings.panels.home = b),
                        t.config.settings.forEach(function (i) {
                           var r = pu(
                              "button",
                              hu(bu(t.config.selectors.buttons.settings), {
                                 type: "button",
                                 class: ""
                                    .concat(t.config.classNames.control, " ")
                                    .concat(
                                       t.config.classNames.control,
                                       "--forward"
                                    ),
                                 role: "menuitem",
                                 "aria-haspopup": !0,
                                 hidden: "",
                              })
                           );
                           n.call(t, r, i),
                              ju.call(t, r, "click", function () {
                                 c.call(t, i, !1);
                              });
                           var a = pu("span", null, uh(i, t.config)),
                              o = pu("span", {
                                 class: t.config.classNames.menu.value,
                              });
                           (o.innerHTML = e[i]),
                              a.appendChild(o),
                              r.appendChild(a),
                              w.appendChild(r);
                           var s = pu("div", {
                                 id: "plyr-settings-"
                                    .concat(e.id, "-")
                                    .concat(i),
                                 hidden: "",
                              }),
                              l = pu("button", {
                                 type: "button",
                                 class: ""
                                    .concat(t.config.classNames.control, " ")
                                    .concat(
                                       t.config.classNames.control,
                                       "--back"
                                    ),
                              });
                           l.appendChild(
                              pu("span", { "aria-hidden": !0 }, uh(i, t.config))
                           ),
                              l.appendChild(
                                 pu(
                                    "span",
                                    { class: t.config.classNames.hidden },
                                    uh("menuBack", t.config)
                                 )
                              ),
                              ju.call(
                                 t,
                                 s,
                                 "keydown",
                                 function (e) {
                                    37 === e.which &&
                                       (e.preventDefault(),
                                       e.stopPropagation(),
                                       c.call(t, "home", !0));
                                 },
                                 !1
                              ),
                              ju.call(t, l, "click", function () {
                                 c.call(t, "home", !1);
                              }),
                              s.appendChild(l),
                              s.appendChild(pu("div", { role: "menu" })),
                              y.appendChild(s),
                              (t.elements.settings.buttons[i] = r),
                              (t.elements.settings.panels[i] = s);
                        }),
                        v.appendChild(y),
                        g.appendChild(v),
                        u.appendChild(g),
                        (t.elements.settings.popup = v),
                        (t.elements.settings.menu = g);
                  }
                  if (
                     ("pip" === s &&
                        Iu.pip &&
                        u.appendChild(i.call(t, "pip", h)),
                     "airplay" === s &&
                        Iu.airplay &&
                        u.appendChild(i.call(t, "airplay", h)),
                     "download" === s)
                  ) {
                     var k = hu({}, h, {
                        element: "a",
                        href: t.download,
                        target: "_blank",
                     });
                     t.isHTML5 && (k.download = "");
                     var T = t.config.urls.download;
                     !tu(T) &&
                        t.isEmbed &&
                        hu(k, {
                           icon: "logo-".concat(t.provider),
                           label: t.provider,
                        }),
                        u.appendChild(i.call(t, "download", k));
                  }
                  "fullscreen" === s &&
                     u.appendChild(i.call(t, "fullscreen", h));
               }),
               this.isHTML5 && s.call(this, Bu.getQualityOptions.call(this)),
               l.call(this),
               u
            );
         },
         inject: function () {
            var e = this;
            if (this.config.loadSprite) {
               var t = wh.getIconUrl.call(this);
               t.cors && dh(t.url, "sprite-plyr");
            }
            this.id = Math.floor(1e4 * Math.random());
            var n = null;
            this.elements.controls = null;
            var i = {
                  id: this.id,
                  seektime: this.config.seekTime,
                  title: this.config.title,
               },
               r = !0;
            Yc(this.config.controls) &&
               (this.config.controls = this.config.controls.call(this, i)),
               this.config.controls || (this.config.controls = []),
               Qc(this.config.controls) || Kc(this.config.controls)
                  ? (n = this.config.controls)
                  : ((n = wh.create.call(this, {
                       id: this.id,
                       seektime: this.config.seekTime,
                       speed: this.speed,
                       quality: this.quality,
                       captions: Sh.getLabel.call(this),
                    })),
                    (r = !1));
            var a,
               o = function (e) {
                  var t = e;
                  return (
                     Object.entries(i).forEach(function (e) {
                        var n = Eo(e, 2),
                           i = n[0],
                           r = n[1];
                        t = ah(t, "{".concat(i, "}"), r);
                     }),
                     t
                  );
               };
            if (
               (r &&
                  (Kc(this.config.controls)
                     ? (n = o(n))
                     : Qc(n) && (n.innerHTML = o(n.innerHTML))),
               Kc(this.config.selectors.controls.container) &&
                  (a = document.querySelector(
                     this.config.selectors.controls.container
                  )),
               Qc(a) || (a = this.elements.container),
               a[Qc(n) ? "insertAdjacentElement" : "insertAdjacentHTML"](
                  "afterbegin",
                  n
               ),
               Qc(this.elements.controls) || wh.findElements.call(this),
               !nu(this.elements.buttons))
            ) {
               var s = function (t) {
                  var n = e.config.classNames.controlPressed;
                  Object.defineProperty(t, "pressed", {
                     enumerable: !0,
                     get: function () {
                        return Tu(t, n);
                     },
                     set: function () {
                        var e =
                           arguments.length > 0 &&
                           void 0 !== arguments[0] &&
                           arguments[0];
                        ku(t, n, e);
                     },
                  });
               };
               Object.values(this.elements.buttons)
                  .filter(Boolean)
                  .forEach(function (e) {
                     Gc(e) || Xc(e)
                        ? Array.from(e).filter(Boolean).forEach(s)
                        : s(e);
                  });
            }
            if ((au.isEdge && ru(a), this.config.tooltips.controls)) {
               var l = this.config,
                  c = l.classNames,
                  u = l.selectors,
                  h = ""
                     .concat(u.controls.wrapper, " ")
                     .concat(u.labels, " .")
                     .concat(c.hidden),
                  f = Eu.call(this, h);
               Array.from(f).forEach(function (t) {
                  ku(t, e.config.classNames.hidden, !1),
                     ku(t, e.config.classNames.tooltip, !0);
               });
            }
         },
      };
      function kh(e) {
         var t =
               !(arguments.length > 1 && void 0 !== arguments[1]) ||
               arguments[1],
            n = e;
         if (t) {
            var i = document.createElement("a");
            (i.href = n), (n = i.href);
         }
         try {
            return new URL(n);
         } catch (e) {
            return null;
         }
      }
      function Th(e) {
         var t = new URLSearchParams();
         return (
            zc(e) &&
               Object.entries(e).forEach(function (e) {
                  var n = Eo(e, 2),
                     i = n[0],
                     r = n[1];
                  t.set(i, r);
               }),
            t
         );
      }
      var Sh = {
            setup: function () {
               if (this.supported.ui)
                  if (
                     !this.isVideo ||
                     this.isYouTube ||
                     (this.isHTML5 && !Iu.textTracks)
                  )
                     Gc(this.config.controls) &&
                        this.config.controls.includes("settings") &&
                        this.config.settings.includes("captions") &&
                        wh.setCaptionsMenu.call(this);
                  else {
                     if (
                        (Qc(this.elements.captions) ||
                           ((this.elements.captions = pu(
                              "div",
                              bu(this.config.selectors.captions)
                           )),
                           (function (e, t) {
                              Qc(e) &&
                                 Qc(t) &&
                                 t.parentNode.insertBefore(e, t.nextSibling);
                           })(this.elements.captions, this.elements.wrapper)),
                        au.isIE && window.URL)
                     ) {
                        var e = this.media.querySelectorAll("track");
                        Array.from(e).forEach(function (e) {
                           var t = e.getAttribute("src"),
                              n = kh(t);
                           null !== n &&
                              n.hostname !== window.location.href.hostname &&
                              ["http:", "https:"].includes(n.protocol) &&
                              fh(t, "blob")
                                 .then(function (t) {
                                    e.setAttribute(
                                       "src",
                                       window.URL.createObjectURL(t)
                                    );
                                 })
                                 .catch(function () {
                                    gu(e);
                                 });
                        });
                     }
                     var t = Vu(
                           (
                              navigator.languages || [
                                 navigator.language ||
                                    navigator.userLanguage ||
                                    "en",
                              ]
                           ).map(function (e) {
                              return e.split("-")[0];
                           })
                        ),
                        n = (
                           this.storage.get("language") ||
                           this.config.captions.language ||
                           "auto"
                        ).toLowerCase();
                     if ("auto" === n) n = Eo(t, 1)[0];
                     var i = this.storage.get("captions");
                     if (
                        ($c(i) || (i = this.config.captions.active),
                        Object.assign(this.captions, {
                           toggled: !1,
                           active: i,
                           language: n,
                           languages: t,
                        }),
                        this.isHTML5)
                     ) {
                        var r = this.config.captions.update
                           ? "addtrack removetrack"
                           : "removetrack";
                        ju.call(
                           this,
                           this.media.textTracks,
                           r,
                           Sh.update.bind(this)
                        );
                     }
                     setTimeout(Sh.update.bind(this), 0);
                  }
            },
            update: function () {
               var e = this,
                  t = Sh.getTracks.call(this, !0),
                  n = this.captions,
                  i = n.active,
                  r = n.language,
                  a = n.meta,
                  o = n.currentTrackNode,
                  s = Boolean(
                     t.find(function (e) {
                        return e.language === r;
                     })
                  );
               this.isHTML5 &&
                  this.isVideo &&
                  t
                     .filter(function (e) {
                        return !a.get(e);
                     })
                     .forEach(function (t) {
                        e.debug.log("Track added", t),
                           a.set(t, { default: "showing" === t.mode }),
                           (t.mode = "hidden"),
                           ju.call(e, t, "cuechange", function () {
                              return Sh.updateCues.call(e);
                           });
                     }),
                  ((s && this.language !== r) || !t.includes(o)) &&
                     (Sh.setLanguage.call(this, r),
                     Sh.toggle.call(this, i && s)),
                  ku(
                     this.elements.container,
                     this.config.classNames.captions.enabled,
                     !nu(t)
                  ),
                  (this.config.controls || []).includes("settings") &&
                     this.config.settings.includes("captions") &&
                     wh.setCaptionsMenu.call(this);
            },
            toggle: function (e) {
               var t =
                  !(arguments.length > 1 && void 0 !== arguments[1]) ||
                  arguments[1];
               if (this.supported.ui) {
                  var n = this.captions.toggled,
                     i = this.config.classNames.captions.active,
                     r = Vc(e) ? !n : e;
                  if (r !== n) {
                     if (
                        (t ||
                           ((this.captions.active = r),
                           this.storage.set({ captions: r })),
                        !this.language && r && !t)
                     ) {
                        var a = Sh.getTracks.call(this),
                           o = Sh.findTrack.call(
                              this,
                              [this.captions.language].concat(
                                 Ao(this.captions.languages)
                              ),
                              !0
                           );
                        return (
                           (this.captions.language = o.language),
                           void Sh.set.call(this, a.indexOf(o))
                        );
                     }
                     this.elements.buttons.captions &&
                        (this.elements.buttons.captions.pressed = r),
                        ku(this.elements.container, i, r),
                        (this.captions.toggled = r),
                        wh.updateSetting.call(this, "captions"),
                        Ru.call(
                           this,
                           this.media,
                           r ? "captionsenabled" : "captionsdisabled"
                        );
                  }
               }
            },
            set: function (e) {
               var t =
                     !(arguments.length > 1 && void 0 !== arguments[1]) ||
                     arguments[1],
                  n = Sh.getTracks.call(this);
               if (-1 !== e)
                  if (Wc(e))
                     if (e in n) {
                        if (this.captions.currentTrack !== e) {
                           this.captions.currentTrack = e;
                           var i = n[e],
                              r = i || {},
                              a = r.language;
                           (this.captions.currentTrackNode = i),
                              wh.updateSetting.call(this, "captions"),
                              t ||
                                 ((this.captions.language = a),
                                 this.storage.set({ language: a })),
                              this.isVimeo && this.embed.enableTextTrack(a),
                              Ru.call(this, this.media, "languagechange");
                        }
                        Sh.toggle.call(this, !0, t),
                           this.isHTML5 &&
                              this.isVideo &&
                              Sh.updateCues.call(this);
                     } else this.debug.warn("Track not found", e);
                  else this.debug.warn("Invalid caption argument", e);
               else Sh.toggle.call(this, !1, t);
            },
            setLanguage: function (e) {
               var t =
                  !(arguments.length > 1 && void 0 !== arguments[1]) ||
                  arguments[1];
               if (Kc(e)) {
                  var n = e.toLowerCase();
                  this.captions.language = n;
                  var i = Sh.getTracks.call(this),
                     r = Sh.findTrack.call(this, [n]);
                  Sh.set.call(this, i.indexOf(r), t);
               } else this.debug.warn("Invalid language argument", e);
            },
            getTracks: function () {
               var e = this,
                  t =
                     arguments.length > 0 &&
                     void 0 !== arguments[0] &&
                     arguments[0],
                  n = Array.from((this.media || {}).textTracks || []);
               return n
                  .filter(function (n) {
                     return !e.isHTML5 || t || e.captions.meta.has(n);
                  })
                  .filter(function (e) {
                     return ["captions", "subtitles"].includes(e.kind);
                  });
            },
            findTrack: function (e) {
               var t,
                  n = this,
                  i =
                     arguments.length > 1 &&
                     void 0 !== arguments[1] &&
                     arguments[1],
                  r = Sh.getTracks.call(this),
                  a = function (e) {
                     return Number((n.captions.meta.get(e) || {}).default);
                  },
                  o = Array.from(r).sort(function (e, t) {
                     return a(t) - a(e);
                  });
               return (
                  e.every(function (e) {
                     return !(t = o.find(function (t) {
                        return t.language === e;
                     }));
                  }),
                  t || (i ? o[0] : void 0)
               );
            },
            getCurrentTrack: function () {
               return Sh.getTracks.call(this)[this.currentTrack];
            },
            getLabel: function (e) {
               var t = e;
               return (
                  !eu(t) &&
                     Iu.textTracks &&
                     this.captions.toggled &&
                     (t = Sh.getCurrentTrack.call(this)),
                  eu(t)
                     ? nu(t.label)
                        ? nu(t.language)
                           ? uh("enabled", this.config)
                           : e.language.toUpperCase()
                        : t.label
                     : uh("disabled", this.config)
               );
            },
            updateCues: function (e) {
               if (this.supported.ui)
                  if (Qc(this.elements.captions))
                     if (Vc(e) || Array.isArray(e)) {
                        var t = e;
                        if (!t) {
                           var n = Sh.getCurrentTrack.call(this);
                           t = Array.from((n || {}).activeCues || [])
                              .map(function (e) {
                                 return e.getCueAsHTML();
                              })
                              .map(lh);
                        }
                        var i = t
                           .map(function (e) {
                              return e.trim();
                           })
                           .join("\n");
                        if (i !== this.elements.captions.innerHTML) {
                           vu(this.elements.captions);
                           var r = pu(
                              "span",
                              bu(this.config.selectors.caption)
                           );
                           (r.innerHTML = i),
                              this.elements.captions.appendChild(r),
                              Ru.call(this, this.media, "cuechange");
                        }
                     } else this.debug.warn("updateCues: Invalid input", e);
                  else this.debug.warn("No captions element to render to");
            },
         },
         Eh = {
            enabled: !0,
            title: "",
            debug: !1,
            autoplay: !1,
            autopause: !0,
            playsinline: !0,
            seekTime: 10,
            volume: 1,
            muted: !1,
            duration: null,
            displayDuration: !0,
            invertTime: !0,
            toggleInvert: !0,
            ratio: null,
            clickToPlay: !0,
            hideControls: !0,
            resetOnEnd: !1,
            disableContextMenu: !0,
            loadSprite: !0,
            iconPrefix: "plyr",
            iconUrl: "https://cdn.plyr.io/3.5.10/plyr.svg",
            blankVideo: "https://cdn.plyr.io/static/blank.mp4",
            quality: {
               default: 576,
               options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240],
               forced: !1,
               onChange: null,
            },
            loop: { active: !1 },
            speed: {
               selected: 1,
               options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4],
            },
            keyboard: { focused: !0, global: !1 },
            tooltips: { controls: !1, seek: !0 },
            captions: { active: !1, language: "auto", update: !1 },
            fullscreen: { enabled: !0, fallback: !0, iosNative: !1 },
            storage: { enabled: !0, key: "plyr" },
            controls: [
               "play-large",
               "play",
               "progress",
               "current-time",
               "mute",
               "volume",
               "captions",
               "settings",
               "pip",
               "airplay",
               "fullscreen",
            ],
            settings: ["captions", "quality", "speed"],
            i18n: {
               restart: "Restart",
               rewind: "Rewind {seektime}s",
               play: "Play",
               pause: "Pause",
               fastForward: "Forward {seektime}s",
               seek: "Seek",
               seekLabel: "{currentTime} of {duration}",
               played: "Played",
               buffered: "Buffered",
               currentTime: "Current time",
               duration: "Duration",
               volume: "Volume",
               mute: "Mute",
               unmute: "Unmute",
               enableCaptions: "Enable captions",
               disableCaptions: "Disable captions",
               download: "Download",
               enterFullscreen: "Enter fullscreen",
               exitFullscreen: "Exit fullscreen",
               frameTitle: "Player for {title}",
               captions: "Captions",
               settings: "Settings",
               pip: "PIP",
               menuBack: "Go back to previous menu",
               speed: "Speed",
               normal: "Normal",
               quality: "Quality",
               loop: "Loop",
               start: "Start",
               end: "End",
               all: "All",
               reset: "Reset",
               disabled: "Disabled",
               enabled: "Enabled",
               advertisement: "Ad",
               qualityBadge: {
                  2160: "4K",
                  1440: "HD",
                  1080: "HD",
                  720: "HD",
                  576: "SD",
                  480: "SD",
               },
            },
            urls: {
               download: null,
               vimeo: {
                  sdk: "https://player.vimeo.com/api/player.js",
                  iframe: "https://player.vimeo.com/video/{0}?{1}",
                  api: "https://vimeo.com/api/v2/video/{0}.json",
               },
               youtube: {
                  sdk: "https://www.youtube.com/iframe_api",
                  api:
                     "https://noembed.com/embed?url=https://www.youtube.com/watch?v={0}",
               },
               googleIMA: {
                  sdk: "https://imasdk.googleapis.com/js/sdkloader/ima3.js",
               },
            },
            listeners: {
               seek: null,
               play: null,
               pause: null,
               restart: null,
               rewind: null,
               fastForward: null,
               mute: null,
               volume: null,
               captions: null,
               download: null,
               fullscreen: null,
               pip: null,
               airplay: null,
               speed: null,
               quality: null,
               loop: null,
               language: null,
            },
            events: [
               "ended",
               "progress",
               "stalled",
               "playing",
               "waiting",
               "canplay",
               "canplaythrough",
               "loadstart",
               "loadeddata",
               "loadedmetadata",
               "timeupdate",
               "volumechange",
               "play",
               "pause",
               "error",
               "seeking",
               "seeked",
               "emptied",
               "ratechange",
               "cuechange",
               "download",
               "enterfullscreen",
               "exitfullscreen",
               "captionsenabled",
               "captionsdisabled",
               "languagechange",
               "controlshidden",
               "controlsshown",
               "ready",
               "statechange",
               "qualitychange",
               "adsloaded",
               "adscontentpause",
               "adscontentresume",
               "adstarted",
               "adsmidpoint",
               "adscomplete",
               "adsallcomplete",
               "adsimpression",
               "adsclick",
            ],
            selectors: {
               editable: "input, textarea, select, [contenteditable]",
               container: ".plyr",
               controls: { container: null, wrapper: ".plyr__controls" },
               labels: "[data-plyr]",
               buttons: {
                  play: '[data-plyr="play"]',
                  pause: '[data-plyr="pause"]',
                  restart: '[data-plyr="restart"]',
                  rewind: '[data-plyr="rewind"]',
                  fastForward: '[data-plyr="fast-forward"]',
                  mute: '[data-plyr="mute"]',
                  captions: '[data-plyr="captions"]',
                  download: '[data-plyr="download"]',
                  fullscreen: '[data-plyr="fullscreen"]',
                  pip: '[data-plyr="pip"]',
                  airplay: '[data-plyr="airplay"]',
                  settings: '[data-plyr="settings"]',
                  loop: '[data-plyr="loop"]',
               },
               inputs: {
                  seek: '[data-plyr="seek"]',
                  volume: '[data-plyr="volume"]',
                  speed: '[data-plyr="speed"]',
                  language: '[data-plyr="language"]',
                  quality: '[data-plyr="quality"]',
               },
               display: {
                  currentTime: ".plyr__time--current",
                  duration: ".plyr__time--duration",
                  buffer: ".plyr__progress__buffer",
                  loop: ".plyr__progress__loop",
                  volume: ".plyr__volume--display",
               },
               progress: ".plyr__progress",
               captions: ".plyr__captions",
               caption: ".plyr__caption",
            },
            classNames: {
               type: "plyr--{0}",
               provider: "plyr--{0}",
               video: "plyr__video-wrapper",
               embed: "plyr__video-embed",
               videoFixedRatio: "plyr__video-wrapper--fixed-ratio",
               embedContainer: "plyr__video-embed__container",
               poster: "plyr__poster",
               posterEnabled: "plyr__poster-enabled",
               ads: "plyr__ads",
               control: "plyr__control",
               controlPressed: "plyr__control--pressed",
               playing: "plyr--playing",
               paused: "plyr--paused",
               stopped: "plyr--stopped",
               loading: "plyr--loading",
               hover: "plyr--hover",
               tooltip: "plyr__tooltip",
               cues: "plyr__cues",
               hidden: "plyr__sr-only",
               hideControls: "plyr--hide-controls",
               isIos: "plyr--is-ios",
               isTouch: "plyr--is-touch",
               uiSupported: "plyr--full-ui",
               noTransition: "plyr--no-transition",
               display: { time: "plyr__time" },
               menu: {
                  value: "plyr__menu__value",
                  badge: "plyr__badge",
                  open: "plyr--menu-open",
               },
               captions: {
                  enabled: "plyr--captions-enabled",
                  active: "plyr--captions-active",
               },
               fullscreen: {
                  enabled: "plyr--fullscreen-enabled",
                  fallback: "plyr--fullscreen-fallback",
               },
               pip: {
                  supported: "plyr--pip-supported",
                  active: "plyr--pip-active",
               },
               airplay: {
                  supported: "plyr--airplay-supported",
                  active: "plyr--airplay-active",
               },
               tabFocus: "plyr__tab-focus",
               previewThumbnails: {
                  thumbContainer: "plyr__preview-thumb",
                  thumbContainerShown: "plyr__preview-thumb--is-shown",
                  imageContainer: "plyr__preview-thumb__image-container",
                  timeContainer: "plyr__preview-thumb__time-container",
                  scrubbingContainer: "plyr__preview-scrubbing",
                  scrubbingContainerShown: "plyr__preview-scrubbing--is-shown",
               },
            },
            attributes: {
               embed: {
                  provider: "data-plyr-provider",
                  id: "data-plyr-embed-id",
               },
            },
            ads: { enabled: !1, publisherId: "", tagUrl: "" },
            previewThumbnails: { enabled: !1, src: "" },
            vimeo: {
               byline: !1,
               portrait: !1,
               title: !1,
               speed: !0,
               transparent: !1,
               sidedock: !1,
               controls: !1,
               referrerPolicy: null,
            },
            youtube: {
               noCookie: !1,
               rel: 0,
               showinfo: 0,
               iv_load_policy: 3,
               modestbranding: 1,
            },
         },
         Ah = "picture-in-picture",
         xh = "inline",
         Ch = { html5: "html5", youtube: "youtube", vimeo: "vimeo" },
         Ph = "audio",
         Ih = "video";
      var Oh = function () {},
         Lh = (function () {
            function e() {
               var t =
                  arguments.length > 0 &&
                  void 0 !== arguments[0] &&
                  arguments[0];
               yo(this, e),
                  (this.enabled = window.console && t),
                  this.enabled && this.log("Debugging enabled");
            }
            return (
               wo(e, [
                  {
                     key: "log",
                     get: function () {
                        return this.enabled
                           ? Function.prototype.bind.call(console.log, console)
                           : Oh;
                     },
                  },
                  {
                     key: "warn",
                     get: function () {
                        return this.enabled
                           ? Function.prototype.bind.call(console.warn, console)
                           : Oh;
                     },
                  },
                  {
                     key: "error",
                     get: function () {
                        return this.enabled
                           ? Function.prototype.bind.call(
                                console.error,
                                console
                             )
                           : Oh;
                     },
                  },
               ]),
               e
            );
         })(),
         jh = (function () {
            function e(t) {
               var n = this;
               yo(this, e),
                  (this.player = t),
                  (this.prefix = e.prefix),
                  (this.property = e.property),
                  (this.scrollPosition = { x: 0, y: 0 }),
                  (this.forceFallback =
                     "force" === t.config.fullscreen.fallback),
                  ju.call(
                     this.player,
                     document,
                     "ms" === this.prefix
                        ? "MSFullscreenChange"
                        : "".concat(this.prefix, "fullscreenchange"),
                     function () {
                        n.onChange();
                     }
                  ),
                  ju.call(
                     this.player,
                     this.player.elements.container,
                     "dblclick",
                     function (e) {
                        (Qc(n.player.elements.controls) &&
                           n.player.elements.controls.contains(e.target)) ||
                           n.toggle();
                     }
                  ),
                  ju.call(
                     this,
                     this.player.elements.container,
                     "keydown",
                     function (e) {
                        return n.trapFocus(e);
                     }
                  ),
                  this.update();
            }
            return (
               wo(
                  e,
                  [
                     {
                        key: "onChange",
                        value: function () {
                           if (this.enabled) {
                              var e = this.player.elements.buttons.fullscreen;
                              Qc(e) && (e.pressed = this.active),
                                 Ru.call(
                                    this.player,
                                    this.target,
                                    this.active
                                       ? "enterfullscreen"
                                       : "exitfullscreen",
                                    !0
                                 );
                           }
                        },
                     },
                     {
                        key: "toggleFallback",
                        value: function () {
                           var e =
                              arguments.length > 0 &&
                              void 0 !== arguments[0] &&
                              arguments[0];
                           if (
                              (e
                                 ? (this.scrollPosition = {
                                      x: window.scrollX || 0,
                                      y: window.scrollY || 0,
                                   })
                                 : window.scrollTo(
                                      this.scrollPosition.x,
                                      this.scrollPosition.y
                                   ),
                              (document.body.style.overflow = e
                                 ? "hidden"
                                 : ""),
                              ku(
                                 this.target,
                                 this.player.config.classNames.fullscreen
                                    .fallback,
                                 e
                              ),
                              au.isIos)
                           ) {
                              var t = document.head.querySelector(
                                    'meta[name="viewport"]'
                                 ),
                                 n = "viewport-fit=cover";
                              t ||
                                 (t = document.createElement(
                                    "meta"
                                 )).setAttribute("name", "viewport");
                              var i = Kc(t.content) && t.content.includes(n);
                              e
                                 ? ((this.cleanupViewport = !i),
                                   i || (t.content += ",".concat(n)))
                                 : this.cleanupViewport &&
                                   (t.content = t.content
                                      .split(",")
                                      .filter(function (e) {
                                         return e.trim() !== n;
                                      })
                                      .join(","));
                           }
                           this.onChange();
                        },
                     },
                     {
                        key: "trapFocus",
                        value: function (e) {
                           if (
                              !au.isIos &&
                              this.active &&
                              "Tab" === e.key &&
                              9 === e.keyCode
                           ) {
                              var t = document.activeElement,
                                 n = Eu.call(
                                    this.player,
                                    "a[href], button:not(:disabled), input:not(:disabled), [tabindex]"
                                 ),
                                 i = Eo(n, 1)[0],
                                 r = n[n.length - 1];
                              t !== r || e.shiftKey
                                 ? t === i &&
                                   e.shiftKey &&
                                   (r.focus(), e.preventDefault())
                                 : (i.focus(), e.preventDefault());
                           }
                        },
                     },
                     {
                        key: "update",
                        value: function () {
                           var t;
                           this.enabled
                              ? ((t = this.forceFallback
                                   ? "Fallback (forced)"
                                   : e.native
                                   ? "Native"
                                   : "Fallback"),
                                this.player.debug.log(
                                   "".concat(t, " fullscreen enabled")
                                ))
                              : this.player.debug.log(
                                   "Fullscreen not supported and fallback disabled"
                                );
                           ku(
                              this.player.elements.container,
                              this.player.config.classNames.fullscreen.enabled,
                              this.enabled
                           );
                        },
                     },
                     {
                        key: "enter",
                        value: function () {
                           this.enabled &&
                              (au.isIos &&
                              this.player.config.fullscreen.iosNative
                                 ? this.target.webkitEnterFullscreen()
                                 : !e.native || this.forceFallback
                                 ? this.toggleFallback(!0)
                                 : this.prefix
                                 ? nu(this.prefix) ||
                                   this.target[
                                      ""
                                         .concat(this.prefix, "Request")
                                         .concat(this.property)
                                   ]()
                                 : this.target.requestFullscreen({
                                      navigationUI: "hide",
                                   }));
                        },
                     },
                     {
                        key: "exit",
                        value: function () {
                           if (this.enabled)
                              if (
                                 au.isIos &&
                                 this.player.config.fullscreen.iosNative
                              )
                                 this.target.webkitExitFullscreen(),
                                    this.player.play();
                              else if (!e.native || this.forceFallback)
                                 this.toggleFallback(!1);
                              else if (this.prefix) {
                                 if (!nu(this.prefix)) {
                                    var t =
                                       "moz" === this.prefix
                                          ? "Cancel"
                                          : "Exit";
                                    document[
                                       ""
                                          .concat(this.prefix)
                                          .concat(t)
                                          .concat(this.property)
                                    ]();
                                 }
                              } else
                                 (
                                    document.cancelFullScreen ||
                                    document.exitFullscreen
                                 ).call(document);
                        },
                     },
                     {
                        key: "toggle",
                        value: function () {
                           this.active ? this.exit() : this.enter();
                        },
                     },
                     {
                        key: "usingNative",
                        get: function () {
                           return e.native && !this.forceFallback;
                        },
                     },
                     {
                        key: "enabled",
                        get: function () {
                           return (
                              (e.native ||
                                 this.player.config.fullscreen.fallback) &&
                              this.player.config.fullscreen.enabled &&
                              this.player.supported.ui &&
                              this.player.isVideo
                           );
                        },
                     },
                     {
                        key: "active",
                        get: function () {
                           return (
                              !!this.enabled &&
                              (!e.native || this.forceFallback
                                 ? Tu(
                                      this.target,
                                      this.player.config.classNames.fullscreen
                                         .fallback
                                   )
                                 : (this.prefix
                                      ? document[
                                           ""
                                              .concat(this.prefix)
                                              .concat(this.property, "Element")
                                        ]
                                      : document.fullscreenElement) ===
                                   this.target)
                           );
                        },
                     },
                     {
                        key: "target",
                        get: function () {
                           return au.isIos &&
                              this.player.config.fullscreen.iosNative
                              ? this.player.media
                              : this.player.elements.container;
                        },
                     },
                  ],
                  [
                     {
                        key: "native",
                        get: function () {
                           return !!(
                              document.fullscreenEnabled ||
                              document.webkitFullscreenEnabled ||
                              document.mozFullScreenEnabled ||
                              document.msFullscreenEnabled
                           );
                        },
                     },
                     {
                        key: "prefix",
                        get: function () {
                           if (Yc(document.exitFullscreen)) return "";
                           var e = "";
                           return (
                              ["webkit", "moz", "ms"].some(function (t) {
                                 return (
                                    !(
                                       !Yc(
                                          document[
                                             "".concat(t, "ExitFullscreen")
                                          ]
                                       ) &&
                                       !Yc(
                                          document[
                                             "".concat(t, "CancelFullScreen")
                                          ]
                                       )
                                    ) && ((e = t), !0)
                                 );
                              }),
                              e
                           );
                        },
                     },
                     {
                        key: "property",
                        get: function () {
                           return "moz" === this.prefix
                              ? "FullScreen"
                              : "Fullscreen";
                        },
                     },
                  ]
               ),
               e
            );
         })(),
         Mh =
            Math.sign ||
            function (e) {
               return 0 == (e = +e) || e != e ? e : e < 0 ? -1 : 1;
            };
      function Nh(e) {
         var t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1;
         return new Promise(function (n, i) {
            var r = new Image(),
               a = function () {
                  delete r.onload,
                     delete r.onerror,
                     (r.naturalWidth >= t ? n : i)(r);
               };
            Object.assign(r, { onload: a, onerror: a, src: e });
         });
      }
      Oe({ target: "Math", stat: !0 }, { sign: Mh });
      var Rh = {
            addStyleHook: function () {
               ku(
                  this.elements.container,
                  this.config.selectors.container.replace(".", ""),
                  !0
               ),
                  ku(
                     this.elements.container,
                     this.config.classNames.uiSupported,
                     this.supported.ui
                  );
            },
            toggleNativeControls: function () {
               var e =
                  arguments.length > 0 &&
                  void 0 !== arguments[0] &&
                  arguments[0];
               e && this.isHTML5
                  ? this.media.setAttribute("controls", "")
                  : this.media.removeAttribute("controls");
            },
            build: function () {
               var e = this;
               if ((this.listeners.media(), !this.supported.ui))
                  return (
                     this.debug.warn(
                        "Basic support only for "
                           .concat(this.provider, " ")
                           .concat(this.type)
                     ),
                     void Rh.toggleNativeControls.call(this, !0)
                  );
               Qc(this.elements.controls) ||
                  (wh.inject.call(this), this.listeners.controls()),
                  Rh.toggleNativeControls.call(this),
                  this.isHTML5 && Sh.setup.call(this),
                  (this.volume = null),
                  (this.muted = null),
                  (this.loop = null),
                  (this.quality = null),
                  (this.speed = null),
                  wh.updateVolume.call(this),
                  wh.timeUpdate.call(this),
                  Rh.checkPlaying.call(this),
                  ku(
                     this.elements.container,
                     this.config.classNames.pip.supported,
                     Iu.pip && this.isHTML5 && this.isVideo
                  ),
                  ku(
                     this.elements.container,
                     this.config.classNames.airplay.supported,
                     Iu.airplay && this.isHTML5
                  ),
                  ku(
                     this.elements.container,
                     this.config.classNames.isIos,
                     au.isIos
                  ),
                  ku(
                     this.elements.container,
                     this.config.classNames.isTouch,
                     this.touch
                  ),
                  (this.ready = !0),
                  setTimeout(function () {
                     Ru.call(e, e.media, "ready");
                  }, 0),
                  Rh.setTitle.call(this),
                  this.poster &&
                     Rh.setPoster
                        .call(this, this.poster, !1)
                        .catch(function () {}),
                  this.config.duration && wh.durationUpdate.call(this);
            },
            setTitle: function () {
               var e = uh("play", this.config);
               if (
                  (Kc(this.config.title) &&
                     !nu(this.config.title) &&
                     (e += ", ".concat(this.config.title)),
                  Array.from(this.elements.buttons.play || []).forEach(
                     function (t) {
                        t.setAttribute("aria-label", e);
                     }
                  ),
                  this.isEmbed)
               ) {
                  var t = Au.call(this, "iframe");
                  if (!Qc(t)) return;
                  var n = nu(this.config.title) ? "video" : this.config.title,
                     i = uh("frameTitle", this.config);
                  t.setAttribute("title", i.replace("{title}", n));
               }
            },
            togglePoster: function (e) {
               ku(
                  this.elements.container,
                  this.config.classNames.posterEnabled,
                  e
               );
            },
            setPoster: function (e) {
               var t = this,
                  n =
                     !(arguments.length > 1 && void 0 !== arguments[1]) ||
                     arguments[1];
               return n && this.poster
                  ? Promise.reject(new Error("Poster already set"))
                  : (this.media.setAttribute("poster", e),
                    this.isHTML5
                       ? Promise.resolve(e)
                       : Uu.call(this)
                            .then(function () {
                               return Nh(e);
                            })
                            .catch(function (n) {
                               throw (
                                  (e === t.poster &&
                                     Rh.togglePoster.call(t, !1),
                                  n)
                               );
                            })
                            .then(function () {
                               if (e !== t.poster)
                                  throw new Error(
                                     "setPoster cancelled by later call to setPoster"
                                  );
                            })
                            .then(function () {
                               return (
                                  Object.assign(t.elements.poster.style, {
                                     backgroundImage: "url('".concat(e, "')"),
                                     backgroundSize: "",
                                  }),
                                  Rh.togglePoster.call(t, !0),
                                  e
                               );
                            }));
            },
            checkPlaying: function (e) {
               var t = this;
               ku(
                  this.elements.container,
                  this.config.classNames.playing,
                  this.playing
               ),
                  ku(
                     this.elements.container,
                     this.config.classNames.paused,
                     this.paused
                  ),
                  ku(
                     this.elements.container,
                     this.config.classNames.stopped,
                     this.stopped
                  ),
                  Array.from(this.elements.buttons.play || []).forEach(
                     function (e) {
                        Object.assign(e, { pressed: t.playing }),
                           e.setAttribute(
                              "aria-label",
                              uh(t.playing ? "pause" : "play", t.config)
                           );
                     }
                  ),
                  (Jc(e) && "timeupdate" === e.type) ||
                     Rh.toggleControls.call(this);
            },
            checkLoading: function (e) {
               var t = this;
               (this.loading = ["stalled", "waiting"].includes(e.type)),
                  clearTimeout(this.timers.loading),
                  (this.timers.loading = setTimeout(
                     function () {
                        ku(
                           t.elements.container,
                           t.config.classNames.loading,
                           t.loading
                        ),
                           Rh.toggleControls.call(t);
                     },
                     this.loading ? 250 : 0
                  ));
            },
            toggleControls: function (e) {
               var t = this.elements.controls;
               if (t && this.config.hideControls) {
                  var n = this.touch && this.lastSeekTime + 2e3 > Date.now();
                  this.toggleControls(
                     Boolean(
                        e ||
                           this.loading ||
                           this.paused ||
                           t.pressed ||
                           t.hover ||
                           n
                     )
                  );
               }
            },
         },
         _h = (function () {
            function e(t) {
               yo(this, e),
                  (this.player = t),
                  (this.lastKey = null),
                  (this.focusTimer = null),
                  (this.lastKeyDown = null),
                  (this.handleKey = this.handleKey.bind(this)),
                  (this.toggleMenu = this.toggleMenu.bind(this)),
                  (this.setTabFocus = this.setTabFocus.bind(this)),
                  (this.firstTouch = this.firstTouch.bind(this));
            }
            return (
               wo(e, [
                  {
                     key: "handleKey",
                     value: function (e) {
                        var t = this.player,
                           n = t.elements,
                           i = e.keyCode ? e.keyCode : e.which,
                           r = "keydown" === e.type,
                           a = r && i === this.lastKey;
                        if (
                           !(
                              e.altKey ||
                              e.ctrlKey ||
                              e.metaKey ||
                              e.shiftKey
                           ) &&
                           Wc(i)
                        ) {
                           if (r) {
                              var o = document.activeElement;
                              if (Qc(o)) {
                                 var s = t.config.selectors.editable;
                                 if (o !== n.inputs.seek && Su(o, s)) return;
                                 if (
                                    32 === e.which &&
                                    Su(o, 'button, [role^="menuitem"]')
                                 )
                                    return;
                              }
                              switch (
                                 ([
                                    32,
                                    37,
                                    38,
                                    39,
                                    40,
                                    48,
                                    49,
                                    50,
                                    51,
                                    52,
                                    53,
                                    54,
                                    56,
                                    57,
                                    67,
                                    70,
                                    73,
                                    75,
                                    76,
                                    77,
                                    79,
                                 ].includes(i) &&
                                    (e.preventDefault(), e.stopPropagation()),
                                 i)
                              ) {
                                 case 48:
                                 case 49:
                                 case 50:
                                 case 51:
                                 case 52:
                                 case 53:
                                 case 54:
                                 case 55:
                                 case 56:
                                 case 57:
                                    a ||
                                       (t.currentTime =
                                          (t.duration / 10) * (i - 48));
                                    break;
                                 case 32:
                                 case 75:
                                    a || t.togglePlay();
                                    break;
                                 case 38:
                                    t.increaseVolume(0.1);
                                    break;
                                 case 40:
                                    t.decreaseVolume(0.1);
                                    break;
                                 case 77:
                                    a || (t.muted = !t.muted);
                                    break;
                                 case 39:
                                    t.forward();
                                    break;
                                 case 37:
                                    t.rewind();
                                    break;
                                 case 70:
                                    t.fullscreen.toggle();
                                    break;
                                 case 67:
                                    a || t.toggleCaptions();
                                    break;
                                 case 76:
                                    t.loop = !t.loop;
                              }
                              27 === i &&
                                 !t.fullscreen.usingNative &&
                                 t.fullscreen.active &&
                                 t.fullscreen.toggle(),
                                 (this.lastKey = i);
                           } else this.lastKey = null;
                        }
                     },
                  },
                  {
                     key: "toggleMenu",
                     value: function (e) {
                        wh.toggleMenu.call(this.player, e);
                     },
                  },
                  {
                     key: "firstTouch",
                     value: function () {
                        var e = this.player,
                           t = e.elements;
                        (e.touch = !0),
                           ku(t.container, e.config.classNames.isTouch, !0);
                     },
                  },
                  {
                     key: "setTabFocus",
                     value: function (e) {
                        var t = this.player,
                           n = t.elements;
                        if (
                           (clearTimeout(this.focusTimer),
                           "keydown" !== e.type || 9 === e.which)
                        ) {
                           "keydown" === e.type &&
                              (this.lastKeyDown = e.timeStamp);
                           var i,
                              r = e.timeStamp - this.lastKeyDown <= 20;
                           if ("focus" !== e.type || r)
                              (i = t.config.classNames.tabFocus),
                                 ku(Eu.call(t, ".".concat(i)), i, !1),
                                 (this.focusTimer = setTimeout(function () {
                                    var e = document.activeElement;
                                    n.container.contains(e) &&
                                       ku(
                                          document.activeElement,
                                          t.config.classNames.tabFocus,
                                          !0
                                       );
                                 }, 10));
                        }
                     },
                  },
                  {
                     key: "global",
                     value: function () {
                        var e =
                              !(
                                 arguments.length > 0 && void 0 !== arguments[0]
                              ) || arguments[0],
                           t = this.player;
                        t.config.keyboard.global &&
                           Lu.call(
                              t,
                              window,
                              "keydown keyup",
                              this.handleKey,
                              e,
                              !1
                           ),
                           Lu.call(
                              t,
                              document.body,
                              "click",
                              this.toggleMenu,
                              e
                           ),
                           Nu.call(
                              t,
                              document.body,
                              "touchstart",
                              this.firstTouch
                           ),
                           Lu.call(
                              t,
                              document.body,
                              "keydown focus blur",
                              this.setTabFocus,
                              e,
                              !1,
                              !0
                           );
                     },
                  },
                  {
                     key: "container",
                     value: function () {
                        var e = this.player,
                           t = e.config,
                           n = e.elements,
                           i = e.timers;
                        !t.keyboard.global &&
                           t.keyboard.focused &&
                           ju.call(
                              e,
                              n.container,
                              "keydown keyup",
                              this.handleKey,
                              !1
                           ),
                           ju.call(
                              e,
                              n.container,
                              "mousemove mouseleave touchstart touchmove enterfullscreen exitfullscreen",
                              function (t) {
                                 var r = n.controls;
                                 r &&
                                    "enterfullscreen" === t.type &&
                                    ((r.pressed = !1), (r.hover = !1));
                                 var a = 0;
                                 [
                                    "touchstart",
                                    "touchmove",
                                    "mousemove",
                                 ].includes(t.type) &&
                                    (Rh.toggleControls.call(e, !0),
                                    (a = e.touch ? 3e3 : 2e3)),
                                    clearTimeout(i.controls),
                                    (i.controls = setTimeout(function () {
                                       return Rh.toggleControls.call(e, !1);
                                    }, a));
                              }
                           );
                        var r = function (t) {
                              if (!t) return Hu.call(e);
                              var i = n.container.getBoundingClientRect(),
                                 r = i.width,
                                 a = i.height;
                              return Hu.call(e, "".concat(r, ":").concat(a));
                           },
                           a = function () {
                              clearTimeout(i.resized),
                                 (i.resized = setTimeout(r, 50));
                           };
                        ju.call(
                           e,
                           n.container,
                           "enterfullscreen exitfullscreen",
                           function (t) {
                              var i = e.fullscreen,
                                 o = i.target,
                                 s = i.usingNative;
                              if (
                                 o === n.container &&
                                 (e.isEmbed || !nu(e.config.ratio))
                              ) {
                                 var l = "enterfullscreen" === t.type,
                                    c = r(l);
                                 c.padding;
                                 !(function (t, n, i) {
                                    if (e.isVimeo) {
                                       var r = e.elements.wrapper.firstChild,
                                          a = Eo(t, 2)[1],
                                          o = Eo(qu.call(e), 2),
                                          s = o[0],
                                          l = o[1];
                                       (r.style.maxWidth = i
                                          ? "".concat((a / l) * s, "px")
                                          : null),
                                          (r.style.margin = i
                                             ? "0 auto"
                                             : null);
                                    }
                                 })(c.ratio, 0, l),
                                    s ||
                                       (l
                                          ? ju.call(e, window, "resize", a)
                                          : Mu.call(e, window, "resize", a));
                              }
                           }
                        );
                     },
                  },
                  {
                     key: "media",
                     value: function () {
                        var e = this,
                           t = this.player,
                           n = t.elements;
                        if (
                           (ju.call(
                              t,
                              t.media,
                              "timeupdate seeking seeked",
                              function (e) {
                                 return wh.timeUpdate.call(t, e);
                              }
                           ),
                           ju.call(
                              t,
                              t.media,
                              "durationchange loadeddata loadedmetadata",
                              function (e) {
                                 return wh.durationUpdate.call(t, e);
                              }
                           ),
                           ju.call(t, t.media, "ended", function () {
                              t.isHTML5 &&
                                 t.isVideo &&
                                 t.config.resetOnEnd &&
                                 (t.restart(), t.pause());
                           }),
                           ju.call(
                              t,
                              t.media,
                              "progress playing seeking seeked",
                              function (e) {
                                 return wh.updateProgress.call(t, e);
                              }
                           ),
                           ju.call(t, t.media, "volumechange", function (e) {
                              return wh.updateVolume.call(t, e);
                           }),
                           ju.call(
                              t,
                              t.media,
                              "playing play pause ended emptied timeupdate",
                              function (e) {
                                 return Rh.checkPlaying.call(t, e);
                              }
                           ),
                           ju.call(
                              t,
                              t.media,
                              "waiting canplay seeked playing",
                              function (e) {
                                 return Rh.checkLoading.call(t, e);
                              }
                           ),
                           t.supported.ui && t.config.clickToPlay && !t.isAudio)
                        ) {
                           var i = Au.call(
                              t,
                              ".".concat(t.config.classNames.video)
                           );
                           if (!Qc(i)) return;
                           ju.call(t, n.container, "click", function (r) {
                              ([n.container, i].includes(r.target) ||
                                 i.contains(r.target)) &&
                                 ((t.touch && t.config.hideControls) ||
                                    (t.ended
                                       ? (e.proxy(r, t.restart, "restart"),
                                         e.proxy(r, t.play, "play"))
                                       : e.proxy(r, t.togglePlay, "play")));
                           });
                        }
                        t.supported.ui &&
                           t.config.disableContextMenu &&
                           ju.call(
                              t,
                              n.wrapper,
                              "contextmenu",
                              function (e) {
                                 e.preventDefault();
                              },
                              !1
                           ),
                           ju.call(t, t.media, "volumechange", function () {
                              t.storage.set({
                                 volume: t.volume,
                                 muted: t.muted,
                              });
                           }),
                           ju.call(t, t.media, "ratechange", function () {
                              wh.updateSetting.call(t, "speed"),
                                 t.storage.set({ speed: t.speed });
                           }),
                           ju.call(t, t.media, "qualitychange", function (e) {
                              wh.updateSetting.call(
                                 t,
                                 "quality",
                                 null,
                                 e.detail.quality
                              );
                           }),
                           ju.call(
                              t,
                              t.media,
                              "ready qualitychange",
                              function () {
                                 wh.setDownloadUrl.call(t);
                              }
                           );
                        var r = t.config.events
                           .concat(["keyup", "keydown"])
                           .join(" ");
                        ju.call(t, t.media, r, function (e) {
                           var i = e.detail,
                              r = void 0 === i ? {} : i;
                           "error" === e.type && (r = t.media.error),
                              Ru.call(t, n.container, e.type, !0, r);
                        });
                     },
                  },
                  {
                     key: "proxy",
                     value: function (e, t, n) {
                        var i = this.player,
                           r = i.config.listeners[n],
                           a = !0;
                        Yc(r) && (a = r.call(i, e)),
                           !1 !== a && Yc(t) && t.call(i, e);
                     },
                  },
                  {
                     key: "bind",
                     value: function (e, t, n, i) {
                        var r = this,
                           a =
                              !(
                                 arguments.length > 4 && void 0 !== arguments[4]
                              ) || arguments[4],
                           o = this.player,
                           s = o.config.listeners[i],
                           l = Yc(s);
                        ju.call(
                           o,
                           e,
                           t,
                           function (e) {
                              return r.proxy(e, n, i);
                           },
                           a && !l
                        );
                     },
                  },
                  {
                     key: "controls",
                     value: function () {
                        var e = this,
                           t = this.player,
                           n = t.elements,
                           i = au.isIE ? "change" : "input";
                        if (
                           (n.buttons.play &&
                              Array.from(n.buttons.play).forEach(function (n) {
                                 e.bind(n, "click", t.togglePlay, "play");
                              }),
                           this.bind(
                              n.buttons.restart,
                              "click",
                              t.restart,
                              "restart"
                           ),
                           this.bind(
                              n.buttons.rewind,
                              "click",
                              t.rewind,
                              "rewind"
                           ),
                           this.bind(
                              n.buttons.fastForward,
                              "click",
                              t.forward,
                              "fastForward"
                           ),
                           this.bind(
                              n.buttons.mute,
                              "click",
                              function () {
                                 t.muted = !t.muted;
                              },
                              "mute"
                           ),
                           this.bind(n.buttons.captions, "click", function () {
                              return t.toggleCaptions();
                           }),
                           this.bind(
                              n.buttons.download,
                              "click",
                              function () {
                                 Ru.call(t, t.media, "download");
                              },
                              "download"
                           ),
                           this.bind(
                              n.buttons.fullscreen,
                              "click",
                              function () {
                                 t.fullscreen.toggle();
                              },
                              "fullscreen"
                           ),
                           this.bind(
                              n.buttons.pip,
                              "click",
                              function () {
                                 t.pip = "toggle";
                              },
                              "pip"
                           ),
                           this.bind(
                              n.buttons.airplay,
                              "click",
                              t.airplay,
                              "airplay"
                           ),
                           this.bind(
                              n.buttons.settings,
                              "click",
                              function (e) {
                                 e.stopPropagation(),
                                    e.preventDefault(),
                                    wh.toggleMenu.call(t, e);
                              },
                              null,
                              !1
                           ),
                           this.bind(
                              n.buttons.settings,
                              "keyup",
                              function (e) {
                                 var n = e.which;
                                 [13, 32].includes(n) &&
                                    (13 !== n
                                       ? (e.preventDefault(),
                                         e.stopPropagation(),
                                         wh.toggleMenu.call(t, e))
                                       : wh.focusFirstMenuItem.call(
                                            t,
                                            null,
                                            !0
                                         ));
                              },
                              null,
                              !1
                           ),
                           this.bind(n.settings.menu, "keydown", function (e) {
                              27 === e.which && wh.toggleMenu.call(t, e);
                           }),
                           this.bind(
                              n.inputs.seek,
                              "mousedown mousemove",
                              function (e) {
                                 var t = n.progress.getBoundingClientRect(),
                                    i = (100 / t.width) * (e.pageX - t.left);
                                 e.currentTarget.setAttribute("seek-value", i);
                              }
                           ),
                           this.bind(
                              n.inputs.seek,
                              "mousedown mouseup keydown keyup touchstart touchend",
                              function (e) {
                                 var n = e.currentTarget,
                                    i = e.keyCode ? e.keyCode : e.which;
                                 if (!Zc(e) || 39 === i || 37 === i) {
                                    t.lastSeekTime = Date.now();
                                    var r = n.hasAttribute("play-on-seeked"),
                                       a = [
                                          "mouseup",
                                          "touchend",
                                          "keyup",
                                       ].includes(e.type);
                                    r && a
                                       ? (n.removeAttribute("play-on-seeked"),
                                         t.play())
                                       : !a &&
                                         t.playing &&
                                         (n.setAttribute("play-on-seeked", ""),
                                         t.pause());
                                 }
                              }
                           ),
                           au.isIos)
                        ) {
                           var r = Eu.call(t, 'input[type="range"]');
                           Array.from(r).forEach(function (t) {
                              return e.bind(t, i, function (e) {
                                 return ru(e.target);
                              });
                           });
                        }
                        this.bind(
                           n.inputs.seek,
                           i,
                           function (e) {
                              var n = e.currentTarget,
                                 i = n.getAttribute("seek-value");
                              nu(i) && (i = n.value),
                                 n.removeAttribute("seek-value"),
                                 (t.currentTime = (i / n.max) * t.duration);
                           },
                           "seek"
                        ),
                           this.bind(
                              n.progress,
                              "mouseenter mouseleave mousemove",
                              function (e) {
                                 return wh.updateSeekTooltip.call(t, e);
                              }
                           ),
                           this.bind(
                              n.progress,
                              "mousemove touchmove",
                              function (e) {
                                 var n = t.previewThumbnails;
                                 n && n.loaded && n.startMove(e);
                              }
                           ),
                           this.bind(
                              n.progress,
                              "mouseleave touchend click",
                              function () {
                                 var e = t.previewThumbnails;
                                 e && e.loaded && e.endMove(!1, !0);
                              }
                           ),
                           this.bind(
                              n.progress,
                              "mousedown touchstart",
                              function (e) {
                                 var n = t.previewThumbnails;
                                 n && n.loaded && n.startScrubbing(e);
                              }
                           ),
                           this.bind(
                              n.progress,
                              "mouseup touchend",
                              function (e) {
                                 var n = t.previewThumbnails;
                                 n && n.loaded && n.endScrubbing(e);
                              }
                           ),
                           au.isWebkit &&
                              Array.from(
                                 Eu.call(t, 'input[type="range"]')
                              ).forEach(function (n) {
                                 e.bind(n, "input", function (e) {
                                    return wh.updateRangeFill.call(t, e.target);
                                 });
                              }),
                           t.config.toggleInvert &&
                              !Qc(n.display.duration) &&
                              this.bind(
                                 n.display.currentTime,
                                 "click",
                                 function () {
                                    0 !== t.currentTime &&
                                       ((t.config.invertTime = !t.config
                                          .invertTime),
                                       wh.timeUpdate.call(t));
                                 }
                              ),
                           this.bind(
                              n.inputs.volume,
                              i,
                              function (e) {
                                 t.volume = e.target.value;
                              },
                              "volume"
                           ),
                           this.bind(
                              n.controls,
                              "mouseenter mouseleave",
                              function (e) {
                                 n.controls.hover =
                                    !t.touch && "mouseenter" === e.type;
                              }
                           ),
                           this.bind(
                              n.controls,
                              "mousedown mouseup touchstart touchend touchcancel",
                              function (e) {
                                 n.controls.pressed = [
                                    "mousedown",
                                    "touchstart",
                                 ].includes(e.type);
                              }
                           ),
                           this.bind(n.controls, "focusin", function () {
                              var i = t.config,
                                 r = t.timers;
                              ku(n.controls, i.classNames.noTransition, !0),
                                 Rh.toggleControls.call(t, !0),
                                 setTimeout(function () {
                                    ku(
                                       n.controls,
                                       i.classNames.noTransition,
                                       !1
                                    );
                                 }, 0);
                              var a = e.touch ? 3e3 : 4e3;
                              clearTimeout(r.controls),
                                 (r.controls = setTimeout(function () {
                                    return Rh.toggleControls.call(t, !1);
                                 }, a));
                           }),
                           this.bind(
                              n.inputs.volume,
                              "wheel",
                              function (e) {
                                 var n = e.webkitDirectionInvertedFromDevice,
                                    i = Eo(
                                       [e.deltaX, -e.deltaY].map(function (e) {
                                          return n ? -e : e;
                                       }),
                                       2
                                    ),
                                    r = i[0],
                                    a = i[1],
                                    o = Math.sign(
                                       Math.abs(r) > Math.abs(a) ? r : a
                                    );
                                 t.increaseVolume(o / 50);
                                 var s = t.media.volume;
                                 ((1 === o && s < 1) || (-1 === o && s > 0)) &&
                                    e.preventDefault();
                              },
                              "volume",
                              !1
                           );
                     },
                  },
               ]),
               e
            );
         })(),
         Uh = Kn("splice"),
         Fh = Qt("splice", { ACCESSORS: !0, 0: 0, 1: 2 }),
         Dh = Math.max,
         qh = Math.min;
      Oe(
         { target: "Array", proto: !0, forced: !Uh || !Fh },
         {
            splice: function (e, t) {
               var n,
                  i,
                  r,
                  a,
                  o,
                  s,
                  l = Ne(this),
                  c = le(l.length),
                  u = he(e, c),
                  h = arguments.length;
               if (
                  (0 === h
                     ? (n = i = 0)
                     : 1 === h
                     ? ((n = 0), (i = c - u))
                     : ((n = h - 2), (i = qh(Dh(oe(t), 0), c - u))),
                  c + n - i > 9007199254740991)
               )
                  throw TypeError("Maximum allowed length exceeded");
               for (r = ot(l, i), a = 0; a < i; a++)
                  (o = u + a) in l && Dn(r, a, l[o]);
               if (((r.length = i), n < i)) {
                  for (a = u; a < c - i; a++)
                     (s = a + n),
                        (o = a + i) in l ? (l[s] = l[o]) : delete l[s];
                  for (a = c; a > c - i + n; a--) delete l[a - 1];
               } else if (n > i)
                  for (a = c - i; a > u; a--)
                     (s = a + n - 1),
                        (o = a + i - 1) in l ? (l[s] = l[o]) : delete l[s];
               for (a = 0; a < n; a++) l[a + u] = arguments[a + 2];
               return (l.length = c - i + n), r;
            },
         }
      );
      var Hh = t(function (e, t) {
         e.exports = (function () {
            var e = function () {},
               t = {},
               n = {},
               i = {};
            function r(e, t) {
               if (e) {
                  var r = i[e];
                  if (((n[e] = t), r))
                     for (; r.length; ) r[0](e, t), r.splice(0, 1);
               }
            }
            function a(t, n) {
               t.call && (t = { success: t }),
                  n.length ? (t.error || e)(n) : (t.success || e)(t);
            }
            function o(t, n, i, r) {
               var a,
                  s,
                  l = document,
                  c = i.async,
                  u = (i.numRetries || 0) + 1,
                  h = i.before || e,
                  f = t.replace(/[\?|#].*$/, ""),
                  d = t.replace(/^(css|img)!/, "");
               (r = r || 0),
                  /(^css!|\.css$)/.test(f)
                     ? (((s = l.createElement("link")).rel = "stylesheet"),
                       (s.href = d),
                       (a = "hideFocus" in s) &&
                          s.relList &&
                          ((a = 0), (s.rel = "preload"), (s.as = "style")))
                     : /(^img!|\.(png|gif|jpg|svg|webp)$)/.test(f)
                     ? ((s = l.createElement("img")).src = d)
                     : (((s = l.createElement("script")).src = t),
                       (s.async = void 0 === c || c)),
                  (s.onload = s.onerror = s.onbeforeload = function (e) {
                     var l = e.type[0];
                     if (a)
                        try {
                           s.sheet.cssText.length || (l = "e");
                        } catch (e) {
                           18 != e.code && (l = "e");
                        }
                     if ("e" == l) {
                        if ((r += 1) < u) return o(t, n, i, r);
                     } else if ("preload" == s.rel && "style" == s.as)
                        return (s.rel = "stylesheet");
                     n(t, l, e.defaultPrevented);
                  }),
                  !1 !== h(t, s) && l.head.appendChild(s);
            }
            function s(e, n, i) {
               var s, l;
               if ((n && n.trim && (s = n), (l = (s ? i : n) || {}), s)) {
                  if (s in t) throw "LoadJS";
                  t[s] = !0;
               }
               function c(t, n) {
                  !(function (e, t, n) {
                     var i,
                        r,
                        a = (e = e.push ? e : [e]).length,
                        s = a,
                        l = [];
                     for (
                        i = function (e, n, i) {
                           if (("e" == n && l.push(e), "b" == n)) {
                              if (!i) return;
                              l.push(e);
                           }
                           --a || t(l);
                        },
                           r = 0;
                        r < s;
                        r++
                     )
                        o(e[r], i, n);
                  })(
                     e,
                     function (e) {
                        a(l, e), t && a({ success: t, error: n }, e), r(s, e);
                     },
                     l
                  );
               }
               if (l.returnPromise) return new Promise(c);
               c();
            }
            return (
               (s.ready = function (e, t) {
                  return (
                     (function (e, t) {
                        e = e.push ? e : [e];
                        var r,
                           a,
                           o,
                           s = [],
                           l = e.length,
                           c = l;
                        for (
                           r = function (e, n) {
                              n.length && s.push(e), --c || t(s);
                           };
                           l--;

                        )
                           (a = e[l]),
                              (o = n[a])
                                 ? r(a, o)
                                 : (i[a] = i[a] || []).push(r);
                     })(e, function (e) {
                        a(t, e);
                     }),
                     s
                  );
               }),
               (s.done = function (e) {
                  r(e, []);
               }),
               (s.reset = function () {
                  (t = {}), (n = {}), (i = {});
               }),
               (s.isDefined = function (e) {
                  return e in t;
               }),
               s
            );
         })();
      });
      function Bh(e) {
         return new Promise(function (t, n) {
            Hh(e, { success: t, error: n });
         });
      }
      function Vh(e) {
         e && !this.embed.hasPlayed && (this.embed.hasPlayed = !0),
            this.media.paused === e &&
               ((this.media.paused = !e),
               Ru.call(this, this.media, e ? "play" : "pause"));
      }
      var zh = {
         setup: function () {
            var e = this;
            ku(e.elements.wrapper, e.config.classNames.embed, !0),
               (e.options.speed = e.config.speed.options),
               Hu.call(e),
               zc(window.Vimeo)
                  ? zh.ready.call(e)
                  : Bh(e.config.urls.vimeo.sdk)
                       .then(function () {
                          zh.ready.call(e);
                       })
                       .catch(function (t) {
                          e.debug.warn(
                             "Vimeo SDK (player.js) failed to load",
                             t
                          );
                       });
         },
         ready: function () {
            var e = this,
               t = this,
               n = t.config.vimeo,
               i = Th(
                  hu(
                     {},
                     {
                        loop: t.config.loop.active,
                        autoplay: t.autoplay,
                        muted: t.muted,
                        gesture: "media",
                        playsinline: !this.config.fullscreen.iosNative,
                     },
                     n
                  )
               ),
               r = t.media.getAttribute("src");
            nu(r) && (r = t.media.getAttribute(t.config.attributes.embed.id));
            var a,
               o = nu((a = r))
                  ? null
                  : Wc(Number(a))
                  ? a
                  : a.match(/^.*(vimeo.com\/|video\/)(\d+).*/)
                  ? RegExp.$2
                  : a,
               s = pu("iframe"),
               l = rh(t.config.urls.vimeo.iframe, o, i);
            s.setAttribute("src", l),
               s.setAttribute("allowfullscreen", ""),
               s.setAttribute("allowtransparency", ""),
               s.setAttribute("allow", "autoplay"),
               nu(n.referrerPolicy) ||
                  s.setAttribute("referrerPolicy", n.referrerPolicy);
            var c = pu("div", {
               poster: t.poster,
               class: t.config.classNames.embedContainer,
            });
            c.appendChild(s),
               (t.media = yu(c, t.media)),
               fh(rh(t.config.urls.vimeo.api, o), "json").then(function (e) {
                  if (!nu(e)) {
                     var n = new URL(e[0].thumbnail_large);
                     (n.pathname = "".concat(n.pathname.split("_")[0], ".jpg")),
                        Rh.setPoster.call(t, n.href).catch(function () {});
                  }
               }),
               (t.embed = new window.Vimeo.Player(s, {
                  autopause: t.config.autopause,
                  muted: t.muted,
               })),
               (t.media.paused = !0),
               (t.media.currentTime = 0),
               t.supported.ui && t.embed.disableTextTrack(),
               (t.media.play = function () {
                  return Vh.call(t, !0), t.embed.play();
               }),
               (t.media.pause = function () {
                  return Vh.call(t, !1), t.embed.pause();
               }),
               (t.media.stop = function () {
                  t.pause(), (t.currentTime = 0);
               });
            var u = t.media.currentTime;
            Object.defineProperty(t.media, "currentTime", {
               get: function () {
                  return u;
               },
               set: function (e) {
                  var n = t.embed,
                     i = t.media,
                     r = t.paused,
                     a = t.volume,
                     o = r && !n.hasPlayed;
                  (i.seeking = !0),
                     Ru.call(t, i, "seeking"),
                     Promise.resolve(o && n.setVolume(0))
                        .then(function () {
                           return n.setCurrentTime(e);
                        })
                        .then(function () {
                           return o && n.pause();
                        })
                        .then(function () {
                           return o && n.setVolume(a);
                        })
                        .catch(function () {});
               },
            });
            var h = t.config.speed.selected;
            Object.defineProperty(t.media, "playbackRate", {
               get: function () {
                  return h;
               },
               set: function (e) {
                  t.embed.setPlaybackRate(e).then(function () {
                     (h = e), Ru.call(t, t.media, "ratechange");
                  });
               },
            });
            var f = t.config.volume;
            Object.defineProperty(t.media, "volume", {
               get: function () {
                  return f;
               },
               set: function (e) {
                  t.embed.setVolume(e).then(function () {
                     (f = e), Ru.call(t, t.media, "volumechange");
                  });
               },
            });
            var d = t.config.muted;
            Object.defineProperty(t.media, "muted", {
               get: function () {
                  return d;
               },
               set: function (e) {
                  var n = !!$c(e) && e;
                  t.embed.setVolume(n ? 0 : t.config.volume).then(function () {
                     (d = n), Ru.call(t, t.media, "volumechange");
                  });
               },
            });
            var p,
               m = t.config.loop;
            Object.defineProperty(t.media, "loop", {
               get: function () {
                  return m;
               },
               set: function (e) {
                  var n = $c(e) ? e : t.config.loop.active;
                  t.embed.setLoop(n).then(function () {
                     m = n;
                  });
               },
            }),
               t.embed
                  .getVideoUrl()
                  .then(function (e) {
                     (p = e), wh.setDownloadUrl.call(t);
                  })
                  .catch(function (t) {
                     e.debug.warn(t);
                  }),
               Object.defineProperty(t.media, "currentSrc", {
                  get: function () {
                     return p;
                  },
               }),
               Object.defineProperty(t.media, "ended", {
                  get: function () {
                     return t.currentTime === t.duration;
                  },
               }),
               Promise.all([
                  t.embed.getVideoWidth(),
                  t.embed.getVideoHeight(),
               ]).then(function (n) {
                  var i = Eo(n, 2),
                     r = i[0],
                     a = i[1];
                  (t.embed.ratio = [r, a]), Hu.call(e);
               }),
               t.embed.setAutopause(t.config.autopause).then(function (e) {
                  t.config.autopause = e;
               }),
               t.embed.getVideoTitle().then(function (n) {
                  (t.config.title = n), Rh.setTitle.call(e);
               }),
               t.embed.getCurrentTime().then(function (e) {
                  (u = e), Ru.call(t, t.media, "timeupdate");
               }),
               t.embed.getDuration().then(function (e) {
                  (t.media.duration = e), Ru.call(t, t.media, "durationchange");
               }),
               t.embed.getTextTracks().then(function (e) {
                  (t.media.textTracks = e), Sh.setup.call(t);
               }),
               t.embed.on("cuechange", function (e) {
                  var n = e.cues,
                     i = (void 0 === n ? [] : n).map(function (e) {
                        return (function (e) {
                           var t = document.createDocumentFragment(),
                              n = document.createElement("div");
                           return (
                              t.appendChild(n),
                              (n.innerHTML = e),
                              t.firstChild.innerText
                           );
                        })(e.text);
                     });
                  Sh.updateCues.call(t, i);
               }),
               t.embed.on("loaded", function () {
                  (t.embed.getPaused().then(function (e) {
                     Vh.call(t, !e), e || Ru.call(t, t.media, "playing");
                  }),
                  Qc(t.embed.element) && t.supported.ui) &&
                     t.embed.element.setAttribute("tabindex", -1);
               }),
               t.embed.on("bufferstart", function () {
                  Ru.call(t, t.media, "waiting");
               }),
               t.embed.on("bufferend", function () {
                  Ru.call(t, t.media, "playing");
               }),
               t.embed.on("play", function () {
                  Vh.call(t, !0), Ru.call(t, t.media, "playing");
               }),
               t.embed.on("pause", function () {
                  Vh.call(t, !1);
               }),
               t.embed.on("timeupdate", function (e) {
                  (t.media.seeking = !1),
                     (u = e.seconds),
                     Ru.call(t, t.media, "timeupdate");
               }),
               t.embed.on("progress", function (e) {
                  (t.media.buffered = e.percent),
                     Ru.call(t, t.media, "progress"),
                     1 === parseInt(e.percent, 10) &&
                        Ru.call(t, t.media, "canplaythrough"),
                     t.embed.getDuration().then(function (e) {
                        e !== t.media.duration &&
                           ((t.media.duration = e),
                           Ru.call(t, t.media, "durationchange"));
                     });
               }),
               t.embed.on("seeked", function () {
                  (t.media.seeking = !1), Ru.call(t, t.media, "seeked");
               }),
               t.embed.on("ended", function () {
                  (t.media.paused = !0), Ru.call(t, t.media, "ended");
               }),
               t.embed.on("error", function (e) {
                  (t.media.error = e), Ru.call(t, t.media, "error");
               }),
               setTimeout(function () {
                  return Rh.build.call(t);
               }, 0);
         },
      };
      function Wh(e) {
         e && !this.embed.hasPlayed && (this.embed.hasPlayed = !0),
            this.media.paused === e &&
               ((this.media.paused = !e),
               Ru.call(this, this.media, e ? "play" : "pause"));
      }
      function Kh(e) {
         return e.noCookie
            ? "https://www.youtube-nocookie.com"
            : "http:" === window.location.protocol
            ? "http://www.youtube.com"
            : void 0;
      }
      var $h = {
            setup: function () {
               var e = this;
               if (
                  (ku(this.elements.wrapper, this.config.classNames.embed, !0),
                  zc(window.YT) && Yc(window.YT.Player))
               )
                  $h.ready.call(this);
               else {
                  var t = window.onYouTubeIframeAPIReady;
                  (window.onYouTubeIframeAPIReady = function () {
                     Yc(t) && t(), $h.ready.call(e);
                  }),
                     Bh(this.config.urls.youtube.sdk).catch(function (t) {
                        e.debug.warn("YouTube API failed to load", t);
                     });
               }
            },
            getTitle: function (e) {
               var t = this;
               fh(rh(this.config.urls.youtube.api, e))
                  .then(function (e) {
                     if (zc(e)) {
                        var n = e.title,
                           i = e.height,
                           r = e.width;
                        (t.config.title = n),
                           Rh.setTitle.call(t),
                           (t.embed.ratio = [r, i]);
                     }
                     Hu.call(t);
                  })
                  .catch(function () {
                     Hu.call(t);
                  });
            },
            ready: function () {
               var e = this,
                  t = e.media && e.media.getAttribute("id");
               if (nu(t) || !t.startsWith("youtube-")) {
                  var n = e.media.getAttribute("src");
                  nu(n) &&
                     (n = e.media.getAttribute(
                        this.config.attributes.embed.id
                     ));
                  var i,
                     r,
                     a = nu((i = n))
                        ? null
                        : i.match(
                             /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
                          )
                        ? RegExp.$2
                        : i,
                     o =
                        ((r = e.provider),
                        ""
                           .concat(r, "-")
                           .concat(Math.floor(1e4 * Math.random()))),
                     s = pu("div", { id: o, poster: e.poster });
                  e.media = yu(s, e.media);
                  var l = function (e) {
                     return "https://i.ytimg.com/vi/"
                        .concat(a, "/")
                        .concat(e, "default.jpg");
                  };
                  Nh(l("maxres"), 121)
                     .catch(function () {
                        return Nh(l("sd"), 121);
                     })
                     .catch(function () {
                        return Nh(l("hq"));
                     })
                     .then(function (t) {
                        return Rh.setPoster.call(e, t.src);
                     })
                     .then(function (t) {
                        t.includes("maxres") ||
                           (e.elements.poster.style.backgroundSize = "cover");
                     })
                     .catch(function () {});
                  var c = e.config.youtube;
                  e.embed = new window.YT.Player(o, {
                     videoId: a,
                     host: Kh(c),
                     playerVars: hu(
                        {},
                        {
                           autoplay: e.config.autoplay ? 1 : 0,
                           hl: e.config.hl,
                           controls: e.supported.ui ? 0 : 1,
                           disablekb: 1,
                           playsinline: e.config.fullscreen.iosNative ? 0 : 1,
                           cc_load_policy: e.captions.active ? 1 : 0,
                           cc_lang_pref: e.config.captions.language,
                           widget_referrer: window
                              ? window.location.href
                              : null,
                        },
                        c
                     ),
                     events: {
                        onError: function (t) {
                           if (!e.media.error) {
                              var n = t.data,
                                 i =
                                    {
                                       2: "The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.",
                                       5: "The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.",
                                       100: "The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.",
                                       101: "The owner of the requested video does not allow it to be played in embedded players.",
                                       150: "The owner of the requested video does not allow it to be played in embedded players.",
                                    }[n] || "An unknown error occured";
                              (e.media.error = { code: n, message: i }),
                                 Ru.call(e, e.media, "error");
                           }
                        },
                        onPlaybackRateChange: function (t) {
                           var n = t.target;
                           (e.media.playbackRate = n.getPlaybackRate()),
                              Ru.call(e, e.media, "ratechange");
                        },
                        onReady: function (t) {
                           if (!Yc(e.media.play)) {
                              var n = t.target;
                              $h.getTitle.call(e, a),
                                 (e.media.play = function () {
                                    Wh.call(e, !0), n.playVideo();
                                 }),
                                 (e.media.pause = function () {
                                    Wh.call(e, !1), n.pauseVideo();
                                 }),
                                 (e.media.stop = function () {
                                    n.stopVideo();
                                 }),
                                 (e.media.duration = n.getDuration()),
                                 (e.media.paused = !0),
                                 (e.media.currentTime = 0),
                                 Object.defineProperty(e.media, "currentTime", {
                                    get: function () {
                                       return Number(n.getCurrentTime());
                                    },
                                    set: function (t) {
                                       e.paused &&
                                          !e.embed.hasPlayed &&
                                          e.embed.mute(),
                                          (e.media.seeking = !0),
                                          Ru.call(e, e.media, "seeking"),
                                          n.seekTo(t);
                                    },
                                 }),
                                 Object.defineProperty(
                                    e.media,
                                    "playbackRate",
                                    {
                                       get: function () {
                                          return n.getPlaybackRate();
                                       },
                                       set: function (e) {
                                          n.setPlaybackRate(e);
                                       },
                                    }
                                 );
                              var i = e.config.volume;
                              Object.defineProperty(e.media, "volume", {
                                 get: function () {
                                    return i;
                                 },
                                 set: function (t) {
                                    (i = t),
                                       n.setVolume(100 * i),
                                       Ru.call(e, e.media, "volumechange");
                                 },
                              });
                              var r = e.config.muted;
                              Object.defineProperty(e.media, "muted", {
                                 get: function () {
                                    return r;
                                 },
                                 set: function (t) {
                                    var i = $c(t) ? t : r;
                                    (r = i),
                                       n[i ? "mute" : "unMute"](),
                                       Ru.call(e, e.media, "volumechange");
                                 },
                              }),
                                 Object.defineProperty(e.media, "currentSrc", {
                                    get: function () {
                                       return n.getVideoUrl();
                                    },
                                 }),
                                 Object.defineProperty(e.media, "ended", {
                                    get: function () {
                                       return e.currentTime === e.duration;
                                    },
                                 });
                              var o = n.getAvailablePlaybackRates();
                              (e.options.speed = o.filter(function (t) {
                                 return e.config.speed.options.includes(t);
                              })),
                                 e.supported.ui &&
                                    e.media.setAttribute("tabindex", -1),
                                 Ru.call(e, e.media, "timeupdate"),
                                 Ru.call(e, e.media, "durationchange"),
                                 clearInterval(e.timers.buffering),
                                 (e.timers.buffering = setInterval(function () {
                                    (e.media.buffered = n.getVideoLoadedFraction()),
                                       (null === e.media.lastBuffered ||
                                          e.media.lastBuffered <
                                             e.media.buffered) &&
                                          Ru.call(e, e.media, "progress"),
                                       (e.media.lastBuffered =
                                          e.media.buffered),
                                       1 === e.media.buffered &&
                                          (clearInterval(e.timers.buffering),
                                          Ru.call(
                                             e,
                                             e.media,
                                             "canplaythrough"
                                          ));
                                 }, 200)),
                                 setTimeout(function () {
                                    return Rh.build.call(e);
                                 }, 50);
                           }
                        },
                        onStateChange: function (t) {
                           var n = t.target;
                           switch (
                              (clearInterval(e.timers.playing),
                              e.media.seeking &&
                                 [1, 2].includes(t.data) &&
                                 ((e.media.seeking = !1),
                                 Ru.call(e, e.media, "seeked")),
                              t.data)
                           ) {
                              case -1:
                                 Ru.call(e, e.media, "timeupdate"),
                                    (e.media.buffered = n.getVideoLoadedFraction()),
                                    Ru.call(e, e.media, "progress");
                                 break;
                              case 0:
                                 Wh.call(e, !1),
                                    e.media.loop
                                       ? (n.stopVideo(), n.playVideo())
                                       : Ru.call(e, e.media, "ended");
                                 break;
                              case 1:
                                 e.config.autoplay ||
                                 !e.media.paused ||
                                 e.embed.hasPlayed
                                    ? (Wh.call(e, !0),
                                      Ru.call(e, e.media, "playing"),
                                      (e.timers.playing = setInterval(
                                         function () {
                                            Ru.call(e, e.media, "timeupdate");
                                         },
                                         50
                                      )),
                                      e.media.duration !== n.getDuration() &&
                                         ((e.media.duration = n.getDuration()),
                                         Ru.call(e, e.media, "durationchange")))
                                    : e.media.pause();
                                 break;
                              case 2:
                                 e.muted || e.embed.unMute(), Wh.call(e, !1);
                                 break;
                              case 3:
                                 Ru.call(e, e.media, "waiting");
                           }
                           Ru.call(e, e.elements.container, "statechange", !1, {
                              code: t.data,
                           });
                        },
                     },
                  });
               }
            },
         },
         Yh = {
            setup: function () {
               this.media
                  ? (ku(
                       this.elements.container,
                       this.config.classNames.type.replace("{0}", this.type),
                       !0
                    ),
                    ku(
                       this.elements.container,
                       this.config.classNames.provider.replace(
                          "{0}",
                          this.provider
                       ),
                       !0
                    ),
                    this.isEmbed &&
                       ku(
                          this.elements.container,
                          this.config.classNames.type.replace("{0}", "video"),
                          !0
                       ),
                    this.isVideo &&
                       ((this.elements.wrapper = pu("div", {
                          class: this.config.classNames.video,
                       })),
                       fu(this.media, this.elements.wrapper),
                       this.isEmbed &&
                          ((this.elements.poster = pu("div", {
                             class: this.config.classNames.poster,
                          })),
                          this.elements.wrapper.appendChild(
                             this.elements.poster
                          ))),
                    this.isHTML5
                       ? Bu.setup.call(this)
                       : this.isYouTube
                       ? $h.setup.call(this)
                       : this.isVimeo && zh.setup.call(this))
                  : this.debug.warn("No media element found!");
            },
         },
         Gh = (function () {
            function e(t) {
               var n = this;
               yo(this, e),
                  (this.player = t),
                  (this.config = t.config.ads),
                  (this.playing = !1),
                  (this.initialized = !1),
                  (this.elements = { container: null, displayContainer: null }),
                  (this.manager = null),
                  (this.loader = null),
                  (this.cuePoints = null),
                  (this.events = {}),
                  (this.safetyTimer = null),
                  (this.countdownTimer = null),
                  (this.managerPromise = new Promise(function (e, t) {
                     n.on("loaded", e), n.on("error", t);
                  })),
                  this.load();
            }
            return (
               wo(e, [
                  {
                     key: "load",
                     value: function () {
                        var e = this;
                        this.enabled &&
                           (zc(window.google) && zc(window.google.ima)
                              ? this.ready()
                              : Bh(this.player.config.urls.googleIMA.sdk)
                                   .then(function () {
                                      e.ready();
                                   })
                                   .catch(function () {
                                      e.trigger(
                                         "error",
                                         new Error(
                                            "Google IMA SDK failed to load"
                                         )
                                      );
                                   }));
                     },
                  },
                  {
                     key: "ready",
                     value: function () {
                        var e,
                           t = this;
                        this.enabled ||
                           ((e = this).manager && e.manager.destroy(),
                           e.elements.displayContainer &&
                              e.elements.displayContainer.destroy(),
                           e.elements.container.remove()),
                           this.startSafetyTimer(12e3, "ready()"),
                           this.managerPromise.then(function () {
                              t.clearSafetyTimer("onAdsManagerLoaded()");
                           }),
                           this.listeners(),
                           this.setupIMA();
                     },
                  },
                  {
                     key: "setupIMA",
                     value: function () {
                        (this.elements.container = pu("div", {
                           class: this.player.config.classNames.ads,
                        })),
                           this.player.elements.container.appendChild(
                              this.elements.container
                           ),
                           google.ima.settings.setVpaidMode(
                              google.ima.ImaSdkSettings.VpaidMode.ENABLED
                           ),
                           google.ima.settings.setLocale(
                              this.player.config.ads.language
                           ),
                           google.ima.settings.setDisableCustomPlaybackForIOS10Plus(
                              this.player.config.playsinline
                           ),
                           (this.elements.displayContainer = new google.ima.AdDisplayContainer(
                              this.elements.container,
                              this.player.media
                           )),
                           this.requestAds();
                     },
                  },
                  {
                     key: "requestAds",
                     value: function () {
                        var e = this,
                           t = this.player.elements.container;
                        try {
                           (this.loader = new google.ima.AdsLoader(
                              this.elements.displayContainer
                           )),
                              this.loader.addEventListener(
                                 google.ima.AdsManagerLoadedEvent.Type
                                    .ADS_MANAGER_LOADED,
                                 function (t) {
                                    return e.onAdsManagerLoaded(t);
                                 },
                                 !1
                              ),
                              this.loader.addEventListener(
                                 google.ima.AdErrorEvent.Type.AD_ERROR,
                                 function (t) {
                                    return e.onAdError(t);
                                 },
                                 !1
                              );
                           var n = new google.ima.AdsRequest();
                           (n.adTagUrl = this.tagUrl),
                              (n.linearAdSlotWidth = t.offsetWidth),
                              (n.linearAdSlotHeight = t.offsetHeight),
                              (n.nonLinearAdSlotWidth = t.offsetWidth),
                              (n.nonLinearAdSlotHeight = t.offsetHeight),
                              (n.forceNonLinearFullSlot = !1),
                              n.setAdWillPlayMuted(!this.player.muted),
                              this.loader.requestAds(n);
                        } catch (e) {
                           this.onAdError(e);
                        }
                     },
                  },
                  {
                     key: "pollCountdown",
                     value: function () {
                        var e = this,
                           t =
                              arguments.length > 0 &&
                              void 0 !== arguments[0] &&
                              arguments[0];
                        if (!t)
                           return (
                              clearInterval(this.countdownTimer),
                              void this.elements.container.removeAttribute(
                                 "data-badge-text"
                              )
                           );
                        var n = function () {
                           var t = bh(
                                 Math.max(e.manager.getRemainingTime(), 0)
                              ),
                              n = ""
                                 .concat(
                                    uh("advertisement", e.player.config),
                                    " - "
                                 )
                                 .concat(t);
                           e.elements.container.setAttribute(
                              "data-badge-text",
                              n
                           );
                        };
                        this.countdownTimer = setInterval(n, 100);
                     },
                  },
                  {
                     key: "onAdsManagerLoaded",
                     value: function (e) {
                        var t = this;
                        if (this.enabled) {
                           var n = new google.ima.AdsRenderingSettings();
                           (n.restoreCustomPlaybackStateOnAdBreakComplete = !0),
                              (n.enablePreloading = !0),
                              (this.manager = e.getAdsManager(this.player, n)),
                              (this.cuePoints = this.manager.getCuePoints()),
                              this.manager.addEventListener(
                                 google.ima.AdErrorEvent.Type.AD_ERROR,
                                 function (e) {
                                    return t.onAdError(e);
                                 }
                              ),
                              Object.keys(google.ima.AdEvent.Type).forEach(
                                 function (e) {
                                    t.manager.addEventListener(
                                       google.ima.AdEvent.Type[e],
                                       function (e) {
                                          return t.onAdEvent(e);
                                       }
                                    );
                                 }
                              ),
                              this.trigger("loaded");
                        }
                     },
                  },
                  {
                     key: "addCuePoints",
                     value: function () {
                        var e = this;
                        nu(this.cuePoints) ||
                           this.cuePoints.forEach(function (t) {
                              if (
                                 0 !== t &&
                                 -1 !== t &&
                                 t < e.player.duration
                              ) {
                                 var n = e.player.elements.progress;
                                 if (Qc(n)) {
                                    var i = (100 / e.player.duration) * t,
                                       r = pu("span", {
                                          class:
                                             e.player.config.classNames.cues,
                                       });
                                    (r.style.left = "".concat(
                                       i.toString(),
                                       "%"
                                    )),
                                       n.appendChild(r);
                                 }
                              }
                           });
                     },
                  },
                  {
                     key: "onAdEvent",
                     value: function (e) {
                        var t = this,
                           n = this.player.elements.container,
                           i = e.getAd(),
                           r = e.getAdData();
                        switch (
                           ((function (e) {
                              Ru.call(
                                 t.player,
                                 t.player.media,
                                 "ads".concat(e.replace(/_/g, "").toLowerCase())
                              );
                           })(e.type),
                           e.type)
                        ) {
                           case google.ima.AdEvent.Type.LOADED:
                              this.trigger("loaded"),
                                 this.pollCountdown(!0),
                                 i.isLinear() ||
                                    ((i.width = n.offsetWidth),
                                    (i.height = n.offsetHeight));
                              break;
                           case google.ima.AdEvent.Type.STARTED:
                              this.manager.setVolume(this.player.volume);
                              break;
                           case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
                              this.loadAds();
                              break;
                           case google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED:
                              this.pauseContent();
                              break;
                           case google.ima.AdEvent.Type
                              .CONTENT_RESUME_REQUESTED:
                              this.pollCountdown(), this.resumeContent();
                              break;
                           case google.ima.AdEvent.Type.LOG:
                              r.adError &&
                                 this.player.debug.warn(
                                    "Non-fatal ad error: ".concat(
                                       r.adError.getMessage()
                                    )
                                 );
                        }
                     },
                  },
                  {
                     key: "onAdError",
                     value: function (e) {
                        this.cancel(), this.player.debug.warn("Ads error", e);
                     },
                  },
                  {
                     key: "listeners",
                     value: function () {
                        var e,
                           t = this,
                           n = this.player.elements.container;
                        this.player.on("canplay", function () {
                           t.addCuePoints();
                        }),
                           this.player.on("ended", function () {
                              t.loader.contentComplete();
                           }),
                           this.player.on("timeupdate", function () {
                              e = t.player.currentTime;
                           }),
                           this.player.on("seeked", function () {
                              var n = t.player.currentTime;
                              nu(t.cuePoints) ||
                                 t.cuePoints.forEach(function (i, r) {
                                    e < i &&
                                       i < n &&
                                       (t.manager.discardAdBreak(),
                                       t.cuePoints.splice(r, 1));
                                 });
                           }),
                           window.addEventListener("resize", function () {
                              t.manager &&
                                 t.manager.resize(
                                    n.offsetWidth,
                                    n.offsetHeight,
                                    google.ima.ViewMode.NORMAL
                                 );
                           });
                     },
                  },
                  {
                     key: "play",
                     value: function () {
                        var e = this,
                           t = this.player.elements.container;
                        this.managerPromise || this.resumeContent(),
                           this.managerPromise
                              .then(function () {
                                 e.manager.setVolume(e.player.volume),
                                    e.elements.displayContainer.initialize();
                                 try {
                                    e.initialized ||
                                       (e.manager.init(
                                          t.offsetWidth,
                                          t.offsetHeight,
                                          google.ima.ViewMode.NORMAL
                                       ),
                                       e.manager.start()),
                                       (e.initialized = !0);
                                 } catch (t) {
                                    e.onAdError(t);
                                 }
                              })
                              .catch(function () {});
                     },
                  },
                  {
                     key: "resumeContent",
                     value: function () {
                        (this.elements.container.style.zIndex = ""),
                           (this.playing = !1),
                           this.player.media.play();
                     },
                  },
                  {
                     key: "pauseContent",
                     value: function () {
                        (this.elements.container.style.zIndex = 3),
                           (this.playing = !0),
                           this.player.media.pause();
                     },
                  },
                  {
                     key: "cancel",
                     value: function () {
                        this.initialized && this.resumeContent(),
                           this.trigger("error"),
                           this.loadAds();
                     },
                  },
                  {
                     key: "loadAds",
                     value: function () {
                        var e = this;
                        this.managerPromise
                           .then(function () {
                              e.manager && e.manager.destroy(),
                                 (e.managerPromise = new Promise(function (t) {
                                    e.on("loaded", t),
                                       e.player.debug.log(e.manager);
                                 })),
                                 e.requestAds();
                           })
                           .catch(function () {});
                     },
                  },
                  {
                     key: "trigger",
                     value: function (e) {
                        for (
                           var t = this,
                              n = arguments.length,
                              i = new Array(n > 1 ? n - 1 : 0),
                              r = 1;
                           r < n;
                           r++
                        )
                           i[r - 1] = arguments[r];
                        var a = this.events[e];
                        Gc(a) &&
                           a.forEach(function (e) {
                              Yc(e) && e.apply(t, i);
                           });
                     },
                  },
                  {
                     key: "on",
                     value: function (e, t) {
                        return (
                           Gc(this.events[e]) || (this.events[e] = []),
                           this.events[e].push(t),
                           this
                        );
                     },
                  },
                  {
                     key: "startSafetyTimer",
                     value: function (e, t) {
                        var n = this;
                        this.player.debug.log(
                           "Safety timer invoked from: ".concat(t)
                        ),
                           (this.safetyTimer = setTimeout(function () {
                              n.cancel(),
                                 n.clearSafetyTimer("startSafetyTimer()");
                           }, e));
                     },
                  },
                  {
                     key: "clearSafetyTimer",
                     value: function (e) {
                        Vc(this.safetyTimer) ||
                           (this.player.debug.log(
                              "Safety timer cleared from: ".concat(e)
                           ),
                           clearTimeout(this.safetyTimer),
                           (this.safetyTimer = null));
                     },
                  },
                  {
                     key: "enabled",
                     get: function () {
                        var e = this.config;
                        return (
                           this.player.isHTML5 &&
                           this.player.isVideo &&
                           e.enabled &&
                           (!nu(e.publisherId) || tu(e.tagUrl))
                        );
                     },
                  },
                  {
                     key: "tagUrl",
                     get: function () {
                        var e = this.config;
                        if (tu(e.tagUrl)) return e.tagUrl;
                        var t = {
                           AV_PUBLISHERID: "58c25bb0073ef448b1087ad6",
                           AV_CHANNELID: "5a0458dc28a06145e4519d21",
                           AV_URL: window.location.hostname,
                           cb: Date.now(),
                           AV_WIDTH: 640,
                           AV_HEIGHT: 480,
                           AV_CDIM2: e.publisherId,
                        };
                        return ""
                           .concat(
                              "https://go.aniview.com/api/adserver6/vast/",
                              "?"
                           )
                           .concat(Th(t));
                     },
                  },
               ]),
               e
            );
         })(),
         Xh = ct.findIndex,
         Qh = !0,
         Jh = Qt("findIndex");
      "findIndex" in [] &&
         Array(1).findIndex(function () {
            Qh = !1;
         }),
         Oe(
            { target: "Array", proto: !0, forced: Qh || !Jh },
            {
               findIndex: function (e) {
                  return Xh(
                     this,
                     e,
                     arguments.length > 1 ? arguments[1] : void 0
                  );
               },
            }
         ),
         dn("findIndex");
      var Zh = Math.min,
         ef = [].lastIndexOf,
         tf = !!ef && 1 / [1].lastIndexOf(1, -0) < 0,
         nf = $t("lastIndexOf"),
         rf = Qt("indexOf", { ACCESSORS: !0, 1: 0 }),
         af =
            tf || !nf || !rf
               ? function (e) {
                    if (tf) return ef.apply(this, arguments) || 0;
                    var t = m(this),
                       n = le(t.length),
                       i = n - 1;
                    for (
                       arguments.length > 1 && (i = Zh(i, oe(arguments[1]))),
                          i < 0 && (i = n + i);
                       i >= 0;
                       i--
                    )
                       if (i in t && t[i] === e) return i || 0;
                    return -1;
                 }
               : ef;
      Oe(
         { target: "Array", proto: !0, forced: af !== [].lastIndexOf },
         { lastIndexOf: af }
      );
      var of = function (e, t) {
            var n = {};
            return (
               e > t.width / t.height
                  ? ((n.width = t.width), (n.height = (1 / e) * t.width))
                  : ((n.height = t.height), (n.width = e * t.height)),
               n
            );
         },
         sf = (function () {
            function e(t) {
               yo(this, e),
                  (this.player = t),
                  (this.thumbnails = []),
                  (this.loaded = !1),
                  (this.lastMouseMoveTime = Date.now()),
                  (this.mouseDown = !1),
                  (this.loadedImages = []),
                  (this.elements = { thumb: {}, scrubbing: {} }),
                  this.load();
            }
            return (
               wo(e, [
                  {
                     key: "load",
                     value: function () {
                        var e = this;
                        this.player.elements.display.seekTooltip &&
                           (this.player.elements.display.seekTooltip.hidden = this.enabled),
                           this.enabled &&
                              this.getThumbnails().then(function () {
                                 e.enabled &&
                                    (e.render(),
                                    e.determineContainerAutoSizing(),
                                    (e.loaded = !0));
                              });
                     },
                  },
                  {
                     key: "getThumbnails",
                     value: function () {
                        var e = this;
                        return new Promise(function (t) {
                           var n = e.player.config.previewThumbnails.src;
                           if (nu(n))
                              throw new Error(
                                 "Missing previewThumbnails.src config attribute"
                              );
                           var i = (Kc(n) ? [n] : n).map(function (t) {
                              return e.getThumbnail(t);
                           });
                           Promise.all(i).then(function () {
                              e.thumbnails.sort(function (e, t) {
                                 return e.height - t.height;
                              }),
                                 e.player.debug.log(
                                    "Preview thumbnails",
                                    e.thumbnails
                                 ),
                                 t();
                           });
                        });
                     },
                  },
                  {
                     key: "getThumbnail",
                     value: function (e) {
                        var t = this;
                        return new Promise(function (n) {
                           fh(e).then(function (i) {
                              var r,
                                 a,
                                 o = {
                                    frames:
                                       ((r = i),
                                       (a = []),
                                       r
                                          .split(/\r\n\r\n|\n\n|\r\r/)
                                          .forEach(function (e) {
                                             var t = {};
                                             e
                                                .split(/\r\n|\n|\r/)
                                                .forEach(function (e) {
                                                   if (Wc(t.startTime)) {
                                                      if (
                                                         !nu(e.trim()) &&
                                                         nu(t.text)
                                                      ) {
                                                         var n = e
                                                               .trim()
                                                               .split("#xywh="),
                                                            i = Eo(n, 1);
                                                         if (
                                                            ((t.text = i[0]),
                                                            n[1])
                                                         ) {
                                                            var r = Eo(
                                                               n[1].split(","),
                                                               4
                                                            );
                                                            (t.x = r[0]),
                                                               (t.y = r[1]),
                                                               (t.w = r[2]),
                                                               (t.h = r[3]);
                                                         }
                                                      }
                                                   } else {
                                                      var a = e.match(
                                                         /([0-9]{2})?:?([0-9]{2}):([0-9]{2}).([0-9]{2,3})( ?--> ?)([0-9]{2})?:?([0-9]{2}):([0-9]{2}).([0-9]{2,3})/
                                                      );
                                                      a &&
                                                         ((t.startTime =
                                                            60 *
                                                               Number(
                                                                  a[1] || 0
                                                               ) *
                                                               60 +
                                                            60 * Number(a[2]) +
                                                            Number(a[3]) +
                                                            Number(
                                                               "0.".concat(a[4])
                                                            )),
                                                         (t.endTime =
                                                            60 *
                                                               Number(
                                                                  a[6] || 0
                                                               ) *
                                                               60 +
                                                            60 * Number(a[7]) +
                                                            Number(a[8]) +
                                                            Number(
                                                               "0.".concat(a[9])
                                                            )));
                                                   }
                                                }),
                                                t.text && a.push(t);
                                          }),
                                       a),
                                    height: null,
                                    urlPrefix: "",
                                 };
                              o.frames[0].text.startsWith("/") ||
                                 o.frames[0].text.startsWith("http://") ||
                                 o.frames[0].text.startsWith("https://") ||
                                 (o.urlPrefix = e.substring(
                                    0,
                                    e.lastIndexOf("/") + 1
                                 ));
                              var s = new Image();
                              (s.onload = function () {
                                 (o.height = s.naturalHeight),
                                    (o.width = s.naturalWidth),
                                    t.thumbnails.push(o),
                                    n();
                              }),
                                 (s.src = o.urlPrefix + o.frames[0].text);
                           });
                        });
                     },
                  },
                  {
                     key: "startMove",
                     value: function (e) {
                        if (
                           this.loaded &&
                           Jc(e) &&
                           ["touchmove", "mousemove"].includes(e.type) &&
                           this.player.media.duration
                        ) {
                           if ("touchmove" === e.type)
                              this.seekTime =
                                 this.player.media.duration *
                                 (this.player.elements.inputs.seek.value / 100);
                           else {
                              var t = this.player.elements.progress.getBoundingClientRect(),
                                 n = (100 / t.width) * (e.pageX - t.left);
                              (this.seekTime =
                                 this.player.media.duration * (n / 100)),
                                 this.seekTime < 0 && (this.seekTime = 0),
                                 this.seekTime >
                                    this.player.media.duration - 1 &&
                                    (this.seekTime =
                                       this.player.media.duration - 1),
                                 (this.mousePosX = e.pageX),
                                 (this.elements.thumb.time.innerText = bh(
                                    this.seekTime
                                 ));
                           }
                           this.showImageAtCurrentTime();
                        }
                     },
                  },
                  {
                     key: "endMove",
                     value: function () {
                        this.toggleThumbContainer(!1, !0);
                     },
                  },
                  {
                     key: "startScrubbing",
                     value: function (e) {
                        (Vc(e.button) || !1 === e.button || 0 === e.button) &&
                           ((this.mouseDown = !0),
                           this.player.media.duration &&
                              (this.toggleScrubbingContainer(!0),
                              this.toggleThumbContainer(!1, !0),
                              this.showImageAtCurrentTime()));
                     },
                  },
                  {
                     key: "endScrubbing",
                     value: function () {
                        var e = this;
                        (this.mouseDown = !1),
                           Math.ceil(this.lastTime) ===
                           Math.ceil(this.player.media.currentTime)
                              ? this.toggleScrubbingContainer(!1)
                              : Nu.call(
                                   this.player,
                                   this.player.media,
                                   "timeupdate",
                                   function () {
                                      e.mouseDown ||
                                         e.toggleScrubbingContainer(!1);
                                   }
                                );
                     },
                  },
                  {
                     key: "listeners",
                     value: function () {
                        var e = this;
                        this.player.on("play", function () {
                           e.toggleThumbContainer(!1, !0);
                        }),
                           this.player.on("seeked", function () {
                              e.toggleThumbContainer(!1);
                           }),
                           this.player.on("timeupdate", function () {
                              e.lastTime = e.player.media.currentTime;
                           });
                     },
                  },
                  {
                     key: "render",
                     value: function () {
                        (this.elements.thumb.container = pu("div", {
                           class: this.player.config.classNames
                              .previewThumbnails.thumbContainer,
                        })),
                           (this.elements.thumb.imageContainer = pu("div", {
                              class: this.player.config.classNames
                                 .previewThumbnails.imageContainer,
                           })),
                           this.elements.thumb.container.appendChild(
                              this.elements.thumb.imageContainer
                           );
                        var e = pu("div", {
                           class: this.player.config.classNames
                              .previewThumbnails.timeContainer,
                        });
                        (this.elements.thumb.time = pu("span", {}, "00:00")),
                           e.appendChild(this.elements.thumb.time),
                           this.elements.thumb.container.appendChild(e),
                           Qc(this.player.elements.progress) &&
                              this.player.elements.progress.appendChild(
                                 this.elements.thumb.container
                              ),
                           (this.elements.scrubbing.container = pu("div", {
                              class: this.player.config.classNames
                                 .previewThumbnails.scrubbingContainer,
                           })),
                           this.player.elements.wrapper.appendChild(
                              this.elements.scrubbing.container
                           );
                     },
                  },
                  {
                     key: "destroy",
                     value: function () {
                        this.elements.thumb.container &&
                           this.elements.thumb.container.remove(),
                           this.elements.scrubbing.container &&
                              this.elements.scrubbing.container.remove();
                     },
                  },
                  {
                     key: "showImageAtCurrentTime",
                     value: function () {
                        var e = this;
                        this.mouseDown
                           ? this.setScrubbingContainerSize()
                           : this.setThumbContainerSizeAndPos();
                        var t = this.thumbnails[0].frames.findIndex(function (
                              t
                           ) {
                              return (
                                 e.seekTime >= t.startTime &&
                                 e.seekTime <= t.endTime
                              );
                           }),
                           n = t >= 0,
                           i = 0;
                        this.mouseDown || this.toggleThumbContainer(n),
                           n &&
                              (this.thumbnails.forEach(function (n, r) {
                                 e.loadedImages.includes(n.frames[t].text) &&
                                    (i = r);
                              }),
                              t !== this.showingThumb &&
                                 ((this.showingThumb = t), this.loadImage(i)));
                     },
                  },
                  {
                     key: "loadImage",
                     value: function () {
                        var e = this,
                           t =
                              arguments.length > 0 && void 0 !== arguments[0]
                                 ? arguments[0]
                                 : 0,
                           n = this.showingThumb,
                           i = this.thumbnails[t],
                           r = i.urlPrefix,
                           a = i.frames[n],
                           o = i.frames[n].text,
                           s = r + o;
                        if (
                           this.currentImageElement &&
                           this.currentImageElement.dataset.filename === o
                        )
                           this.showImage(
                              this.currentImageElement,
                              a,
                              t,
                              n,
                              o,
                              !1
                           ),
                              (this.currentImageElement.dataset.index = n),
                              this.removeOldImages(this.currentImageElement);
                        else {
                           this.loadingImage &&
                              this.usingSprites &&
                              (this.loadingImage.onload = null);
                           var l = new Image();
                           (l.src = s),
                              (l.dataset.index = n),
                              (l.dataset.filename = o),
                              (this.showingThumbFilename = o),
                              this.player.debug.log(
                                 "Loading image: ".concat(s)
                              ),
                              (l.onload = function () {
                                 return e.showImage(l, a, t, n, o, !0);
                              }),
                              (this.loadingImage = l),
                              this.removeOldImages(l);
                        }
                     },
                  },
                  {
                     key: "showImage",
                     value: function (e, t, n, i, r) {
                        var a =
                           !(arguments.length > 5 && void 0 !== arguments[5]) ||
                           arguments[5];
                        this.player.debug.log(
                           "Showing thumb: "
                              .concat(r, ". num: ")
                              .concat(i, ". qual: ")
                              .concat(n, ". newimg: ")
                              .concat(a)
                        ),
                           this.setImageSizeAndOffset(e, t),
                           a &&
                              (this.currentImageContainer.appendChild(e),
                              (this.currentImageElement = e),
                              this.loadedImages.includes(r) ||
                                 this.loadedImages.push(r)),
                           this.preloadNearby(i, !0)
                              .then(this.preloadNearby(i, !1))
                              .then(this.getHigherQuality(n, e, t, r));
                     },
                  },
                  {
                     key: "removeOldImages",
                     value: function (e) {
                        var t = this;
                        Array.from(this.currentImageContainer.children).forEach(
                           function (n) {
                              if ("img" === n.tagName.toLowerCase()) {
                                 var i = t.usingSprites ? 500 : 1e3;
                                 if (
                                    n.dataset.index !== e.dataset.index &&
                                    !n.dataset.deleting
                                 ) {
                                    n.dataset.deleting = !0;
                                    var r = t.currentImageContainer;
                                    setTimeout(function () {
                                       r.removeChild(n),
                                          t.player.debug.log(
                                             "Removing thumb: ".concat(
                                                n.dataset.filename
                                             )
                                          );
                                    }, i);
                                 }
                              }
                           }
                        );
                     },
                  },
                  {
                     key: "preloadNearby",
                     value: function (e) {
                        var t = this,
                           n =
                              !(
                                 arguments.length > 1 && void 0 !== arguments[1]
                              ) || arguments[1];
                        return new Promise(function (i) {
                           setTimeout(function () {
                              var r = t.thumbnails[0].frames[e].text;
                              if (t.showingThumbFilename === r) {
                                 var a;
                                 a = n
                                    ? t.thumbnails[0].frames.slice(e)
                                    : t.thumbnails[0].frames
                                         .slice(0, e)
                                         .reverse();
                                 var o = !1;
                                 a.forEach(function (e) {
                                    var n = e.text;
                                    if (
                                       n !== r &&
                                       !t.loadedImages.includes(n)
                                    ) {
                                       (o = !0),
                                          t.player.debug.log(
                                             "Preloading thumb filename: ".concat(
                                                n
                                             )
                                          );
                                       var a = t.thumbnails[0].urlPrefix + n,
                                          s = new Image();
                                       (s.src = a),
                                          (s.onload = function () {
                                             t.player.debug.log(
                                                "Preloaded thumb filename: ".concat(
                                                   n
                                                )
                                             ),
                                                t.loadedImages.includes(n) ||
                                                   t.loadedImages.push(n),
                                                i();
                                          });
                                    }
                                 }),
                                    o || i();
                              }
                           }, 300);
                        });
                     },
                  },
                  {
                     key: "getHigherQuality",
                     value: function (e, t, n, i) {
                        var r = this;
                        if (e < this.thumbnails.length - 1) {
                           var a = t.naturalHeight;
                           this.usingSprites && (a = n.h),
                              a < this.thumbContainerHeight &&
                                 setTimeout(function () {
                                    r.showingThumbFilename === i &&
                                       (r.player.debug.log(
                                          "Showing higher quality thumb for: ".concat(
                                             i
                                          )
                                       ),
                                       r.loadImage(e + 1));
                                 }, 300);
                        }
                     },
                  },
                  {
                     key: "toggleThumbContainer",
                     value: function () {
                        var e =
                              arguments.length > 0 &&
                              void 0 !== arguments[0] &&
                              arguments[0],
                           t =
                              arguments.length > 1 &&
                              void 0 !== arguments[1] &&
                              arguments[1],
                           n = this.player.config.classNames.previewThumbnails
                              .thumbContainerShown;
                        this.elements.thumb.container.classList.toggle(n, e),
                           !e &&
                              t &&
                              ((this.showingThumb = null),
                              (this.showingThumbFilename = null));
                     },
                  },
                  {
                     key: "toggleScrubbingContainer",
                     value: function () {
                        var e =
                              arguments.length > 0 &&
                              void 0 !== arguments[0] &&
                              arguments[0],
                           t = this.player.config.classNames.previewThumbnails
                              .scrubbingContainerShown;
                        this.elements.scrubbing.container.classList.toggle(
                           t,
                           e
                        ),
                           e ||
                              ((this.showingThumb = null),
                              (this.showingThumbFilename = null));
                     },
                  },
                  {
                     key: "determineContainerAutoSizing",
                     value: function () {
                        (this.elements.thumb.imageContainer.clientHeight > 20 ||
                           this.elements.thumb.imageContainer.clientWidth >
                              20) &&
                           (this.sizeSpecifiedInCSS = !0);
                     },
                  },
                  {
                     key: "setThumbContainerSizeAndPos",
                     value: function () {
                        if (this.sizeSpecifiedInCSS) {
                           if (
                              this.elements.thumb.imageContainer.clientHeight >
                                 20 &&
                              this.elements.thumb.imageContainer.clientWidth <
                                 20
                           ) {
                              var e = Math.floor(
                                 this.elements.thumb.imageContainer
                                    .clientHeight * this.thumbAspectRatio
                              );
                              this.elements.thumb.imageContainer.style.width = "".concat(
                                 e,
                                 "px"
                              );
                           } else if (
                              this.elements.thumb.imageContainer.clientHeight <
                                 20 &&
                              this.elements.thumb.imageContainer.clientWidth >
                                 20
                           ) {
                              var t = Math.floor(
                                 this.elements.thumb.imageContainer
                                    .clientWidth / this.thumbAspectRatio
                              );
                              this.elements.thumb.imageContainer.style.height = "".concat(
                                 t,
                                 "px"
                              );
                           }
                        } else {
                           var n = Math.floor(
                              this.thumbContainerHeight * this.thumbAspectRatio
                           );
                           (this.elements.thumb.imageContainer.style.height = "".concat(
                              this.thumbContainerHeight,
                              "px"
                           )),
                              (this.elements.thumb.imageContainer.style.width = "".concat(
                                 n,
                                 "px"
                              ));
                        }
                        this.setThumbContainerPos();
                     },
                  },
                  {
                     key: "setThumbContainerPos",
                     value: function () {
                        var e = this.player.elements.progress.getBoundingClientRect(),
                           t = this.player.elements.container.getBoundingClientRect(),
                           n = this.elements.thumb.container,
                           i = t.left - e.left + 10,
                           r = t.right - e.left - n.clientWidth - 10,
                           a = this.mousePosX - e.left - n.clientWidth / 2;
                        a < i && (a = i),
                           a > r && (a = r),
                           (n.style.left = "".concat(a, "px"));
                     },
                  },
                  {
                     key: "setScrubbingContainerSize",
                     value: function () {
                        var e = of(this.thumbAspectRatio, {
                              width: this.player.media.clientWidth,
                              height: this.player.media.clientHeight,
                           }),
                           t = e.width,
                           n = e.height;
                        (this.elements.scrubbing.container.style.width = "".concat(
                           t,
                           "px"
                        )),
                           (this.elements.scrubbing.container.style.height = "".concat(
                              n,
                              "px"
                           ));
                     },
                  },
                  {
                     key: "setImageSizeAndOffset",
                     value: function (e, t) {
                        if (this.usingSprites) {
                           var n = this.thumbContainerHeight / t.h;
                           (e.style.height = "".concat(
                              e.naturalHeight * n,
                              "px"
                           )),
                              (e.style.width = "".concat(
                                 e.naturalWidth * n,
                                 "px"
                              )),
                              (e.style.left = "-".concat(t.x * n, "px")),
                              (e.style.top = "-".concat(t.y * n, "px"));
                        }
                     },
                  },
                  {
                     key: "enabled",
                     get: function () {
                        return (
                           this.player.isHTML5 &&
                           this.player.isVideo &&
                           this.player.config.previewThumbnails.enabled
                        );
                     },
                  },
                  {
                     key: "currentImageContainer",
                     get: function () {
                        return this.mouseDown
                           ? this.elements.scrubbing.container
                           : this.elements.thumb.imageContainer;
                     },
                  },
                  {
                     key: "usingSprites",
                     get: function () {
                        return Object.keys(
                           this.thumbnails[0].frames[0]
                        ).includes("w");
                     },
                  },
                  {
                     key: "thumbAspectRatio",
                     get: function () {
                        return this.usingSprites
                           ? this.thumbnails[0].frames[0].w /
                                this.thumbnails[0].frames[0].h
                           : this.thumbnails[0].width /
                                this.thumbnails[0].height;
                     },
                  },
                  {
                     key: "thumbContainerHeight",
                     get: function () {
                        return this.mouseDown
                           ? of(this.thumbAspectRatio, {
                                width: this.player.media.clientWidth,
                                height: this.player.media.clientHeight,
                             }).height
                           : this.sizeSpecifiedInCSS
                           ? this.elements.thumb.imageContainer.clientHeight
                           : Math.floor(
                                this.player.media.clientWidth /
                                   this.thumbAspectRatio /
                                   4
                             );
                     },
                  },
                  {
                     key: "currentImageElement",
                     get: function () {
                        return this.mouseDown
                           ? this.currentScrubbingImageElement
                           : this.currentThumbnailImageElement;
                     },
                     set: function (e) {
                        this.mouseDown
                           ? (this.currentScrubbingImageElement = e)
                           : (this.currentThumbnailImageElement = e);
                     },
                  },
               ]),
               e
            );
         })(),
         lf = {
            insertElements: function (e, t) {
               var n = this;
               Kc(t)
                  ? mu(e, this.media, { src: t })
                  : Gc(t) &&
                    t.forEach(function (t) {
                       mu(e, n.media, t);
                    });
            },
            change: function (e) {
               var t = this;
               uu(e, "sources.length")
                  ? (Bu.cancelRequests.call(this),
                    this.destroy.call(
                       this,
                       function () {
                          (t.options.quality = []),
                             gu(t.media),
                             (t.media = null),
                             Qc(t.elements.container) &&
                                t.elements.container.removeAttribute("class");
                          var n = e.sources,
                             i = e.type,
                             r = Eo(n, 1)[0],
                             a = r.provider,
                             o = void 0 === a ? Ch.html5 : a,
                             s = r.src,
                             l = "html5" === o ? i : "div",
                             c = "html5" === o ? {} : { src: s };
                          Object.assign(t, {
                             provider: o,
                             type: i,
                             supported: Iu.check(i, o, t.config.playsinline),
                             media: pu(l, c),
                          }),
                             t.elements.container.appendChild(t.media),
                             $c(e.autoplay) && (t.config.autoplay = e.autoplay),
                             t.isHTML5 &&
                                (t.config.crossorigin &&
                                   t.media.setAttribute("crossorigin", ""),
                                t.config.autoplay &&
                                   t.media.setAttribute("autoplay", ""),
                                nu(e.poster) || (t.poster = e.poster),
                                t.config.loop.active &&
                                   t.media.setAttribute("loop", ""),
                                t.config.muted &&
                                   t.media.setAttribute("muted", ""),
                                t.config.playsinline &&
                                   t.media.setAttribute("playsinline", "")),
                             Rh.addStyleHook.call(t),
                             t.isHTML5 &&
                                lf.insertElements.call(t, "source", n),
                             (t.config.title = e.title),
                             Yh.setup.call(t),
                             t.isHTML5 &&
                                Object.keys(e).includes("tracks") &&
                                lf.insertElements.call(t, "track", e.tracks),
                             (t.isHTML5 || (t.isEmbed && !t.supported.ui)) &&
                                Rh.build.call(t),
                             t.isHTML5 && t.media.load(),
                             nu(e.previewThumbnails) ||
                                (Object.assign(
                                   t.config.previewThumbnails,
                                   e.previewThumbnails
                                ),
                                t.previewThumbnails &&
                                   t.previewThumbnails.loaded &&
                                   (t.previewThumbnails.destroy(),
                                   (t.previewThumbnails = null)),
                                t.config.previewThumbnails.enabled &&
                                   (t.previewThumbnails = new sf(t))),
                             t.fullscreen.update();
                       },
                       !0
                    ))
                  : this.debug.warn("Invalid source format");
            },
         };
      var cf,
         uf = (function () {
            function e(t, n) {
               var i = this;
               if (
                  (yo(this, e),
                  (this.timers = {}),
                  (this.ready = !1),
                  (this.loading = !1),
                  (this.failed = !1),
                  (this.touch = Iu.touch),
                  (this.media = t),
                  Kc(this.media) &&
                     (this.media = document.querySelectorAll(this.media)),
                  ((window.jQuery && this.media instanceof jQuery) ||
                     Xc(this.media) ||
                     Gc(this.media)) &&
                     (this.media = this.media[0]),
                  (this.config = hu(
                     {},
                     Eh,
                     e.defaults,
                     n || {},
                     (function () {
                        try {
                           return JSON.parse(
                              i.media.getAttribute("data-plyr-config")
                           );
                        } catch (e) {
                           return {};
                        }
                     })()
                  )),
                  (this.elements = {
                     container: null,
                     captions: null,
                     buttons: {},
                     display: {},
                     progress: {},
                     inputs: {},
                     settings: {
                        popup: null,
                        menu: null,
                        panels: {},
                        buttons: {},
                     },
                  }),
                  (this.captions = {
                     active: null,
                     currentTrack: -1,
                     meta: new WeakMap(),
                  }),
                  (this.fullscreen = { active: !1 }),
                  (this.options = { speed: [], quality: [] }),
                  (this.debug = new Lh(this.config.debug)),
                  this.debug.log("Config", this.config),
                  this.debug.log("Support", Iu),
                  !Vc(this.media) && Qc(this.media))
               )
                  if (this.media.plyr) this.debug.warn("Target already setup");
                  else if (this.config.enabled)
                     if (Iu.check().api) {
                        var r = this.media.cloneNode(!0);
                        (r.autoplay = !1), (this.elements.original = r);
                        var a = this.media.tagName.toLowerCase(),
                           o = null,
                           s = null;
                        switch (a) {
                           case "div":
                              if (
                                 ((o = this.media.querySelector("iframe")),
                                 Qc(o))
                              ) {
                                 if (
                                    ((s = kh(o.getAttribute("src"))),
                                    (this.provider = (function (e) {
                                       return /^(https?:\/\/)?(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.?be)\/.+$/.test(
                                          e
                                       )
                                          ? Ch.youtube
                                          : /^https?:\/\/player.vimeo.com\/video\/\d{0,9}(?=\b|\/)/.test(
                                               e
                                            )
                                          ? Ch.vimeo
                                          : null;
                                    })(s.toString())),
                                    (this.elements.container = this.media),
                                    (this.media = o),
                                    (this.elements.container.className = ""),
                                    s.search.length)
                                 ) {
                                    var l = ["1", "true"];
                                    l.includes(
                                       s.searchParams.get("autoplay")
                                    ) && (this.config.autoplay = !0),
                                       l.includes(s.searchParams.get("loop")) &&
                                          (this.config.loop.active = !0),
                                       this.isYouTube
                                          ? ((this.config.playsinline = l.includes(
                                               s.searchParams.get("playsinline")
                                            )),
                                            (this.config.youtube.hl = s.searchParams.get(
                                               "hl"
                                            )))
                                          : (this.config.playsinline = !0);
                                 }
                              } else
                                 (this.provider = this.media.getAttribute(
                                    this.config.attributes.embed.provider
                                 )),
                                    this.media.removeAttribute(
                                       this.config.attributes.embed.provider
                                    );
                              if (
                                 nu(this.provider) ||
                                 !Object.keys(Ch).includes(this.provider)
                              )
                                 return void this.debug.error(
                                    "Setup failed: Invalid provider"
                                 );
                              this.type = Ih;
                              break;
                           case "video":
                           case "audio":
                              (this.type = a),
                                 (this.provider = Ch.html5),
                                 this.media.hasAttribute("crossorigin") &&
                                    (this.config.crossorigin = !0),
                                 this.media.hasAttribute("autoplay") &&
                                    (this.config.autoplay = !0),
                                 (this.media.hasAttribute("playsinline") ||
                                    this.media.hasAttribute(
                                       "webkit-playsinline"
                                    )) &&
                                    (this.config.playsinline = !0),
                                 this.media.hasAttribute("muted") &&
                                    (this.config.muted = !0),
                                 this.media.hasAttribute("loop") &&
                                    (this.config.loop.active = !0);
                              break;
                           default:
                              return void this.debug.error(
                                 "Setup failed: unsupported type"
                              );
                        }
                        (this.supported = Iu.check(
                           this.type,
                           this.provider,
                           this.config.playsinline
                        )),
                           this.supported.api
                              ? ((this.eventListeners = []),
                                (this.listeners = new _h(this)),
                                (this.storage = new hh(this)),
                                (this.media.plyr = this),
                                Qc(this.elements.container) ||
                                   ((this.elements.container = pu("div", {
                                      tabindex: 0,
                                   })),
                                   fu(this.media, this.elements.container)),
                                Rh.addStyleHook.call(this),
                                Yh.setup.call(this),
                                this.config.debug &&
                                   ju.call(
                                      this,
                                      this.elements.container,
                                      this.config.events.join(" "),
                                      function (e) {
                                         i.debug.log("event: ".concat(e.type));
                                      }
                                   ),
                                (this.isHTML5 ||
                                   (this.isEmbed && !this.supported.ui)) &&
                                   Rh.build.call(this),
                                this.listeners.container(),
                                this.listeners.global(),
                                (this.fullscreen = new jh(this)),
                                this.config.ads.enabled &&
                                   (this.ads = new Gh(this)),
                                this.isHTML5 &&
                                   this.config.autoplay &&
                                   setTimeout(function () {
                                      return i.play();
                                   }, 10),
                                (this.lastSeekTime = 0),
                                this.config.previewThumbnails.enabled &&
                                   (this.previewThumbnails = new sf(this)))
                              : this.debug.error("Setup failed: no support");
                     } else this.debug.error("Setup failed: no support");
                  else this.debug.error("Setup failed: disabled by config");
               else
                  this.debug.error("Setup failed: no suitable element passed");
            }
            return (
               wo(
                  e,
                  [
                     {
                        key: "play",
                        value: function () {
                           var e = this;
                           return Yc(this.media.play)
                              ? (this.ads &&
                                   this.ads.enabled &&
                                   this.ads.managerPromise
                                      .then(function () {
                                         return e.ads.play();
                                      })
                                      .catch(function () {
                                         return e.media.play();
                                      }),
                                this.media.play())
                              : null;
                        },
                     },
                     {
                        key: "pause",
                        value: function () {
                           return this.playing && Yc(this.media.pause)
                              ? this.media.pause()
                              : null;
                        },
                     },
                     {
                        key: "togglePlay",
                        value: function (e) {
                           return ($c(e) ? e : !this.playing)
                              ? this.play()
                              : this.pause();
                        },
                     },
                     {
                        key: "stop",
                        value: function () {
                           this.isHTML5
                              ? (this.pause(), this.restart())
                              : Yc(this.media.stop) && this.media.stop();
                        },
                     },
                     {
                        key: "restart",
                        value: function () {
                           this.currentTime = 0;
                        },
                     },
                     {
                        key: "rewind",
                        value: function (e) {
                           this.currentTime -= Wc(e) ? e : this.config.seekTime;
                        },
                     },
                     {
                        key: "forward",
                        value: function (e) {
                           this.currentTime += Wc(e) ? e : this.config.seekTime;
                        },
                     },
                     {
                        key: "increaseVolume",
                        value: function (e) {
                           var t = this.media.muted ? 0 : this.volume;
                           this.volume = t + (Wc(e) ? e : 0);
                        },
                     },
                     {
                        key: "decreaseVolume",
                        value: function (e) {
                           this.increaseVolume(-e);
                        },
                     },
                     {
                        key: "toggleCaptions",
                        value: function (e) {
                           Sh.toggle.call(this, e, !1);
                        },
                     },
                     {
                        key: "airplay",
                        value: function () {
                           Iu.airplay &&
                              this.media.webkitShowPlaybackTargetPicker();
                        },
                     },
                     {
                        key: "toggleControls",
                        value: function (e) {
                           if (this.supported.ui && !this.isAudio) {
                              var t = Tu(
                                    this.elements.container,
                                    this.config.classNames.hideControls
                                 ),
                                 n = void 0 === e ? void 0 : !e,
                                 i = ku(
                                    this.elements.container,
                                    this.config.classNames.hideControls,
                                    n
                                 );
                              if (
                                 (i &&
                                    this.config.controls.includes("settings") &&
                                    !nu(this.config.settings) &&
                                    wh.toggleMenu.call(this, !1),
                                 i !== t)
                              ) {
                                 var r = i ? "controlshidden" : "controlsshown";
                                 Ru.call(this, this.media, r);
                              }
                              return !i;
                           }
                           return !1;
                        },
                     },
                     {
                        key: "on",
                        value: function (e, t) {
                           ju.call(this, this.elements.container, e, t);
                        },
                     },
                     {
                        key: "once",
                        value: function (e, t) {
                           Nu.call(this, this.elements.container, e, t);
                        },
                     },
                     {
                        key: "off",
                        value: function (e, t) {
                           Mu(this.elements.container, e, t);
                        },
                     },
                     {
                        key: "destroy",
                        value: function (e) {
                           var t = this,
                              n =
                                 arguments.length > 1 &&
                                 void 0 !== arguments[1] &&
                                 arguments[1];
                           if (this.ready) {
                              var i = function () {
                                 (document.body.style.overflow = ""),
                                    (t.embed = null),
                                    n
                                       ? (Object.keys(t.elements).length &&
                                            (gu(t.elements.buttons.play),
                                            gu(t.elements.captions),
                                            gu(t.elements.controls),
                                            gu(t.elements.wrapper),
                                            (t.elements.buttons.play = null),
                                            (t.elements.captions = null),
                                            (t.elements.controls = null),
                                            (t.elements.wrapper = null)),
                                         Yc(e) && e())
                                       : (_u.call(t),
                                         yu(
                                            t.elements.original,
                                            t.elements.container
                                         ),
                                         Ru.call(
                                            t,
                                            t.elements.original,
                                            "destroyed",
                                            !0
                                         ),
                                         Yc(e) && e.call(t.elements.original),
                                         (t.ready = !1),
                                         setTimeout(function () {
                                            (t.elements = null),
                                               (t.media = null);
                                         }, 200));
                              };
                              this.stop(),
                                 clearTimeout(this.timers.loading),
                                 clearTimeout(this.timers.controls),
                                 clearTimeout(this.timers.resized),
                                 this.isHTML5
                                    ? (Rh.toggleNativeControls.call(this, !0),
                                      i())
                                    : this.isYouTube
                                    ? (clearInterval(this.timers.buffering),
                                      clearInterval(this.timers.playing),
                                      null !== this.embed &&
                                         Yc(this.embed.destroy) &&
                                         this.embed.destroy(),
                                      i())
                                    : this.isVimeo &&
                                      (null !== this.embed &&
                                         this.embed.unload().then(i),
                                      setTimeout(i, 200));
                           }
                        },
                     },
                     {
                        key: "supports",
                        value: function (e) {
                           return Iu.mime.call(this, e);
                        },
                     },
                     {
                        key: "isHTML5",
                        get: function () {
                           return this.provider === Ch.html5;
                        },
                     },
                     {
                        key: "isEmbed",
                        get: function () {
                           return this.isYouTube || this.isVimeo;
                        },
                     },
                     {
                        key: "isYouTube",
                        get: function () {
                           return this.provider === Ch.youtube;
                        },
                     },
                     {
                        key: "isVimeo",
                        get: function () {
                           return this.provider === Ch.vimeo;
                        },
                     },
                     {
                        key: "isVideo",
                        get: function () {
                           return this.type === Ih;
                        },
                     },
                     {
                        key: "isAudio",
                        get: function () {
                           return this.type === Ph;
                        },
                     },
                     {
                        key: "playing",
                        get: function () {
                           return Boolean(
                              this.ready && !this.paused && !this.ended
                           );
                        },
                     },
                     {
                        key: "paused",
                        get: function () {
                           return Boolean(this.media.paused);
                        },
                     },
                     {
                        key: "stopped",
                        get: function () {
                           return Boolean(
                              this.paused && 0 === this.currentTime
                           );
                        },
                     },
                     {
                        key: "ended",
                        get: function () {
                           return Boolean(this.media.ended);
                        },
                     },
                     {
                        key: "currentTime",
                        set: function (e) {
                           if (this.duration) {
                              var t = Wc(e) && e > 0;
                              (this.media.currentTime = t
                                 ? Math.min(e, this.duration)
                                 : 0),
                                 this.debug.log(
                                    "Seeking to ".concat(
                                       this.currentTime,
                                       " seconds"
                                    )
                                 );
                           }
                        },
                        get: function () {
                           return Number(this.media.currentTime);
                        },
                     },
                     {
                        key: "buffered",
                        get: function () {
                           var e = this.media.buffered;
                           return Wc(e)
                              ? e
                              : e && e.length && this.duration > 0
                              ? e.end(0) / this.duration
                              : 0;
                        },
                     },
                     {
                        key: "seeking",
                        get: function () {
                           return Boolean(this.media.seeking);
                        },
                     },
                     {
                        key: "duration",
                        get: function () {
                           var e = parseFloat(this.config.duration),
                              t = (this.media || {}).duration,
                              n = Wc(t) && t !== 1 / 0 ? t : 0;
                           return e || n;
                        },
                     },
                     {
                        key: "volume",
                        set: function (e) {
                           var t = e;
                           Kc(t) && (t = Number(t)),
                              Wc(t) || (t = this.storage.get("volume")),
                              Wc(t) || (t = this.config.volume),
                              t > 1 && (t = 1),
                              t < 0 && (t = 0),
                              (this.config.volume = t),
                              (this.media.volume = t),
                              !nu(e) &&
                                 this.muted &&
                                 t > 0 &&
                                 (this.muted = !1);
                        },
                        get: function () {
                           return Number(this.media.volume);
                        },
                     },
                     {
                        key: "muted",
                        set: function (e) {
                           var t = e;
                           $c(t) || (t = this.storage.get("muted")),
                              $c(t) || (t = this.config.muted),
                              (this.config.muted = t),
                              (this.media.muted = t);
                        },
                        get: function () {
                           return Boolean(this.media.muted);
                        },
                     },
                     {
                        key: "hasAudio",
                        get: function () {
                           return (
                              !this.isHTML5 ||
                              !!this.isAudio ||
                              Boolean(this.media.mozHasAudio) ||
                              Boolean(this.media.webkitAudioDecodedByteCount) ||
                              Boolean(
                                 this.media.audioTracks &&
                                    this.media.audioTracks.length
                              )
                           );
                        },
                     },
                     {
                        key: "speed",
                        set: function (e) {
                           var t = this,
                              n = null;
                           Wc(e) && (n = e),
                              Wc(n) || (n = this.storage.get("speed")),
                              Wc(n) || (n = this.config.speed.selected);
                           var i = this.minimumSpeed,
                              r = this.maximumSpeed;
                           (n = (function () {
                              var e =
                                    arguments.length > 0 &&
                                    void 0 !== arguments[0]
                                       ? arguments[0]
                                       : 0,
                                 t =
                                    arguments.length > 1 &&
                                    void 0 !== arguments[1]
                                       ? arguments[1]
                                       : 0,
                                 n =
                                    arguments.length > 2 &&
                                    void 0 !== arguments[2]
                                       ? arguments[2]
                                       : 255;
                              return Math.min(Math.max(e, t), n);
                           })(n, i, r)),
                              (this.config.speed.selected = n),
                              setTimeout(function () {
                                 t.media.playbackRate = n;
                              }, 0);
                        },
                        get: function () {
                           return Number(this.media.playbackRate);
                        },
                     },
                     {
                        key: "minimumSpeed",
                        get: function () {
                           return this.isYouTube
                              ? Math.min.apply(Math, Ao(this.options.speed))
                              : this.isVimeo
                              ? 0.5
                              : 0.0625;
                        },
                     },
                     {
                        key: "maximumSpeed",
                        get: function () {
                           return this.isYouTube
                              ? Math.max.apply(Math, Ao(this.options.speed))
                              : this.isVimeo
                              ? 2
                              : 16;
                        },
                     },
                     {
                        key: "quality",
                        set: function (e) {
                           var t = this.config.quality,
                              n = this.options.quality;
                           if (n.length) {
                              var i = [
                                    !nu(e) && Number(e),
                                    this.storage.get("quality"),
                                    t.selected,
                                    t.default,
                                 ].find(Wc),
                                 r = !0;
                              if (!n.includes(i)) {
                                 var a = (function (e, t) {
                                    return Gc(e) && e.length
                                       ? e.reduce(function (e, n) {
                                            return Math.abs(n - t) <
                                               Math.abs(e - t)
                                               ? n
                                               : e;
                                         })
                                       : null;
                                 })(n, i);
                                 this.debug.warn(
                                    "Unsupported quality option: "
                                       .concat(i, ", using ")
                                       .concat(a, " instead")
                                 ),
                                    (i = a),
                                    (r = !1);
                              }
                              (t.selected = i),
                                 (this.media.quality = i),
                                 r && this.storage.set({ quality: i });
                           }
                        },
                        get: function () {
                           return this.media.quality;
                        },
                     },
                     {
                        key: "loop",
                        set: function (e) {
                           var t = $c(e) ? e : this.config.loop.active;
                           (this.config.loop.active = t), (this.media.loop = t);
                        },
                        get: function () {
                           return Boolean(this.media.loop);
                        },
                     },
                     {
                        key: "source",
                        set: function (e) {
                           lf.change.call(this, e);
                        },
                        get: function () {
                           return this.media.currentSrc;
                        },
                     },
                     {
                        key: "download",
                        get: function () {
                           var e = this.config.urls.download;
                           return tu(e) ? e : this.source;
                        },
                        set: function (e) {
                           tu(e) &&
                              ((this.config.urls.download = e),
                              wh.setDownloadUrl.call(this));
                        },
                     },
                     {
                        key: "poster",
                        set: function (e) {
                           this.isVideo
                              ? Rh.setPoster
                                   .call(this, e, !1)
                                   .catch(function () {})
                              : this.debug.warn(
                                   "Poster can only be set for video"
                                );
                        },
                        get: function () {
                           return this.isVideo
                              ? this.media.getAttribute("poster")
                              : null;
                        },
                     },
                     {
                        key: "ratio",
                        get: function () {
                           if (!this.isVideo) return null;
                           var e = Du(qu.call(this));
                           return Gc(e) ? e.join(":") : e;
                        },
                        set: function (e) {
                           this.isVideo
                              ? Kc(e) && Fu(e)
                                 ? ((this.config.ratio = e), Hu.call(this))
                                 : this.debug.error(
                                      "Invalid aspect ratio specified (".concat(
                                         e,
                                         ")"
                                      )
                                   )
                              : this.debug.warn(
                                   "Aspect ratio can only be set for video"
                                );
                        },
                     },
                     {
                        key: "autoplay",
                        set: function (e) {
                           var t = $c(e) ? e : this.config.autoplay;
                           this.config.autoplay = t;
                        },
                        get: function () {
                           return Boolean(this.config.autoplay);
                        },
                     },
                     {
                        key: "currentTrack",
                        set: function (e) {
                           Sh.set.call(this, e, !1);
                        },
                        get: function () {
                           var e = this.captions,
                              t = e.toggled,
                              n = e.currentTrack;
                           return t ? n : -1;
                        },
                     },
                     {
                        key: "language",
                        set: function (e) {
                           Sh.setLanguage.call(this, e, !1);
                        },
                        get: function () {
                           return (Sh.getCurrentTrack.call(this) || {})
                              .language;
                        },
                     },
                     {
                        key: "pip",
                        set: function (e) {
                           if (Iu.pip) {
                              var t = $c(e) ? e : !this.pip;
                              Yc(this.media.webkitSetPresentationMode) &&
                                 this.media.webkitSetPresentationMode(
                                    t ? Ah : xh
                                 ),
                                 Yc(this.media.requestPictureInPicture) &&
                                    (!this.pip && t
                                       ? this.media.requestPictureInPicture()
                                       : this.pip &&
                                         !t &&
                                         document.exitPictureInPicture());
                           }
                        },
                        get: function () {
                           return Iu.pip
                              ? nu(this.media.webkitPresentationMode)
                                 ? this.media ===
                                   document.pictureInPictureElement
                                 : this.media.webkitPresentationMode === Ah
                              : null;
                        },
                     },
                  ],
                  [
                     {
                        key: "supported",
                        value: function (e, t, n) {
                           return Iu.check(e, t, n);
                        },
                     },
                     {
                        key: "loadSprite",
                        value: function (e, t) {
                           return dh(e, t);
                        },
                     },
                     {
                        key: "setup",
                        value: function (t) {
                           var n =
                                 arguments.length > 1 && void 0 !== arguments[1]
                                    ? arguments[1]
                                    : {},
                              i = null;
                           return (
                              Kc(t)
                                 ? (i = Array.from(
                                      document.querySelectorAll(t)
                                   ))
                                 : Xc(t)
                                 ? (i = Array.from(t))
                                 : Gc(t) && (i = t.filter(Qc)),
                              nu(i)
                                 ? null
                                 : i.map(function (t) {
                                      return new e(t, n);
                                   })
                           );
                        },
                     },
                  ]
               ),
               e
            );
         })();
      return (uf.defaults = ((cf = Eh), JSON.parse(JSON.stringify(cf)))), uf;
   });
//# sourceMappingURL=plyr.polyfilled.js.map
