import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { BreadcrumbItem as BreadcrumbItemType } from '@/types'
import { Link } from '@inertiajs/react'

export function CustomBreadcrumb({ list }: { list: BreadcrumbItemType[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {list.map((item, index) => {
          return (
            <BreadcrumbItem key={item.href}>
              <BreadcrumbLink asChild>
                <Link href={item.href}>{item.title}</Link>
              </BreadcrumbLink>
              {index != list.length - 1 && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
