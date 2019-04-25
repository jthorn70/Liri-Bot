require("dotenv").config();
var info = require("./keys.js");
var spotify = require('node-spotify-api');
var cTable = require('console.table');
var axios = require("axios");
var fs = require("fs");





var spotify = new spotify({
    id: info.keys.spotify.id,
    secret: info.keys.spotify.secret
  });


if (process.argv[2]== "spotify-this-song"){
    var songName = process.argv.slice(3).join(" ")
    if (songName == undefined){
        console.log("error: song not found")
    }

    spotify.search({type:'track', query: songName,limit: 1}, function(err, data){
        if(err){
            console.log("error: "+ err)
        }
   
    var tableArr = [];

    for (var i =0; i < data.tracks.items.length; i++){
        var result = {
            artist : data.tracks.items[i].album.artists[0].name,
            album_name : data.tracks.items[i].album.name,
            song_name : data.tracks.items[i].name,
            preview_url : data.tracks.items[i].preview_url
        }
        tableArr.push(result);

        var table = cTable.getTable(tableArr);
        console.log(table)
    }
})


}
 if(process.argv[2] == "movie-this"){
     var tableArr = [];
    var movieName = process.argv.slice(3).join("+")



    axios.get("http://www.omdbapi.com/?t="+movieName+"&y=&plot=short&apikey="+ info.keys.omdb.key).then(
        function(response) {

        // this puts the data into a table but the format looks gross

                // var result = {
                //     Year_Released: response.data.Title,
                //     IMDB_Rating: response.data.imdbRating,
                //     Rotten_Tomatoes: response.data.Ratings[1].Value,
                //     Country: response.data.Country,
                //     Plot: response.data.Plot,
                //     Actors: response.data.Actors,
                // }
                // tableArr.push(result);
                // console.log(result)
                // var table = cTable.getTable(tableArr);
                // console.log(table)
                
            
            // this looks much better
            console.log("----------------------------")
            console.log("Title: " + response.data.Title)
            console.log("Year Released: " + response.data.Released)
            console.log("IMDB Rating: " + response.data.imdbRating)
            console.log("Rotten Tomatoes: " + response.data.Ratings[1].Value)
            console.log("Country: " + response.data.Country)
            console.log("Plot: " + response.data.Plot)
            console.log("Actors: " + response.data.Actors)
            console.log("----------------------------")

        }
    )


}
 if(process.argv[2] == "concert-this"){
     var artist = process.argv.slice(3).join("+")
     var tableArr = []


     axios.get("https://rest.bandsintown.com/artists/"+ artist +"/events?app_id="+ info.keys.bandsInTown.key +"&date=upcoming").then(
     function(response) {
         var table;
         for (var i=0; i < response.data.length; i++){
            var result = {
                Venue_Name: response.data[i].venue.name,
                City: response.data[i].venue.city,
                State: response.data[i].venue.region,
                Date: response.data[i].datetime,
            }
                    tableArr.push(result);
                // console.log(result)
                table = cTable.getTable(tableArr);






            //  console.log("Venue Name: " + response.data[i].venue.name)
            //  console.log("Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region)
            //  console.log("Event Date: " + response.data[i].datetime)
            //  console.log("----------------------------")
         }
         console.log(table)

        }

    )
 }


 fs.readFile("random.txt", "utf8", function(err, response){
    if (err){
       return console.log(err)
    }
    var songName = response.split(",");
    // console.log(songName);

    if (process.argv[2]=="do-what-it-says"){
        spotify.search({type:'track', query: songName[1],limit: 1}, function(err, data){
            if(err){
                console.log("error: "+ err)
            }
       
        var tableArr = [];
    
        for (var i =0; i < data.tracks.items.length; i++){
            var result = {
                artist : data.tracks.items[i].album.artists[0].name,
                album_name : data.tracks.items[i].album.name,
                song_name : data.tracks.items[i].name,
                preview_url : data.tracks.items[i].preview_url
            }
            tableArr.push(result);
    
            var table = cTable.getTable(tableArr);
            console.log(table)
        }
            // console.log(data.tracks.items[0].name + ", by: " + data.tracks.items[0].album.artists[0].name)

            fs.appendFile("log.txt", data.tracks.items[0].name + ", by: " + data.tracks.items[0].album.artists[0].name + " | ", function(err){
                if (err){
                    return console.log(err);
                }
                console.log("log updated")

            })

    })
    }
    
})

