use rusqlite::{params, Connection, OptionalExtension};
use std::fs;
use std::io;
use std::path::{Path, PathBuf};
use tauri::{Manager, State};

struct DbState {
    db_path: PathBuf,
}

fn init_db(path: &Path) -> Result<(), String> {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|err| err.to_string())?;
    }

    let conn = Connection::open(path).map_err(|err| err.to_string())?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS kv (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at INTEGER NOT NULL
        )",
        [],
    )
    .map_err(|err| err.to_string())?;

    Ok(())
}

fn open_conn(state: &DbState) -> Result<Connection, String> {
    Connection::open(&state.db_path).map_err(|err| err.to_string())
}

#[tauri::command]
fn sqlite_get(state: State<'_, DbState>, key: String) -> Result<Option<String>, String> {
    let conn = open_conn(&state)?;
    let mut stmt = conn
        .prepare("SELECT value FROM kv WHERE key = ?1")
        .map_err(|err| err.to_string())?;

    let value = stmt
        .query_row([key], |row| row.get::<_, String>(0))
        .optional()
        .map_err(|err| err.to_string())?;

    Ok(value)
}

#[tauri::command]
fn sqlite_set(state: State<'_, DbState>, key: String, value: String) -> Result<(), String> {
    let conn = open_conn(&state)?;
    conn.execute(
        "INSERT INTO kv (key, value, updated_at)
         VALUES (?1, ?2, strftime('%s','now'))
         ON CONFLICT(key)
         DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at",
        params![key, value],
    )
    .map_err(|err| err.to_string())?;

    Ok(())
}

#[tauri::command]
fn sqlite_delete(state: State<'_, DbState>, key: String) -> Result<(), String> {
    let conn = open_conn(&state)?;
    conn.execute("DELETE FROM kv WHERE key = ?1", [key])
        .map_err(|err| err.to_string())?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let db_path = app
                .path()
                .app_data_dir()
                .map_err(io::Error::other)?
                .join("lory.sqlite");
            init_db(&db_path).map_err(io::Error::other)?;
            app.manage(DbState { db_path });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            sqlite_get,
            sqlite_set,
            sqlite_delete
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
