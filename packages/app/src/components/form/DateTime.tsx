import dayjs, { Dayjs } from 'dayjs';
import { StyledInput, StyledInputShadowWrapper } from './StyledInput';
import { useRef } from 'react';
import styled from 'styled-components';

interface DateTimeInputProps {
  value: Dayjs | 'Now';
  onChange: (nextValue: Dayjs) => void;
  disabled?: boolean;
}

export function DateTimeInput({ disabled, value, onChange }: DateTimeInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    if (ref.current) ref.current.showPicker();
  };
  const valuesIsString = typeof value === 'string';
  return (
    <StyledInputShadowWrapper>
      <HiddenInput $hide={valuesIsString}>
        <StyledInput
          ref={ref}
          type="datetime-local"
          onChange={(event: React.FocusEvent<HTMLInputElement>) => onChange(dayjs(event.target.value))}
          value={valuesIsString ? '' : value.format('YYYY-MM-DDTHH:mm')}
          // For some reason, `min/max` values require the same format as `value`,
          // but they don't need to be in the user's timezone
          min={dayjs().format('YYYY-MM-DDTHH:mm')}
          // The `pattern` is not used at all in `datetime-local` input, but is in place
          // to enforce it when it isn't supported. In that case it's rendered as a regular `text` input
          pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
          onFocus={(event: React.FocusEvent<HTMLInputElement>) => {
            // Bug fix for resetting input with `reset` button iOS
            // See https://github.com/facebook/react/issues/8938
            event.target.defaultValue = '';
          }}
          disabled={disabled}
        />
      </HiddenInput>
      <SpecialInput
        value={valuesIsString ? value : ''}
        disabled={disabled}
        onClick={handleClick}
        hidden={!valuesIsString}
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
  padding: 0;
`
);
