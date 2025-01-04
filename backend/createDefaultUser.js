const bcrypt = require("bcrypt");
const User = require("./models/userModel");
const connectDB = require("./config/db");

connectDB();

const createUser = async () => {
  const email = "adarshmaurya0022@gmail.com";
  const plainPassword = "music1010";

  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  const user = new User({ email, password: hashedPassword });

  await user.save();
  console.log("User created:", user);
};

createUser().then(() => process.exit());
