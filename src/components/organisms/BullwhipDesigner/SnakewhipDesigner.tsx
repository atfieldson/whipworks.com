import React, { useState } from 'react';
import {
  Flex,
  Text,
  Stack,
  Heading,
  Button,
  Box,
  Image,
  SimpleGrid,
  List,
  ListItem,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import StepNav from '../../atoms/StepNav';
import WhipColors from './WhipColors';
import HandleDesignPicker from './HandleDesignPicker';
import ConchoPicker from './ConchoPicker';
import { snakewhipLengths, snakewhipLengthOptions } from './constants/snakewhipLengths';
import PriceBreakdownSnakewhip from './PriceBreakdownSnakewhip';
import { spools } from './constants/spoolColors';
import { handles } from './constants/handleDesigns';
import WhipPreview from './WhipPreview';
import BullwhipAddedModal from '../../molecules/BullwhipAddedModal';
import { conchos, conchoOptions } from './constants/conchos';
import { heelLoops, heelLoopOptions } from './constants/heelLoops';
import HeelLoopPicker from './HeelLoopPicker';
import DesignerLayout from '../../templates/DesignerLayout';
import SnakewhipGallery from './SnakewhipGallery';
import TestimonialStrip from '../TestimonialStrip';

const colorOptions = spools.map((s) => `${s.name}[+0]`).join('|');

// Snakewhip handle designs: Herringbone is default (free), others are +$15 upcharge
// Excluded: Box, Vertical Strip, Egyptian Eye, Emerald, Accent
const snakewhipHandleExclude = ['Box', 'Vertical Strip', 'Egyptian Eye', 'Emerald', 'Accent'];
const snakewhipHandles = handles.filter(
  (handle) => !snakewhipHandleExclude.includes(handle.name)
);

// Add Herringbone as the first option (placeholder image for now)
const herringboneHandle = {
  name: 'Herringbone',
  img: 'https://d3ruufruf2uqog.cloudfront.net/handleDesigns/herringbone.jpg', // placeholder
};

const allSnakewhipHandles = [herringboneHandle, ...snakewhipHandles];

// Snipcart options: Herringbone is free, all others are +$15
const handleDesignOptions = allSnakewhipHandles
  .map((h) => `${h.name}[+${h.name === 'Herringbone' ? 0 : 15}]`)
  .join('|');

// Pommels are not available for snakewhips
const snakewhipConchoExclude = ['Wolf Pommel', 'Cobra Pommel', 'Dragon Pommel'];
const snakewhipConchoOptions = conchos
  .filter((c) => !snakewhipConchoExclude.includes(c.name))
  .map((c) => `${c.name}[+${c.price}]`)
  .join('|');

const SnakewhipDesigner = ({ location }: { location: any }) => {
  const [index, setIndex] = useState<number>(0);
  const [primary, setPrimary] = useState<string | undefined>(undefined);
  const [secondary, setSecondary] = useState<string | undefined>(undefined);
  const [handleDesign, setHandle] = useState<string | undefined>('Herringbone');
  const [waxed, setWaxed] = useState(true);
  const [whipLength, setWhipLength] = useState<string | undefined>(undefined);
  const [concho, setConcho] = useState<string | undefined>(undefined);
  const [heelLoop, setHeelLoop] = useState('Squared');
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  const steps = [
    { label: 'Primary', navLabel: 'Primary Color', isCompleted: !!primary },
    { label: 'Secondary', navLabel: 'Secondary Color', isCompleted: !!secondary },
    { label: 'Handle', navLabel: 'Handle Design', isCompleted: !!handleDesign },
    { label: 'Length', navLabel: 'Whip Length', isCompleted: !!whipLength },
    { label: 'Waxing', navLabel: 'Waxing', isCompleted: true }, // always has a default
    { label: 'Concho', navLabel: 'Concho', isCompleted: !!concho },
    { label: 'Extras', navLabel: 'Extras', isCompleted: true }, // optional, always "complete"
  ];

  const handleAdd = () => {
    // Hide Snipcart so its cart open/close doesn't affect the page
    const snipcartEl = document.getElementById('snipcart');
    if (snipcartEl) {
      snipcartEl.style.visibility = 'hidden';
    }
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    // Close Snipcart's cart while still hidden, then restore visibility
    if (typeof window !== 'undefined' && (window as any).Snipcart) {
      (window as any).Snipcart.api.theme.cart.close();
    }
    setTimeout(() => {
      const snipcartEl = document.getElementById('snipcart');
      if (snipcartEl) {
        snipcartEl.style.visibility = 'visible';
      }
    }, 500);
  };

  const handleCheckout = () => {
    const snipcartEl = document.getElementById('snipcart');
    if (snipcartEl) {
      snipcartEl.style.visibility = 'visible';
    }
    setModalOpen(false);
  };

  const readyForOrder = primary && secondary && handleDesign && whipLength && concho;

  // Handle design upcharge: $15 for anything that isn't Herringbone
  const handleDesignUpcharge = handleDesign && handleDesign !== 'Herringbone' ? 15 : 0;

  // Calculate total for collapsed summary display
  const lengthPrice = whipLength ? snakewhipLengths.find((l) => l.name === whipLength)?.price || 0 : 0;
  const conchoPrice = concho ? conchos.find((c) => c.name === concho)?.price || 0 : 0;
  const heelLoopPrice = heelLoop ? heelLoops.find((h) => h.name === heelLoop)?.price || 0 : 0;
  const total = lengthPrice + conchoPrice + (waxed ? 25 : 0) + heelLoopPrice + handleDesignUpcharge;

  const primarySpool = primary ? spools.find((s) => s.name === primary) : undefined;
  const secondarySpool = secondary ? spools.find((s) => s.name === secondary) : undefined;
  const handleObj = handleDesign
    ? allSnakewhipHandles.find((h) => h.name === handleDesign)
    : undefined;

  const leftPanel = (
    <Box>
      <Flex mb="6" gap="4" height="700px" justifyContent="center">
        {/* Selected options thumbnails */}
        <Flex direction="column" gap="3" alignItems="center" justifyContent="center" flexShrink={0}>
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
            whipType="snakewhip"
            activeHandle={handleDesign}
            onClick={(design) => setHandle(design)}
          />
        );
      case 3: {
        const selectedLength = snakewhipLengths.find((l) => l.name === whipLength);
        return (
          <SimpleGrid columns={2} spacing="4">
            <Stack spacing="2">
              {snakewhipLengths.map((l) => (
                <Button
                  key={l.name}
                  size="sm"
                  width="100%"
                  bg={whipLength === l.name ? '#2D6A4F' : 'white'}
                  color={whipLength === l.name ? 'white' : '#4A5568'}
                  border={whipLength === l.name ? '2px solid' : 'none'}
                  borderColor={whipLength === l.name ? '#CBD5E0' : undefined}
                  _hover={{ bg: whipLength === l.name ? '#245C43' : '#F7FAFC' }}
                  onClick={() => setWhipLength(l.name)}
                >
                  {`${l.name} ($${l.price})`}
                </Button>
              ))}
            </Stack>
            <Box>
              {selectedLength && (
                <>
                  <Text fontWeight="bold" fontSize="sm" mb="2">{selectedLength.name}</Text>
                  <Text fontSize="sm">{selectedLength.description}</Text>
                </>
              )}
            </Box>
          </SimpleGrid>
        );
      }
      case 4:
        return (
          <Box>
            <Text fontSize="sm" mb="4">
              On completion, a waxed snakewhip is dropped in Paraffin Wax. Paraffin wax is water
              insoluble and creates a protective layer to the whip. Waxing a paracord snakewhip may
              or may not be right for you, here are the pros for each:
            </Text>
            <SimpleGrid columns={2} spacing="4" mb="4">
              <Flex direction="column">
                <Button
                  size="sm"
                  width="100%"
                  mb="3"
                  bg={waxed ? '#2D6A4F' : 'white'}
                  color={waxed ? 'white' : '#4A5568'}
                  border={waxed ? '2px solid' : 'none'}
                  borderColor={waxed ? '#CBD5E0' : undefined}
                  _hover={{ bg: waxed ? '#245C43' : '#F7FAFC' }}
                  onClick={() => setWaxed(true)}
                >
                  Waxed
                </Button>
                <Text fontSize="sm" fontWeight="semibold" ml="2">Pros:</Text>
                <List spacing="1" ml="4" fontSize="sm" mb="2">
                  <ListItem>Creates a water resistant layer to protect the life of your whip</ListItem>
                  <ListItem>Gives it a professional, matte finish that darkens the paracord</ListItem>
                  <ListItem>Makes the whip more rugged for harsh conditions</ListItem>
                </List>
                <Text fontSize="sm" fontWeight="semibold" ml="2">Cons:</Text>
                <List spacing="1" ml="4" fontSize="sm">
                  <ListItem>Makes the whip more stiff, requiring more breaking in (especially in cold conditions)</ListItem>
                  <ListItem>Some colors of paracord become very dark and subtle — this can be a pro or con</ListItem>
                </List>
              </Flex>
              <Flex direction="column">
                <Button
                  size="sm"
                  width="100%"
                  mb="3"
                  bg={!waxed ? '#2D6A4F' : 'white'}
                  color={!waxed ? 'white' : '#4A5568'}
                  border={!waxed ? '2px solid' : 'none'}
                  borderColor={!waxed ? '#CBD5E0' : undefined}
                  _hover={{ bg: !waxed ? '#245C43' : '#F7FAFC' }}
                  onClick={() => setWaxed(false)}
                >
                  Unwaxed
                </Button>
                <Text fontSize="sm" fontWeight="semibold" ml="2">Pros:</Text>
                <List spacing="1" ml="4" fontSize="sm" mb="2">
                  <ListItem>More flexible out of the box</ListItem>
                  <ListItem>Maintains the bright vibrance and color of the paracord</ListItem>
                </List>
                <Text fontSize="sm" fontWeight="semibold" ml="2">Cons:</Text>
                <List spacing="1" ml="4" fontSize="sm">
                  <ListItem>More susceptible to water damage</ListItem>
                  <ListItem>Gets dirty faster in outdoor conditions</ListItem>
                </List>
              </Flex>
            </SimpleGrid>
            <Box>
              <Text fontWeight="bold" fontSize="sm" mb="1">Overall Thoughts</Text>
              <Text fontSize="sm">
                I almost always recommend folks wax their whips. If you're going to use your whip
                outside or get it wet at all, waxing is the way to go. If you are using
                your whip indoors only or need it to maintain as much flexibility as possible, then
                keeping it unwaxed makes sense. I'd recommend unwaxed for stage performers
                that want their paracord whips to be bright on the stage.
              </Text>
            </Box>
          </Box>
        );
      case 5:
        return (
          <Box>
            <Text my="2" fontSize="md">
              A Concho is applied to the heel of your snakewhip, giving it a distinct look!
            </Text>
            <ConchoPicker activeConcho={concho} onClick={setConcho} exclude={snakewhipConchoExclude} />
          </Box>
        );
      case 6:
        return (
          <Box>
            <Heading size="md" mt="2">
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
    <Flex direction="column" height="calc(100vh - 120px)" minW="0">
      <Heading mb="4" textAlign="center">
        Design your Snakewhip
      </Heading>

      {/* Step Navigation */}
      <StepNav steps={steps} activeStep={index} onStepClick={setIndex} />

      {/* Active Step Content — fills remaining space */}
      <Box
        flex="1"
        minH="0"
        minW="0"
        overflowY="auto"
        overflowX="auto"
        py="4"
        sx={{
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { width: '8px', height: '8px' },
          '&::-webkit-scrollbar-thumb': { background: '#a0aec0', borderRadius: '4px' },
          '&::-webkit-scrollbar-track': { background: '#e8ecef', borderRadius: '4px' },
        }}
      >
        {stepContent()}
      </Box>

      {/* Previous / Next navigation — sits between scroll area and summary */}
      <Flex justifyContent="space-between" alignItems="center" pt="2" pb="1" flexShrink={0}>
        {index > 0 ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIndex(index - 1)}
            color="white"
            borderColor="gray.500"
            _hover={{ bg: 'whiteAlpha.200' }}
            flexShrink={0}
          >
            ← {steps[index - 1].navLabel}
          </Button>
        ) : (
          <Box />
        )}
        <Text
          fontWeight="bold"
          fontSize="sm"
          display="block"
          textAlign="center"
          px="2"
        >
          {steps[index].navLabel}
        </Text>
        {index < steps.length - 1 ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIndex(index + 1)}
            isDisabled={!steps[index].isCompleted}
            color="white"
            borderColor="gray.500"
            _hover={{ bg: 'whiteAlpha.200' }}
            _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
            flexShrink={0}
          >
            {steps[index + 1].navLabel} →
          </Button>
        ) : (
          <Box />
        )}
      </Flex>

      {/* Collapsible summary + Add to Cart — always visible at bottom */}
      <Box borderTopWidth="1px" borderColor="gray.200" pt="2" mt="2" flexShrink={0}>
        {/* Toggle bar */}
        <Flex
          onClick={() => setDetailsExpanded(!detailsExpanded)}
          cursor="pointer"
          alignItems="center"
          justifyContent="center"
          py="1"
          _hover={{ bg: 'whiteAlpha.100' }}
          borderRadius="md"
        >
          <Text fontSize="sm" fontWeight="bold" mr="2">
            {detailsExpanded ? 'Hide' : 'See'} your Snakewhip Details
          </Text>
          <Text fontSize="xs">{detailsExpanded ? '▲' : '▼'}</Text>
        </Flex>

        {/* Expandable details */}
        <AnimatePresence initial={false}>
          {detailsExpanded && (
            <motion.div
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <Flex gap="4" alignItems="stretch" mt="2">
                <Flex flex="1" direction="column">
                  <Text fontWeight="bold" fontSize="lg" mb="1">YOUR SNAKEWHIP</Text>
                  <SimpleGrid columns={3} spacing="1">
                    <Text fontSize="sm"><Text as="span" color="gray.500">Primary: </Text>{primary || '—'}</Text>
                    <Text fontSize="sm"><Text as="span" color="gray.500">Secondary: </Text>{secondary || '—'}</Text>
                    <Text fontSize="sm">
                      <Text as="span" color="gray.500">Handle: </Text>
                      {handleDesign || '—'}
                      {handleDesignUpcharge > 0 && ' (+$15)'}
                    </Text>
                    <Text fontSize="sm"><Text as="span" color="gray.500">Waxed: </Text>{waxed ? 'Yes' : 'No'}</Text>
                    <Text fontSize="sm"><Text as="span" color="gray.500">Length: </Text>{whipLength || '—'}</Text>
                    <Text fontSize="sm"><Text as="span" color="gray.500">Concho: </Text>{concho || '—'}</Text>
                    <Text fontSize="sm"><Text as="span" color="gray.500">Heel Loop: </Text>{heelLoop}</Text>
                  </SimpleGrid>
                </Flex>
                <PriceBreakdownSnakewhip
                  whipLength={whipLength}
                  concho={concho}
                  isWaxed={waxed}
                  heelLoop={heelLoop}
                  handleDesignUpcharge={handleDesignUpcharge}
                />
              </Flex>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Always visible: Add to Cart + Total */}
        <Flex alignItems="center" justifyContent="center" gap="3" mt="2">
          <Button
            isDisabled={!readyForOrder}
            size="sm"
            onClick={handleAdd}
            className="snipcart-add-item"
            data-item-id="custom-snakewhip"
            data-item-name="Custom Snakewhip"
            data-item-price="149"
            data-item-url="/design-snakewhip"
            data-item-description="A custom-designed handmade snakewhip"
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
            data-item-custom3-options={snakewhipLengthOptions}
            data-item-custom3-value={whipLength}
            data-item-custom4-name="Concho"
            data-item-custom4-options={snakewhipConchoOptions}
            data-item-custom4-value={concho}
            data-item-custom5-name="Waxing"
            data-item-custom5-options="Yes[+25]|No"
            data-item-custom5-value={waxed ? 'Yes' : 'No'}
            data-item-custom6-name="Heel Loop"
            data-item-custom6-options={heelLoopOptions}
            data-item-custom6-value={heelLoop}
            data-item-weight={750}
            data-item-width={46}
            data-item-height={8}
            data-item-length={30}
          >
            Add to Cart
          </Button>
          <Text fontWeight="bold" fontSize="sm">
            {total > 0 ? `Total: $${total}` : 'Total: —'}
          </Text>
        </Flex>
      </Box>
    </Flex>
  );

  return (
    <>
      <DesignerLayout
        leftPanel={leftPanel}
        leftPanelBottom={<><SnakewhipGallery /><TestimonialStrip productType="snakewhip" /></>}
        rightPanel={rightPanel}
      />
      <BullwhipAddedModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onCheckout={handleCheckout}
        location={location}
      />
    </>
  );
};

export default SnakewhipDesigner;
