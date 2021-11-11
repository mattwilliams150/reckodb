// Import required module csvtojson and mongodb packages
const csvtojson = require('csvtojson');
const mongodb = require('mongodb');
const categories = require('../recko/config/categories.json')

var url = 'mongodb://localhost:27017/recko';

var dbConn;
mongodb.MongoClient.connect(url, {
    useUnifiedTopology: true,
}).then((client) => {
    console.log('DB Connected!');
    dbConn = client.db();
}).catch(err => {
    console.log("DB Connection Error: ${err.message}");
});

// CSV file name
const fileName = "places.csv";
var arrayToInsert = [];
csvtojson().fromFile(fileName).then(source => {
    // Fetching the all data from each row
    
    for (var i = 0; i < source.length; i++) {
        
        
        // change tag names to tagids then populate tag flags
        source[i][categories.tagIds[source[i]["tag1"]]] = 1;
        source[i][categories.tagIds[source[i]["tag2"]]] = 1;
        source[i][categories.tagIds[source[i]["tag3"]]] = 1;

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
            culturally_authentic_dishes: source[i]["culturally_authentic_dishes"],
            exciting_menu: source[i]["exciting_menu"],
            fresh_flavours: source[i]["fresh_flavours"],
            generous_portions: source[i]["generous_portions"],
            fine_dining: source[i]["fine_dining"],
            small_plates_sharing: source[i]["small_plates_sharing"],
            street_food_vibes: source[i]["street_food_vibes"],
            delicious_cocktails: source[i]["delicious_cocktails"],
            craft_local_beer: source[i]["craft_local_beer"],
            fantastic_wine_list: source[i]["fantastic_wine_list"],
            awesome_architecture: source[i]["awesome_architecture"],
            entertaining: source[i]["entertaining"],
            fantastic_service: source[i]["fantastic_service"],
            luxurious: source[i]["luxurious"],
            buzzing_atmosphere: source[i]["buzzing_atmosphere"],
            great_music: source[i]["great_music"],
            intimate: source[i]["intimate"],
            modern_design: source[i]["modern_design"],
            party_vibes: source[i]["party_vibes"],
            quirky: source[i]["quirky"],
            relaxing: source[i]["relaxing"],
            romantic: source[i]["romantic"],
            rustic: source[i]["rustic"],
            chic: source[i]["chic"],
            working_from_home: source[i]["working_from_home"],
            young_kids_families: source[i]["young_kids_families"],
            large_groups: source[i]["large_groups"],
            vegans_vegetarians: source[i]["vegans_vegetarians"],
            bringing_the_dog: source[i]["bringing_the_dog"],
            a_date: source[i]["a_date"],
            a_special_occasion: source[i]["a_special_occasion"],
            a_quiet_catch_up: source[i]["a_quiet_catch_up"],
            watching_sport: source[i]["watching_sport"],
            an_evening_with_friends: source[i]["an_evening_with_friends"],
            bottomless_brunch: source[i]["bottomless_brunch"]
         };
         arrayToInsert.push(oneRow);
     }

     //inserting into the table "places"
     var collectionName = 'places';
    
    var collection = dbConn.collection(collectionName);
    
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


