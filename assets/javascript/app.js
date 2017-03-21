$(document).ready(function(){
	var topics = ["Honda", "Corvette", "Porsche"];
	var localStorageArray = [];
	
	// You can't count on localStorage.length as a way to validate that you have a specific value stored there.
	// Instead you need to explicitly check for that value.
	if(localStorage.getItem("newTopics") !== null && localStorage.getItem("newTopics").length > 0){
		localStorageArray = localStorage.getItem("newTopics").split(",");
	}
	
	$.each(localStorageArray, function(a,carValue){
		topics.push(carValue);
	});
	
	// You want to keep variable data types consistent as best you can.
	// By initially setting this to a string (and also appending `String` to the variable name)
	// anybody reading this code will assume this value is a string, but you later set it to the
	// response object that giphy returns. This mismatch between reality and expectations will
	// often be the root cause of silly bugs - so maybe instead name this something like `latestGiphyResponse`?
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
		// In this case it's good to clear out the user's input after they submit a search
		$("#car-search-input").val('');
		giffyCall(searchValue);
		// You want to be sure to remove any console.logs from code that you're deploying
		// console.log(searchValue);
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
		// You want to check which one of these returns -1 and then only splice from the array which contains the element to delete
		// Otherwise whenever you click on one of the topics, you will always remove the last element of the localStorage array as well.
		// That's because when passing negative values to splice you end up targeting items from the end of the array. I'd encourage you to check
		// out the docs on splice to see the specifics on this.
		if (indexNumberTopics > -1) {
			topics.splice(indexNumberTopics,1);
		}
		if (indexNumberLocal > -1) {
			localStorageArray.splice(indexNumberLocal,1);
		}
		// console.log(topics); // 😬
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

		// Completely stylistic note here - whitespace can be very nice for visually separating chunks of code
		$.ajax({
			url: endpoint + searchPath + searchQuery + limit + fmt + apiKey,
			method: "GET",
		}).done(function(response){
				// console.log(response);
				responseString = response;
				// console.log("hello");
				// You end up reassigning these during each iteration, so there's no need to define them out here.
				// var newIMG = $("<input>");
				// var newSection = $("<section>");

				$.each(responseString.data,function(n,value){
					// While input will technically work, it makes more sense to make the gif elements an image tag
					var newIMG = $("<img>");
					newIMG.attr("id", n);
					newIMG.attr("class", "btn-info btn-md btn-group cars");
					// no need to set the type if you use an image tag
					// newIMG.attr("type","image");
					newIMG.attr("formtarget","_self");
					newIMG.attr("src",value.images.fixed_height_still.url);
					newIMG.attr("alt",n);
					$("#gifs").append(newIMG);

					var newSection = $("<section>");
					newSection.attr("id","rating-" + n);
					newSection.html("Rating: "+ value.rating.toUpperCase());
					// so while you can use the more specific selector and `.after`, I think it's a bit simpler
					// to process appending the section to the same container you just appended the gif to.
					$("#gifs").append(newSection);
				});
		});
	}
});