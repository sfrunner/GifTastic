$(document).ready(function(){
	var topics = ["Honda", "Corvette", "Porsche"];
	var localStorageArray = [];
	
	if(localStorage.length > 0 && localStorage.getItem("newTopics") !== ""){
		localStorageArray = localStorage.getItem("newTopics").split(",");
	}
	
	$.each(localStorageArray, function(a,carValue){
		topics.push(carValue);
	});
	
	var responseString = "";
	var newBTN;
	var newBTNDelete;
	
	buttonsArray();
	
	$("#buttons-row").on("click", ".btn-cars",function(event){
		giffyCall(event.target.innerHTML);
	});
	
	$("#submit-btn").click(function(event){
		event.preventDefault();
		var searchValue = $("#car-search-input").val().trim();
		giffyCall(searchValue);
		console.log(searchValue);
		topics.push(searchValue);
		localStorageArray.push(searchValue);
		localStorage.setItem("newTopics",localStorageArray);
		buttonsArray();
	});
	
	$("#gifs").on("click",".cars",function(){
		var currentURL = $(this).attr("src");
		var imageID = $(this).attr("id")
		if(currentURL === responseString.data[imageID].images.fixed_height_still.url){
			$(this).attr("src",responseString.data[imageID].images.fixed_height.url);
		}
		else{
			$(this).attr("src",responseString.data[imageID].images.fixed_height_still.url);
		}
	});	
	
	$("#buttons-row").on("click",".btn-delete",function(){
		var deleteValue = $(this).attr("id").replace("deletebtn-","");
		var indexNumberTopics = topics.indexOf(deleteValue);
		var indexNumberLocal = localStorageArray.indexOf(deleteValue);		
		topics.splice(indexNumberTopics,1);
		localStorageArray.splice(indexNumberLocal,1);
		console.log(topics);
		$("#btn-"+ deleteValue.replace(" ","")).remove();
		$("#deletebtn-"+deleteValue.replace(" ","")).remove();
		localStorage.setItem("newTopics",localStorageArray);
	});	

	
	function buttonsArray(){
	$("#buttons").empty();
	$.each(topics, function(i,value){
		//GIF Button
		newBTN = $("<button>");
		newBTN.attr("id", "btn-"+value.replace(" ",""));
		newBTN.attr("class", "btn-info btn-md btn-group btn-cars");
		newBTN.attr("type","submit");
		newBTN.attr("formtarget","_self");
		newBTN.html(value);
		$("#buttons").append(newBTN);
		//DeleteButton
		newBTNDelete = $("<button>");
		newBTNDelete.attr("id", "deletebtn-"+value.replace(" ",""));
		newBTNDelete.attr("class", "btn-danger btn-md btn-group btn-delete");
		newBTNDelete.attr("type","button");
		newBTNDelete.attr("formtarget","_self");
		newBTNDelete.html("X");
		$("#buttons").append(newBTNDelete);

	});
	}
	
	function giffyCall(searchKeyword){
		$("#gifs").html("");
		var endpoint = "https://api.giphy.com/";
		var searchPath = "v1/gifs/search?q=";
		var apiKey = "&api_key=dc6zaTOxFJmzC";
		var searchQuery = searchKeyword;
		var limit = "&limit=10";
		var fmt = "&fmt=json";
		$.ajax({
			url: endpoint + searchPath + searchQuery + limit + fmt + apiKey,
			method: "GET",
		}).done(function(response){
				console.log(response);
				responseString = response;
				console.log("hello");
				var newIMG = $("<input>");
				var newSection = $("<section>");
				$.each(responseString.data,function(n,value){
					newIMG = $("<input>");
					newIMG.attr("id", n);
					newIMG.attr("class", "btn-info btn-md btn-group cars");
					newIMG.attr("type","image");
					newIMG.attr("formtarget","_self");
					newIMG.attr("src",value.images.fixed_height_still.url);
					newIMG.attr("alt",n);
					$("#gifs").append(newIMG);
					newSection = $("<section>");
					newSection.attr("id","rating-" + n);
					newSection.html("Rating: "+ value.rating.toUpperCase());
					$("#" + n).after(newSection);
				});
		});
	}
});