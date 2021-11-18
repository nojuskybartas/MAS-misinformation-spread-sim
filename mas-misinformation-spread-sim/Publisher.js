import * as THREE from 'three';
import HelvetikerFont from 'three/examples/fonts/helvetiker_regular.typeface.json';


export default class Publisher{

    constructor(init_posX, init_posY, science_ratio, scene, geometry, material){
        this.science_ratio = science_ratio
        this.posX = init_posX
        this.posY = init_posY
        this.releases = []

        // let publication_geometry = new THREE.BoxGeometry(1, 1, 1)
        // var publication_material = new THREE.MeshBasicMaterial({color: 0xff8921, wireframe: false});
        // this.moon = new THREE.Mesh(publication_geometry, publication_material)


        // this.addText(scene)

        // var title = document.getElementById('publisherID');
        // title.style.position = 'absolute';
        // // title.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
        // title.style.width = 100;
        // title.style.height = 100;
        // title.style.color = 'Orange';
        // title.style.top = window.innerHeight/3 + 'px';
        // title.style.left = window.innerWidth/2 - 10 + 'px';

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

    // addText(scene){
    //     // var loader = new THREE.FileLoader;
    //     // loader.load( 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {

    //     const fontJson = require( "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/fonts/helvetiker_regular.typeface.json" );
    //     const font = new THREE.Font( fontJson );

    //         const material = new THREE.MeshPhongMaterial({
    //             color: Math.random() * 0xFFFFFF
    //         });

    //         const geometry = new THREE.BufferGeometry('higacsqgavsrva', {
    //             font: HelvetikerFont,
    //             size: 100,
    //             height: 10,
    //           });

    //         // const geometry = new THREE.TextGeometry( text_input, {
    //         //     font: font,
    //         //     size: 0.3,
    //         //     height: 0.1,
    //         // });

    //         const text = new THREE.Mesh( geometry, material );
    //         text.position.x = 0
    //         text.position.y = 10
    //         scene.add(text)
    //     // })
    //     console.log('success')
    // }

    // rotateMoons(){
    //     this.rotateAboutPoint(this.moon, (0,0,0), 'z', 2)
    // }

    // rotateAboutPoint(obj, point, axis, theta, pointIsWorld){
    //     pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;
    
    //     if(pointIsWorld){
    //         obj.parent.localToWorld(obj.position); // compensate for world coordinate
    //     }
    
    //     obj.position.sub(point); // remove the offset
    //     obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    //     obj.position.add(point); // re-add the offset
    
    //     if(pointIsWorld){
    //         obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    //     }
    
    //     obj.rotateOnAxis(axis, theta); // rotate the OBJECT
    // }
}