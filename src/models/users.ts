import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    require: true
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  college: {
    type: String
  },
  year: {
    type: String
  },
  id: {
    type: String
  }
});
export default mongoose.model("User", userSchema);
