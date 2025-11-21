import { router, usePage } from '@inertiajs/react'
import { BellIcon, HelpCircle, Search as SearchIcon, SettingsIcon, UserIcon } from 'lucide-react'
import { CustomNavbar } from './CustomNavbar'
import { MobileNavSheet } from './MobileNavSheet'

export default function TopNavBar() {
  usePage() // consumed to trigger re-render on navigation (no direct usage)

  return (
    <div className='flex h-16 w-full items-center border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-900'>
      <div className='flex w-52 items-center'>
        <img
          src='/kseb_logo.svg'
          alt='KSEB Logo'
          className='h-12 w-auto max-w-full object-contain'
        />
      </div>
      {/* Desktop nav */}
      <div className='hidden flex-1 items-stretch xl:flex'>
        <CustomNavbar />
      </div>
      <div className='ml-auto flex items-center gap-3'>
        {/* Hamburger on < xl */}
        <div className='flex items-center xl:hidden'>
          <MobileNavSheet />
        </div>
        {/* Desktop utilities only at xl+ */}
        <div className='hidden items-center gap-4 xl:flex'>
          <div className='relative hidden md:block'>
            <SearchIcon className='pointer-events-none absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder='Search'
              className='h-9 w-48 rounded-md border border-gray-300 bg-gray-50 pr-3 pl-8 text-sm transition outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-500'
              aria-label='Global search'
            />
          </div>
          <div className='flex items-center gap-5'>
            <button
              type='button'
              aria-label='Notifications'
              className='rounded p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
            >
              <BellIcon className='h-5 w-5' />
            </button>
            <button
              type='button'
              aria-label='Help & Support'
              className='rounded p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
            >
              <HelpCircle className='h-5 w-5' />
            </button>
            <button
              onClick={() => router.get(route('settings-page'))}
              type='button'
              aria-label='Settings'
              className='rounded p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
            >
              <SettingsIcon className='h-5 w-5' />
            </button>
            <button
              type='button'
              aria-label='Account'
              className='rounded p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
            >
              <UserIcon className='h-5 w-5' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
