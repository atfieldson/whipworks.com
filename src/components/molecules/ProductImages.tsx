import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Image, Flex, IconButton, Text } from '@chakra-ui/react';
import { FaTimes } from 'react-icons/fa';

type ImageData = {
  url: string;
  caption?: string;
};

type Props = {
  images?: (ImageData | string)[];
  alt?: string;
};

// Normalize images to always be ImageData objects
const normalizeImages = (images: (ImageData | string)[]): ImageData[] =>
  images.map((img) => (typeof img === 'string' ? { url: img } : img));

const ProductImages = ({ images: rawImages, alt }: Props) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  if (!rawImages || rawImages.length === 0) return null;

  const images = normalizeImages(rawImages);

  const heroImage = images[0];
  const gridImages = images.slice(1);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // Scroll to the clicked image once lightbox opens
  useEffect(() => {
    if (lightboxIndex !== null && imageRefs.current[lightboxIndex]) {
      requestAnimationFrame(() => {
        imageRefs.current[lightboxIndex]?.scrollIntoView({ block: 'start' });
      });
    }
  }, [lightboxIndex]);

  return (
    <>
      <Box w="100%">
        {/* Hero image */}
        <Image
          src={heroImage.url}
          alt={heroImage.caption || `${alt || 'Product image'} - wide view`}
          w="100%"
          borderRadius="md"
          objectFit="contain"
          bg="black"
          cursor="pointer"
          onClick={() => openLightbox(0)}
        />

        {/* Remaining images in masonry layout */}
        {gridImages.length > 0 && (
          <Box
            mt="3"
            sx={{
              columnCount: 2,
              columnGap: '12px',
            }}
          >
            {gridImages.map((image, index) => (
              <Image
                key={index}
                src={image.url}
                alt={image.caption || `${alt || 'Product image'} - ${index + 2}`}
                w="100%"
                mb="3"
                borderRadius="md"
                objectFit="contain"
                bg="black"
                cursor="pointer"
                onClick={() => openLightbox(index + 1)}
                sx={{ breakInside: 'avoid' }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Fullscreen lightbox overlay */}
      {lightboxIndex !== null && (
        <Flex
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="blackAlpha.900"
          zIndex={1000}
          direction="column"
          overflowY="auto"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <Flex justify="flex-end" position="sticky" top="0" zIndex={1001} p="4">
            <IconButton
              aria-label="Close gallery"
              icon={<FaTimes />}
              onClick={closeLightbox}
              size="lg"
              borderRadius="full"
              bg="whiteAlpha.200"
              color="white"
              _hover={{ bg: 'whiteAlpha.400' }}
            />
          </Flex>

          {/* Full-size scrollable images with captions */}
          <Box
            maxW="900px"
            w="100%"
            mx="auto"
            px="4"
            pb="8"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((image, index) => (
              <Box key={index} mb="6">
                <Image
                  ref={(el) => { imageRefs.current[index] = el; }}
                  src={image.url}
                  alt={image.caption || `${alt || 'Product image'} - ${index + 1}`}
                  maxW="100%"
                  objectFit="contain"
                  mx="auto"
                  display="block"
                />
                {image.caption && (
                  <Text
                    mt="2"
                    textAlign="center"
                    fontSize="sm"
                    color="whiteAlpha.700"
                    fontStyle="italic"
                  >
                    {image.caption}
                  </Text>
                )}
              </Box>
            ))}
          </Box>
        </Flex>
      )}
    </>
  );
};

export default ProductImages;
