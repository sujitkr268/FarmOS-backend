const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["farmer", "buyer", "admin"],
      default: "farmer"
    },

    phone: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
