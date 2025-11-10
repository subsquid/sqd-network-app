import React, { useRef, useState } from 'react';

import { ContentCopyOutlined } from '@mui/icons-material';
import { Box, IconButton, Stack, styled, SxProps } from '@mui/material';
import { alpha } from '@mui/system/colorManipulator';
import classNames from 'classnames';

import { CopyToClipboardTooltip } from './CopyToClipboardTooltip';

export interface CopyToClipboardProps {
  /** The text to be copied to clipboard */
  text: string;
  /** Custom content to display instead of the text */
  content?: React.ReactNode;
  /** Size of the copy button in pixels */
  copyButtonSize?: number;
  /** Whether to show a bordered container */
  bordered?: boolean;
  /** Whether to take full width */
  fullWidth?: boolean;
  /** Whether to add bottom margin */
  gutterBottom?: boolean;
  /** Custom styles for the wrapper */
  sx?: SxProps;
  /** Custom styles for the content */
  contentSx?: SxProps;
  /** Custom styles for the copy button */
  buttonSx?: SxProps;
  /** Whether to show the copy button */
  showButton?: boolean;
  /** Custom tooltip text for copy button */
  tooltipText?: string;
  /** Custom tooltip text after copying */
  copiedTooltipText?: string;
  /** Callback when text is copied */
  onCopy?: (text: string) => void;
}

export const Wrapper = styled(Stack)(({ theme }) => ({
  '& .copyButton': {
    padding: 0,
    backgroundColor: 'transparent',
    fontSize: 'inherit',
  },
  '&.gutterBottom': {
    marginBottom: theme.spacing(1.5),
  },
  '&.bordered': {
    fontFamily: `'JetBrains Mono', monospace`,
    fontSize: '1rem',
    position: 'relative',
    display: 'inline-block',
    background: alpha(theme.palette.info.main, 0.2),
    border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(1.5),
    padding: theme.spacing(1, '45px', 1, 1.5),
    wordBreak: 'break-word',
    maxWidth: '100%',
    '& .copyButton': {
      position: 'absolute',
      right: theme.spacing(1.5),
      top: theme.spacing(1.5),
    },
  },
  '&.fullWidth': {
    display: 'block',
  },
  '& .nowrap': {
    whiteSpace: 'nowrap',
  },
}));

export const CopyToClipboard = ({
  text,
  content,
  copyButtonSize = 16,
  bordered = false,
  fullWidth = false,
  gutterBottom = false,
  sx,
  contentSx,
  buttonSx,
  showButton = true,
  tooltipText = 'Copy',
  copiedTooltipText = 'Copied',
  onCopy,
}: CopyToClipboardProps) => {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  if (!text) return null;

  const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.(text);
    } catch (error) {}
  };

  const handleSelect = () => {
    if (!ref.current) return;
    window.getSelection()?.selectAllChildren(ref.current);
  };

  return (
    <Wrapper
      className={classNames({
        bordered,
        fullWidth,
        gutterBottom,
      })}
      direction="row"
      alignItems="center"
      spacing={1}
      sx={sx}
    >
      <Box className="content" ref={ref} onClick={handleSelect} sx={contentSx}>
        {content || text}
      </Box>
      {showButton && (
        <CopyToClipboardTooltip
          copied={copied}
          setCopied={setCopied}
          tooltipText={tooltipText}
          copiedTooltipText={copiedTooltipText}
        >
          <IconButton
            size="small"
            className="copyButton"
            color="inherit"
            onClick={handleClick}
            sx={buttonSx}
          >
            <ContentCopyOutlined fontSize="inherit" sx={{ transform: 'scale(1, -1)' }} />
          </IconButton>
        </CopyToClipboardTooltip>
      )}
    </Wrapper>
  );
};
