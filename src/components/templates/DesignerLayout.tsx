import React, { ReactNode } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import styled from '@emotion/styled';

const FullWidthContainer = styled(Box)`
  width: 100vw;
  position: relative;
  left: 50%;
  margin-left: -50vw;
  padding: 0 30px;
`;

const StickyPanel = styled(Box)`
  position: sticky;
  top: 100px; /* header height + buffer */
  align-self: flex-start;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
`;

type Props = {
  bannerImage?: string;
  leftPanel: ReactNode;
  rightPanel: ReactNode;
};

const DesignerLayout = ({ bannerImage, leftPanel, rightPanel }: Props) => (
  <FullWidthContainer>
    <Flex
      direction={{ base: 'column', md: 'row' }}
      gap={{ base: '4', md: '6' }}
      alignItems="flex-start"
    >
      {/* Left panel — scrollable: 3D preview, gallery */}
      <Box flex="1" width="100%">
        {leftPanel}
      </Box>

      {/* Right panel — sticky: options, summary, price, Add to Cart */}
      <StickyPanel
        flex="1"
        width="100%"
        display={{ base: 'none', md: 'block' }}
      >
        {rightPanel}
      </StickyPanel>

      {/* Mobile: right panel renders below, not sticky */}
      <Box
        width="100%"
        display={{ base: 'block', md: 'none' }}
      >
        {rightPanel}
      </Box>
    </Flex>
  </FullWidthContainer>
);

export default DesignerLayout;
