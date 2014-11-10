var Promise = require('bluebird');
var moment = require('moment');
var Mongo = require('mongodb');
Mongo.MongoClient.connectPromise = Promise.promisify(Mongo.MongoClient.connect);
Mongo.Collection.prototype.insertPromise = Promise.promisify(Mongo.Collection.prototype.insert);
var mongo = Mongo.MongoClient;
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'tvdb'
  }
});

var imagePath = 'http://thetvdb.com/banners/';

mongo.connectPromise('mongodb://127.0.0.1:3001/meteor')
    .then(function (db) {
      var sc = db.collection('series');

      var getSearchableNamesPromise = function (series) {
        return Promise.all(knex.select('name').from('aka_seriesname').where('id', series.id).andWhere('languageid', 7).map(function (row) {
          return row.name;
        }));
      };

      var getActorsPromise = function (series) {
        return Promise.all(knex.select('Name', 'Role', 'Image').from('seriesactors').where('SeriesID', series.id).orderBy('SortOrder', 'asc').map(function (row) {
          var a = {};
          if (row.Name) a.name = row.Name;
          if (row.Role) a.role = row.Role;
          if (row.Image) a.imageUrl = imagePath + row.Image;
          return a;
        }));
      };

      var getSeasonBannerPromise = function (series, season) {
        return knex.select('filename').from('banners').where('keytype', 'season').andWhere('keyvalue', series.id).andWhere('subkey', season.seasonNum).reduce(function (memo, row) {
          if (memo === '') {
            return row.filename;
          } else {
            return memo;
          }
        }, '');
      };

      var getEpisodesPromise = function (series, season) {
        return Promise.all(knex.select('EpisodeNumber', 'EpisodeName', 'FirstAired', 'GuestStars', 'Director', 'Writer', 'Overview', 'ProductionCode', 'filename').from('tvepisodes').where('seriesid', series.id).andWhere('seasonid', season.id).orderBy('EpisodeNumber', 'asc').map(function (row) {
          var e = {};
          if (row.EpisodeNumber) e.episodeNum = row.EpisodeNumber;
          if (row.EpisodeName) e.episodeName = row.EpisodeName;
          if (row.FirstAired) e.firstAired = moment(row.FirstAired).toDate();
          if (row.GuestStars) e.guestStars = row.GuestStars.replace(/^\||\|$/g, '').split('|');
          if (row.Director) e.directors = row.Director.replace(/^\||\|$/g, '').split('|');
          if (row.Writer) e.writers = row.Writer.replace(/^\||\|$/g, '').split('|');
          if (row.Overview) e.overview = row.Overview;
          if (row.ProductionCode) e.productionCode = row.ProductionCode;
          if (row.filename) e.imageUrl = imagePath + row.filename;
          return e;
        }));
      };

      var getSeasonsPromise = function (series) {
        return Promise.all(knex.select('season', 'id').from('tvseasons').where('seriesid', series.id).map(function (row) {
          var n = {};
          if (row.season) n.seasonNum = row.season;
          n.imageUrl = getSeasonBannerPromise(series, row).tap(function(){ console.log('Banner for', series.SeriesName, 'season', row.season, 'resolved')});
          n.episodes = getEpisodesPromise(series, row).tap(function(){ console.log('Episodes for', series.SeriesName, 'season', row.season, 'resolved')});
          return Promise.props(n);
        }));
      };

      var getSeriesPromise = function () {
        return Promise.all(knex.select('id', 'SeriesName', 'Status', 'FirstAired', 'Network', 'Runtime', 'Genre', 'Actors', 'Overview', 'Airs_DayOfWeek', 'Airs_Time', 'Rating').where('disabled', 'no').from('tvseries').map(function (row) {
          if (row.id && row.SeriesName) {
            var s = {};
            if (row.id) s.tvdbId = row.id;
            if (row.SeriesName) s.canonicalName = row.SeriesName;
            s.searchableNames = getSearchableNamesPromise(row).then(function (searchableNames) {
              console.log('Searchable names for', s.canonicalName, 'resolved');
              searchableNames.shift(s.canonicalName);
              return searchableNames;
            });
            if (row.Status) s.status = row.Status;
            if (row.FirstAired) s.firstAired = moment(row.FirstAired).toDate();
            if (row.Network) s.network = row.Network;
            if (row.Runtime) s.runtime = row.Runtime;
            s.actors = getActorsPromise(row).tap(function(a){console.log('Actors for', s.canonicalName, 'resolved')});
            s.seasons = getSeasonsPromise(row).tap(function(a){console.log('Seasons for', s.canonicalName, 'resolved')});
            console.log(s.canonicalName, 'promised');
            return Promise.props(s).then(function (s) {
                  console.log(s.canonicalName, 'resolved');
                  return sc.insertPromise(s).tap(function (s) {
                    console.log(s[0].canonicalName, 'inserted');
                  })
                });
          } else {
            return null;
          }
        }));
      };
  getSeriesPromise()
      .then(function(results){
        console.log(results.length, 'inserted');
        db.close();
      })
      .catch(function(err){
        throw err;
      });

    });

