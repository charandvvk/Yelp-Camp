const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

let dbUrl = "mongodb://localhost:27017/yelp-camp";
// to seed remote db
// dbUrl =
//     "mongodb+srv://<username>:<password>@cluster0.colrt20.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(dbUrl);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];
const images = [
    [
        {
            url: "https://res.cloudinary.com/dc87uasbe/image/upload/v1694890277/YelpCamp/fwsf7tev1pta8vq4todr.jpg",
            filename: "YelpCamp/fwsf7tev1pta8vq4todr",
        },
        {
            url: "https://res.cloudinary.com/dc87uasbe/image/upload/v1694890279/YelpCamp/sjbhomql9oxgk3pkllc2.jpg",
            filename: "YelpCamp/sjbhomql9oxgk3pkllc2",
        },
    ],
    [
        {
            url: "https://res.cloudinary.com/dc87uasbe/image/upload/v1694890281/YelpCamp/py00aq12kn16hf1gwsht.jpg",
            filename: "YelpCamp/py00aq12kn16hf1gwsht",
        },
    ],
    [
        {
            url: "https://res.cloudinary.com/dc87uasbe/image/upload/v1694890284/YelpCamp/kxnihnjdqtpspmly4ahd.jpg",
            filename: "YelpCamp/kxnihnjdqtpspmly4ahd",
        },
        {
            url: "https://res.cloudinary.com/dc87uasbe/image/upload/v1694890285/YelpCamp/zyb8yupypa6d9mlskycg.jpg",
            filename: "YelpCamp/zyb8yupypa6d9mlskycg",
        },
    ],
    [
        {
            url: "https://res.cloudinary.com/dc87uasbe/image/upload/v1694890285/YelpCamp/vxuxoxobgejpioc0zcw0.avif",
            filename: "YelpCamp/vxuxoxobgejpioc0zcw0",
        },
        {
            url: "https://res.cloudinary.com/dc87uasbe/image/upload/v1694890286/YelpCamp/kbensk2txsjtou8kj2sw.jpg",
            filename: "YelpCamp/kbensk2txsjtou8kj2sw",
        },
    ],
    [
        {
            url: "https://res.cloudinary.com/dc87uasbe/image/upload/v1694890290/YelpCamp/np6zsaptfepobyys998o.jpg",
            filename: "YelpCamp/np6zsaptfepobyys998o",
        },
    ],
];

const seedDB = async () => {
    await Campground.deleteMany({});
    const factor = 300,
        imgs = [];
    for (let i = 0; i < factor / 5; i++) imgs.push(...images);
    for (let i = 0; i < factor; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "6507e8725ee146468d23e8aa",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ],
            },
            images: imgs[i],
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
