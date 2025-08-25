import { Office } from '@/interfaces/consumers'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import TinyContainer from '@/ui/Card/TinyContainer'
import { TabGroup } from '@/ui/Tabs/TabGroup'
import { settingsOffices } from '@/components/Navbar/navitems'
import { TabsContent } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import Input from '@/ui/form/Input'
import EditButton from '@/ui/button/EditButton'
import { router } from '@inertiajs/react'
import { MapPin, Phone, Mail, Calendar, Building, Users, Zap, PencilIcon } from 'lucide-react'

export default function OfficeShow({ office }: { office: Office }) {
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
  const {
    office_id,
    office_name,
    office_code,
    office_description,
    office_type_id,
    parent_office_id,
    effective_start,
    effective_end,
    contact_folio,
    office_type,
    is_current,
  } = office

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
    updatedAt: '18 July 2025'
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
              <StrongText className='text-2xl font-semibold text-[#252c32]'>{office_code} - {office_name}</StrongText>
              <TinyContainer variant={is_current ? 'success' : 'danger'}>
                {is_current ? 'Active' : 'Inactive'}
              </TinyContainer>
            </div>
          </div>
          <button 
            onClick={() => router.visit(route('offices.edit', office_id))}
            className='bg-[#0078d4] text-white px-4 py-2.5 rounded-lg flex items-center gap-2 font-semibold text-sm hover:bg-[#106ebe] transition-colors'
          >
            Edit Details
          </button>
        </div>


        {/* Main Content Tabs */}
        <TabGroup tabs={tabs}>
          <TabsContent value='details'>
            <div className='space-y-4'>
              {/* Basic Information */}
              <Card className='p-7 rounded-lg'>
                <div className='flex items-center justify-between mb-6'>
                  <StrongText className='text-base font-semibold text-[#252c32]'>Basic Information</StrongText>
                  <button 
                    onClick={() => router.visit(route('offices.edit', office_id))}
                    className='bg-white border border-[#dde2e4] text-[#0078d4] px-3.5 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm hover:bg-gray-50 transition-colors'
                  >
                    <PencilIcon className='w-4 h-4' />
                    Edit
                  </button>
                </div>
                <hr className='border-[#e5e9eb] mb-6' />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div className='space-y-1'>
                    <label className='text-sm font-normal text-[#252c32]'>Office Code</label>
                    <div className='bg-gray-50 px-2.5 py-2.5 rounded text-sm font-medium text-black'>
                      {office_code}
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <label className='text-sm font-normal text-[#252c32]'>Name</label>
                    <div className='bg-gray-50 px-2.5 py-2.5 rounded text-sm font-medium text-black'>
                      {office_name}
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <label className='text-sm font-normal text-[#252c32]'>Office Type</label>
                    <div className='bg-gray-50 px-2.5 py-2.5 rounded text-sm font-medium text-black'>
                      {office_type?.parameter_value || 'Subdivision'}
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <label className='text-sm font-normal text-[#252c32]'>Office Status</label>
                    <div className='px-2.5 py-2.5 text-sm font-medium text-black'>
                      {is_current ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Location Details */}
              <Card className='p-7 rounded-lg'>
                <div className='flex items-center justify-between mb-6'>
                  <StrongText className='text-base font-semibold text-[#252c32]'>Location Details</StrongText>
                  <button 
                    onClick={() => router.visit(route('offices.edit', office_id))}
                    className='bg-white border border-[#dde2e4] text-[#0078d4] px-3.5 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm hover:bg-gray-50 transition-colors'
                  >
                    <PencilIcon className='w-4 h-4' />
                    Edit
                  </button>
                </div>
                <hr className='border-[#e5e9eb] mb-6' />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div className='space-y-1'>
                    <label className='text-sm font-normal text-[#252c32]'>District</label>
                    <div className='bg-gray-50 px-2.5 py-2.5 rounded text-sm font-medium text-black'>
                      {placeholderData.district}
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <label className='text-sm font-normal text-[#252c32]'>Taluk</label>
                    <div className='bg-gray-50 px-2.5 py-2.5 rounded text-sm font-medium text-black'>
                      {placeholderData.taluk}
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <label className='text-sm font-normal text-[#252c32]'>Latitude</label>
                    <div className='bg-gray-50 px-2.5 py-2.5 rounded text-sm font-medium text-black'>
                      {placeholderData.latitude}
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <label className='text-sm font-normal text-[#252c32]'>Longitude</label>
                    <div className='bg-gray-50 px-2.5 py-2.5 rounded text-sm font-medium text-black'>
                      {placeholderData.longitude}
                    </div>
                  </div>
                  <div className='space-y-1 md:col-span-2'>
                    <label className='text-sm font-normal text-[#252c32]'>Address</label>
                    <div className='bg-gray-50 px-2.5 py-2.5 rounded text-sm font-normal text-[#252c32]'>
                      {placeholderData.address}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Parent Details */}
              <Card className='p-7 rounded-lg'>
                <div className='flex items-center justify-between mb-6'>
                  <StrongText className='text-base font-semibold text-[#252c32]'>Parent Details</StrongText>
                  <button 
                    onClick={() => router.visit(route('offices.edit', office_id))}
                    className='bg-white border border-[#dde2e4] text-[#0078d4] px-3.5 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm hover:bg-gray-50 transition-colors'
                  >
                    <PencilIcon className='w-4 h-4' />
                    Edit
                  </button>
                </div>
                <hr className='border-[#e5e9eb] mb-6' />
                <div className='border border-gray-200 rounded-lg p-2.5'>
                  <div className='flex justify-between items-start p-2.5'>
                    <div className='space-y-2.5 flex-1'>
                      <div className='space-y-1'>
                        <div className='flex items-center gap-3'>
                          <div className='font-semibold text-black text-base'>{placeholderData.parentName}</div>
                          <div className='bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-normal'>
                            {placeholderData.parentCode}
                          </div>
                        </div>
                        <div className='flex items-center gap-5'>
                          <div className='flex items-center gap-1'>
                            <Building className='w-3.5 h-3.5 text-gray-400' />
                            <span className='text-sm font-normal text-[#252c32]'>{placeholderData.parentType}</span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <MapPin className='w-3.5 h-3.5 text-gray-400' />
                            <span className='text-sm font-normal text-[#252c32]'>{placeholderData.parentLocation}</span>
                          </div>
                        </div>
                        <div className='text-sm font-normal text-[#252c32]'>{placeholderData.parentAddress}</div>
                      </div>
                    </div>
                    <div className='flex flex-col items-end p-2.5 gap-2'>
                      <div className='bg-green-100 text-[#1c6534] px-2.5 py-0.5 rounded-full text-xs font-normal'>
                        {placeholderData.parentStatus}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Other Info */}
              <Card className='p-7 rounded-lg'>
                <div className='flex items-center justify-between mb-6'>
                  <StrongText className='text-base font-semibold text-[#252c32]'>Other info</StrongText>
                  <button 
                    onClick={() => router.visit(route('offices.edit', office_id))}
                    className='bg-white border border-[#dde2e4] text-[#0078d4] px-3.5 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm hover:bg-gray-50 transition-colors'
                  >
                    <PencilIcon className='w-4 h-4' />
                    Edit
                  </button>
                </div>
                <hr className='border-[#e5e9eb] mb-6' />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div className='space-y-1'>
                    <label className='text-sm font-normal text-[#252c32]'>Effective Start Date</label>
                    <div className='bg-gray-50 px-2.5 py-2.5 rounded text-sm font-medium text-black'>
                      {formatDate(effective_start) || '12 May 1990'}
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <label className='text-sm font-normal text-[#252c32]'>Effective End date</label>
                    <div className='bg-gray-50 px-2.5 py-2.5 rounded text-sm font-medium text-black'>
                      {formatDate(effective_end) || 'Active'}
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <label className='text-sm font-normal text-[#252c32]'>Created by</label>
                    <div className='bg-gray-50 px-2.5 py-2.5 rounded text-sm font-medium text-black'>
                      {placeholderData.createdBy}
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <label className='text-sm font-normal text-[#252c32]'>Updated by</label>
                    <div className='bg-gray-50 px-2.5 py-2.5 rounded text-sm font-medium text-black'>
                      {placeholderData.updatedBy}
                    </div>
                  </div>
                  <div className='space-y-1 md:col-span-2'>
                    <label className='text-sm font-normal text-[#252c32]'>Updated at</label>
                    <div className='bg-gray-50 px-2.5 py-2.5 rounded text-sm font-normal text-[#252c32]'>
                      {placeholderData.updatedAt}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value='substations'>
            <Card className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <StrongText className='text-lg font-semibold text-gray-900'>Substations</StrongText>
              </div>
              <div className='text-center py-12'>
                <Zap className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                <p className='text-gray-600'>Substation data will be displayed here</p>
                <p className='text-sm text-gray-500 mt-2'>Feature coming soon</p>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value='consumers'>
            <Card className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <StrongText className='text-lg font-semibold text-gray-900'>Consumers</StrongText>
              </div>
              <div className='text-center py-12'>
                <Users className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                <p className='text-gray-600'>Consumer data will be displayed here</p>
                <p className='text-sm text-gray-500 mt-2'>Feature coming soon</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value='activity'>
            <Card className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <StrongText className='text-lg font-semibold text-gray-900'>Activity History</StrongText>
              </div>
              <div className='text-center py-12'>
                <Calendar className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                <p className='text-gray-600'>Activity history will be displayed here</p>
                <p className='text-sm text-gray-500 mt-2'>Feature coming soon</p>
              </div>
            </Card>
          </TabsContent>
        </TabGroup>
      </div>
    </MainLayout>
  )
}
