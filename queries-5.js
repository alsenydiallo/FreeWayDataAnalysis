// QUERY 5
var before = new Date();
var freewayID = 3; // I-205 North freeway ID

// find all station on the I-205 north bound
var stations = db.freeway_stations.find({highwayid : freewayID});
var stationids = stations.map( function(x) {return x.stationid} );
print("stationids: " + stationids);

// find all detector on stations on the I-205 north bound
var detectors = db.freeway_detectors.find( {stationid: { $in: stationids } });
var detectorids = detectors.map( function(x) {return x.detectorid} );
print("\ndetectorids: " + detectorids);


/*var avgLength = 0;

while(stations.hasNext()){
	var aStation = stations.next();
	print(tojson(stations));
	if(Number.isInteger(aStation.length))
		avgLength = avgLength + parseInt(aStation.length);
}
print("Avg length = " + avgLength);
*/


// Use the detectorIDs to find the travel time for the data in freeway_loopdata corresponding to I-205 NB
var data = db.freeway_loopdata.find( 
	{ $and: [
				{ detectorid: { $in: detectorids } }, 
				{ $or: [ 
							{starttime: { "$gte" : ISODate("2011-09-21T07:00:00Z"), "$lte" : ISODate("2011-09-21T09:00:00Z")}}, 
							{starttime: { "$gte" : ISODate("2011-09-21T16:00:00Z"), "$lte" : ISODate("2011-09-21T18:00:00Z")}}
					   ]
				}
			]
	} 
).toArray();

db.travelTimes.insert(data);




// Aggregate the data and calculate the travel time over the I-205 freeway NB
var myCursor = db.travelTimes.aggregate(
	[ 
		{ "$group": { 	"_id" : null, 
						"avgSpeed" : { "$avg": "$speed" }}
		},

		{ "$project": 
					  { "result_in_minutes" : { "$multiply": [60, {$sum : { "$divide" : [1.441428571, "$avgSpeed"]}}]}}
		}
	]
);

while (myCursor.hasNext()) {
  print(tojson(myCursor.next()));
}

// Free up the collection 
db.travelTimes.drop();

var after = new Date();
execution_mills = after - before;
print("Query execution time " + execution_mills/1000 + " sec");





