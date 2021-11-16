// Import required module csvtojson and mongodb packages
const csvtojson = require('csvtojson');
const mongodb = require('mongodb');
const categories = require('../recko/config/categories.json')
const db_strings = require("./db_strings.json");

// choose env [local,qa,prod]
var url = db_strings.local;
console.log(url);

var dbConn;
mongodb.MongoClient.connect(url, {
    useUnifiedTopology: true,
}).then((client) => {
    console.log('DB Connected!');
    dbConn = client.db();
    
    // CSV file name
    const fileName = "places.csv";
    var arrayToInsert = [];

    //inserting into the table "places"
    var collectionName = 'places';
    var collection = dbConn.collection(collectionName);


    csvtojson().fromFile(fileName).then(source => {
        // Fetching the all data from each row

        for (var i = 0; i < source.length; i++) {


            // set tag to 1 if in default tags, otherwise set to zero.
            var tags = {};
            for (tag in categories.tagObj) {
                if (categories.tagObj[tag].name == source[i]["tag1"] || categories.tagObj[tag].name == source[i]["tag2"] || categories.tagObj[tag].name == source[i]["tag3"]) {
                    tags[tag] = 1;
                } else {
                    tags[tag] = 0;
                }
            }

            if (source[i]["sw4"] == 1) {
                var location = "Clapham"
            } else if (source[i]["sw11"] == 1) {
                var location = "Clapham Junction & Battersea"
            } else if (source[i]["sw12"] == 1) {
                var location = "Clapham South & Balham"
            } else {
                var location = "unknown"
            }

             var oneRow = {
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
             arrayToInsert.push(oneRow);
         }

        if(collection) {
            collection.drop(function(err, delOK) {
                if (err) throw err;
                if (delOK) console.log("Collection deleted");
            });
        }

         collection.insertMany(arrayToInsert, (err, result) => {
             if (err) console.log(err);
             if(result){
                 console.log("Import CSV into database successfully.");
             }
         });
    });
    
    
}).catch(err => {
    console.log("DB Connection Error: ${err.message}");
});


