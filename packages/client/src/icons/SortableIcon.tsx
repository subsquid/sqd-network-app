export function SortableIcon({ size = 16, dir }: { size?: number; dir?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-6 -4 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 0L5.59808 4.5H0.401924L3 0Z" fill={dir != 'asc' ? '#3E4A5C' : '#d5d8dd'} />
      <path d="M3 12L5.59808 7.5H0.401924L3 12Z" fill={dir != 'desc' ? '#3E4A5C' : '#d5d8dd'} />
    </svg>
  );
}
