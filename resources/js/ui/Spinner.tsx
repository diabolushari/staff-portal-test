import React from 'react'

interface Properties {
  svgStyle: string
  svgSize?: string
}

export default function Spinner({ svgStyle, svgSize = 'w-8 h-8' }: Properties) {
  return (
    <span className={svgStyle}>
      <svg
        className={`spinner_svg ${svgSize}`}
        viewBox='0 0 100 100'
        xmlns='http://www.w3.org/2000/svg'
      >
        <circle
          className='spinner_circle'
          stroke='currentColor'
          cx='50'
          cy='50'
          r='45'
        />
      </svg>
    </span>
  )
}
