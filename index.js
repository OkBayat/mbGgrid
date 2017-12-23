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
const mb = {
    select
};


//Header
const 
    container = mb.select('.grid-container'),
    headerThead = container.select('.body thead > tr'),
    headerTbody = container.select('.header tbody > tr')
    body = container.select('.body tbody');

for(let i in config){
    const td = headerThead
        .append('td')
        .html(config[i].binding);

    if(i==0){
        td.attr('class', 'freez')
            .style('minWidth', config[i].width + 'px')
    }
}
for(let i in data){
    body
        .append('tr')
        .data(data[i])
    /////
    //appendTd(tr);
}
for(let i in config){
    body
        .append('td')
        .style('minWidth', config[i].width + 'px');
}
const mBody = container.select('.body')

mBody._element.onscroll = function(){



    let y1 = mBody._element.getBoundingClientRect().top,
        y2 = 0,
        y3 = mBody._element.getBoundingClientRect().bottom,
        y4 = 0;

    var translate = "translate(0," + this.scrollTop + "px)";
    this.querySelector("thead").style.transform = translate;
    headerThead.select('.freez')
        .style('top', y1 - this.scrollTop + 'px')

    //let x1 = body.__element.querySelector('tr').getBoundingClientRect().left;
    //let x2 = header.getBoundingClientRect().left;
    //let x3 = container.getBoundingClientRect().left;
    //console.log(x1, x2);
    //header.style.left = (x1 - x3) + 'px';

    const rows = body._element.querySelectorAll('tr');
    for(let i in rows){
        if(isNaN(+i) || i == rows.length - 1){
            break;
        }
        y2 = rows[i].getBoundingClientRect().bottom;
        y4 = rows[i].getBoundingClientRect().top;
      
        if(y2 - y1 < 0 || y3 < y4){
            while(rows[i].firstChild){
                rows[i].removeChild(rows[i].firstChild);
            }
        } else {
            if(!rows[i].firstChild){
                for(let j in config){
                    const td = mb.select(rows[i])
                        .append('td')
                        .html(rows[i]._data[config[j].binding]);
                    
                    if(j == 0){
                        td.attr('class', 'freez2');
                    }
                }
            }
            
            //rows[i].querySelector('td').style.top = rows[i].getBoundingClientRect().top -  container._element.getBoundingClientRect().top + 'px';
            debugger
            rows[i].querySelector('td').style.transform = `translate(${container._element.getBoundingClientRect().width - rows[i].getBoundingClientRect().x}px, 0)`; //rows[i].getBoundingClientRect().top -  container._element.getBoundingClientRect().top + 'px';
        }
    }
}


///MB
function select(selector){
    return typeof selector == "string"
        ? new $select(document.querySelector(selector))
        : new $select(selector);
}
function $select(element){
    this._element = element;
    this.select = select;
    this.append = append;
    this.html = html;
    this.style = style;
    this.attr = attr;
    this.data = s_data;
}
function append(name){
    const elm = document.createElement(name);
    this._element.appendChild(elm);

    return select(elm);
}
function html(value){
    this._element.innerHTML = value;

    return this;
}
function style(name, value){
    this._element.style[name] = value;
    return this;
}
function attr(name, value){
    this._element.setAttribute(name, value);
    return this;
}
function s_data(value){
    this._element._data = value;
    return this;
}