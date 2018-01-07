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
        parent: select_parent,
        insertAfter: select_insertAfter,
        child: select_child,
        next: select_next,
        watch: select_watch
    }
    function attrConstant(name, value) {
        return function () {
            this.setAttribute(name, value);
        };
    }
    function attrFunction(name, value) {
        return function () {
            const v = value.apply(this, arguments);
            if (v == null) this.removeAttribute(name);
            else this.setAttribute(name, v);
        };
    }
    function select_attr(name, value) {
        return this.each((typeof value == "function"
            ? attrFunction
            : attrConstant)(name, value));
    }
    function select_each(callbacks) {
        const group = [];
        for (let i = 0, n = this.group.length; i < n; i++) {
            const elm = callbacks.call(this.group[i], this.group[i]._data, i, this.group);
            if (elm) {
                group.push(elm);
            }
        }

        return group.length > 0 ? new Select(group) : this;
    }
    function select_node() {
        return this.group[0];
    }
    function styleConstant(name, value, priority) {
        return function () {
            this.style.setProperty(name, value, priority);
        };
    }
    function styleFunction(name, value, priority) {
        return function () {
            const v = value.apply(this, arguments);
            if (v == null) this.style.removeProperty(name);
            else this.style.setProperty(name, v, priority);
        };
    }
    function select_style(name, value, priority = "") {
        return this.each((typeof value == "function"
            ? styleFunction
            : styleConstant)(name, value, priority));
    }
    function textConstant(value) {
        return function () {
            this.textContent = value;
        };
    }
    function textFunction(value) {
        return function () {
            const v = value.apply(this, arguments);
            this.textContent = v == null ? "" : v;
        };
    }
    function textRemove() {
        this.textContent = "";
    }
    function select_text(value) {
        return arguments.length
            ? this.each(value == null
                ? textRemove
                : (typeof value === "function"
                    ? textFunction
                    : textConstant)(value))
            : this.node().textContent;
    }
    function htmlConstant(value) {
        return function () {
            this.innerHTML = value;
        };
    }
    function htmlFunction(value) {
        return function () {
            const v = value.apply(this, arguments);
            this.innerHTML = v == null ? "" : v;
        };
    }
    function htmlRemove() {
        this.innerHTML = "";
    }
    function select_html(value) {
        return arguments.length
            ? this.each(value == null
                ? htmlRemove
                : (typeof value === "function"
                    ? htmlFunction
                    : htmlConstant)(value))
            : this.node().innerHTML;
    }
    function select_call() {
        const callback = arguments[0];
        arguments[0] = this;
        callback.apply(null, arguments);
        return this;
    }
    function insertAfterConstant(elm, refrence) {
        return function() {
            if (refrence instanceof HTMLElement) {
                this.insertBefore(elm, r.nextSibling);
            } else if (refrence > -1) {
                if (elm === this.childNodes[refrence + 1]) {
                    this.insertBefore(elm, this.childNodes[refrence]);
                } else {
                    this.insertBefore(elm, this.childNodes[refrence + 1]);
                }
            }
        }
    }
    function insertAfterFunction(elm, refrence) {
        return function() {
            const r = refrence.apply(this, arguments);
            insertAfterConstant(elm, r);
        }
    }
    function select_insertAfter(elm, refrence) {
        return this.each((typeof refrence == "function"
            ? insertAfterFunction
            : insertAfterConstant)(elm, refrence));
    }
    function childConstant(value) {
        return function () {
            let elm;
            if (typeof value == "string") {
                elm = this.querySelector("* > " + value);
            } else {
                elm = this.childNodes[value];
            }

            return elm ? elm : null;
        }
    }
    function childFunction(value){
        return function () {
            const v = value.apply(this, arguments);
            return childConstant(v);
        }
    }
    function select_child(value) {
        return this.each((typeof value == "function"
            ? childFunction
            : childConstant)(value));
    }
    function select_next() {
        return this.each(function() {
            return select(this.nextSibling);
        });
    }
    function select_parent() {
        return this.each(function() {
            return this.parentNode;
        });
    }


    function select_watch(callbacks) {
        return this.each(function(d, i) {
            callbacks.call(this, d, i, false);

            watch(this.parentNode._data, i, (n) => {
                callbacks.call(this, n, i, true);
            });
        });
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
    function select_data(value) {
        if (value) {
            this.group[0]._data = value;

            this.enter = select_enter;
            return this;
        } else {
            return this.group[0]._data;
        }
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
            enter[j] = element;
        }

        return new Select(enter);
    }
    function select_on(event, handler, capture) {
        return this.each(function(d) {
            this.addEventListener(event,
                (event) => {
                    let index;
                    this.parentNode.childNodes.forEach((node, i) => {
                        if (node === this) {
                            index = i;
                        }
                    });
                    exports.event = event;
                    handler.call(this, d, index);
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

    function drag() {
        const listeners = {
            start: null,
            drag: null,
            end: null
        };

        function drag(selection) {
            let self, args, move;

            selection
                .on("mousedown", function () {
                    exports.event.preventDefault();
                    if (listeners.start) {
                        listeners.start.apply(this, arguments);
                    }
                    move = 0;
                    self = this;
                    args = arguments;
                    document.addEventListener("mousemove", mousemove);
                    document.addEventListener("mouseup", mouseup);
                });
            function mousemove(event) {
                move ++;
                if (listeners.drag) {
                    exports.event = event;
                    listeners.drag.apply(self, args);
                }
            }
            function mouseup(event) {
                document.removeEventListener("mousemove", mousemove);
                document.removeEventListener("mouseup", mouseup);

                if (move > 0 && listeners.end) {
                    exports.event = event;
                    listeners.end.apply(self, args);
                }
            }
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





    function watch(object, prop, handler, deep) {
        if (object.watchList) {
            if (object.watchList[prop] && typeof object.watchList[prop] == "object") {
                const existFn = object.watchList[prop].find(item => item.toString() === handler.toString());

                if (existFn) {
                    const index = object.watchList[prop].indexOf(existFn);
                    object.watchList[prop].splice(index, 1);
                }
            } else {
                object.watchList[prop] = [];
            }
        } else {
            Object.defineProperty(object, "watchList", { value: [] });
            object.watchList[prop] = [];
        }
        object.watchList[prop].push(handler);

        let val = object[prop];
        Object.defineProperty(object, prop, {
            get: () => val,
            set: newVal => {
                if (newVal !== val) {
                    const oldVal = val;
                    val = newVal;
                    //object[prop] = val;
                    for (let i in object.watchList[prop]) {
                        object.watchList[prop][i](newVal, oldVal);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });

        if (deep) {
            if (typeof object[prop] == "object") {
                for (let i in object[prop]) {
                    if (!(prop === 'OHLC' || i === 'data')) {
                        watch(object[prop], i, handler, deep);
                    }
                }
            }
        }
    }
}));