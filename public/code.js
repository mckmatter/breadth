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

  //Graph 1 Click Function
  $("#graph1").on("click", function() {
    $("#cy").empty();
    graph1();
    this.blur();
    var graph = cy.json();
    prepBFS(graph);
  })//End Graph 1 Click

  //Graph 2 Click Function
  $("#graph2").on("click", function() {
    $("#cy").empty();
    graph1();
    this.blur();

    var graph = cy.json();
    //prepBFS();
    console.log(graph);
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

  function prepBFS(graph) {

    var v = [];
    var q = [];

    //Create Visited Array and set all to False
    var i, n = graph.elements.nodes.length;
    for(i = 0; i<n; ++i){
      console.log("i: " + i);
      v[i] = [graph.elements.nodes[i].data.id, false];
    };//End Create Visited Array
    console.log("Created Visited Array");

    //Show Visited Array
    renderVisited(v);


    //Push the first element into the queue
    q.push(graph.elements.nodes[0]);
    renderQueue(q);
    console.log("Push First Node: " + graph.elements.nodes[0].data.id);

    console.log("prepBFS > runBFS");

    runBFS(graph, q, v);

  }

  //Breadth First Search Function
  function runBFS(graph, q, v) {

    var incrementBFS = function() {

      //Remove and Return the first node in the queue
      console.log(q);
      var currentNode = q.shift();
      renderQueue(q);
      console.log("q.shift: " + currentNode.data.id);

      //Set the currentNode as Visited
      v = setVisited(currentNode.data.id, v)
      //console.log("");

      //Display the Visitor array on the page
      renderVisited(v);

      //Highlight the current node
      cy.getElementById(currentNode.data.id).addClass('highlighted');


      //Get edges where the source = currentNode
      var i, n = graph.elements.edges.length;
      for(i=0; i<n; ++i) {
        var currentEdge = graph.elements.edges[i];
        if(currentEdge.data.source == currentNode.data.id){
          console.log("source=currentNode: " + currentEdge.data.source);
          var currentTarget = graph.elements.edges[i].data.target;
          //console.log(currentTarget);
          //Check to see if the target has been visited
          //If it has not, add it to the queue
          if(!getVisited(currentTarget, v)){
            console.log("addNode: " + currentTarget);
            q = addNode(graph, currentTarget, q);
          }
        }
      }//End Edge Loop

      if(q.length!=0) {
        console.log(q.length);
        setTimeout(incrementBFS, 2000);
      }

    }//End incrementBFS

    //Kick Off First Increment
    setTimeout(incrementBFS, 1000);   

  }//End runBFS

  

  //Helper Function for adding Node Object to queue by id
  function addNode(graph, id, q) {
    //console.log("addNode");
    var i, n = graph.elements.nodes.length;
    for(i=0; i<n; ++i){
      if(graph.elements.nodes[i].data.id==id) {
        q.push(graph.elements.nodes[i]);
      }
    }
    renderQueue(q);
    return q;
  }//End addNode

  //Helper Function for setting a node
  //as visited in the visited array
  function setVisited(id, v) {
    var i, n = v.length;
    for(i=0; i<n; ++i) {
      if(v[i][0]==id) {
        v[i][1]=true;
      }
    }

    return v;
  }//End setVisited

  //Check to see if Node is visited
  function getVisited(id, v) {
    //console.log("getVisited");
    var i, n = v.length;
    for(i=0; i<n; ++i) {
      if(v[i][0]==id) {
         //console.log("getVisited-nodeMatch ")
        return v[i][1];
      }
    }

  }//End getVisited

  //Append Visited Table to DOM
  function renderVisited(v) {
    var html = "<tr>"

    for(var i=0; i<v.length; ++i) {
      html+="<tr><td>";
      html+=v[i][0];
      html+="</td><td>"
      html+=v[i][1];
      html+="</td></tr>";
    }
    //console.log(html);
    $("tbody.visited").empty();
    $("tbody.visited").append(html);
  }//End renderVisited

  //Append Queue Table to DOM
  function renderQueue(q) {

    var html = "<tr>"

    for(var i=0; i<q.length; ++i) {
      html+="<tr><td>" + q[i].data.id + "</td></tr>"
    }

    $("tbody.queue").empty();
    $("tbody.queue").append(html);

  }//End renderQueue

})//End Document Ready

