import React from 'react';
import {
  Box,
  Heading,
  Text,
  Image,
  SimpleGrid,
  Flex,
  Link as ChakraLink,
  AspectRatio,
} from '@chakra-ui/react';
import { Link } from 'gatsby';

const CLOUDFRONT_BASE = 'https://d3ruufruf2uqog.cloudfront.net/adam';

const AboutContent = () => {
  return (
    <Box maxW="900px">
      {/* Hero Section */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align="center"
        gap={{ base: 6, md: 10 }}
        mb="16"
      >
        <Box
          flexShrink={0}
          w={{ base: '260px', md: '300px' }}
          borderRadius="md"
          overflow="hidden"
        >
          <Image
            src={`${CLOUDFRONT_BASE}/adamPortrait1.jpg`}
            alt="Adam Fieldson, whipmaker, holding two handmade stockwhips"
            borderRadius="md"
            w="100%"
          />
        </Box>
        <Box>
          <Heading letterSpacing="wide" mb="5">
            About the Whipmaker
          </Heading>
          <Text fontSize="lg" lineHeight="tall">
            Every WhipWorks whip is built by hand, one plait at a time, by me
            — Adam Fieldson. No factory, no production line. Just a craftsman,
            a spool of paracord, and a passion for a modern take on an art
            form that's been around for centuries.
          </Text>
        </Box>
      </Flex>

      {/* Origin Story */}
      <Box as="section" mb="16">
        <Heading size="lg" letterSpacing="wide" mb="5">
          How It Started
        </Heading>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 6, md: 10 }}
        >
          <Box flex="1">
            <Text mb="4" lineHeight="tall">
              My fascination with whips started where it does for a lot of us
              — Indiana Jones. I probably wore out those VHS tapes as a kid in
              the '90s. But it went from fascination to obsession when my
              family moved to Melbourne, Australia for a few years. My mom
              picked up a cheap 4-plait stockwhip with a cane handle at a
              local tac shop, and I spent hours in the backyard learning to
              crack it, guided by nothing but a Mick Denigan instructional VHS
              and sheer stubbornness.
            </Text>
            <Text mb="4" lineHeight="tall">
              Years later, in college, I stumbled on Nick Schrader's viral
              "How to Make a Bullwhip" video and thought — <em>I could do
              that.</em> I ordered some paracord, and Bullwhip #1 was born: an
              all-diamond-plaited green monstrosity. It wasn't pretty, but it
              cracked, and I was hooked.
            </Text>
            <Text lineHeight="tall">
              Life took me to New York City for a while to pursue other
              interests, but I was starved for a creative outlet. When I
              eventually landed in Minneapolis with more space, all that
              pent-up creative energy came pouring out — and it went straight
              into whipmaking. Those early years were a blast. I'd make whips,
              sell them on Etsy, and pour the earnings right back into more
              materials and more experiments. WhipWorks has been a constant in
              my life for over a decade now, and I'm in the middle of a bit of
              a renaissance — reinspired and excited about what's coming next.
            </Text>
          </Box>
          <Box
            flexShrink={0}
            w={{ base: '100%', md: '280px' }}
            alignSelf="center"
          >
            <Image
              src={`${CLOUDFRONT_BASE}/adamPortrait4.jpg`}
              alt="Adam holding a coiled bullwhip"
              borderRadius="md"
              w="100%"
            />
          </Box>
        </Flex>
      </Box>

      {/* The Craft */}
      <Box as="section" mb="16">
        <Heading size="lg" letterSpacing="wide" mb="5">
          The Craft
        </Heading>
        <Text mb="4" lineHeight="tall">
          I work with 550 paracord, and I've spent years pushing the material
          to its limits. I started with paracord because of how accessible it
          is, but I stayed because of how versatile it is. With over 30 colors
          to work with, the creative possibilities are enormous — from clean,
          classic designs to bold custom color combinations.
        </Text>
        <Text mb="4" lineHeight="tall">
          Each whip takes roughly 5 to 10 hours to build, depending on the
          length and features. I love plaiting — it's my safe space. Put
          something on in the background and just plait. There's a rhythm to
          it that I never get tired of.
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="6" my="8">
          <Image
            src={`${CLOUDFRONT_BASE}/adamHands1.jpg`}
            alt="Close-up of hands plaiting paracord"
            borderRadius="md"
          />
          <Image
            src={`${CLOUDFRONT_BASE}/adamHands2.jpg`}
            alt="Close-up of hands working with needle and paracord"
            borderRadius="md"
            display={{ base: 'none', md: 'block' }}
          />
        </SimpleGrid>
        <Text lineHeight="tall">
          I believe my whips are among the highest-quality 550 paracord
          bullwhips you can order. They're built strong for target work and
          rugged outdoor use, and they're equally at home on a stage or at a
          cosplay event. Functional art — that's what I'm going for.
        </Text>
      </Box>

      {/* Who Are Whips For */}
      <Box as="section" mb="16">
        <Heading size="lg" letterSpacing="wide" mb="5">
          Who Are Whips For?
        </Heading>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 6, md: 10 }}
        >
          <Box flex="1">
            <Text lineHeight="tall">
              My whips are for everyone — from the rural hobbyist to the urban
              burlesque performer. I'm aware that whips carry a complicated
              history, and I don't take that lightly. But the whip is also an
              incredible tool — the first man-made object to break the sound
              barrier. I want WhipWorks to be a welcoming place for anyone who
              appreciates the craft.
            </Text>
          </Box>
          <Box
            flexShrink={0}
            w={{ base: '100%', md: '280px' }}
            alignSelf="center"
          >
            <Image
              src={`${CLOUDFRONT_BASE}/adamWide1.jpg`}
              alt="Adam cracking a whip"
              borderRadius="md"
              w="100%"
            />
          </Box>
        </Flex>
      </Box>

      {/* Sharing the Craft */}
      <Box as="section" mb="16">
        <Heading size="lg" letterSpacing="wide" mb="5">
          Sharing the Craft
        </Heading>
        <Text mb="6" lineHeight="tall">
          One of the things that brings me the most joy is hearing from new
          whipmakers who've used my tutorials to build their first whip. I've
          put together an{' '}
          <ChakraLink
            as={Link}
            to="/whip-making-blueprints"
            textDecoration="underline"
          >
            instructional video series and printable blueprints
          </ChakraLink>{' '}
          that walk you through the process step by step, and I plan to do a
          lot more to share this craft with others. If you've ever been
          curious about whipmaking, I'd love to help you get started.
        </Text>
        <Box maxW="560px" mx="auto">
          <AspectRatio ratio={16 / 9}>
            <iframe
              src="https://www.youtube.com/embed/1vbdQ3zavmI?start=11"
              title="How to Make a Bullwhip - WhipWorks"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: '8px' }}
            />
          </AspectRatio>
        </Box>
      </Box>

      {/* CTA */}
      <Box as="section" mb="8">
        <Text fontSize="lg" lineHeight="tall">
          Have questions about a custom whip, want to talk shop, or just want
          to say hey? I'd love to hear from you —{' '}
          <ChakraLink as={Link} to="/contact" textDecoration="underline">
            get in touch
          </ChakraLink>
          .
        </Text>
      </Box>
    </Box>
  );
};

export default AboutContent;
