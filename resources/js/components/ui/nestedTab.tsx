import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { router } from "@inertiajs/react";   

interface NestedTabProps {
  tabs: {
    value: string
    label: string
    icon:React.ReactNode
    activeIcon:React.ReactNode
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
      <div className="flex justify-end">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="
  flex
  bg-white
  border border-tab-border
  rounded-md
  overflow-hidden
  divide-x
">

          {tabs.map((tab) => (
           <TabsTrigger
  key={tab.value}
  value={tab.value}
  className="
    flex flex-1 items-center justify-center
    p-5 text-xl font-normal
    text-gray-600
    bg-white

    data-[state=active]:bg-kseb-primary
    data-[state=active]:text-kseb-bg-blue
    data-[state=active]:font-semibold
  "
  onClick={() => {
    if (tab.href) {
      router.visit(tab.href)
    }
  }}
>
  {activeTab === tab.value ? tab.activeIcon : tab.icon}
</TabsTrigger>

          ))}
        </TabsList>
      </Tabs>
      </div>
      {subTabs.length > 0 && (
        <div className="flex justify-start">
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
