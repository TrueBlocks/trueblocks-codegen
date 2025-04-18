import { useEffect, useState } from 'react';

import { Text } from '@mantine/core';
import { EventsOn } from '@runtime';

export const StatusBar = () => {
  const [message, setMessage] = useState('');
  const [timeoutId, setTimeoutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  useEffect(() => {
    const release = EventsOn('statusbar:log', (msg: string) => {
      setMessage(msg);

      if (timeoutId) clearTimeout(timeoutId);

      const id = setTimeout(() => setMessage(''), 1500);
      setTimeoutId(id);
    });

    return () => {
      release();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  return (
    <Text style={{ backgroundColor: '#cffafe', color: 'black' }}>
      {message}
    </Text>
  );
};
