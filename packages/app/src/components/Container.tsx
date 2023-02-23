import styled from 'styled-components';

const CONTAINER_MAX_WIDTH = '1000px';

export const Container = styled.div`
  height: 100%;
  margin: 0 auto;
  max-width: ${CONTAINER_MAX_WIDTH};
  padding: 0 16px;
  width: 100%;
`;

export const FlexContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const ContainerTitle = styled.h1`
  font-size: 3rem;
  margin: 0;
  padding-top: 24px;
  padding-bottom: 24px;
`;
