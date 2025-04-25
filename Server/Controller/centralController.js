// empty template
import db from "./dbController.js";

export const getAll = (dbname) => {
  const sql = `SELECT * FROM ${dbname} WHERE 1=1`;
  return db.prepare(sql).all();
};

export const getOne = (dbname, field, value) => {
  const sql = `SELECT * FROM ${dbname} WHERE ${field} = ?`;
  return db.prepare(sql).get(value);
};

export const createOne = (dbname, data) => {
  const keys = Object.keys(data).join(",");
  const values = Object.values(data);
  const vals = values
    .map((val) => {
      if (typeof val === "string" || val instanceof Date) {
        return `'${val}'`;
      } else {
        return val;
      }
    })
    .join(",");

  const sql = `INSERT INTO ${dbname} (${keys}) VALUES (${vals})`;
  //   console.log("SQL Query :", sql);
  return db.prepare(sql).run();
};

export const updateOne = (dbname, id, data) => {
  const keys = Object.keys(data);
  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const values = Object.values(data);

  const sql = `UPDATE ${dbname} SET ${setClause} WHERE ${dbname}id = ?`;
  return db.prepare(sql).run(...values, id);
};
