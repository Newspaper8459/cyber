import express, { Express, Request, Response } from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();
const app: Express = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// console.log(process.env);
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
});

const connectToDB = async () => {
  try {
    await pool.connect();
  } catch (err) {
    console.log(err);
  }
};
connectToDB();


app.get("/", async (req: Request, res: Response) => {
  // res.send("Hello World!");
  const query = {
    text: `SELECT * FROM items`,
  };

  const records = await pool.query(query);
  console.log(records.rows);

  res.status(200).send(records.rows);
});

app.post("/item/", async (req: Request, res: Response) => {
  // res.send("Hello World!");
  // console.log(req);
  console.log(req.body);
  const { name, quantity, unit } = req.body;
  console.log(name);
  console.log(quantity);
  console.log(unit);

  const query = `INSERT INTO items(name, quantity, unit)values($1, $2, $3)`;

  pool.query(query, [name, quantity, unit])
    .then((result) => {
      res.status(200).send();
    })
    .catch((e) => {
      console.error(e);
    })
});


app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
