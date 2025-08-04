import React from 'react'
import { router } from '@inertiajs/react'
import ButtonBorderIcon from './ButtonBorderIcon'
import { Trash } from 'lucide-react'
import { Button } from '@/Components/ui/button'

interface Props {
  link?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => unknown
}

export default function DeleteButton({ link, onClick }: Props) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (link != null) {
      router.get(link)
      return
    }
    if (onClick != null) {
      onClick(event)
    }
  }

  return (
    <Button
      variant='destructive'
      size='icon'
      className='transition-transform hover:scale-105'
      onClick={handleClick}
    >
      <Trash className='h-6 w-6' />
    </Button>
  )
}
