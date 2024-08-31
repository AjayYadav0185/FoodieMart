import { connect, set } from "mongoose";

import mysql from "mysql2/promise";
import { sample_users } from "../data.js";
import { sample_foods } from "../data.js";
import bcrypt from "bcryptjs";
const PASSWORD_HASH_SALT_ROUNDS = 10;

export const pool = mysql.createPool({
  host: "localhost", // e.g., 'localhost'
  user: "root", // e.g., 'root'
  password: "", // e.g., 'password'
  database: "mern", // e.g., 'test'
  waitForConnections: true,
  connectionLimit: 10,
});

export const dbconnect = async () => {
  try {
    // const connection = await pool.getConnection();
    // console.log("Connected to MySQL database successfully!");
    // connection.release();
    connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // global.dbconn = connection; // Ensure that dbconnect() returns the connection

    // await seedUsers();
    // await seedFoods();

    console.log("connect successfully---");
  } catch (error) {
    console.log(error);
  }
};

// async function seedUsers() {
//   try {
//     const [rows] = await global.dbconn.query(
//       "SELECT COUNT(*) AS count FROM users"
//     );
//     const count = rows[0].count;

//     if (count > 0) {
//       console.log("Users seed is already done!");
//       return;
//     }

//     for (let user of sample_users) {
//       user.password = await bcrypt.hash(
//         user.password,
//         PASSWORD_HASH_SALT_ROUNDS
//       );

//       await userInsert(user);
//       await console.log(user);
//     }

//     console.log("User seed is done!");
//   } catch (error) {
//     console.error("Error seeding users:", error);
//   }
// }

// async function userInsert(user) {
//   // SQL query with placeholders for values
//   const sql = `
//     INSERT INTO users (name, email, password, address, is_admin)
//     VALUES (?, ?, ?, ?, ?)
//   `;

//   try {
//     // Execute the query with the values array
//     const [result] = await global.dbconn.query(sql, [
//       user.name,
//       user.email,
//       user.password,
//       user.address,
//       user.isAdmin,
//     ]);

//     console.log("Insert successful:", result);
//   } catch (error) {
//     console.error("Error inserting users:", error);
//   }
// }

// async function seedFoods() {
//   try {
//     // Query to count the number of rows in the 'foods' table
//     const [rows] = await global.dbconn.query(
//       "SELECT COUNT(*) AS count FROM foods"
//     );
//     const count = rows[0].count;

//     if (count > 0) {
//       console.log("Foods seed is already done!");
//       return;
//     }

//     for (const food of sample_foods) {
//       food.imageUrl = `${food.imageUrl}`;
//       food.origins = JSON.stringify(food.origins);
//       food.tags = JSON.stringify(food.tags);
//       await insertFood(food);
//     }

//     console.log("Foods seed is done!");
//   } catch (error) {
//     console.error("Error seeding foods:", error);
//   }
// }

// async function insertFood(food) {
//   // SQL query with placeholders for values
//   const sql = `
//     INSERT INTO foods (name, price, cookTime, favorite, origins, stars, imageUrl, tags)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   try {
//     // Execute the query with the values array
//     const [result] = await global.dbconn.query(sql, [
//       food.name,
//       food.price,
//       food.cookTime,
//       food.favorite,
//       food.origins,
//       food.stars,
//       food.imageUrl,
//       food.tags,
//     ]);

//     console.log("Insert successful:", result);
//   } catch (error) {
//     console.error("Error inserting food:", error);
//   }
// }
