import { ActionIcon } from '@mantine/core';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export const ToggleChevron = ({
  collapsed,
  onToggle,
  direction,
}: {
  collapsed: boolean;
  onToggle: () => void;
  direction: 'left' | 'right';
}) => {
  const icon =
    direction === 'left' ? (
      collapsed ? (
        <FaChevronRight size={16} />
      ) : (
        <FaChevronLeft size={16} />
      )
    ) : collapsed ? (
      <FaChevronLeft size={16} />
    ) : (
      <FaChevronRight size={16} />
    );

  const alignment =
    direction === 'left'
      ? collapsed
        ? 'center'
        : 'flex-end'
      : collapsed
        ? 'center'
        : 'flex-start';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: alignment,
      }}
    >
      <ActionIcon onClick={onToggle}>{icon}</ActionIcon>
    </div>
  );
};
