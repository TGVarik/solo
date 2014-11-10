/**
 * Created by tom on 10/13/14.
 */
if (Meteor.isClient) {

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    BrowserPolicy.content.allowStyleOrigin("*.typography.com");
    BrowserPolicy.content.allowFontDataUrl();
  });
}