import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
  },
  phone: {
    type: String,
    required: [true, "Phone Number is required"],
  },
});

const User = models.User || model("User", UserSchema);

export default User;
