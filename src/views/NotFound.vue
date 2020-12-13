<!--
 @author Daniel Correa <dcorreab@eafit.edu.co>
 Based on http://salehriaz.com/404Page/404.html
-->
<template>
<div class="master404">
  <div class="stars">
    <div class="central-body">
      <img id="image_404" class="image-404" :src="errorSVG">
    </div>
    <div class="objects">
      <img id="object_rocket" class="object_rocket" :src="rocketSVG">
      <div class="earth-moon">
        <img id="object_earth" class="object_earth" :src="earthSVG">
        <img id="object_moon" class="object_moon" :src="moonSVG">
      </div>
      <div class="box_astronaut">
        <img id="object_astronaut" class="object_astronaut" :src="astronautSVG">
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

const svg404 = require('@/assets/img/404.svg') as string;
const svgEarth = require('@/assets/img/earth.svg') as string;
const svgMoon = require('@/assets/img/moon.svg') as string;
const svgAstronaut = require('@/assets/img/astronaut.svg') as string;
const svgRocket = require('@/assets/img/rocket.svg') as string;

@Options({
  watch: {
    $route(to, from) {
      const pageContent = document.getElementById('page-content') as any;
      pageContent.classList.remove('nopad404');

      const pageNavBar = document.getElementById('page-navbar') as any;
      pageNavBar.classList.remove('nomarbo404');
    },
  },
})
export default class NotFound extends Vue {
  public errorSVG:any = svg404;

  public earthSVG:any = svgEarth;

  public moonSVG:any = svgMoon;

  public astronautSVG:any = svgAstronaut;

  public rocketSVG:any = svgRocket;

  public mounted() {
    const objectEarth = document.getElementById('object_earth') as any;
    objectEarth.style.width = '100px';

    const image404 = document.getElementById('image_404') as any;
    image404.style.width = '300px';

    const objectAstronaut = document.getElementById('object_astronaut') as any;
    objectAstronaut.style.width = '140px';

    const objectMoon = document.getElementById('object_moon') as any;
    objectMoon.style.width = '80px';

    const objectRocket = document.getElementById('object_rocket') as any;
    objectRocket.style.width = '40px';

    const pageContent = document.getElementById('page-content') as any;
    pageContent.classList.add('nopad404');

    const pageNavBar = document.getElementById('page-navbar') as any;
    pageNavBar.classList.add('nomarbo404');
  }
}
</script>

<style>
@-moz-keyframes rocket-movement {
  100% {-moz-transform: translate(1200px,-600px);}
}
@-webkit-keyframes rocket-movement {
  100% {-webkit-transform: translate(1200px,-600px); }
}
@keyframes rocket-movement {
  100% {transform: translate(1200px,-600px);}
}
@-moz-keyframes spin-earth {
  100% { -moz-transform: rotate(-360deg); transition: transform 20s;  }
}
@-webkit-keyframes spin-earth {
  100% { -webkit-transform: rotate(-360deg); transition: transform 20s;  }
}
@keyframes spin-earth{
  100% {
    -webkit-transform: rotate(-360deg);
    transform:rotate(-360deg);
    transition: transform 20s;
  }
}

@-moz-keyframes move-astronaut {
  100% { -moz-transform: translate(-160px, -160px);}
}
@-webkit-keyframes move-astronaut {
  100% { -webkit-transform: translate(-160px, -160px);}
}
@keyframes move-astronaut{
  100% { -webkit-transform: translate(-160px, -160px); transform:translate(-160px, -160px); }
}
@-moz-keyframes rotate-astronaut {
  100% { -moz-transform: rotate(-720deg);}
}
@-webkit-keyframes rotate-astronaut {
  100% { -webkit-transform: rotate(-720deg);}
}
@keyframes rotate-astronaut{
  100% { -webkit-transform: rotate(-720deg); transform:rotate(-720deg); }
}

.spin-earth-on-hover{
  transition: ease 200s !important;
  transform: rotate(-3600deg) !important;
}

.master404{
  background: url(../assets/img/bg_purple.png);
  background-repeat: repeat-x;
  background-size: cover;
  background-position: left top;
  height: 100%;
  overflow: hidden;
}

.central-body{
  padding: 17% 5% 10% 5%;
  text-align: center;
}

.objects img{
  z-index: 90;
  pointer-events: none;
}

.object_rocket{
  z-index: 95;
  position: absolute;
  transform: translateX(-50px);
  top: 75%;
  pointer-events: none;
  animation: rocket-movement 200s linear infinite both running;
}

.object_earth{
  position: absolute;
  top: 20%;
  left: 15%;
  z-index: 90;
}

.object_moon{
  position: absolute;
  top: 12%;
  left: 25%;
}

.object_astronaut{
  animation: rotate-astronaut 200s infinite linear both alternate;
}

.box_astronaut{
  z-index: 110 !important;
  position: absolute;
  top: 60%;
  right: 20%;
  will-change: transform;
  animation: move-astronaut 50s infinite linear both alternate;
}

.image-404{
  position: relative;
  z-index: 100;
  pointer-events: none;
}

.stars{
  background: url(../assets/img/overlay_stars.svg);
  background-repeat: repeat;
  background-size: contain;
  background-position: left top;
}

.glowing_stars .star{
  position: absolute;
  border-radius: 100%;
  background-color: #fff;
  width: 3px;
  height: 3px;
  opacity: 0.3;
  will-change: opacity;
}

.glowing_stars .star:nth-child(1){
  top: 80%;
  left: 25%;
  animation: glow-star 2s infinite ease-in-out alternate 1s;
}

.glowing_stars .star:nth-child(2){
  top: 20%;
  left: 40%;
  animation: glow-star 2s infinite ease-in-out alternate 3s;
}

.glowing_stars .star:nth-child(3){
  top: 25%;
  left: 25%;
  animation: glow-star 2s infinite ease-in-out alternate 5s;
}

.glowing_stars .star:nth-child(4){
  top: 75%;
  left: 80%;
  animation: glow-star 2s infinite ease-in-out alternate 7s;
}

.glowing_stars .star:nth-child(5){
  top: 90%;
  left: 50%;
  animation: glow-star 2s infinite ease-in-out alternate 9s;
}

@media only screen and (max-width: 600px){
  .box_astronaut{
    top: 70%;
  }

  .central-body{
    padding-top: 25%;
  }
}
</style>
