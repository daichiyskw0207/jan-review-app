'use client'

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'

type RadarItem = { subject: string; value: number }

export default function RadarChartPanel({ data }: { data: RadarItem[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">評価チャート</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#6b7280' }} />
          <Radar
            name="評価"
            dataKey="value"
            stroke="#f97316"
            fill="#f97316"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-3 gap-3 mt-2">
        {data.map((item) => (
          <div key={item.subject} className="text-center bg-gray-50 rounded-lg py-2">
            <p className="text-xs text-gray-500">{item.subject}</p>
            <p className="text-sm font-bold text-orange-500">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
