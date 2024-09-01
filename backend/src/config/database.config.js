import { connect, set } from "mongoose";

import mysql from "mysql2/promise";
import { UserModel } from "../models/user.model.js";
import { FoodModel } from "../models/food.model.js";
import { sample_users } from "../data.js";
import { sample_foods } from "../data.js";
import bcrypt from "bcryptjs";
const PASSWORD_HASH_SALT_ROUNDS = 10;

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "mern",
  waitForConnections: true,
  connectionLimit: 10,
});

export const dbconnect = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to MySQL database successfully!");
    connection.release();
    connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    global.db = connection;

    await seedFood();
    await seedUsers();

    console.log("connect successfully---");
  } catch (error) {
    console.log(error);
  }
};

async function seedUsers() {
  const [rows] = await global.db.query("SELECT COUNT(*) AS count FROM users");
  const count = rows[0].count;
  const usersCount = await UserModel.countDocuments();
  if (count > 0 && usersCount > 0) {
    console.log("Users seed is already done!");
    return;
  }

  for (let user of sample_users) {
    user.password = await bcrypt.hash(user.password, PASSWORD_HASH_SALT_ROUNDS);
    var data = await UserModel.create(user);
    await userInsert(data);
  }

  console.log("Users seed is done!");
}

async function userInsert(user) {
  const sql = `
    INSERT INTO users (id, name, email, password, address, isAdmin)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await global.db.query(sql, [
      user.id,
      user.name,
      user.email,
      user.password,
      user.address,
      user.isAdmin,
    ]);

    console.log("Insert successful:", result);
  } catch (error) {
    console.error("Error inserting users:", error);
  }
}

async function seedFood() {
  const [rows] = await global.db.query("SELECT COUNT(*) AS count FROM foods");
  const count = rows[0].count;
  const usersCount = await FoodModel.countDocuments();
  if (count > 0 && usersCount > 0) {
    console.log("Foods item is already exist!");
    return;
  }

  for (let user of sample_foods) {
    var data = await FoodModel.create(user);
    await foodInsert(data);
  }

  console.log("Food Item is done!");
}

async function foodInsert(user) {
  const sql = `
    INSERT INTO foods (id, name, price ,favorite ,stars ,imageUrl ,cookTime)
    VALUES (?,?,?,?,?,?,?)
  `;

  try {
    const [result] = await global.db.query(sql, [
      user.id,
      user.name,
      user.price,
      user.favorite,
      user.stars,
      user.imageUrl,
      user.cookTime,
    ]);

    console.log("Insert successful:", result);
  } catch (error) {
    console.error("Error inserting users:", error);
  }
}
