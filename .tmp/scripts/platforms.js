/*global define */

define(function() {

  var PLATFORM_SPEED = 100;

  var Platform = function(rect, shouldMove) {
    this.current = 0;
    this.rect = rect;

    this.rect.right = rect.x + rect.width;

    if(shouldMove === undefined)
      this.isMoving = false;

    else
      this.isMoving = shouldMove;

    this.el = $('<div class ="platform">');

    if(this.isMoving)
      this.el.toggleClass("movingPlatform");


    this.el.css({
      left: rect.x,
      top: rect.y,
      width: rect.width,
      height: rect.height
    });

  };


  Platform.prototype.onFrame = function(delta) {

    if(this.isMoving)
      this.move(delta);

  };

  Platform.prototype.move = function(delta) {

    this.duration = 5;

    this.current = (this.current + delta) % this.duration;

    var relPosition = Math.sin((Math.PI * 2) * (this.current / this.duration)) / 2 + 0.5;

    this.rect.x = 0 + (300) * relPosition;
    this.rect.right = this.rect.x + this.rect.width;

    this.el.css('transform', 'translate3d(' + this.rect.x + 'px,' + 0 + 'px,0)');



  };

  Platform.prototype.setPlatform = function(rect, shouldMove){
    this.rect = rect;
    this.rect.right = rect.x + rect.width;

    if(shouldMove !== undefined)
    {
      if(shouldMove !== this.isMoving)
        this.el.toggleClass("movingPlatform");

      this.isMoving = shouldMove;
    }

    //take off all transformations
    this.el.css('transform', 'translate3d(' + 0 + 'px,' + 0 + 'px,0)');
    
    this.el.css({
      left: rect.x,
      top: rect.y,
      width: rect.width,
      height: rect.height
      }); 
  };

  return Platform;
});
