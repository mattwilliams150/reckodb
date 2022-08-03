// Import required module csvtojson, mongoose and dotenv packages
const csvtojson = require('csvtojson');
const mongoose = require('mongoose');
require("dotenv").config()
const categories = require('../recko/config/categories.json')
const Places = require('./models/places.js');
const GoogleData = require('./models/googledata.js');
let gp = require("googleplaces");
//connect to the database using mongoose
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async (res) => {
		console.log('DB Connected!');
		// CSV file name
		const fileName = "places.csv";

		let places = await Places.find({});
		//checking if the places collection has content
		if(!places.length) {
			csvtojson().fromFile(fileName).then(async (source) => {
				// Fetching the all data from each row
				let t = 1;
				for (let i = 0; i < source.length; i++) {


					// set tag to 1 if in default tags, otherwise set to zero.
					let tags = {};
					for (let tag in categories.tagObj) {
						if (categories.tagObj[tag].name == source[i]["tag1"] || categories.tagObj[tag].name == source[i]["tag2"] || categories.tagObj[tag].name == source[i]["tag3"]) {
							tags[tag] = 1;
						} else {
							tags[tag] = 0;
						}
					}

					let location = "unknown"
					if (source[i]["sw4"] == 1) {
						location = "Clapham"
					} else if (source[i]["sw11"] == 1) {
						location = "Clapham Junction & Battersea"
					} else if (source[i]["sw12"] == 1) {
						location = "Clapham South & Balham"
					}

					let oneRow = {
						placeId: source[i]["placeId"],
						photo: source[i]["photo"],
						lat: source[i]["lat"],
						long: source[i]["long"],
						placeName: source[i]["placeName"],
						review: source[i]["review"],
						price: source[i]["price"],
						address: source[i]["address"],
						location: location,
						sw4: source[i]["sw4"],
						sw11: source[i]["sw11"],
						sw12: source[i]["sw12"],
						telephone: source[i]["telephone"],
						website: source[i]["website"],
						description: source[i]["description"],
						type: source[i]["type"],
						tag1: source[i]["tag1"],
						tag2: source[i]["tag2"],
						tag3: source[i]["tag3"],
						subcategory: source[i]["subcategory"],
						amenities: source[i]["amenities"],
						tags: tags
					};
		
					await Places.create(oneRow).then((res) => {
						console.log(`Inserted row number ${t}`);
					}).catch((err) => {
						console.log(err);
					});

					t++;
				}

			});
		}

		// code to insert google data from places collection
		for (let i = 0; i < places.length; i++) {
			const place = places[i];
			let placeName = place.placeName;
			console.log(`Getting google data for place ${placeName}`);
			let placeid = place.placeId;
			const dbplace = await GoogleData.findOne({ placeid: placeid })
			if (!dbplace) {
				await getGooglePlace(placeid)
					.then(async(place) => {
						await saveplace(placeid, place);
						console.log(`Inserted google data for place ${placeName}`);
					})
					.catch((err) => {
						console.log(err);
					});
			} else {
				console.log(`Google data for place : ${placeName} already exists`);
			}
		}
			
	}).catch(err => {
		console.log(`DB Connection Error: ${err.message}`);
	});

// function to get google place data
const getGooglePlace = async (placeid) => {
	try {
		return new Promise((resolve, reject) => {
			let apikey = process.env.SERVER_GOOGLE_PLACES_API_KEY;
			let googlePlaces = new gp(apikey, "json");
			let parameters = {
				reference: placeid,
			};
			let place = googlePlaces.placeDetailsRequest(
				parameters,
				function (error, response) {
				if (error) {
					reject(error);
					console.log("Google Places Error: " + error);
				}
				resolve(response);
				}
			);
		});
	} catch (e) {
		logger.error(e.message);
	}
}


// function to save google place data
const saveplace = async (placeid, place) => {
	try {
		let newPlace = new GoogleData();
		newPlace.placeid = placeid;
		newPlace.data = place;
		await newPlace.save();
	} catch {
		logger.error(e.message);
	}
}
