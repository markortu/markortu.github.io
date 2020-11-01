/* eslint-disable */
import * as THREE from 'three'
import $ from 'jquery'
// import { EffectComposer, RenderPass, GlitchPass } from 'threejs-ext'
// var OBJLoader = require("three-obj-loader");
// OBJLoader(THREE);
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader'
var GLTFLoader = require("three-gltf-loader");
GLTFLoader(THREE);
import { BloomEffect, EffectPass, EffectComposer, GlitchEffect, RenderPass } from "postprocessing";


// Standard scene setup in Three.js. Check "Creating a scene" manual for more information
// https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
export const createScene = () => {
    const scene = new THREE.Scene()
    return scene
}

export const createCamera = ({ width, height }) => {
    const camera = new THREE.PerspectiveCamera(
        45, // fov = field of view
        width / height, // aspect ratio
        1, // near plane
        1000 // far plane
    );
    camera.position.z = 80; // is used here to set some distance from a cube that is located at z = 0
    return camera
}

export const lightsSetup = (scene) => {

    var light = new THREE.PointLight(0xF2F07E, 2.5);
    light.position.set(0, 100, 100);
    // light.shadowDarkness = .5;
    light.castShadow = true;
    scene.add(light);

    var light1 = new THREE.PointLight(0xFFFFFF, 2.5);
    light1.position.set(0, 50, -50);
    // light1.shadowDarkness = .1;
    light1.castShadow = true;
    scene.add(light1);
    scene.add(new THREE.AmbientLight(0xf0f0f0));
    return light
}
export const isMobile = () => {
    const ua = navigator.userAgent;
    return /Android|Mobi/i.test(ua);
};
export const createRenderer = ({ width, height }) => {
    const renderer = new THREE.WebGLRenderer({ antialias: true }); //alpha: true 
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    renderer.setPixelRatio(isMobile() ? Math.min(3, window.devicePixelRatio) : window.devicePixelRatio);
    // console.log(isMobile() ? Math.min(3, window.devicePixelRatio) : window.devicePixelRatio );
    renderer.toneMapping = THREE.ReinhardToneMapping;

    return renderer
}

export const createComposer = ({ renderer, scene, camera }) => {
    // const composer = null;
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer2.addPass(new EffectPass(camera, new BloomEffect()));

    return composer
}

export const createMesh = ({ model, mtl, scene, onLoaded }) => {
    var mesh;
    var materialNormal, materialStandard;
    var SCALE = 2.436143; // from original model
    var BIAS = -0.428408; // from original model
    var loadTotal;
    //Load Object - Mesh
    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        // console.log(item, loaded, total);
        loadTotal = loaded;
    };
    var textureLoader = new THREE.TextureLoader(manager);
    var normalMap = textureLoader.load("assets/normal.png");
    var room = textureLoader.load("assets/roomlayout.png");
    var aoMap = textureLoader.load("assets/ao.jpg");
    var displacementMap = textureLoader.load("assets/displacement.jpg");
    var loaderObj = new OBJLoader(manager);

    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + "% downloaded");
        }
    };
    var onError = function (xhr) { };

    materialNormal = new THREE.MeshNormalMaterial({
        displacementMap: displacementMap,
        displacementScale: SCALE,
        displacementBias: BIAS,

        normalMap: normalMap,
        normalScale: new THREE.Vector2(1, -1),

        //flatShading: true,

        side: THREE.DoubleSide
    });
    var material = new THREE.MeshPhongMaterial({ color: 0xe0dacd });

    loaderObj.load(
        model,
        function (object) {

            // object.children[0].material = materials.materials.Material;
            // console.log(object);
            // mesh = new THREE.Mesh( geometry, material);
            // object.materialLibraries = ["./assets/iZroom.mtl"];
            // console.log(object);
            object.children[0].material.map = room;
            mesh = object;
            mesh.scale.multiplyScalar(1);
            // mesh.rotation.set(0,0,0);
            scene.add(mesh);
            onLoaded(mesh)
        },
        onProgress,
        onError
    );


    return mesh
}

export const loadGLTFModel = ({ model, onLoaded }) => {
    const manager = new THREE.LoadingManager();
    manager.onStart = function (url, itemsLoaded, itemsTotal) {
        // console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    };
    manager.onLoad = function () {
        // console.log( 'Loading complete!');
    };

    const progressbarElem = document.querySelector('#progressbar');
    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
        // console.log(itemsLoaded / itemsTotal * 100);
        progressbarElem.style.width = `${itemsLoaded / itemsTotal * 100 | 0}%`;
        // console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    };
    manager.onError = function (url) {
        // console.log( 'There was an error loading ' + url );
    };
    var onError = function (xhr) { };
    const loader = new GLTFLoader(manager);
    loader.load(
        model,
        (gltf) => {
            // called when the resource is loaded
            gltf.scene.scale.set(.04, .04, .04)
            onLoaded(gltf);
        }
    );

}

export const loadOBJModel = ({ model, mtl, onLoaded }) => {

    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();

    mtlLoader.load(mtl, (materials) => {
        materials.preload()
        objLoader.setMaterials(materials);
        objLoader.load(model, (object) => {
            object.position.set(1, 1, 1);
            onLoaded(object);
        });
    });

}

export const prepModelsAndAnimations = (model) => {
    const animsByName = {};
    model.animations.forEach((clip) => {
        animsByName[clip.name] = clip;
    });
    model.animations = animsByName;
    return model;
}

export class JoyStick {
    constructor(options) {
        const circle = document.createElement("div");
        circle.id = "JoyStick";
        circle.style.cssText = "position:absolute; bottom:35px; width:80px; height:80px; background:rgba(126,126,126,0.5);border:#444 solid medium; border-radius:50%;left:50%;transform:translateX(-50%)";
        const thumb = document.createElement("div");
        thumb.style.cssText = "position:absolute; left:17px; top:17px;  width:40px; height:40px; background:#fff; border-radius:50%";
        circle.appendChild(thumb);
        document.getElementById("meshCanvas").appendChild(circle);
        this.domElement = thumb;
        this.maxRadius = 40;
        this.maxRadiusSquared = this.maxRadius * this.maxRadius;
        this.onMove = false;
        this.stop = false;
        this.game = false;
        this.origin = { left: this.domElement.offsetLeft, top: this.domElement.offsetTop };
        this.back2origin = false;

        if (this.domElement != undefined) {
            const joystick = this;
            if ('ontouchstart' in window) {
                this.domElement.addEventListener('touchstart', function (evt) { joystick.tap(evt) });
            } else {
                this.domElement.addEventListener('mousedown', function (evt) { joystick.tap(evt) });
            }
        }
    }
    getMousePosition(evt) {
        let clientX = evt.targetTouches ? evt.targetTouches[0].pageX : evt.clientX;
        let clientY = evt.targetTouches ? evt.targetTouches[0].pageY : evt.clientY;
        return { x: clientX, y: clientY };
    }

    tap(evt) {
        evt = evt || window.event;
        // get the mouse cursor position at startup:
        this.offset = this.getMousePosition(evt);
        const joystick = this;
        if ('ontouchstart' in window) {
            document.ontouchmove = function (evt) { joystick.move(evt); };
            document.ontouchend = function (evt) { joystick.up(evt); };
        } else {
            document.onmousemove = function (evt) { joystick.move(evt); };
            document.onmouseup = function (evt) { joystick.up(evt); };
        }
    }

    move(evt) {
        evt = evt || window.event;
        const mouse = this.getMousePosition(evt);
        // calculate the new cursor position:
        let left = mouse.x - this.offset.x;
        let top = mouse.y - this.offset.y;
        //this.offset = mouse;

        const sqMag = left * left + top * top;
        if (sqMag > this.maxRadiusSquared) {
            //Only use sqrt if essential
            const magnitude = Math.sqrt(sqMag);
            left /= magnitude;
            top /= magnitude;
            left *= this.maxRadius;
            top *= this.maxRadius;
        }

        document.getElementById("CleinCheekz").style.overflow = "hidden";
        // console.log(this.back2origin);
        if (this.back2origin) {
            // this.domElement.style.top = `${this.origin.top}px`;
            // this.domElement.style.left = `${this.origin.left}px`;
            this.stop = true;
        } else if (!this.back2origin) {
            // set the element's new position:
            this.domElement.style.top = `${top + this.domElement.clientHeight / 2}px`;
            this.domElement.style.left = `${left + this.domElement.clientWidth / 2}px`;

            this.forward = -(top - this.origin.top + this.domElement.clientHeight / 2) / this.maxRadius;
            this.turn = (left - this.origin.left + this.domElement.clientWidth / 2) / this.maxRadius;
            this.angle = this.getAngle(this.turn, this.forward);
            this.stop = false;
        }

        // if (this.onMove != undefined) this.onMove.call(this.game, forward, turn);
    }

    up(evt) {
        if ('ontouchstart' in window) {
            document.ontouchmove = null;
            document.touchend = null;
        } else {
            document.onmousemove = null;
            document.onmouseup = null;
        }
        this.domElement.style.top = `${this.origin.top}px`;
        this.domElement.style.left = `${this.origin.left}px`;

        document.getElementById("CleinCheekz").style.overflow = "auto";
        this.stop = true;
        this.back2origin = false;
    }
    getAngle(x, y) {
        // Checking if the joystick is at center (0,0) and returns a 'stand still'
        // command by setting the return to 99999
        if (x == 0 && y == 0) {
            return (99999);
        } else
            return (1.5 * Math.PI - Math.atan2(y, x));

    }

}
export class upDownJoyStick {
    constructor(options) {
        const circle = document.createElement("div");
        circle.id = "upDownJoyStick";
        circle.style.cssText = "position:absolute; bottom:35px; width:40px; height:80px; background:rgba(126,126,126,0.5);border:#444 solid medium; border-radius:30%;left:60%;transform:translateX(-50%)";
        const thumb = document.createElement("div");
        thumb.style.cssText = "position:absolute; left:-3px; top:17px;  width:40px; height:40px; background:#fff; border-radius:50%";
        circle.appendChild(thumb);
        document.getElementById("meshCanvas").appendChild(circle);
        this.domElement2 = thumb;
        this.maxRadius = 40;
        this.maxRadiusSquared = this.maxRadius * this.maxRadius;
        this.onMove = false;
        this.stop = false;
        this.game = false;
        this.origin = { left: this.domElement2.offsetLeft, top: this.domElement2.offsetTop };

        if (this.domElement2 != undefined) {
            const joystick = this;
            if ('ontouchstart' in window) {
                this.domElement2.addEventListener('touchstart', function (evt) { joystick.tap(evt) });
            } else {
                this.domElement2.addEventListener('mousedown', function (evt) { joystick.tap(evt) });
            }
        }
    }
    getMousePosition(evt) {
        let clientX = evt.targetTouches ? evt.targetTouches[0].pageX : evt.clientX;
        let clientY = evt.targetTouches ? evt.targetTouches[0].pageY : evt.clientY;
        return { x: clientX, y: clientY };
    }

    tap(evt) {
        evt = evt || window.event;
        // get the mouse cursor position at startup:
        this.offset = this.getMousePosition(evt);
        const joystick = this;
        if ('ontouchstart' in window) {
            document.ontouchmove = function (evt) { joystick.move(evt); };
            document.ontouchend = function (evt) { joystick.up(evt); };
        } else {
            document.onmousemove = function (evt) { joystick.move(evt); };
            document.onmouseup = function (evt) { joystick.up(evt); };
        }
    }

    move(evt) {
        evt = evt || window.event;
        const mouse = this.getMousePosition(evt);
        // calculate the new cursor position:
        let left = mouse.x - this.offset.x;
        let top = mouse.y - this.offset.y;
        //this.offset = mouse;

        const sqMag = left * left + top * top;
        if (sqMag > this.maxRadiusSquared) {
            //Only use sqrt if essential
            const magnitude = Math.sqrt(sqMag);
            left /= magnitude;
            top /= magnitude;
            left *= this.maxRadius;
            top *= this.maxRadius;
        }

        document.getElementById("CleinCheekz").style.overflow = "hidden";
        // set the element's new position:
        this.domElement2.style.top = `${top + this.domElement2.clientHeight / 2}px`;
        // this.domElement2.style.left = `${left + this.domElement2.clientWidth / 2}px`;

        this.forward = -(top - this.origin.top + this.domElement2.clientHeight / 2) / this.maxRadius;
        this.turn = (left - this.origin.left + this.domElement2.clientWidth / 2) / this.maxRadius;
        this.angle = this.getAngle(this.turn, this.forward);
        this.stop = false;
        // if (this.onMove != undefined) this.onMove.call(this.game, forward, turn);
    }

    up(evt) {
        if ('ontouchstart' in window) {
            document.ontouchmove = null;
            document.touchend = null;
        } else {
            document.onmousemove = null;
            document.onmouseup = null;
        }
        this.domElement2.style.top = `${this.origin.top}px`;
        // this.domElement2.style.left = `${this.origin.left}px`;

        document.getElementById("CleinCheekz").style.overflow = "auto";
        this.stop = true;
    }
    getAngle(x, y) {
        // Checking if the joystick is at center (0,0) and returns a 'stand still'
        // command by setting the return to 99999
        if (x == 0 && y == 0) {
            return (99999);
        } else
            return (1.5 * Math.PI - Math.atan2(y, x));

    }

}

export class openComputerButton {
    constructor(options) {
        this.button = document.createElement("div");
        this.button.id = "openComputer";
        this.button.style.cssText = "z-index:999;display:none; position:absolute; bottom:35px; width:40px; height:40px; background:rgba(126,126,126,0.5);border:#444 solid medium; border-radius:50%;left:70%;transform:translateX(-50%)";

        this.clicked = false;
        document.getElementById("meshCanvas").appendChild(this.button);
        this.domElement3 = this.button;
        if (this.domElement3 != undefined) {
            const joystick = this;
            this.domElement3.addEventListener('click', function (evt) { joystick.tap(evt) });
        }
    }

    tap(evt) {
        evt = evt || window.event;
        // get the mouse cursor position at startup:
        if (this.clicked) {
            this.clicked = false;
        } else {
            this.clicked = true;
        }

    }

}

export class speechBubble {
    constructor(options) {
        const box = document.createElement("div");
        box.id = "speechBubble";
        box.style.cssText = "z-index:999;position:absolute; bottom:150px; width:60vw; height:60px; background:white;border:#444 solid medium;left:50%;transform:translateX(-50%)";

        const text = document.createElement("h1");
        text.id = "speechText";
        box.appendChild(text);
        document.getElementById("meshCanvas").appendChild(box);
        this.domElement4 = box;

        if (this.domElement4 != undefined) {
            const bubble = this;
            // this.domElement4.addEventListener('click', function(evt) { bubble.tap(evt) });
        }
    }

    tap(evt) {
        evt = evt || window.event;
        // array with texts to type in typewriter
        this.dataText = ["Hello! my name is Clein."];
        var dataText = this.dataText;
        var element = $("#speechBubble");
        element.fadeIn();
        // type one text in the typwriter
        // keeps calling itself until the text is finished

        function typeWriter(text, i, fnCallback) {
            // chekc if text isn't finished yet
            if (i < (text.length)) {
                // add next character to h1
                document.querySelector("h1").innerHTML = text.substring(0, i + 1) + '<span aria-hidden="true"></span>';

                // wait for a while and call this function again for next character
                setTimeout(function () {
                    typeWriter(text, i + 1, fnCallback)
                }, 100);
            }
            // text finished, call callback if there is a callback function
            else if (typeof fnCallback == 'function' && element) {
                // call callback after timeout
                // setTimeout(element.remove(), 700);
                element.fadeOut(2000);
            }
        }
        // start a typewriter animation for a text in the dataText array
        function StartTextAnimation(i) {
            if (typeof dataText[i] == 'undefined') {
                setTimeout(function () {
                    StartTextAnimation(0);
                }, 20000);
            }
            // check if dataText[i] exists
            if (dataText[i]) {
                if (i < dataText[i].length) {
                    // text exists! start typewriter animation
                    typeWriter(dataText[i], 0, function () {
                        // after callback (and whole text has been animated), start next text
                        StartTextAnimation(i + 1);
                    });
                }
            }


        }
        // start the text animation
        StartTextAnimation(0);
    }

}