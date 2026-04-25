'use client'

import { useActionState } from 'react'
import { upsertStaff, StaffState } from './actions'

const initial: StaffState = {}

interface Staff {
  id: number
  name: string
  position: string | null
  email: string | null
  phone: string | null
}

export function StaffAddForm() {
  const [state, formAction, pending] = useActionState(upsertStaff, initial)

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{state.error}</p>
      )}
      {state.success && (
        <p className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">✅ 登録しました</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            氏名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text" name="name" required maxLength={50}
            placeholder="例：田中 花子"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">役職</label>
          <input
            type="text" name="position" maxLength={50}
            placeholder="例：マーケティング部長"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">メールアドレス</label>
          <input
            type="email" name="email"
            placeholder="例：tanaka@company.co.jp"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">電話番号</label>
          <input
            type="tel" name="phone" maxLength={20}
            placeholder="例：03-1234-5678"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </div>

      <button
        type="submit" disabled={pending}
        className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
      >
        {pending ? '登録中...' : '+ 担当者を追加'}
      </button>
    </form>
  )
}

export function StaffEditForm({ staff, onClose }: { staff: Staff; onClose: () => void }) {
  const [state, formAction, pending] = useActionState(upsertStaff, initial)

  return (
    <form action={async (fd) => { await formAction(fd); onClose() }} className="space-y-3">
      <input type="hidden" name="id" value={staff.id} />
      {state.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">氏名 <span className="text-red-500">*</span></label>
          <input type="text" name="name" required defaultValue={staff.name}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">役職</label>
          <input type="text" name="position" defaultValue={staff.position ?? ''}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">メールアドレス</label>
          <input type="email" name="email" defaultValue={staff.email ?? ''}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">電話番号</label>
          <input type="tel" name="phone" defaultValue={staff.phone ?? ''}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={pending}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          {pending ? '保存中...' : '保存'}
        </button>
        <button type="button" onClick={onClose}
          className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          キャンセル
        </button>
      </div>
    </form>
  )
}
