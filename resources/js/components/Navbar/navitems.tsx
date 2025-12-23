import { HomeIcon, ListIcon } from 'lucide-react'
import React from 'react'

export interface navItem {
  title: string
  href: string
  icon?: React.ReactNode
  children?: navItem[]
}

export interface MainNav {
  label: string
  items: navItem[]
}

export const settingsOffices: MainNav = {
  label: 'Settings',
  items: [
    {
      title: 'Offices',
      href: '/offices',
      icon: <ListIcon className='h-4 w-4' />,
    },
  ],
}

export const meterTimezoneNavItems: MainNav = {
  label: 'Metering',
  items: [
    {
      title: 'Timezones',
      href: '/metering-timezone',
      icon: <ListIcon className='h-4 w-4' />,
    },
  ],
}
export const meterNavItems: MainNav = {
  label: 'Metering',
  items: [
    {
      title: 'Meters',
      href: '/meters',
      icon: <ListIcon className='h-4 w-4' />,
    },
  ],
}
export const meterCTPTNavItems: MainNav = {
  label: 'Metering',
  items: [
    {
      title: 'Meter CTPT',
      href: '/meter-ctpt',
      icon: <HomeIcon className='h-4 w-4' />,
    },
  ],
}

export const consumerNavItems: MainNav = {
  label: 'Consumers',
  items: [
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
  ],
}

export const meterReadingNavItems: MainNav = {
  label: 'Meter Readings',
  items: [
    {
      title: 'Meter Readings',
      href: '/meter-reading',
      icon: <ListIcon className='h-4 w-4' />,
    },
  ],
}

export const tariffNavItems: MainNav = {
  label: 'Tariffs',
  items: [
    {
      title: 'Tariff Order',
      href: '/tariff-orders',
      icon: <ListIcon className='h-4 w-4' />,
    },
  ],
}

export const billingNavItems: MainNav = {
  label: 'Manage Billing',
  items: [
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
  ],
}

export const metadataNavItems: MainNav = {
  label: 'Manage Metadata',
  items: [
    {
      title: 'System Parameters',
      href: '/parameter-domain',
      icon: '',
      children: [
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
          title: 'Parameter Values',
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
    {
      title: 'Configuration',
      href: '/system-modules',
      icon: '',
      children: [
        {
          title: 'System Modules',
          href: '/system-module',
          icon: '',
        },
      ],
    },
  ],
}

export const meteringBillingNavItems: MainNav = {
  label: 'Manage Meter',
  items: [
    {
      title: 'Metering Timezones',
      href: '/metering-timezone',
      icon: '',
    },
    {
      title: 'Metering Profiles',
      href: '/meter-profile',
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
      title: 'CTPTs',
      href: '/meter-ctpt',
      icon: '',
    },
    {
      title: 'Billing Rule',
      href: '/billing-rules',
      icon: '',
    },
  ],
}
