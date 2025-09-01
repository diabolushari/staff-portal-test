import { settingsOffices } from '@/components/Navbar/navitems'
import ContactFolioCard from '@/components/Offices/ContactFolioCard'
import { Card } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { Office } from '@/interfaces/consumers'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import TinyContainer from '@/ui/Card/TinyContainer'
import { TabGroup } from '@/ui/Tabs/TabGroup'
import { router } from '@inertiajs/react'
import { Building, Calendar, MapPin, PencilIcon, Users, Zap } from 'lucide-react'
import { useState } from 'react'

interface Props {
  office: Office
}

const placeholderData = {
  district: 'Kozhikode',
  taluk: 'Kozhikode',
  latitude: '152.155',
  longitude: '169.325',
  address: 'SM Street Calicut',
  parentName: 'Kochi Substation',
  parentCode: 'KSEB002',
  parentType: 'Substation',
  parentLocation: 'Ernakulam, Kochi',
  parentAddress: 'Marine Drive, Kochi',
  parentStatus: 'Active',
  createdBy: 'RMO',
  updatedBy: 'Section Officer',
  updatedAt: '18 July 2025',
}

const tabs = [
  {
    value: 'details',
    label: 'Office Details',
  },
  {
    value: 'substations',
    label: 'Substations',
  },
  {
    value: 'consumers',
    label: 'Consumers',
  },
  {
    value: 'activity',
    label: 'Activity History',
  },
]

export default function OfficeShow({ office }: Readonly<Props>) {
  const [isEditing, setIsEditing] = useState(false)
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Offices',
      href: '/offices',
    },
    {
      title: 'Detail',
      href: `/offices/${office.office_id}`,
    },
  ]

  const formatDate = (dateStr?: string) => (dateStr ? new Date(dateStr).toLocaleDateString() : '-')

  // Placeholder data for missing fields based on Figma design
  const placeholderData = {
    district: 'Kozhikode',
    taluk: 'Kozhikode',
    latitude: '152.155',
    longitude: '169.325',
    address: 'SM Street Calicut',
    parentName: 'Kochi Substation',
    parentCode: 'KSEB002',
    parentType: 'Substation',
    parentLocation: 'Ernakulam, Kochi',
    parentAddress: 'Marine Drive, Kochi',
    parentStatus: 'Active',
    createdBy: 'RMO',
    updatedBy: 'Section Officer',
    updatedAt: '18 July 2025',
  }
  console.log(office)
  const tabs = [
    {
      value: 'details',
      label: 'Office Details',
    },
    {
      value: 'substations',
      label: 'Substations',
    },
    {
      value: 'consumers',
      label: 'Consumers',
    },
    {
      value: 'activity',
      label: 'Activity History',
    },
  ]

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={settingsOffices}
    >
      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6'>
        {/* Header Section */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-3'>
              <StrongText className='text-2xl font-semibold text-[#252c32]'>
                {office_code} - {office_name}
              </StrongText>
              <TinyContainer variant={is_current ? 'success' : 'danger'}>
                {is_current ? 'Active' : 'Inactive'}
              </TinyContainer>
            </div>
          </div>
          <button
            onClick={() => router.visit(route('offices.edit', office_id))}
            className='flex items-center gap-2 rounded-lg bg-[#0078d4] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#106ebe]'
          >
            {isEditing ? 'Cancel Edit' : 'Edit Details'}
          </button>
        </div>

        {/* Main Content Tabs */}
        <TabGroup tabs={tabs}>
          <TabsContent value='details'>
            <div className='space-y-4'>
              {/* Basic Information */}
              <Card className='rounded-lg p-7'>
                <div className='mb-6 flex items-center justify-between'>
                  <StrongText className='text-base font-semibold text-[#252c32]'>
                    Basic Information
                  </StrongText>
                  <button
                    onClick={() => router.visit(route('offices.edit', office_id))}
                    className='flex items-center gap-2 rounded-lg border border-[#dde2e4] bg-white px-3.5 py-2 text-sm font-semibold text-[#0078d4] transition-colors hover:bg-gray-50'
                  >
                    <PencilIcon className='h-4 w-4' />
                    Edit
                  </button>
                </div>
                <hr className='mb-6 border-[#e5e9eb]' />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div className='space-y-1'>
                    <label className='text-sm font-normal text-[#252c32]'>Office Code</label>
                    <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
                      {office_code}
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <label className='text-sm font-normal text-[#252c32]'>Name</label>
                    <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
                      {office_name}
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <label className='text-sm font-normal text-[#252c32]'>Office Type</label>
                    <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
                      {office_type?.parameter_value || 'Subdivision'}
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <label className='text-sm font-normal text-[#252c32]'>Office Status</label>
                    <div className='px-2.5 py-2.5 text-sm font-medium text-black'>
                      {office.is_current ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Location Details */}
              <Card className='rounded-lg p-7'>
                <div className='mb-6 flex items-center justify-between'>
                  <StrongText className='text-base font-semibold text-[#252c32]'>
                    Location Details
                  </StrongText>
                  <button
                    onClick={() => router.visit(route('offices.edit', office_id))}
                    className='flex items-center gap-2 rounded-lg border border-[#dde2e4] bg-white px-3.5 py-2 text-sm font-semibold text-[#0078d4] transition-colors hover:bg-gray-50'
                  >
                    <PencilIcon className='h-4 w-4' />
                    Edit
                  </button>
                </div>
                <hr className='mb-6 border-[#e5e9eb]' />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div className='space-y-1'>
                    <label className='text-sm font-normal text-[#252c32]'>District</label>
                    <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
                      {placeholderData.district}
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <label className='text-sm font-normal text-[#252c32]'>Taluk</label>
                    <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
                      {placeholderData.taluk}
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <label className='text-sm font-normal text-[#252c32]'>Latitude</label>
                    <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
                      {placeholderData.latitude}
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <label className='text-sm font-normal text-[#252c32]'>Longitude</label>
                    <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
                      {placeholderData.longitude}
                    </div>
                  </div>
                  <div className='space-y-1 md:col-span-2'>
                    <label className='text-sm font-normal text-[#252c32]'>Address</label>
                    <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-normal text-[#252c32]'>
                      {placeholderData.address}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Parent Details */}
              <Card className='rounded-lg p-7'>
                <div className='mb-6 flex items-center justify-between'>
                  <StrongText className='text-base font-semibold text-[#252c32]'>
                    Parent Details
                  </StrongText>
                  <button
                    onClick={() => router.visit(route('offices.edit', office_id))}
                    className='flex items-center gap-2 rounded-lg border border-[#dde2e4] bg-white px-3.5 py-2 text-sm font-semibold text-[#0078d4] transition-colors hover:bg-gray-50'
                  >
                    <PencilIcon className='h-4 w-4' />
                    Edit
                  </button>
                </div>
                <hr className='mb-6 border-[#e5e9eb]' />
                <div className='rounded-lg border border-gray-200 p-2.5'>
                  <div className='flex items-start justify-between p-2.5'>
                    <div className='flex-1 space-y-2.5'>
                      <div className='space-y-1'>
                        <div className='flex items-center gap-3'>
                          <div className='text-base font-semibold text-black'>
                            {placeholderData.parentName}
                          </div>
                          <div className='rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-normal text-blue-800'>
                            {placeholderData.parentCode}
                          </div>
                        </div>
                        <div className='flex items-center gap-5'>
                          <div className='flex items-center gap-1'>
                            <Building className='h-3.5 w-3.5 text-gray-400' />
                            <span className='text-sm font-normal text-[#252c32]'>
                              {placeholderData.parentType}
                            </span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <MapPin className='h-3.5 w-3.5 text-gray-400' />
                            <span className='text-sm font-normal text-[#252c32]'>
                              {placeholderData.parentLocation}
                            </span>
                          </div>
                        </div>
                        <div className='text-sm font-normal text-[#252c32]'>
                          {placeholderData.parentAddress}
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-col items-end gap-2 p-2.5'>
                      <div className='rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-normal text-[#1c6534]'>
                        {placeholderData.parentStatus}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Other Info */}
              <Card className='rounded-lg p-7'>
                <div className='mb-6 flex items-center justify-between'>
                  <StrongText className='text-base font-semibold text-[#252c32]'>
                    Other info
                  </StrongText>
                  <button
                    onClick={() => router.visit(route('offices.edit', office_id))}
                    className='flex items-center gap-2 rounded-lg border border-[#dde2e4] bg-white px-3.5 py-2 text-sm font-semibold text-[#0078d4] transition-colors hover:bg-gray-50'
                  >
                    <PencilIcon className='h-4 w-4' />
                    Edit
                  </button>
                </div>
                <hr className='mb-6 border-[#e5e9eb]' />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div className='space-y-1'>
                    <label className='text-sm font-normal text-[#252c32]'>
                      Effective Start Date
                    </label>
                    <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
                      {formatDate(effective_start) || '12 May 1990'}
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <label className='text-sm font-normal text-[#252c32]'>Effective End date</label>
                    <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
                      {formatDate(effective_end) || 'Active'}
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <label className='text-sm font-normal text-[#252c32]'>Created by</label>
                    <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
                      {placeholderData.createdBy}
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <label className='text-sm font-normal text-[#252c32]'>Updated by</label>
                    <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
                      {placeholderData.updatedBy}
                    </div>
                  </div>
                  <div className='space-y-1 md:col-span-2'>
                    <label className='text-sm font-normal text-[#252c32]'>Updated at</label>
                    <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-normal text-[#252c32]'>
                      {placeholderData.updatedAt}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Contact Folio */}
              <ContactFolioCard
                contacts={office.contact_folio?.contacts || []}
                officeId={office.office_id}
                officeCode={office.office_code.toString()}
                onContactsUpdate={() => {}}
              />
            </div>
          </TabsContent>

          <TabsContent value='substations'>
            <Card className='p-6'>
              <div className='mb-6 flex items-center justify-between'>
                <StrongText className='text-lg font-semibold text-gray-900'>Substations</StrongText>
              </div>
              <div className='py-12 text-center'>
                <Zap className='mx-auto mb-4 h-12 w-12 text-gray-400' />
                <p className='text-gray-600'>Substation data will be displayed here</p>
                <p className='mt-2 text-sm text-gray-500'>Feature coming soon</p>
              </div>
            </Card>
          </TabsContent>
          <TabsContent value='consumers'>
            <Card className='p-6'>
              <div className='mb-6 flex items-center justify-between'>
                <StrongText className='text-lg font-semibold text-gray-900'>Consumers</StrongText>
              </div>
              <div className='py-12 text-center'>
                <Users className='mx-auto mb-4 h-12 w-12 text-gray-400' />
                <p className='text-gray-600'>Consumer data will be displayed here</p>
                <p className='mt-2 text-sm text-gray-500'>Feature coming soon</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value='activity'>
            <Card className='p-6'>
              <div className='mb-6 flex items-center justify-between'>
                <StrongText className='text-lg font-semibold text-gray-900'>
                  Activity History
                </StrongText>
              </div>
              <div className='py-12 text-center'>
                <Calendar className='mx-auto mb-4 h-12 w-12 text-gray-400' />
                <p className='text-gray-600'>Activity history will be displayed here</p>
                <p className='mt-2 text-sm text-gray-500'>Feature coming soon</p>
              </div>
            </Card>
          </TabsContent>
        </TabGroup>
      </div>
    </MainLayout>
  )
}
