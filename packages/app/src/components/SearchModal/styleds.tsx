import styled from 'styled-components/macro';

export const TextDot = styled.div`
  height: 3px;
  width: 3px;
  background-color: ${({ theme }) => theme.deprecated_text2};
  border-radius: 50%;
`;

export const Checkbox = styled.input`
  border: 1px solid ${({ theme }) => theme.deprecated_red3};
  height: 20px;
  margin: 0;
`;

export const PaddedColumn = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

export const MenuItem = styled.div<{
  dim?: boolean;
  disabled: boolean;
  selected: boolean;
}>`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto minmax(0, 72px);
  grid-gap: 16px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  :hover {
    background-color: ${({ theme }) => theme.hoverDefault};
  }
  opacity: ${({ disabled, selected, dim }) =>
    dim || disabled || selected ? 0.4 : 1};
`;

export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.backgroundOutline};
`;

export const SeparatorDark = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.deprecated_bg3};
`;

export const LoadingRows = styled.div`
  grid-column-gap: 0.5em;
  grid-template-columns: repeat(12, 1fr);
  max-width: 960px;
  padding: 12px 20px;

  & > div:nth-child(4n + 1) {
    grid-column: 1 / 8;
    height: 1em;
    margin-bottom: 0.25em;
  }
  & > div:nth-child(4n + 2) {
    grid-column: 12;
    height: 1em;
    margin-top: 0.25em;
  }
  & > div:nth-child(4n + 3) {
    grid-column: 1 / 4;
    height: 0.75em;
  }
`;
