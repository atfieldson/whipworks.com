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
    <Flex direction={isReversed ? 'row-reverse' : 'row'} flex="1">
      <Image
        src={image}
        objectFit="cover"
        width={isSmall ? '250px' : '400px'}
        height={isSmall ? '150px' : '250px'}
        mr={isReversed ? 0 : 8}
        ml={isReversed ? 8 : 0}
        borderRadius="md"
        alt={title}
      />
      <Box textAlign={isReversed ? 'right' : 'left'}>
        <Image
          maxH={isSmall ? '40px' : '60px'}
          maxW={isSmall ? '200px' : '300px'}
          objectFit="contain"
          src={headerImage}
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
