define(function() {

	var Enemy = function(rect){

		this.el = $('<div class="enemy"></div>');

		this.rect = rect;
		this.rect.right = rect.x + rect.width;
		this.radius = 25;

		this.el.css({
      		left: rect.x,
      		top: rect.y,
      		width: rect.width,
      		height: rect.height
   		 });

	};

	Enemy.prototype.setEnemy = function(rect)
	{

		this.rect = rect;
		this.rect.right = rect.x + rect.width;

		this.el.show();

		this.el.css({
	    left: rect.x,
	    top: rect.y,
	    width: rect.width,
	    height: rect.height
	    });

	};

	return Enemy;
});