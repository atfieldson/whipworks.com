import React, { useMemo } from 'react';
import { Box, Text, Flex, Image, SimpleGrid } from '@chakra-ui/react';
import styled from '@emotion/styled';
import {
  snakewhipGalleryItems,
  SnakewhipGalleryWhip,
  SnakewhipGalleryBreakImage,
} from './constants/gallerySnakewhips';

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
  padding: 30px 8px 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
  flex-direction: column;
`;

const SpecLabel = ({ label, value }: { label: string; value: string | null }) => {
  if (!value) return null;
  return (
    <Box>
      <Text color="gray.400" fontSize={{ base: '2xs', xl: 'sm' }} lineHeight="1.2">{label}</Text>
      <Text color="white" fontWeight="bold" fontSize={{ base: 'xs', xl: 'md' }} lineHeight="1.2">{value}</Text>
    </Box>
  );
};

type SnakewhipImageProps = {
  src: string;
  alt: string;
  specs: SnakewhipGalleryWhip['specs'];
  whipId: string;
};

export const SnakewhipImage = ({ src, alt, specs, whipId }: SnakewhipImageProps) => (
  <ImageContainer height="100%">
    <Image
      src={src}
      alt={alt}
      width="100%"
      maxW="800px"
      height="100%"
      objectFit="cover"
    />
    <SpecsOverlay className="specs-overlay">
      <SimpleGrid columns={2} spacing="1">
        <SpecLabel label="Primary" value={specs.primaryColor} />
        <SpecLabel label="Secondary" value={specs.secondaryColor} />
        <SpecLabel label="Handle" value={specs.handleDesign} />
        <SpecLabel label="Waxed" value={specs.waxed ? 'Yes' : 'No'} />
        <SpecLabel label="Length" value={specs.whipLength} />
        <SpecLabel label="Concho" value={specs.concho} />
        {specs.heelLoop !== 'No Heel Loop' && specs.heelLoop !== 'None' && (
          <SpecLabel label="Heel Loop" value={specs.heelLoop} />
        )}
      </SimpleGrid>
    </SpecsOverlay>
  </ImageContainer>
);

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

const SnakewhipGallery = () => {
  const whips = snakewhipGalleryItems.filter(
    (item): item is SnakewhipGalleryWhip => item.type === 'snakewhip'
  );

  const imageEntries = useMemo(() => {
    const entries: { whip: SnakewhipGalleryWhip; angle: string; src: string }[] = [];
    for (const whip of whips) {
      const angles = Object.entries(whip.images) as [string, string | undefined][];
      for (const [angle, src] of angles) {
        if (src) {
          entries.push({ whip, angle, src });
        }
      }
    }
    return shuffle(entries);
  }, []);

  // If no gallery items yet, show a placeholder message
  if (imageEntries.length === 0) {
    return (
      <Box mt="6" textAlign="center" py="12">
        <Text fontSize="lg" color="gray.400" fontStyle="italic">
          Snakewhip gallery coming soon!
        </Text>
      </Box>
    );
  }

  // Split into rows: first row 3 columns, second row 2 columns wide, repeat
  const rows: { columns: number; items: typeof imageEntries }[] = [];
  let idx = 0;
  const pattern = [3, 2, 3, 2];
  let patIdx = 0;
  while (idx < imageEntries.length) {
    const cols = pattern[patIdx % pattern.length];
    rows.push({ columns: cols, items: imageEntries.slice(idx, idx + cols) });
    idx += cols;
    patIdx++;
  }

  return (
    <Box mt="6">
      {rows.map((row, rowIdx) => (
        <Box key={`row-${rowIdx}`} mb="4">
          <SimpleGrid columns={{ base: 1, sm: Math.min(row.columns, 2), md: row.columns }} spacing="3">
            {row.items.map((entry) => (
              <Box
                key={`${entry.whip.id}-${entry.angle}`}
                overflow="hidden"
                borderRadius="8px"
              >
                <SnakewhipImage
                  src={entry.src}
                  alt={`${entry.whip.id} ${entry.angle}`}
                  specs={entry.whip.specs}
                  whipId={entry.whip.id}
                />
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      ))}
    </Box>
  );
};

export default SnakewhipGallery;
