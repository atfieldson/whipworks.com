import React from 'react';
import { Box, Flex, Text, Image, Button } from '@chakra-ui/react';
import { Link } from 'gatsby';

type Props = {
  isReversed?: boolean;
  size: 'sm' | 'lg';
  headerImage?: string;
  description?: string;
  slug: string;
  image?: string;
  title?: string;
};

const SpecialtyWhipCard = ({
  isReversed,
  size,
  headerImage,
  image,
  description,
  slug,
  title,
}: Props) => {
  const isSmall = size && size === 'sm';
  return (
    <Flex direction={{ base: 'column', md: isReversed ? 'row-reverse' : 'row' }} flex="1">
      <Image
        src={image}
        objectFit="cover"
        width={{ base: '100%', md: isSmall ? '250px' : '400px' }}
        height={{ base: 'auto', md: isSmall ? '150px' : '250px' }}
        aspectRatio={{ base: '8/5', md: 'auto' }}
        mr={{ base: 0, md: isReversed ? 0 : 8 }}
        ml={{ base: 0, md: isReversed ? 8 : 0 }}
        mb={{ base: 4, md: 0 }}
        borderRadius="md"
        alt={title}
      />
      <Box textAlign={{ base: 'left', md: isReversed ? 'right' : 'left' }}>
        <Image
          maxH={isSmall ? '40px' : '100px'}
          maxW={isSmall ? '200px' : '400px'}
          objectFit="contain"
          src={headerImage}
          alt={`${title} logo`}
        />
        <Text mt="1">{description}</Text>
        <Button mt="6" as={Link} to={slug}>
          See More
        </Button>
      </Box>
    </Flex>
  );
};

SpecialtyWhipCard.defaultProps = {
  isReversed: false,
  size: 'sm',
};

export default SpecialtyWhipCard;
