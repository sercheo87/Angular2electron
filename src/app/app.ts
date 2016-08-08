import {Component} from 'angular2/core';
var path = require('path');

@Component({
  selector: 'sb-app',
  templateUrl: 'app/app.html'
})

export class Application {
  onSave(event: KeyboardEvent) {
    let myNotification: Notification;
    let evtMsg = ' Event target is ';
    window.alert('Saved.' + evtMsg);
    var options = [
      {
        title: "Basic Notification",
        body: "Short message part"
      },
      {
        title: "Content-Image Notification",
        body: "Short message plus a custom content image",
        icon: path.join(__dirname, 'images/icon.png')
      }
    ];
    myNotification(options[1].title, options[1]);
  }
}