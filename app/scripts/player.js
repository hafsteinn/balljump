/*global define */

define(['controls'], function(controls) {

  var PLAYER_SPEED = 200;
  var JUMP_VELOCITY = 1300;
  var GRAVITY = 3000;
  var PLAYER_HALF_WIDTH = 25;
  var HELL_Y = 600;

  var Player = function(el, game) {
    this.game = game;
    this.el = el;
    this.deg = 0
    this.movingFast = false;
  };

  Player.prototype.reset = function() {
    this.pos = { x: 10, y: 400 };
    this.vel = { x: 0, y: 0 };
    this.deg = 0;
  };

  Player.prototype.onFrame = function(delta) {
    // Player input
    /*
    if (controls.keys.right) {
      this.vel.x = PLAYER_SPEED;
    } else if (controls.keys.left) {
      this.vel.x = -PLAYER_SPEED;
    } else {
      this.vel.x = 0;
    }
    */
    this.vel.x = controls.inputVec.x * PLAYER_SPEED;

    // Jumping
    if (this.vel.y === 0) {

      this.vel.y = -JUMP_VELOCITY;
      this.movingFast = false;
    }

    // Gravity
    this.vel.y += GRAVITY * delta;

    var oldY = this.pos.y;
    this.pos.x += delta * this.vel.x;
    this.pos.y += delta * this.vel.y;

    if(this.pos.x < -50)
    {
      this.pos.x = 400;
      this.vel.x = 0;
    }
    if(this.pos.x > 400)
    {
      this.pos.x = 0;
      this.vel.x = 0;
    }


    if(this.vel.x < 0)
    {
      this.deg -= 5;
      $('.ball').css('transform', 'rotate('+ this.deg + 'deg)');
    }

    if(this.vel.x > 0)
    {
      this.deg += 5;
      $('.ball').css('transform', 'rotate('+ this.deg + 'deg)');
    }
    
    this.checkPlatforms(oldY);
    this.checkEnemies(oldY);

    this.checkGameOver();

    // Update UI
    this.el.css('transform', 'translate3d(' + this.pos.x + 'px,' + this.pos.y + 'px,0)');

  };

    Player.prototype.checkGameOver = function() {
    if (this.pos.y > HELL_Y || this.pos.y > this.game.viewport.y + this.game.viewport.height) {
      this.game.gameOver();
    }
  };



  Player.prototype.checkPlatforms = function(oldY) {
    var that = this;

    this.game.forEachPlatform(function(p) {
      // Are we crossing Y.
      
      if (p.rect.y >= oldY && p.rect.y < that.pos.y) {
            //alert(that.pos.x);
        // Are inside X bounds.
        if (that.pos.x + PLAYER_HALF_WIDTH >= p.rect.x && that.pos.x - PLAYER_HALF_WIDTH <= p.rect.right) {
          // COLLISION. Let's stop gravity.
          that.pos.y = p.rect.y;
          that.vel.y = 0;

        }
      }
    });
  };

  Player.prototype.checkEnemies = function(oldY) {

    var centerX = this.pos.x;
    var centerY = this.pos.y - 40;
    var that = this;

    this.game.forEachEnemy(function(enemy) {
      // Distance squared
      var distanceX = enemy.rect.x - centerX;
      var distanceY = enemy.rect.y - centerY;

      // Minimum distance squared
      var distanceSq = distanceX * distanceX + distanceY * distanceY;
      var minDistanceSq = (enemy.radius + PLAYER_HALF_WIDTH) * (enemy.radius + PLAYER_HALF_WIDTH);

      // What up?
      if (distanceSq < minDistanceSq && !that.movingFast) {

        enemy.el.hide();
        that.pos.y = enemy.rect.y;
        that.vel.y = -3000;
        that.movingFast = true;
      } 
    
    });
  
  };

  return Player;
});
