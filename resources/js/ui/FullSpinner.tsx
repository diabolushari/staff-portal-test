import React from 'react'
import Spinner from './Spinner'

interface Props {
  svgStyle?: string;
}

const FullSpinner = ({ svgStyle = 'text-accent-dark'}: Props) => {
  return (
    <div className="flex w-full justify-center items-center py-10">
      <Spinner svgStyle={svgStyle} />
    </div>
  )
}

export default FullSpinner
