const Review = require('../models/review');
const Home = require('../models/home');

module.exports.createReviews = async (req, res) => {
    const home = await Home.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    home.reviews.push(review);
    await review.save();
    await home.save();
    req.flash('success', 'Successfully created a new review!');
    res.redirect(`/vacation_homes/${home._id}`);
}

module.exports.deleteReviews = async (req, res) => {
    const { id, reviewId } = req.params;
    await Home.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review!');
    res.redirect(`/vacation_homes/${id}`)
}