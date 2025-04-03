import sqlite3 from 'sqlite3';  // Using ES Module import syntax
import fs from 'fs';  // Import the file system module

// Open SQLite database (replace with the actual path of your SQLite database)
const db = new sqlite3.Database('./your_database_file.db', (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
    return;
  }
  console.log("Database opened successfully.");
});

// Path to your queries.sql file
const queries = fs.readFileSync('./db/queries.sql', 'utf-8');  // Ensure queries.sql is in the same directory

// Execute the SQL queries
db.exec(queries, (err) => {
  if (err) {
    console.error("Error executing queries:", err.message);
  } else {
    console.log("Database setup complete!");
  }
  
  // Close the database connection after executing queries
  db.close((err) => {
    if (err) {
      console.error("Error closing the database:", err.message);
    } else {
      console.log("Database closed.");
    }
  });
});

