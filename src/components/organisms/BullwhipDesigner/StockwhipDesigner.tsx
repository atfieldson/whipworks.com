import React, { useState, useEffect } from 'react';
import { Flex, Text, Accordion, Stack, RadioGroup, Radio, Heading } from '@chakra-ui/core';
import CustomizationLabel from '../../atoms/CustomizationLabel';
import AccordionSection from '../../atoms/AccordionSection';
import WhipColors from './WhipColors';
import HandleDesignPicker from './HandleDesignPicker';
import ConchoPicker from './ConchoPicker';
import { stockwhipHandleLengths, stockwhipHandleLengthOptions } from './constants/stockwhipHandleLengths';
import { thongLengths, thongLengthOptions } from './constants/thongLengths';
import { stockwhipFinishesOptions } from './constants/stockwhipFinishes';
import Button from '../../atoms/Button';
import PriceBreakdownStockwhip from './PriceBreakdownStockwhip';
import { spools } from './constants/spoolColors';
import { handles } from './constants/handleDesigns';
import WhipPreview from './WhipPreview';
import BullwhipAddedModal from '../../molecules/BullwhipAddedModal';
import { conchoOptions } from './constants/conchos';
import FinishPicker from './FinishPicker';

// Remove handle designs I don't want for Stockwhips, this needs to be done in tandem with props to HandleDesignPicker
const updatedHandles = handles.filter(handle => handle.name !== 'Accent' && handle.name !== 'Web of Wyrd')

const colorOptions = spools.map((s) => s.name).join('|');
const handleDesignOptions = updatedHandles.map((h) => h.name ).join('|');

const resolveWeight = (thongLength?: string) => {
  switch (thongLength) {
    case '4 Feet':
      return 750;
    case '4 Feet 6 Inches':
      return 850;
    case '5 Feet':
      return 880;
  }
};

const StockwhipDesigner = ({ location }: { location: any }) => {
  const [index, setIndex] = useState<number | number[] | undefined>(0);
  const [primary, setPrimary] = useState<string | undefined>(undefined);
  const [secondary, setSecondary] = useState<string | undefined>(undefined);
  const [handleDesign, setHandle] = useState<string | undefined>(undefined);
  const [waxed, setWaxed] = useState(true);
  const [thongLength, setThongLength] = useState<string | undefined>(undefined);
  const [stockwhipHandleLength, setStockwhipHandleLength] = useState<string | undefined>(undefined);
  const [handleFinish, setHandleFinish] = useState<string | undefined>(undefined);
  const [concho, setConcho] = useState<string | undefined>(undefined);
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
        setIndex((index: any) => index + 1);
      }, 500);
    }
  }, [primary, secondary, handleDesign, waxed, thongLength, stockwhipHandleLength, handleFinish, concho]);

  const handleAdd = () => {
    setModalOpen(true);
  };

  const readyForOrder = primary && secondary && thongLength && stockwhipHandleLength && concho && handleFinish;
  return (
    <Flex flexDirection={{ base: 'column-reverse', md: 'row' }}>
      <Flex flex="2" order={1} flexDirection="column">
        <Text>YOUR STOCKWHIP</Text>
        <Stack spacing="3" mt="4" shouldWrapChildren>
          <CustomizationLabel label="Primary Color" value={primary} />
          <CustomizationLabel label="Secondary Color" value={secondary} />
          <CustomizationLabel label="Handle Design" value={handleDesign} />
          <CustomizationLabel label="Waxed?" value={waxed ? 'Yes' : 'No'} />
          <CustomizationLabel label="Thong Length" value={thongLength} />
          <CustomizationLabel label="Handle Length" value={stockwhipHandleLength} />
          <CustomizationLabel label="Handle Finish" value={handleFinish} />
          <CustomizationLabel label="Concho" value={concho} />
          <PriceBreakdownStockwhip
            stockwhipHandleLength={stockwhipHandleLength}
            thongLength={thongLength}
            concho={concho}
            isWaxed={waxed}
          />
        </Stack>
      </Flex>
      <Flex flex="6" order={{ base: 3, md: 2 }} mx={{ base: '0', md: '6' }} flexDirection="column">
        <Heading mb="8px" textAlign="center">Design your Stockwhip</Heading>
        <Accordion width="100%" index={index} onChange={onAccordionChange} allowToggle>
          <AccordionSection label="Primary Color">
            <WhipColors onClick={(color) => setPrimary(color)} activeColor={primary} />
          </AccordionSection>
          <AccordionSection label="Secondary Color">
            <WhipColors onClick={(color) => setSecondary(color)} activeColor={secondary} />
          </AccordionSection>
          <AccordionSection label="Handle Design">
            <HandleDesignPicker
              whipType='stockwhip'
              activeHandle={handleDesign}
              onClick={(handleDesign) => setHandle(handleDesign)}
            />
          </AccordionSection>
          <AccordionSection label="Waxing">
            <RadioGroup
              onChange={(e) => setWaxed(e.target.value === 'true')}
              value={waxed.toString()}
            >
              <Radio value="true">Waxed</Radio>
              <Radio value="false">Unwaxed</Radio>
            </RadioGroup>
          </AccordionSection>
          <AccordionSection label="Thong Length">
            <RadioGroup value={thongLength} onChange={(e) => setThongLength(e.target.value)}>
              {thongLengths.map((l) => (
                <Radio value={l.name} key={l.name}>{`${l.name} ($${l.price})`}</Radio>
              ))}
            </RadioGroup>
          </AccordionSection>
          <AccordionSection label="Handle Length">
            <RadioGroup value={stockwhipHandleLength} onChange={(e) => setStockwhipHandleLength(e.target.value)}>
              {stockwhipHandleLengths.map((l) => (
                <Radio key={l.name} value={l.name}>{`${l.name} ($${l.price})`}</Radio>
              ))}
            </RadioGroup>
          </AccordionSection>
          <AccordionSection label="Handle Finish">
            <FinishPicker activeFinish={handleFinish} onClick={(handleFinish) => setHandleFinish(handleFinish)} />
          </AccordionSection>
          <AccordionSection label="Concho">
            <Text my="2" fontSize="md">
              A Concho is applied to the heel of every handle, giving your bullwhip a distinct look!
            </Text>
            <ConchoPicker activeConcho={concho} onClick={(concho) => setConcho(concho)} />
          </AccordionSection>
        </Accordion>
        <Button
          isDisabled={!readyForOrder}
          my="6"
          onClick={handleAdd}
          className="snipcart-add-item"
          data-item-id="custom-stockwhip"
          data-item-name="Custom Stockwhip"
          data-item-price="204"
          data-item-url="/design-stockwhip"
          data-item-description="A custom-designed handmade stockwhip"
          data-item-custom0-name="Primary Color"
          data-item-custom0-options={colorOptions}
          data-item-custom0-value={primary}
          data-item-custom1-name="Secondary Color"
          data-item-custom1-options={colorOptions}
          data-item-custom1-value={secondary}
          data-item-custom2-name="Handle Design"
          data-item-custom2-options={handleDesignOptions}
          data-item-custom2-value={handleDesign}
          data-item-custom3-name="Thong Length"
          data-item-custom3-options={thongLengthOptions}
          data-item-custom3-value={thongLength}
          data-item-custom4-name="Handle Length"
          data-item-custom4-options={stockwhipHandleLengthOptions}
          data-item-custom4-value={stockwhipHandleLength}
          data-item-custom5-name="Handle Finish"
          data-item-custom5-options={stockwhipFinishesOptions}
          data-item-custom5-value={handleFinish}
          data-item-custom6-name="Concho"
          data-item-custom6-options={conchoOptions}
          data-item-custom6-value={concho}
          data-item-custom7-name="Waxing"
          data-item-custom7-options="Yes[+25]|No"
          data-item-custom7-value={waxed ? 'Yes' : 'No'}
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
      <BullwhipAddedModal isOpen={modalOpen} onClose={() => setModalOpen(false)} location={location} />
    </Flex>
  );
};

export default StockwhipDesigner;