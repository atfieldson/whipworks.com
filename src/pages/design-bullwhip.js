import React, { useState, useEffect } from 'react';
import SEO from '../components/seo';
import Layout from '../components/templates/Layout';
import HeaderOffset from '../components/templates/HeaderOffset';
import {
  Flex,
  Text,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionIcon,
  AccordionPanel,
  Stack,
  RadioGroup,
  Radio,
  Button,
} from '@chakra-ui/core';
import WhipColors from '../components/molecules/WhipColors';
import WhipInfo from '../components/atoms/WhipInfo';
import WhipHandles from '../components/molecules/WhipHandles';
import WhipConchos from '../components/molecules/WhipConchos';
import WhipLengths from '../components/molecules/WhipLengths';
import WhipHandleLengths from '../components/molecules/WhipHandleLengths';

const DesignBullwhip = () => {
  const [index, setIndex] = useState(0);
  const [primary, setPrimary] = useState(undefined);
  const [secondary, setSecondary] = useState(undefined);
  const [handle, setHandle] = useState(undefined);
  const [waxed, setWaxed] = useState(true);
  const [whipLength, setWhipLength] = useState(undefined);
  const [handleLength, setHandleLength] = useState(undefined);
  const [concho, setConcho] = useState(undefined);

  const onAccordionChange = index => setIndex(index);

  useEffect(() => {
    // for 1st render
    if (index !== 0 || primary !== undefined) {
      setTimeout(() => {
        setIndex(index => index + 1);
      }, 500);
    }
  }, [primary, secondary, handle, waxed, whipLength, handleLength, concho]);

  const readyForOrder =
    primary && secondary && whipLength && handleLength && concho;
  return (
    <Layout>
      <SEO title="Design a Bullwhip" />
      <HeaderOffset />
      <Flex maxWidth="1280px" m="0 auto" p="0 30px">
        <Flex flex="3" direction="column">
          <Text>YOUR BULLWHIP</Text>
          <Stack mt="4" spacing="3" shouldWrapChildren>
            <WhipInfo label="Primary Color" info={primary} />
            <WhipInfo label="Secondary Color" info={secondary} />
            <WhipInfo label="Handle Pattern" info={handle} />
            <WhipInfo label="Waxed?" info={waxed ? 'Yes' : 'No'} />
            <WhipInfo label="Whip Length" info={whipLength} />
            <WhipInfo label="Handle Length" info={handleLength} />
            <WhipInfo label="Concho" info={concho} />
          </Stack>
        </Flex>
        <Flex flex="6" height="50px" direction="column" mx="4">
          <Accordion width="100%" index={index} onChange={onAccordionChange}>
            <AccordionItem>
              <AccordionHeader>
                <Text fontWeight="bold">Primary Color</Text>
                <AccordionIcon ml="auto" />
              </AccordionHeader>
              <AccordionPanel>
                <WhipColors
                  onClick={color => setPrimary(color)}
                  activeColor={primary}
                />
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionHeader>
                <Text fontWeight="bold">Secondary Color</Text>
                <AccordionIcon ml="auto" />
              </AccordionHeader>
              <AccordionPanel>
                <WhipColors
                  onClick={color => setSecondary(color)}
                  activeColor={secondary}
                />
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionHeader>
                <Text fontWeight="bold">Handle Pattern</Text>
                <AccordionIcon ml="auto" />
              </AccordionHeader>
              <AccordionPanel>
                <WhipHandles
                  activeHandle={handle}
                  onClick={handle => setHandle(handle)}
                />
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionHeader>
                <Text fontWeight="bold">Waxing</Text>
                <AccordionIcon ml="auto" />
              </AccordionHeader>
              <AccordionPanel>
                <RadioGroup
                  onChange={e => setWaxed(e.target.value === 'true')}
                  value={waxed.toString()}
                >
                  <Radio value="true">Waxed</Radio>
                  <Radio value="false">Unwaxed</Radio>
                </RadioGroup>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionHeader>
                <Text fontWeight="bold">Whip Length</Text>
                <AccordionIcon ml="auto" />
              </AccordionHeader>
              <AccordionPanel>
                <Text my="2" fontSize="md">
                  Price is also dependent on waxing.
                </Text>
                <WhipLengths
                  waxed={waxed}
                  onChange={e => setWhipLength(e.target.value)}
                  value={whipLength}
                />
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionHeader>
                <Text fontWeight="bold">Handle Length</Text>
                <AccordionIcon ml="auto" />
              </AccordionHeader>
              <AccordionPanel>
                <WhipHandleLengths
                  onChange={e => setHandleLength(e.target.value)}
                  value={handleLength}
                />
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionHeader>
                <Text fontWeight="bold">Concho</Text>
                <AccordionIcon ml="auto" />
              </AccordionHeader>
              <AccordionPanel>
                <Text my="2" fontSize="md">
                  A Concho is applied to the heel of every handle, giving your
                  bullwhip a distinct look!
                </Text>
                <WhipConchos
                  activeConcho={concho}
                  onClick={concho => setConcho(concho)}
                />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
          <Button
            variantColor="blue"
            size="lg"
            p="3"
            my="6"
            isDisabled={!readyForOrder}
          >
            Add Bullwhip to Cart
          </Button>
        </Flex>
        <Flex flex="3" bg="tomato" height="50px">
          <Text>Preview here</Text>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default DesignBullwhip;
