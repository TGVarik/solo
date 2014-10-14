/**
 * Created by tom on 10/13/14.
 */
Meteor.publish('checkins', function(){
  return Checkins.find();
});