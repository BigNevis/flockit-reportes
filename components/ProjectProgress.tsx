import { Progress } from "@/components/ui/progress"

interface ProjectProgressProps {
  project: string
  progress: number
}

export default function ProjectProgress({ project, progress }: ProjectProgressProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">% de avance Proyecto {project}</h3>
        <Progress value={progress} className="w-full" />
        <p className="mt-2 text-sm font-medium text-gray-700 text-right">{progress}%</p>
      </div>
    </div>
  )
}

