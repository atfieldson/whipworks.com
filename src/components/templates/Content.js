import styled from '@emotion/styled';
import { Box } from '@chakra-ui/core';

const Content = styled(Box)`
  margin: 0 auto;
  padding: 0 20px;
  max-width: ${props => props.theme.maxContentWidth};
`;

export default Content;
