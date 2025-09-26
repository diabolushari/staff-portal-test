'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Step {
  id: number
  title: string
  // Can be any React component or element
  content: React.ReactNode
}

interface StepperProps {
  steps: Step[]
  /** Called when the final Submit button is clicked (form handles actual submit) */
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}

export default function Stepper({ steps, onSubmit }: StepperProps) {
  const [step, setStep] = useState(0)

  const nextStep = () => {
    if (step < steps.length - 1) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 0) setStep(step - 1)
  }

  return (
    <div className='w-full'>
      {/* Step headers */}
      <div className='mb-8 flex justify-between'>
        {steps.map((s, index) => (
          <button
            type='button'
            key={s.id}
            onClick={() => setStep(index)} // allow direct navigation
            className={cn(
              'flex-1 border-b-2 py-2 text-center transition-colors',
              step === index
                ? 'border-blue-600 font-semibold text-blue-600'
                : step > index
                  ? 'border-green-500 text-green-500'
                  : 'border-gray-300 text-gray-400'
            )}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Step content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[step].title}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* This can be ANY React component */}
          <div>{steps[step].content}</div>

          <div className='mt-6 flex justify-between'>
            <Button
              type='button'
              variant='outline'
              onClick={prevStep}
              disabled={step === 0}
            >
              Back
            </Button>

            {step < steps.length - 1 && (
              <Button
                type='button'
                onClick={nextStep}
              >
                Next
              </Button>
            )}
            {step === steps.length - 1 && (
              // final submit handled by parent <form>
              <Button type='submit'>Submit</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
