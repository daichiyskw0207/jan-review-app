'use client'

import dynamic from 'next/dynamic'

const RadarChartPanel = dynamic(() => import('./RadarChartPanel'), { ssr: false })

type RadarItem = { subject: string; value: number }

export default function DynamicRadarChart({ data }: { data: RadarItem[] }) {
  return <RadarChartPanel data={data} />
}
