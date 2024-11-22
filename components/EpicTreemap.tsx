"use client"

import { Treemap, ResponsiveContainer, Tooltip } from 'recharts'

const data = [
  { name: 'Épica 1', size: 400 },
  { name: 'Épica 2', size: 300 },
  { name: 'Épica 3', size: 200 },
  { name: 'Épica 4', size: 100 },
  { name: 'Épica 5', size: 50 },
]

export default function EpicTreemap() {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={data}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#fff"
              fill="#8884d8"
            >
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p className="text-sm">{`${payload[0].name} : ${payload[0].value}`}</p>
      </div>
    )
  }

  return null
}

