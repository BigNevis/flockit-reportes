# Power BI Report Project

Este proyecto procesa datos de Power BI y los almacena en una base de datos PostgreSQL para su posterior análisis y generación de reportes.

## Requisitos previos

- Node.js (versión 14 o superior)
- PostgreSQL (versión 12 o superior)

## Estructura del proyecto

- `powerbi-api.js`: Script para obtener datos de la API de Power BI y almacenarlos en la base de datos.
- `process_json_to_tables.js`: Script para procesar los datos JSON almacenados y distribuirlos en tablas específicas.
- `drop_tables.sql`: Script SQL para eliminar las tablas existentes.
- `create_tables.sql`: Script SQL para crear las tablas necesarias.

## Pasos para ejecutar el proyecto

1. Eliminar las tablas existentes:
   Ejecuta el script SQL `drop_tables.sql` para eliminar todas las tablas existentes en la base de datos. Esto asegura que no haya conflictos con datos anteriores.

2. Crear las nuevas tablas:
   Ejecuta el script SQL `create_tables.sql` para crear las nuevas tablas en la base de datos. Esto establece la estructura necesaria para almacenar los datos de Power BI.

3. Obtener datos de la API de Power BI:
   Ejecuta el script `powerbi-api.js` con Node.js. Este script se conectará a la API de Power BI, recuperará los datos más recientes y los almacenará en la tabla `raw_data_json` de la base de datos.

4. Procesar y distribuir los datos:
   Ejecuta el script `process_json_to_tables.js` con Node.js. Este script leerá los datos JSON almacenados en `raw_data_json`, los procesará y los distribuirá en las tablas específicas creadas en el paso 2.

## Próximos pasos

Una vez que hayas ejecutado todos estos pasos, tendrás los datos de Power BI almacenados en tu base de datos PostgreSQL, listos para ser utilizados en la creación de reportes y análisis.

## Solución de problemas

Si encuentras algún error durante la ejecución de los scripts, asegúrate de:

1. Que tu base de datos PostgreSQL esté en funcionamiento y accesible.
2. Que tengas permisos suficientes para crear y modificar tablas en la base de datos.

Si el problema persiste, revisa los logs de error para obtener más información y consulta la documentación de PostgreSQL o Node.js según sea necesario.

## Contacto

Si tienes alguna pregunta o sugerencia, no dudes en abrir un issue en este repositorio.

¡Gracias por usar nuestro Power BI Report Project!

