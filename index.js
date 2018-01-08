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


let tbody;
let order = {
    by: "hight",
    key: true
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
        .selectAll("tr")
        .data([config])
        .enter()
        .append("tr");

    tbody = table
        .selectAll("tbody")
        .data([data])
        .enter()
        .append("tbody");

    thead
        .selectAll("td")
        .data(config)
        .enter()
        .append("td")
        .style("min-width", d => d.width + "px")
        .html(d => d.binding)
        .call(movementColumn())
        .on("click", function (d) {
            if (order.by === d.binding) {
                order.key = !order.key;
            } else {
                order.key = true;
            }
            order.by = d.binding;
            tbody.data().sort(function(a, b) {
                return order.key
                    ? a[d.binding] > b[d.binding]
                        ? 1
                        : b[d.binding] > a[d.binding]
                            ? -1
                            : 0
                    : a[d.binding] < b[d.binding]
                        ? 1
                        : b[d.binding] < a[d.binding]
                            ? -1
                            : 0;
            });
        })
        .append("div")
        .attr("class", "resize-column")
        .call(resizeColumn());

    mb.watch(order, "by", () => {
        thead
            .selectAll("td")
            .classed("order", d => d.binding === order.by);
    });
    mb.watch(order, "key", (n) => {
        thead
            .select(".order")
            .classed("desc", !n);
    });

    mb.select(".body tbody")
        .selectAll("tr")
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
                .each(function(d) {
                    const body = mb.select(".body").node().getBoundingClientRect();
                    const row = this.getBoundingClientRect();

                    if (body.top < row.bottom &&
                        body.bottom > row.top) {

                        enterCell.call(this, d)
                            .append("td")
                            .html(d => d);

                        mb.select(this)
                            .select("td")
                            .style("transform", `translate(${translateLeft}px, 0)`);

                    } else {
                        mb.select(this)
                            .remove("*");
                    }
                })
                .watch(function(d) {
                    enterCell.call(this, d)
                        .html(d => d);
                });

        });

    mb.select(".body").node().scrollTop = 1;
    mb.select(".body").node().scrollTop = 0;
}

function enterCell(d) {
    const data = [];
    for (let i in config) {
        data.push(d[config[i].binding]);
    }

    return mb.select(this)
        .selectAll("td")
        .data(data)
        .enter();
}
function movementColumn() {
    return mb.drag()
        .on("end", function (d, i) {
            const
                headerData = mb.select(this).parent().data(),
                hoveredData = mb.select(mb.event.target).data(),
                hoveredIndex = headerData.indexOf(hoveredData);

            headerData.splice(i, 1);
            headerData.splice(hoveredIndex, 0, d);

            mb.select(this)
                .parent()
                .insertAfter(this, hoveredIndex);


            tbody
                .selectAll("tr")
                .child(i)
                .each(function () {
                    mb.select(this)
                        .parent()
                        .insertAfter(this, hoveredIndex);
                });
        });
}
function resizeColumn() {
    return mb.drag()
        .on("start", function (d) {
            mb.event.stopPropagation();
            this.x = mb.event.clientX;
            this.w = d.width;
        })
        .on("drag", function () {
            mb.select(this)
                .parent()
                .style("min-width", d => {
                    d.width = this.w + this.x - mb.event.clientX;
                    return d.width + "px";
                });
        })
        .on("end", function () {
            this.x = null;
            this.w = null;
        })
}