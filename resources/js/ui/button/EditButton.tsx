import { Button } from '@/components/ui/button'
import { router } from '@inertiajs/react'
import { Edit2Icon } from 'lucide-react'
import React from 'react'

interface Props {
  link?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => unknown
}

export default function EditButton({ link, onClick }: Props) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (link != null) {
      router.get(link)
      return
    }
    if (onClick != null) {
      onClick(e)
    }
  }

  return (
    <Button
      className='flex cursor-pointer items-center gap-2 transition-transform'
      onClick={handleClick}
      variant='highlight'
    >
      <Edit2Icon className='h-6 w-6 fill-[#0078D4]' /> Edit
    </Button>
  )
}
