Checkins = new Meteor.Collection('checkins');
Series = new Meteor.Collection('series');

Checkins.before.insert(function(userId, doc){
  doc.createdAt = moment().toDate();
});


