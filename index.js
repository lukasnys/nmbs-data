var GtfsRealtimeBindings = require("gtfs-realtime-bindings");
var request = require("request");
var express = require("express");
var cors = require("cors");

app = express();
app.use(cors());

app.get("/train", (req, res, next) => {
    var requestSettings = {
        method: "GET",
        url: "https://sncb-opendata.hafas.de/gtfs/realtime/c21ac6758dd25af84cca5b707f3cb3de",
        encoding: null,
    };

    request(requestSettings, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
            const feedJSON = feed.entity.map(function (entity) {
                if (entity.tripUpdate) {
                    return entity.tripUpdate;
                }
            });
            res.json(feedJSON);
        } else {
            res.error("something went wrong");
        }
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Express server listening on port %d in %s mode", process.env.PORT || 3000, app.settings.env);
});
