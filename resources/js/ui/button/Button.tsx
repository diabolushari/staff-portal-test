import { cn } from '@/utils'
import { Link } from '@inertiajs/react'
import React from 'react'
import Spinner from '../Spinner'

interface Properties {
  label: string
  onClick?: (e: React.FormEvent<HTMLButtonElement>) => void
  variant?: string
  processing?: boolean
  disabled?: boolean
  link?: string
  type?: 'reset' | 'submit' | 'button'
}

export const chooseButtonColor = (type: string): [string, string] => {
  switch (type) {
    case 'primary': {
      return [
        'rounded-lg bg-[#0078d4] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#106ebe]',
        '',
      ]
    }
    case 'secondary': {
      return ['bg-gray-200 hover:bg-gray-400 focus:ring-gray-200 text-gray-700', 'text-gray-500']
    }
    case 'tertiary': {
      return ['bg-white hover:bg-primary-300 focus:ring-gray-200 text-gray-700', 'text-gray-500']
    }
    case 'info': {
      return [
        'bg-indigo-500 hover:bg-indigo-400 focus:ring-indigo-400 text-white',
        'text-gray-indigo-500',
      ]
    }
    case 'danger': {
      return ['bg-red-500 hover:bg-red-400 focus:ring-red-400 text-white', 'text-red-500']
    }
    case 'norka': {
      return [
        'w-full rounded-md bg-primary-6000 font-body text-base uppercase text-white hover:bg-primary-500',
        '',
      ]
    }
    case 'otp': {
      return [
        'w-full rounded-md bg-theme_color_1 mdButtonText uppercase text-white hover:bg-theme_color_2',
        '',
      ]
    }
    case 'link': {
      return [
        'lgButtonText text-blue-500 flex items-center justify-center px-10 py-2 tracking-wider capitalize transition duration-150' +
          ' ease-in-out focus:ring-4 focus:outline-hidden hover:cursor-pointer',
        '',
      ]
    }

    default: {
      return [
        'bg-[#0078D4] text-white dark:bg-blue-700 dark:text-white hover:shadow-lg rounded-sm hover:opacity-75 focus:ring-1',
        'text-blue-700 dark:text-blue-700 hover:text-blue-700 dark:hover:text-blue-700',
      ]
    }
  }
}

export default function Button({
  label,
  onClick,
  variant = 'primary',
  processing = false,
  disabled = false,
  type = 'submit',
  link,
}: Properties) {
  const [buttonStyle, svgStyle] = chooseButtonColor(variant)

  return (
    <>
      {link != null && processing != null && (
        <Link
          href={link}
          as='a'
          className={cn(
            'lgButtonText flex items-center justify-center px-10 py-2 tracking-wider capitalize transition duration-150' +
              ' ease-in-out focus:ring-4 focus:outline-hidden',
            buttonStyle
          )}
        >
          {label}
        </Link>
      )}
      {!processing && link == null && (
        <button
          onClick={onClick}
          disabled={disabled}
          className={cn(
            'lgButtonText flex items-center justify-center px-10 py-2 tracking-wider capitalize transition duration-150' +
              ' ease-in-out focus:ring-4 focus:outline-hidden',
            buttonStyle
          )}
          type={type}
        >
          {label}
        </button>
      )}
      {processing && <Spinner svgStyle={svgStyle} />}
    </>
  )
}
