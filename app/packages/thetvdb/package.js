Package.describe({
  summary: "TheTVDB API package"
});

Package.on_use(function (api) {
  api.add_files('thetvdb.js', 'server');
  if(api.export)
    api.export('TheTVDB');
});