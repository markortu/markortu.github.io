/* eslint-disable */
import './../css/Mesh.css';
import $ from 'jquery'
import React, { Component } from 'react'
import Stats from 'stats.js'
global.THREE = require("three");
const THREE = global.THREE;
var OrbitControls = require("three-orbit-controls")(THREE);
var OBJLoader = require("three-obj-loader");
OBJLoader(THREE);
import {
  createScene,
  createCamera,
  lightsSetup,
  createRenderer,
  loadGLTFModel,
  prepModelsAndAnimations,
  JoyStick,
  openComputerButton,
  speechBubble,
  isMobile
} from './Helpers.js'

class MeshObject extends Component {
  componentDidMount() {
    // get container dimensions and use them for scene sizing
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;
    this.clock = new THREE.Clock();
    this.scene = createScene();
    this.camera = createCamera({ width, height });
    this.camera.position.y = 60;
    this.camera.position.x = -95;
    this.camera.position.z = 100;
    this.projScreenMatrix = new THREE.Matrix4();
    this.frustum = new THREE.Frustum();
    this.projScreenMatrix.multiplyMatrices(
      this.camera.projectionMatrix,
      this.camera.matrixWorldInverse);
    this.frustum.setFromProjectionMatrix(this.projScreenMatrix);
    this.offscreenTimer = 0;
    this.maxTimeOffScreen = 1;
    this.meshGroup = new THREE.Group();

    //LIGHTS
    this.lights = lightsSetup(this.scene);
    this.lights.position.set(0, 30, 20);
    //RENDERER
    this.renderer = createRenderer({ width, height });
    this.el.appendChild(this.renderer.domElement);

    //STATS
    this.stats = new Stats();
    this.stats.showPanel(1);
    // document.body.appendChild(this.stats.dom);

    //WALL DETECTION ALGORITHM
    this.collidableMeshList = [];
    this.collision = false;

    //COMPOSER FOR POST FX
    // this.composer = createComposer({
    //   renderer: this.renderer,
    //   camera: this.camera,
    //   scene: this.scene,
    // })
    this.loadedClein = false;
    this.mixerInfos = [];
    loadGLTFModel({
      model: './assets/MESH/GLB/clein.glb',
      onLoaded: gltf => {
        this.loadedClein = true;
        this.model = gltf;
        this.model.scene.position.set(1, -2.9, 1);
        this.model.scene.scale.set(.056, .056, .056);
        // this.scene.add(this.model.scene);
        this.model = prepModelsAndAnimations(this.model);
        const root = new THREE.Object3D();
        root.add(this.model.scene);
        this.scene.add(root);
        // this.meshGroup.add(root);
        this.mixer = new THREE.AnimationMixer(this.model.scene);

        const actions = Object.values(this.model.animations).map((clip) => {
          return this.mixer.clipAction(clip);
        });
        // this.camera.lookAt(this.model.scene.position);
        const initMixer = this.mixer;
        const mixerInfo = {
          initMixer,
          actions,
          actionNdx: -1,
        };
        this.mixerInfos.push(mixerInfo);
        this.actions = {};

        this.boxHelper = new THREE.BoxHelper(root, 0xffff00);

        var material = new THREE.MeshBasicMaterial({
          wireframe: false,
          opacity: 0,
          transparent: true,
          alphaTest: 0.05,
        });
        this.collisionGeometry = new THREE.Geometry().fromBufferGeometry(this.boxHelper.geometry);
        this.cube = new THREE.Mesh(this.collisionGeometry, material);
        this.cube.scale.set(0.3, 1, 1);
        this.scene.add(this.cube);
      },
    })

    var collidableGeometry = [];
    loadGLTFModel({
      model: './assets/MESH/GLB/walls.glb',
      onLoaded: gltf => {
        this.wall = gltf;
        this.wall.scene.position.set(-65, -3, -13);
        this.wall.scene.scale.set(.1, .1, .1);
        const root = new THREE.Object3D();
        // root.add(this.wall.scene);

        var material = new THREE.MeshBasicMaterial({
          wireframe: false,
          opacity: 0,
          transparent: true,
          alphaTest: 0.05,
        });

        for (let i = 0; i < this.wall.scene.children.length; i++) {
          for (let j = 0; j < this.wall.scene.children[i].children.length; j++) {
            var geometry = new THREE.Geometry().fromBufferGeometry(this.wall.scene.children[i].children[j].geometry);
            collidableGeometry.push(geometry);
            var cube = new THREE.Mesh(geometry, material);
            cube.position.set(-33, -3, -13);
            cube.scale.set(.057, .2, .1);
            this.scene.add(cube);
            this.collidableMeshList.push(cube);
          }

        }
        var material = new THREE.MeshBasicMaterial({
          wireframe: false,
          opacity: 0,
          transparent: true,
          alphaTest: 0.05,
        });

        //Pared frontal (invisible)
        var cube = new THREE.Mesh(collidableGeometry[1], material);
        cube.position.set(-33, -3, 46);
        cube.scale.set(.057, .2, .1);
        this.scene.add(cube);
        this.meshGroup.add(cube);
        this.collidableMeshList.push(cube);
      },

    })

    //SCENE
    this.loadedWalls = false;
    loadGLTFModel({
      model: './assets/MESH/GLB/scene.gltf',
      onLoaded: gltf => {
        this.loadedWalls = true;
        this.wall = gltf;
        this.wall.scene.position.set(40, -3, -10);
        this.wall.scene.scale.set(.6, .6, .6);
        // this.wall.scene.rotation.set(0, 0.65, 0);
        const root = new THREE.Object3D();
        root.add(this.wall.scene);
        this.scene.add(root);
        // this.meshGroup.add(root);
        var material = new THREE.MeshBasicMaterial({
          wireframe: false,
          opacity: 0,
          transparent: true,
          alphaTest: 0.05,
        });
        // console.log(this.wall.scene.children[0].children[0].children[0].children[0]);
        // for (let j = 0; j < this.wall.scene.children[0].children[0].children[0].children[0].children.length; j++) {
        var geometry = new THREE.Geometry().fromBufferGeometry(this.wall.scene.children[0].children[0].children[0].children[0].children[2].children[0].geometry);
        collidableGeometry.push(geometry);
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(18.5, 0, 19);
        cube.scale.set(.4, .5, .27);
        cube.rotation.set(-Math.PI / 2, 0, 0);
        this.scene.add(cube);
        this.collidableMeshList.push(cube);

        var chairGeometry = new THREE.BoxGeometry(5, 20, 5);
        var chairCollision = new THREE.Mesh(chairGeometry, material);
        chairCollision.position.set(17, 0, -10);
        this.collidableMeshList.push(chairCollision);
        this.scene.add(chairCollision);
        // }


      },

    })

    //CREATE CUBE TO DETECT APROXIMATION TO DESK
    var geometry = new THREE.BoxGeometry(10, 15, 30);
    var material = new THREE.MeshBasicMaterial({
      wireframe: false,
      opacity: 0,
      transparent: true,
      alphaTest: 0.05,
    });

    this.isNearDesk = new THREE.Mesh(geometry, material);
    this.isNearDesk.position.set(28, 3, -15);
    this.isNearDesk.name = "isDesk";
    this.isNearDeskBool = false;
    this.collidableMeshList.push(this.isNearDesk);
    this.scene.add(this.isNearDesk);

    //init speechbubble
    new speechBubble();
    this.textBool = true;
    this.dataText = ["Hello! my name is Clein."];

    this.computer = new openComputerButton();
    this.joystick = new JoyStick();
    this.joystick.stop = true;

    const screenHTML = document.createElement("div");
    const AV1 = document.createElement("div");
    const iframe = document.createElement("iframe");

    iframe.src = window.location.href + "pc";
    // iframe.src = "https://geekprank.com/";
    iframe.allowFullscreen = true;
    iframe.frameBorder = "0";
    iframe.className = "screen";
    iframe.style.cssText = "position:fixed;top:0;left:0;"
    AV1.textContent = "AV-1";
    AV1.className = "overlay";
    screenHTML.appendChild(iframe);
    screenHTML.appendChild(AV1);
    screenHTML.id = "screen";
    screenHTML.className = "pc-container"

    screenHTML.style.cssText = "top: 0; left: 0; position: absolute;display:none;background:black;width:100%;height:100%"


    document.getElementById("meshCanvas").appendChild(screenHTML);

    this.start();


    window.addEventListener("resize", this.handleWindowResize);

    // if (!isMobile()) {
    //   this.controls = new OrbitControls(this.camera, this.el);
    //   this.controls.enableZoom = true;
    //   this.controls.enableRotate = true;
    //   this.controls.minDistance = 60;
    //   this.controls.maxDistance = 120;
    // }

    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    //KEYBOARD
    this.isKeyUp = true;
    window.addEventListener("keyup", this.handleKeyEvents);
    window.addEventListener("keydown", this.handleKeyEvents);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
    window.removeEventListener("keyup", this.handleKeyEvents);
    window.removeEventListener("keydown", this.handleKeyEvents);
    window.cancelAnimationFrame(this.requestID);
    // this.controls.dispose();
    this.el.removeChild(this.renderer.domElement);
  }



  handleKeyEvents = (e) => {
    {
      if (e.type == "keydown") {
        if (e.key == "ArrowUp") {
          this.isKeyArrowUp = true;
        }
        if (e.key == "ArrowDown") {
          this.isKeyArrowDown = true;
        }
        if (e.key == "ArrowLeft") {
          this.isKeyArrowLeft = true;
        }
        if (e.key == "ArrowRight") {
          this.isKeyArrowRight = true;
        }
        this.isKeyUp = false;
      }
      if (e.type == "keyup") {
        this.isKeyUp = true;
      }
    }
  };


  start = () => {
    // The window.requestAnimationFrame() method tells the browser that you wish to perform
    // an animation and requests that the browser call a specified function
    // to update an animation before the next repaint
    if (!this.requestID) {
      this.requestID = window.requestAnimationFrame(this.animate);
    }
  };

  animate = () => {
    const dt = this.clock.getDelta();
    this.stats.begin();
    this.requestID = window.requestAnimationFrame(this.animate)
    this.stats.end();
    // this.loadedClein = false;
    if (this.loadedClein && this.loadedWalls) {
      if (this.textBool) {
        this.showText();
      }
      const loadingElem = document.querySelector('#loading');
      loadingElem.style.display = 'none';
    }
    //CHECK ZOOM
    // if (!isMobile()) {
    //   this.controls.enableZoom = true;
    //   this.controls.enableRotate = true;
    //   if (!this.joystick.stop) {
    //     this.controls.enableZoom = false;
    //     this.controls.enableRotate = false;
    //   }
    // }
    if (this.model) {

      if (this.joystick.stop) {
        this.currentAction = 3
      } else if (!this.joystick.stop) {
        this.currentAction = 20
      }

      if (this.joystick.forward && !this.joystick.stop) {
        if (this.collision == false) {
          this.model.scene.translateZ(dt * 20);
          this.cube.translateZ(dt * 20);
        }
      }
      if (this.joystick.angle) {
        this.model.scene.rotation.set(0, -(this.joystick.angle), 0);
        this.cube.rotation.set(0, -(this.joystick.angle), 0);

      }
      // this.computer.clicked = true;
      if (this.computer.clicked) {
        document.getElementById("JoyStick").style.display = "none";
        document.getElementById("screen").style.display = "inherit";
      } else {
        document.getElementById("JoyStick").style.display = "inherit";
        document.getElementById("screen").style.display = "none";
      }

      if (this.isNearDeskBool) {
        document.getElementById("openComputer").style.display = "inherit";
      } else {

        document.getElementById("openComputer").style.display = "none";
      }
      this.camera.lookAt(this.model.scene.position);
      this.playNextAction();
      this.mixer.update(dt);

      // WALL DETECTION
      var MovingMesh = this.cube;
      var originPoint = MovingMesh.position.clone();
      this.collision = false;
      this.joystick.back2origin = false;
      for (var vertexIndex = 0; vertexIndex < MovingMesh.geometry.vertices.length; vertexIndex++) {
        var localVertex = MovingMesh.geometry.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix4(MovingMesh.matrix);
        var directionVector = globalVertex.sub(MovingMesh.position);

        var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
        var collisionResults = ray.intersectObjects(this.collidableMeshList);
        // console.log(collisionResults);
        if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
          // this.joystick.back2origin = true;
          // this.joystick.angle = 1.;
          this.collision = true;
          if (collisionResults[0].object.name == "isDesk") {
            this.offscreenTimer = 0;
            this.isNearDeskBool = true;
          }
          if (collisionResults[0].object.name != "isDesk") {

            var faccia = collisionResults[0].face.normal;
            if (faccia.x <= -0.9) {
              this.model.scene.position.x = originPoint.x - 0.1;
              this.cube.position.x = originPoint.x - 0.1;
              // this.collision = false;
            } else if (faccia.x >= 0.9) {
              this.model.scene.position.x = originPoint.x + 0.1;
              this.cube.position.x = originPoint.x + 0.1;
              // this.collision = false;
            } else if (faccia.z <= -0.9) {
              this.model.scene.position.z = originPoint.z - 0.1;
              this.cube.position.z = originPoint.z - 0.1;
              // this.collision = false;
            } else if (faccia.z >= 0.9) {
              this.model.scene.position.z = originPoint.z + 0.1;
              this.cube.position.z = originPoint.z + 0.1;
              // this.collision = false;
            }
          }
        } else {
          this.offscreenTimer += dt;
          if (this.offscreenTimer >= this.maxTimeOffScreen) {
            this.isNearDeskBool = false;
          }
        }
      }


    }

    this.renderScene();
  }
  showText() {
    if (this.textBool) {
      this.textBool = false;
      // array with texts to type in typewriter
      this.speechBubbleElement = $("#speechBubble");
      this.speechBubbleElement.fadeIn();
      // type one text in the typwriter
      // keeps calling itself until the text is finished



      // start the text animation
      this.StartTextAnimation(0);
    }

  }
  // start a typewriter animation for a text in the dataText array
  StartTextAnimation(i) {
    var self = this;
    if (typeof this.dataText[i] == 'undefined') {
      setTimeout(function () {
        this.StartTextAnimation(0);
      }, 20000);
    }
    // check if dataText[i] exists
    if (this.dataText[i]) {
      if (i < this.dataText[i].length) {
        // text exists! start typewriter animation
        this.typeWriter(this.dataText[i], 0, function () {
          // after callback (and whole text has been animated), start next text
          self.StartTextAnimation(i + 1);
        });
      }
    }
  }
  typeWriter(text, i, fnCallback) {
    // chekc if text isn't finished yet
    var self = this;
    if (i < (text.length)) {
      // add next character to h1
      document.querySelector("h1").innerHTML = text.substring(0, i + 1) + '<span aria-hidden="true"></span>';

      // wait for a while and call this function again for next character
      setTimeout(function () {
        self.typeWriter(text, i + 1, fnCallback)
      }, 100);
    }
    // text finished, call callback if there is a callback function
    else if (typeof fnCallback == 'function' && this.speechBubbleElement) {
      // call callback after timeout
      // setTimeout(element.remove(), 700);
      this.speechBubbleElement.fadeOut(2000);
      // this.textBool = true;
    }
  }
  playNextAction() {
    const nextActionNdx = this.currentAction;
    this.mixerInfos[0].actionNdx = nextActionNdx;
    this.mixerInfos[0].actions.forEach((action, ndx) => {
      const enabled = ndx === nextActionNdx;
      action.enabled = enabled;
      if (action.enabled) {
        action.play();
      }
    });
  }

  renderScene = () => {
    // this.renderer.autoClear = false;
    this.renderer.render(this.scene, this.camera);
    // if (!isMobile()) {
    //   this.controls.update();
    // }
    // this.composer.render();
  }
  handleWindowResize = () => {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    var vh = window.innerHeight * 0.01;
    var vw = window.innerWidth * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vw', `${vw}px`);
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };

  render() {
    return (
      <div>
        <div id="meshCanvas"
          style={
            { width: "calc(var(--vw, 1vw) * 100)", height: "calc(var(--vh, 1vh) * 100)" }
          }
          ref={ref => (this.el = ref)} />
        <div id="loading"
          style={
            { width: "100%", position: "absolute", background: "#ffe000" }
          }>
          <div className="loadingContainer" >
            <div>
              <h3> Move around the room to learn more about me! </h3></div>
            <div>
              <div className="progress-text" > Loading, please wait... </div>
              <div className="progress" > < div id="progressbar" > </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}



export default MeshObject;