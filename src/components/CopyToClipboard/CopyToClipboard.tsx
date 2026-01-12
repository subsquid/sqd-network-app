import React, { useRef, useState } from 'react';

import { ContentCopyOutlined } from '@mui/icons-material';
import { Box, IconButton, Stack, SxProps, styled } from '@mui/material';
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

export const Wrapper = styled(Stack)(({ theme }) => ({}));

export const CopyToClipboard = ({
  text,
  content,
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
      {content && (
        <Box className="content" ref={ref} onClick={handleSelect} sx={contentSx}>
          {content}
        </Box>
      )}
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
            sx={{ ...buttonSx }}
          >
            <ContentCopyOutlined fontSize="inherit" sx={{ transform: 'scale(1, -1)' }} />
          </IconButton>
        </CopyToClipboardTooltip>
      )}
    </Wrapper>
  );
};
