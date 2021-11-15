// Import required module csvtojson and mongodb packages
const csvtojson = require('csvtojson');
const mongodb = require('mongodb');
const categories = require('../recko/config/categories.json')
const db_strings = require("./db_strings.json");

// choose env [local,qa,prod]
var url = db_strings.qa;
console.log(url);

var dbConn;
mongodb.MongoClient.connect(url, {
    useUnifiedTopology: true,
}).then((client) => {
    console.log('DB Connected!');
    dbConn = client.db();
    
    // CSV file name
    const fileName = "google.csv";
    var arrayToInsert = [];

    //inserting into the table "places"
    var collectionName = 'googledatas';
    var collection = dbConn.collection(collectionName);


    csvtojson().fromFile(fileName).then(source => {
        // Fetching the all data from each row

        for (var i = 0; i < source.length; i++) {
            var oneRow = {
                placeid: source[i]["placeid"],
                data: JSON.parse(source[i]["data"])
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