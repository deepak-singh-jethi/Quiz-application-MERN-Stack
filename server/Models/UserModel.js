const mongoose = require("mongoose");
const bycrpt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Provide name"],
    },
    email: {
      type: String,
      required: [true, "Please provide valid email"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password field can't be empty"],
      minlength: [6, "password must have minimum length of 6"],
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "confirm password field can't be empty"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "instructor", "admin", "finance"],
    },
    quizIds: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Quiz",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    interestedIn: {
      type: [String],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.index({ email: 1 });

// Middleware to store encryted password
userSchema.pre("save", async function (next) {
  // if password is not modified
  if (!this.isModified("password")) {
    return next();
  }
  // change password before saving it to database
  this.password = await bycrpt.hash(this.password, 12);

  // don't save confirm password
  this.confirmPassword = undefined;

  next();
});

// middleware to check if password is correct

userSchema.methods.isPasswordCorrect = async function (
  inputPassword,
  dbPassword
) {
  const isCorrect = await bycrpt.compare(inputPassword, dbPassword);
  return isCorrect;
};

// hide inActive user from find query
userSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
