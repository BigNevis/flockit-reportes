import fs from 'fs/promises';
import path from 'path';

export function processData(data) {
  console.log('Procesando datos...');
  // Aquí puedes agregar lógica para procesar los datos según tus necesidades
  // Por ejemplo, podrías filtrar, transformar o agregar datos
  return data;
}

export async function saveReport(data) {
  const reportDir = path.join(process.cwd(), 'reports');
  const fileName = `report_${new Date().toISOString().replace(/:/g, '-')}.json`;
  const filePath = path.join(reportDir, fileName);

  try {
    await fs.mkdir(reportDir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`Reporte guardado en: ${filePath}`);
  } catch (error) {
    console.error('Error al guardar el reporte:', error);
  }
}

