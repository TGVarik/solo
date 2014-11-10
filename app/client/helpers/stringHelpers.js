/**
 * Created by tom on 10/14/14.
 */
Template.registerHelper('siteTitle', function(string){
  return SEO.settings.title;
});

Template.registerHelper('pronunciationGuide', function(string){
  return '/ˈpɔr·tə·tɪv/';
});

Template.registerHelper('summarize', function(string){
  var clanString = _(string).stripTags();
  return _(cleanString).truncate(140);
});