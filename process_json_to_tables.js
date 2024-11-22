import pg from 'pg';

const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'admin',
  port: 5432,
});

async function getLatestJsonData() {
  const client = await pool.connect();
  try {
    const query = `
      SELECT DISTINCT ON (entity_name) 
        entity_name, 
        json_data
      FROM raw_data_json
      ORDER BY entity_name, data_date DESC
    `;
    const result = await client.query(query);
    return result.rows;
  } finally {
    client.release();
  }
}

async function processIssues(issuesData) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const issue of issuesData) {
      const query = `
        INSERT INTO Issues (
          Clave, Resumen, Tipo_de_Incidencia, Current_Status, Project_Key, 
          Project_Name, Current_Sprint_Id, Epic_Link, Parent_Link, Start_date, 
          End_date, Story_Points, Time_Spent, Remaining_Estimate, Original_Estimate, 
          Current_Assignee_ID, Informador_ID, Prioridad, Ambiente, 
          Fecha_pasaje_a_PROD, Fecha_pasaje_RFC_PRY, Consultora, Criticidad
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
        ON CONFLICT (Clave) DO UPDATE SET
          Resumen = EXCLUDED.Resumen,
          Tipo_de_Incidencia = EXCLUDED.Tipo_de_Incidencia,
          Current_Status = EXCLUDED.Current_Status,
          Project_Key = EXCLUDED.Project_Key,
          Project_Name = EXCLUDED.Project_Name,
          Current_Sprint_Id = EXCLUDED.Current_Sprint_Id,
          Epic_Link = EXCLUDED.Epic_Link,
          Parent_Link = EXCLUDED.Parent_Link,
          Start_date = EXCLUDED.Start_date,
          End_date = EXCLUDED.End_date,
          Story_Points = EXCLUDED.Story_Points,
          Time_Spent = EXCLUDED.Time_Spent,
          Remaining_Estimate = EXCLUDED.Remaining_Estimate,
          Original_Estimate = EXCLUDED.Original_Estimate,
          Current_Assignee_ID = EXCLUDED.Current_Assignee_ID,
          Informador_ID = EXCLUDED.Informador_ID,
          Prioridad = EXCLUDED.Prioridad,
          Ambiente = EXCLUDED.Ambiente,
          Fecha_pasaje_a_PROD = EXCLUDED.Fecha_pasaje_a_PROD,
          Fecha_pasaje_RFC_PRY = EXCLUDED.Fecha_pasaje_RFC_PRY,
          Consultora = EXCLUDED.Consultora,
          Criticidad = EXCLUDED.Criticidad
      `;
      await client.query(query, [
        issue.Clave, issue.Resumen, issue['Tipo de Incidencia'], issue['Current Status'],
        issue['Project Key'], issue['Project Name'], issue['Current Sprint Id'],
        issue['Epic Link'], issue['Parent Link'], issue['Start date'], issue['End date'],
        issue['Story Points'], issue['Time Spent (Incl_ Sub-tasks)'],
        issue['Remaining Estimate (Incl_ Sub-tasks)'], issue['Original Estimate (Incl_ Sub-tasks)'],
        issue['Current Assignee'], issue['Informador'], issue.Prioridad, issue.Ambiente,
        issue['Fecha pasaje a PROD'], issue['Fecha pasaje RFC/PRY'],
        issue.Consultora, issue.Criticidad
      ]);
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function processComponents(componentsData) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const component of componentsData) {
      const query = `
        INSERT INTO Components (Component_Name, Clave)
        VALUES ($1, $2)
        ON CONFLICT (Component_ID) DO UPDATE SET
          Component_Name = EXCLUDED.Component_Name,
          Clave = EXCLUDED.Clave
      `;
      await client.query(query, [component['Component Name'], component.Clave]);
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function processEtiquetas(etiquetasData) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const etiqueta of etiquetasData) {
      const query = `
        INSERT INTO Etiquetas (Etiqueta_Name, Clave)
        VALUES ($1, $2)
        ON CONFLICT (Etiqueta_ID) DO UPDATE SET
          Etiqueta_Name = EXCLUDED.Etiqueta_Name,
          Clave = EXCLUDED.Clave
      `;
      await client.query(query, [etiqueta.Etiquetas, etiqueta.Clave]);
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function processHistory(historyData) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const history of historyData) {
      const query = `
        INSERT INTO History (
          Clave, Assignee_ID, Assignee_Start, Assignee_End, Assignee_Sequence,
          Time_With_Assignee_Days, Time_With_Assignee_Business_Days,
          Time_With_Assignee_Hours, Time_With_Assignee_Business_Hours,
          Is_Current_Assignee
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `;
      await client.query(query, [
        history.Clave,
        history['History Assignee'],
        history['Assignee start'],
        history['Assignee end'],
        history['Assignee sequence'],
        parseFloat(history['Time with assignee (days)']),
        parseFloat(history['Time with assignee (business days)']),
        parseFloat(history['Time with assignee (hrs)']),
        parseFloat(history['Time with assignee (business hrs)']),
        history['Current assignee?'] === 'Y'
      ]);
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function processLinkedIssues(linkedIssuesData) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const linkedIssue of linkedIssuesData) {
      const query = `
        INSERT INTO Linked_Issues (Source_Issue, Linked_Issue, Link_Type)
        VALUES ($1, $2, $3)
      `;
      await client.query(query, [
        linkedIssue.Clave,
        linkedIssue['Linked Issues: Key'],
        linkedIssue['Linked Issues: Link Type']
      ]);
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function processSprints(sprintsData) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const sprint of sprintsData) {
      const query = `
        INSERT INTO Sprints (Sprint_Id, Sprint_Name, Sprint_Start_Date, Sprint_End_Date)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (Sprint_Id) DO UPDATE SET
          Sprint_Name = EXCLUDED.Sprint_Name,
          Sprint_Start_Date = EXCLUDED.Sprint_Start_Date,
          Sprint_End_Date = EXCLUDED.Sprint_End_Date
      `;
      await client.query(query, [
        sprint['Sprint Id'],
        sprint['Sprint Name'],
        sprint['Sprint Start Date'],
        sprint['Sprint End Date']
      ]);
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function processWorklogs(worklogsData) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const worklog of worklogsData) {
      const query = `
        INSERT INTO Worklogs (Worklog_ID, Clave, Time_Entry_User_ID, Time_Entry_Date, Time_Spent)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (Worklog_ID) DO UPDATE SET
          Clave = EXCLUDED.Clave,
          Time_Entry_User_ID = EXCLUDED.Time_Entry_User_ID,
          Time_Entry_Date = EXCLUDED.Time_Entry_Date,
          Time_Spent = EXCLUDED.Time_Spent
      `;
      await client.query(query, [
        worklog['Worklog ID'],
        worklog.Clave,
        worklog['Time Entry User'],
        worklog['Time Entry Date'],
        parseFloat(worklog['Time Spent'])
      ]);
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function processAllData() {
  try {
    const latestData = await getLatestJsonData();
    for (const entityData of latestData) {
      const { entity_name, json_data } = entityData;
      console.log(`Procesando ${entity_name}...`);
      switch (entity_name) {
        case 'Issues':
          await processIssues(json_data);
          break;
        case 'Components':
          await processComponents(json_data);
          break;
        case 'Etiquetas':
          await processEtiquetas(json_data);
          break;
        case 'History':
          await processHistory(json_data);
          break;
        case 'Linked Issues':
          await processLinkedIssues(json_data);
          break;
        case 'Sprints':
          await processSprints(json_data);
          break;
        case 'Worklogs':
          await processWorklogs(json_data);
          break;
        default:
          console.log(`Entidad desconocida: ${entity_name}`);
      }
    }
    console.log('Todos los datos han sido procesados con éxito.');
  } catch (error) {
    console.error('Error al procesar los datos:', error);
  } finally {
    await pool.end();
  }
}

processAllData();

