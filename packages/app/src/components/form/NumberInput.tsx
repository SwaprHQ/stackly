import { InputHTMLAttributes } from 'react';
import styled from 'styled-components';

interface NumberInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'pattern' | 'type'
  > {
  onChange: (value: string) => void;
}

export function NumberInput({ onChange, ...props }: NumberInputProps) {
  return (
    <StyledInput
      {...props}
      type="number"
      pattern="^-?[0-9]\d*\.?\d*$"
      onChange={(e) => {
        const value = e.target.value.replace(/-|e/gi, '');
        onChange(value);
      }}
    />
  );
}

const StyledInput = styled.input`
  border: 2px solid #000;
  border-radius: 0;
  width: 100%;
`;
