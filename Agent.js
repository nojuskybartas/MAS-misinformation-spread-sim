import * as THREE from 'three';

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
        
        // create the 3d shape
        this.geometry = geometry
        this.material = new THREE.MeshBasicMaterial({ wireframe: true});
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.update_color()
        this.mesh.position.x = init_posX
        this.mesh.position.y = init_posY

        // used later to separate between objects (agents & publisher(s))
        this.mesh.name = 'agent'

        scene.add(this.mesh)
    }

    // visual movement
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
        
    // read publishers' article
    read(){
        var publication = this.publisher.publish()
        
        if (publication == 1){
            //positive publication
            if (this.scientist){
                this.influence += 30 * learning_rate * (this.influence + 1)
            } else {
                this.influence += 10 * learning_rate * (this.influence + 1)
            }
        } else {
            // negative publication
            if (this.scientist){
                this.influence -= 5 * learning_rate * (this.influence + 1)
            } else {
                this.influence -= 15 * learning_rate * (this.influence + 1)
            }
        }
    }

    //exchange (mis)information with partner here
    talk(){
        var influence
        var partner_influence
        // var multiplier = 10

        if (this.influence < 0) {influence = -1 * (1-Math.abs(this.influence))} else {influence = 1-this.influence}
        if (this.partner.influence < 0) {partner_influence = -1 * (1-Math.abs(this.partner.influence))} else {partner_influence = 1-this.partner.influence}
                
        // multiplier = 10
        // if (this.partner.scientist == true) {
        //     multiplier = 20000
        // }
        
        
        this.influence += partner_influence * learning_rate //* multiplier
        
        // multiplier = 10
        // if (this.scientist == true) {
        //     var multiplier = 20000
        // }
        
        this.partner.influence += influence * learning_rate //* multiplier

        this.partner = null
    }

        
    update_color(){
        if (this.influence < -1) {this.influence = -1} else if (this.influence > 1) {this.influence = 1}
        var value = this.influence/2+0.5
        this.color = gsap.utils.interpolate('red', 'green', value)
        this.material.color.set((this.color))
    }
}
