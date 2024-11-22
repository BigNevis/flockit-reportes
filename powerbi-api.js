import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://bi-reports.appfire.app/aio-app/rest/aio-cn/1.0/powerbi/export/NmJiZDkwZTctN2NiMC00Njk4LTlkMmUtNjVjNDkyMDdk';

async function fetchOData(url) {
  console.log(`Fetching data from: ${url}`);
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json;odata=verbose',
      'OData-MaxVersion': '4.0',
      'OData-Version': '4.0'
    }
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

async function obtenerDatosEntidad(entidad) {
  console.log(`Obteniendo datos para: ${entidad}`);
  let url = `${baseUrl}/${entidad}?$format=json`;
  let allData = [];
  
  try {
    while (url) {
      const data = await fetchOData(url);
      if (data.value) {
        allData = allData.concat(data.value);
      }
      url = data['@odata.nextLink'];
      console.log(`Obtenidos ${allData.length} registros para ${entidad}. ${url ? 'Continuando con el siguiente conjunto de datos.' : 'Todos los datos obtenidos.'}`);
    }
    
    console.log(`Datos obtenidos con éxito para ${entidad}. Cantidad total: ${allData.length}`);
    return allData;
  } catch (error) {
    console.error(`Error al obtener datos para ${entidad}:`, error.message);
    return { error: error.message };
  }
}

async function guardarReporteEntidad(entidad, datos) {
  const reportDir = path.join(__dirname, 'reports');
  const fileName = `${entidad}_report_${new Date().toISOString().replace(/:/g, '-')}.json`;
  const filePath = path.join(reportDir, fileName);

  try {
    await fs.mkdir(reportDir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(datos, null, 2));
    console.log(`Reporte para ${entidad} guardado en: ${filePath}`);
  } catch (error) {
    console.error(`Error al guardar el reporte para ${entidad}:`, error);
  }
}

async function obtenerTodasLasEntidades() {
  try {
    const metadataResponse = await fetchOData(`${baseUrl}?$format=json`);
    return metadataResponse.value.map(e => e.name);
  } catch (error) {
    console.error('Error al obtener la lista de entidades:', error.message);
    return [];
  }
}

async function obtenerReporteCompleto() {
  try {
    console.log('Iniciando la obtención de datos de todas las entidades...');

    const entidades = await obtenerTodasLasEntidades();
    console.log('Entidades disponibles:', entidades);

    for (const entidad of entidades) {
      const datosEntidad = await obtenerDatosEntidad(entidad);
      await guardarReporteEntidad(entidad, datosEntidad);
    }

    console.log('Reportes de todas las entidades generados y guardados con éxito.');
  } catch (error) {
    console.error('Error al obtener o procesar los reportes:', error.message);
  }
}

obtenerReporteCompleto();

