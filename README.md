darwin-d3
=========

# Performance improvements

## Caching
Both the JSON data itself and the resulting period data can be cached in memory for faster retrieval. The period data is
shared across all graphs, but is currently recalculated per graph (re-)render.

## Scope pollution
Several functions and variables can be placed inside a normal function or variable instead of adding them to the scope.
Adding them to the scope might cause additional overhead because of AngularJS' $watch mechanics.

## Initializing graphs
Currently, the period data gets retrieved (*n* * 2) times where *n* is the amount of graphs. This is because of AngularJS'
$watch event firing on app load too. This can be avoided by adding an initialized flag that gets set when the initial graph
is rendered, preventing the graph from being rendered via the $watch method too when the app loads.
