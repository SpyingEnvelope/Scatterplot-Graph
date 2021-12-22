let jsonData;
let svg;
let heightScale;
let widthScale;
let yScale;
let xScale;

const w = 1000;
const h = 500;
const padding = 40;

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(response => response.json())
    .then(function (response) {
        console.log(response)
        addSvg(response);
        
    })

const addSvg = (response) => {
    svg = d3.select('#graph-div')
            .append('svg')
            .attr('width', w)
            .attr('height', h);

    addScale(response);
}

const addScale = (response) => {
    const yearSpecifier = '%Y';
    // const timeArray = response.map(d => d3.timeParse(specifier)(d.Time))
    const timeArray = response.map(d => d.Time);
    const yearArray = response.map(d => d.Year);

    yScale = d3.scaleBand()
               .domain(['37:00', '37:15', '37:30', '37:45', '38:00', '38:15', '38:30', '38:45', '39:00', '39:15', '39:30', '39:45'])
               .range([padding, h - 30]);

    xScale = d3.scaleLinear()
               .domain(d3.extent(yearArray))
               .range([padding, w - padding])

    addAxis(timeArray);
}

const addAxis = (timeArray) => {
    const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale);

    svg.append('g')
       .attr('id', 'y-axis')
       .attr('transform', 'translate(' + padding + ', 0)')
       .call(yAxis);
    
    svg.append('g')
       .attr('id', 'x-axis')
       .attr("transform", "translate(0," + (h - 30) + ")")
       .call(xAxis.tickFormat(d => d));
}