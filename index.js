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
        width: 200
    }
];
const data = [];
for(let i = 0; i < 100; i++){
    data.push({name: 'Mohammad' + i, lname: 'Bayat' + i, age: 0 + i, hight: 100 + i, phone: 09196797500 + i, id: 4270331200 + i})
}


const isFireFox = navigator.userAgent.toLowerCase().indexOf('firefox') > 1;
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
        .style("min-width", d => d.width + "px")
        .html(d => d.binding)
        .call(mb.drag()
            .on("end",function(d, i) {
                const
                    headerData = mb.select(this).parent().data(),
                    hoveredData = mb.select(mb.event.target).data(),
                    hoveredIndex = headerData.indexOf(hoveredData);

                headerData.splice(i, 1);
                headerData.splice(hoveredIndex, 0, d);

                mb.select(this)
                    .parent()
                    .insertAfter(this, hoveredIndex);


                table.select("tbody")
                    .selectAll("tr")
                    .child(i)
                    .each(function() {
                        mb.select(this)
                            .parent()
                            .insertAfter(this, hoveredIndex);
                    });
            })
        )
        .on("click", function() {
            console.log("click");
        })
        .append("div")
        .attr("class", "resize-column")
        .call(mb.drag()
            .on("start", function (d) {
                mb.event.stopPropagation();
                this.x = mb.event.clientX;
                this.w = d.width;
            })
            .on("drag", function() {
                mb.select(this)
                    .parent()
                    .style("min-width", d => {
                        d.width = this.w + this.x - mb.event.clientX;
                        return d.width + "px";
                    });
            })
            .on("end", function() {
                this.x = null;
                this.w = null;
            })
        );

    mb.select(".body tbody")
        .data(data)
        .enter()
        .append("tr");

    mb.select(".body")
        .on("scroll",
        function () {
            mb.select(this)
                .select("thead")
                .style("transform", `translate(0, ${this.scrollTop}px)`);

            const body = mb.select(".body").node();
            let translateLeft;
            if (isFireFox) {
                translateLeft = body.scrollLeft;
            } else {
                translateLeft = -(body.scrollWidth - body.clientWidth - body.scrollLeft);
            }
            thead
                .select("td")
                .style("transform", function () { return `translate(${translateLeft}px, 0)` });

            mb.select(this)
                .select("tbody")
                .selectAll("tr")
                .watch(function (d, i, update) {
                    if (update) {
                        mb.select(this).remove("*");
                    }
                    const body = mb.select(".body").node().getBoundingClientRect();
                    const row = this.getBoundingClientRect();

                    if (body.top < row.bottom &&
                        body.bottom > row.top) {
                        if (!this.firstElementChild) {
                            for (let i in config) {
                                mb.select(this)
                                    .append("td")
                                    .html(d[config[i].binding])
                                    .data(d[config[i].binding]);
                            }
                        }
                            
                        mb.select(this)
                            .select("td")
                            .style("transform", `translate(${translateLeft}px, 0)`);

                    } else {
                        mb.select(this)
                            .remove("*");
                    }
                });
        });

    mb.select(".body").node().scrollTop = 1;
    mb.select(".body").node().scrollTop = 0;
}