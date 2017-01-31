//QUERY #2
var before = new Date();
//find the ID for Foster NB
var station = db.freeway_stations.find({locationtext : "Foster NB"});
var stationID = station[0].stationid;

// find all detector associated with station ID Foster NB
var detectors = db.freeway_detectors.find({stationid : stationID}).toArray();
var detectorids = detectorIDs.map(function (x) {return x.detectorid});

// Use the detectorIDs to find all the data in freeway_loopdata
var data = db.freeway_loopdata.find( 
	{ $and: [
				{ detectorid: { $in: ids } }, 
				{ $or: [ 
							{starttime: { "$gte" : ISODate("2011-09-21T07:00:00Z"), "$lte" : ISODate("2011-09-21T07:05:00Z")}} 
					   ]
				}
			]
	} 
).toArray();

db.travelTimes.insert(data);

// Aggregate the data and calculate the travel time for 5 minute intervals
var myCursor = db.travelTimes.aggregate(
	[ 
		{ "$group": { 	"_id" : null, 
						"avgSpeed" : { "$avg": "$speed" }}
		},

		{ "$project": 
					  { "result_in_seconds" : { "$multiply": [3600, { "$divide" : [station[0].length, "$avgSpeed"]}]}}
		}
	]
);

while (myCursor.hasNext()) {
   print(tojson(myCursor.next()));
}
// Free up the collection to save space
db.travelTimes.drop();

var after = new Date();
execution_mills = after - before;
print("Query execution time " + execution_mills/1000 + " sec");

