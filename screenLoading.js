var numeroBarras = [];
var center;
var screenloader = 
{
	width: 500,
    height: 500,
    areaInicial: 
    {
        areaSpeed: 0.225,
        circleRadius: 16,
        arcsCount: 3,
        arcsRadius: 6,
        arcsAngularGap: 7.5,
        arcsPadding: 5,
        glow: {
            innerRadius: 19,
            outerRadius: 31,
            x: 7,
            y: 7
        }
    },
    barrasArcs: 
    [
        {
            id: "arc-1",
            speed: -0.19,
            radius: 10,
            distance: 28,
            fill: "#1E90FF",
            angularSize: 80,
            startAngle: 0
        },

        {
            id: "arc-2",
            speed: -0.19,
            radius: 10,
            distance: 28,
            fill: "#1E90FF",
            angularSize: 140,
            startAngle: 150
        },
        {
            id: "arc-4",
            speed:0.16,
            radius: 18.3,
            distance:48,
            fill: "#1E90FF",
            angularSize: 70,
            startAngle: -50
        },

        {
            id: "arc-5",
            speed: 0.16,
            radius: 18.3,
            distance: 48,
            fill: "#1E90FF",
            angularSize: 95,
            startAngle: 133
        },

       /* {
            id: "arc-6",
            speed: -0.05,
            radius: 36.6,
            distance: 50.3,
            fill: "rgba(13,215,247,.7)",
            angularSize: 45,
            startAngle: -94
        },*/

        {
            id: "arc-7",
            speed: -0.13,
            radius: 18.3,
            distance: 65,
            fill: "rgba(237,237,237,.9)",
            angularSize: 80,
            startAngle: 0
        },

        {
            id: "arc-8",
            speed: -0.13,
            radius: 18.3,
            distance: 65,
            fill: "rgba(237,237,237,.8)",
            angularSize: 100,
            startAngle: 150
        },
    ]
};
screenLoaderDraw("#holder")
function screenLoaderDraw (id)
{
	var drawer = d3.scale.linear().domain([0, 360]).range([0, 2 * Math.PI]);
	var svg = d3.select(id)
		.append("svg")
        .attr("width", screenloader.width)
        .attr("height", screenloader.height);
    center = {x: screenloader.width / 2, y: screenloader.height / 2};
    svg
	    .append("defs")
	    .append("filter")
	    .attr("id", "inner-glow")
	    .append("feGaussianBlur")
	    .attr("in", "SourceGraphic")
	    .attr("stdDeviation", screenloader.areaInicial.glow.x + " " + screenloader.areaInicial.glow.y);
	var g = svg
        .append("g");

    var areaInicial = g.append("g")
        .attr("id", "inner-area");
     areaInicial.append("path")
        .attr("id", "inner-glowing-arc")
        .attr("transform", "translate(" + center.x + "," + center.y + ")")
        .attr("d", d3.svg.arc()
		        .innerRadius(screenloader.areaInicial.glow.innerRadius)
		        .outerRadius(screenloader.areaInicial.glow.outerRadius)
		        .startAngle(0)
		        .endAngle(2 * Math.PI))
		.style("fill", "#1E90FF")
		.attr("filter", "url(#inner-glow)");
		// Inner circle
    areaInicial.append("circle")
        .attr("id", "inner-circle")
        .attr("cx", center.x)
        .attr("cy", center.y)
        .attr("r", screenloader.areaInicial.circleRadius)
        .style("fill", "rgb(237,237,237)");

    areaInicial.append("use")
        .attr("xlink:href", "#inner-circle")
        .attr("filter", "url(#inner-glow)");

    var paddings = screenloader.areaInicial.arcsCount * screenloader.areaInicial.arcsAngularGap,
        arcAngularSize = (360 - paddings) / screenloader.areaInicial.arcsCount;

    // Inner surrounding arcs
    areaInicial.selectAll("path")
        .data(d3.range(screenloader.areaInicial.arcsCount + 1))
    .enter()
        .append("path")
        .style("fill", "#1E90FF")
        .attr("transform", "translate(" + center.x + "," + center.y + ")" +
              "rotate(" + (180 - screenloader.areaInicial.arcsAngularGap / 2) + ")")
        .attr("d", function(d, i){

            var _innerRadius = screenloader.areaInicial.circleRadius + screenloader.areaInicial.arcsPadding,
                startAngle = drawer(arcAngularSize * i + screenloader.areaInicial.arcsAngularGap * (i + 1)),
                endAngle = drawer(arcAngularSize) + startAngle;

            return d3.svg.arc()
                .innerRadius(_innerRadius)
                .outerRadius(_innerRadius + screenloader.areaInicial.arcsRadius)
                .startAngle(startAngle)
                .endAngle(endAngle)();
        });

    /* Outer arcs */
    var outerArea = g.append("g")
        .attr("id", "outer-area");

    var barrasArcs = outerArea.selectAll("path")
        .data(screenloader.barrasArcs)
    .enter()
        .append("path")
        .attr("id", function(d){return d.id;})
        .style("fill", function(d){return d.fill;})
        .attr("transform", "translate(" + center.x + "," + center.y + ")")
        .attr("d", function(d){

            var _startAngle = drawer(d.startAngle),
                _angularSize = drawer(d.angularSize),
                _innerRadius = d.distance;

            return d3.svg.arc()
                .innerRadius(_innerRadius)
                .outerRadius(_innerRadius + d.radius)
                .startAngle(_startAngle)
                .endAngle(_startAngle + _angularSize)();
        });

    var t0 = Date.now();

    d3.timer(function(){
        var delta = (Date.now() - t0);

        areaInicial.attr("transform", function() {
            return "rotate(" + delta * screenloader.areaInicial.areaSpeed + "," + center.x + "," + center.y + ")";
        });

        barrasArcs.attr("transform", function(d) {
            return "translate(" + center.x + "," + center.y + ") rotate(" + delta * d.speed + ")";
        });

    });
};
