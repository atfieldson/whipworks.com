import React from 'react';
import { Box, Flex, Text, Image, Badge } from '@chakra-ui/react';
import { Link } from 'gatsby';

type ImageData = {
  url: string;
  caption?: string;
};

type Props = {
  title: string;
  headerImage?: string;
  images: ImageData[];
  price: number;
  slug: string;
  isNew?: boolean;
};

const SpecialtyWhipGridCard = ({
  title,
  headerImage,
  images,
  price,
  slug,
  isNew,
}: Props) => {
  const wideImage = images?.[0]?.url;
  const transitionImage = images?.[1]?.url;

  return (
    <Box
      as={Link}
      to={slug}
      display="block"
      role="group"
      _hover={{ textDecoration: 'none' }}
    >
      {/* Header logo */}
      {headerImage && (
        <Image
          src={headerImage}
          maxH="55px"
          maxW="100%"
          objectFit="contain"
          objectPosition="center"
          alt={`${title} logo`}
          mb="2"
          mx="auto"
          display="block"
        />
      )}

      {/* Image container with hover crossfade */}
      <Box
        position="relative"
        overflow="hidden"
        borderRadius="md"
        aspectRatio="8/5"
        sx={{
          '@media (hover: hover)': {
            '&:hover .transition-img': { opacity: 1 },
            '&:hover .wide-img': { opacity: 0 },
          },
        }}
      >
        {/* Wide image (default) */}
        {wideImage && (
          <Image
            className="wide-img"
            src={wideImage}
            alt={images?.[0]?.caption || title}
            position="absolute"
            top="0"
            left="0"
            w="100%"
            h="100%"
            objectFit="cover"
            transition="opacity 0.4s ease"
          />
        )}

        {/* Transition image (shown on hover) */}
        {transitionImage && (
          <Image
            className="transition-img"
            src={transitionImage}
            alt={images?.[1]?.caption || `${title} detail`}
            position="absolute"
            top="0"
            left="0"
            w="100%"
            h="100%"
            objectFit="cover"
            opacity={0}
            transition="opacity 0.4s ease"
          />
        )}

        {/* New badge */}
        {isNew && (
          <Badge
            position="absolute"
            top="3"
            right="3"
            bg="blue.200"
            color="gray.900"
            fontSize="xs"
            fontWeight="bold"
            px="2"
            py="0.5"
            borderRadius="sm"
            textTransform="uppercase"
            letterSpacing="wider"
          >
            New
          </Badge>
        )}
      </Box>

      {/* Title and price */}
      <Flex mt="2" align="baseline" justify="space-between">
        <Text fontWeight="bold" fontSize="md">
          {title}
        </Text>
        <Text fontSize="sm" opacity={0.6} whiteSpace="nowrap" ml="2">
          Starting at ${price}
        </Text>
      </Flex>
    </Box>
  );
};

export default SpecialtyWhipGridCard;
