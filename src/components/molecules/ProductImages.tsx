import React, { useState } from 'react';
import { Flex, Stack, Image } from '@chakra-ui/react';
import ImageButton from '../atoms/ImageButton';

type Props = {
  images?: any[];
};

const ProductImages = ({ images }: Props) => {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <Flex flex="1" direction="column" maxW={{ base: '450px', sm: '100%' }}>
      <Image
        bg="gray.800"
        maxW="460px"
        mr="sm"
        borderRadius="md"
        objectFit="contain"
        src={images && images[activeImage]}
      />
      <Stack direction="row" mt="5" spacing="5" flexWrap="wrap" maxW="100%">
        {images &&
          images.length > 1 &&
          images.map((image, index) => (
            <ImageButton
              key={index}
              isSelected={activeImage === index}
              onClick={() => setActiveImage(index)}
              src={image}
              height="100px"
              width="100px"
              minW="100px"
              mb="4"
            />
          ))}
      </Stack>
    </Flex>
  );
};

export default ProductImages;
