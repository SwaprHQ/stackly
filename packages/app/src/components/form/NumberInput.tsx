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

export function NumberInput({
  border = true,
  onChange,
  ...props
}: NumberInputProps) {
  return (
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
  );
}

export function TextInput({
  border = true,
  onChange,
  ...props
}: NumberInputProps) {
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

const StyledInput = styled.input<{ border?: boolean }>(
  ({ border }) => `
  ${border === false ? '' : ''}
  border-radius: 0;
  width: 100%;
  background: #fefaf3;
  box-shadow: 3px 3px 0px 1px #31322d;
  border-radius: 8px;
  &, &:focus, &:active {
    outline: none;
    border: 3px solid #1e1f1b;
  }
`
);
