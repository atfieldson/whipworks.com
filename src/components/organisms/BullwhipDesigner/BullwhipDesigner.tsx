import React, { useState, useEffect } from 'react';
import { Flex, Text, Accordion, Stack, RadioGroup, Radio, Heading, Button } from '@chakra-ui/react';
import CustomizationLabel from '../../atoms/CustomizationLabel';
import AccordionSection from '../../atoms/AccordionSection';
import WhipColors from './WhipColors';
import HandleDesignPicker from './HandleDesignPicker';
import ConchoPicker from './ConchoPicker';
import { handleLengths, handleLengthOptions } from './constants/handleLengths';
import { whipLengths, whipLengthOptions } from './constants/whipLengths';
import PriceBreakdown from './PriceBreakdown';
import { spools } from './constants/spoolColors';
import { handles } from './constants/handleDesigns';
import WhipPreview from './WhipPreview';
import BullwhipAddedModal from '../../molecules/BullwhipAddedModal';
import { conchoOptions } from './constants/conchos';
import { collarOptions } from './constants/collars';
import CollarPicker from './CollarPicker';

const colorOptions = spools.map((s) => s.name).join('|');
const handleDesignOptions = handles.map((h) => h.name).join('|');

const resolveWeight = (length?: string) => {
  switch (length) {
    case '4 Feet':
      return 750;
    case '5 Feet':
      return 850;
    case '6 Feet':
      return 880;
    case '7 Feet':
      return 910;
    case '8 Feet':
      return 965;
    case '10 Feet':
      return 1030;
    case '12 Feet':
      return 1360;
    default:
      return 900;
  }
};

const BullwhipDesigner = ({ location }: { location: any }) => {
  const [index, setIndex] = useState<number>(0);
  const [primary, setPrimary] = useState<string | undefined>(undefined);
  const [secondary, setSecondary] = useState<string | undefined>(undefined);
  const [handleDesign, setHandle] = useState<string | undefined>(undefined);
  const [waxed, setWaxed] = useState(true);
  const [whipLength, setWhipLength] = useState<string | undefined>(undefined);
  const [handleLength, setHandleLength] = useState<string | undefined>(undefined);
  const [concho, setConcho] = useState<string | undefined>(undefined);
  const [collar, setCollar] = useState('None');
  const [modalOpen, setModalOpen] = useState(false);

  const onAccordionChange = (index: any) => {
    setIndex(index);
  };

  useEffect(() => {
    if (index === undefined) {
      return;
    }

    // for 1st render
    if (index !== 0 || primary !== undefined) {
      // if the user has selected enough things to generate preview,
      // let them fiddle instead of automatically advancing
      if (index <= 2 && primary && secondary && handleDesign) {
        return;
      }

      setTimeout(() => {
        setIndex((index) => index + 1);
      }, 500);
    }
  }, [primary, secondary, handleDesign, waxed, whipLength, handleLength, concho, collar]);

  const handleAdd = () => {
    setModalOpen(true);
  };

  const readyForOrder = primary && secondary && whipLength && handleLength && concho;
  return (
    <Flex flexDirection={{ base: 'column-reverse', md: 'row' }}>
      <Flex flex="2" order={1} flexDirection="column">
        <Text>YOUR BULLWHIP</Text>
        <Stack spacing="3" mt="4" shouldWrapChildren>
          <CustomizationLabel label="Primary Color" value={primary} />
          <CustomizationLabel label="Secondary Color" value={secondary} />
          <CustomizationLabel label="Handle Design" value={handleDesign} />
          <CustomizationLabel label="Waxed?" value={waxed ? 'Yes' : 'No'} />
          <CustomizationLabel label="Whip Length" value={whipLength} />
          <CustomizationLabel label="Handle Length" value={handleLength} />
          <CustomizationLabel label="Concho" value={concho} />
          <CustomizationLabel label="Collar" value={collar} />
          <PriceBreakdown
            handleLength={handleLength}
            whipLength={whipLength}
            concho={concho}
            isWaxed={waxed}
            collar={collar}
          />
        </Stack>
      </Flex>
      <Flex flex="6" order={{ base: 3, md: 2 }} mx={{ base: '0', md: '6' }} flexDirection="column">
        <Heading mb="8px" textAlign="center">
          Design your Bullwhip
        </Heading>
        <Accordion width="100%" index={index} onChange={onAccordionChange} allowToggle>
          <AccordionSection label="Primary Color">
            <WhipColors onClick={(color) => setPrimary(color)} activeColor={primary} />
          </AccordionSection>
          <AccordionSection label="Secondary Color">
            <WhipColors onClick={(color) => setSecondary(color)} activeColor={secondary} />
          </AccordionSection>
          <AccordionSection label="Handle Design">
            <HandleDesignPicker
              activeHandle={handleDesign}
              onClick={(handleDesign) => setHandle(handleDesign)}
            />
          </AccordionSection>
          <AccordionSection label="Waxing">
            <RadioGroup onChange={(e) => setWaxed(e === 'true')} value={waxed.toString()}>
              <Stack>
                <Radio value="true">Waxed</Radio>
                <Radio value="false">Unwaxed</Radio>
              </Stack>
            </RadioGroup>
          </AccordionSection>
          <AccordionSection label="Whip Length">
            <RadioGroup value={whipLength} onChange={setWhipLength}>
              <Stack>
                {whipLengths.map((l) => (
                  <Radio value={l.name} key={l.name}>{`${l.name} ($${l.price})`}</Radio>
                ))}
              </Stack>
            </RadioGroup>
          </AccordionSection>
          <AccordionSection label="Handle Length">
            <RadioGroup value={handleLength} onChange={setHandleLength}>
              <Stack>
                {handleLengths.map((l) => (
                  <Radio key={l.name} value={l.name}>{`${l.name} ($${l.price})`}</Radio>
                ))}
              </Stack>
            </RadioGroup>
          </AccordionSection>
          <AccordionSection label="Concho">
            <Text my="2" fontSize="md">
              A Concho is applied to the heel of every handle, giving your bullwhip a distinct look!
            </Text>
            <ConchoPicker activeConcho={concho} onClick={setConcho} />
          </AccordionSection>
          <AccordionSection label="Extras">
            <Heading size="md" mt="2">
              Add a Collar
            </Heading>
            <Text my="2" fontSize="md">
              A collar is attached to the transition with an additional transition knot added, this
              addition looks great on 12 or 14 inch handles!
            </Text>
            <CollarPicker activeCollar={collar} onClick={setCollar} />
          </AccordionSection>
        </Accordion>
        <Button
          isDisabled={!readyForOrder}
          my="6"
          onClick={handleAdd}
          className="snipcart-add-item"
          data-item-id="custom-bullwhip"
          data-item-name="Custom Bullwhip"
          data-item-price="204"
          data-item-url="/design-bullwhip"
          data-item-description="A custom-designed handmade bullwhip"
          data-item-custom0-name="Primary Color"
          data-item-custom0-options={colorOptions}
          data-item-custom0-value={primary}
          data-item-custom1-name="Secondary Color"
          data-item-custom1-options={colorOptions}
          data-item-custom1-value={secondary}
          data-item-custom2-name="Handle Design"
          data-item-custom2-options={handleDesignOptions}
          data-item-custom2-value={handleDesign}
          data-item-custom3-name="Length"
          data-item-custom3-options={whipLengthOptions}
          data-item-custom3-value={whipLength}
          data-item-custom4-name="Handle Length"
          data-item-custom4-options={handleLengthOptions}
          data-item-custom4-value={handleLength}
          data-item-custom5-name="Concho"
          data-item-custom5-options={conchoOptions}
          data-item-custom5-value={concho}
          data-item-custom6-name="Waxing"
          data-item-custom6-options="Yes[+25]|No"
          data-item-custom6-value={waxed ? 'Yes' : 'No'}
          data-item-custom7-name="Collar"
          data-item-custom7-options={collarOptions}
          data-item-custom7-value={collar}
          data-item-weight={900}
          data-item-width={46}
          data-item-height={8}
          data-item-length={30}
        >
          Add to Cart
        </Button>
      </Flex>
      <WhipPreview
        order={{ base: 2, md: 3 }}
        waxed={waxed}
        primary={primary}
        secondary={secondary}
        pattern={handleDesign}
      />
      <BullwhipAddedModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        location={location}
      />
    </Flex>
  );
};

export default BullwhipDesigner;
