require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var moment = require("moment");
var request = require("request");
var axios = require("axios");
var chalk = require("chalk");
var util = require("util");
var log = console.log;
var Spotify = require("node-spotify-api");
var command = process.argv[2]; //first cl input 
var opt = process.argv[3]; //second cl input
var spotify = new Spotify(keys.spotify);
var appCount = 0;
var div = "=====================================================";
var n = "\n";

function main(command, opt){
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
        doThis();
        break;

        default:  //calls help function
        help();
        break;
    }

}

//returned if no command is passed
function help(){
    log(`
    ${chalk.yellow(div)}
    ${chalk.yellow.underline("USAGE:  node liri.js <command> [parameter]")}
        ${chalk.yellow.underline("Available Commands:")}
            ${chalk.yellow("concert-this")}
            ${chalk.yellow("spotify-this-song")}
            ${chalk.yellow("movie-this")}
            ${chalk.yellow("do-what-it-says")}
    ${chalk.yellow(div)}
    `);
}

//use command concert-this
//get the name of venue, location, and date from bands in town
function showConcert(){
    if (!opt){
        log(`
        ${chalk.yellow(div)}
           ${chalk.red.underline("You didn't provide an artist")}
        ${chalk.yellow(div)}
        `);
        return;
    }
    else {
        appCount++;
        var artist = opt.trim();
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    request(queryUrl, function(error, response, body){
        if (error) return log(error);
        if (!error && response.statusCode === 200){
            if (body.length < 20){
                return log("No Results Found");
            };
            var data = JSON.parse(body);
            for (let i = 0; i < data.length; i++){
                let num = i+1;
                let name = data[i].venue.name;
                let city = data[i].venue.city;
                let state = data[i].venue.region;
                let country = data[i].venue.country;
                let date = moment(data[i].datetime).format("DD MMMM YYYY h:mm");
                log(`
                ${chalk.blue(div)}
                    ${chalk.blue("#" + num)}
                        ${chalk.blue.bold("Venue:      ") + name}
                        ${chalk.blue.bold("Location:   ") + city + ", " + state + " " + country}
                        ${chalk.blue.bold("Date:       ") + date}
                ${chalk.blue(div)}
                `);
            }
        }
    });
}
}
//use command spotify-this-song
//get the artist, song name, preview link and album song is from
//default return is thw sign by ace of base

function showSong(opt){
    if (!opt){
        song = "The Sign Ace of Bass";
    }
    else {
        song = opt.trim();
        appCount++;
    }
        spotify.search({
            type: 'track',
            query: song,
            limit: 5
        }).then(function(response){
            let obj = response.tracks.items;
            let item = 0;
            for (var i = 0; i < obj.length; i++){
                item++;
                let a = JSON.stringify(obj[i].album.artists);
                let a_obj = JSON.parse(a);
                let artists = a_obj.map(a_obj => a_obj.name);
                let name = obj[i].name;
                let album = obj[i].album.name;
                let prev = obj[i].preview_url;
                log(`
                ${chalk.yellow.bold("Song: " + item)}
                ${chalk.yellow(div)}

                    ${chalk.yellow.bold("Artist(s):   ") + chalk.whiteBright(artists)}
                    ${chalk.yellow.bold("Song Name:   ") + chalk.whiteBright(name)}
                    ${chalk.yellow.bold("Album:       ") + chalk.whiteBright(album)}
                    ${chalk.yellow.bold("Preview:     ") + chalk.underline.whiteBright(prev)}
                
                ${chalk.yellow(div)}
                `);
            }
        }).catch(function(err){
            log(err);
        });
        
    }
//use command movie-this using movie name
//get the title, year, IMDB rating, rotton tomatoes rating, language, plot, and actors
//default is mr.nobody

function showMovie(opt) {
    var firstLine;
    var secondLine;
    if (!opt) {
        opt = "Mr Nobody"; //default movie that is returned
        log(`
            ${chalk.yellow("You didn't provide a movie name")}
            ${chalk.yellow("May I suggest Mr. Nobody")}
        `);
    }
    appCount++;
    axios.get("http://www.omdbapi.com/?t=" + opt.trim() + "&plot=short&apikey=trilogy")
        .then(function (response) {
            let thisResult = response.data;
            let mov1 = response.data.Title;
            let mov2 = response.data.Year;
            let mov3 = response.data.imdbRating;
            let mov4 = response.data.rottenTomatos;
            let mov5 = response.data.Country;
            let mov6 = response.data.Language;
            let mov7 = response.data.Plot;
            let mov8 = response.data.Actors;

            log(`
            ${chalk.yellow(div)}
            ${chalk.yellow("Title: ") + mov1}
            ${chalk.yellow("Released: ") + mov2}
            ${chalk.yellow("IMDB Rating: ") + mov3}
            ${chalk.yellow("Rotten Tomatos Rating: ") + mov4}
            ${chalk.yellow("Country Produced: ") + mov5}
            ${chalk.yellow("Language: ") + mov6}
            ${chalk.yellow("Plot: ") + mov7}
            ${chalk.yellow("Actors: ") + mov8}
            ${chalk.yellow(div)}
            `);
            fs.writeFile("./random" + appCount + ".txt", util.inspect(thisResult), function(err){
                if (err) {
                    return log(err);
                }
                    log("File was saved");
            });
        })
        .catch(function (error) {
            log(error);
        });
        
}

//use command do-what-it-says
//read the text from random.txt and return a band, song, or movie the same as above
function doThis(opt) {
    fs.readFile("random.txt", "utf8", function (error, data) {
        appCount++;
        let text = data.split(",");
        command = text[0].trim();
        opt = text[1].trim();
        if (error) {
            log(error);
            log("Nothing was Found that I could do");
        }
        else if (command === "concert-this"){
            main(command, opt);
            // log("showConcert");
            // log(command);
            // log(opt);
        }
        else if (command === "spotify-this-song"){
            main(command, opt);
            // log("showSong");
            // log(command);
            // log(opt);
        }
        else if (command === "movie-this"){
            main(command, opt);
            // log("showMovie");
            // log(command);
            // log(opt);
        }
    });
}

main (command, opt);