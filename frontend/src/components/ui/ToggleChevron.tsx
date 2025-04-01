import { ActionIcon } from '@mantine/core';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export const ToggleChevron = ({
  opened,
  onToggle,
  direction,
}: {
  opened: boolean;
  onToggle: () => void;
  direction: 'left' | 'right';
}) => {
  const icon =
    direction === 'left' ? (
      opened ? (
        <FaChevronLeft size={16} />
      ) : (
        <FaChevronRight size={16} />
      )
    ) : opened ? (
      <FaChevronRight size={16} />
    ) : (
      <FaChevronLeft size={16} />
    );

  const alignment = direction === 'left' ? 'flex-end' : 'flex-start';

  return (
    <div style={{ display: 'flex', justifyContent: alignment }}>
      <ActionIcon onClick={onToggle}>{icon}</ActionIcon>
    </div>
  );
};
