import React, { useState, useMemo } from 'react'
import { Office, OfficeHierarchy } from '@/interfaces/consumers'
import SelectList from '@/ui/form/SelectList'
import ComboBox from '@/ui/form/ComboBox'
import Button from '@/ui/button/Button'
import Modal from '@/ui/Modal/Modal'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'

interface ParentOfficeModalProps {
  onClose: () => void
  officeHierarchies: OfficeHierarchy[]
  office_code: string
}

export default function AddRelationModal({
  onClose,
  officeHierarchies,
  office_code,
}: ParentOfficeModalProps) {
  const { formData, setFormValue } = useCustomForm({
    office_code: office_code,
    parent_office_code: '',
    hierarchy_code: '',
  })
  const { post, errors, loading } = useInertiaPost(route('office-hierarchy-rel.store'), {
    showErrorToast: true,
    onComplete: () => {
      onClose()
    },
  })
  const [parentOffice, setParentOffice] = useState<Office | null>(null)
  const handleComboBoxChange = (value: Office) => {
    setParentOffice(value)
    setFormValue('parent_office_code')(value.office_code)
  }

  const handleConfirm = () => {
    post(formData)
  }
  console.log(formData)
  return (
    <Modal
      setShowModal={onClose}
      title='Add Parent Office'
    >
      <div className='mt-4 space-y-4'>
        <SelectList
          label='Office Hierarchy'
          setValue={setFormValue('hierarchy_code')}
          value={formData.hierarchy_code}
          list={officeHierarchies}
          dataKey='hierarchy_code'
          displayKey='hierarchy_name'
        />

        {formData.hierarchy_code && (
          <ComboBox
            label='Office'
            url={`/api/offices?q=`}
            setValue={handleComboBoxChange}
            value={parentOffice}
            dataKey='office_code'
            displayKey='office_name'
            displayValue2='office_code'
            placeholder='Select Office'
          />
        )}
      </div>

      <div className='mt-6 flex justify-end gap-2'>
        <Button
          label='Cancel'
          variant='secondary'
          onClick={onClose}
        />
        <Button
          label='Add'
          variant='primary'
          onClick={handleConfirm}
        />
      </div>
    </Modal>
  )
}
