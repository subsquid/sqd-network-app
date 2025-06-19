import {
  Popover,
  TextField as MuiTextField,
  Box,
  List,
  ListItemButton,
  ListItemText,
  InputAdornment,
} from '@mui/material';
import { usePopupState, bindTrigger, bindPopover, PopupState } from 'material-ui-popup-state/hooks';
import { useState, useMemo } from 'react';
import { Search } from '@components/Search';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { parseTimeRange } from '@lib/datemath';

const quickRanges: TimeRange[] = [
  {
    label: 'Last 12 hours',
    start: 'now-12h',
    end: 'now',
  },
  {
    label: 'Last 24 hours',
    start: 'now-1d',
    end: 'now',
  },
  {
    label: 'Last 2 days',
    start: 'now-2d',
    end: 'now',
  },
  {
    label: 'Last 7 days',
    start: 'now-7d',
    end: 'now',
  },
  {
    label: 'Last 30 days',
    start: 'now-30d',
    end: 'now',
  },
  {
    label: 'Last 90 days',
    start: 'now-90d',
    end: 'now',
  },
  {
    label: 'Last 6 months',
    start: 'now-6M',
    end: 'now',
  },
  {
    label: 'Last 1 year',
    start: 'now-1y',
    end: 'now',
  },
  {
    label: 'Last 2 years',
    start: 'now-2y',
    end: 'now',
  },
  {
    label: 'Last 5 years',
    start: 'now-5y',
    end: 'now',
  },
];

const absoluteRanges: TimeRange[] = [
  {
    label: 'Today',
    start: 'now/d',
    end: 'now/d',
  },
  {
    label: 'Yesterday',
    start: 'now-1d/d',
    end: 'now-1d/d',
  },
  {
    label: 'This week',
    start: 'now/w',
    end: 'now/w',
  },
  {
    label: 'Last week',
    start: 'now-1w/w',
    end: 'now-1w/w',
  },
  {
    label: 'This month',
    start: 'now/M',
    end: 'now/M',
  },
  {
    label: 'Last month',
    start: 'now-1M/M',
    end: 'now-1M/M',
  },
  {
    label: 'This year',
    start: 'now/y',
    end: 'now/y',
  },
  {
    label: 'Last year',
    start: 'now-1y/y',
    end: 'now-1y/y',
  },
];

interface TimeRange {
  label?: string;
  start: string; // Expression or ISO string
  end: string; // Expression or ISO string, optional for "until now" ranges
}

const TimeRangePickerContent = ({
  value,
  popupState,
  onChange,
}: {
  value?: TimeRange;
  popupState: PopupState;
  onChange: (range: TimeRange) => void;
}) => {
  const [isCustom, setIsCustom] = useState(!value?.label);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuickRanges = useMemo(() => {
    return quickRanges.filter(range =>
      range.label?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const allRanges = useMemo(() => {
    const absolute = absoluteRanges.filter(range =>
      range.label?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    return [...filteredQuickRanges, ...absolute];
  }, [searchQuery, filteredQuickRanges]);

  const formik = useFormik<Partial<{ start: Date; end: Date }>>({
    initialValues: {
      start: undefined,
      end: undefined,
    },
    validate: values => {
      if (!values.start) {
        throw new Error('Start date is required');
      } else if (!values.end) {
        throw new Error('End date is required');
      }
    },
    onSubmit: values => {
      const { start, end } = values;
      if (start && end) {
        handleSelect({
          start: start.toISOString(),
          end: end.toISOString(),
        });
      }
    },
  });

  const handleSelect = (range: TimeRange) => {
    onChange(range);
    popupState.close();
  };

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
              <ListItemButton key={range.label} onClick={() => handleSelect(range)}>
                <ListItemText primary={range.label} />
              </ListItemButton>
            ))}
            {/*<ListItemButton key="custom" onClick={() => setIsCustom(true)}>
              <ListItemText primary="Custom" />
            </ListItemButton>*/}
          </List>
        </Box>
      </Box>
      {/* <Box
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
            disabled={!isCustom}
            label="From"
            name="startDate"
            enableAccessibleFieldDOMStructure={false}
            formik={formik}
          />
          <FormikDateTimePicker
            disabled={!isCustom}
            label="To"
            name="endDate"
            enableAccessibleFieldDOMStructure={false}
            formik={formik}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <Button
            disabled={!isCustom}
            variant="contained"
            onClick={() => popupState.close()}
            color="primary"
          >
            CANCEL
          </Button>
          <Button
            disabled={!isCustom || !formik.isValid}
            variant="contained"
            onClick={e => formik.handleSubmit()}
            color="info"
          >
            APPLY
          </Button>
        </Box>
      </Box>*/}
    </Box>
  );
};

function formatRange(range: TimeRange) {
  if (range.label) {
    return range.label;
  }
  const extistingRange = [...quickRanges, ...absoluteRanges].find(
    r => range.start === r.start && range.end === r.end,
  );
  if (extistingRange) {
    return extistingRange.label;
  }

  // Use parseTimeRange for smart handling of identical start/end expressions
  const { from, to } = parseTimeRange(range.start, range.end);
  const startText = format(from, 'yyyy-MM-dd HH:mm');
  const endText = format(to, 'yyyy-MM-dd HH:mm');
  return `${startText} to ${endText}`;
}

export const TimeRangePicker = ({
  value,
  onChange,
}: {
  value?: Omit<TimeRange, 'label'>;
  onChange: (range: Omit<TimeRange, 'label'>) => void;
}) => {
  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'timeRangePicker',
  });

  const [displayValue, setDisplayValue] = useState(formatRange(value || quickRanges[0]));
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (range: TimeRange) => {
    setDisplayValue(formatRange(range));
    setSelectedValue(range);
    onChange(range);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <>
        <MuiTextField
          {...bindTrigger(popupState)}
          value={displayValue}
          variant="filled"
          color="secondary"
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
          <TimeRangePickerContent
            value={selectedValue}
            popupState={popupState}
            onChange={handleChange}
          />
        </Popover>
      </>
    </LocalizationProvider>
  );
};
