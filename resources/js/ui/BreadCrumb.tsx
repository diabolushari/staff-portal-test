import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { BreadcrumbItem as BreadcrumbItemType } from '@/types'
import { Link } from '@inertiajs/react'

export function CustomBreadcrumb({ list }: { list: BreadcrumbItemType[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {list.map((item, index) => (
          <BreadcrumbItem key={index}>
            <BreadcrumbLink asChild>
              <Link href={item.href}>{item.title}</Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
        ))}

        <BreadcrumbItem>
          <BreadcrumbPage>{list[list.length - 1]?.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
