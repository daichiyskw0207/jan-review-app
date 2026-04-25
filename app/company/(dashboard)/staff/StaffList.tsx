'use client'

import { useState, useTransition } from 'react'
import { deleteStaff } from './actions'
import { StaffEditForm } from './StaffForm'

interface Staff {
  id: number
  name: string
  position: string | null
  email: string | null
  phone: string | null
}

export default function StaffList({ staffList }: { staffList: Staff[] }) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  if (staffList.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-8 text-center">
        まだ担当者が登録されていません
      </p>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {staffList.map((staff) => (
        <div key={staff.id} className="py-4">
          {editingId === staff.id ? (
            <StaffEditForm staff={staff} onClose={() => setEditingId(null)} />
          ) : (
            <div className="flex items-start gap-4">
              {/* アバター */}
              <div className="w-10 h-10 rounded-full bg-orange-100 flex-shrink-0 flex items-center justify-center text-orange-500 font-bold text-sm">
                {staff.name[0]}
              </div>

              {/* 情報 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-900 text-sm">{staff.name}</span>
                  {staff.position && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {staff.position}
                    </span>
                  )}
                </div>
                <div className="mt-1 space-y-0.5">
                  {staff.email && (
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <span className="text-gray-300">✉</span> {staff.email}
                    </p>
                  )}
                  {staff.phone && (
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <span className="text-gray-300">📞</span> {staff.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* 操作ボタン */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingId(staff.id)}
                  className="text-xs text-gray-500 hover:text-orange-500 border border-gray-200 hover:border-orange-300 px-3 py-1.5 rounded-lg transition-colors"
                >
                  編集
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    if (!confirm(`「${staff.name}」を削除しますか？`)) return
                    startTransition(async () => { await deleteStaff(staff.id) })
                  }}
                  className="text-xs text-red-400 hover:text-red-600 border border-red-100 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  削除
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
