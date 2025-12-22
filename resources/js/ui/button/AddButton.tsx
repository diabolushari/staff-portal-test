import { Button } from '@/components/ui/button'
import { router } from '@inertiajs/react'
import { PlusIcon } from 'lucide-react'
import React from 'react'

interface Props {
  link?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => unknown
  buttonText?: string
}

export default function AddButton({ link, onClick, buttonText }: Readonly<Props>) {
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
      variant='outline'
      size='default'
      className='flex cursor-pointer items-center gap-2 border-b-2 border-blue-500 transition-transform hover:border-blue-800'
      onClick={handleClick}
      type='button'
    >
      <PlusIcon className='h-6 w-6 stroke-[2.5]' />
      {buttonText}
    </Button>
  )
}
