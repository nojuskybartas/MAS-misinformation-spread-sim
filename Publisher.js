import * as THREE from 'three';
// import HelvetikerFont from 'three/examples/fonts/helvetiker_regular.typeface.json';


export default class Publisher{

    constructor(init_posX, init_posY, science_ratio, scene, geometry, material){
        this.science_ratio = science_ratio
        this.posX = init_posX
        this.posY = init_posY
        this.releases = []

        for(var i = 0; i<this.science_ratio[0]; i++){
            this.releases.push(1)
        }
        for(var i = 0; i<this.science_ratio[1]; i++){
            this.releases.push(0)
        }
        // Three.js object instanciation
        this.geometry = geometry
        this.material = material
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.name = 'publisher'
        
        this.mesh.position.x = init_posX
        this.mesh.position.y = init_posY
        
        scene.add(this.mesh)
    }

    publish(){
        // spread info to the audience
        return this.releases[Math.round(Math.random() * (this.releases.length-1))]
    }
}