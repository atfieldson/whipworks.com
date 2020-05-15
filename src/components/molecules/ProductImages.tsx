import React, { useState } from 'react';
import { Flex, Stack, Image } from '@chakra-ui/core';
import styled from '@emotion/styled';
import ImageButton from '../atoms/ImageButton';

const FakeImage = styled(Image)`
  background-color: ${(props) => props.theme.colors.gray['800']};
  max-width: 460px;
  margin-right: ${(props: any) => props.theme.space['2']};
  border-radius: ${(props: any) => props.theme.radii.md};
  object-fit: contain;
`;

type Props = {
  images?: any[];
};

const ProductImages = ({ images }: Props) => {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <Flex flex="1" direction="column" maxW={{ base: '450px', sm: '100%' }}>
      <FakeImage src={images && images[activeImage]} />
      <Stack isInline mt="5" spacing="5" flexWrap="wrap" maxW="100%">
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
