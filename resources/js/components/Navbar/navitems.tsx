import { HomeIcon, ListIcon } from 'lucide-react'
import React from 'react'

export interface navItem {
  title: string
  href: string
  icon?: React.ReactNode
  children?: navItem[]
}
export const settingsOffices: navItem[] = [
  {
    title: 'Offices',
    href: '/offices',
    icon: <ListIcon className='h-4 w-4' />,
  },
]

export const meterTimezoneNavItems: navItem[] = [
  {
    title: 'Timezones',
    href: '/metering-timezone',
    icon: <ListIcon className='h-4 w-4' />,
  },
]
export const meterNavItems: navItem[] = [
  {
    title: 'Meters',
    href: '/meters',
    icon: <ListIcon className='h-4 w-4' />,
  },
  {
    title: 'Meter CTPT',
    href: '/meter-ctpt',
    icon: <HomeIcon className='h-4 w-4' />,
  },
]

export const settingsReferenceData: navItem[] = [
  {
    title: 'System Modules',
    href: '/system-module',
    icon: <ListIcon className='h-4 w-4' />,
  },
  {
    title: 'Parameter Domain',
    href: '/parameter-domain',
    icon: <HomeIcon className='h-4 w-4' />,
  },
  {
    title: 'Parameter Definition',
    href: '/parameter-definition',
    icon: <HomeIcon className='h-4 w-4' />,
  },
  {
    title: 'Parameter Values',
    href: '/parameter-value',
    icon: <HomeIcon className='h-4 w-4' />,
  },
]

export const consumerNavItems: navItem[] = [
  {
    title: 'Connections',
    href: '/connections',
    icon: '',
  },
  {
    title: 'Parties',
    href: '/parties',
    icon: '',
  },
]

export const meterReadingNavItems: navItem[] = [
  {
    title: 'Meter Readings',
    href: '/meter-reading',
    icon: <ListIcon className='h-4 w-4' />,
  },
]

export const tariffNavItems: navItem[] = [
  {
    title: 'Tariff Order',
    href: '/tariff-orders',
    icon: <ListIcon className='h-4 w-4' />,
  },
]

export const billingNavItems: navItem[] = [
  {
    title: 'Billing',
    href: '/billing-groups',
    icon: <ListIcon className='h-4 w-4' />,
    children: [
      {
        title: 'Billing Groups',
        href: '/billing-groups',
      },
      {
        title: 'Jobs',
        href: '/bills/job-status',
      },
    ],
  },
]

export const metadataNavItems: navItem[] = [
  {
    title: 'Parameters',
    href: '/parameter-domain',
    icon: '',
    children: [
      {
        title: 'System Module',
        href: '/system-module',
        icon: '',
      },
      {
        title: 'Domains',
        href: '/parameter-domain',
        icon: '',
      },
      {
        title: 'Definitions',
        href: '/parameter-definition',
        icon: '',
      },
      {
        title: 'Values',
        href: '/parameter-value',
        icon: '',
      },
    ],
  },
  {
    title: 'Offices',
    href: '/offices',
    icon: '',
    children: [
      {
        title: 'Office Details',
        href: '/offices',
        icon: '',
      },
    ],
  },
]

export const meteringBillingNavItems: navItem[] = [
  {
    title: 'Metering Timezones',
    href: '/metering-timezone',
    icon: '',
  },
  {
    title: 'Tariffs',
    href: '/tariff-orders',
    icon: '',
  },
  {
    title: 'Meters',
    href: '/meters',
    icon: '',
  },
  {
    title: 'Meter CTPTs',
    href: '/meter-ctpt',
    icon: '',
  },
  {
    title: 'Billing Rule',
    href: '/billing-rules',
    icon: '',
  },
]
