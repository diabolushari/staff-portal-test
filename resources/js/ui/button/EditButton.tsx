import { Button } from '@/components/ui/button'
import { router } from '@inertiajs/react'
import { Edit2Icon, EditIcon } from 'lucide-react'
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
      size='icon'
      className='text-base font-semibold text-[#0078D4] transition-transform hover:scale-105 hover:cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-700'
      onClick={handleClick}
      variant='link'
    >
      <Edit2Icon className='h-6 w-6 fill-[#0078D4]' /> Edit
    </Button>
  )
}
