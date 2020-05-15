import React from 'react';
import { Box, Image, Text } from '@chakra-ui/core';
import styled from '@emotion/styled';
import { Link } from 'gatsby';

const Thumbnail = styled(Image)`
  object-fit: cover;
  border-radius: ${(props: any) => props.theme.radii.md};
`;

type Props = {
  title: string;
  image?: string;
  price: number;
  slug: string;
};

const AccessoryCard = ({ title, price, image, slug }: Props) => (
  <Link to={slug}>
    <Box>
      <Thumbnail src={image} alt={title} />
      <Box mt="3">
        <Text>{title}</Text>
        <Text fontFamily="heading">${price}</Text>
      </Box>
    </Box>
  </Link>
);

export default AccessoryCard;
