import fetch from 'node-fetch';
import pg from 'pg';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://bi-reports.appfire.app/aio-app/rest/aio-cn/1.0/powerbi/export/NmJiZDkwZTctN2NiMC00Njk4LTlkMmUtNjVjNDkyMDdk';

const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'admin',
  port: 5432,
});

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

async function guardarReporteEnDB(entidad, datos) {
  const client = await pool.connect();
  try {
    const query = 'INSERT INTO raw_data_json (entity_name, json_data) VALUES ($1, $2)';
    await client.query(query, [entidad, JSON.stringify(datos)]);
    console.log(`Datos de ${entidad} guardados en la base de datos.`);
  } catch (error) {
    console.error(`Error al guardar datos de ${entidad} en la base de datos:`, error);
  } finally {
    client.release();
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

async function inicializarBaseDeDatos() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS raw_data_json (
        id SERIAL PRIMARY KEY,
        entity_name VARCHAR(50) NOT NULL,
        data_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        json_data JSONB NOT NULL
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_raw_data_json_entity_name ON raw_data_json(entity_name);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_raw_data_json_data_date ON raw_data_json(data_date);
    `);
    console.log('Base de datos inicializada correctamente.');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  } finally {
    client.release();
  }
}

async function obtenerReporteCompleto() {
  try {
    console.log('Iniciando la obtención de datos de todas las entidades...');

    await inicializarBaseDeDatos();

    const entidades = await obtenerTodasLasEntidades();
    console.log('Entidades disponibles:', entidades);

    for (const entidad of entidades) {
      const datosEntidad = await obtenerDatosEntidad(entidad);
      await guardarReporteEnDB(entidad, datosEntidad);
    }

    console.log('Todos los datos han sido guardados en la base de datos.');
  } catch (error) {
    console.error('Error al obtener o procesar el reporte completo:', error.message);
  } finally {
    await pool.end();
  }
}

obtenerReporteCompleto();

