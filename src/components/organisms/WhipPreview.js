import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Text, Flex, Box } from '@chakra-ui/core';
import * as THREE from 'three';

const width = 350;
const height = 800;
const WhipPreview = ({ waxed, primary, secondary, color }) => {
  const threeRef = useRef(undefined);

  useEffect(() => {
    if (threeRef.current) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, width / height, 2, 1000);
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(width, height);
      threeRef.current.appendChild(renderer.domElement);
      const handleGeo = new THREE.CylinderGeometry(4, 4, 80, 16);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const handle = new THREE.Mesh(handleGeo, material);
      handle.position.y = -5;
      handle.rotation.y = Math.PI;
      camera.position.set(0, 0, 100);
      scene.add(handle);

      let frameId;
      const animate = function() {
        frameId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();

      return () => cancelAnimationFrame(frameId);
    }
  }, []);

  return (
    <Box width={width} height={height} bg="green.500" pos="relative">
      <Flex
        flex={1}
        bg="blackAlpha.700"
        height="100%"
        justifyContent="center"
        alignItems="center"
        p="5"
        pos="absolute"
      >
        <Text opacity="1" textAlign="center">
          Select colors and handle pattern to see your bullwhip!
        </Text>
      </Flex>
      <Box ref={threeRef} />
    </Box>
  );
};

WhipPreview.propTypes = {
  primary: PropTypes.string,
  secondary: PropTypes.string,
  pattern: PropTypes.string,
  waxed: PropTypes.bool,
};

WhipPreview.defaultProps = {};

export default WhipPreview;
