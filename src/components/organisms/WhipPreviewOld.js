import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import { Box, Text, Image } from '@chakra-ui/core';

const camelCase = str =>
  str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index == 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');

const resolveColorUrl = (waxed, color, isPrimary) => {
  if (!color) {
    return null;
  }
  let base = 'http://whipworks.s3.amazonaws.com/paracordImages/';
  base += waxed ? 'waxed/' : 'unwaxed/';
  base += camelCase(color);
  base += isPrimary ? 'Left' : 'Right';
  base += waxed ? 'Waxed.jpg' : '.jpg';
  console.log(base);
  return base;
};

class WhipPreview extends React.Component {
  constructor() {
    super();

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
  }

  /* initialize ThreeJS stuff */
  componentDidMount() {
    console.log(this.mount);
    // const width = this.mount.clientWidth;
    const width = 300;
    const height = 700;
    // const height = this.mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 2, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    /* lights */
    const light = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(light);

    const light1 = new THREE.PointLight(0xffffff, 0.6);
    light1.position.set(-50, -15, 15);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xffffff, 0.6);
    light2.position.set(50, 15, 15);
    scene.add(light2);

    /* handle */
    const handleCanvas = this.canvas;
    const texture = new THREE.CanvasTexture(handleCanvas); // creates texture to wrap around cylinder geometry

    const handleGeo = new THREE.CylinderGeometry(4, 4, 80, 16);
    const handleMat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      map: texture,
      bumpMap: texture,
    });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.y = -5;
    handle.rotation.y = Math.PI;

    camera.position.set(0, 0, 100);

    scene.add(handle);
    renderer.setClearColor('#000000');
    renderer.setSize(width, height);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    this.handle = handle;
    this.texture = texture;

    this.mount.appendChild(this.renderer.domElement);
    this.start();
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId);
  }

  animate() {
    this.texture.needsUpdate = true;

    this.handle.rotation.y -= 0.01;

    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  renderHandle() {
    const { pattern, primary, secondary } = this.props;
    if (!pattern || !primary || !secondary) {
      return;
    }

    const c = this.canvas.getContext('2d');
    let color1 = c.createPattern(this.refs.color1, 'repeat');
    let color2 = c.createPattern(this.refs.color2, 'repeat');
    const bw = 400;
    const b16 = bw / 16;
    const patterns = {
      Box: () => {
        let pattern1 = [0, 1, 4, 5, 8, 9, 12, 13, 16];
        let pattern2 = [0, 3, 4, 7, 8, 11, 12, 15, 16];
        let rowPattern1 = [-12, -8, -4, 0, 4, 8, 12, 16, 20, 24, 28, 32, 36];
        let rowPattern2 = [-11, -7, -3, 1, 5, 9, 13, 17, 21, 25, 29, 33, 37];
        let rowPattern3 = [-10, -6, -2, 2, 6, 10, 14, 18, 22, 26, 30, 34, 38];

        for (let j = -b16 * 16; j <= b16 * 62; j += b16 * 2) {
          for (let i = -b16 * 8; i <= bw * 2; i += b16) {
            c.beginPath();
            c.moveTo(i, i + j + 2 * b16);
            c.lineTo(i - b16, i + j + b16);
            c.lineTo(i, i + j);
            c.lineTo(i + b16, i + j + b16);
            c.closePath();
            c.stroke();
            if (rowPattern1.includes(j / (b16 * 2))) {
              c.fillStyle = pattern1.includes(i / b16) ? color1 : color2;
            } else if (rowPattern2.includes(j / (b16 * 2))) {
              c.fillStyle = pattern2.includes(i / b16) ? color1 : color2;
            } else if (rowPattern3.includes(j / (b16 * 2))) {
              c.fillStyle = pattern1.includes(i / b16) ? color1 : color2;
            } else {
              c.fillStyle = pattern2.includes(i / b16) ? color1 : color2;
            }
            c.fill();
          }
        }
      },
      accent: () => {},
    };
    console.log(pattern);
    console.log(typeof patterns[pattern]);
    patterns[pattern]();
  }

  initialPattern = () => {
    const c = this.canvas.getContext('2d');
    const image = this.refs.initialHandleWrap;
    c.drawImage(image, 2, 2);
  };

  componentDidUpdate() {
    console.log('here');
    this.renderHandle();
  }

  render() {
    const { primary, secondary, pattern, waxed } = this.props;
    let color1Uri = resolveColorUrl(waxed, primary, true);
    let color2Uri = resolveColorUrl(waxed, secondary, false);

    return (
      <Box minW="300px" height="700px">
        <Box
          ref={mount => {
            this.mount = mount;
          }}
          width="300px"
          height="700px"
        />
        {!primary ||
          !secondary ||
          (!pattern && (
            <Box pos="relative">
              <Text>Sample</Text>
            </Box>
          ))}
        <Image display="none" ref="color1" src={color1Uri} />
        <Image display="none" ref="color2" src={color2Uri} />
        <canvas
          ref={canvas => {
            this.canvas = canvas;
          }}
          width="400"
          height="1600"
          style={{ display: 'none' }}
        ></canvas>
        <Image
          onLoad={this.initialPattern}
          ref="initialHandleWrap"
          src={require('../../images/handleWrapWhite.jpg')}
          display="none"
        />
      </Box>
    );
  }
}

WhipPreview.propTypes = {
  primary: PropTypes.string,
  secondary: PropTypes.string,
  pattern: PropTypes.string,
  waxed: PropTypes.bool,
};

export default WhipPreview;
