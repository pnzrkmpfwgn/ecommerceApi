const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { DataTypes } = require("sequelize");
const sequelize = require("../database/db_connection");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const User = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: false,
    },
    msisdn: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        return new Promise((resolve, reject) => {
          jwt.sign(
            { 
              id: this.id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "5 days" },
            (err, token) => {
              if (err) reject(err);
              resolve(token);
            }
          );
        });
      },
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
      // beforeSave: async (user, options) => {
      //   if (user.changed("password")) {
      //     const salt = await bcrypt.genSalt(10);
      //     user.password = await bcrypt.hash(user.password, salt);
      //   }
      // },
    },
  }
);

// Comparing password:
User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

sequelize.sync();

module.exports = User;
