///////////// MAIN CHART SVG AREAS//////////////////

var margin = { top: 20, right: 100, bottom: 20, left: 5 },
    width = 350 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

//create left side svg
var svgNo = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "svgNo")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
//create right side svg
var svgYes = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "svgYes")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

///////////////////CHART LABELS///////////////////////////

//create text "Votes Against"
var chartLabelLeft = d3.select("#chartLabelBottom")
    .append("svg")
    .attr("width", 90)
    .attr("height", 25)
    .attr("class", "chartLabels") //left margin
    .append("g")
    .attr("id", "chartLabelLeft")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .append("text")
    .classed("bottomLabels", true)
    .html("Votes Against")
    .attr("x", 0);

var lineGenerator = d3.line();

var lineArrow = d3.select("#chartLabelBottom")
    .append("svg")
    .attr("width", 300)
    .attr("height", 25)
    .append("g")
    .attr("id", "lineArrow")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "gray")
    .attr("stroke-width", 1)
    .attr("d", lineGenerator([[0,0],[300,0]]));

//create text "Votes For"
var chartLabelRight = d3.select("#chartLabelBottom")
    .append("svg")
    .attr("width", 90)
    .attr("height", 25)
    .append("g")
    .attr("id", "chartLabelRight")
    .attr("transform", `translate(${margin.right}, ${margin.top})`)
    .append("text")
    .classed("bottomLabels", true)
    .html("Votes For")

var chartLabelTop = d3.select("#chartLabelTop")
    .append("svg")
    .attr("width", width * 2)
    .attr("height", 35)
    .attr("class", "chartLabels")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .append("text")
    .html("Number of Votes on Recent Bills by Party")
    .attr("x", (width - margin.right) / 2)
    .attr("alignment-baseline", "bottom")

////////////////////////LEGEND//////////////////////////

//set size of legend div
var legend = d3.select("#legend")
    .attr("width", width)
    .attr("height", 100)

//create SVG for each party
var demLegSVG = legend.append("svg")
    .attr("id", "demLegSVG")
    .attr("width", 180);
var repLegSVG = legend.append("svg")
    .attr("id", "repLegSVG")
    .attr("width", 180);
var indLegSVG = legend.append("svg")
    .attr("id", "indLegSVG")
    .attr("width", 180);

//lists to hold colors and corresponding parties
var colors = ["#086fad", "#c7001e", "#8A2BE2"]
var parties = ["Democrat", "Republican", "Independent"]

//rect and text tag attributes
var legRectX = 40;
var legRectSize = 15;
var legTextX = 60;
var legTextY = 12;
var legTextWidth = 100;
var legTextHeight = 35;

//colored squares
demLegSVG.append("rect")
    .attr("width", legRectSize)
    .attr("height", legRectSize)
    .attr("x", legRectX)
    .style("fill", colors[0]);

repLegSVG.append("rect")
    .attr("width", legRectSize)
    .attr("height", legRectSize)
    .attr("x", legRectX)
    .style("fill", colors[1]);

indLegSVG.append("rect")
    .attr("width", legRectSize)
    .attr("height", legRectSize)
    .attr("x", legRectX)
    .style("fill", colors[2]);

//party labels
demLegSVG.append("text")
    .classed("legend-text", true)
    .attr("width", legTextWidth)
    .attr("height", legTextHeight)
    .attr("x", legTextX)
    .attr("y", legTextY)
    .html(parties[0]);

repLegSVG.append("text")
    .classed("legend-text", true)
    .attr("width", legTextWidth)
    .attr("height", legTextHeight)
    .attr("x", legTextX)
    .attr("y", legTextY)
    .html(parties[1]);

indLegSVG.append("text")
    .classed("legend-text", true)
    .attr("width", legTextWidth)
    .attr("height", legTextHeight)
    .attr("x", legTextX)
    .attr("y", legTextY)
    .html(parties[2]);

//////////////////////////TOOL TIPS////////////////////////////

//create div tag to hold tool tips
var toolTip = d3.select("#chart")
    .append("div")
    .style("opacity", 0);

//bar tips
var mouseoverRect = function (d) {
    toolTip
        .attr("id", "rectTip")
        .html(`${d[1] - d[0]} votes `) //num votes
        .style("opacity", 1)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY) + "px")
    d3.select(this)
        //creates border over moused over bar
        .style("stroke", "black")
        .style("stroke-width", 2)
};

//y tick tips
var mouseoverAxis = function (d) {
    toolTip
        .attr("id", "axisTip")
        .html(
            `<b>${d.name}</b> <br>
            <b> Question: </b>${d.question} <br>
            <b> Description: </b>${d.description}`
        )
        .style("opacity", 1)
        .style("left", (d3.event.pageX + 60) + "px")
        .style("top", (d3.event.pageY) + "px")
    d3.select(this)
        //bolds the moused over tick label
        .style("stroke", "black")
        .style("stroke-width", .5)
};

//function make tool tips invisible
var mouseleave = function (d) {
    toolTip
        .style("opacity", 0) //hides tool tip
        .style("left", "0px") //places far away from mouse
        .style("top", "0px")
    d3.select(this)
        .style("stroke", "none") //removes border or bolding
}

////////////////////////LINES///////////////////////////////

//func to create coords list for line generator object
function makeCoords(x, y, z) {
    var coords = [
        [x, z], //x,y coords of line start
        [y, z] //line end
    ];
    return coords
};
//console.log(makeCoords(1,5))

//////////////////////SCALES///////////////////////////////

//assign colors to parties
var colorScale = d3.scaleOrdinal()
    .domain(["demYes", "repYes", "indYes"])
    .range(colors);

//x scale for left side of chart
var xScaleYes = d3.scaleLinear()
    .domain([0, 535]) //num members of congress
    .range([0, width]);

//x scale for rigth side of chart
var xScaleNo = d3.scaleLinear()
    .domain([0, 535]) //num members of congress
    .range([width, 0]);
