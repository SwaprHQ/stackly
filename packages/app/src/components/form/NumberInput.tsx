import { InputHTMLAttributes } from 'react';
import { StyledInput, StyledInputShadowWrapper } from './StyledInput';

interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'pattern' | 'type'> {
  onChange: (value: string) => void;
  border?: boolean;
}

export function NumberInput({ border = true, onChange, ...props }: NumberInputProps) {
  return (
    <StyledInputShadowWrapper>
      <StyledInput
        {...props}
        border={border}
        type="string"
        onChange={(e) => {
          const decimalNumberRegex = /^[0-9]*[.,]?[0-9]*$/;

          if (e.target.value === '' || decimalNumberRegex.test(e.target.value)) {
            onChange(e.target.value);
          }
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
