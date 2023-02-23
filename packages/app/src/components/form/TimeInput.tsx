import Select from 'react-select';
import { getStyles } from './Select';

interface TimeInputProps {
  hour: string;
  handleHourChange: (hour: string) => void;
  disabled?: boolean;
}

interface TimeOption {
  label: string;
  value: string;
}

// A list of time: 00:00 - 23:00
const timeOptions: TimeOption[] = Array.from(Array(24).keys()).map((i) => {
  const value = i.toString();
  const label = i < 10 ? `0${i}:00` : `${i}:00`;
  return {
    label,
    value,
  };
});

export function TimeInput({ hour, handleHourChange, disabled }: TimeInputProps) {
  return (
    <Select<TimeOption, false>
      isDisabled={disabled}
      value={timeOptions.find((option) => option.value === hour)}
      options={timeOptions}
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.value}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
      }}
      styles={getStyles<TimeOption>()}
      isMulti={false}
      onChange={(option) => {
        if (option) {
          handleHourChange(option?.value as string);
        }
      }}
    />
  );
}
