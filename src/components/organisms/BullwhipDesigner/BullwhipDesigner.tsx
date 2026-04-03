import React, { useState, useEffect } from 'react';
import { Flex, Text, Stack, RadioGroup, Radio, Heading, Button, Box, Image, SimpleGrid } from '@chakra-ui/react';
import StepNav from '../../atoms/StepNav';
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
import { heelLoopOptions } from './constants/heelLoops';
import HeelLoopPicker from './HeelLoopPicker';
import DesignerLayout from '../../templates/DesignerLayout';

const colorOptions = spools.map((s) => `${s.name}[+0]`).join('|');
const handleDesignOptions = handles.map((h) => `${h.name}[+0]`).join('|');

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
  const [heelLoop, setHeelLoop] = useState('No Heel Loop');
  const [modalOpen, setModalOpen] = useState(false);
  const TOTAL_STEPS = 8;

  const steps = [
    { label: 'Primary', isCompleted: !!primary },
    { label: 'Secondary', isCompleted: !!secondary },
    { label: 'Handle', isCompleted: !!handleDesign },
    { label: 'Waxing', isCompleted: true }, // always has a default
    { label: 'Length', isCompleted: !!whipLength },
    { label: 'Handle Length', isCompleted: !!handleLength },
    { label: 'Concho', isCompleted: !!concho },
    { label: 'Extras', isCompleted: true }, // optional, always "complete"
  ];

  const handleAdd = () => {
    // Hide Snipcart's cart container before it can flash on screen
    const snipcartEl = document.getElementById('snipcart');
    if (snipcartEl) {
      snipcartEl.style.visibility = 'hidden';
    }
    // Show our modal immediately
    setModalOpen(true);
    // Close Snipcart's cart and restore visibility
    setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).Snipcart) {
        (window as any).Snipcart.api.theme.cart.close();
      }
      setTimeout(() => {
        if (snipcartEl) {
          snipcartEl.style.visibility = 'visible';
        }
      }, 300);
    }, 50);
  };

  const readyForOrder = primary && secondary && whipLength && handleLength && concho;

  const primarySpool = primary ? spools.find((s) => s.name === primary) : undefined;
  const secondarySpool = secondary ? spools.find((s) => s.name === secondary) : undefined;
  const handleObj = handleDesign ? handles.find((h) => h.name === handleDesign) : undefined;

  const leftPanel = (
    <Box>
      <Flex justifyContent="center" mb="6" gap="4">
        {/* Selected options thumbnails */}
        <Flex direction="column" gap="3" alignItems="center" justifyContent="center">
          <Box textAlign="center">
            <Text fontSize="xs" fontWeight="bold" mb="1">Primary</Text>
            {primarySpool ? (
              <Box
                as="img"
                src={primarySpool.img}
                alt={primarySpool.name}
                boxSize="80px"
                objectFit="cover"
                borderRadius="md"
                border="2px solid"
                borderColor="gray.300"
              />
            ) : (
              <Flex boxSize="80px" bg="gray.100" borderRadius="md" border="2px dashed" borderColor="gray.300" alignItems="center" justifyContent="center" p="1">
                <Text fontSize="xs" color="black" textAlign="center" lineHeight="1.2">Make a selection</Text>
              </Flex>
            )}
          </Box>
          <Box textAlign="center">
            <Text fontSize="xs" fontWeight="bold" mb="1">Secondary</Text>
            {secondarySpool ? (
              <Box
                as="img"
                src={secondarySpool.img}
                alt={secondarySpool.name}
                boxSize="80px"
                objectFit="cover"
                borderRadius="md"
                border="2px solid"
                borderColor="gray.300"
              />
            ) : (
              <Flex boxSize="80px" bg="gray.100" borderRadius="md" border="2px dashed" borderColor="gray.300" alignItems="center" justifyContent="center" p="1">
                <Text fontSize="xs" color="black" textAlign="center" lineHeight="1.2">Make a selection</Text>
              </Flex>
            )}
          </Box>
          <Box textAlign="center">
            <Text fontSize="xs" fontWeight="bold" mb="1">Handle</Text>
            {handleObj ? (
              <Box
                width="80px"
                height="320px"
                borderRadius="md"
                border="2px solid"
                borderColor="gray.300"
                overflow="hidden"
              >
                <Image
                  src={handleObj.img}
                  alt={handleObj.name}
                  width="320px"
                  height="80px"
                  maxW="none"
                  objectFit="cover"
                  sx={{
                    transform: 'rotate(90deg)',
                    transformOrigin: 'top left',
                    position: 'relative',
                    top: '0',
                    left: '80px',
                  }}
                />
              </Box>
            ) : (
              <Flex width="80px" height="320px" bg="gray.100" borderRadius="md" border="2px dashed" borderColor="gray.300" alignItems="center" justifyContent="center" p="1">
                <Text fontSize="xs" color="black" textAlign="center" lineHeight="1.2">Make a selection</Text>
              </Flex>
            )}
          </Box>
        </Flex>

        {/* 3D Preview */}
        <WhipPreview
          waxed={waxed}
          primary={primary}
          secondary={secondary}
          pattern={handleDesign}
        />
      </Flex>

      {/* Future: gallery of finished whip images will go here */}
    </Box>
  );

  const stepContent = () => {
    switch (index) {
      case 0:
        return <WhipColors onClick={(color) => setPrimary(color)} activeColor={primary} />;
      case 1:
        return <WhipColors onClick={(color) => setSecondary(color)} activeColor={secondary} />;
      case 2:
        return (
          <HandleDesignPicker
            activeHandle={handleDesign}
            onClick={(handleDesign) => setHandle(handleDesign)}
          />
        );
      case 3:
        return (
          <RadioGroup onChange={(e) => setWaxed(e === 'true')} value={waxed.toString()}>
            <Stack>
              <Radio value="true">Waxed</Radio>
              <Radio value="false">Unwaxed</Radio>
            </Stack>
          </RadioGroup>
        );
      case 4:
        return (
          <RadioGroup value={whipLength} onChange={setWhipLength}>
            <Stack>
              {whipLengths.map((l) => (
                <Radio value={l.name} key={l.name}>{`${l.name} ($${l.price})`}</Radio>
              ))}
            </Stack>
          </RadioGroup>
        );
      case 5:
        return (
          <RadioGroup value={handleLength} onChange={setHandleLength}>
            <Stack>
              {handleLengths.map((l) => (
                <Radio key={l.name} value={l.name}>{`${l.name} ($${l.price})`}</Radio>
              ))}
            </Stack>
          </RadioGroup>
        );
      case 6:
        return (
          <Box>
            <Text my="2" fontSize="md">
              A Concho is applied to the heel of every handle, giving your bullwhip a distinct look!
            </Text>
            <ConchoPicker activeConcho={concho} onClick={setConcho} />
          </Box>
        );
      case 7:
        return (
          <Box>
            <Heading size="md" mt="2">
              Add a Collar
            </Heading>
            <Text my="2" fontSize="md">
              A collar is attached to the transition with an additional transition knot added, this
              addition looks great on 12 or 14 inch handles!
            </Text>
            <CollarPicker activeCollar={collar} onClick={setCollar} />
            <Heading size="md" mt="6">
              Add a Heel Loop
            </Heading>
            <Text my="2" fontSize="md">
              Choose your heel knot style — add a heel loop for easy hanging and storage!
            </Text>
            <HeelLoopPicker activeHeelLoop={heelLoop} onClick={setHeelLoop} />
          </Box>
        );
      default:
        return null;
    }
  };

  const rightPanel = (
    <Box>
      <Heading mb="4" textAlign="center">
        Design your Bullwhip
      </Heading>

      {/* Step Navigation */}
      <StepNav steps={steps} activeStep={index} onStepClick={setIndex} />

      {/* Active Step Content */}
      <Box height="600px" overflowY="auto" py="4">
        {stepContent()}
      </Box>

      {/* Summary + Add to Cart */}
      <Box borderTopWidth="1px" borderColor="gray.200" pt="4" mt="4">
        <Text fontWeight="bold" fontSize="lg" mb="3">
          YOUR BULLWHIP
        </Text>
        <SimpleGrid columns={{ base: 2, lg: 3 }} spacing="3" mb="4">
          <Box>
            <Text fontSize="xs" color="gray.500">Primary Color</Text>
            <Text fontWeight="bold" fontSize="sm">{primary || '—'}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.500">Secondary Color</Text>
            <Text fontWeight="bold" fontSize="sm">{secondary || '—'}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.500">Handle Design</Text>
            <Text fontWeight="bold" fontSize="sm">{handleDesign || '—'}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.500">Waxed?</Text>
            <Text fontWeight="bold" fontSize="sm">{waxed ? 'Yes' : 'No'}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.500">Whip Length</Text>
            <Text fontWeight="bold" fontSize="sm">{whipLength || '—'}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.500">Handle Length</Text>
            <Text fontWeight="bold" fontSize="sm">{handleLength || '—'}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.500">Concho</Text>
            <Text fontWeight="bold" fontSize="sm">{concho || '—'}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.500">Collar</Text>
            <Text fontWeight="bold" fontSize="sm">{collar}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.500">Heel Loop</Text>
            <Text fontWeight="bold" fontSize="sm">{heelLoop}</Text>
          </Box>
        </SimpleGrid>
        <PriceBreakdown
          handleLength={handleLength}
          whipLength={whipLength}
          concho={concho}
          isWaxed={waxed}
          collar={collar}
          heelLoop={heelLoop}
        />
        <Button
          isDisabled={!readyForOrder}
          my="6"
          width="100%"
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
          data-item-custom8-name="Heel Loop"
          data-item-custom8-options={heelLoopOptions}
          data-item-custom8-value={heelLoop}
          data-item-weight={900}
          data-item-width={46}
          data-item-height={8}
          data-item-length={30}
        >
          Add to Cart
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <DesignerLayout
        leftPanel={leftPanel}
        rightPanel={rightPanel}
      />
      <BullwhipAddedModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        location={location}
      />
    </>
  );
};

export default BullwhipDesigner;
