import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required!"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    phone: String,
    profileImg: String,

    email: {
      type: String,
      required: [true, "User email is required!"],
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "User password is required!"],
      minLength: [6, "Too short password!"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: Date,
    PasswordResetCode: String,
    PasswordResetExpires: Date,
    PasswordResetVerifeid: Boolean,
  },
  { timestamps: true }
);

// Hashing password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

const setImageUrl = (doc) => {
  if (doc.profileImg) {
    const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImg}`;
    doc.profileImg = imageUrl;
  }
};

// find and update
userSchema.post("init", (doc) => {
  setImageUrl(doc);
});

// create
userSchema.post("save", (doc) => {
  setImageUrl(doc);
});

export default mongoose.model("User", userSchema);
