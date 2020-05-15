import React from 'react';
import { Button as CButton, ButtonProps } from '@chakra-ui/core';

type Props = ButtonProps & {
  to?: string;
};

/** the same as a chakra button, but has nicer styling for the color theme */
const Button = ({ children, ...props }: Props) => (
  <CButton
    bg="blue.200"
    fontWeight="bold"
    color="#1a140f"
    size="lg"
    _hover={{ backgroundColor: 'blue.600' }}
    {...props}
  >
    {children}
  </CButton>
);

export default Button;
