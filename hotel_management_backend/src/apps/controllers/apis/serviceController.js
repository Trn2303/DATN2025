const ReviewModel = require("../../models/review");
const ServiceModel = require("../../models/service");
const pagination = require("../../../libs/pagination");

exports.index = async (req, res) => {
  try {
    const query = {};
    const page = Number(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;
    const services = await ServiceModel.find(query).skip(skip).limit(limit);
    res.status(200).json({
      status: "success",
      data: {
        docs: services,
        pages: await pagination(page, ServiceModel, query, limit),
      },
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
exports.show = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await serviceModel.findById(id);
    return res.status(200).json({
      status: "success",
      data: service,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
exports.reviews = async (req, res) => {
  try {
    const { id } = req.params;
    const query = {};
    query.service_id = id;
    const page = Number(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;
    const reviews = await ReviewModel.find(query)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      status: "success",
      filters: {
        page,
        limit,
        service_id: id,
      },
      data: {
        docs: reviews,
        pages: await pagination(page, ReviewModel, query, limit),
      },
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
exports.storeReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const review = req.body;
    review.service_id = id;
    await new ReviewModel(review).save();
    res.status(200).json({
      status: "success",
      data: review,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
