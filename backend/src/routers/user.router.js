import { Router } from "express";
import jwt from "jsonwebtoken";
const router = Router();
import { BAD_REQUEST } from "../constants/httpStatus.js";
import handler from "express-async-handler";
import { UserModel } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import auth from "../middleware/auth.mid.js";
import admin from "../middleware/admin.mid.js";
const PASSWORD_HASH_SALT_ROUNDS = 10;

router.post(
  "/login",
  handler(async (req, res) => {
    const { email, password } = req.body;
    // const userCase = await UserModel.findOne({ email });
    const query = `SELECT * FROM users Where email = ?`;
    const userData = await global.db.execute(query, [email]);
    const user = userData[0][0];

    if (user && (await bcrypt.compare(password, user.password))) {
      res.send(generateTokenResponse(user));
      return;
    }

    res.status(BAD_REQUEST).send("Username or password is invalid");
  })
);

router.post(
  "/register",
  handler(async (req, res) => {
    const { name, email, password, address } = req.body;

    const query = `SELECT * FROM users Where email = ?`;
    const userData = await global.db.execute(query, [email]);
    const user = userData[0][0];

    const userMongo = await UserModel.findOne({ email });

    if (user && userMongo) {
      res.status(BAD_REQUEST).send("User already exists, please login!");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      password,
      PASSWORD_HASH_SALT_ROUNDS
    );

    const newUser = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      address,
    };

    const result = await UserModel.create(newUser);
    await userRegister(result);
    res.send(generateTokenResponse(result));
  })
);

router.put(
  "/updateProfile",
  auth,
  handler(async (req, res) => {
    const { name, address } = req.body;
    // const user = await UserModel.findByIdAndUpdate(
    //   req.user.id,
    //   { name, address },
    //   { new: true }
    // );
    console.log(req.user.id);
    await userUpdate(req.body, req.user.id);
    const query = `SELECT * FROM users Where id = '${req.user.id}'`;
    const userData = await global.db.query(query);
    const user = userData[0][0];
    res.send(generateTokenResponse(user));
  })
);

router.put(
  "/changePassword",
  auth,
  handler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    // const user = await UserModel.findById(req.user.id);

    const query = `SELECT * FROM users Where id = '${req.user.id}'`;
    const userData = await global.db.query(query);
    const user = userData[0][0];

    if (!user) {
      res.status(BAD_REQUEST).send("Change Password Failed!");
      return;
    }

    const equal = await bcrypt.compare(currentPassword, user.password);

    if (!equal) {
      res.status(BAD_REQUEST).send("Current Password Is Not Correct!");
      return;
    }
    // user.password = await bcrypt.hash(newPassword, PASSWORD_HASH_SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(
      newPassword,
      PASSWORD_HASH_SALT_ROUNDS
    );

    const update_query = `
    UPDATE users SET password = '${hashedPassword}'  Where id = '${req.user.id}'
  `;

    await global.db.query(update_query);

    // await user.save();

    res.send();
  })
);

router.get(
  "/getall/:searchTerm?",
  admin,
  handler(async (req, res) => {
    const { searchTerm } = req.params;

    const filter = searchTerm
      ? { name: { $regex: new RegExp(searchTerm, "i") } }
      : {};

    if (searchTerm == undefined) {
      var query = `SELECT * FROM users`;
    } else {
      var query = `SELECT * FROM users WHERE name LIKE "%${searchTerm}%"`;
    }
    const userData = await global.db.execute(query);
    const users = userData[0];

    // const users = await UserModel.find(filter, { password: 0 });
    res.send(users);
  })
);

router.put(
  "/toggleBlock/:userId",
  admin,
  handler(async (req, res) => {
    const { userId } = req.params;

    if (userId === req.user.id) {
      res.status(BAD_REQUEST).send("Can't block yourself!");
      return;
    }

    // const user = await UserModel.findById(userId);
    // res.send(user.isBlocked);

    const query = `SELECT * FROM users Where id = '${userId}'`;
    const userData = await global.db.execute(query);
    const user = userData[0][0];

    if (user.isBlocked == 0) {
      var isBlocked = 1;
    } else {
      var isBlocked = 0;
    }
    const sql = `
      UPDATE users SET isBlocked = '${isBlocked}'  Where id = '${userId}'
    `;

    await global.db.query(sql);

    const update_query = `SELECT * FROM users Where id = '${userId}'`;
    const update_userData = await global.db.execute(update_query);
    const update_user = update_userData[0][0];

    console.log(user);

    if (update_user.isBlocked == 0) {
      res.send(true);
    } else {
      res.send(false);
    }
  })
);

router.get(
  "/getById/:userId",
  admin,
  handler(async (req, res) => {
    const { userId } = req.params;
    const user = await UserModel.findById(userId, { password: 0 });
    res.send(user);
  })
);

router.put(
  "/update",
  admin,
  handler(async (req, res) => {
    const { id, name, email, address, isAdmin } = req.body;
    // await UserModel.findByIdAndUpdate(id, {
    //   name,
    //   email,
    //   address,
    //   isAdmin,
    // });

    var is_admin = isAdmin;
    if (isAdmin == true) {
      var is_admin = 1;
    } else {
      var is_admin = 0;
    }

    const sql = `
    UPDATE users SET name = '${name}' ,email = '${email}' ,address = '${address}' ,isAdmin = '${is_admin}'  Where id = '${id}'
  `;
    const result = await global.db.query(sql);
    res.send();
  })
);

const generateTokenResponse = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    address: user.address,
    isAdmin: user.isAdmin,
    token,
  };
};

async function userRegister(user) {
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

async function userUpdate(user, where) {
  const sql = `
    UPDATE users SET name = '${user.name}' ,address = '${user.address}'  Where id = '${where}'
  `;

  try {
    const result = await global.db.query(sql);
    return result;
  } catch (error) {
    console.error("Error inserting users:", error);
  }
}
export default router;
