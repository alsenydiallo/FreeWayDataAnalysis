//QUERY 2
var before = new Date();
var detectors = db.freeway_detectors.find({"locationtext": "Sunnyside NB"});
var detectorids = detectors.map( function(x) {return x.detectorid});
//print(detectorids);


var stations = db.freeway_loopdata.find(
	{$and :
		[
			{ detectorid: { $in: detectorids } },
			{ starttime: {"$gte" : ISODate("2011-09-21T00:00:00Z"), "$lte" : ISODate("2011-09-21T23:59:59Z")}}
		]

	}
);

var totalVolume = 0;

while(stations.hasNext()){
	var station = stations.next();
	if(Number.isInteger(station.volume))
		totalVolume = totalVolume + parseInt(station.volume);
}
print("Total volume: " + totalVolume);

var after = new Date();
execution_mills = after - before;
print("Query execution time " + execution_mills/1000 + " sec");