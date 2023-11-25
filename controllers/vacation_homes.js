const { model } = require('mongoose');
const Home = require('../models/home');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const homes = await Home.find({});
    res.render('vacation_homes/index', { homes })
}

module.exports.renderNewForm = async (req, res) => {
    res.render('vacation_homes/new')
}

module.exports.createVacationHome = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.home.location,
        limit: 1
    }).send();

    const home = new Home(req.body.home);
    home.geometry = geoData.body.features[0].geometry;
    home.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    home.author = req.user._id;
    await home.save();
    req.flash('success', 'Successfully made a new vacation home!');
    res.redirect(`vacation_homes/${home._id}`)
}

module.exports.search = async (req, res) => {
    const result = req.query.search;
    const homes = await Home.find({ title: result });
    if (!homes) {
        req.flash('error', 'Cannot find that vacation home!')
        return res.redirect('/vacation_homes');
    }
    res.render('vacation_homes/search', { homes, result });
}

module.exports.showVacationHome = async (req, res) => {
    const home = await Home.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
    if (!home) {
        req.flash('error', 'Cannot find that vacation home!')
        return res.redirect('/vacation_homes');
    }
    res.render('vacation_homes/show', { home })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const home = await Home.findById(id)
    if (!home) {
        req.flash('error', 'Cannot update that vacation home!')
        return res.redirect('/vacation_homes');
    }
    res.render('vacation_homes/edit', { home })
}

module.exports.updateVacationHomes = async (req, res) => {
    const { id } = req.params;
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.home.location,
        limit: 1
    }).send();
    const home = await Home.findByIdAndUpdate(id, { ...req.body.home });
    home.geometry = geoData.body.features[0].geometry;
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    home.images.push(...imgs);
    await home.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await home.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated vacation home!');
    res.redirect(`/vacation_homes/${home._id}`)
}

module.exports.deleteVacationHomes = async (req, res) => {
    const { id } = req.params;
    const home = await Home.findByIdAndDelete(id);
    for (let image of home.images) {
        await cloudinary.uploader.destroy(image.filename);
    }
    req.flash('success', 'Successfully deleted a vacation home!');
    res.redirect('/vacation_homes')
}

