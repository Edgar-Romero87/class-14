'use strict';

module.exports = (capability) => {

  //console.log('this route requires:', capability);
  return (req, res, next) => {
    //does the user have capability
    if(req.user.can(capability)) {
      next();
    }
    else {
      next('No Sopa for you!')
    }
  }

}