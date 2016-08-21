System.register("app/app", ["angular2/core"], function($__export) {
  "use strict";
  var Component,
      path,
      Application;
  return {
    setters: [function($__m) {
      Component = $__m.Component;
    }],
    execute: function() {
      path = require('path');
      Application = function() {
        function Application() {}
        return ($traceurRuntime.createClass)(Application, {onSave: function(event) {
            var myNotification;
            var evtMsg = ' Event target is ';
            window.alert('Saved.' + evtMsg);
            var options = [{
              title: "Basic Notification",
              body: "Short message part"
            }, {
              title: "Content-Image Notification",
              body: "Short message plus a custom content image",
              icon: path.join(__dirname, 'images/icon.png')
            }];
            myNotification(options[1].title, options[1]);
          }}, {});
      }();
      $__export("Application", Application);
      Object.defineProperty(Application, "annotations", {get: function() {
          return [new Component({
            selector: 'sb-app',
            templateUrl: 'app/app.html'
          })];
        }});
      Object.defineProperty(Application.prototype.onSave, "parameters", {get: function() {
          return [[KeyboardEvent]];
        }});
    }
  };
});
