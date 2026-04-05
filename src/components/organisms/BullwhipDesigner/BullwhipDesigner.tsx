import React, { useState, useEffect } from 'react';
import { Flex, Text, Stack, RadioGroup, Radio, Heading, Button, Box, Image, SimpleGrid, List, ListItem } from '@chakra-ui/react';
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
import WhipGallery, { WhipImage } from './WhipGallery';
import { galleryItems, GalleryWhip } from './constants/galleryWhips';

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
  const [heelLoop, setHeelLoop] = useState('Squared');
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
    // Hide Snipcart's cart container so it doesn't flash behind our modal
    const snipcartEl = document.getElementById('snipcart');
    if (snipcartEl) {
      snipcartEl.style.visibility = 'hidden';
    }
    // Show our modal immediately
    setModalOpen(true);
    // Close Snipcart's cart (it stays hidden until our modal closes)
    setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).Snipcart) {
        (window as any).Snipcart.api.theme.cart.close();
      }
    }, 50);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    // Restore Snipcart visibility now that our modal is gone
    setTimeout(() => {
      const snipcartEl = document.getElementById('snipcart');
      if (snipcartEl) {
        snipcartEl.style.visibility = 'visible';
      }
    }, 100);
  };

  const readyForOrder = primary && secondary && whipLength && handleLength && concho;

  const primarySpool = primary ? spools.find((s) => s.name === primary) : undefined;
  const secondarySpool = secondary ? spools.find((s) => s.name === secondary) : undefined;
  const handleObj = handleDesign ? handles.find((h) => h.name === handleDesign) : undefined;

  // Pick random gallery images for the preview strip (once per page load)
  // Hero is always a Wide image; bottom two are Transition and Handle
  const previewImages = React.useMemo(() => {
    const whips = galleryItems.filter(
      (item): item is GalleryWhip => item.type === 'bullwhip' || item.type === 'fantasy'
    );
    const shuffled = [...whips].sort(() => Math.random() - 0.5);

    // Pick hero from whips that have a wide image
    const heroWhip = shuffled.find((w) => w.images.wide);
    const remaining = shuffled.filter((w) => w !== heroWhip);

    const result: Array<{ whip: GalleryWhip; angle: 'wide' | 'transition' | 'handle'; src: string }> = [];

    if (heroWhip && heroWhip.images.wide) {
      result.push({ whip: heroWhip, angle: 'wide', src: heroWhip.images.wide });
    }

    // Pick a transition image
    const transWhip = remaining.find((w) => w.images.transition);
    if (transWhip && transWhip.images.transition) {
      result.push({ whip: transWhip, angle: 'transition', src: transWhip.images.transition });
    }

    // Pick a handle image
    const handleWhip = remaining.find((w) => w !== transWhip && w.images.handle);
    if (handleWhip && handleWhip.images.handle) {
      result.push({ whip: handleWhip, angle: 'handle', src: handleWhip.images.handle });
    }

    return result;
  }, []);

  const leftPanel = (
    <Box>
      <Flex mb="6" gap="4" height="700px" justifyContent="center">
        {/* Gallery preview grid — hidden below 1750px */}
        <Flex
          flex="1"
          minW="0"
          height="100%"
          direction="column"
          gap="2"
          overflow="hidden"
          display={{ base: 'none', '2xl': 'none' }}
          sx={{ '@media (min-width: 1750px)': { display: 'flex' } }}
        >
          {/* Hero image — 4:3 centered with side margins */}
          {previewImages[0] && (
            <Flex flex="1" minH="0" justifyContent="center" alignItems="center">
              <Box
                overflow="hidden"
                borderRadius="8px"
                sx={{ aspectRatio: '4 / 3' }}
                height="100%"
                maxW="100%"
              >
                <WhipImage
                  src={previewImages[0].src}
                  alt={`${previewImages[0].whip.id} ${previewImages[0].angle}`}
                  specs={previewImages[0].whip.specs}
                  whipId={previewImages[0].whip.id}
                  fill
                />
              </Box>
            </Flex>
          )}
          {/* Bottom two images — each 5:3 */}
          <Flex flex="1" minH="0" gap="2">
            {previewImages.slice(1).map((item) => (
              <Flex key={`${item.whip.id}-${item.angle}`} flex="1" justifyContent="center" alignItems="center" minW="0">
                <Box
                  overflow="hidden"
                  borderRadius="8px"
                  sx={{ aspectRatio: '2 / 1' }}
                  height="100%"
                  maxW="100%"
                >
                  <WhipImage
                    src={item.src}
                    alt={`${item.whip.id} ${item.angle}`}
                    specs={item.whip.specs}
                    whipId={item.whip.id}
                    fill
                  />
                </Box>
              </Flex>
            ))}
          </Flex>
        </Flex>

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

  const galleryPanel = <WhipGallery />;

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
          <Box>
            <Text fontSize="sm" mb="4">
              On completion, a waxed bullwhip is dropped in Paraffin Wax. Paraffin wax is water
              insoluble and creates a protective layer to the whip. Waxing a paracord bullwhip may
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
      case 4: {
        const selectedLength = whipLengths.find((l) => l.name === whipLength);
        return (
          <SimpleGrid columns={2} spacing="4">
            <Stack spacing="2">
              {whipLengths.map((l) => (
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
      case 5: {
        const selectedHandle = handleLengths.find((l) => l.name === handleLength);
        return (
          <Box>
            <SimpleGrid columns={2} spacing="4">
              <Stack spacing="2">
                {handleLengths.map((l) => (
                  <Button
                    key={l.name}
                    size="sm"
                    width="100%"
                    bg={handleLength === l.name ? '#2D6A4F' : 'white'}
                    color={handleLength === l.name ? 'white' : '#4A5568'}
                    border={handleLength === l.name ? '2px solid' : 'none'}
                    borderColor={handleLength === l.name ? '#CBD5E0' : undefined}
                    _hover={{ bg: handleLength === l.name ? '#245C43' : '#F7FAFC' }}
                    onClick={() => setHandleLength(l.name)}
                  >
                    {`${l.name} ($${l.price})`}
                  </Button>
                ))}
              </Stack>
              <Box>
                {selectedHandle && (
                  <>
                    <Text fontWeight="bold" fontSize="sm" mb="2">{selectedHandle.name}</Text>
                    <Text fontSize="sm">{selectedHandle.description}</Text>
                  </>
                )}
              </Box>
            </SimpleGrid>
            <Text fontSize="sm" fontStyle="italic" mt="4" mb="2">
              Note: Bullwhips are measured from the Heel Knot to the Hitch Knot (where the fall is
              tied on). The handle length does not add to the overall whip length, it just
              determines how much of the whip length is steel rod and rigid.
            </Text>
            <Image src="https://whipworks.s3.us-east-2.amazonaws.com/misc/AnatomyOfABullwhip.jpg" alt="Anatomy of a Bullwhip" width="100%" />
          </Box>
        );
      }
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
          <SimpleGrid columns={{ base: 1, xl: 2 }} spacing="4" sx={{ '@media (max-width: 1300px)': { gridTemplateColumns: '1fr' } }}>
            <Box>
              <Heading size="md" mt="2">
                Add a Collar
              </Heading>
              <Text my="2" fontSize="md">
                A collar is attached to the transition with an additional transition knot added, this
                addition looks great on 12 or 14 inch handles!
              </Text>
              <CollarPicker activeCollar={collar} onClick={setCollar} />
            </Box>
            <Box>
              <Heading size="md" mt="2">
                Add a Heel Loop
              </Heading>
              <Text my="2" fontSize="md">
                Choose your heel knot style — add a heel loop for easy hanging and storage!
              </Text>
              <HeelLoopPicker activeHeelLoop={heelLoop} onClick={setHeelLoop} />
            </Box>
          </SimpleGrid>
        );
      default:
        return null;
    }
  };

  const rightPanel = (
    <Flex direction="column" height="calc(100vh - 120px)" minW="0">
      <Heading mb="4" textAlign="center">
        Design your Bullwhip
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

      {/* Summary + Add to Cart — compact, always visible at bottom */}
      <Box borderTopWidth="1px" borderColor="gray.200" pt="2" mt="2" flexShrink={0}>
        <Flex gap="4" alignItems="stretch">
          <Flex flex="1" direction="column">
            <Text fontWeight="bold" fontSize="sm" mb="1">YOUR BULLWHIP</Text>
            <SimpleGrid columns={3} spacing="1">
              <Text fontSize="xs"><Text as="span" color="gray.500">Primary: </Text>{primary || '—'}</Text>
              <Text fontSize="xs"><Text as="span" color="gray.500">Secondary: </Text>{secondary || '—'}</Text>
              <Text fontSize="xs"><Text as="span" color="gray.500">Handle: </Text>{handleDesign || '—'}</Text>
              <Text fontSize="xs"><Text as="span" color="gray.500">Waxed: </Text>{waxed ? 'Yes' : 'No'}</Text>
              <Text fontSize="xs"><Text as="span" color="gray.500">Length: </Text>{whipLength || '—'}</Text>
              <Text fontSize="xs"><Text as="span" color="gray.500">Handle: </Text>{handleLength || '—'}</Text>
              <Text fontSize="xs"><Text as="span" color="gray.500">Concho: </Text>{concho || '—'}</Text>
              <Text fontSize="xs"><Text as="span" color="gray.500">Collar: </Text>{collar}</Text>
              <Text fontSize="xs"><Text as="span" color="gray.500">Heel Loop: </Text>{heelLoop}</Text>
            </SimpleGrid>
            <Button
              isDisabled={!readyForOrder}
              width="100%"
              size="sm"
              mt="auto"
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
          </Flex>
          <PriceBreakdown
            handleLength={handleLength}
            whipLength={whipLength}
            concho={concho}
            isWaxed={waxed}
            collar={collar}
            heelLoop={heelLoop}
          />
        </Flex>
      </Box>
    </Flex>
  );

  return (
    <>
      <DesignerLayout
        leftPanel={leftPanel}
        leftPanelBottom={galleryPanel}
        rightPanel={rightPanel}
      />
      <BullwhipAddedModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        location={location}
      />
    </>
  );
};

export default BullwhipDesigner;
