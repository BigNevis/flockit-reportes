-- Tabla raw_data_json (si no existe)
CREATE TABLE IF NOT EXISTS raw_data_json (
  id SERIAL PRIMARY KEY,
  entity_name VARCHAR(50) NOT NULL,
  data_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  json_data JSONB NOT NULL
);

-- Crear índices para raw_data_json si no existen
CREATE INDEX IF NOT EXISTS idx_raw_data_json_entity_name ON raw_data_json(entity_name);
CREATE INDEX IF NOT EXISTS idx_raw_data_json_data_date ON raw_data_json(data_date);

-- Tabla para Issues
CREATE TABLE IF NOT EXISTS Issues (
  Clave VARCHAR(50) PRIMARY KEY,
  Resumen TEXT,
  Tipo_de_Incidencia VARCHAR(50),
  Current_Status VARCHAR(50),
  Project_Key VARCHAR(50),
  Project_Name VARCHAR(100),
  Current_Sprint_Id VARCHAR(50),
  Epic_Link VARCHAR(50),
  Parent_Link VARCHAR(50),
  Start_date DATE,
  End_date DATE,
  Story_Points FLOAT,
  Time_Spent FLOAT,
  Remaining_Estimate FLOAT,
  Original_Estimate FLOAT,
  Current_Assignee_ID VARCHAR(50),
  Informador_ID VARCHAR(50),
  Prioridad VARCHAR(20),
  Ambiente VARCHAR(50),
  Fecha_pasaje_a_PROD DATE,
  Fecha_pasaje_RFC_PRY DATE,
  Consultora VARCHAR(100),
  Criticidad VARCHAR(20)
);

-- Tabla para Components
CREATE TABLE IF NOT EXISTS Components (
  Component_ID SERIAL PRIMARY KEY,
  Component_Name VARCHAR(100),
  Clave VARCHAR(50)
);

-- Tabla para Etiquetas
CREATE TABLE IF NOT EXISTS Etiquetas (
  Etiqueta_ID SERIAL PRIMARY KEY,
  Etiqueta_Name VARCHAR(100),
  Clave VARCHAR(50)
);

-- Tabla para History
CREATE TABLE IF NOT EXISTS History (
  History_ID SERIAL PRIMARY KEY,
  Clave VARCHAR(50),
  Assignee_ID VARCHAR(50),
  Assignee_Start TIMESTAMP,
  Assignee_End TIMESTAMP,
  Assignee_Sequence INTEGER,
  Time_With_Assignee_Days FLOAT,
  Time_With_Assignee_Business_Days FLOAT,
  Time_With_Assignee_Hours FLOAT,
  Time_With_Assignee_Business_Hours FLOAT,
  Is_Current_Assignee BOOLEAN
);

-- Tabla para Linked_Issues
CREATE TABLE IF NOT EXISTS Linked_Issues (
  Linked_Issue_ID SERIAL PRIMARY KEY,
  Source_Issue VARCHAR(50),
  Linked_Issue VARCHAR(50),
  Link_Type VARCHAR(50)
);

-- Tabla para Sprints
CREATE TABLE IF NOT EXISTS Sprints (
  Sprint_Id VARCHAR(50) PRIMARY KEY,
  Sprint_Name VARCHAR(100),
  Sprint_Start_Date DATE,
  Sprint_End_Date DATE
);

-- Tabla para Worklogs
CREATE TABLE IF NOT EXISTS Worklogs (
  Worklog_ID VARCHAR(50) PRIMARY KEY,
  Clave VARCHAR(50),
  Time_Entry_User_ID VARCHAR(50),
  Time_Entry_Date TIMESTAMP,
  Time_Spent FLOAT
);

