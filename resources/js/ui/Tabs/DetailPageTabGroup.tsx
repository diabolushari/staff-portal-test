import { AppWindowIcon, CodeIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Props {
  tabs: {
    value: string
    label: string
    content: React.ReactNode
  }[]
}

export function DetailPageTabGroup({ tabs }: Props) {
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
        {tabs.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
          >
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
