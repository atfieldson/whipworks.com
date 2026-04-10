import React from 'react';
import { Box, Image, Stack } from '@chakra-ui/react';

type Props = {
  images?: string[];
  alt?: string;
};

const ProductImages = ({ images, alt }: Props) => {
  return (
    <Stack spacing="3" w="100%">
      {images &&
        images.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={`${alt || 'Product image'} - ${index + 1}`}
            w="100%"
            borderRadius="md"
            objectFit="contain"
            bg="black"
          />
        ))}
    </Stack>
  );
};

export default ProductImages;
