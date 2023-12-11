const Feedback = require("../models/Feedback");
const { mutipleMongooseToObject } = require("../../util/mongoose");

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
    const imagePath = "/public/image/uploads/" + req.file.filename;

    const feedback = new Feedback({
      name: req.body.name,
      phone: req.body.phone,
      feedback: req.body.feedback,
      image: imagePath,
    });

    console.log(feedback);

    feedback
      .save()
      .then(() => res.redirect("/"))
      .catch((error) => console.log("Error:" + error));
  }
}

module.exports = new FeedbackController();
