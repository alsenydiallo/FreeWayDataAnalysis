//QUERY #6
var before = new Date();
//find the source station 
var sourceStation = db.freeway_stations.find({locationtext : "Johnson Cr NB"}).toArray();

//find the destination station
var destinationStation = db.freeway_stations.find({locationtext : "Columbia to I-205 NB"}).toArray();


var route = sourceStation[0].locationtext + " -> "; 			//variable containing the route
var nextid = sourceStation[0].downstream;	// //variable containing the current station
var cursor = "";
// loop through the table and match current upstream and downstream to the next upstream and downstream
do{
	cursor = db.freeway_stations.find({stationid : nextid});
	//cursor = db.freeway_stations.find({downstream : nextid});
	if(cursor){
		route += cursor[0].locationtext + " -> ";
	}
	nextid = cursor[0].downstream;

	if(nextid == destinationStation[0].stationid)
		break;
	
} while(true);

route += destinationStation[0].locationtext;
print(route);

var after = new Date();
execution_mills = after - before;
print("Query execution time " + execution_mills/1000 + " sec");