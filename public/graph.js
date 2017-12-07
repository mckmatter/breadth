/*
graph.js

This contains the Graph Class
referenced by main.js

This file uses open-sourced framework CytoscapeJS
js.cytoscape.org

Dylan McKenna
Fawaz Albetar
ENGR4450-A
Fall 2017
*/

//Define Class Graph using JavaScript Function Notation
function Graph(){

	this.startNodeID = null;
	this.endNodeID = null;
	this.orderVisited = 1;
	this.distance = 0;
	this.found = false;
	this.path = [];

	//Graph object to be exported from cytoscape
	this.graph = {};

	//Visited and Queue Arrays
	this.v = [];
	this.q = [];

	//attributes for use by incrementBFS Function
	this.currentNode = {};
	this.currentEdge = {};

	//Cytoscape Object
	this.cy = {};

	//Options for initializing Cytoscape Graphs
	this.initialOptions = {
		container: document.getElementById('cy'),
    	boxSelectionEnabled: false,
    	autounselectify: true,
    	zoomingEnabled: true,
	    userZoomingEnabled: false,
	    panningEnabled: true,
	    userPanningEnabled: false
	};

}//End Graph Class Definition

//Set Start and End Node Functions
Graph.prototype.setStartNode = function(passStartNodeID) {
	this.startNodeID = passStartNodeID;
}

Graph.prototype.setEndNode = function(passEndNodeID) {
	this.endNodeID = passEndNodeID;
}


//Setup and Start BFS Algorithm -> Calls incrementBFS
Graph.prototype.startBFS = function() {
	
	console.log("Starting Algorithm...");

	//Setup BFS with loop through nodes array
	var i, n = this.graph.elements.nodes.length;
    for(i=0; i<n; ++i){
    	//Set default data within Visited Array
    	//ID(int), Visited(Boolean), orderVisited(int)
    	this.v[i] = [this.graph.elements.nodes[i].data.id, false, 0];
    	//Set  the parent of each node to null
    	this.graph.elements.nodes[i].data.parent = null;
    	//Set the distance from startNode on each node to 0
    	this.graph.elements.nodes[i].data.distance = this.distance;
    };//End Create Visited Array

    //Render the visited array to the DOM
    this.renderVisited();

    //Push the first node into the queue
    this.pushNodeByID(this.startNodeID);

    //Render the Queue Array to the DOM
    this.renderQueue();

    console.log("Start Node: " + this.startNodeID);
    console.log("End Node: " + this.endNodeID);

    //Begin Incremental BFS Algorithm
    this.incrementBFS(this);

}//End Start BFS

Graph.prototype.incrementBFS = function(parent) {

	//Save the algorithm function as a variable for setTimeout
	var increment = function() {

		
		var done = false;

		//Pop the first node from the queue and render the queue
		parent.currentNode = parent.q.shift();
		console.log("Popping Node: " + parent.currentNode.data.id);
		parent.renderQueue();

		//Set the currentNode as Visited
		parent.setVisited();
		parent.renderVisited();

		//Highlight the currentNode
		parent.cy.getElementById(parent.currentNode.data.id).addClass('highlighted');

		//if the currentNode is endNode - we're done - calculate path
		if(parent.currentNode.data.id == parent.endNodeID) {
			console.log("CurrentNode=EndNode");
			parent.renderPath();
			done=true;
		}
		//else - add children of currentNode to queue
		else {
			//any nodes we find here will have a distance of currentNode.distance+1
			parent.distance++;

			//To find children of currentNode, loop through edges
			var i, n = parent.graph.elements.edges.length;
			for(i=0; i<n; ++i) {
				parent.currentEdge = parent.graph.elements.edges[i];
				//For every edge, see if it's source is the currentNode
				if(parent.currentEdge.data.source == parent.currentNode.data.id) {
					//The target of the currentEdge is a child of currentNode
					//Check to see if this childNode has already been visited
					if(!parent.getVisited()){

						//Push the Child node to the Queue
						parent.pushNodeByID(parent.currentEdge.data.target);

						//Set the Parent of the child node to the current node
						parent.getNodeByID(parent.currentEdge.data.target).data.parent = parent.currentNode.data.id;

						//Render the changes to the DOM
						parent.renderQueue();
					}
				}

			}//End edges loop
		}//End else

		//if there is something in the queue, incrementBFS again
		if(parent.q.length!=0 && parent.found==false) {
			setTimeout(increment, 2000);
		}
		//else - Done or No Path
		else {
			if(done){
				console.log("DONE=TRUE");
			}
			else {
				console.log("DONE=FALSE");
				parent.noPath();
			}
		}
	}//End increment

	//Kickoff First Increment after 1 second
	setTimeout(increment, 1000);

}//End incrementBFS

Graph.prototype.getVisited = function() {
	var i, n = this.v.length;
    for(i=0; i<n; ++i) {
      if(this.v[i][0]==this.currentEdge.data.target) {
        return this.v[i][1];
      }
    }
}//End getVisited

Graph.prototype.setVisited = function() {
	var i, n = this.v.length;
    for(i=0; i<n; ++i) {
      if(this.v[i][0]==this.currentNode.data.id) {
        this.v[i][1]=true;
        this.v[i][2]=this.orderVisited;
      }
    }
    this.orderVisited++;
}//End setVisited

Graph.prototype.pushNodeByID = function(id) {
	console.log("Pushing Node: " + id);
	this.q.push(this.getNodeByID(id));
}//END pushNodeByID

Graph.prototype.getNodeByID = function(id) {
	var i, n = this.graph.elements.nodes.length;
	for(i=0; i<n; ++i) {
		if(this.graph.elements.nodes[i].data.id==id) {
			return this.graph.elements.nodes[i];
		}
	}
}//End getNodeByID

Graph.prototype.renderGraph = function(graphObject) {

	this.cy = cytoscape(this.initialOptions);

	this.cy.add(graphObject.elements)

	this.cy.style()
	        .selector('node')
	          .css({
	            'content': 'data(id)'
	          })
	        .selector('edge')
	          .css({
	            'curve-style': 'bezier',
	            'target-arrow-shape': 'triangle',
	            'width': 4,
	            'line-color': '#ddd',
	            'target-arrow-color': '#ddd'
	          })
	        .selector('.highlighted')
	          .css({
	            'background-color': '#61bffc',
	            'line-color': '#61bffc',
	            'target-arrow-color': '#61bffc',
	            'transition-property': 'background-color, line-color, target-arrow-color',
	            'transition-duration': '0.5s'
        		})
	        .update();

	this.cy.layout({
	        name: 'breadthfirst',
	        directed: true,
	        roots: '#a',
	        padding: 10
      	}).run();

	//Export Graph for BFS Data
	this.graph = this.cy.json();

	var html = "";

    var i, n = this.graph.elements.nodes.length;
    for(i=0; i<n; ++i){
      var id = this.graph.elements.nodes[i].data.id;
      html+=id + "<option value=\"" + id + "\">" + id + "</option>";
    }

    //Render the Select Option Elements
    $("select.startSelect").empty();
    $("select.startSelect").append(html);

    $("select.endSelect").empty();
    $("select.endSelect").append(html);
}//End renderGraph

Graph.prototype.renderQueue = function() {
	var html = "<tr>"

    for(var i=0; i<this.q.length; ++i) {
      html+="<tr><td>" + this.q[i].data.id + "</td></tr>"
    }

    $("tbody.queue").empty();
    $("tbody.queue").append(html);
}//END renderQueue

Graph.prototype.renderVisited = function() {

	var html = "<tr>"

    for(var i=0; i<this.v.length; ++i) {
      html+="<tr><td>";
      html+=this.v[i][0];
      html+="</td><td>"
      html+=this.v[i][1];
      html+="</td><td>";
      html+=this.v[i][2];
      html+="</td></tr>"
    }
    //console.log(html);
    $("tbody.visited").empty();
    $("tbody.visited").append(html);
}//End renderVisited

Graph.prototype.renderPath = function() {
	console.log("renderPath");
	this.found = true;

	this.path.unshift(this.currentNode.data.id);
	var html = "";

	while(this.currentNode.data.parent != null) {
		this.currentNode = this.getNodeByID(this.currentNode.data.parent);
		this.path.unshift(this.currentNode.data.id);
	}

	//String together HTML of Path
	html+=this.path[0];
	for(var i = 1; i<this.path.length; ++i){
		html+=" - " + this.path[i];
	}

	//Highlight Path on Graph
	for(var i = 0; i<this.path.length-1; ++i){
		var edgeID = this.path[i] + this.path[i+1];
		this.cy.getElementById(edgeID).addClass('highlighted');
	}

	$(".path").empty();
	$(".path").append(html);
}//END renderPath

Graph.prototype.noPath = function() {
	$(".path").empty();
	$(".path").append("<p class=\"warn\">No Path</p>");
}



