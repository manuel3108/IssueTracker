//saves all the data needed for the app
function Issue(id, title, description, priority, topic, state, created, updated) {
	this.id = id;
	this.title = title;
	this.description = description;
	this.priority = priority;
	this.topic = topic;
	this.state = state;
	this.created = created;
	this.updated = updated;

	this.selfContainer = this;

	this.toString = function() {
		return '<a href="#" onclick="showIssueDetails(\'' + this.id + '\')"><div class="issue"><span class="id">#' + this.id + '</span><span class="title">' + this.title + '</span><span class="priority">' + this.priority.type + '</span><span class="topic">' + this.topic.type + '</span><span class="state">' + this.state.type + '</span><span class="created">' + getDateAgo(this.created) + '</span><span class="updated">' + getDateAgo(this.updated) + '</span></div></a>';
	}
}

function Priority(id, type, importance){
	this.id = id;
	this.type = type;
	this.importance = importance;
}

function Topic(id, type, orderid){
	this.id = id;
	this.type = type;
	this.orderid = orderid;
}

function State(id, type, orderid){
	this.id = id;
	this.type = type;
	this.orderid = orderid;
}




//converts a given timestamp into a human-readable string
function getDateAgo(time){
	var out = "";
	var currentDate = Date.now()*1000;
	var date = new Date(time*1000);

	var diff = (currentDate - date);

	if(Math.floor(diff/1000/24/60) < 60){
		out +=  "seconds ago";
	} else if(Math.floor(diff/1000/24/60/60) < 60){
		out +=  Math.floor(diff/1000/24/60/60) + " minute(s) ago";
	} else if(Math.floor(diff/1000/24/60/60/24) < 24){
		out +=  Math.floor(diff/1000/24/60/60/24) + " houre(s) ago";
	} else{
		out +=  (Math.floor(diff/1000/24/60/60/24/24)) + " day(s) ago";
	}

	return out;
}