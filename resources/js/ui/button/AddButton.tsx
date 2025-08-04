import { Button } from '@/Components/ui/button'
import { router } from '@inertiajs/react'
import { PlusIcon } from 'lucide-react'
import React from 'react'

interface Props {
  link?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => unknown
  buttonText?: string
}

export default function AddButton({ link, onClick }: Readonly<Props>) {
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
      variant='highlight'
      size='icon'
      className='transition-transform hover:scale-105'
      onClick={handleClick}
      type='button'
    >
      <PlusIcon className='h-6 w-6 stroke-[2.5]' />
    </Button>
  )
}
