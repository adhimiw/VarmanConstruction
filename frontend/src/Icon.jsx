import React from 'react';

export function Icon(props) {
  var name = props.name || 'help-circle';
  var className = props.className || 'w-5 h-5';
  var strokeWidth = props.strokeWidth || 1.8;
  var svgProps = {
    className: className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true'
  };

  switch (name) {
    case 'phone':
      return (
        <svg {...svgProps}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 5.15 12.8 19.8 19.8 0 0 1 2.08 4.09 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72l.45 3.07a2 2 0 0 1-.57 1.73l-1.6 1.6a16 16 0 0 0 6.52 6.52l1.6-1.6a2 2 0 0 1 1.73-.57l3.07.45A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case 'mail':
      return (
        <svg {...svgProps}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );
    case 'calendar':
      return (
        <svg {...svgProps}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case 'clock':
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      );
    case 'truck':
      return (
        <svg {...svgProps}>
          <path d="M10 17H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h8v12Z" />
          <path d="M10 8h5l3 3v6h-8" />
          <circle cx="7.5" cy="17.5" r="1.5" />
          <circle cx="16.5" cy="17.5" r="1.5" />
        </svg>
      );
    case 'shield-check':
      return (
        <svg {...svgProps}>
          <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'message-circle':
      return (
        <svg {...svgProps}>
          <path d="M7 18l-4 3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H7Z" />
        </svg>
      );
    case 'briefcase':
      return (
        <svg {...svgProps}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />
        </svg>
      );
    case 'trending-up':
      return (
        <svg {...svgProps}>
          <path d="M3 17l6-6 4 4 7-7" />
          <path d="M14 8h6v6" />
        </svg>
      );
    case 'target':
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M22 12h-2M12 22v-2M2 12h2" />
        </svg>
      );
    case 'eye':
      return (
        <svg {...svgProps}>
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'building':
      return (
        <svg {...svgProps}>
          <rect x="4" y="3" width="16" height="18" rx="1.5" />
          <path d="M8 7h.01M12 7h.01M16 7h.01M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M10 21v-3h4v3" />
        </svg>
      );
    case 'map':
      return (
        <svg {...svgProps}>
          <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
          <path d="M9 3v15M15 6v15" />
        </svg>
      );
    case 'award':
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="8" r="5" />
          <path d="m8.5 13.5-1.5 7L12 18l5 2.5-1.5-7" />
        </svg>
      );
    case 'users':
      return (
        <svg {...svgProps}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <circle cx="9.5" cy="7" r="3" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 4.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'credit-card':
      return (
        <svg {...svgProps}>
          <rect x="2.5" y="5" width="19" height="14" rx="2" />
          <path d="M2.5 10h19M7 15h3" />
        </svg>
      );
    case 'tag':
      return (
        <svg {...svgProps}>
          <path d="M20 10 12 2H4v8l8 8 8-8Z" />
          <circle cx="7.5" cy="7.5" r="1" />
        </svg>
      );
    case 'package':
      return (
        <svg {...svgProps}>
          <path d="m12 2 8 4.5v11L12 22 4 17.5v-11L12 2Z" />
          <path d="M12 22V11.5M20 6.5l-8 5-8-5M8 4l8 4" />
        </svg>
      );
    case 'help-circle':
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.1 9a3 3 0 1 1 4.8 2.4c-.9.7-1.4 1.2-1.4 2.6" />
          <path d="M12 17h.01" />
        </svg>
      );
    case 'layers':
      return (
        <svg {...svgProps}>
          <path d="m12 3 9 5-9 5-9-5 9-5Z" />
          <path d="m3 12 9 5 9-5" />
          <path d="m3 16 9 5 9-5" />
        </svg>
      );
    case 'droplets':
      return (
        <svg {...svgProps}>
          <path d="M12 3.5c3.5 4 5.5 7 5.5 10a5.5 5.5 0 0 1-11 0c0-3 2-6 5.5-10Z" />
        </svg>
      );
    case 'zap':
      return (
        <svg {...svgProps}>
          <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
        </svg>
      );
    case 'home':
      return (
        <svg {...svgProps}>
          <path d="m3 11 9-7 9 7" />
          <path d="M5 10v10h14V10" />
          <path d="M10 20v-6h4v6" />
        </svg>
      );
    case 'leaf':
      return (
        <svg {...svgProps}>
          <path d="M6 21c6 0 12-5 12-12V4h-5C6 4 3 9 3 14c0 4 3 7 7 7Z" />
          <path d="M8 16c2-2 5-4 8-5" />
        </svg>
      );
    case 'square':
      return (
        <svg {...svgProps}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
        </svg>
      );
    case 'box':
      return (
        <svg {...svgProps}>
          <path d="m12 2 8 4.5v11L12 22 4 17.5v-11L12 2Z" />
          <path d="M12 22V11.5M20 6.5l-8 5-8-5" />
        </svg>
      );
    case 'mountain':
      return (
        <svg {...svgProps}>
          <path d="m3 20 7-11 4 6 3-4 4 9H3Z" />
        </svg>
      );
    case 'arrow-right':
      return (
        <svg {...svgProps}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );
    case 'check':
      return (
        <svg {...svgProps}>
          <path d="m5 13 4 4L19 7" />
        </svg>
      );
    case 'chevron-down':
      return (
        <svg {...svgProps}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
    default:
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9 12h6M12 9v6" />
        </svg>
      );
  }
}
export default Icon;
