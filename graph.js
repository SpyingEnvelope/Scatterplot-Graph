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
    const specifier = '%M:%S';
    const timeArray = response.map(d => d3.timeParse(specifier)(d.Time))
    const yearArray = response.map(d => d.Year);

    yScale = d3.scaleBand()
               .domain(['37:00', '37:15', '37:30', '37:45', '38:00', '38:15', '38:30', '38:45', '39:00', '39:15', '39:30', '39:45'])
               .range([padding, h - padding]);

    xScale = d3.scaleLinear()
               .domain([1993, d3.max(yearArray)])
               .range([padding, w - padding]);

    widthScale = d3.scaleLinear()
                   .domain([1993, d3.max(yearArray)])
                   .range([padding, w - padding]);

    heightScale = d3.scaleTime()
                    .domain(d3.extent(timeArray))
                    .range([padding, h - padding])

    addAxis(timeArray, yearArray, response);
}

const addAxis = (timeArray, yearArray, response) => {
    const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale);

    svg.append('g')
       .attr('id', 'y-axis')
       .attr('transform', 'translate(' + padding + ', 0)')
       .call(yAxis);
    
    svg.append('g')
       .attr('id', 'x-axis')
       .attr("transform", "translate(0," + (h - padding) + ")")
       .call(xAxis.tickFormat(d => d));
    
    addScatter(timeArray, yearArray, response);
}

const addScatter = (timeArray, yearArray, response) => {
    const specifier = '%M:%S';
    const minSpec = '%M'

    // d3.timeParse(specifier)(d.Time)

    svg.selectAll('circle')
       .data(response)
       .enter()
       .append('circle')
       .attr('class', 'dot')
       .attr('data-xvalue', (d) => d.Year)
       .attr('data-yvalue', (d) => new Date(d.Year, 0, 0, 0, d.Time.substring(0, 2), d.Time.substring(3, 5)))
       .attr('fill', function(d) {
           if (d.URL == "") {
               return 'orange';
           } else {
               return 'blue';
           }
       })
       .attr('cx', (d, i) => widthScale(d.Year))
       .attr('cy', (d, i) => heightScale(d3.timeParse(specifier)(d.Time)))
       .attr('r', 5)
       .on('mouseover', (event) => console.log(event.currentTarget.dataset.yvalue));

    addLegend();
}

const addLegend = () => {
    const legendItems = [
        {text: 'Without doping allegations', color: 'orange'},
        {text: 'With doping allegations', color: 'blue'}
    ]

    const legend = d3.select('#legend')
      .append('svg')
      .attr('width', w)
      .attr('height', h)
      .style('position', 'absolute')
      .selectAll('.legendItem')
      .data(legendItems)
      .enter()
      .append('rect')
      .attr('class', 'legendItem')
      .attr('width', 12)
      .attr('height', 12)
      .style('fill', d => d.color)
      .attr('transform', (d, i) => {
          let x = w - padding;
          let y = padding + (i * 20);
          return `translate(${x}, ${y})`

      });

}