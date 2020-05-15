import React, { useRef, useEffect, useState } from 'react';
import { Text, Flex, Box, BoxProps } from '@chakra-ui/core';
import * as THREE from 'three';

import { resolveColorUrl, drawBullwhipPreviews } from './constants/drawBullwhipPreviews';

type Props = BoxProps & {
  waxed?: boolean;
  primary?: string;
  secondary?: string;
  pattern?: string;
};

const width = 300;
const height = 700;
const WhipPreview = ({ waxed, primary, secondary, pattern, ...props }: Props) => {
  const threeRef = useRef<any>(undefined);
  const canvasRef = useRef<any>(undefined);
  const textureRef = useRef<any>(undefined);
  const [primaryImage, setPrimaryImage] = useState<string | undefined>('');
  const [secondaryImage, setSecondaryImage] = useState<string | undefined>('');

  useEffect(() => {
    if (threeRef.current) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, width / height, 2, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      threeRef.current.appendChild(renderer.domElement);

      const canvas = document.getElementById('preview-canvas');
      // @ts-ignore
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      // @ts-ignore
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const handleCanvas = canvasRef.current;

      const light = new THREE.AmbientLight(0xffffff, 0.3);
      scene.add(light);

      const light1 = new THREE.PointLight(0xffffff, 0.6);
      light1.position.set(-50, -15, 15);
      scene.add(light1);

      const light2 = new THREE.PointLight(0xffffff, 0.6);
      light2.position.set(50, 15, 15);
      scene.add(light2);

      const texture = new THREE.CanvasTexture(handleCanvas);
      const handleGeo = new THREE.CylinderGeometry(4, 4, 80, 16);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: texture,
      });
      textureRef.current = texture;
      const handle = new THREE.Mesh(handleGeo, material);
      handle.position.y = -5;
      handle.rotation.y = Math.PI;
      camera.position.set(0, 0, 100);
      scene.add(handle);
      let frameId: any;
      const animate = function () {
        frameId = requestAnimationFrame(animate);
        handle.rotation.y -= 0.01;
        renderer.render(scene, camera);
      };
      animate();
      return () => cancelAnimationFrame(frameId);
    }
  }, []);

  useEffect(() => {
    if (primary) {
      const url = resolveColorUrl(waxed, primary, true);
      setPrimaryImage(url);
    }
    if (secondary) {
      setSecondaryImage(resolveColorUrl(waxed, secondary, false));
    }
    if (primary && secondary && pattern) {
      /* for some god-damn reason, this needs to be done twice */
      drawBullwhipPreviews(pattern);
      textureRef.current.needsUpdate = true;
    }
  }, [waxed, primary, secondary, pattern]);

  useEffect(() => {
    if (pattern) {
      setTimeout(() => {
        drawBullwhipPreviews(pattern);
        textureRef.current.needsUpdate = true;
      }, 400);
    }
  }, [primaryImage, secondaryImage, pattern]);

  return (
    <Box width={width} height={height} bg="gray.500" pos="relative" {...props}>
      {(!primary || !secondary || !pattern) && (
        <Flex
          flex={1}
          bg="blackAlpha.700"
          height="100%"
          justifyContent="center"
          alignItems="center"
          p="5"
          pos="absolute"
        >
          <Text opacity={1} textAlign="center">
            Select colors and handle pattern to see your bullwhip!
          </Text>
        </Flex>
      )}
      <Box ref={threeRef} />
      <img
        crossOrigin="anonymous"
        style={{ display: 'none' }}
        src={primaryImage}
        id="primary-image-uri"
        alt="primary-color"
      />
      <img
        crossOrigin="anonymous"
        style={{ display: 'none' }}
        src={secondaryImage}
        id="secondary-image-uri"
        alt="secondary-color"
      />
      <canvas
        ref={canvasRef}
        width="400"
        height="1600"
        id="preview-canvas"
        style={{ display: 'none' }}
      />
    </Box>
  );
};

export default WhipPreview;
