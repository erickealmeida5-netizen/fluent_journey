import { Link } from 'react-router-dom'

function Brand() {
  return (
    <Link aria-label="Fluent Journey — página inicial" className="brand" to="/">
      <span aria-hidden="true" className="brand-mark">
        <svg fill="none" viewBox="0 0 24 24">
          <path
            d="M12 3.5 14.15 9.85 20.5 12l-6.35 2.15L12 20.5l-2.15-6.35L3.5 12l6.35-2.15L12 3.5Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.7"
          />
          <circle cx="12" cy="12" r="2.1" fill="currentColor" />
        </svg>
      </span>
      <span className="brand-name">
        Fluent <span>Journey</span>
      </span>
    </Link>
  )
}

export default Brand
