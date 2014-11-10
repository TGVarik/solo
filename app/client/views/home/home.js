Template.home.seriesnames = function(){
  return Series.find().fetch().map(function(it){return it.canonicalName;});
};

Template.home.rendered = function(){
  Meteor.typeahead.inject('.typeahead');
};