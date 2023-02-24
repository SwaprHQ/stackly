import { InputHTMLAttributes } from 'react';
import styled from 'styled-components';

interface NumberInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'pattern' | 'type'
  > {
  onChange: (value: string) => void;
  border?: boolean;
}

export function NumberInput({ border = true, onChange, ...props }: NumberInputProps) {
  return (
    <StyledInputShadowWrapper>
      <StyledInput
        {...props}
        border={border}
        onWheel={(e) => e.currentTarget.blur()}
        type="number"
        pattern="^-?[0-9]\d*\.?\d*$"
        onChange={(e) => {
          const value = e.target.value.replace(/-|e/gi, '');
          onChange(value);
        }}
      />
    </StyledInputShadowWrapper>
  );
}

export function TextInput({ border = true, onChange, ...props }: NumberInputProps) {
  return (
    <StyledInput
      {...props}
      border={border}
      type="text"
      onChange={(e) => {
        onChange(e.target.value);
      }}
    />
  );
}

/**
 * Adds
 */
const StyledInputShadowWrapper = styled.div`
  box-shadow: 3px 3px 0px 1px #31322d;
  border: 3px solid #1e1f1b;
  border-radius: 8px;
  overflow: hidden;
`;

const StyledInput = styled.input<{ border?: boolean }>(
  ({ border }) => `
  ${border === false ? '' : ''}
  width: 100%;
  background: #fefaf3;
  &, &:focus, &:active {
    outline: none;
    border: none; /** Handled by StyledInputShadowWrapper */
  }
`
);
