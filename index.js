//config and data
const config = [
    {
        binding: 'name',
        width: 100
    },
    {
        binding: 'lname',
        width: 150
    },
    {
        binding: 'age',
        width: 50
    },
    {
        binding: 'hight',
        width: 60
    },
    {
        binding: 'phone',
        width: 150
    },
    {
        binding: 'id',
        width: 150
    }
];
const data = [];
for(let i = 0; i < 100; i++){
    data.push({name: 'Mohammad' + i, lname: 'Bayat' + i, age: 0 + i, hight: 100 + i, phone: 09196797500 + i, id: 4270331200 + i})
}


initGrid();


function initGrid() {
    const body = mb.select(".body");
    body.remove("*");
    const table = body.append("table")
        .attr("border", 0)
        .attr("cellpadding", 0)
        .attr("cellspacing", 0);
    const thead = table.append("thead")
        .append("tr");
    table.append("tbody");
        

    thead
        .data(config)
        .enter()
        .append("td")
        .style("minWidth", d => d.width + "px")
        .html(d => d.binding)
        .attr("draggable", true)
        .on("dragstart",
            function(d, i) {
                mb.event.dataTransfer.setData("index", i);
            })
        .on("dragover",
            function() {
                mb.event.preventDefault();
            })
        .on("drop",
        function (d, i) {
            mb.event.preventDefault();
                const
                    data = mb.select(this).parent().data(),
                    index = +mb.event.dataTransfer.getData("index"),
                    dragData = data[index];

                data.splice(index, 1);
                data.splice(i, 0, dragData);

                initGrid();
        });

    mb.select(".body tbody")
        .data(data)
        .enter()
        .append("tr");

    mb.select(".body")
        .on("scroll",
        function () {
            const container = mb.select('.grid-container').node();

                mb.select(this)
                    .select("thead")
                    .style("transform", `translate(0, ${this.scrollTop}px)`);

                thead
                    .select("td")
                    .style("transform", function () { return `translate(${container.clientWidth - this.parentNode.getBoundingClientRect().x}px, 0)` });

                mb.select(this)
                    .select("tbody")
                    .selectAll("tr")
                    .each(function(d, i) {
                        const body = mb.select(".body").node().getBoundingClientRect();
                        const row = this.getBoundingClientRect();

                        if (body.top < row.bottom &&
                            body.bottom > row.top) {
                            if (!this.firstElementChild) {
                                for (let i in config) {
                                    mb.select(this)
                                        .append("td")
                                        .html(d[config[i].binding]);
                                }
                            }
                            
                            mb.select(this)
                                .select("td")
                                .style("transform", `translate(${container.clientWidth - row.x}px, 0)`);

                        } else {
                            mb.select(this)
                                .remove("*");
                        }
                    });
            });
    mb.select(".body").node().scrollTop = 1;
}