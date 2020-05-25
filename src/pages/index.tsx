import React, { useState } from 'react';
import { Box, Heading, Text, Stack, Flex, Image, Button } from '@chakra-ui/core';

import Layout from '../components/templates/Layout';
import SEO from '../components/templates/SEO';
import SpecialtyWhipList from '../components/organisms/SpecialtyWhipList';
import InstagramFeed from '../components/organisms/InstagramFeed';
import styled from '@emotion/styled';
import useDocumentScrollThrottled, { ScrollData } from '../../useDocumentScroll';
import FullWidthImage from '../components/atoms/FullWidthImage';
import { Link } from 'gatsby';

const HeroImage = styled(FullWidthImage)`
  height: 80vh;
  min-height: 500px;
`;

const MINIMUM_SCROLL = 350;

const Index = () => {
  const [showHeader, setShowHeader] = useState(false);

  useDocumentScrollThrottled((callbackData: ScrollData) => {
    const { currentScrollTop } = callbackData;
    const isMinimumScrolled = currentScrollTop > MINIMUM_SCROLL;

    setTimeout(() => {
      setShowHeader(isMinimumScrolled);
    }, 200);
  });

  return (
    <Layout headerBackground={showHeader ? undefined : 'transparent'}>
      <SEO title="Home" />
      <HeroImage
        mb="32"
        mt="-100px"
        img="https://d3ruufruf2uqog.cloudfront.net/bannerImages/FB+Banner.jpg"
      />
      <SpecialtyWhipList />
      <Box mt="32">
        <FullWidthImage
          img="https://d3ruufruf2uqog.cloudfront.net/bannerImages/TransitionFeature.jpg"
          mb="24"
        />
        <Heading mb="5">What goes in to a WhipWorks bullwhip?</Heading>
        <Text>
          A WhipWorks whip starts with a steel rod that is attached to a nylon sheath. This sheath
          is then loaded with steel shot. The added weight from the shot encourages a taper that
          effortlessly transfers energy from the heel to the end of the whip. Over this is applied
          the first bolster, which is a wrap to support the transition of the whip (the section
          where the handle and the thong meet). Then the first layer of plaiting is applied, which
          is a 6 plait layer (6 strands of paracord). Over this, a second bolster is applied before
          the 10 plait layer is added. And then, the final 16 plait layer is applied. This final
          layer of plaiting takes much more time, as the pattern in the handle is intricate and
          requires special attention. After plaiting, a concho is permanently attached to the heel
          of the whip, and two accent knots are added to the handle. The whip is then submerged in
          liquid wax, patted dry and hung to set. This waxing make these whips water resistant and
          ready for any weather condition.
        </Text>
        <Stack spacing="12" mt="12">
          <Flex>
            <Image
              height="300px"
              width="300px"
              mr="5"
              src="https://d3ruufruf2uqog.cloudfront.net/makingOfPhotos/layersOfPlaiting.jpg"
            />
            <Box>
              <Heading size="lg" mb="2">
                Triple Plaited
              </Heading>
              <Text>
                Every WhipWorks Bullwhip is triple plated to ensure a superior taper for ease of
                use. Many less expensive whips whip only have 2 or even 1 layer of plaiting. Having
                3 seperate layers of plaiting guarantees the professional quality that you would
                expect from a WhipWorks Bullwhip
              </Text>
            </Box>
          </Flex>
          <Flex>
            <Image
              height="300px"
              width="300px"
              mr="5"
              src="https://d3ruufruf2uqog.cloudfront.net/makingOfPhotos/loadingCore.jpg"
            />
            <Box>
              <Heading size="lg" mb="2">
                Shot Loading the Core
              </Heading>
              <Text>
                Every WhipWorks Bullwhip has a shot loaded core. The inner most strand of material
                is loaded with #8 Steel Shot for a length determined by the overall length of the
                whip. Shot loading the core adds a bit of weight and encourages a strong taper,
                makings WhipWorks Bullwhips more accurate and easier to crack!
              </Text>
            </Box>
          </Flex>
        </Stack>
      </Box>
      <InstagramFeed my="24" />
      <Box mb="12">
        <Heading mb="5">The Anatomy of a Bullwhip</Heading>
        <Image
          src="https://d3ruufruf2uqog.cloudfront.net/bannerImages/AnatomyOfABullwhip.jpg"
          width="100%"
          height="auto"
          objectFit="cover"
        />
        <Text mb="4" mt="5">
          Here is a break down of a Bullwhip. The handle is the stiff portion containing the 1/4"
          steel rod. The mid knot shows the end of the handle, and the beginning of the transition
          (not labeled), which is the beginning portion of the thong. The thong tapers down from 16
          strands all the way to the 4 plait hitch knot. The hitch knot is where the fall is
          attached to the whip. The fall then goes on for about 2 feet and the popper is attached at
          the end.
        </Text>
      </Box>
      <Stack spacing="12" mb="24">
        <Box>
          <Heading size="lg" mb="2">
            How Long is my Bullwhip?
          </Heading>
          <Text>
            The length of a Bullwhip is measured from the HEEL KNOT to the HITCH KNOT. The fall is
            not included in the overall length of the whip, but the handle is. So an 8 foot whip
            will actually be about 10 feet from the hitch knot to the popper (this is the length of
            the whip plus the length of the fall).{' '}
          </Text>
        </Box>
        <Flex>
          <Image
            height="300px"
            width="300px"
            mr="5"
            src="https://d3ruufruf2uqog.cloudfront.net/makingOfPhotos/waxedVsUnwaxed.jpg"
            alt="Waxed vs. Unwaxed"
          />
          <Box>
            <Heading size="lg" mb="2">
              Should I Wax my Bullwhip?
            </Heading>
            <Text>
              Waxing helps to protect the life of your whip. After the whip is completed, it is
              bathed in liquid paraffin wax. The wax penetrates the small air pockets of the whip,
              making it water resistant. Waxing also gives the whip a professional finish, as you
              can see pictured. I ALWAYS recommend waxing your whip.
            </Text>
          </Box>
        </Flex>
        <Button
          borderWidth="1px"
          width="200px"
          alignSelf="center"
          as={Link}
          to="/design-bullwhip"
          bg="rgba(255,255,255,0.08)"
          borderColor="rgba(255,255,255,0.16)"
          _hover={{ bg: 'rgba(255,255,255,0.16)' }}
          _active={{ bg: 'rgba(255,255,255,0.16)' }}
        >
          DESIGN A BULLWHIP
      </Button>
      </Stack>
    </Layout>
  );
};

export default Index;
