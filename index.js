//config and data
const config = [
    {
        binding: 'name',
        width: 50
    },
    {
        binding: 'lname',
        width: 60
    },
    {
        binding: 'age',
        width: 70
    },
    {
        binding: 'hight',
        width: 80
    },
    {
        binding: 'phone',
        width: 90
    },
    {
        binding: 'id',
        width: 100
    }
];
const data = [];
for(let i = 0; i < 100; i++){
    data.push({name: 'Mohammad' + i, lname: 'Bayat' + i, age: 0 + i, hight: 100 + i, phone: 09196797500 + i, id: 4270331200 + i})
}


const isFireFox = navigator.userAgent.toLowerCase().indexOf('firefox') > 1;

let body;
let table;
let thead;
let tbody;

let order = {
    by: "hight",
    key: true
}
initGrid();
function initGrid() {
    body = mb.select(".body");

    body.remove("*");

    table = body.append("div")
        .attr("class", "table")
        .style("grid-template-columns", function () {
            const columns = [];
            for (let i = 0, n = config.length; i < n; i++) {
                columns.push(config[i].width + "px");
            }
            return columns.join(" ");
        });

    thead = table
        .selectAll("div")
        .data([config])
        .enter()
        .append("div")
        .attr("class", "thead");


    //thead
    //    .append("div")
    //    .attr("class", "side");

    thead
        .selectAll("div:not(.side)")
        .data(config)
        .enter()
        .append("div")
        .html(d => d.binding)
        .call(movementColumn())
        .each(function(d) {
            mb.watch(d, "width", (n) => {
                const index = config.indexOf(mb.select(this).data());
                gridTemplateColumnsUpdate(n, index);
            });
        })
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

    //mb.watch(order, "by", () => {
    //    thead
    //        .selectAll("td")
    //        .classed("order", d => d.binding === order.by);
    //});
    //mb.watch(order, "key", (n) => {
    //    thead
    //        .select(".order")
    //        .classed("desc", !n);
    //});

    tbody = table
        .selectAll(".grid-row:not(.thead)")
        .data(data)
        .enter()
        .append("div");

    body.on("scroll", function () {
        const
            bodyNode = body.node(),
            bodyOffset = bodyNode.getBoundingClientRect(),
            translateLeft = isFireFox
                ? bodyNode.scrollLeft
                : -(bodyNode.scrollWidth - bodyNode.clientWidth - bodyNode.scrollLeft);


        thead.style("transform", `translate(0, ${this.scrollTop}px)`);
        thead.select("div")
            .style("transform", `translate(${translateLeft}px, 0)`);

        tbody.each(function(d) {
                const row = this.getBoundingClientRect();

                if (bodyOffset.top < row.bottom &&
                    bodyOffset.bottom > row.top) {

                    //mb.select(this)
                    //    .selectAll(".side")
                    //    .data([1])
                    //    .enter()
                    //    .append("div")
                    //    .on("click",
                    //        function() {
                    //            const selfRow = mb.select(this)
                    //                .parent()
                    //                .node();

                    //            mb.select(this)
                    //                .parent()
                    //                .parent()
                    //                .insertAfter("tr", selfRow)
                    //                .attr("class", "cardx")
                    //                .append("tr");
                    //        })
                    //    .attr("class", "side");

                    //if (this.className !== "cardx") {
                        enterCell.call(this, d)
                            .append("div")
                            .html(d => d);

                        mb.select(this)
                            .select("div")
                            .style("transform", `translate(${translateLeft}px, 0)`);
                    //}
                } else {
                    mb.select(this)
                        .remove("*");
                }
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
        .selectAll("div:not(.side)")
        .data(data)
        .enter();
}
function gridTemplateColumnsUpdate(d, i) {
    const temp = table.node().style.gridTemplateColumns.split(" ");
    temp[i] = d + "px";

    table.style("grid-template-columns", temp.join(" "));
}
function movementColumn() {
    return mb.drag()
        .on("end", function (d, i) {
            const hoveredData = mb.select(mb.event.target).data();
            const elm = d;
            let fromIndex = config.indexOf(d);
            let toIndex = config.indexOf(hoveredData);
            config.splice(fromIndex, 1);

            if (fromIndex > toIndex + 1) {
                config.splice(toIndex + 1, 0, elm);
            } else {
                config.splice(toIndex, 0, elm);
            }
            mb.select(this)
                .parent()
                .insertAfter(this, toIndex);

            ////-----------
            const columns = [];
            for (let j = 0, n = config.length; j < n; j++) {
                columns.push(config[j].width + "px");
            }
            table.style("grid-template-columns", columns.join(" "));
            //-----------


            tbody.child(i)
                .each(function () {
                    mb.select(this)
                        .parent()
                        .insertAfter(this, toIndex);
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
        .on("drag", function (d) {
            d.width = this.w + this.x - mb.event.clientX;
        })
        .on("end", function () {
            this.x = null;
            this.w = null;
        });
}
