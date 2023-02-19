import dayjs, { Dayjs } from 'dayjs';
import { getStyles } from './Select';
import { useState } from 'react';
import * as chrono from 'chrono-node';
import dayjsCalendarPlugin from 'dayjs/plugin/calendar';
import Select, {
  OptionProps,
  components as SelectComponents,
} from 'react-select';
import styled from 'styled-components';

const calendarDefault = {
  sameDay: '[Today at] h:mm A', // The same day ( Today at 2:30 AM )
  nextDay: '[Tomorrow at] h:mm A', // The next day ( Tomorrow at 2:30 AM )
  nextWeek: 'dddd [at] h:mm A', // The next week ( Sunday at 2:30 AM )
  lastDay: '[Yesterday] at h:mm A', // The day before ( Yesterday at 2:30 AM )
  lastWeek: '[Last] dddd at h A', // Last week ( Last Monday at 2:30 AM )
  sameElse: 'dddd, MMM DD, YYYY [at] h:mm A', // Everything else ( 17/10/2011 )
};

dayjs.locale('en');
dayjs.extend(dayjsCalendarPlugin, calendarDefault);

interface TimeOption {
  label: string;
  value: string;
}

interface DateOption {
  date: Dayjs;
  value: Date;
  label: string;
  display?: string;
}
const defaultOptions: DateOption[] = ['now', 'tomorrow at 14:00'].map(
  (option) => createOptionForDate(chrono.en.parseDate(option))
);

const suggestions = [
  'sunday',
  'saturday',
  'friday',
  'thursday',
  'wednesday',
  'tuesday',
  'monday',
  'december',
  'november',
  'october',
  'september',
  'august',
  'july',
  'june',
  'may',
  'april',
  'march',
  'february',
  'january',
  'yesterday',
  'tomorrow',
  'today',
].reduce<{ [key: string]: string }>((acc, str) => {
  for (let i = 1; i < str.length; i++) {
    acc[str.substr(0, i)] = str;
  }
  return acc;
}, {});

const suggest = (str: string) =>
  str
    .split(/\b/)
    .map((i) => suggestions[i] || i)
    .join('');

function Option(props: OptionProps<DateOption, false>) {
  const { data, innerRef, innerProps } = props;
  if (data.display === 'calendar') {
    return (
      <span {...innerProps} ref={innerRef}>
        {data.date.format('D')}
      </span>
    );
  } else return <SelectComponents.Option {...props} />;
}

interface DatePickerProps {
  readonly value: DateOption | null;
  readonly onChange: (newValue: DateOption | null) => void;
  readonly disabled?: boolean;
}

function DatePicker(props: DatePickerProps) {
  const [options, setOptions] = useState(defaultOptions);

  const handleInputChange = (value: string) => {
    if (!value) {
      setOptions(defaultOptions);
      return;
    }

    const date = chrono.parseDate(suggest(value.toLowerCase()));

    // Date could not be parsed, return empty options
    if (!date) {
      setOptions([]);
      return;
    }

    setOptions([createOptionForDate(date)]);
  };

  return (
    <Select<DateOption, false>
      {...props}
      isDisabled={props.disabled}
      id="date-picker"
      components={{
        Option,
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
      }}
      filterOption={null}
      styles={getStyles<DateOption>()}
      isMulti={false}
      isOptionSelected={(o, v) => v.some((i) => i.date.isSame(o.date, 'day'))}
      maxMenuHeight={380}
      getOptionLabel={(o) => o.label}
      onChange={props.onChange}
      onInputChange={handleInputChange}
      options={options}
      value={props.value}
    />
  );
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

function createOptionForDate(d: Dayjs | Date) {
  const date = dayjs.isDayjs(d)
    ? d
    : dayjs(d, {
        locale: 'en',
      });
  return {
    date,
    value: date.toDate(),
    label: date.calendar(null, calendarDefault),
  };
}

interface DateTimeInputProps {
  value: Dayjs;
  onChange: (nextValue: Dayjs) => void;
  defaultDateOptions?: DateOption[];
  disabled?: boolean;
}

interface TimeInputProps {
  hour: string;
  handleHourChange: (hour: string) => void;
  disabled?: boolean;
}

export function TimeInput({
  hour,
  handleHourChange,
  disabled,
}: TimeInputProps) {
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

export function DateTimeInput({
  disabled,
  value,
  onChange,
}: DateTimeInputProps) {
  return (
    <DateTimeInputWrapper>
      <DatePicker
        disabled={disabled}
        value={{
          date: value,
          value: value.toDate(),
          label: value.calendar(null, calendarDefault),
        }}
        onChange={(option) => {
          if (option) {
            onChange(option?.date);
          }
        }}
      />
    </DateTimeInputWrapper>
  );
}

const DateTimeInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  #date-picker {
    flex: 1;
  }
`;
