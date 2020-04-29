import { Box } from '@chakra-ui/core';
import styled from '@emotion/styled';

/** since the Header component is fixed, components
 * can render underneath it (by design). In cases where that's
 * not desired behavior, use this component to offset the header. */
export default styled(Box)`
  height: 80px;
  width: 100%;
`;
