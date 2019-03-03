require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var moment = require("moment");
var request = require("request");
var chalk = require("chalk");
var log = console.log;
var Spotify = require("node-spotify-api");
var command = process.argv[2]; //first cl input 
var opt = process.argv[3]; //second cl input
var spotify = new Spotify(keys.spotify);

// var spotifyKey = new Spotify({
//     id: keys.spotify.id,
//     secret: keys.spotify.secret
// });

//const omdbKey = new OMDB({
//    apikey: keys.omdb.apikey
//});

    switch (command){
        case "concert-this":
        showConcert(opt);
        break;

        case "spotify-this-song":
        showSong(opt);
        break;

        case "movie-this":
        showMovie(opt);
        break;

        case "do-what-it-says":
        showInfo(opt);
        break;

        default:  //calls help function
        help();
        break;
    }
//returned if no command is passed
function help(){
    log(`
    ${chalk.yellow("=====================================================")}
    ${chalk.yellow.underline("USAGE:  node liri.js <command> [parameter]")}
        ${chalk.yellow.underline("Available Commands:")}
            ${chalk.yellow("concert-this")}
            ${chalk.yellow("spotify-this-song")}
            ${chalk.yellow("movie-this")}
            ${chalk.yellow("do-what-it-says")}
    ${chalk.yellow("=====================================================")}
    `);
}

//use command concert-this
//get the name of venue, location, and date from bands in town
function showConcert(){
    if (!opt){
        log(`
        ${chalk.yellow("=====================================================")}
           ${chalk.red.underline("You didn't provide an artist")}
        ${chalk.yellow("=====================================================")}
        `);
        return;
    }
    else {
        var artist = opt.trim();
        log(artist);
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    request(queryUrl, function(error, response, body){
        if (error) return log(error);
        if (!error && response.statusCode === 200){
            if (body.length < 20){
                return log("No Results Found");
            };
            var data = JSON.parse(body);
            for (let i = 0; i < 3; i++){
                //log(data[i]);
                log(`
            ${chalk.blue("=====================================================")}
            ${chalk.blue("#" + (i+1))}
                ${chalk.blue.bold("Venue:      ") + data[i].venue.name}
                ${chalk.blue.bold("Location:   ") + data[i].venue.city + ", " + data[i].venue.region + " " + data[i].venue.country}
                ${chalk.blue.bold("Date:       ") + moment(data[i].datetime).format("DD MMMM YYYY h:mm")}
            ${chalk.blue("=====================================================")}
                `);
            }
        }
    });
}
}
//use command spotify-this-song
//get the artist, song name, preview link and album song is from
//default return is thw sign by ace of base

function showSong(song){
    if (!opt){
        song = "The Sign Ace of Bass";
    }
    else {
        song = opt.trim();
    }
        spotify.search({
            type: 'track',
            query: song,
            limit: 5
        }).then(function(response){
            var obj = response.tracks.items;
            var item = 0;
            for (var i = 0; i < obj.length; i++){
                item++;
                var a = JSON.stringify(obj[i].album.artists);
                var a_obj = JSON.parse(a);
                var artists = a_obj.map(a_obj => a_obj.name);
                log(`
                ${chalk.yellow.bold("Song: " + item)}
                ${chalk.yellow("================================================================================================================================")}

                    ${chalk.yellow.bold("Artist(s):   ") + chalk.whiteBright(artists)}
                    ${chalk.yellow.bold("Song Name:   ") + chalk.whiteBright(obj[i].name)}
                    ${chalk.yellow.bold("Album:       ") + chalk.whiteBright(obj[i].album.name)}
                    ${chalk.yellow.bold("Preview:     ") + chalk.underline.whiteBright(obj[i].preview_url)}
                
                ${chalk.yellow("================================================================================================================================")}
                `);
            }
             
        }).catch(function(err){
            log(err);
        });
    }
//use command movie-this using movie name
//get the title, year, IMDB rating, rotton tomatoes rating, language, plot, and actors
//default is mr.nobody

function showMovie(){
    var movie = opt;
    if (!opt) {
        log(`

           ${chalk.yellow("You didn't provide a movie name")}

           ${chalk.yellow("May I suggest Mr. Nobody")}
        `);
        opt = "Mr Nobody"; //default movie that is returned
    }
    else {
        var movie = opt.trim();

        var queryUrl = "http://www.omdbapi.com/?&t=" + movie +  "&apikey=48a30628";

        request(queryUrl, function(err, response, body){
            var data = JSON.parse(body);
            log(`
            ${chalk.yellow("==========================================================================================================")}
            ${chalk.yellow("Title: ") + data.Title}
            ${chalk.yellow("Released: ") + data.Year}
            ${chalk.yellow("IMDB Rating: ") + data.imdbRating}
            ${chalk.yellow("Rotten Tomatos Rating: ") + data.rottenTomatos}
            ${chalk.yellow("Country Produced: ") + data.Country}
            ${chalk.yellow("Language: ") + data.Language}
            ${chalk.yellow("Plot: ") + data.Plot}
            ${chalk.yellow("Actors: ") + data.Actors}
            ${chalk.yellow("==========================================================================================================")}
            `);
        });
    }
}

//use command do-what-it-says
//read the text from random.txt and return a band, song, or movie the same as above
function showInfo(){
    //var queryUrl = "";
    if (!opt) {
        log(`
        ${chalk.yellow("=====================================================")}
            ${chalk.red.underline("The source file doesn't have anything to search for")}
        ${chalk.yellow("=====================================================")}
        `);
    }
    else {
        writeResults()
        log(`
        ${chalk.yellow("=====================================================")}
            ${chalk.red.underline("I wrote the results to file")}
        ${chalk.yellow("=====================================================")}
        `);
    }
}

//output a txt file with the returned data
//check if a file exists...and name it in sequence

function writeResults(){
    fs.writeFile("search-results.txt", resultData, function(err){
        if (err) return console.log(err);
    } );
}
