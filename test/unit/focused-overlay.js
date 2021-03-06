module("focused-overlay");

test("ancestor index is reset properly on unfocus", function() {
  var $ = jQuery;
  var overlay = jQuery.focusedOverlay();
  var cDiv = $("#qunit-fixture #focused-overlay .c").get(0);

  overlay.set(cDiv);
  equals(overlay.element.className, 'c');
  overlay.upfocus();
  equals(overlay.ancestor.className, 'b');
  overlay.upfocus();
  equals(overlay.ancestor.className, 'a');
  overlay.unfocus();

  overlay.set(cDiv);
  overlay.upfocus();
  equals(overlay.ancestor.className, 'b');  

  overlay.destroy();
});

test("jQuery.focusedOverlay()", function() {
  var timesCalled = 0;
  var overlay = jQuery.focusedOverlay();

  equals(jQuery(".webxray-overlay").length, 0, "no overlay exists in DOM");

  overlay.on('change', function() { timesCalled++; });
  equals(overlay.element, null, "overlay.element starts out as null");
  equals(overlay.ancestor, null, "overlay.ancestor starts out as null");

  overlay.set(document.body);
  equals(jQuery(".webxray-overlay").length, 1,
         "overlay exists in DOM after set()");
  equals(jQuery(".webxray-overlay-visible").length, 1,
         "overlay is visible after set()");
  equals(jQuery(".webxray-overlay-label-top").text(),
         "<body>", "top label is <body>");
  equals(jQuery(".webxray-overlay-label-bottom").text(),
         "</body>", "bottom label is </body>");

  equals(timesCalled, 1, "'change' event is emit on set()");
  equals(overlay.element, document.body,
         "overlay.element is the currently focused element");
  equals(overlay.ancestor, null, "overlay.ancestor is still null");

  overlay.upfocus();
  equals(timesCalled, 2, "'change' event is emit on upfocus()");
  equals(overlay.ancestor.tagName, "HTML", "ancestor is <html>");
  equals(jQuery(".webxray-ancestor.webxray-overlay-visible").length, 1,
         "ancestor overlay is visible after upfocus()");
  equals(jQuery(".webxray-ancestor .webxray-overlay-label-top").text(),
         "<html>", "top ancestor label is <html>");
  equals(jQuery(".webxray-ancestor .webxray-overlay-label-bottom").text(),
         "</html>", "bottom ancestor label is </html>");

  overlay.downfocus();
  equals(overlay.ancestor, null, "overlay.ancestor is null again");
  equals(timesCalled, 3, "'change' event is emit on downfocus()");

  overlay.unfocus();
  equals(timesCalled, 4, "'change' event is emit on unfocus()");
  equals(overlay.element, null, "overlay.element is null after unfocus()");

  overlay.destroy();

  equals(jQuery(".webxray-overlay").length, 0,
         "no overlay in DOM exists after destroy()");
});
