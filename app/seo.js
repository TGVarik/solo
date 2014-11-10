/**
 * Created by tom on 10/14/14.
 */
Meteor.startup(function(){
  if(Meteor.isClient){
    SEO.config({
      title: 'porta.tv',
      meta: {
        'description': 'Remember.'
      },
      og: {
        'image': Meteor.absoluteUrl('share-image.png')
      },
      ignore: {
        meta: ['fragment', 'viewport', 'msapplication-TileColor', 'msapplication-TileImage', 'msapplication-config'],
        link: ['stylesheet', 'apple-touch-icon', 'rel', 'shortcut icon', 'icon']
      }
    });
  }
});