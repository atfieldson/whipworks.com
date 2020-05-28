import React from 'react';
import { Box, Button, Heading, Text } from '@chakra-ui/core';
import styled from '@emotion/styled';
import { Link } from 'gatsby';
import { Carousel } from 'react-responsive-carousel';

const HeroCarouselContainer = styled(Carousel)`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  margin-top: -100px;
  margin-bottom: 64px;
  /* height: 80vh;
min-height: 500px; */
`;

const HeroText = styled(Text)`
  position: absolute;
  left: 60%;
  margin-left: -50vw;
  margin-right: -50vw;
  color: white;
  font-size: 1.8vw;
`;

const HeroHeadingWhite = styled(Heading)`
  position: absolute;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  color: white;
  background-color: rgba(255, 255, 255, 0);
  border-radius: 10px 10px 10px 10px;
  width: 100vw;
`;

const HeroHeadingBlack = styled(Heading)`
  position: absolute;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  color: black;
  background-color: rgba(255, 255, 255, 0);
  border-radius: 10px 10px 10px 10px;
  width: 100vw;
  text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;
`;

const HeroCarousel = () => {
  return (
    <HeroCarouselContainer
      showArrows={true}
      showThumbs={false}
      infiniteLoop={true}
      showStatus={false}
      useKeyboardArrows={true}
      emulateTouch={true}
      autoPlay={true}
      interval={12000}
    >
      <Box position="relative" textAlign="center">
        <HeroHeadingWhite as="h1" fontSize="4vw" marginTop="35vw">
          Welcome to WhipWorks.com
        </HeroHeadingWhite>
        <HeroText marginTop="40vw" width="80vw" ml="10vw">
          Thanks for coming to check out my work! If you scroll down you'll see some of my specialty
          whips and some more information about WhipWorks Whips. Be sure to check out the
          <Link to="/design-bullwhip"> Design a Bullwhip </Link>
          page to design your own bullwhip!
        </HeroText>
        <img
          src="https://d3ruufruf2uqog.cloudfront.net/bannerImages/heroImages/comoSunset800.jpg"
          alt="Sunset Whip Cracking at Lake Como, Saint Paul, MN"
        />
      </Box>
      <Box>
        <HeroHeadingWhite as="h1" fontSize="4vw" marginTop="5vw">
          The Tools of a WhipMaker
        </HeroHeadingWhite>
        <HeroText marginTop="40vw" width="80vw" ml="10vw">
          Here are just some of the tools I use in the construction of every WhipWorks Whip. These
          items are never less then an arms reach away in the workshop.
        </HeroText>
        <img
          src="https://d3ruufruf2uqog.cloudfront.net/bannerImages/heroImages/topDown.jpg"
          alt="Japan"
        />
      </Box>
      <Box>
        <HeroHeadingBlack as="h1" fontSize="4vw" marginTop="4vw">
          Hundreds of Whips
        </HeroHeadingBlack>
        <HeroHeadingBlack as="h1" fontSize="4vw" marginTop="40vw">
          Sold around the World!
        </HeroHeadingBlack>
        <img
          src="https://d3ruufruf2uqog.cloudfront.net/bannerImages/heroImages/batchesComp.jpg"
          alt="Las Vegas"
        />
        <Text position="absolute" mt="20">
          Hello
        </Text>
      </Box>
    </HeroCarouselContainer>
  );
};

export default HeroCarousel;
