import { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import StrongText from '@/typography/StrongText'
import { router } from '@inertiajs/react'
import AddButton from '../button/AddButton'
import EditButton from '../button/EditButton'

interface CardButton {
  title: string
  url: string
}

interface CustomCardProps {
  title?: string
  addButton?: CardButton
  editButton?: CardButton
  children?: ReactNode
  className?: string
}

export default function CustomCard({
  title,
  addButton,
  editButton,
  children,
  className = '',
}: CustomCardProps) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {(title || addButton || editButton) && (
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          {title && (
            <StrongText className='text-2xl font-semibold text-[#252c32]'>{title}</StrongText>
          )}

          <div className='flex gap-2'>
            {addButton && (
              <AddButton
                buttonText={addButton.title}
                link={addButton.url}
              />
            )}

            {editButton && <EditButton link={editButton.url} />}
          </div>
        </div>
      )}

      {children && <Card className='rounded-lg p-7'>{children}</Card>}
    </div>
  )
}
