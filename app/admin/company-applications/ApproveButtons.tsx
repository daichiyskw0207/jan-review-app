'use client'

import { useState, useTransition } from 'react'
import { approveApplication, rejectApplication } from './actions'

export default function ApproveButtons({
  applicationId,
  companyName,
  email,
}: {
  applicationId: number
  companyName: string
  email: string
}) {
  const [isPending, startTransition] = useTransition()
  const [done, setDone] = useState<'approved' | 'rejected' | null>(null)

  if (done === 'approved') return <span className="text-sm font-bold text-green-600">✓ 承認済み</span>
  if (done === 'rejected') return <span className="text-sm font-bold text-gray-400">✗ 却下済み</span>

  return (
    <div className="flex gap-2 flex-shrink-0">
      <button
        disabled={isPending}
        onClick={() => startTransition(async () => {
          await approveApplication(applicationId, companyName, email)
          setDone('approved')
        })}
        className="text-sm bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        承認
      </button>
      <button
        disabled={isPending}
        onClick={() => startTransition(async () => {
          await rejectApplication(applicationId)
          setDone('rejected')
        })}
        className="text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-600 px-4 py-2 rounded-lg font-medium transition-colors"
      >
        却下
      </button>
    </div>
  )
}
