import React, { ReactNode } from 'react';
import {
  AccordionItem,
  AccordionHeader,
  AccordionIcon,
  Text,
  AccordionPanel,
} from '@chakra-ui/core';

type Props = {
  label: string;
  children: ReactNode;
  isOpen?: boolean;
  onChange?: () => void;
};

const AccordionSection = ({ label, children, isOpen, onChange }: Props) => (
  <AccordionItem isOpen={isOpen} onChange={onChange}>
    <AccordionHeader>
      <Text fontWeight="bold">{label}</Text>
      <AccordionIcon ml="auto" />
    </AccordionHeader>
    <AccordionPanel>{children}</AccordionPanel>
  </AccordionItem>
);

export default AccordionSection;
