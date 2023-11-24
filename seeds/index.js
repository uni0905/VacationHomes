const mongoose = require('mongoose');
const Home = require('../models/home');
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers')

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/vacation-home');
    console.log("DATABASE CONNECTION OPEN")
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

//to see connection to DB
// const seedDB = async () => {
//     await Home.deleteMany();
//     const h = new Home({ title: 'Purple Field' });
//     await h.save();
// }
// seedDB();

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Home.deleteMany();
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000) + 1;
        const price = Math.floor(Math.random() * 20) + 10;
        const home = new Home({
            author: '6537200686b88814d62c49a0', location: `${cities[random1000].city}, ${cities[random1000].state}`, title: `${sample(descriptors)} ${sample(places)}`, description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!', price,
            geometry:
            {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/duf1orzkq/image/upload/v1698640070/VacationHomes/oa2n7dl549qq8t8kb0tq.jpg',
                    filename: 'VacationHomes/u3x33igblkzzzdpmj4df',
                },
                {
                    url: 'https://res.cloudinary.com/duf1orzkq/image/upload/v1698640074/VacationHomes/imbycuct6zqcjff1l5lv.jpg',
                    filename: 'VacationHomes/fvdvznalkbpjjrj4x9ww',
                }

            ]
        });
        await home.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close();
    })