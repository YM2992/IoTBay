// empty template
import db from "./dbController.js";

export const getAll = (dbname) => {
  const sql = `SELECT * FROM ${dbname}`;
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
  //   console.log(sql);
  return db.prepare(sql).run();
};
