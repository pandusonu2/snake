$(document).ready(function(){
	var canvas = $("#canvas")[0];
	canvas.width = window.innerWidth-20;
	canvas.height = window.innerHeight-20;
	var ctx = canvas.getContext("2d");
	var w = $("canvas").width(); //$("canvas").width
	var h = $("canvas").height();
	high_score=0
	var cw = 15; //change this, size of box
	var d;
	var food;
	var score;
	var snake_array; //an array of cells to make up the snake
	
	function init(){
		d="R";
		create_snake();
		create_food();

		score=0;

		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 120-score);
	}
	init();

	function create_snake(){
		var length = 5; //Length of the snake
		snake_array = []; //Empty array to start with
		for(var i = length-1; i>=0; i--)
		{
			//This will create a horizontal snake starting from the top left
			snake_array.push({x:i, y:2});
		}
	}

	function create_food(){
		food={
			x: Math.round(Math.random()*(w-cw)/cw),
			y: Math.round(Math.random()*(h-cw)/cw),
		};
	}

	function paint(){
		ctx.fillStyle = "white";
		ctx.fillRect(0,0,w,h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0,0,w,h);
		
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;

		if(d == "R") nx++;
		else if(d == "L") nx--;
		else if(d == "U") ny--;
		else if(d == "D") ny++;

		if(nx == -1 || nx >= w/cw-1 || ny == -1 || ny >= h/(cw)-1 || check_collision(nx, ny, snake_array))
		{
			clearInterval(game_loop);
			game_loop = setInterval(paint, 120);
			init();
			return;
		}

		if(nx == food.x && ny == food.y)
		{
			var tail = {x: nx, y: ny};
			score++;
			clearInterval(game_loop);
			game_loop = setInterval(paint, 120-(10*score));
			create_food();
		}
		else
		{
			var tail = snake_array.pop();
			tail.x = nx; tail.y = ny;
		}

		snake_array.unshift(tail);

		for(var i=0;i<snake_array.length;i++)
			paint_snake(snake_array[i].x,snake_array[i].y);

		paint_food(food.x,food.y);
		ctx.font = "20px Georgia";
		if(score > high_score)high_score = score;
		var score_text = "score : " + score;
		ctx.fillText(score_text, 150, h-5);

		var high_score_text = "High score : " + high_score;
		ctx.fillText(high_score_text, 5, h-5);
	}

	function paint_snake(x, y){
		ctx.fillStyle = "black";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}

	function paint_food(x, y){
		var gradient=ctx.createLinearGradient(0,0,170,0);
		gradient.addColorStop("0","magenta");
		gradient.addColorStop("0.5","blue");
		gradient.addColorStop("1.0","red");

		ctx.fillStyle = gradient;
		ctx.fillRect(x*cw, y*cw, cw, cw);

		ctx.strokeStyle="red";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}

	function check_collision(x, y, array)
	{
		for(var i = 0; i < array.length; i++)
			if(array[i].x == x && array[i].y == y)
				return true;
		return false;
	}

	$(document).keydown(function(e){
		var key = e.which;
		if(key == "37" && d != "R") d = "L";
		else if(key == "38" && d != "D") d = "U";
		else if(key == "39" && d != "L") d = "R";
		else if(key == "40" && d != "U") d = "D";
	})
});