db.freeway_loopdata.find().forEach(function(element){
  element.starttime = ISODate(element.starttime);
  db.freeway_loopdata.save(element);
})