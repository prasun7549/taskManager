module.exports.getDate=()=>{
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var today  = new Date();
     return today.toLocaleDateString("eg-US", options);
}
module.exports.getDay=()=>{
    var options = { weekday: 'long'};
    var day= new Date();
    return day.toLocaleDateString("eg-US",options);
}