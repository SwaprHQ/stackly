import styled from 'styled-components';

export const Card = styled.div`
  position: relative;
  background: #fbf4e6;
  border: 5px solid #1e1f1b;
  box-shadow: 12px 12px 0px -1px #1e1f1b;
  border-radius: 24px;
  margin-right: 12px;
`;

export const CardExtraShadow = styled(Card)`
  margin-left: 30px;
  margin-top: 30px;
  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fbf4e6;
    border: 5px solid #1e1f1b;
    border-radius: 24px;
  }
  &:before {
    transform: translate(-20px, -20px);
    z-index: -1;
  }
  &:after {
    transform: translate(-35px, -35px);
    z-index: -2;
  }
`;

export const CardInnerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 16px;
  @media (min-width: 768px) {
    padding: 28px;
  }
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
`;
