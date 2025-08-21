import Input from '@/ui/form/Input'
import { Link, usePage } from '@inertiajs/react'
import { BellIcon, ChevronDown, HelpCircle, Search, SettingsIcon, UserIcon } from 'lucide-react'
import { CustomNavbar } from './CustomNavbar'

export default function TopNavBar() {
  const { url } = usePage()

  return (
    <div className='border-opacity-25 flex w-full gap-4 border-b-[.5px] border-[#252C32] px-4 dark:bg-gray-800'>
      <div className='w-52 flex-none p-4'>
        <img
          src='/kseb_logo.svg'
          alt='KSEB Logo'
          className='h-auto w-auto'
        />
      </div>

      <div className='mt-6 w-auto flex-1'>
        <CustomNavbar />
      </div>
      <div className='flex w-auto justify-center gap-2 p-2'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-2'>
            <div className='rounded-sm border-[.5px] border-gray-200'>
              <input
                type='text'
                className='p-2'
                placeholder='Search'
              />
            </div>
          </div>
        </div>
        <div className='flex gap-4 p-4'>
          <div className='flex items-center gap-2 hover:cursor-pointer'>
            <BellIcon className='h-5 w-5' />
          </div>
          <div className='flex items-center gap-2 hover:cursor-pointer'>
            <HelpCircle className='h-5 w-5' />
          </div>
          <div className='flex items-center gap-2 hover:cursor-pointer'>
            <SettingsIcon className='h-5 w-5' />
          </div>
          <div className='flex items-center gap-2 hover:cursor-pointer'>
            <UserIcon className='h-5 w-5' />
          </div>
        </div>
      </div>
    </div>
  )
}
