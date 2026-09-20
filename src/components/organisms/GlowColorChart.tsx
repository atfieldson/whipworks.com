import React, { useState } from 'react';
import { Box, Flex, Button, Image, Text, SimpleGrid, AspectRatio } from '@chakra-ui/react';

const BASE =
  'https://whipworks.s3.us-east-2.amazonaws.com/paracordImages/glowParacord';

// Displayed in dropdown order (matches the Circus Whip's Color selectors)
const COLORS = ['White', 'Cyan', 'Blue', 'Green', 'Yellow', 'Pink'];

type Mode = 'regular' | 'uv' | 'glowing';

// suffix maps to the S3 filename: Glow{Color}{suffix}.jpg
const MODES: { key: Mode; label: string; suffix: string }[] = [
  { key: 'regular', label: 'Regular Light', suffix: '' },
  { key: 'uv', label: 'UV Light', suffix: 'UV' },
  { key: 'glowing', label: 'Glowing', suffix: 'Glowing' },
];

const GlowColorChart = () => {
  const [mode, setMode] = useState<Mode>('regular');
  const active = MODES.find((m) => m.key === mode) as (typeof MODES)[number];

  return (
    <Box mt="4" mb="2">
      <Text
        fontWeight="bold"
        fontSize="sm"
        textTransform="uppercase"
        letterSpacing="wider"
        mb="2"
      >
        Glow Paracord Colours
      </Text>

      {/* Lighting-mode tabs */}
      <Flex gap="2" mb="3" wrap="wrap">
        {MODES.map((m) => (
          <Button
            key={m.key}
            size="sm"
            onClick={() => setMode(m.key)}
            variant={mode === m.key ? 'solid' : 'outline'}
            colorScheme="blue"
          >
            {m.label}
          </Button>
        ))}
      </Flex>

      {/* 2 rows x 3 columns of spool images for the selected mode */}
      <SimpleGrid columns={3} spacing="3">
        {COLORS.map((c) => (
          <Box key={c} textAlign="center">
            <AspectRatio ratio={1} borderRadius="md" overflow="hidden">
              <Image
                src={`${BASE}/Glow${c}${active.suffix}.jpg`}
                alt={`${c} glow paracord under ${active.label.toLowerCase()}`}
                objectFit="contain"
                bg="black"
                loading="lazy"
              />
            </AspectRatio>
            <Text mt="1" fontSize="xs">
              {c}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      <Text mt="2" fontSize="xs" fontStyle="italic" opacity={0.7}>
        Shown under {active.label.toLowerCase()}. UV shots are lit with a black
        light; glowing shots are after charging.
      </Text>
    </Box>
  );
};

export default GlowColorChart;
