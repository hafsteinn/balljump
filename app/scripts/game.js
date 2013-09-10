/*global define, $ */

define(['controls' , 'player', 'platforms', 'enemy'], function(Controls, Player, platform, Enemy) {
  /**
   * Main game class.x
   * @param {Element} el DOM element containig the game.
   * @constructor
   */

   var VIEWPORT_PADDING = 100;

  var Game = function(el) {
    this.el = el;
    this.player = new Player(this.el.find('.player'), this);
    this.platformsEl = el.find('.platform');
    this.enemiesEl = el.find('.enemy');
    this.worldEl = el.find('.world');
    this.scoreEl = el.find('.score');
    this.menu = el.find('.gameOver');
    this.startScreen = el.find('.startScreen');
    this.viewportchanged = false;
    this.platformsadded = 0;
    this.highestplatform = 0;
    this.enemiesadded = 0;
    this.highestenemy = 0;
    this.isPlaying = false;
    this.nickNames = [];


    this.platforms = [];
    this.entities = [];

    $(".gameOver").hide();




    // Cache a bound onFrame since we need it each frame.
    this.onFrame = this.onFrame.bind(this);


  };

  Game.prototype.freezeGame = function() {
    this.isPlaying = false;
  };

  Game.prototype.unFreezeGame = function() {
    if (!this.isPlaying) {
      this.isPlaying = true;

      // Restart the onFrame loop
      this.lastFrame = +new Date() / 1000;
      requestAnimFrame(this.onFrame);
    }
  };

    Game.prototype.initialStart = function() {

      var game = this;

      this.freezeGame();
    
    $(".startScreen").slideDown('slow');
        $(".score").hide(); 
    


    $('.startButton').click(function() {
      $(".startScreen").hide();
      $(".score").slideDown('slow');
      game.getNick();
      setTimeout(function() { 

        game.reStart(); 
      }, 0);
    });
  };


  Game.prototype.gameOver = function() { 

    var currentScore = -1 * (Math.ceil(this.viewport.y));

    var currentNick = document.getElementById('playerNickName').value;

    $('.playerName').html(currentNick);

    this.freezeGame(); 
    $(".score").hide(); 
    $(".gameOver").slideDown('slow');

    var game = this;


    $('.displayScore').html(currentScore);

    $('.gameOverButton').click(function() {
      setTimeout(function() { 

        game.reStart(); 
      }, 0);

      $(".gameOver").hide(); 
      $(".score").slideDown('slow');

    });
  };

    Game.prototype.forEachPlatform = function(handler) {
      this.platforms.forEach(handler);
   };

   Game.prototype.forEachEnemy = function(handler) {
    this.entities.forEach(handler);
   };



  	Game.prototype.createWorld = function(){

      this.initialStart();

  		this.createPlatforms();

  	};

    Game.prototype.createEnemies = function(xCoordinate, yCoordinate){

 
        this.addEnemy(new Enemy({
          x: xCoordinate,
          y: yCoordinate,
          width: 50,
          height: 50
        }));

    };

    Game.prototype.createGround = function(){
            this.addPlatform(new platform({
        x: -10,
        y: 560,
        width:520,
        height:0
      }));
    };

    function randomGenerator() {

      return ((Math.ceil(Math.random() * 3389)) % 8 === 0);

    };

    Game.prototype.createPlatforms = function(){
      this.createGround();


        //fill up our platform array, and then reuse existing platform elements.
        for(var i = 0; i < 9; i++)
        {
          var xCoordinate;
          var yCoordinate = 400 - i*150;

          var shouldMove = randomGenerator();
          var containsShoe = randomGenerator();

          if(shouldMove)
            xCoordinate = 0;
          else
            xCoordinate = (Math.random() * 3389) % 300;


          this.addPlatform(new platform({
            x: xCoordinate,
            y: yCoordinate,
            width: 100,
            height: 50
            }, shouldMove));

        /*  if(containsShoe && !shouldMove)
          {
            this.createEnemies(xCoordinate + 25, yCoordinate);
          } */

        }
        //the platform array now contains 10 elements

        this.highestplatform = this.platforms[9].rect.y;
  };




  Game.prototype.addPlatform = function(platform) {

      this.platformsEl.append(platform.el);
      
      this.platforms.push(platform);
  };

  Game.prototype.addEnemy = function(enemy) {

    this.enemiesEl.append(enemy.el);
    this.entities.push(enemy);

    if(this.entities.length === 10)
      this.highestenemy = this.entities[9].rect.y;

  };
  /**
   * Runs every frame. Calculates a delta and allows each game entity to update itself.
   */
  Game.prototype.onFrame = function() {

    if (!this.isPlaying) {
      return;
    }


    var currentScore = -1* (Math.ceil(this.viewport.y));
    $('.score').html(currentScore);


    var now = +new Date() / 1000,
        delta = now - this.lastFrame;
    this.lastFrame = now;

    Controls.onFrame(delta);

    this.player.onFrame(delta);

    for(var i = 0 ; i < 10 ; i++)
    {
      if(this.platforms[i].isMoving)
        this.platforms[i].onFrame(delta);
    }

    this.updateViewport();
    
    this.reusePlatforms();

    // Request next frame.
    requestAnimFrame(this.onFrame);

  };


  Game.prototype.reusePlatforms = function() {

    if(this.viewport.y < this.highestplatform)
    {
      //reuse 6 existing platforms to create new platforms

      for(var i = 0; i < 6 ; this.platformsadded++, i++)
      {
        var xCoordinate;
        var yCoordinate = this.highestplatform - i*150 - 150;
        var shouldMove = randomGenerator();
        var containsShoe = randomGenerator();
        
        if(shouldMove)
          xCoordinate = 0;

        else
          xCoordinate = (Math.random() * 3389) % 300;

        this.platforms[(this.platformsadded) % 10].setPlatform({x: xCoordinate , y: yCoordinate, width: 100, height: 50}, shouldMove);


      if(containsShoe && !shouldMove) //the platform should contain a shoe 
      {
        if(this.highestenemy === 0) //our entities array is not full
          this.createEnemies(xCoordinate + 25, yCoordinate);

        else //reuse existing enemy elements
        {
          this.entities[(this.enemiesadded) % 10].setEnemy({x : xCoordinate + 25, y: yCoordinate, width: 50, height: 50});
          this.enemiesadded++;
          this.highestenemy = this.entities[(this.enemiesadded % 10)].rect.y; 
        }

      }

        if(i === 5) //save our new highest platform
        {
          this.highestplatform = this.platforms[(this.platformsadded) % 10].rect.y;
        }
      }
    }

  };

   /**
	* Updates viewport
  	*/
	Game.prototype.updateViewport = function() {
    var minY = this.viewport.y + VIEWPORT_PADDING;


    var oldY = this.viewport.y;

    var playerY = this.player.pos.y;

    // Update the viewport if needed.
    if (playerY < minY) {
      this.viewport.y = playerY - VIEWPORT_PADDING;
    } 

    this.worldEl.css({
      top: -this.viewport.y
    });

    this.scoreEl.css({
      top: this.viewport.y
    });

    this.menu.css({
      top: this.viewport.y
    });

    this.startScreen.css({
      top: this.viewport.y
    });

  };




  /**
   * Starts the game.
   */
  Game.prototype.start = function() {


    // Restart the onFrame loop
    this.lastFrame = +new Date() / 1000;
    this.viewport = {x: 100, y: 0, width: 800, height: 600};
    this.score = {x: 100, y: 20, width: 120, height: 50};
    // Cleanup last game.
    //this.entities.forEach(function(e) { e.el.remove(); });
    this.platforms=[];
    this.entities = [];

    this.player.reset();
    this.createWorld();

    //requestAnimFrame(this.onFrame);
    this.unFreezeGame();
  };

  Game.prototype.reStart = function(){

    this.viewport = {x: 100, y: 0, width: 800, height: 600};
    this.platformsadded = 0;
    this.enemiesadded = 0;
    this.highestenemy = 0;

    this.player.reset();

    this.entities.forEach(function(enemy)
    {
      enemy.el.remove();
    });
    //this.platforms = [];

    //this.createWorld();

    //this.createGround();

    this.platforms[0].setPlatform({
              x: -10,
              y: 560,
              width:520,
              height:0
          }, false);

    for(var i = 0; i < 9;i++)
    {
      var xCoordinate;
      var shouldMove = randomGenerator();

      if(shouldMove)
          xCoordinate = 0;

        else
          xCoordinate = (Math.random() * 3389) % 300;

      this.platforms[i + 1].setPlatform({x: xCoordinate,
            y: 400 - i*150,
            width: 100,
            height: 50 }, shouldMove)  
    }

    this.highestplatform = this.platforms[9].rect.y; 
    
    this.unFreezeGame();
  };


  /**
   * Cross browser RequestAnimationFrame
   */
  var requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function */ callback) {
          window.setTimeout(callback, 1000 / 60);
        };
  })();

  
  return Game;
});