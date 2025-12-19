import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";

let db: Database | null = null;

export async function initDatabase(): Promise<Database> {
  if (db) return db;

  const dbPath =
    process.env.DATABASE_PATH || path.join(__dirname, "../../database.sqlite");

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Create products table with base64 image support
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      description_am TEXT,
      description_om TEXT,
      price REAL NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      category TEXT,
      image_base64 TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
  `);

  // Migration for existing tables
  try {
    await db.exec("ALTER TABLE products ADD COLUMN description_am TEXT");
    console.log("Added description_am column");
  } catch (e) {
    // Column likely exists
  }

  try {
    await db.exec("ALTER TABLE products ADD COLUMN description_om TEXT");
    console.log("Added description_om column");
  } catch (e) {
    // Column likely exists
  }

  console.log("Database initialized successfully");
  return db;
}

export async function getDatabase(): Promise<Database> {
  if (!db) {
    return await initDatabase();
  }
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}
