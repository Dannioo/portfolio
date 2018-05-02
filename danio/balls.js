<canvas id="my_canvas" style="width: 100%; height: 300px border:1px solid #d3d3d3;">
			Your browser does not support the HTML5 canvas tag.
		</canvas>
		<script type="text/javascript">
			var canvas = document.getElementById("my_canvas");
			var c = canvas.getContext("2d");
			var c_width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

			var timer;
			var count = 0;

			//create the container that will hold the boincing balls.
			var container = {
			  x: 0,
			  y: 0,
			  width: 300,
			  height: 200
			};
			//create the array of circles that will be animated
			var circles = [{
			  x: 50,
			  y: 100,
			  r: 10,
			  vx: 2,
			  vy: 2,
			  color: 125
			}, {
			  x: 150,
			  y: 80,
			  r: 20,
			  vx: 1,
			  vy: 2,
			  color: 205
			}, {
			  x: 90,
			  y: 150,
			  r: 5,
			  vx: 3,
			  vy: 1,
			  color: 25
			}, {
			  x: 100,
			  y: 50,
			  r: 15,
			  vx: 4,
			  vy: 4,
			  color: 100
			}];

			document.addEventListener("mousedown", function(){
			     timer=setInterval(function(){
			        document.getElementById("testdiv").innerHTML = count++;
			        //function scramble(event){
						mouse_x = event.clientX;
						mouse_y = event.clientY;

						for (var i = 0; i < circles.length; i++) {
							if (circles[i].x < mouse_x){
								circles[i].x += 1;
							} else if (circles[i].x > mouse_x){
								circles[i].x -= 1;
							}
							else {

							}
							if (circles[i].y < mouse_y){
								circles[i].y += 1;
							} else if (circles[i].y > mouse_y){
								circles[i].y -= 1;
							}
							else {

							}
						}
					//}
			     }, 100); // the above code is executed every 100 ms
			});
			// function scramble(event){
			// 	mouse_x = event.clientX;
			// 	mouse_y = event.clientY;

			// 	for (var i = 0; i < circles.length; i++) {
			// 		if (circles[i].x < mouse_x){
			// 			circles[i].x += 1;
			// 		} else if (circles[i].x > mouse_x){
			// 			circles[i].x -= 1;
			// 		}
			// 		else {

			// 		}
			// 		if (circles[i].y < mouse_y){
			// 			circles[i].y += 1;
			// 		} else if (circles[i].y > mouse_y){
			// 			circles[i].y -= 1;
			// 		}
			// 		else {

			// 		}
			// 	}
			// }

			function animate() {
				//draw the container
				c.fillStyle = "#ffffff";
				c.fillRect(container.x, container.y, container.width, container.height);

				//loop throughj the circles array
				for (var i = 0; i < circles.length; i++) {
				    //draw the circles
				    c.fillStyle = 'hsl(' + circles[i].color++ + ', 100%, 50%)';
				    c.beginPath();
				    c.arc(circles[i].x, circles[i].y, circles[i].r, 0, Math.PI * 2, true);
				    c.fill();
				    c.stroke();

				    //animation
				    if (circles[i].x - circles[i].r + circles[i].vx < container.x){ //left bound
				    	circles[i].vx = -circles[i].vx;
				    }
				    if (circles[i].x + circles[i].r + circles[i].vx > container.x + container.width) { //right bound
				    	circles[i].vx = -circles[i].vx;
				    }

				    if ((circles[i].y + circles[i].r + circles[i].vy) > (container.y + container.height)){ //bottom bound
						circles[i].vy = -circles[i].vy;
				    }
				    if (circles[i].y - circles[i].r + circles[i].vy < container.y) { //top bound
				    	circles[i].vy = -circles[i].vy;
				    }
				    circles[i].x += circles[i].vx
				    circles[i].y += circles[i].vy
				}
				requestAnimationFrame(animate);
			}
			document.addEventListener("mouseup", function(){
			    if (timer) clearInterval(timer)
			});
			requestAnimationFrame(animate);