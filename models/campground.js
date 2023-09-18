const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
const { cloudinary } = require("../cloudinary");

const ImageSchema = new Schema({
    url: String,
    filename: String,
});

// https://res.cloudinary.com/dc87uasbe/image/upload/v1694890277/YelpCamp/fwsf7tev1pta8vq4todr.jpg

ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
    {
        title: String,
        images: [ImageSchema],
        geometry: {
            type: {
                type: String,
                enum: ["Point"],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
        price: Number,
        description: String,
        location: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
    },
    opts
);

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`;
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews,
            },
        });
        for (let img of doc.images) {
            if (
                ![
                    "YelpCamp/fwsf7tev1pta8vq4todr",
                    "YelpCamp/sjbhomql9oxgk3pkllc2",
                    "YelpCamp/py00aq12kn16hf1gwsht",
                    "YelpCamp/kxnihnjdqtpspmly4ahd",
                    "YelpCamp/zyb8yupypa6d9mlskycg",
                    "YelpCamp/vxuxoxobgejpioc0zcw0",
                    "YelpCamp/kbensk2txsjtou8kj2sw",
                    "YelpCamp/np6zsaptfepobyys998o",
                ].includes(img.filename)
            )
                await cloudinary.uploader.destroy(img.filename);
        }
    }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
