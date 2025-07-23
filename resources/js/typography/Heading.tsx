import { cn } from '@/utils'
import React from 'react'

interface Props {
  className?: string
  children: React.ReactNode
}

export default function Heading({ className = '', children }: Props) {
  return <h1 className={cn('break-all text-lg uppercase', className)}>{children}</h1>
}
