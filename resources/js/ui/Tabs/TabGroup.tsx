import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'

interface Props {
  tabs: {
    value: string
    label: string
  }[]
  children: React.ReactNode
}

export function TabGroup({ tabs, children }: Readonly<Props>) {
  return (
    <div className='flex w-full flex-col gap-10 p-0'>
      <Tabs defaultValue={tabs[0].value}>
        <TabsList className='mb-4 flex justify-start gap-10 bg-white p-0'>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className='w-full rounded-none border-b-2 border-transparent p-0 text-sm font-normal data-[state=active]:border-black data-[state=active]:font-semibold'
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {children}
      </Tabs>
    </div>
  )
}
