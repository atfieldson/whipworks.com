import React, { useMemo, useState } from 'react';
import { Box, Text, Flex, Image, SimpleGrid } from '@chakra-ui/react';
import styled from '@emotion/styled';
import {
  galleryItems,
  GalleryWhip,
  GalleryBreakImage,
  GalleryItem,
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

type WhipImageProps = {
  src: string;
  alt: string;
  specs: GalleryWhip['specs'];
  whipId: string;
};

const WhipImage = ({ src, alt, specs, whipId }: WhipImageProps) => (
  <ImageContainer>
    <Image
      src={src}
      alt={alt}
      width="100%"
      height="auto"
      objectFit="cover"
      aspectRatio="4/3"
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
  <ImageContainer>
    <Image
      src={item.image}
      alt={item.description}
      width="100%"
      height="auto"
      objectFit="cover"
    />
  </ImageContainer>
);

const WhipGallery = () => {
  // Separate whips from break images
  const whips = galleryItems.filter(
    (item): item is GalleryWhip => item.type === 'bullwhip' || item.type === 'fantasy'
  );
  const breaks = galleryItems.filter(
    (item): item is GalleryBreakImage => item.type === 'break'
  );

  // Randomize whips once per page load, then organize by image type
  const galleryLayout = useMemo(() => {
    const shuffled = shuffle(whips);
    const shuffledBreaks = shuffle(breaks);

    // Build sections: Transition, Concho break, Wide, Concho break, Handle
    const items: { type: 'whip'; angle: string; whip: GalleryWhip }[] | { type: 'break'; item: GalleryBreakImage }[] = [];

    const sections: Array<{
      label: string;
      entries: Array<
        | { kind: 'whip'; angle: 'wide' | 'transition' | 'handle'; whip: GalleryWhip }
        | { kind: 'break'; item: GalleryBreakImage }
      >;
    }> = [
      {
        label: 'Transition',
        entries: shuffled
          .filter((w) => w.images.transition)
          .map((w) => ({ kind: 'whip' as const, angle: 'transition' as const, whip: w })),
      },
      {
        label: '',
        entries: shuffledBreaks.length > 0
          ? [{ kind: 'break' as const, item: shuffledBreaks[0] }]
          : [],
      },
      {
        label: 'Wide',
        entries: shuffled
          .filter((w) => w.images.wide)
          .map((w) => ({ kind: 'whip' as const, angle: 'wide' as const, whip: w })),
      },
      {
        label: '',
        entries: shuffledBreaks.length > 1
          ? [{ kind: 'break' as const, item: shuffledBreaks[1] }]
          : [],
      },
      {
        label: 'Handle',
        entries: shuffled
          .filter((w) => w.images.handle)
          .map((w) => ({ kind: 'whip' as const, angle: 'handle' as const, whip: w })),
      },
      {
        label: '',
        entries: shuffledBreaks.length > 2
          ? [{ kind: 'break' as const, item: shuffledBreaks[2] }]
          : [],
      },
    ];

    return sections;
  }, []);

  return (
    <Box mt="6">
      {galleryLayout.map((section, sectionIdx) => (
        <Box key={sectionIdx} mb="6">
          {section.label && (
            <Text fontSize="lg" fontWeight="bold" mb="3" textTransform="uppercase" letterSpacing="wide" color="gray.600">
              {section.label}
            </Text>
          )}
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing="4">
            {section.entries.map((entry, entryIdx) => {
              if (entry.kind === 'break') {
                return <BreakImage key={entry.item.id} item={entry.item} />;
              }
              const { whip, angle } = entry;
              const src = whip.images[angle];
              if (!src) return null;
              return (
                <WhipImage
                  key={`${whip.id}-${angle}`}
                  src={src}
                  alt={`${whip.id} ${angle}`}
                  specs={whip.specs}
                  whipId={whip.id}
                />
              );
            })}
          </SimpleGrid>
        </Box>
      ))}
    </Box>
  );
};

export default WhipGallery;
