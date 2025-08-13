import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      {...props}
    >
      <g fill="currentColor">
        <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z" />
        <path d="M168 88h-24.89l-23.17-40.13a8 8 0 1 0-13.88 8L124.89 88H104a8 8 0 0 0 0 16h20.89l-18.72 32.43a8 8 0 1 0 13.86 8L144.17 104H168a8 8 0 0 0 0-16Z" />
      </g>
    </svg>
  );
}
