/**
 * Created by tom on 10/14/14.
 */
Meteor.startup(function(){
  AccountsEntry.config({
    homeRoute: '/',
    dashboardRoute: 'checkins',
    profileRoute: 'profile',
    passwordSignupFields: 'EMAIL_ONLY',
    showSignupCode: false,
    showOtherLoginServices: true,
    extraSignUpFields: [
      {
        field: 'firstName',
        placeholder: 'first name',
        type: 'text',
        required: 'true'
      },
      {
        field: 'lastName',
        placeholder: 'last name',
        type: 'text',
        required: 'true'
      }
    ]

  })
});