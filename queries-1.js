// QUERY #1
var before = new Date();
var count = db.freeway_loopdata.find({speed: {$gt: 100}}).count()
print("Total number: " + count);

var after = new Date();
execution_mills = after - before;
print("Query execution time " + execution_mills/1000 + " sec");