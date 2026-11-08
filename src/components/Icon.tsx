import type { SVGProps } from 'react'

export type IconName =
  | 'arrow'
  | 'award'
  | 'book'
  | 'calendar'
  | 'chart'
  | 'check'
  | 'clock'
  | 'edit'
  | 'flame'
  | 'plus'
  | 'sparkle'
  | 'target'
  | 'trash'

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName
}

const paths: Record<IconName, React.ReactNode> = {
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
      <path d="M4 17a2.5 2.5 0 0 1 2.5-2.5H20M8 7h8" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="8.5" r="5.5" />
      <path d="m8.7 13-1.2 8 4.5-2.7 4.5 2.7-1.2-8" />
      <path d="m10 8.5 1.3 1.3 2.7-2.7" />
    </>
  ),
  calendar: (
    <>
      <rect height="16" rx="2.5" width="17" x="3.5" y="5" />
      <path d="M7.5 2.5v5M16.5 2.5v5M3.5 10h17" />
    </>
  ),
  chart: (
    <>
      <path d="M4 19.5h16M6.5 16V10m5 6V5m5 11v-8" />
      <path d="m5 7 5-3 5 2 4-3" />
    </>
  ),
  check: <path d="m5 12 4.5 4.5L19 7" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  edit: (
    <>
      <path d="m15 5 4 4M4 20l4.3-.9L19 8.4 15.6 5 4.9 15.7 4 20Z" />
      <path d="M13.5 6.5 17 10" />
    </>
  ),
  flame: (
    <path d="M12 22a7 7 0 0 0 7-7c0-3.5-2.5-5.8-4.5-8-.6 2.4-1.7 3.6-2.8 4.3C11.3 8 9 5.2 8 2c-.2 4.5-5 7.3-5 13a9 9 0 0 0 9 7Zm0-3a3 3 0 0 0 3-3c0-1.2-.8-2.2-1.8-3.4-.2 1.1-.7 1.7-1.2 2.1-.4-1-1.2-1.8-1.8-2.8-.1 2-1.2 2.6-1.2 4.1a3 3 0 0 0 3 3Z" />
  ),
  plus: (
    <>
      <path d="M12 5v14M5 12h14" />
    </>
  ),
  sparkle: (
    <>
      <path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z" />
      <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <path d="m12 12 6-6m0 0h-4m4 0v4" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" />
    </>
  ),
}

function Icon({ name, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
      {...props}
    >
      {paths[name]}
    </svg>
  )
}

export default Icon
