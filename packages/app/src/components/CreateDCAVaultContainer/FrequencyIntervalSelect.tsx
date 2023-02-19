import { DCAFrequencyInterval } from 'dca-sdk';
import Select from 'react-select';
import { getStyles } from '../form/Select';

interface FrequencyIntervalSelectProps {
  value: DCAFrequencyInterval;
  onChange: (token: DCAFrequencyInterval) => void;
  disabled?: boolean;
}

type Option = {
  label: string;
  value: DCAFrequencyInterval;
};

const frequencyIntervalOptions: Option[] = [
  {
    label: 'Hour',
    value: DCAFrequencyInterval.HOUR,
  },
  {
    label: 'Day',
    value: DCAFrequencyInterval.DAY,
  },
  {
    label: 'Week',
    value: DCAFrequencyInterval.WEEK,
  },
  {
    label: 'Month',
    value: DCAFrequencyInterval.MONTH,
  },
];

export function getFrequencyIntervalInHours(interval: DCAFrequencyInterval) {
  switch (interval) {
    case DCAFrequencyInterval.HOUR:
      return 1;
    case DCAFrequencyInterval.DAY:
      return 24;
    case DCAFrequencyInterval.WEEK:
      return 24 * 7;
    case DCAFrequencyInterval.MONTH:
      return 24 * 30;
    default:
      return 1;
  }
}

export function FrequencyIntervalSelect({
  value,
  disabled,
  onChange,
}: FrequencyIntervalSelectProps) {
  return (
    <Select<Option, false>
      isDisabled={disabled}
      value={frequencyIntervalOptions.find((option) => option.value === value)}
      options={frequencyIntervalOptions}
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.value}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
      }}
      styles={getStyles<{
        label: string;
        value: DCAFrequencyInterval;
      }>()}
      isMulti={false}
      onChange={(option) => {
        option && onChange(option.value);
      }}
    />
  );
}
