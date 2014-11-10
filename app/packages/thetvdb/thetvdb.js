TheTVDB = {};

TheTVDB.getMirrors = function(){
//http://thetvdb.com/api/<apikey>/mirrors.xml.
  if (!Meteor.settings.theTvdbApiKey){
    throw new Meteor.Error(500, 'Missing key');
  }
  var uri = "http://thetvdb.com/api/" + Meteor.settings.theTvdbApiKey + "/mirrors.xml";
  Meteor.http.get(uri, {}, function(err, res){
    if (err) {
      throw new Meteor.Error(500, 'Bad mirrors response');
    }
    xml2js.parseString(res.content, function (err, res){
      if (err){
        throw new Meteor.Error(500, 'Unable to parse mirrors');
      }
      return res.Mirrors.Mirror;
    });
  });
};