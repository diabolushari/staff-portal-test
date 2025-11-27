import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { router } from "@inertiajs/react";   

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

  const [activeSub, setActiveSub] = useState(
    defaultSubValue || subTabs?.[0]?.subValue || ""
  )

 
  useEffect(() => {
    if (subTabs.length > 0) {
        if (!defaultSubValue) {
      setActiveSub(subTabs[0].subValue);
    }
    }
  }, [activeTab]);

  return (
    <div className="flex w-full flex-col gap-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex gap-10 bg-white p-3 border-b">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-b-2 text-xl border-transparent p-3 font-normal 
              data-[state=active]:border-blue-400 
              data-[state=active]:font-semibold 
              data-[state=active]:text-blue-400 
              data-[state=active]:bg-blue-50"
              onClick={() => {
              if (tab.href) {
                router.visit(tab.href)
              }
            }}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {subTabs.length > 0 && (
        <div className="flex justify-end">
          <Tabs value={activeSub} onValueChange={setActiveSub}>
            <TabsList className="flex gap-6 bg-white p-2 border">
              {subTabs.map((st) => (
                <TabsTrigger
                  key={st.subValue}
                  value={st.subValue}
                  className="p-2 font-semibold border-b-2  
                  data-[state=active]:border-blue-400 
                  data-[state=active]:text-blue-400 
                  data-[state=active]:bg-blue-50"
                  onClick={() => {
                  if (st.subLink) {
                    router.visit(st.subLink)
                  }
                }}

                >
                  {st.subLabel}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}

      <div>{children}</div>
    </div>
  )
}
