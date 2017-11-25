
function Graph(graphID){
	//Variable for graphID
	this.graphID = graphID;
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
	this.currentNode = {};
	this.currentEdge = {};

	//Cytoscape Object
	this.cy = {};

	//Graphs array to store unrendered graph objects
	this.graphs = [];

	this.graphs[0] = {

		container: document.getElementById('cy'),

    	boxSelectionEnabled: false,
    	autounselectify: true,
    	zoomingEnabled: true,
	    userZoomingEnabled: false,
	    panningEnabled: true,
	    userPanningEnabled: false,

    	style: cytoscape.stylesheet()
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
        }),

    	elements: {
          nodes: [
            { data: { id: 'a' } },
            { data: { id: 'b' } },
            { data: { id: 'c' } },
            { data: { id: 'd' } },
            { data: { id: 'e' } }
          ],

          edges: [
            { data: { id: 'a"e', weight: 1, source: 'a', target: 'e' } },
            { data: { id: 'ab', weight: 3, source: 'a', target: 'b' } },
            { data: { id: 'be', weight: 4, source: 'b', target: 'e' } },
            { data: { id: 'bc', weight: 5, source: 'b', target: 'c' } },
            { data: { id: 'ce', weight: 6, source: 'c', target: 'e' } },
            { data: { id: 'cd', weight: 2, source: 'c', target: 'd' } },
            { data: { id: 'de', weight: 7, source: 'd', target: 'e' } }
          ]
        },


    	layout: {
	        name: 'breadthfirst',
	        directed: true,
	        roots: '#a',
	        padding: 10
      	}
	}//End graphs[0] Object definition

	this.graphs[1] = {

		container: document.getElementById('cy'),

    	boxSelectionEnabled: false,
    	autounselectify: true,
    	zoomingEnabled: true,
	    userZoomingEnabled: false,
	    panningEnabled: true,
	    userPanningEnabled: false,

    	style: cytoscape.stylesheet()
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
        }),

    	elements: {
          nodes: [
            { data: { id: 'a' } },
            { data: { id: 'b' } },
            { data: { id: 'c' } },
            { data: { id: 'd' } },
            { data: { id: 'e' } },
            { data: { id: 'f' } }
          ],

          edges: [
            { data: { id: 'a"e', weight: 1, source: 'a', target: 'e' } },
            { data: { id: 'ab', weight: 3, source: 'a', target: 'b' } },
            { data: { id: 'be', weight: 4, source: 'b', target: 'e' } },
            { data: { id: 'bc', weight: 5, source: 'b', target: 'c' } },
            { data: { id: 'ce', weight: 6, source: 'c', target: 'e' } },
            { data: { id: 'cd', weight: 2, source: 'c', target: 'd' } },
            { data: { id: 'de', weight: 7, source: 'd', target: 'e' } },
            { data: { id: 'ef', weight: 8, source: 'e', target: 'f' } }
          ]
        },


    	layout: {
	        name: 'breadthfirst',
	        directed: true,
	        roots: '#a',
	        padding: 10
      	}
	}//End graphs[1] Object definition

}//End Graph Class Definition

Graph.prototype.setStartNode = function(passStartNodeID) {
	this.startNodeID = passStartNodeID;
}

Graph.prototype.setEndNode = function(passEndNodeID) {
	this.endNodeID = passEndNodeID;
}

Graph.prototype.startBFS = function() {
	
	//Setup BFS with loop through nodes array
	var i, n = this.graph.elements.nodes.length;
    for(i = 0; i<n; ++i){
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

	var increment = function() {
		console.log("Incrementing BFS...");
		console.log(parent.q);

		//Pop the first node from the queue and render the queue
		parent.currentNode = parent.q.shift();
		parent.renderQueue();

		//Set the currentNode as Visited
		parent.setVisited();
		parent.renderVisited();

		//Highlight the currentNode
		parent.cy.getElementById(parent.currentNode.data.id).addClass('highlighted');

		//if the currentNode is endNode - we're done - calculate path
		if(parent.currentNode.data.id == parent.endNodeID) {
			parent.renderPath();
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
					//If it has not, add it to the queue
					if(!parent.getVisited()){
						parent.pushNodeByID(parent.currentEdge.data.target);
						parent.getNodeByID(parent.currentEdge.data.target).data.parent = parent.currentNode.data.id;
						parent.renderQueue();
					}
				}
			}//End edges loop
		}//End else

		//if there is something in the queue, incrementBFS again
		if(parent.q.length!=0 && parent.found==false) {
			setTimeout(increment, 2000);
		}
	}//End increment

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
	console.log("Pushing Node:" + id);
	console.log(this.q);
	this.q.push(this.getNodeByID(id));
	//this.getNodeByID(id).data.parent = source;
}

Graph.prototype.getNodeByID = function(id) {
	var i, n = this.graph.elements.nodes.length;
	for(i=0; i<n; ++i) {
		if(this.graph.elements.nodes[i].data.id==id) {
			return this.graph.elements.nodes[i];
		}
	}
}//End getNodeByID

Graph.prototype.renderGraph = function() {
	this.cy = cytoscape(this.graphs[this.graphID]);
	
	this.graph = this.cy.json();

	var html = "";

    var i, n = this.graph.elements.nodes.length;
    for(i=0; i<n; ++i){
      var id = this.graph.elements.nodes[i].data.id;
      html+=id + "<option value=\"" + id + "\">" + id + "</option>";
    }

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
}

Graph.prototype.renderVisited = function() {
	console.log("Appending Visited Array...");
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

	console.log(this.currentNode);

	this.path.unshift(this.currentNode.data.id);
	var html = "";

	while(this.currentNode.data.parent != null) {
		this.currentNode = this.getNodeByID(this.currentNode.data.parent);
		this.path.unshift(this.currentNode.data.id);
	}

	html+=this.path[0];

	for(var i = 1; i<this.path.length; ++i){
		html+=" - " + this.path[i];
	}

	console.log(this.path);
	$(".path").empty();
	$(".path").append(html);

}



