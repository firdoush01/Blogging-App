const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require("../services/auth");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/avatar.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", function (next) {
    if (!this.isModified("password")) return next();
  
    this.salt = randomBytes(16).toString("hex"); // Ensure salt is stored in hex format
    this.password = createHmac("sha256", this.salt)
      .update(this.password)
      .digest("hex");
  
    next();
  });

// Static method to match password
userSchema.statics.matchPasswordAndGenerateToken = async function (email, password) {
    const user = await this.findOne({ email });
  
    if (!user) throw new Error("User not found!");
  
    const userProvidedHash = createHmac("sha256", user.salt)
      .update(password)
      .digest("hex");
  
    if (user.password !== userProvidedHash) throw new Error("Incorrect Password!");
  
    const token = createTokenForUser(user);
    return token;
  };

const User = model("user", userSchema);
module.exports = User;
