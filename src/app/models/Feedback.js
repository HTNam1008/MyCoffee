const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");

const Feedback = new Schema(
  {
    author: { type: String, maxLength: 255 },
    phone: { type: String, maxLength: 255 },
    feedback: { type: String, maxLength: 255 },
    image: { type: String, maxLength: 255 },
    reply: { type: String, maxLength: 255 },
  },
  {
    timestamps: true,
  }
);

Feedback.plugin(mongooseDelete, {
  deleteAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("feedback", Feedback);
