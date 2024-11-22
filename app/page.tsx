import ProjectProgress from '@/components/ProjectProgress'
import EpicTreemap from '@/components/EpicTreemap'
import IssueStatusTable from '@/components/IssueStatusTable'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Proyectos</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <ProjectProgress project="ART" progress={75} />
              <ProjectProgress project="Siniestros" progress={60} />
            </div>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Recuento de Incidencias por Épica</h2>
              <EpicTreemap />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Recuento de Incidencias por Estado</h2>
              <IssueStatusTable />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

