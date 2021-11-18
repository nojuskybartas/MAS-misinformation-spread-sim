import Gradient from './Gradient.js'; 
import {rgbToHex, fullColorHex} from './utils.js';
import * as THREE from 'three';

let COLORS = [[255, 50, 50], [0, 255, 50]];
let X = 900;
const gradient = new Gradient(COLORS, X);

let speedslider = document.getElementById("speedSlider");
var learning_rate = 0.001;

export default class Agent {
    constructor(scene, geometry, scientist, init_influence, init_posX, init_posY) {
        this.scientist = scientist
        this.influence = init_influence
        this.originX = init_posX
        this.originY = init_posY

        this.partner = null
        this.publisher = null
        
        if (scientist){
            this.color = [0, 255, 0]
        } else {
            this.color = [255, 0, 0]
        }
        
        this.geometry = geometry
        this.material = new THREE.MeshBasicMaterial({color: fullColorHex(this.color), wireframe: true});
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.update_color()
        this.mesh.position.x = init_posX
        this.mesh.position.y = init_posY
        this.mesh.name = 'agent'

        scene.add(this.mesh)
    }

    find_partner(partner) {
        this.partner = partner
    }

    move(){
        if (this.publisher != null){
            this.moveTowards(this.publisher)
            if (this.atEntity(this.publisher)){
                this.read()
            }
        }

        else if (this.partner != null){
            this.moveTowards(this.partner)
            if (this.atEntity(this.partner)){
                this.talk()
            }
        }

        else {
            this.mesh.position.x += (this.originX-this.mesh.position.x)/80*speedslider.querySelector('input').value
            this.mesh.position.y += (this.originY-this.mesh.position.y)/80*speedslider.querySelector('input').value
            this.mesh.rotation.y += 0.01
        }
    }

    moveTowards(entity){
        if (Math.abs(this.mesh.position.x - entity.mesh.position.x) > 1){
            this.mesh.position.x += (entity.mesh.position.x-this.mesh.position.x)/50*speedslider.querySelector('input').value
        }    
        if (Math.abs(this.mesh.position.y - entity.mesh.position.y) > 1){
            this.mesh.position.y += (entity.mesh.position.y-this.mesh.position.y)/50*speedslider.querySelector('input').value
        }
    }

    atEntity(entity){
        if (Math.abs(this.mesh.position.x-entity.mesh.position.x)<=1 && Math.abs(this.mesh.position.y-entity.mesh.position.y)<=1){
            return true
        } else {
            return false
        }
    }

    atOrigin(){
        if (Math.abs(this.mesh.position.x-this.originX)<=1 && Math.abs(this.mesh.position.y-this.originY)<=1){
            return true;
        } else {
            return false;
        }
    }
        
    read(){
        var publication = this.publisher.publish()
        
        if (publication == 1){
            //positive publication
            if (this.scientist){
                this.influence += 300 * learning_rate
            } else {
                this.influence += 100 * learning_rate
            }
        } else {
            // negative publication
            if (this.scientist){
                this.influence -= 50 * learning_rate
            } else {
                this.influence -= 150 * learning_rate
            }
        }
    }

    talk(){
        //exchange (mis)information with partner here
        const influence_copy = this.influence

        var multiplier = 1
        
        if (this.partner.scientist) {
            var multiplier = 1.3
            if (this.partner.influence < 0) {
                multiplier = multiplier * -1
            }
        }
        
        this.influence += this.partner.influence * (learning_rate * 100) * multiplier
        
        if (this.scientist) {
            var multiplier = 1.3
            if (this.influence < 0) {
                multiplier = multiplier * -1
            }
        }
        
        this.partner.influence += influence_copy * learning_rate * multiplier

        this.partner = null
    }

        
    update_color(){
        var value = this.influence/2+0.5
        if (value < 0) {value = 0} else if (value > 1) {value = 1}
        this.color = gsap.utils.interpolate('red', 'green', value)
        this.material.color.set((this.color))
    }
}
