import { useCallback, useEffect, useState } from 'react';

import { relativeDateFormat } from '@i18n';

import { useTicker } from './useTicker';

export function useCountdown({ timestamp }: { timestamp?: Date | string | number | undefined }) {
  const [timeLeft, setTimeLeft] = useState<string | undefined>(
    relativeDateFormat(new Date(), timestamp),
  );

  const update = useCallback(() => {
    setTimeLeft(relativeDateFormat(new Date(), timestamp));
  }, [timestamp]);

  useEffect(() => {
    update();
  }, [update]);

  useTicker(update, 1000);

  return timeLeft;
}
