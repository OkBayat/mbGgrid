(function (global, factory) {
    factory(global.mb = {});
}(window, function (exports) {
    "use strict";

    function select(selector) {
        return typeof selector == "string"
            ? new Select([document.querySelector(selector)])
            : selector.length
            ? new Select(selector)
            : new Select([selector]);
    }
    function selectAll(selector) {
        if (typeof selector == "string") {
            const elms = document.querySelectorAll(selector);
            const arr = [];
            for (let i = 0; i < elms.length; i++) {
                arr.push(elms[i]);
            }
            return new Select(arr);
        } else {
            return new Select(selector);
        }
    }
    function Select(group) {
        this.group = group;
    }
    Select.prototype = {
        data: select_data,
        append: select_append,
        attr: select_attr,
        text: select_text,
        each: select_each,
        select: select_select,
        selectAll: select_selectAll,
        on: select_on,
        remove: select_remove,
        style: select_style,
        node: select_node,
        html: select_html,
        call: select_call,
        parent: select_parent
    }
    function select_append(name) {
        const enter = [];
        forEach.call(this, function (node, val, data, i, group) {
            const elm = document.createElement(val);
            elm._data = data;
            group[i].appendChild(elm);
            enter[i] = elm;
        }, name);

        return new Select(enter);
    }
    function select_attr(name, value) {
        return forEach.call(this, function (node, val) {
            node.setAttribute(name, val);
        }, value);
    }
    function select_data(value) {
        if (value) {
            this.group[0]._data = value;

            this.enter = select_enter;
            return this;
        } else {
            return this.group[0]._data;
        }
    }
    function select_each(callbacks) {
        return forEach.call(this, function () {
        }, callbacks);
    }
    function select_enter() {
        const
            data = this.group[0]._data,
            enter = new Array(data.length);

        for (let j in data) {
            const element = {
                appendChild: node => this.group[0].appendChild(node),
                _data: data[j]
            }
            enter[j] = element
        }

        return new Select(enter);
    }
    function select_node() {
        return this.group[0];
    }
    function select_on(event, handler, capture) {
        return forEach.call(this, function (node, val, data, i) {
            node.addEventListener(event,
                (event) => {
                    exports.event = event;
                    handler.call(node, data, i);
                    exports.event = null;
                }, capture);
        });
    }
    function select_remove(selector) {
        return forEach.call(this, function (node, val) {
            if (val) {
                while (node.querySelector(val)) {
                    node.removeChild(node.querySelector(val));
                }
            } else {
                node.parentElement.removeChild(node);
            }
        }, selector);
    }
    function select_select(selector) {
        return forEach.call(this, function (node, val) {
            return [node.querySelector(val)];
        }, selector);
    }
    function select_selectAll(selector) {
        return forEach.call(this, function (node, val) {
            return node.querySelectorAll(val);
        }, selector);
    }
    function select_style(name, value) {
        return forEach.call(this, function (node, val) {
            node.style[name] = val;
        }, value);
    }
    function select_text(value) {
        return forEach.call(this, function (node, val) {
            node.innerText = val;
        }, value);
    }
    function select_html(value) {
        return forEach.call(this, function (node, val) {
            node.innerHTML = val;
        }, value);
    }
    function forEach(selector, value) {
        const group = [];
        for (let i in this.group) {
            let nValue;
            if (typeof value == "function") {
                nValue = value.call(this.group[i], this.group[i]._data, +i);
            } else {
                nValue = value;
            }
            const elm = selector.call(this, this.group[i], nValue, this.group[i]._data, +i, this.group);
            if (elm) {
                group.push(...elm);
            }
        }

        return group.length > 0 ? new Select(group) : this;
    }
    function select_call() {
        const
            args = arguments,
            callback = args[0];

        return forEach.call(this, function (node) {
            args[0] = new Select([node]);
            callback.apply(null, args);
        });
    }
    function select_parent() {
        return select(this.group[0].parentNode);
    }

    function drag() {
        let listeners = {
            start: null,
            drag: null,
            end: null,
            drop: null
        };

        function drag(selection) {
            selection
                //.attr("tabindex", "-1")
                .attr("draggable", true)
                .on("dragover", function() {
                    event.preventDefault();
                })
                .on("dragstart", listeners.start)
                .on("drag", listeners.drag)
                .on("dragend", listeners.end)
                .on("drop", listeners.drop);
        }


        drag.on = function(event, callback) {
            listeners[event] = callback;
            return drag;
        }

        return drag;
    }

    exports.event = null;
    exports.select = select;
    exports.selectAll = selectAll;
    exports.drag = drag;
    Object.defineProperty(exports, '__esModule', { value: true });
}));