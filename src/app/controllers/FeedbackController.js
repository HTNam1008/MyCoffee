const Feedback = require("../models/Feedback");
const {
  mutipleMongooseToObject,
  mongooseDateToString,
} = require("../../util/mongoose");

class FeedbackController {
  show(req, res, next) {
    Feedback.find({})
      .then((feedbacks) => {
        res.render("feedback/showFeedback", {
          feedbacks: mutipleMongooseToObject(feedbacks),
        });
      })
      .catch(next);
  }

  storeFeedback(req, res, next) {
    const imagePath = req.file
      ? "/public/image/uploads/" + req.file.filename
      : null;

    const feedback = new Feedback({
      author: req.body.author,
      phone: req.body.phone ?? null,
      feedback: req.body.feedback,
      image: imagePath,
      reply: req.reply ?? null,
    });

    // console.log(feedback);

    feedback
      .save()
      .then(() => res.redirect("/feedback"))
      .catch((error) => console.log("Error:" + error));
  }
}

module.exports = new FeedbackController();
