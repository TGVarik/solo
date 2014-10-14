/**
 * Created by tom on 10/13/14.
 */
Template.checkins.helpers({
  checkins: function(){
    return Checkins.find();
  }
});