import React from 'react';
import { Box, Image, Text } from '@chakra-ui/react';
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
  <Box as={Link} to={slug}>
    <Thumbnail src={image} alt={title} />
    <Box mt="3">
      <Text>{title}</Text>
      <Text fontFamily="heading">${price}</Text>
    </Box>
  </Box>
);

export default AccessoryCard;
