import { Link } from '@inertiajs/react'
import React, { useState } from 'react'
import { Paginator } from '../ui_interfaces'

const calcUrls = (pagination: Paginator<{}>) => {
  let index = 0
  const listLength = pagination?.links?.length
  return pagination?.links?.map((link) => {
    const url = link.url == undefined ? '' : link.url
    index++
    let linkElement: JSX.Element | null = null
    if (index === 1) {
      linkElement = (
        <Link
          as='div'
          href={url}
          key={index.toString() + link.label}
          className='flex cursor-pointer items-center pt-3 text-gray-600 hover:text-indigo-700'
        >
          <svg
            width={14}
            height={8}
            viewBox='0 0 14 8'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M1.1665 4H12.8332'
              stroke='currentColor'
              strokeWidth='1.25'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M1.1665 4L4.49984 7.33333'
              stroke='currentColor'
              strokeWidth='1.25'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M1.1665 4.00002L4.49984 0.666687'
              stroke='currentColor'
              strokeWidth='1.25'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          <p className='small-1stop mr-4 ml-2 leading-none'>Previous</p>
        </Link>
      )
    }
    if (index !== 1 && index !== listLength) {
      linkElement = (
        <Link
          as='a'
          key={index.toString() + link.label}
          className={`small-1stop mr-4 hidden cursor-pointer border-t border-transparent px-2 pt-3 leading-none hover:border-indigo-400 hover:text-indigo-700 md:flex ${
            link.active ? 'border-indigo-400 text-indigo-700' : 'text-gray-600'
          } `}
          href={url}
        >
          {link.label}
        </Link>
      )
    }
    if (index === listLength) {
      linkElement = (
        <Link
          as='div'
          href={url}
          key={index.toString() + link.label}
          className='flex cursor-pointer items-center pt-3 text-gray-600 hover:text-indigo-700'
        >
          <p className='small-1stop mr-3 leading-none'>Next</p>
          <svg
            width={14}
            height={8}
            viewBox='0 0 14 8'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M1.1665 4H12.8332'
              stroke='currentColor'
              strokeWidth='1.25'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M9.5 7.33333L12.8333 4'
              stroke='currentColor'
              strokeWidth='1.25'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M9.5 0.666687L12.8333 4.00002'
              stroke='currentColor'
              strokeWidth='1.25'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </Link>
      )
    }
    return linkElement
  })
}

const Pagination = ({ pagination }: { pagination: Paginator<{}> }) => {
  const pageList = calcUrls(pagination)

  return (
    <div className='flex w-full flex-wrap items-center justify-between gap-y-4 py-2'>
      <p className='mt-auto self-center text-sm text-gray-700'>
        Showing <span className='small-1stop'>{pagination.from}</span> to{' '}
        <span className='small-1stop'>{pagination.to}</span> of {pagination.total}
      </p>
      <div className='border-t border-gray-200'>
        <nav
          className='relative flex flex-wrap rounded-md shadow-xs'
          aria-label='Pagination'
        >
          {pageList}
        </nav>
      </div>
    </div>
  )
}

export default Pagination
