import StrongText from '@/typography/StrongText'
import Input from '../form/Input'
import useCustomForm from '@/hooks/useCustomForm'
import Button from '../button/Button'
import { router } from '@inertiajs/react'

interface Props {
  title?: string
  placeholder?: string
  url?: string
  search?: string
}

export default function ListSearch({ title, placeholder, url, search }: Props) {
  const { formData, setFormValue } = useCustomForm({
    search: search ?? '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (url) {
      router.get(url, formData)
    }
  }

  return (
    <div className='relative flex flex-col items-center bg-white p-6 shadow-sm'>
      <div className='absolute top-0 left-6 size-18 h-2/3 w-1/4 rounded-b-full bg-radial-[at_1%] from-[#0078D4]/0 to-[#0078D4]/5 to-5%'></div>

      <div className='flex w-full flex-col justify-center p-10'>
        <div className='mr-10 mb-4 flex items-center justify-center'>
          <StrongText className='text-2xl font-semibold'>{title}</StrongText>
        </div>

        <div className='flex w-full items-center justify-center'>
          <form
            action=''
            className='w-2/3'
            onSubmit={handleSubmit}
          >
            <div className='relative flex w-full items-center justify-center gap-3'>
              <Input
                label=''
                setValue={setFormValue('search')}
                value={formData.search}
                showClearButton={true}
                placeholder={placeholder ?? 'Search'}
                style='google'
              />
              <Button
                label='Search'
                type='submit'
              />
            </div>
          </form>
        </div>
      </div>

      <div className='h-half absolute right-0 bottom-0 size-18 w-1/12 rounded-tl-full bg-radial-[at_1%_1%] from-[#0078D4]/30 to-[#0078D4]/5 to-90%'></div>
    </div>
  )
}
