import dayjs, { Dayjs } from 'dayjs';
import { getStyles } from './Select';
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import * as chrono from 'chrono-node';
import dayjsCalendarPlugin from 'dayjs/plugin/calendar';
import Select from 'react-select';

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

interface NowDateOption {
  date: 'now';
  value: 'now';
  label: 'Now';
}

interface GenericDateOption {
  date: Dayjs;
  value: Date;
  label: string;
}
type DateOption = NowDateOption | GenericDateOption;

const NOW_DATE_OPTION: NowDateOption = {
  date: 'now',
  value: 'now',
  label: 'Now',
};

function createDefaultDateOptions(nowOptions?: boolean): DateOption[] {
  const defaultDateOptions: DateOption[] = [];

  if (nowOptions) {
    defaultDateOptions.push(NOW_DATE_OPTION);
  }

  // Add random dates
  defaultDateOptions.push(
    ...['tomorrow at 14:00'].map((expression) => createDateOptionForDate(chrono.en.parseDate(expression)))
  );

  return defaultDateOptions;
}

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

function createDateOptionForDate(d: Dayjs | Date): DateOption {
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
  value: Dayjs | 'now';
  onChange: (nextValue: Dayjs | 'now') => void;
  disabled?: boolean;
  showNowOption?: boolean;
}

export function DateTimeInput({ showNowOption = false, disabled, value, onChange }: DateTimeInputProps) {
  const instanceDefaultDateOptions = useMemo(() => createDefaultDateOptions(showNowOption), [showNowOption]);
  const [options, setOptions] = useState(instanceDefaultDateOptions);

  const handleInputChange = (value: string) => {
    // If the user types nothing, return the default options
    if (!value) {
      setOptions(instanceDefaultDateOptions);
      return;
    }

    const nextOptions = [];
    value = value.toLowerCase();
    // The expression starts "no" or "now"
    const hasNowExpression = ['no', 'now'].some((searchTerm) => value.startsWith(searchTerm));

    if (hasNowExpression) {
      nextOptions.push(NOW_DATE_OPTION);
    }

    // Attempt to suggest more options
    const parsedDate = chrono.parseDate(suggest(value));
    // If the expression is a valid date, add it to the options
    if (parsedDate) {
      nextOptions.push(createDateOptionForDate(parsedDate));
    }

    // Update the options
    setOptions(nextOptions);
  };

  return (
    <DateTimeInputWrapper>
      <Select<DateOption, false>
        isDisabled={disabled}
        id="chrono-datetime"
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
        filterOption={null}
        styles={getStyles<DateOption>()}
        isMulti={false}
        maxMenuHeight={380}
        getOptionLabel={(o) => o.label}
        onChange={(nextOption) => {
          if (nextOption) {
            onChange(nextOption?.date);
          }
        }}
        onInputChange={handleInputChange}
        options={options}
        value={
          {
            date: value,
            value: value === 'now' ? 'now' : value.toDate(),
            label: value === 'now' ? 'Now' : value.calendar(null, calendarDefault),
            display: value === 'now' ? 'Now' : 'calendar',
          } as DateOption
        }
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
