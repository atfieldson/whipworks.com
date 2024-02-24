import React, { ReactNode } from 'react';
import {
  AccordionItem,
  AccordionIcon,
  Text,
  AccordionPanel,
  AccordionButton,
} from '@chakra-ui/react';

type Props = {
  label: string;
  children: ReactNode;
};

const AccordionSection = ({ label, children, ...props }: Props) => (
  <AccordionItem {...props}>
    <AccordionButton>
      <Text fontWeight="bold">{label}</Text>
      <AccordionIcon ml="auto" />
    </AccordionButton>
    <AccordionPanel>{children}</AccordionPanel>
  </AccordionItem>
);

export default AccordionSection;
