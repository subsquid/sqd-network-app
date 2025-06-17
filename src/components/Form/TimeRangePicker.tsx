import {
  Popover,
  TextField as MuiTextField,
  Button,
  Box,
  List,
  ListItemButton,
  ListItemText,
  InputAdornment,
} from '@mui/material';
import { usePopupState, bindTrigger, bindPopover, PopupState } from 'material-ui-popup-state/hooks';
import { useState, useMemo } from 'react';
import { Search } from '@components/Search';
import {
  format,
  sub,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  Duration,
} from 'date-fns';
import { Formik, useFormikContext } from 'formik';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { FormikDateTimePicker } from './FormikDateTimePicker';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const quickRanges = [
  { label: 'Last 24 hours', duration: { hours: 24 } },
  { label: 'Last 2 days', duration: { days: 2 } },
  { label: 'Last 7 days', duration: { days: 7 } },
  { label: 'Last 30 days', duration: { days: 30 } },
  { label: 'Last 90 days', duration: { days: 90 } },
  { label: 'Last 6 months', duration: { months: 6 } },
  { label: 'Last 1 year', duration: { years: 1 } },
  { label: 'Last 2 years', duration: { years: 2 } },
  { label: 'Last 5 years', duration: { years: 5 } },
];

const absoluteRanges = [
  {
    label: 'Today',
    getRange: () => {
      const now = new Date();
      return { start: startOfDay(now), end: endOfDay(now) };
    },
  },
  {
    label: 'Yesterday',
    getRange: () => {
      const now = new Date();
      const yesterday = sub(now, { days: 1 });
      return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
    },
  },
  {
    label: 'This week',
    getRange: () => {
      const now = new Date();
      return { start: startOfWeek(now), end: endOfWeek(now) };
    },
  },
  {
    label: 'This month',
    getRange: () => {
      const now = new Date();
      return { start: startOfMonth(now), end: endOfMonth(now) };
    },
  },
  {
    label: 'This year',
    getRange: () => {
      const now = new Date();
      return { start: startOfYear(now), end: endOfYear(now) };
    },
  },
];

interface TimeRange {
  startDate: Date | null;
  endDate: Date | null;
}

const TimeRangePickerContent = ({ popupState }: { popupState: PopupState }) => {
  const { values, setFieldValue, submitForm } = useFormikContext<TimeRange>();
  const [searchQuery, setSearchQuery] = useState('');

  const handleQuickRangeSelect = (duration: Duration) => {
    const now = new Date();
    setFieldValue('endDate', now);
    setFieldValue('startDate', sub(now, duration));
  };

  const handleAbsoluteRangeSelect = (getRange: () => { start: Date; end: Date }) => {
    const { start, end } = getRange();
    setFieldValue('startDate', start);
    setFieldValue('endDate', end);
  };

  const filteredQuickRanges = useMemo(() => {
    return quickRanges.filter(range =>
      range.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const allRanges = useMemo(() => {
    const absolute = absoluteRanges.filter(range =>
      range.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    return [...filteredQuickRanges, ...absolute];
  }, [searchQuery, filteredQuickRanges]);

  return (
    <Box
      sx={{
        display: 'flex',
        width: 1,
        height: '320px',
      }}
    >
      <Box
        sx={{
          width: '160px',
          borderRight: 1,
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ p: 1 }}>
          <Search placeholder="Search" value={searchQuery} onChange={setSearchQuery} fullWidth />
        </Box>
        <Box sx={{ overflowY: 'auto', flex: 1 }}>
          <List dense sx={{ p: 0 }}>
            {allRanges.map(range => (
              <ListItemButton
                key={range.label}
                onClick={() =>
                  'duration' in range
                    ? handleQuickRangeSelect(range.duration)
                    : handleAbsoluteRangeSelect(range.getRange)
                }
              >
                <ListItemText primary={range.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Box>
      <Box
        sx={{
          py: 2,
          px: 2,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormikDateTimePicker
            label="From"
            name="startDate"
            enableAccessibleFieldDOMStructure={false}
          />
          <FormikDateTimePicker
            label="To"
            name="endDate"
            enableAccessibleFieldDOMStructure={false}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <Button variant="contained" onClick={() => popupState.close()} color="primary">
            CANCEL
          </Button>
          <Button variant="contained" onClick={submitForm} color="info">
            APPLY
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export const TimeRangePicker = ({
  value,
  onChange,
}: {
  value?: { from: Date; to: Date };
  onChange: (range: { from: Date; to: Date }) => void;
}) => {
  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'timeRangePicker',
  });

  const [displayValue, setDisplayValue] = useState(
    value
      ? `${format(value.from, 'yyyy-MM-dd HH:mm')} - ${format(value.to, 'yyyy-MM-dd HH:mm')}`
      : '',
  );

  const handleApply = (values: TimeRange) => {
    const { startDate, endDate } = values;
    if (startDate && endDate) {
      const formattedStart = format(startDate, 'yyyy-MM-dd HH:mm');
      const formattedEnd = format(endDate, 'yyyy-MM-dd HH:mm');
      setDisplayValue(`${formattedStart} - ${formattedEnd}`);
      popupState.close();
      onChange({ from: startDate, to: endDate });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Formik<TimeRange> initialValues={{ startDate: null, endDate: null }} onSubmit={handleApply}>
        <>
          <MuiTextField
            {...bindTrigger(popupState)}
            value={displayValue}
            variant="filled"
            sx={{
              '& .MuiInputBase-input': {
                cursor: 'pointer',
              },
            }}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <ArrowDropDownIcon
                    sx={{
                      transform: popupState.isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: '0.2s',
                    }}
                  />
                </InputAdornment>
              ),
              sx: {
                cursor: 'pointer',
                backgroundColor: 'white !important',
                border: 'none !important',
              },
            }}
          />
          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            slotProps={{
              paper: {
                sx: {
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  mt: 1,
                },
              },
            }}
          >
            <TimeRangePickerContent popupState={popupState} />
          </Popover>
        </>
      </Formik>
    </LocalizationProvider>
  );
};
