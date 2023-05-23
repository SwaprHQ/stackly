import dayjs, { Dayjs } from 'dayjs';
import { StyledInput, StyledInputShadowWrapper } from './StyledInput';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface DateTimeInputProps {
  value: Dayjs | 'Now';
  onChange: (nextValue: Dayjs) => void;
  disabled?: boolean;
}

export function DateTimeInput({ disabled, value, onChange }: DateTimeInputProps) {
  const valuesIsString = typeof value === 'string';
  const [inputValue, setInputValue] = useState(valuesIsString ? value : value.format('YYYY-MM-DDTHH:mm'));
  const valueIsNow = inputValue === 'Now';

  useEffect(() => {
    setInputValue(valuesIsString ? value : value.format('YYYY-MM-DDTHH:mm'));
  }, [value, valuesIsString]);

  const ref = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    if (ref.current) ref.current.showPicker();
  };
  const handleFocus = () => {
    if (ref.current) ref.current.focus();
  };

  return (
    <StyledInputShadowWrapper>
      <HiddenInput $hide={valueIsNow}>
        <StyledInput
          ref={ref}
          type="datetime-local"
          onChange={(event: React.FocusEvent<HTMLInputElement>) => setInputValue(event.target.value)}
          value={valueIsNow ? '' : inputValue}
          // For some reason, `min/max` values require the same format as `value`,
          // but they don't need to be in the user's timezone
          min={dayjs().format('YYYY-MM-DDTHH:mm')}
          max={dayjs().add(1000, 'y').format('YYYY-MM-DDTHH:mm')}
          // The `pattern` is not used at all in `datetime-local` input, but is in place
          // to enforce it when it isn't supported. In that case it's rendered as a regular `text` input
          pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
          onFocus={(event: React.FocusEvent<HTMLInputElement>) => {
            // Bug fix for resetting input with `reset` button iOS
            // See https://github.com/facebook/react/issues/8938
            event.target.defaultValue = '';
          }}
          onBlur={() => {
            if (!valueIsNow) onChange(dayjs(inputValue));
          }}
          disabled={disabled}
        />
      </HiddenInput>
      <SpecialInput
        value={valueIsNow ? inputValue : ''}
        disabled={disabled}
        onClick={handleClick}
        onFocus={handleFocus}
        hidden={!valueIsNow}
        readOnly
      />
    </StyledInputShadowWrapper>
  );
}

const SpecialInput = styled(StyledInput)`
  caret-color: transparent;
  cursor: default;
`;

const HiddenInput = styled.div<{ $hide?: boolean }>(
  ({ $hide }) =>
    $hide &&
    `
  width: 0;
  height: 0;
`
);
