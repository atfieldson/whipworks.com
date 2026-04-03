import React from 'react';
import { Box, Flex, Button } from '@chakra-ui/react';
import styled from '@emotion/styled';

const NavContainer = styled(Flex)`
  background: #e8ecef;
  border-radius: 10px 10px 0 0;
  overflow-x: auto;
  scrollbar-width: thin;
  padding: 6px 6px 0 6px;
  align-items: flex-end;
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #a0aec0;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const StepButton = styled(Button)<{ isActive: boolean; isCompleted: boolean }>`
  flex-shrink: 0;
  border-radius: 10px 10px 0 0;
  font-size: 1.2rem;
  font-weight: ${(props) => (props.isActive ? '700' : '400')};
  color: ${(props) =>
    props.isActive ? '#1a202c' : props.isCompleted ? '#2D6A4F' : '#718096'};
  background: ${(props) => (props.isActive ? '#ffffff' : 'transparent')};
  padding: 8px 14px;
  height: auto;
  min-width: auto;
  margin-right: 2px;
  border: none;
  border-bottom: ${(props) => (props.isActive ? 'none' : '1px solid #cbd5e0')};

  &:hover {
    background: ${(props) => (props.isActive ? '#ffffff' : '#dde1e5')};
  }
`;

const ArrowButton = styled(Button)`
  flex-shrink: 0;
  background: transparent;
  min-width: 32px;
  padding: 0;
  font-size: 1.2rem;

  &:hover {
    background: #f7fafc;
  }
`;

type Step = {
  label: string;
  isCompleted: boolean;
};

type Props = {
  steps: Step[];
  activeStep: number;
  onStepClick: (index: number) => void;
};

const StepNav = ({ steps, activeStep, onStepClick }: Props) => {
  const canGoBack = activeStep > 0;
  const canGoForward = activeStep < steps.length - 1;

  return (
    <Flex alignItems="center" mb="4">
      <ArrowButton
        aria-label="Previous step"
        size="sm"
        variant="ghost"
        isDisabled={!canGoBack}
        onClick={() => onStepClick(activeStep - 1)}
      >
        &#8249;
      </ArrowButton>
      <NavContainer flex="1">
        {steps.map((step, i) => (
          <StepButton
            key={step.label}
            isActive={i === activeStep}
            isCompleted={step.isCompleted}
            onClick={() => onStepClick(i)}
            variant="unstyled"
          >
            {step.label}
          </StepButton>
        ))}
      </NavContainer>
      <ArrowButton
        aria-label="Next step"
        size="sm"
        variant="ghost"
        isDisabled={!canGoForward}
        onClick={() => onStepClick(activeStep + 1)}
      >
        &#8250;
      </ArrowButton>
    </Flex>
  );
};

export default StepNav;
