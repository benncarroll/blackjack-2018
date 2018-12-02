<template>
<div id="app">

  <div class="loading-overlay" id='loader'></div>

  <div class="overlay-padding">
    <div class="overlay-box">
      <p>Your screen size is too small to play Blackjack!</p>
      <p>Try it on a different screen or if on a mobile device, flip horizontally.</p>
    </div>
  </div>

  <div class="pyro-box" v-bind:class="{clear: !playerHasWon, hide: $route.name != 'game'}">
    <canvas id="pyro" class="max">Canvas is not supported in your browser.</canvas>
  </div>

  <router-view class="max" tag="div" v-on:playerWin="startFireworks" v-on:reset="stopFireworks" />

</div>
</template>

<script>
import Game from './components/Game.vue'

export default {
  name: 'app',
  components: {
    Game
  },
  mounted() {

    var initialWidth, initialHeight, result;

    function setInitialWidths() {
      if (!window.location.href.includes('play')) {
        initialWidth = document.getElementById('center-box').clientWidth
        initialHeight = document.getElementById('center-box').clientHeight
        result = 0;
      }
    }
    setInitialWidths()
    var zoomAdjustInterval = setInterval(function() {
      if (!window.location.href.includes('play')) {
        document.getElementsByTagName('body')[0].style.zoom = 1;

        if (initialWidth == undefined) {
          setInitialWidths()
        }

        if (window.innerWidth > window.innerHeight * 1.2) {
          result = 0.7 * window.innerHeight / (Math.round(initialHeight / 5) * 5);
        } else {
          result = 0.8 * window.innerWidth / (Math.round(initialWidth / 5) * 5);
        }

        document.getElementById('center-box').style.zoom = result
      } else {
        // clearInterval(zoomAdjustInterval)
        document.getElementsByTagName('body')[0].style.zoom = 1.3
      }
    }, 200)

    setTimeout(function() {
      var elem = document.getElementById('loader')
      elem.classList.add('clear')
      setTimeout(function() {
        elem.parentNode.removeChild(elem);
      }, 2000);
    }, 500);


    window.fireworksLoopRunning = false;

    // when animating on canvas, it is best to use requestAnimationFrame instead of setTimeout or setInterval
    // not supported in all browsers though and sometimes needs a prefix, so we need a shim
    window.requestAnimFrame = (function() {
      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
    })();

    // now we will setup our basic variables for the demo
    var canvas = document.getElementById('pyro'),
      ctx = canvas.getContext('2d'),
      // full screen dimensions
      cw = window.innerWidth,
      ch = window.innerHeight,
      // firework collection
      fireworks = [],
      // particle collection
      particles = [],
      // starting hue
      hue = 120,
      // when launching fireworks with a click, too many get launched at once without a limiter, one launch per 5 loop ticks
      limiterTotal = 5,
      limiterTick = 0,
      // this will time the auto launches of fireworks, one launch per 80 loop ticks
      timerTotal = 10,
      timerTick = 0,
      mousedown = false,
      // mouse x coordinate,
      mx,
      // mouse y coordinate
      my;

    // set canvas dimensions
    canvas.width = cw;
    canvas.height = ch;

    // now we are going to setup our function placeholders for the entire demo

    // get a random number within a range
    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    // calculate the distance between two points
    function calculateDistance(p1x, p1y, p2x, p2y) {
      var xDistance = p1x - p2x,
        yDistance = p1y - p2y;
      return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    }

    // create firework
    function Firework(sx, sy, tx, ty) {
      // actual coordinates
      this.x = sx;
      this.y = sy;
      // starting coordinates
      this.sx = sx;
      this.sy = sy;
      // target coordinates
      this.tx = tx;
      this.ty = ty;
      // distance from starting point to target
      this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
      this.distanceTraveled = 0;
      // track the past coordinates of each firework to create a trail effect, increase the coordinate count to create more prominent trails
      this.coordinates = [];
      this.coordinateCount = 3;
      // populate initial coordinate collection with the current coordinates
      while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
      }
      this.angle = Math.atan2(ty - sy, tx - sx);
      this.speed = 2;
      this.acceleration = 1.05;
      this.brightness = random(50, 70);
      // circle target indicator radius
      this.targetRadius = 0;
    }

    // update firework
    Firework.prototype.update = function(index) {
      // remove last item in coordinates array
      this.coordinates.pop();
      // add current coordinates to the start of the array
      this.coordinates.unshift([this.x, this.y]);

      // cycle the circle target indicator radius
      // if (this.targetRadius < 8) {
      //   this.targetRadius += 0.3;
      // } else {
      //   this.targetRadius = 1;
      // }

      // speed up the firework
      this.speed *= this.acceleration;

      // get the current velocities based on angle and speed
      var vx = Math.cos(this.angle) * this.speed,
        vy = Math.sin(this.angle) * this.speed;
      // how far will the firework have traveled with velocities applied?
      this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

      // if the distance traveled, including velocities, is greater than the initial distance to the target, then the target has been reached
      if (this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.tx, this.ty);
        // remove the firework, use the index passed into the update function to determine which to remove
        fireworks.splice(index, 1);
      } else {
        // target not reached, keep traveling
        this.x += vx;
        this.y += vy;
      }
    }

    // draw firework
    Firework.prototype.draw = function() {
      ctx.beginPath();
      // move to the last tracked coordinate in the set, then draw a line to the current x and y
      ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
      ctx.stroke();

      // ctx.beginPath();
      // // draw the target for this firework with a pulsing circle
      // ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
      // ctx.stroke();
    }

    // create particle
    function Particle(x, y) {
      this.x = x;
      this.y = y;
      // track the past coordinates of each particle to create a trail effect, increase the coordinate count to create more prominent trails
      this.coordinates = [];
      this.coordinateCount = 5;
      while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
      }
      // set a random angle in all possible directions, in radians
      this.angle = random(0, Math.PI * 2);
      this.speed = random(1, 10);
      // friction will slow the particle down
      this.friction = 0.95;
      // gravity will be applied and pull the particle down
      this.gravity = 1;
      // set the hue to a random number +-50 of the overall hue variable
      this.hue = random(hue - 50, hue + 50);
      this.brightness = random(50, 80);
      this.alpha = 1;
      // set how fast the particle fades out
      this.decay = random(0.015, 0.03);
    }

    // update particle
    Particle.prototype.update = function(index) {
      // remove last item in coordinates array
      this.coordinates.pop();
      // add current coordinates to the start of the array
      this.coordinates.unshift([this.x, this.y]);
      // slow down the particle
      this.speed *= this.friction;
      // apply velocity
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed + this.gravity;
      // fade out the particle
      this.alpha -= this.decay;

      // remove the particle once the alpha is low enough, based on the passed in index
      if (this.alpha <= this.decay) {
        particles.splice(index, 1);
      }
    }

    // draw particle
    Particle.prototype.draw = function() {
      ctx.beginPath();
      // move to the last tracked coordinates in the set, then draw a line to the current x and y
      ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
      ctx.stroke();
    }

    // create particle group/explosion
    function createParticles(x, y) {
      // increase the particle count for a bigger explosion, beware of the canvas performance hit with the increased particles though
      var particleCount = 20;
      while (particleCount--) {
        particles.push(new Particle(x, y));
      }
    }

    var hasCleared = false

    function clearCanvas() {
      hasCleared = true
      fireworks = []
      particles = []
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    // main demo loop
    function loop() {
      if (!window.fireworksLoopRunning) {
        if (!hasCleared) {
          clearCanvas()
        }
        setTimeout(loop, 500)
        return;
      }
      hasCleared = false;

      // this function will run endlessly with requestAnimationFrame
      window.requestAnimFrame(loop);

      // increase the hue to get different colored fireworks over time
      // hue += 0.5;

      // create random color
      hue = random(0, 360);

      // normally, clearRect() would be used to clear the canvas
      // we want to create a trailing effect though
      // setting the composite operation to destination-out will allow us to clear the canvas at a specific opacity, rather than wiping it entirely
      ctx.globalCompositeOperation = 'destination-out';
      // decrease the alpha property to create more prominent trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, cw, ch);
      // change the composite operation back to our main mode
      // lighter creates bright highlight points as the fireworks and particles overlap each other
      ctx.globalCompositeOperation = 'lighter';

      // loop over each firework, draw it, update it
      var fLength = fireworks.length;
      while (fLength--) {
        fireworks[fLength].draw();
        fireworks[fLength].update(fLength);
      }

      // loop over each particle, draw it, update it
      var pLength = particles.length;
      while (pLength--) {
        particles[pLength].draw();
        particles[pLength].update(pLength);
      }

      // launch fireworks automatically to random coordinates, when the mouse isn't down
      if (timerTick >= timerTotal) {
        if (!mousedown) {
          // start the firework at the bottom middle of the screen, then set the random target coordinates, the random y coordinates will be set within the range of the top half of the screen
          fireworks.push(new Firework(cw / 2, ch, random(0, cw), random(0, ch / 2)));
          timerTick = 0;
        }
      } else {
        timerTick++;
      }

      // limit the rate at which fireworks get launched when mouse is down
      if (limiterTick >= limiterTotal) {
        if (mousedown) {
          // start the firework at the bottom middle of the screen, then set the current mouse coordinates as the target
          fireworks.push(new Firework(cw / 2, ch, mx, my));
          limiterTick = 0;
        }
      } else {
        limiterTick++;
      }
    }

    // mouse event bindings
    // update the mouse coordinates on mousemove
    canvas.addEventListener('mousemove', function(e) {
      mx = e.pageX - canvas.offsetLeft;
      my = e.pageY - canvas.offsetTop;
    });

    // toggle mousedown state and prevent canvas from being selected
    canvas.addEventListener('mousedown', function(e) {
      e.preventDefault();
      mousedown = true;
    });

    canvas.addEventListener('mouseup', function(e) {
      e.preventDefault();
      mousedown = false;
    });

    loop();

    setTimeout(function() {
      document.getElementsByTagName('body')[0].classList.add('bg');
    }, 1000);
  },
  data() {
    return {
      player_count: 3,
      deck_count: 6,
      dealer_threshold: 17,
      ai_threshold: 16,
      hideAICards: false,

      playerHasWon: false
    }
  },
  methods: {
    startFireworks() {
      this.playerHasWon = true;
      window.fireworksLoopRunning = true;
      document.getElementsByTagName('body')[0].style.backgroundColor = "black";
    },
    stopFireworks() {
      this.playerHasWon = false;
      window.fireworksLoopRunning = false;
      document.getElementsByTagName('body')[0].style.backgroundColor = "rgb(26, 26, 26)";
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,700');
body {
  background-color: #EEEEEE;
  font-family: sans-serif;
  /* zoom: 1.3; */
  background-color: rgb(26, 26, 26);
  font-family: 'Montserrat', sans-serif;
  display: grid;
  grid-template-rows: auto;
  justify-items: center;
}

body, html {
  margin: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  width: 100%;
}

.bg {
  transition: background-color 2s;
}

.loading-overlay {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  background: white;
  transition: opacity 2s;
  opacity: 1;
}

.loading-overlay.clear {
  transition: opacity 2s;
  opacity: 0;
}

.overlay-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80vw;
  height: 80vh;
  padding: 10vh 10vw 10vh 10vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  text-align: center;
}

@media only screen and (min-width: 200px) {
  .overlay-box {
    display: none;
  }
}

.fill {
  width: 100%;
}

.max {
  width: 100%;
  height: 100%;
}

.min-max {
  min-width: 100%;
  min-height: 100%;
}

.flex {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
}

.flex-horizontal {
  flex-direction: row;
}

.flex-vertical {
  flex-direction: column;
}

.m-l-15 {
  margin-left: 15px;
}

.noselect {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.disabled {
  background: rgb(150, 150, 150);
}

.hide {
  display: none;
}

#pyro {
  cursor: crosshair;
  display: block;
}

.boom {
  position: absolute;
  top: 50%;
}

.pyro-box {
  position: absolute;
  padding-top: 80px;
  height: calc(100%-80px)
}

.clear {
  opacity: 0;
  transition: opacity 2s;
}

.noselect {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
