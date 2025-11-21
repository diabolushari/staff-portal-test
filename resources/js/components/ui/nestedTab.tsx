'use client'

import React, { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface NestedTabProps {
  tabs: {
    value: string
    label: string
    href?: string
    item?: {
      subValue: string
      subLabel: string
      subLink?: string
    }[]
  }[]
  defaultValue?: string
  defaultSubValue?: string
  children?: React.ReactNode
}

export function NestedTabGroup({
  tabs,
  defaultValue,
  defaultSubValue,
  children,
}: Readonly<NestedTabProps>) {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0].value)

  const activeMasterTab = tabs.find((t) => t.value === activeTab)
  const subTabs = activeMasterTab?.item || []
  const [activeSub, setActiveSub] = useState(defaultSubValue || subTabs?.[0]?.subValue)

  return (
    <div className="flex w-full flex-col gap-6">
      {/* MASTER TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex gap-10 bg-white p-3 border-b">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-b-2 text-xl border-transparent p-3 font-normal data-[state=active]:border-black data-[state=active]:font-semibold"
              onClick={() => {
                if (tab.href) window.location.href = tab.href
                else setActiveTab(tab.value)
              }}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* SUB TABS (RIGHT SIDE) */}
      {subTabs.length > 0 && (
        <div className="flex justify-end">
          <Tabs value={activeSub} onValueChange={setActiveSub}>
            <TabsList className="flex gap-6 bg-white p-2 border ">
              {subTabs.map((st) => (
                <TabsTrigger
                  key={st.subValue}
                  value={st.subValue}
                  className="p-2  font-semibold border-b-2  data-[state=active]:border-black"
                  onClick={() => {
                    if (st.subLink) window.location.href = st.subLink
                    else setActiveSub(st.subValue)
                  }}
                >
                  {st.subLabel}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* PAGE CONTENT */}
      <div>{children}</div>
    </div>
  )
}
