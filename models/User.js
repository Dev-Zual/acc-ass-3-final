const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "please provide a email!"],
      validate: [validator.isEmail, "please provide a valid email"],
      lowercase: true,
      trim: true,
      unique: [true, "email is already exist!"],
    },
    password: {
      required: [true, "please provide your password!"],
      type: String,
      validate: {
        validator: (value) =>
          validator.isStrongPassword(value, {
            minLength: 6,
            minLowercase: 2,
            minNumber: 1,
            minSymbols: 1,
            minUppercase: 1,
          }),
        message: "{VALUE} is not strong enough!",
      },
    },
    confirmPassword: {
      required: [true, "please provide your confirm password!"],
      type: String,
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "password don't match!",
      },
    },
    firstName: {
      type: String,
      required: [true, "please provide your name!"],
      trim: true,
      maxLength: [100, "Name is too large!"],
      minLength: [3, "Name is too short!"],
    },
    lastName: {
      type: String,
      required: [true, "please provide your name!"],
      trim: true,
      maxLength: [100, "Name is too large!"],
      minLength: [3, "Name is too short!"],
    },
    role: {
      type: String,
      enum: ["candidate", "manager", "admin"],
      default: "candidate",
    },
    contactNumber: {
      type: String,
      validate: [
        validator.isMobilePhone,
        "please provide a valid contact number!",
      ],
    },
    address: String,
    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
    },
    confirmationToken: String,
    confirmationTokenExpires: Date,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.methods.comparePassword = function (password, hash) {
  const isValidPassword = bcrypt.compareSync(password, hash);
  return isValidPassword;
};

userSchema.pre("save", function (next) {
  const token = crypto.randomBytes(32).toString("hex");
  this.confirmationToken = token;
  const date = new Date();
  date.setDate(date.getDate() + 1);
  this.confirmationTokenExpires = date;
  next();
});

userSchema.pre("save", function (next) {
  const password = this.password;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  this.password = hashedPassword;
  this.confirmPassword = undefined;
  next();
});

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
