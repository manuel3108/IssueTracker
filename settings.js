//opens the settings panel
function showSettings() {
	document.getElementById("settings").classList.remove("hidden");
	document.getElementById("settings").classList.add("visible");

	document.getElementById("add_remove_issue_circle").classList.remove("green");
	document.getElementById("add_remove_issue_circle").classList.remove("red");
	document.getElementById("add_remove_issue_circle").classList.add("orange");
	document.getElementById("add_remove_issue_image").src = "res/hook.png";
	document.getElementById("add_remove_issue_link").onclick = saveAndClose;

	document.getElementById("footer_settings_link").onclick = saveAndClose;

	drawSettings();
}


//draw all the settings, because of a change
function drawSettings(){
	document.getElementById("settings_left").innerHTML = '<span class="title">Topics</span><div class="content">';
	for(var i = 0; i < topics.length; i++){
		if(topics[i].orderid != -1) document.getElementById("settings_left").innerHTML += '<a href="#" onclick="deleteTopic(' + topics[i].id + ')"><div class="issue red">' + topics[i].type + '</div></a>';
	}
	document.getElementById("settings_left").innerHTML += '<input id="input_new_topic" type="text" placeholder="Enter new Topic"><input id="input_new_topic_orderid" type="number" value="0"><a href="#" onclick="onTopicAdd();"><span class="issue green">Add</span></a></div>';

	document.getElementById("settings_center").innerHTML = '<span class="title">Priorities</span><div class="content">';
	for(var i = 0; i < priorities.length; i++){
		if(priorities[i].importance != -1) document.getElementById("settings_center").innerHTML += '<a href="#" onclick="deletePriority(' + priorities[i].id + ')"><div class="issue red">' + priorities[i].type + '</div></a>';
	}
	document.getElementById("settings_center").innerHTML += '<input id="input_new_priority" type="text" placeholder="Enter new Priority"><input id="input_new_priority_orderid" type="number" value="0"><a href="#" onclick="onPriorityAdd();"><span class="issue green">Add</span></a></div>';

	document.getElementById("settings_right").innerHTML = '<span class="title">States</span><div class="content">';
	for(var i = 0; i < states.length; i++){
		if(states[i].orderid != -1) document.getElementById("settings_right").innerHTML += '<a href="#" onclick="deleteState(' + states[i].id + ')"><div class="issue red">' + states[i].type + '</div></a>';
	}
	document.getElementById("settings_right").innerHTML += '<input id="input_new_state" type="text" placeholder="Enter new State"><input id="input_new_state_orderid" type="number" value="0"><a href="#" onclick="onStateAdd();"><span class="issue green">Add</span></a></div>';
}


//close the settings panel
function saveAndClose(){
	document.getElementById("settings").classList.remove("visible");
	document.getElementById("settings").classList.add("hidden");

	document.getElementById("add_remove_issue_circle").classList.remove("red");
	document.getElementById("add_remove_issue_circle").classList.remove("orange");
	document.getElementById("add_remove_issue_circle").classList.add("green");
	document.getElementById("add_remove_issue_image").src = "res/plus.png";
	document.getElementById("add_remove_issue_link").onclick = addIssue;

	document.getElementById("footer_settings_link").onclick = showSettings;
}


//delete topic from database, and remove references in issues and update the issues to the database
function deleteTopic(id){
	var topic;
	var listIndex;

	for(var i = 0; i < topics.length; i++){
		if(topics[i].id == id){
			topic = topics[i];
			listIndex = i;
			break;
		}
	}
	topics.splice(listIndex, 1);

	drawSettings();

	dbRequest("delete", "DELETE FROM topic WHERE topicid="+topic.id);


	var undefTopic;
	for(var i = 0; i < topics.length; i++){
		if(topics[i].orderid == -1){
			undefTopic = topics[i];
			break;
		}
	}

	for(var i = 0; i < issues.length; i++){
		if(issues[i].topic.id == topic.id){
			issues[i].topic = undefTopic;
			dbRequest("update", "UPDATE issue SET topic=" + undefTopic.id + " WHERE id=" + issues[i].id);
		}
	}	

	showIssues();
}


//delete state from database, and remove references in issues and update the issues to the database
function deleteState(id){
	var state;
	var listIndex;

	for(var i = 0; i < states.length; i++){
		if(states[i].id == id){
			state = states[i];
			listIndex = i;
			break;
		}
	}
	states.splice(listIndex, 1);

	drawSettings();

	dbRequest("delete", "DELETE FROM state WHERE id="+state.id);


	var undefState;
	for(var i = 0; i < states.length; i++){
		if(states[i].orderid == -1){
			undefState = states[i];
			break;
		}
	}

	for(var i = 0; i < issues.length; i++){
		if(issues[i].state.id == state.id){
			issues[i].state = undefState;
			dbRequest("update", "UPDATE issue SET state=" + undefState.id + " WHERE id=" + issues[i].id);
		}
	}	

	showIssues();
}


//delete priority from database, and remove references in issues and update the issues to the database
function deletePriority(id){
	var priority;
	var listIndex;

	for(var i = 0; i < priorities.length; i++){
		if(priorities[i].id == id){
			priority = priorities[i];
			listIndex = i;
			break;
		}
	}
	priorities.splice(listIndex, 1);

	drawSettings();

	dbRequest("delete", "DELETE FROM priority WHERE priorityid="+priority.id);


	var undefPriority;
	for(var i = 0; i < priorities.length; i++){
		if(priorities[i].importance == -1){
			undefPriority = priorities[i];
			break;
		}
	}

	for(var i = 0; i < issues.length; i++){
		if(issues[i].priority.id == priority.id){
			issues[i].priority = undefPriority;
			dbRequest("update", "UPDATE issue SET priority=" + undefPriority.id + " WHERE id=" + issues[i].id);
		}
	}	

	showIssues();
}


//create a new topic with given data and update the database
function onTopicAdd(){
	var highestid = 0;

	for(var i = 0; i < topics.length; i++){
		if(topics[i].id > highestid){
			highestid = topics[i].id;
		}
	}

	var topic = new Topic(highestid + 1, document.getElementById("input_new_topic").value, document.getElementById("input_new_topic_orderid").value);
	topics.push(topic);

	dbRequest("insert", "INSERT INTO topic (type, orderid) VALUES ('" + topic.type + "', " + topic.orderid + ")");

	drawSettings();
}


//create a new priority with given data and update the database
function onPriorityAdd(){
	var highestid = 0;

	for(var i = 0; i < priorities.length; i++){
		if(priorities[i].id > highestid){
			highestid = priorities[i].id;
		}
	}

	var priority = new Priority(highestid + 1, document.getElementById("input_new_priority").value, document.getElementById("input_new_priority_orderid").value);
	priorities.push(priority);

	dbRequest("insert", "INSERT INTO priority (type, importance) VALUES ('" + priority.type + "', " + priority.importance + ")");

	drawSettings();
}


//create a new state with given data and update the database
function onStateAdd(){
	var highestid = 0;

	for(var i = 0; i < states.length; i++){
		if(states[i].id > highestid){
			highestid = states[i].id;
		}
	}

	var state = new State(highestid + 1, document.getElementById("input_new_state").value, document.getElementById("input_new_state_orderid").value);
	states.push(state);

	dbRequest("insert", "INSERT INTO state (type, orderid) VALUES ('" + state.type + "', " + state.orderid + ")");

	drawSettings();
}