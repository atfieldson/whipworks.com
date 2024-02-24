import React from 'react';
import styled from '@emotion/styled';
import { Image, Text, ImageProps, Box } from '@chakra-ui/react';

const Label = styled(Text)`
  font-weight: 600;
  text-align: center;
  margin-top: ${(props: any) => props.theme.space['1']};
  font-size: ${(props: any) => props.theme.fontSizes.sm};
`;

type Props = ImageProps & {
  isSelected?: boolean;
  onClick: () => void;
  label?: string;
};

const ImageButton = ({ onClick, isSelected, label, ...props }: Props) => (
  <Box>
    <Image
      onClick={onClick}
      borderWidth={isSelected ? '3px' : 0}
      borderRadius="md"
      objectFit="cover"
      borderColor="blue.300"
      {...props}
    />
    {label && <Label>{label}</Label>}
  </Box>
);

export default ImageButton;
