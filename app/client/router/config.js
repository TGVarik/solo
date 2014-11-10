/**
 * Created by tom on 10/14/14.
 */
Router.configure({
  layoutTemplate: 'mainLayout',
  loadingTemplate: 'loading',
  yieldTemplates: {
    header: {
      to: 'header'
    },
    footer: {
      to: 'footer'
    }
  },
  onAfterAction: function(){
    $(document).scrollTop(0);
  }
});

Router.onBeforeAction('loading');