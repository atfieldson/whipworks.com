import React, { ReactNode, useRef, useEffect, useState } from 'react';
import { Box, Flex, Button } from '@chakra-ui/react';
import styled from '@emotion/styled';

const FullWidthContainer = styled(Box)`
  width: 100vw;
  position: relative;
  left: 50%;
  margin-left: -50vw;
  padding: 0 30px;
`;

type Props = {
  bannerImage?: string;
  leftPanel: ReactNode;
  leftPanelBottom?: ReactNode;
  rightPanel: ReactNode;
};

const DesignerLayout = ({ bannerImage, leftPanel, leftPanelBottom, rightPanel }: Props) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [showReturnBtn, setShowReturnBtn] = useState(false);

  // Track whether the 3D preview area is visible
  useEffect(() => {
    if (!previewRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show button when the preview is fully out of view
        setShowReturnBtn(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(previewRef.current);
    return () => observer.disconnect();
  }, []);

  const handleReturnToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowReturnBtn(false);
  };

  return (
    <FullWidthContainer>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        gap={{ base: '4', md: '6' }}
        alignItems="flex-start"
      >
        {/* Left panel — scrollable: 3D preview, gallery */}
        <Box flex="1" width="100%" position="relative">
          <Box ref={previewRef}>
            {leftPanel}
          </Box>
          {/* Desktop: bottom content (gallery) stays in left column */}
          {leftPanelBottom && (
            <Box display={{ base: 'none', md: 'block' }}>
              {leftPanelBottom}
            </Box>
          )}

          {/* Return to Top button — sticky, fades in when preview scrolls out */}
          <Button
            onClick={handleReturnToTop}
            position="sticky"
            bottom="20px"
            size="sm"
            bg="blackAlpha.700"
            color="white"
            _hover={{ bg: 'blackAlpha.800' }}
            borderRadius="md"
            opacity={showReturnBtn ? 1 : 0}
            pointerEvents={showReturnBtn ? 'auto' : 'none'}
            transition="opacity 0.4s ease"
            zIndex={2}
            display={{ base: 'none', md: 'inline-flex' }}
          >
            ↑ Return to Top
          </Button>
        </Box>

        {/* Right panel — sticky: options, summary, price, Add to Cart */}
        <Box
          flex="1"
          width="100%"
          minW="0"
          display={{ base: 'none', md: 'block' }}
          position="sticky"
          top="100px"
          alignSelf="flex-start"
        >
          {rightPanel}
        </Box>

        {/* Mobile: right panel renders below preview, above gallery */}
        <Box
          width="100%"
          display={{ base: 'block', md: 'none' }}
        >
          {rightPanel}
        </Box>
      </Flex>

      {/* Mobile: gallery renders below the designer */}
      {leftPanelBottom && (
        <Box display={{ base: 'block', md: 'none' }}>
          {leftPanelBottom}
        </Box>
      )}
    </FullWidthContainer>
  );
};

export default DesignerLayout;
