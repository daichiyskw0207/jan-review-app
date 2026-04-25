'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Legend,
} from 'recharts'
import { useState } from 'react'

// ──────────────────────────────────────────────
// 型定義
// ──────────────────────────────────────────────
type TrendPoint = { date: string; count: number }

type GenderRow = {
  gender: string
  count: number
  avg: number
  radar: { label: string; avg: number | null }[]
}

type AgeRow = {
  ageGroup: string
  count: number
  avg: number
  radar: { label: string; avg: number | null }[]
}

type ProductRow = { name: string; count: number; avg: number }
type RadarPoint = { label: string; avg: number }
type AxisDef = { key: string; label: string }

interface Props {
  trendData: TrendPoint[]
  genderData: GenderRow[]
  ageData: AgeRow[]
  productRanking: ProductRow[]
  overallRadar: RadarPoint[]
  radarAxes: AxisDef[]
  totalReviews: number
}

// ──────────────────────────────────────────────
// パレット
// ──────────────────────────────────────────────
const ORANGE = '#f97316'
const BLUE   = '#60a5fa'
const GREEN  = '#34d399'
const PURPLE = '#a78bfa'
const GRAY   = '#d1d5db'

const BAR_COLORS = [ORANGE, BLUE, GREEN, PURPLE]

// ──────────────────────────────────────────────
// スコア色
// ──────────────────────────────────────────────
function scoreColor(avg: number) {
  if (avg >= 4.5) return 'text-orange-500'
  if (avg >= 3.5) return 'text-yellow-500'
  if (avg >= 2.5) return 'text-green-500'
  return 'text-gray-500'
}

// ──────────────────────────────────────────────
// セクションラッパー
// ──────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-sm font-bold text-gray-700 mb-5">{title}</h2>
      {children}
    </div>
  )
}

// ──────────────────────────────────────────────
// カスタムツールチップ
// ──────────────────────────────────────────────
function TrendTooltip({ active, payload, label }: { active?: boolean; payload?: {value: number}[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow text-xs">
      <p className="text-gray-500">{label}</p>
      <p className="font-bold text-orange-500">{payload[0].value} 件</p>
    </div>
  )
}

// ──────────────────────────────────────────────
// メインコンポーネント
// ──────────────────────────────────────────────
export default function AnalyticsCharts({
  trendData,
  genderData,
  ageData,
  productRanking,
  overallRadar,
  totalReviews,
}: Props) {
  const [activeTab, setActiveTab] = useState<'gender' | 'age'>('gender')

  const demoRows = activeTab === 'gender' ? genderData : ageData
  const demoKey  = activeTab === 'gender' ? 'gender' : 'ageGroup'

  return (
    <div className="space-y-6">
      {/* ── 1. 投稿トレンド ── */}
      <Section title="📈 投稿数トレンド（過去60日）">
        {totalReviews === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">口コミがまだありません</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                interval={9}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<TrendTooltip />} />
              <Bar dataKey="count" fill={ORANGE} radius={[3, 3, 0, 0]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Section>

      {/* ── 2. デモグラフィック分析（タブ切り替え） ── */}
      <Section title="👥 デモグラフィック別評価">
        {/* タブ */}
        <div className="flex gap-2 mb-5">
          {(['gender', 'age'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab === 'gender' ? '性別' : '年代'}
            </button>
          ))}
        </div>

        {demoRows.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">
            プロフィールを登録したユーザーの口コミがありません
          </p>
        ) : (
          <div className="space-y-6">
            {/* スコアバー */}
            <div>
              <p className="text-xs text-gray-500 mb-3">平均スコア（5点満点）</p>
              <div className="space-y-3">
                {demoRows.map((row, i) => {
                  const label = (row as Record<string, unknown>)[demoKey] as string
                  return (
                    <div key={label} className="flex items-center gap-3">
                      <span className="w-20 text-xs text-gray-600 flex-shrink-0 text-right">{label}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                        <div
                          className="h-full rounded-full flex items-center justify-end pr-2 transition-all"
                          style={{
                            width: `${(row.avg / 5) * 100}%`,
                            backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
                          }}
                        >
                          <span className="text-white text-xs font-bold">{row.avg}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 w-12 flex-shrink-0">{row.count}件</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* レーダースコア表 */}
            <div>
              <p className="text-xs text-gray-500 mb-3">評価軸別スコア</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 pr-4 text-gray-500 font-medium">評価軸</th>
                      {demoRows.map((row) => {
                        const label = (row as Record<string, unknown>)[demoKey] as string
                        return (
                          <th key={label} className="text-center py-2 px-3 text-gray-500 font-medium">
                            {label}
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {demoRows[0].radar.map((ax, axIdx) => (
                      <tr key={ax.label} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-2 pr-4 text-gray-600">{ax.label}</td>
                        {demoRows.map((row) => {
                          const label = (row as Record<string, unknown>)[demoKey] as string
                          const val = row.radar[axIdx]?.avg
                          return (
                            <td key={label} className={`text-center py-2 px-3 font-bold ${val ? scoreColor(val) : 'text-gray-300'}`}>
                              {val ?? '-'}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Section>

      {/* ── 3. 総合レーダーチャート ── */}
      <Section title="🕸️ 総合レーダースコア">
        {overallRadar.every((r) => r.avg === 0) ? (
          <p className="text-sm text-gray-400 py-8 text-center">データがありません</p>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={overallRadar} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="#f3f4f6" />
                <PolarAngleAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 5]}
                  tickCount={6}
                  tick={{ fontSize: 9, fill: '#d1d5db' }}
                />
                <Radar
                  name="平均スコア"
                  dataKey="avg"
                  stroke={ORANGE}
                  fill={ORANGE}
                  fillOpacity={0.25}
                  dot={{ r: 3, fill: ORANGE }}
                />
                <Tooltip
                  formatter={(v) => [`${Number(v ?? 0).toFixed(1)} 点`, '平均スコア'] as [string, string]}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                />
              </RadarChart>
            </ResponsiveContainer>

            {/* スコア一覧 */}
            <div className="w-full sm:w-48 flex-shrink-0 space-y-2">
              {overallRadar.map((ax) => (
                <div key={ax.label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{ax.label}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-orange-400 rounded-full"
                        style={{ width: `${(ax.avg / 5) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-bold w-6 text-right ${scoreColor(ax.avg)}`}>{ax.avg}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* ── 4. 商品別口コミ数ランキング ── */}
      <Section title="📦 商品別口コミ数ランキング（上位10件）">
        {productRanking.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">データがありません</p>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(200, productRanking.length * 40)}>
            <BarChart
              layout="vertical"
              data={productRanking}
              margin={{ top: 4, right: 60, left: 8, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fontSize: 11, fill: '#4b5563' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: string) => v.length > 14 ? v.slice(0, 13) + '…' : v}
              />
              <Tooltip
                formatter={(v, name) => [
                  name === 'count' ? `${Number(v ?? 0)} 件` : `${Number(v ?? 0).toFixed(1)} 点`,
                  name === 'count' ? '口コミ数' : '平均スコア',
                ] as [string, string]}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
              <Legend
                formatter={(v: string) => v === 'count' ? '口コミ数' : '平均スコア'}
                wrapperStyle={{ fontSize: 11 }}
              />
              <Bar dataKey="count" name="count" fill={ORANGE} radius={[0, 4, 4, 0]} maxBarSize={20}>
                {productRanking.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? ORANGE : index === 1 ? '#fb923c' : '#fdba74'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </Section>
    </div>
  )
}
