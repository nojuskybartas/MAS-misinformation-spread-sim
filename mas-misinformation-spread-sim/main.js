import './style.css'

import * as THREE from 'three';

import Publisher from './Publisher.js';
import Agent from './Agent.js'; 

import {getRandomInt} from './utils.js';

let agentslider = document.getElementById("agentSlider");
let daySlider = document.getElementById("daySlider");
let criticalSlider = document.getElementById("criticalSlider");
let misinformationSlider = document.getElementById("misinformationSlider");

function updateDaySlider() {
  var elem = document.getElementById("myBar");
  if (days_elapsed >= days && day_ended()) {
    sim_running = false
    document.getElementById("startBtn").innerHTML = 'Start';
  }
  elem.style.width = Math.round(days_elapsed/days*100) + '%';
  elem.innerHTML = 'day' + ' ' + days_elapsed;
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 5000);
var renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#sim-canvas'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

var pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(10, 10, 10);

var ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(pointLight, ambientLight);

var agent_geometry = new THREE.SphereGeometry(2, 3, 3);
var agent_scientist_geometry = new THREE.SphereGeometry(2, 3, 3);
var publisher_geometry = new THREE.TorusGeometry(10, 10, 7, 11);
var publisher_material = new THREE.MeshBasicMaterial({color: 0xff3599, wireframe: true});

function setup_publishers(){
    var init_posX = 0
    var init_posY = 0
    var misinformation_percent = parseInt(misinformationSlider.querySelector('input').value)
    var spread = [100-misinformation_percent, misinformation_percent]
    var publisher = new Publisher(init_posX, init_posY, spread, scene, publisher_geometry, publisher_material)
    return publisher
  }

function setup_agents(num){
    var agents = []
    var starting_pos = []
    for (var i = 0; i<num; i++){
      starting_pos.push(2*Math.PI / num * i - Math.PI)
    }
    for (var i = 0; i<num; i++) {
      let init_posX = Math.sin(starting_pos[i])*num
      let init_posY= Math.cos(starting_pos[i])*num
      var init_influence = 0.0;
      var scientist = false;
      var geometry = agent_geometry;
      if (Math.floor(i/num*100) < parseInt(criticalSlider.querySelector('input').value)) {scientist = true; geometry = agent_scientist_geometry;}      
      var agent = new Agent(scene, geometry, scientist, init_influence, init_posX, init_posY)
      agents.push(agent)
    }
    return agents
}

var objIdMap=new WeakMap, objectCount = 0;
function objectId(object){
  if (!objIdMap.has(object)) objIdMap.set(object,++objectCount);
  return objIdMap.get(object);
}

function find_partners(num_partners){
    var taken_partners = []
    var random_offset = getRandomInt(0, 2);
    var random_partner_id = 0
    var partnerFound = false

    agents.map(agent => {
      
      if (objectId(agent) % 2 == random_offset){
        while (true) {
          random_partner_id = getRandomInt(0, num_partners);
          if (!taken_partners.includes(random_partner_id)){
            agent.find_partner(agents[random_partner_id])
            taken_partners.push(random_partner_id);
            break;
          }
        }       
      }
    })   
}

function find_publishers(){
    agents.map(agent => {
      agent.publisher = publisher
    })
}

function day_ended(){
  if (agents.some(agent => !agent.atOrigin())){
    return false;
  } else {
    return true;
  }
}

function clear_entity(entity_name){
  for (let i = scene.children.length - 1; i >= 0; i--) {
    if(scene.children[i].name == entity_name )
        scene.remove(scene.children[i]);
  }
}

function reset_env(){
  clear_entity('agent')
  agents = setup_agents(agentslider.querySelector('input').value)
  //sim_running = false
  //document.getElementById("startBtn").innerHTML = 'Start';
  days_elapsed = 0
}

var agents = setup_agents(agentslider.querySelector('input').value)
var days_elapsed = 0
var sim_running = false

document.getElementById("startBtn").addEventListener("click", function() {
  if (days_elapsed >= days) reset_env()
  if (sim_running){
    document.getElementById("startBtn").innerHTML = 'Start';
    sim_running = false
  } else {
    document.getElementById('startBtn').innerHTML = 'Stop';
    sim_running = true
  }
});

// inputslider.addEventListener("mouseover", function() {
//   reset_env()
// });

var prev_agents = agentslider.querySelector('input').value
var critical_thinking = criticalSlider.querySelector('input').value
var days = daySlider.querySelector('input').value
var misinformation_level = misinformationSlider.querySelector('input').value

camera.position.z = gsap.utils.mapRange(0, 400, 10, 500, prev_agents)

//temp

var publisher = setup_publishers()

function animate() {
  requestAnimationFrame(animate);

  if (agentslider.querySelector('input').value != prev_agents || criticalSlider.querySelector('input').value != critical_thinking){
    prev_agents = agentslider.querySelector('input').value
    critical_thinking = criticalSlider.querySelector('input').value
    camera.position.z = gsap.utils.mapRange(0, 400, 10, 500, prev_agents)
    reset_env()
  }

  if (daySlider.querySelector('input').value != days){
    days = daySlider.querySelector('input').value
  }

  if (misinformationSlider.querySelector('input').value != misinformation_level){
    misinformation_level = misinformationSlider.querySelector('input').value
    clear_entity('publisher')
    publisher = setup_publishers()
  }


  if (day_ended() && sim_running && days_elapsed<=days){
        days_elapsed += 1
        if (days_elapsed % 7 == 1){
            find_publishers() 
        }
        find_partners(agentslider.querySelector('input').value)
        
  }
    if (sim_running){
      agents.map(agent => {
        agent.move()
        agent.update_color()
        if (agent.publisher != null && agent.atEntity(agent.publisher)){
          agent.publisher = null
        }
      })
    } else {
      agents.map(agent => {
        agent.mesh.rotation.x += 0.01
      })
    }

  updateDaySlider()

  publisher.mesh.rotation.y += 0.001
  publisher.mesh.rotation.z += 0.005
  // publisher.rotateMoons()

  renderer.render(scene, camera);
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

window.addEventListener('resize', onWindowResize, false );


animate();