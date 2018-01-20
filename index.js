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
let data = [];
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
let masterDetail = true;
let masterDetailWidth = 50;
initGrid();


function initGrid() {
    const openedDetailList = [];

    body = mb.select(".body");
    body.remove("*");

    table = body.append("div")
        .attr("class", "table");
        
    setGridTemplateColumns();
    

    thead = table
        .selectAll("div")
        .data([config])
        .enter()
        .append("div")
        .attr("class", "thead");


    if (masterDetail) {
        thead
            .append("div")
            .attr("class", "master-detail");
    }

    thead
        .selectAll("div:not(.master-detail)")
        .data(config)
        .enter()
        .append("div")
        .html(d => d.binding)
        .call(movementColumn())
        .each(function (d) {
            mb.watch(d, "width", (n) => gridTemplateColumnsUpdate(n, mb.select(this).parent().indexOf(this)));
        })
        .on("click", sortColumns)
            .append("div")
            .attr("class", "resize-column")
            .call(resizeColumn());

    if (masterDetail) {
        thead
            .append("div")
            .attr("class", "master-detail");
    }
        
    thead
        .selectAll("div.detail")
        .data(config)
        .enter()
        .append("div")
        .attr("class", "detail")
        .append("input")
        .on("keyup", function(d, i) {
            if (mb.event.target.value.toString().length > 2) {
                data = data.filter( item => eval("'" + item[this.parentElement._data.binding] + "'" + mb.event.target.value));
            }
        });
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

        tbody
            .each(function(d) {
                const row = this.getBoundingClientRect();

                if (bodyOffset.top < row.bottom &&
                    bodyOffset.bottom > row.top) {
                    if (this.hasChildNodes()) {
                        return;
                    }
                    let isOpenDetail = openedDetailList.indexOf(d) > -1;

                    mb.select(this)
                        .append("div")
                        .attr("class", "master-detail")
                        .classed("open", isOpenDetail)
                        .on("click", function () {
                            if (isOpenDetail) {
                                const index = openedDetailList.indexOf(d);
                                openedDetailList.splice(index, 1);

                                mb.select(this)
                                    .parent()
                                    .remove(".detail");

                                mb.select(".body").node().scrollTop++;
                                mb.select(".body").node().scrollTop--;
                            } else {
                                openedDetailList.push(d);

                                mb.select(this)
                                    .parent()
                                    .selectAll(".detail")
                                    .enter()
                                    .append("div")
                                    .attr("class", "detail")
                                    .style("grid-column-start", 2)
                                    .style("grid-column-end", 8)
                                    .html("aaaa");
                            }
                            isOpenDetail = !isOpenDetail;
                            mb.select(this)
                                .classed("open", isOpenDetail);
                            

                        });

                    enterCell.call(this, d)
                        .append("div")
                        .html(d => d.value)
                        .watch(function (n, o, i, update) {
                            if (update)
                                mb.select(this)
                                    .html(n)
                                    .classed(n > o ? "green" : "red", 500);
                        }, null, d => d.binding);

                        mb.select(this)
                            .select("div")
                            .style("transform", `translate(${translateLeft}px, 0)`);

                        if (isOpenDetail) {
                            mb.select(this)
                                .append("div")
                                .attr("class", "detail")
                                .style("grid-column-start", 2)
                                .style("grid-column-end", 8)
                                .html("aaaa");
                        } else {
                            mb.select(this)
                                .remove(".detail");
                        }

                    //}
                } else {
                    mb.select(this)
                        .remove("*");
                }
            }, data);
    });

    mb.select(".body").node().scrollTop = 1;
    mb.select(".body").node().scrollTop = 0;
}

function enterCell(d) {
    const data = [];
    for (let i in config) {
        data.push({ value: d[config[i].binding], binding: config[i].binding });
    }
    
    return mb.select(this)
        .selectAll("div:not(.master-detail):not(.detail)")
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
            if (mb.event.target.classList.contains("master-detail")) {
                return;
            }
            const
                hoveredData = mb.select(mb.event.target).data(),
                toIndex = config.indexOf(hoveredData) + 1;

            mb.select(this)
                .parent()
                .insertAfter(this, toIndex);

            
            ////-----------
            setGridTemplateColumns();
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
        .on("start", function () {
            mb.event.stopPropagation();
            this.x = mb.event.clientX;
            this.w = mb.select(this).parent().data().width;
        })
        .on("drag", function () {
            mb.select(this).parent().data().width = this.w + this.x - mb.event.clientX;
        })
        .on("end", function () {
            this.x = null;
            this.w = null;
        });
}
function sortColumns(d) {
    if (order.by === d.binding) {
        order.key = !order.key;
    } else {
        order.key = true;
    }
    order.by = d.binding;
    data.sort(function (a, b) {
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
}
function setGridTemplateColumns() {
    table.style("grid-template-columns", function () {
        const columns = masterDetail ? [masterDetailWidth + "px"] : [];
        for (let i = 0, n = config.length; i < n; i++) {
            columns.push(config[i].width + "px");
        }
        return columns.join(" ");
    });
}
