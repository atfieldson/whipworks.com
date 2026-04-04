import React, { useMemo } from 'react';
import { Box, Text, Flex, Image, SimpleGrid } from '@chakra-ui/react';
import styled from '@emotion/styled';
import {
  galleryItems,
  GalleryWhip,
  GalleryBreakImage,
} from './constants/galleryWhips';

const ImageContainer = styled(Box)`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;

  & img {
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.1);
  }

  &:hover .specs-overlay {
    opacity: 1;
  }
`;

const SpecsOverlay = styled(Flex)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.85));
  padding: 40px 12px 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
  flex-direction: column;
`;

/**
 * Shuffles an array using Fisher-Yates. Returns a new array.
 */
const shuffle = <T,>(arr: T[]): T[] => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const SpecLabel = ({ label, value }: { label: string; value: string | null }) => {
  if (!value) return null;
  return (
    <Flex justifyContent="space-between" fontSize="xs">
      <Text color="gray.300">{label}</Text>
      <Text color="white" fontWeight="bold">{value}</Text>
    </Flex>
  );
};

export type WhipImageProps = {
  src: string;
  alt: string;
  specs: GalleryWhip['specs'];
  whipId: string;
};

export const WhipImage = ({ src, alt, specs, whipId }: WhipImageProps) => (
  <ImageContainer height="100%">
    <Image
      src={src}
      alt={alt}
      width="100%"
      maxW="800px"
      height="100%"
      objectFit="contain"
    />
    <SpecsOverlay className="specs-overlay">
      <Text color="white" fontWeight="bold" fontSize="sm" mb="1">
        {whipId}
      </Text>
      <SpecLabel label="Primary" value={specs.primaryColor} />
      <SpecLabel label="Secondary" value={specs.secondaryColor} />
      <SpecLabel label="Handle" value={specs.handleDesign} />
      <SpecLabel label="Waxed" value={specs.waxed ? 'Yes' : 'No'} />
      <SpecLabel label="Length" value={specs.whipLength} />
      <SpecLabel label="Handle Length" value={specs.handleLength} />
      <SpecLabel label="Concho" value={specs.concho} />
      {specs.collar !== 'None' && <SpecLabel label="Collar" value={specs.collar} />}
      {specs.heelLoop !== 'No Heel Loop' && specs.heelLoop !== 'None' && (
        <SpecLabel label="Heel Loop" value={specs.heelLoop} />
      )}
    </SpecsOverlay>
  </ImageContainer>
);

const BreakImage = ({ item }: { item: GalleryBreakImage }) => (
  <ImageContainer mx="auto" maxW="800px">
    <Image
      src={item.image}
      alt={item.description}
      width="100%"
      maxW="800px"
      height="auto"
      objectFit="cover"
    />
  </ImageContainer>
);

/**
 * Gallery layout pattern — repeating groups of mixed image types
 * with concho break images between groups.
 *
 * Pattern per cycle:
 *   3 Transition (3-col grid, medium)
 *   Concho break (full width, large)
 *   2 Wide (2-col grid, large)
 *   4 Handle (4-col grid, small)
 *   Concho break (full width, large)
 *   1 Wide (full width, hero)
 *   3 Handle (3-col grid, medium)
 *   2 Transition (2-col grid, large)
 *   Concho break (full width, large)
 */

type GalleryBlock =
  | { kind: 'whips'; angle: 'wide' | 'transition' | 'handle'; columns: number; whips: GalleryWhip[] }
  | { kind: 'break'; item: GalleryBreakImage };

const WhipGallery = () => {
  const whips = galleryItems.filter(
    (item): item is GalleryWhip => item.type === 'bullwhip' || item.type === 'fantasy'
  );
  const breaks = galleryItems.filter(
    (item): item is GalleryBreakImage => item.type === 'break'
  );

  const blocks = useMemo(() => {
    const shuffledWhips = shuffle(whips);
    const shuffledBreaks = shuffle(breaks);

    // Build pools of images by angle
    const transitionPool = shuffle(
      shuffledWhips.filter((w) => w.images.transition)
    );
    const widePool = shuffle(
      shuffledWhips.filter((w) => w.images.wide)
    );
    const handlePool = shuffle(
      shuffledWhips.filter((w) => w.images.handle)
    );

    // Indexes to pull from each pool
    let tIdx = 0;
    let wIdx = 0;
    let hIdx = 0;
    let bIdx = 0;

    const take = (pool: GalleryWhip[], idx: { val: number }, count: number): GalleryWhip[] => {
      const result: GalleryWhip[] = [];
      for (let i = 0; i < count; i++) {
        if (idx.val < pool.length) {
          result.push(pool[idx.val]);
          idx.val++;
        }
      }
      return result;
    };

    const tRef = { val: 0 };
    const wRef = { val: 0 };
    const hRef = { val: 0 };

    const nextBreak = (): GalleryBreakImage | null => {
      if (bIdx < shuffledBreaks.length) {
        return shuffledBreaks[bIdx++];
      }
      // Cycle breaks if we run out
      if (shuffledBreaks.length > 0) {
        bIdx = 1;
        return shuffledBreaks[0];
      }
      return null;
    };

    const result: GalleryBlock[] = [];

    // Block 1: 3 Transition images (3 columns)
    const t1 = take(transitionPool, tRef, 3);
    if (t1.length) result.push({ kind: 'whips', angle: 'transition', columns: 3, whips: t1 });

    // Break
    const b1 = nextBreak();
    if (b1) result.push({ kind: 'break', item: b1 });

    // Block 2: 2 Wide images (2 columns, larger)
    const w1 = take(widePool, wRef, 2);
    if (w1.length) result.push({ kind: 'whips', angle: 'wide', columns: 2, whips: w1 });

    // Block 3: 4 Handle images (4 columns, smaller)
    const h1 = take(handlePool, hRef, 4);
    if (h1.length) result.push({ kind: 'whips', angle: 'handle', columns: 4, whips: h1 });

    // Break
    const b2 = nextBreak();
    if (b2) result.push({ kind: 'break', item: b2 });

    // Block 4: 1 Wide hero (full width)
    const w2 = take(widePool, wRef, 1);
    if (w2.length) result.push({ kind: 'whips', angle: 'wide', columns: 1, whips: w2 });

    // Block 5: 3 Handle images (3 columns)
    const h2 = take(handlePool, hRef, 3);
    if (h2.length) result.push({ kind: 'whips', angle: 'handle', columns: 3, whips: h2 });

    // Block 6: 2 Transition images (2 columns)
    const t2 = take(transitionPool, tRef, 2);
    if (t2.length) result.push({ kind: 'whips', angle: 'transition', columns: 2, whips: t2 });

    // Break
    const b3 = nextBreak();
    if (b3) result.push({ kind: 'break', item: b3 });

    // Block 7: remaining images in mixed groups
    const remainingT = take(transitionPool, tRef, transitionPool.length);
    if (remainingT.length) result.push({ kind: 'whips', angle: 'transition', columns: 3, whips: remainingT });

    const remainingW = take(widePool, wRef, widePool.length);
    if (remainingW.length) result.push({ kind: 'whips', angle: 'wide', columns: 2, whips: remainingW });

    const remainingH = take(handlePool, hRef, handlePool.length);
    if (remainingH.length) result.push({ kind: 'whips', angle: 'handle', columns: 4, whips: remainingH });

    return result;
  }, []);

  return (
    <Box mt="6">
      {blocks.map((block, blockIdx) => {
        if (block.kind === 'break') {
          return (
            <Box key={block.item.id} mb="4">
              <BreakImage item={block.item} />
            </Box>
          );
        }

        return (
          <Box key={`block-${blockIdx}`} mb="4">
            <SimpleGrid columns={{ base: 1, sm: Math.min(block.columns, 2), md: block.columns }} spacing="3">
              {block.whips.map((whip) => {
                const src = whip.images[block.angle];
                if (!src) return null;
                return (
                  <WhipImage
                    key={`${whip.id}-${block.angle}`}
                    src={src}
                    alt={`${whip.id} ${block.angle}`}
                    specs={whip.specs}
                    whipId={whip.id}
                  />
                );
              })}
            </SimpleGrid>
          </Box>
        );
      })}
    </Box>
  );
};

export default WhipGallery;
