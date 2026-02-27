export function CloseIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="#8A95A5" />
      <mask
        id="mask0_1407_1657"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="8"
        y="8"
        width="24"
        height="24"
      >
        <rect x="8" y="8" width="24" height="24" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_1407_1657)">
        <path
          d="M14.4 27L13 25.6L18.6 20L13 14.4L14.4 13L20 18.6L25.6 13L27 14.4L21.4 20L27 25.6L25.6 27L20 21.4L14.4 27Z"
          fill="#0D0D0D"
        />
      </g>
    </svg>
  );
}
