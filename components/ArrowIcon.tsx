interface ArrowIconProps {
  direction?: 'left' | 'right';
  className?: string;
}

export default function ArrowIcon({ direction = 'right', className = '' }: ArrowIconProps) {
  return (
    <svg
      width="12"
      height="11"
      viewBox="0 0 12 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={direction === 'left' ? { transform: 'scaleX(-1)' } : undefined}
      aria-hidden="true"
    >
      <path
        d="M6.39205 10.6023L5.36932 9.59095L8.92045 6.03982H0V4.56254H8.92045L5.36932 1.01709L6.39205 4.3869e-05L11.6932 5.30118L6.39205 10.6023Z"
        fill="currentColor"
      />
    </svg>
  );
}
