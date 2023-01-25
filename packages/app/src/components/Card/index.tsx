import styled from 'styled-components';

export const Card = styled.div`
  position: relative;
  overflow: hidden;
  border: 2px solid;
  -webkit-box-shadow: 8px 8px 0px -1px rgba(0, 0, 0, 1);
  -moz-box-shadow: 8px 8px 0px -1px rgba(0, 0, 0, 1);
  box-shadow: 8px 8px 0px -1px rgba(0, 0, 0, 1);
`;

export const CardInnerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
`;
