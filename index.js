// Import required module csvtojson, mongoose and dotenv packages
const csvtojson = require('csvtojson');
const mongoose = require('mongoose');
require("dotenv").config()
const categories = require('../recko/config/categories.json')
const Places = require('./models/places');

//connect to the database using mongoose
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async (res) => {
		console.log('DB Connected!');
		
		// CSV file name
		const fileName = "places.csv";
		var arrayToInsert = [];


		csvtojson().fromFile(fileName).then(source => {
			// Fetching the all data from each row
			let t = 1;
			for (var i = 0; i < source.length; i++) {


				// set tag to 1 if in default tags, otherwise set to zero.
				let tags = {};
				for (let tag in categories.tagObj) {
					if (categories.tagObj[tag].name == source[i]["tag1"] || categories.tagObj[tag].name == source[i]["tag2"] || categories.tagObj[tag].name == source[i]["tag3"]) {
						tags[tag] = 1;
					} else {
						tags[tag] = 0;
					}
				}
				tags["number"] = t;
				t++;
				console.log(tags);

				// if (source[i]["sw4"] == 1) {
				// 	var location = "Clapham"
				// } else if (source[i]["sw11"] == 1) {
				// 	var location = "Clapham Junction & Battersea"
				// } else if (source[i]["sw12"] == 1) {
				// 	var location = "Clapham South & Balham"
				// } else {
				// 	var location = "unknown"
				// }

				// var oneRow = {
				// 	placeId: source[i]["placeId"],
				// 	photo: source[i]["photo"],
				// 	lat: source[i]["lat"],
				// 	long: source[i]["long"],
				// 	placeName: source[i]["placeName"],
				// 	review: source[i]["review"],
				// 	price: source[i]["price"],
				// 	address: source[i]["address"],
				// 	location: location,
				// 	sw4: source[i]["sw4"],
				// 	sw11: source[i]["sw11"],
				// 	sw12: source[i]["sw12"],
				// 	telephone: source[i]["telephone"],
				// 	website: source[i]["website"],
				// 	description: source[i]["description"],
				// 	type: source[i]["type"],
				// 	tag1: source[i]["tag1"],
				// 	tag2: source[i]["tag2"],
				// 	tag3: source[i]["tag3"],
				// 	subcategory: source[i]["subcategory"],
				// 	amenities: source[i]["amenities"],
				// 	tags: tags
				// };
				// console.log(oneRow);
			}
		});
		// 	if(collection) {
		// 		collection.drop(function(err, delOK) {
		// 			if (err) throw err;
		// 			if (delOK) console.log("Collection deleted");
		// 		});
		// 	}

		// 	collection.insertMany(arrayToInsert, (err, result) => {
		// 		if (err) console.log(err);
		// 		if(result){
		// 			console.log("Import CSV into database successfully.");
		// 		}
		// 	});
		// });
		
		
	}).catch(err => {
		console.log("DB Connection Error: ${err.message}");
	});


