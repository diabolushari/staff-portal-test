import NormalText from '@/typography/NormalText'
import { Link } from '@inertiajs/react'

export interface BreadcrumbItemLink {
  item: string
  link: string
}

const BreadCrumbs = ({ breadcrumbItems }: { breadcrumbItems?: BreadcrumbItemLink[] }) => {
  return (
    <div className='flex'>
      {breadcrumbItems?.map((breadcrumb, index) => (
        <div
          key={index}
          className='flex items-center'
        >
          <Link
            href={breadcrumb.link}
            className={` ${breadcrumb.link == '' ? 'cursor-text font-semibold' : 'hover:underline'}`}
          >
            <NormalText>{breadcrumb.item}</NormalText>
          </Link>

          {index < breadcrumbItems.length - 1 && <span className='mx-1'>{'>'}</span>}
        </div>
      ))}
    </div>
  )
}

export default BreadCrumbs
