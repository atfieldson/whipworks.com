import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Text, Flex, Box, BoxProps } from '@chakra-ui/react';
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
  const primaryLoadedRef = useRef(false);
  const secondaryLoadedRef = useRef(false);
  const hasRenderedRef = useRef(false);
  const [primaryImage, setPrimaryImage] = useState<string | undefined>('');
  const [secondaryImage, setSecondaryImage] = useState<string | undefined>('');
  const [showOverlay, setShowOverlay] = useState(true);

  // Draw the pattern only when both images are loaded — same timing as bullwhip
  const tryDraw = useCallback(() => {
    if (primaryLoadedRef.current && secondaryLoadedRef.current && pattern) {
      drawBullwhipPreviews(pattern);
      textureRef.current.needsUpdate = true;
      if (!hasRenderedRef.current) {
        hasRenderedRef.current = true;
        setShowOverlay(false);
      }
    }
  }, [pattern]);

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

      const light = new THREE.AmbientLight(0xffffff, 0.45);
      scene.add(light);

      const light1 = new THREE.PointLight(0xffffff, 0.9);
      light1.position.set(-50, -15, 15);
      scene.add(light1);

      const light2 = new THREE.PointLight(0xffffff, 0.9);
      light2.position.set(50, 15, 15);
      scene.add(light2);

      const texture = new THREE.CanvasTexture(handleCanvas);
      const handleGeo = new THREE.CylinderGeometry(4, 4, 80, 16);
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: texture,
      });
      textureRef.current = texture;
      const handle = new THREE.Mesh(handleGeo, material);
      handle.position.y = -5;
      handle.rotation.y = Math.PI;
      camera.position.set(0, 0, 100);
      scene.add(handle);

      // Interactive drag-to-rotate
      let isDragging = false;
      let previousX = 0;
      let autoRotate = true;

      const domEl = renderer.domElement;
      domEl.style.cursor = 'grab';
      domEl.style.touchAction = 'none';

      const onPointerDown = (e: PointerEvent) => {
        isDragging = true;
        previousX = e.clientX;
        autoRotate = false;
        domEl.style.cursor = 'grabbing';
        domEl.setPointerCapture(e.pointerId);
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - previousX;
        handle.rotation.y += deltaX * 0.01;
        previousX = e.clientX;
      };

      const onPointerUp = (e: PointerEvent) => {
        isDragging = false;
        domEl.style.cursor = 'grab';
        domEl.releasePointerCapture(e.pointerId);
      };

      domEl.addEventListener('pointerdown', onPointerDown);
      domEl.addEventListener('pointermove', onPointerMove);
      domEl.addEventListener('pointerup', onPointerUp);
      domEl.addEventListener('pointercancel', onPointerUp);

      let frameId: any;
      const animate = function () {
        frameId = requestAnimationFrame(animate);
        if (autoRotate) {
          handle.rotation.y -= 0.001;
        }
        renderer.render(scene, camera);
      };
      animate();
      return () => {
        cancelAnimationFrame(frameId);
        domEl.removeEventListener('pointerdown', onPointerDown);
        domEl.removeEventListener('pointermove', onPointerMove);
        domEl.removeEventListener('pointerup', onPointerUp);
        domEl.removeEventListener('pointercancel', onPointerUp);
      };
    }
  }, []);

  useEffect(() => {
    if (primary) {
      primaryLoadedRef.current = false;
      setPrimaryImage(resolveColorUrl(waxed, primary, true));
    }
  }, [waxed, primary]);

  useEffect(() => {
    if (secondary) {
      secondaryLoadedRef.current = false;
      setSecondaryImage(resolveColorUrl(waxed, secondary, false));
    }
  }, [waxed, secondary]);

  // When pattern changes and both images are already loaded (bullwhip/stockwhip flow),
  // draw immediately
  useEffect(() => {
    if (pattern && primaryLoadedRef.current && secondaryLoadedRef.current) {
      drawBullwhipPreviews(pattern);
      textureRef.current.needsUpdate = true;
      if (!hasRenderedRef.current) {
        hasRenderedRef.current = true;
        setShowOverlay(false);
      }
    }
  }, [pattern]);

  const onPrimaryLoad = useCallback(() => {
    primaryLoadedRef.current = true;
    tryDraw();
  }, [tryDraw]);

  const onSecondaryLoad = useCallback(() => {
    secondaryLoadedRef.current = true;
    tryDraw();
  }, [tryDraw]);

  return (
    <Box width={width} height={height} bg="gray.500" pos="relative" {...props}>
      {showOverlay && (
        <Flex
          flex={1}
          bg="blackAlpha.700"
          height="100%"
          justifyContent="center"
          alignItems="center"
          p="5"
          pos="absolute"
          zIndex={1}
        >
          <Text opacity={1} textAlign="center">
            Select colors and handle pattern to see your handle design!
          </Text>
        </Flex>
      )}
      <Box ref={threeRef} />
      <Text fontSize="sm" textAlign="center" color="whiteAlpha.700" mt={1}>
        Click and drag to rotate
      </Text>
      <img
        crossOrigin="anonymous"
        style={{ display: 'none' }}
        src={primaryImage}
        id="primary-image-uri"
        alt="primary-color"
        onLoad={onPrimaryLoad}
      />
      <img
        crossOrigin="anonymous"
        style={{ display: 'none' }}
        src={secondaryImage}
        id="secondary-image-uri"
        alt="secondary-color"
        onLoad={onSecondaryLoad}
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
