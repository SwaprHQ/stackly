import {
  ChainId,
  DCAFrequencyInterval,
  Token,
  USDC,
  WETH,
  WXDAI,
} from 'dca-sdk';
import Select, { StylesConfig } from 'react-select';

const tokenOptions = [USDC[ChainId.GNOSIS], WXDAI, WETH[ChainId.GNOSIS]];

interface TokenSelectProps {
  value: Token;
  onChange: (token: Token) => void;
}

export function getStyles<T>() {
  return {
    container: (provided) => ({
      ...provided,
      minWidth: '80px',
    }),
    control: (provided) => ({
      borderRadius: 0,
      boxShadow: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      width: '100%',
      fontSize: '16px',
      border: '2px solid #000',
      padding: '8px 8px',
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: 0,
      fontSize: '18px',
      fontFamily: `'Urbanist', sans-serif`,
      fontWeight: 'bold',
      textTransform: 'uppercase',
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: 0,
      border: '2px solid #000',
      borderTop: 'none',
      marginTop: 0,
      zIndex: 10,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#000' : '#fff',
      color: state.isSelected ? '#fff' : '#000',
      cursor: 'pointer',
      fontWeight: 'bold',
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '90px',
    }),
  } as StylesConfig<T>;
}

export function TokenSelect({ value, onChange }: TokenSelectProps) {
  return (
    <Select
      value={value}
      options={tokenOptions}
      getOptionLabel={(option) => option.symbol}
      getOptionValue={(option) => option.address}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
      }}
      styles={getStyles<Token>()}
      isMulti={false}
      onChange={(option) => onChange(option as Token)}
    />
  );
}

interface FrequencyIntervalSelectProps {
  value: DCAFrequencyInterval;
  onChange: (token: DCAFrequencyInterval) => void;
}

const frequencyIntervalOptions = [
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

export function FrequencyIntervalSelect({
  value,
  onChange,
}: FrequencyIntervalSelectProps) {
  return (
    <Select
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
        option && onChange(option.value as DCAFrequencyInterval);
      }}
    />
  );
}
