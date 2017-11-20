/*

Breadth First Search Visualization

Client Side Javascript

ENGR4950
Fawaz Alebtar
Dylan McKenna
*/


$(document).ready(function() {
  console.log("Document Ready");

  //Global object for cytoscape graph
  var cy = {};

  //Global object for graph object
  var graph = {};

  //Global array for queue
  var q = [];

  //Global array for visited
  var v = [];

  //Graph 1 Click Function
  $("#graph1").on("click", function() {
    $("#cy").empty();
    graph1();
    this.blur();
    graph = cy.json();
    startBFS(graph);
  })//End Graph 1 Click

  //Graph 2 Click Function
  $("#graph2").on("click", function() {
    $("#cy").empty();
    this.blur();
    graph = cy.json();
    startBFS(graph);
  })//End Graph 2 Click


  //Initialize Graph 1
  function graph1() {
    cy = cytoscape({
    
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
    
    });  
  }//End Initialize Graph 1

  //Breadth First Search Function
  function startBFS(graph) {

    console.log(graph);

    //cy.getElementById('a').addClass('highlighted');


    //Create Visited Array and set all to False
    var i, n = graph.elements.nodes.length;
    for(i = 0; i<n; ++i){
      console.log("i: " + i);
      v[i] = [graph.elements.nodes[i].data.id, false];
    };//End Create Visited Array
    console.log(v);

    //Show Visited Array
    renderVisited(v);

    //Push the first element into the queue
    q.push(graph.elements.nodes[0])

    //While there is something in the queue
    while(q.length>0) {

      //Remove and Return the first node in the queue
      var currentNode = q.shift();
      //Set the currentNode as Visited
      setVisited(currentNode.data.id)
      renderVisited();
      cy.getElementById(currentNode.data.id).addClass('highlighted');

      //Highlight the current Node
      //currentNode.addClass('highlighted');

      //Get edges where the source = currentNode
      var i, n = graph.elements.edges.length;
      for(i=0; i<n; ++i) {
        if(graph.elements.edges[i].data.source == currentNode.data.id){
          console.log("source=currentNode");
          //Check to see if the target has been visited
          //If it has not, add it to the queue
          if(!getVisited(graph.elements.edges[i].data.target)){
            console.log("addNode");
            addNode(graph.elements.edges[i].data.target);
          }
        }
      }//End Edge Loop

    }//End While

  }//End startBFS

  //Helper Function for adding Node Object to queue by id
  function addNode(id) {
    var i, n = graph.elements.nodes.length;
    for(i=0; i<n; ++i){
      if(graph.elements.nodes[i].data.id==id) {
        q.push(graph.elements.nodes[i])
      }
    }
  }//End addNode

  //Helper Function for setting a node
  //as visited in the visited array
  function setVisited(id) {
    var i, n = v.length;
    for(i=0; i<n; ++i) {
      if(v[i][0]==id) {
        v[i][1]=true;
      }
    }
  }//End setVisited

  //Check to see if Node is visited
  function getVisited(id) {
    console.log("getVisited");
    var i, n = v.length;
    for(i=0; i<n; ++i) {
      if(v[i][0]==id) {
         console.log("getVisited-nodeMatch ")
        return v[i][1];
      }
    }

  }//End getVisited

  //Append Visited Table to DOM
  function renderVisited() {
    var html = "<tr>"

    for(var i = 0; i<v.length; ++i) {
      html+="<tr><td>";
      html+=v[i][0];
      html+="</td><td>"
      html+=v[i][1];
      html+="</td></tr>";
    }
    console.log(html);
    $("tbody.visited").empty();
    $("tbody.visited").append(html);
  }//End renderVisited

  //Append Queue Table to DOM
  function renderQueue() {

  }//End renderQueue

})//End Document Ready

