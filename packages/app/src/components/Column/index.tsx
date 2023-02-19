import styled from 'styled-components/macro';

export const Column = styled.div<{
  gap?: number;
}>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: ${({ gap, theme }) => gap && theme.grids[gap]};
`;
export const ColumnCenter = styled(Column)`
  width: 100%;
  align-items: center;
`;

export const AutoColumn = styled.div<{
  gap?: number | string;
  justify?:
    | 'stretch'
    | 'center'
    | 'start'
    | 'end'
    | 'flex-start'
    | 'flex-end'
    | 'space-between';
}>`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: ${({ gap, theme }) => gap};
  justify-items: ${({ justify }) => justify && justify};
`;

export default Column;
