var issues = [];				//contains all issues
var priorities = [];			//contains all priorities
var topics = [];				//contains all topics
var states = [];				//contains all states
var currentShowIssue;			//the issue, which currently shows the issue details
var orderDescending = true;		//describes the order, changed when clicking on an table head
var searchText = "";			//the text, which is currently written in the searchbar
var lastid = -1;				//the last id inserted into the database

//takes care for keypresses, to close alle the different panels when cklicking ESCAPE
window.addEventListener("keydown", function(e){
    if(e.keyCode === 27) { //ESCAPE - KEYPRESS
        document.getElementById("createIssue").classList.remove("visible");
		document.getElementById("createIssue").classList.add("hidden");

		document.getElementById("showIssue").classList.remove("visible");
		document.getElementById("showIssue").classList.add("hidden");

		document.getElementById("settings").classList.remove("visible");
		document.getElementById("settings").classList.add("hidden");

		document.getElementById("add_remove_issue_circle").classList.remove("orange");
		document.getElementById("add_remove_issue_circle").classList.remove("red");
		document.getElementById("add_remove_issue_circle").classList.add("green");
		document.getElementById("add_remove_issue_image").src = "res/plus.png";
    }
});


//fired on pageload, download all data from database
function initData(){
	dbRequest("priorities", "SELECT * FROM priority");
	dbRequest("topics", "SELECT * FROM topic");
	dbRequest("states", "SELECT * FROM state");
	dbRequest("issues", "SELECT * FROM issue");

	setInterval(showIssues, 60*1000);
}


//downlaods the query and prepare all references (if neccesary)
function dbRequest(action, query){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	        if(action === "issues"){
	        	var jsonObj = JSON.parse(this.responseText);
	    		var length = Object.keys(jsonObj).length;

	        	for(var i = 0; i < length; i++){
	        		var temp = jsonObj[i];
	        		var topic;
	        		var priority;
	        		var state;

	        		for(var j = 0; j < topics.length; j++){
						if(temp.topic === topics[j].id){
							topic = topics[j];
						}
					}

					for(var j = 0; j < priorities.length; j++){
						if(temp.priority === priorities[j].id){
							priority = priorities[j];
						}
					}

					for(var j = 0; j < states.length; j++){
						if(temp.state === states[j].id){
							state = states[j];
						}
					}

	        		var issue = new Issue(temp.id, temp.title, temp.description, priority, topic, state, temp.created, temp.updated);
	        		issues.push(issue);					
	        	}

	        	showIssues();
	        } else if(action === "priorities"){
	        	var jsonObj = JSON.parse(this.responseText);
	    		var length = Object.keys(jsonObj).length;

	        	for(var i = 0; i < length; i++){
	        		var temp = jsonObj[i];

	        		var priority = new Priority(temp.priorityid, temp.type, temp.importance);
	        		priorities.push(priority);
	        	}
	        } else if(action === "topics"){
	        	var jsonObj = JSON.parse(this.responseText);
	    		var length = Object.keys(jsonObj).length;

	        	for(var i = 0; i < length; i++){
	        		var temp = jsonObj[i];

	        		var topic = new Topic(temp.topicid, temp.type, temp.orderid);
	        		topics.push(topic);
	        	}
	        } else if(action === "states"){
	        	var jsonObj = JSON.parse(this.responseText);
	    		var length = Object.keys(jsonObj).length;

	        	for(var i = 0; i < length; i++){
	        		var temp = jsonObj[i];

	        		var state = new State(temp.id, temp.type, temp.orderid);
	        		states.push(state);
	        	}
	        } else if(action === "insert") {
	        	lastid = parseInt(this.responseText);
	        } else {
	        	console.log("server_response: " +this.responseText); //debig responses
	        }
	    }
	};
	xmlhttp.open("POST", "php/request.php", false);
	xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xmlhttp.send("query="+query); 
}


//called every 60 seconds, in order to refresh the table fields 'created' and 'updated'
function showIssues(){
	document.getElementById("issueTable").innerHTML = '<div class="issue dark"><span class="id" onclick="orderBy(\'id\')">ID</span><span class="title">Title</span><span class="priority" onclick="orderBy(\'priority\')">Prority</span><span class="topic" onclick="orderBy(\'topic\')">Topic</span><span class="state" onclick="orderBy(\'state\')">State</span><span class="created" onclick="orderBy(\'created\')">Created</span><span class="updated" onclick="orderBy(\'updated\')">Updated</span></div>';	

	for(var i = 0; i < issues.length; i++){
		if(isIssueVisible(issues[i])){
			document.getElementById("issueTable").innerHTML += issues[i].toString();
		}
	}
}


//determines if an issue should be shown or hidden in the table view (called by showIssues())
function isIssueVisible(issue){
	if(searchText === ""){
		if(issue.state.orderid < 999){
			return true;
		}
	} else {
		if(issue.title.includes(searchText)){
			return true;
		} else if(issue.priority.type.includes(searchText)){
			return true;
		} else if(issue.topic.type.includes(searchText)){
			return true;
		} else if(("#" + issue.id).includes(searchText)){
			return true;
		} else if(issue.state.type.includes(searchText)){
			return true;
		}
	}

	return false;
}


//opens the panel for adding an issue, and prepares the select field
function addIssue() {
	document.getElementById("createIssue").classList.remove("hidden");
	document.getElementById("createIssue").classList.add("visible");

	document.getElementById("add_remove_issue_circle").classList.remove("green");
	document.getElementById("add_remove_issue_circle").classList.remove("orange");
	document.getElementById("add_remove_issue_circle").classList.add("orange");
	document.getElementById("add_remove_issue_image").src = "res/hook.png";

	document.getElementById("issueTable").classList.add("short");

	document.getElementById("input_issue_title").value = "";
	document.getElementById("input_issue_description").value = "";

	var highestid = 0;
	for(var i = 0; i < issues.length; i++){
		if(issues[i].id > highestid){
			highestid = issues[i].id;
		}
	}

	document.getElementById("createIssueTitle").innerHTML = "Add Issue (#" + (parseInt(highestid) + 1) + ")";


	document.getElementById("selectPriority").innerHTML = "";
	for(var i = 0; i < priorities.length; i++){
		if(priorities[i].importance != -1) document.getElementById("selectPriority").innerHTML += '<option value="' + priorities[i].id + '">' + priorities[i].type + '</option>';
	}

	document.getElementById("selectTopic").innerHTML = "";
	for(var i = 0; i < topics.length; i++){
		if(topics[i].orderid != -1) document.getElementById("selectTopic").innerHTML += '<option value="' + topics[i].id + '">' + topics[i].type + '</option>';
	}

	document.getElementById("selectState").innerHTML = "";
	for(var i = 0; i < states.length; i++){
		if(states[i].orderid != -1) document.getElementById("selectState").innerHTML += '<option value="' + states[i].id + '">' + states[i].type + '</option>';
	}

	document.getElementById("add_remove_issue_link").onclick = onIssueAdd;
}


//get the data from input fields, and insert them into the database
function onIssueAdd(){
	var priority;
	var topic;
	var state;

	var select = document.getElementById("selectPriority");
	var selectedText = select.options[select.selectedIndex].text;
	for(var i = 0; i < priorities.length; i++){
		if(priorities[i].type === selectedText){
			priority = priorities[i];
			break;
		}
	}

	var select = document.getElementById("selectTopic");
	var selectedText = select.options[select.selectedIndex].text;
	for(var i = 0; i < topics.length; i++){
		if(topics[i].type === selectedText){
			topic = topics[i];
			break;
		}
	}

	var select = document.getElementById("selectState");
	var selectedText = select.options[select.selectedIndex].text;
	for(var i = 0; i < states.length; i++){
		if(states[i].type === selectedText){
			state = states[i];
			break;
		}
	}

	var issue = new Issue(issues.length+1, document.getElementById("input_issue_title").value, document.getElementById("input_issue_description").value, priority, topic, state, Date.now(), Date.now());
	issues.push(issue);


	document.getElementById("createIssue").classList.remove("visible");
	document.getElementById("createIssue").classList.add("hidden");

	document.getElementById("add_remove_issue_circle").classList.remove("red");
	document.getElementById("add_remove_issue_circle").classList.remove("orange");
	document.getElementById("add_remove_issue_circle").classList.add("green");
	document.getElementById("add_remove_issue_image").src = "res/plus.png";

	document.getElementById("issueTable").classList.remove("short");
	document.getElementById("add_remove_issue_link").onclick = addIssue;

	dbRequest("insert", "INSERT INTO issue (title, description, priority, topic, state, created, updated) VALUES ('" + issue.title + "', '" + issue.description + "', " + issue.priority.id + ", " + issue.topic.id + ", " + issue.state.id + ", " + issue.created + ", " + issue.updated + ")");
	issue.id = lastid;

	showIssues();
}


//opens the issueDetails panel and show the current issue. Also prepare the select fields
function showIssueDetails(issueId){
	var issue;
	for(var i = 0; i < issues.length; i++){
		if(issues[i].id == issueId){
			issue = issues[i];
			break;
		}
	}

	currentShowIssue = issue;

	document.getElementById("showIssue").classList.remove("hidden");
	document.getElementById("showIssue").classList.add("visible");

	document.getElementById("add_remove_issue_circle").classList.remove("green");
	document.getElementById("add_remove_issue_circle").classList.remove("red");
	document.getElementById("add_remove_issue_circle").classList.add("orange");
	document.getElementById("add_remove_issue_image").src = "res/hook.png";

	document.getElementById("issueTable").classList.remove("short");
	document.getElementById("add_remove_issue_link").onclick = updateIssue;

	document.getElementById("showIssueTitle").innerHTML = issue.title + " (#" + issue.id + ")";
	document.getElementById("issueDscription").innerHTML = issue.description;

	document.getElementById("issueDscription").innerHTML = document.getElementById("issueDscription").innerHTML.replace(new RegExp('\n', 'g'), "<br>")

	document.getElementById("showIssue_selectPriority").innerHTML = "";
	for(var i = 0; i < priorities.length; i++){
		if(priorities[i].id == issue.priority.id){
			document.getElementById("showIssue_selectPriority").innerHTML += '<option selected="true" value="' + priorities[i].id + '">' + priorities[i].type + '</option>';
		} else {
			if(priorities[i].importance != -1) document.getElementById("showIssue_selectPriority").innerHTML += '<option value="' + priorities[i].typide + '">' + priorities[i].type + '</option>';
		}
	}

	document.getElementById("showIssue_selectTopic").innerHTML = "";
	for(var i = 0; i < topics.length; i++){
		if(topics[i].id == issue.topic.id){
			document.getElementById("showIssue_selectTopic").innerHTML += '<option selected="true" value="' + topics[i].id + '">' + topics[i].type + '</option>';
		} else {
			if(topics[i].orderid != -1) document.getElementById("showIssue_selectTopic").innerHTML += '<option value="' + topics[i].id + '">' + topics[i].type + '</option>';
		}
	}

	document.getElementById("showIssue_selectState").innerHTML = "";
	for(var i = 0; i < states.length; i++){
		if(states[i].id == issue.state.id){
			document.getElementById("showIssue_selectState").innerHTML += '<option selected="true" value="' + states[i].id + '">' + states[i].type + '</option>';
		} else {
			if(states[i].orderid != -1) document.getElementById("showIssue_selectState").innerHTML += '<option value="' + states[i].id + '">' + states[i].type + '</option>';
		}
	}
}


//check if issue details have changed and upload changes to db.
function updateIssue(){
	document.getElementById("showIssue").classList.remove("visible");
	document.getElementById("showIssue").classList.add("hidden");

	document.getElementById("add_remove_issue_circle").classList.remove("orange");
	document.getElementById("add_remove_issue_circle").classList.remove("red");
	document.getElementById("add_remove_issue_circle").classList.add("green");
	document.getElementById("add_remove_issue_image").src = "res/plus.png";

	document.getElementById("issueTable").classList.remove("short");
	document.getElementById("add_remove_issue_link").onclick = addIssue;

	var hasChanged = false;

	var select = document.getElementById("showIssue_selectPriority");
	var selectedText = select.options[select.selectedIndex].text;
	for(var i = 0; i < priorities.length; i++){
		if(priorities[i].type === selectedText && priorities[i].type !== currentShowIssue.priority.type){
			currentShowIssue.priority = priorities[i];
			hasChanged = true;
			break;
		}
	}

	var select = document.getElementById("showIssue_selectTopic");
	var selectedText = select.options[select.selectedIndex].text;
	for(var i = 0; i < topics.length; i++){
		if(topics[i].type === selectedText && topics[i].type !== currentShowIssue.topic.type){
			hasChanged = true;
			currentShowIssue.topic = topics[i];
			break;
		}
	}

	var select = document.getElementById("showIssue_selectState");
	var selectedText = select.options[select.selectedIndex].text;
	for(var i = 0; i < states.length; i++){
		if(states[i].type === selectedText && states[i].type !== currentShowIssue.state.type){
			hasChanged = true;
			currentShowIssue.state = states[i];
			break;
		}
	}

	if(hasChanged){
		currentShowIssue.updated = Date.now();
		dbRequest("update", "UPDATE issue SET priority=" + currentShowIssue.priority.id + ", topic=" + currentShowIssue.topic.id + ", state=" + currentShowIssue.state.id + ", updated=" + currentShowIssue.updated + " WHERE id="+currentShowIssue.id);
		showIssues();
	}

	currentShowIssue = null;
}


//order the function by the passed type, and update the view
function orderBy(type){
	if(type === "id"){
		for(var i = 0; i < issues.length - 1; i++){
			for(var j = 0; j < issues.length - 1; j++){
				if(orderDescending && parseInt(issues[j].id) < parseInt(issues[j + 1].id)){
					var temp = issues[j];
					issues[j] = issues[j + 1];
					issues[j + 1] = temp;
				} else if(!orderDescending && parseInt(issues[j].id) > parseInt(issues[j + 1].id)){
					var temp = issues[j];
					issues[j] = issues[j + 1];
					issues[j + 1] = temp;
				}
			}
		}
	} else if(type === "created"){
		for(var i = 0; i < issues.length - 1; i++){
			for(var j = 0; j < issues.length - 1; j++){
				if(orderDescending && parseInt(issues[j].created) < parseInt(issues[j + 1].created)){
					var temp = issues[j];
					issues[j] = issues[j + 1];
					issues[j + 1] = temp;
				} else if(!orderDescending && parseInt(issues[j].created) > parseInt(issues[j + 1].created)){
					var temp = issues[j];
					issues[j] = issues[j + 1];
					issues[j + 1] = temp;
				}
			}
		}
	} else if(type === "updated"){
		for(var i = 0; i < issues.length - 1; i++){
			for(var j = 0; j < issues.length - 1; j++){
				if(orderDescending && parseInt(issues[j].updated) < parseInt(issues[j + 1].updated)){
					var temp = issues[j];
					issues[j] = issues[j + 1];
					issues[j + 1] = temp;
				} else if(!orderDescending && parseInt(issues[j].updated) > parseInt(issues[j + 1].updated)){
					var temp = issues[j];
					issues[j] = issues[j + 1];
					issues[j + 1] = temp;
				}
			}
		}
	} else if(type === "topic"){
		for(var i = 0; i < issues.length - 1; i++){
			for(var j = 0; j < issues.length - 1; j++){
				if(orderDescending && parseInt(issues[j].topic.orderid) < parseInt(issues[j + 1].topic.orderid)){
					var temp = issues[j];
					issues[j] = issues[j + 1];
					issues[j + 1] = temp;
				} else if(!orderDescending && parseInt(issues[j].topic.orderid) > parseInt(issues[j + 1].topic.orderid)){
					var temp = issues[j];
					issues[j] = issues[j + 1];
					issues[j + 1] = temp;
				}
			}
		}
	} else if(type === "priority"){
		for(var i = 0; i < issues.length - 1; i++){
			for(var j = 0; j < issues.length - 1; j++){
				if(orderDescending && parseInt(issues[j].priority.importance) < parseInt(issues[j + 1].priority.importance)){
					var temp = issues[j];
					issues[j] = issues[j + 1];
					issues[j + 1] = temp;
				} else if(!orderDescending && parseInt(issues[j].priority.importance) > parseInt(issues[j + 1].priority.importance)){
					var temp = issues[j];
					issues[j] = issues[j + 1];
					issues[j + 1] = temp;
				}
			}
		}
	} else if(type === "state"){
		for(var i = 0; i < issues.length - 1; i++){
			for(var j = 0; j < issues.length - 1; j++){
				if(orderDescending && parseInt(issues[j].state.orderid) < parseInt(issues[j + 1].state.orderid)){
					var temp = issues[j];
					issues[j] = issues[j + 1];
					issues[j + 1] = temp;
				} else if(!orderDescending && parseInt(issues[j].state.orderid) > parseInt(issues[j + 1].state.orderid)){
					var temp = issues[j];
					issues[j] = issues[j + 1];
					issues[j + 1] = temp;
				}
			}
		}
	}

	showIssues();
	orderDescending = !orderDescending;
}


//save the text of the searchbar in a local variable and update the view
function searchBarChange(){
	searchText = document.getElementById("input_search").value;
	showIssues();
}