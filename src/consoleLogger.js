module.exports = {
	time: function(text){
	    var currentdate = new Date();
	    var time =
	        currentdate.getSeconds() + ':' + 
	        currentdate.getMinutes() + ':' + 
	        currentdate.getHours() + ' ' + 
	        currentdate.getMonth() + '-' + 
	        currentdate.getMonth() + '-' + 
	        currentdate.getFullYear();
	    console.log(time + ' ' + text);
	}
}