/**
 * Created by tom on 10/13/14.
 */
if (Checkins.find().count() === 0) {
  Checkins.insert({
    showName: 'Downton Abbey',
    identifier: 'S05E01',
    timestamp: '2014-10-12'
  });

  Checkins.insert({
    showName: 'Homeland',
    identifier: 'S02E03',
    timestamp: '2014-10-11'
  });

  Checkins.insert({
    showName: 'Star Trek: Voyager',
    identifier: 'S05E13',
    timestamp: '2014-10-10'
  });
}