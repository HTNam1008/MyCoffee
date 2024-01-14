module.exports = {
  filterFeedbacks: (fbs) => {
    const fb_temp = fbs.filter((fb) => fb.replyID === null);
    const reply = fbs.filter((fb) => fb.replyID !== null);

    const feedbacks = fb_temp.map((feedback) => {
      return {
        ...feedback,
        replyID: reply.find((item) => item.replyID === feedback._id.toString()),
      };
    });
    return feedbacks;
  },
};
