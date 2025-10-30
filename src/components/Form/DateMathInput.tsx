import React, { useState, useCallback } from 'react';
import { TextField, InputAdornment, Chip, Box, Typography, Alert } from '@mui/material';
import { format } from 'date-fns';
import { parseDateMath, isDateMathExpression } from '@lib/datemath';

interface DateMathInputProps {
  value?: string;
  onChange?: (value: string, parsedDate?: Date) => void;
  placeholder?: string;
  helperText?: string;
  error?: boolean;
  label?: string;
}

const EXAMPLE_EXPRESSIONS = ['now-5m', 'now-1h', 'now-1d/d', 'now/w', 'now-30d', '2024-01-01||+1M'];

export const DateMathInput: React.FC<DateMathInputProps> = ({
  value = '',
  onChange,
  placeholder = 'Enter date math expression (e.g., now-5m)',
  helperText,
  error: externalError,
  label = 'Date Math Expression',
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [parsedDate, setParsedDate] = useState<Date | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setInputValue(newValue);

      if (!newValue.trim()) {
        setParsedDate(null);
        setParseError(null);
        onChange?.(newValue);
        return;
      }

      try {
        const parsed = parseDateMath(newValue);
        setParsedDate(parsed);
        setParseError(null);
        onChange?.(newValue, parsed);
      } catch (err) {
        setParsedDate(null);
        setParseError(err instanceof Error ? err.message : 'Invalid expression');
        onChange?.(newValue);
      }
    },
    [onChange],
  );

  const handleExampleClick = useCallback(
    (expression: string) => {
      setInputValue(expression);
      try {
        const parsed = parseDateMath(expression);
        setParsedDate(parsed);
        setParseError(null);
        onChange?.(expression, parsed);
      } catch (err) {
        setParsedDate(null);
        setParseError(err instanceof Error ? err.message : 'Invalid expression');
        onChange?.(expression);
      }
    },
    [onChange],
  );

  const hasError = externalError || !!parseError;
  const isValid = !hasError && parsedDate && isDateMathExpression(inputValue);

  return (
    <Box>
      <TextField
        fullWidth
        label={label}
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        error={hasError}
        helperText={parseError || helperText}
        InputProps={{
          endAdornment: parsedDate && (
            <InputAdornment position="end">
              <Chip
                size="small"
                color={isValid ? 'success' : 'default'}
                label={format(parsedDate, 'MMM dd, HH:mm')}
              />
            </InputAdornment>
          ),
        }}
      />

      {/* Examples */}
      <Box sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
          Examples:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {EXAMPLE_EXPRESSIONS.map(expression => (
            <Chip
              key={expression}
              size="small"
              variant="outlined"
              label={expression}
              onClick={() => handleExampleClick(expression)}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Show parsed result */}
      {parsedDate && !parseError && (
        <Alert severity="info" sx={{ mt: 1 }}>
          <Typography variant="body2">
            <strong>Parsed:</strong> {format(parsedDate, 'yyyy-MM-dd HH:mm:ss')}
          </Typography>
        </Alert>
      )}

      {/* Syntax help */}
      <Box sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          <strong>Syntax:</strong> now±[amount][unit][/unit] | [date]||±[amount][unit][/unit]
          <br />
          <strong>Units:</strong> s (second), m (minute), h (hour), d (day), w (week), M (month), y
          (year)
          <br />
          <strong>Rounding:</strong> /d (start of day), /h (start of hour), /M (start of month),
          etc.
        </Typography>
      </Box>
    </Box>
  );
};
