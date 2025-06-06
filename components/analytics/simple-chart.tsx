"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartData {
  label: string
  value: number
  color?: string
}

interface SimpleChartProps {
  title: string
  description?: string
  data: ChartData[]
  type: "bar" | "line" | "pie"
  height?: number
}

export function SimpleChart({ title, description, data, type, height = 200 }: SimpleChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value))

  const colors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#EC4899",
    "#6B7280",
  ]

  const renderBarChart = () => (
    <div className="flex items-end justify-between space-x-2" style={{ height }}>
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div
            className="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
            style={{
              height: `${(item.value / maxValue) * (height - 40)}px`,
              backgroundColor: item.color || colors[index % colors.length],
              minHeight: "4px",
            }}
          />
          <span className="text-xs text-gray-600 mt-2 text-center font-body">{item.label}</span>
          <span className="text-xs font-semibold text-gray-800">
            {typeof item.value === "number" && item.value > 1000 ? `${(item.value / 1000).toFixed(1)}k` : item.value}
          </span>
        </div>
      ))}
    </div>
  )

  const renderLineChart = () => (
    <div className="relative" style={{ height }}>
      <svg width="100%" height="100%" className="overflow-visible">
        <polyline
          fill="none"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={data
            .map((item, index) => {
              const x = (index / (data.length - 1)) * 100
              const y = 100 - (item.value / maxValue) * 80
              return `${x}%,${y}%`
            })
            .join(" ")}
        />
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100
          const y = 100 - (item.value / maxValue) * 80
          return (
            <circle key={index} cx={`${x}%`} cy={`${y}%`} r="4" fill="#3B82F6" className="hover:r-6 transition-all" />
          )
        })}
      </svg>
      <div className="flex justify-between mt-2">
        {data.map((item, index) => (
          <div key={index} className="text-center">
            <div className="text-xs text-gray-600 font-body">{item.label}</div>
            <div className="text-xs font-semibold text-gray-800">
              {typeof item.value === "number" && item.value > 1000 ? `${(item.value / 1000).toFixed(1)}k` : item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    let currentAngle = 0
    const radius = 80
    const centerX = 100
    const centerY = 100

    return (
      <div className="flex items-center space-x-6">
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {data.map((item, index) => {
              const percentage = item.value / total
              const angle = percentage * 360
              const startAngle = currentAngle
              const endAngle = currentAngle + angle

              const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180)
              const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180)
              const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180)
              const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180)

              const largeArcFlag = angle > 180 ? 1 : 0

              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                "Z",
              ].join(" ")

              currentAngle += angle

              return (
                <path
                  key={index}
                  d={pathData}
                  fill={item.color || colors[index % colors.length]}
                  className="hover:opacity-80 transition-opacity"
                />
              )
            })}
          </svg>
        </div>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color || colors[index % colors.length] }}
              />
              <span className="text-sm font-body">{item.label}</span>
              <span className="text-sm font-semibold">
                {typeof item.value === "number" && item.value > 1000
                  ? `${(item.value / 1000).toFixed(1)}k`
                  : item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">{title}</CardTitle>
        {description && <CardDescription className="font-body">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {type === "bar" && renderBarChart()}
        {type === "line" && renderLineChart()}
        {type === "pie" && renderPieChart()}
      </CardContent>
    </Card>
  )
}
