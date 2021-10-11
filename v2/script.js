var app = (function () {
    'use strict';

    function noop() { }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function subscribe$1(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.wholeText !== data)
            text.data = data;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe$1(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    class Complex {
        constructor(real=0, imag=0) {
            this.real = real;
            this.imag = imag;
        }
        becomes(real=0, imag=0) {
            this.real = real;
            this.imag = imag;
            return this;
        }
        /**@param {Complex} c */
        eq(c) {
            this.real = c.real;
            this.imag = c.imag;
            return this;
        }
        /**@param {Complex} c */
        add(c) {
            this.real += c.real;
            this.imag += c.imag;
            return this;
        }
        /**@param {...Complex} cs*/
        add$(...cs) {
            for(var i=cs.length-1; i>=0; i--) {
                this.real += cs[i].real;
                this.imag += cs[i].imag;
            }
            return this;
        }
        /**@param {Complex} c */
        sub(c) {
            this.real -= c.real;
            this.imag -= c.imag;
            return this;
        }
        /**@param {Complex} c */
        mul(c) {
            var i = this.imag*c.real + this.real*c.imag;
            this.real = this.real*c.real - this.imag*c.imag;
            this.imag = i;
            return this;
        }
        mul_i() {
            var t = this.real;
            this.real = -this.imag;
            this.imag = t;
            return this;
        }
        /**@param {Number} r */
        mul_r(r) {
            this.real *= r;
            this.imag *= r;
            return this;
        }
        /**@param {...Complex} cs*/
        mul$(...cs) {
            var t;
            for(var i=cs.length-1; i>=0; i--) {
                t = this.imag*cs[i].real + this.real*cs[i].imag;
                this.real = this.real*cs[i].real - this.imag*cs[i].imag;
                this.imag = t;
            }
            return this;
        }
        /**@param {Complex} c */
        div(c) {
            var m2 = c.real*c.real + c.imag*c.imag;
            var r = (this.real*c.real + this.imag*c.imag) / m2;
            var i = (this.imag*c.real - this.real*c.imag) / m2;
            this.real = r;
            this.imag = i;
            return this;
        }
        /**
         * @param {Complex} c complex power
         * @param {Number} [k=0] determines angle
         */
        exp(c, k=0) {
            return this.logarize(k).mul(c).exponentiate();
        }
        /**
         * @param {Complex} r real power
         * @param {Number} [k=0] determines angle
         */
        exp_r(r, k=0) {
            var mod = Math.pow(this.real*this.real + this.imag*this.imag, r/2); 
            var arg = Math.atan2(this.imag, this.real) + k*2*Math.PI;
            this.real = mod * Math.cos(r * arg);
            this.imag = mod * Math.sin(r * arg);
            return this;
        }
        /**@param {Number} n integer power */
        exp_n(n) {
            if(n == 0) return this.becomes(1, 0);
            const real = this.real, imag = this.imag;
            var end = n, t;
            if(n<0) {
                end = -n;
                this.toReciprocal();
            }
            for(var i=0; i<end; i++) {
                t = this.imag*real + this.real*imag;
                this.real = this.real*real - this.imag*imag;
                this.imag = t;
            }
            return this;
        }
        exponentiate() {
            var mod = Math.exp(this.real);
            this.real = mod * Math.cos(this.imag);
            this.imag = mod * Math.sin(this.imag);
            return this;
        }
        logarize(k=0) {
            var r = Math.log(this.real*this.real + this.imag*this.imag);
            var i = Math.atan2(this.imag, this.real) + k*2*Math.PI;
            this.real = r * .5;
            this.imag = i;
            return this;
        }
        intoSine() {
            var i = Math.cos(this.real)*Math.sinh(this.imag);
            this.real = Math.sin(this.real)*Math.cosh(this.imag);
            this.imag = i;
            return this;
        }
        intoCosine() {
            var i = -Math.sin(this.real)*Math.sinh(this.imag);
            this.real = Math.cos(this.real)*Math.cosh(this.imag);
            this.imag = i;
            return this;
        }
        toOne() {
            this.real = 1;
            this.imag = 0;
            return this;
        }
        toZero() {
            this.real = 0;
            this.imag = 0;
            return this;
        }
        toConjugate() {
            this.imag = -this.imag;
            return this;
        }
        toReciprocal() {
            var m2 = this.real*this.real + this.imag*this.imag;
            this.real /= m2;
            this.imag = -this.imag/m2;
            return this;
        }
        toString() {
            if(this.real == 0) return this.imag ? nf(this.imag)+'i' : '0';
            if(this.imag == 0) return nf(this.real);
            let r = ['(', nf(this.real)];
            if(this.imag > 0) {
                if(this.imag === 1) r.push('+i)');
                else r.push('+', nf(this.imag), 'i)');
            } else {
                if(this.imag === -1) r.push('-i)');
                else r.push(nf(this.imag), 'i)');
            }
            return r.join('');
        }
        static ReIm(real, imag) { return new Complex(real, imag) }
        static ModArg(mod, arg) { return new Complex(mod * Math.cos(arg), mod * Math.sin(arg)) }
    }
    window.Complex = Complex;
    function nf(n) { return Number.isInteger(n) ? n.toString() : n.toPrecision(4) }

    const axis = (function(){
        const value = {
            xMin: -3,
            xMax: 3,
            yMin: -2,
            yMax: 2,
        };
        const { subscribe, set } = writable(value);
        return Object.freeze({
            subscribe,
            shift(xShift, yShift) {
                value.xMin += xShift;
                value.xMax += xShift;
                value.yMin += yShift;
                value.yMax += yShift;
                set(value);
            },
            reset() {
                value.xMin = -3;
                value.xMax = 3;
                value.yMin = -2;
                value.yMax = 2;
                set(value);
            },
            x: {
                get min() {return value.xMin},
                set min(v) {
                    value.xMin = v;
                    set(value);
                },
                get max() {return value.xMax},
                set max(v) {
                    value.xMax = v;
                    set(value);
                },
            },
            y: {
                get min() {return value.yMin},
                set min(v) {
                    value.yMin = v;
                    set(value);
                },
                get max() {return value.yMax},
                set max(v) {
                    value.yMax = v;
                    set(value);
                },
            },
        })
    })();

    derived(axis, a => ({x: 900/(a.xMax - a.xMin), y: 600/(a.yMax - a.yMin)}));

    const px_gap = writable(12);

    const life = writable(3);

    const clr_num = writable(8);
    const clr_factor = writable(0);
    const clr_thresholds = derived([clr_num, clr_factor], ([n, f]) => {
        const res = new Array(n+1), mul = Math.pow(100, f/10);
        for(var i=n; i >= 0; i--) res[i] = ( n / i - 1) * mul;
        return res;
    });
    const clr_strings = derived(clr_num, n => {
        const res = new Array(n);
        let hue;
        for(var i=0; i<n; i++) {
            hue = 240 * Math.pow(i/(n-1), .6) * Math.sin(i*Math.PI / (2*n-2));
            res[i] = `hsl(${hue},55%,55%)`;
        }
        return res;
    });
    const color = Object.freeze({
        number: clr_num,
        factor: clr_factor,
        strings: clr_strings,
        thresholds: clr_thresholds,
        all: derived(
            [clr_num, clr_factor, clr_strings, clr_thresholds],
            ([n, f, s, t]) => ({number: n, factor: f, strings: s, thresholds: t})
        ),
    });

    const info = Object.freeze({
        computation: writable(""),
        particles: writable(""),
        frame: writable(""), 
    });

    const complexFunction = writable(c => new Complex(c.real, c.imag));

    /**
     * @param {Function} fn
     * @param {Number} delay
     */
    function throttle(fn, delay) {
        let waiting = false;
        return () => {
            if(waiting) return;
            waiting = true;
            setTimeout(() => {
                fn();
                waiting = false;
            }, delay);
        }
    }

    function debouce(fn, delay) {
        let timer;
        function res() {
            clearTimeout(timer);
            timer = setTimeout(fn, delay);
        }
        res.cancel = () => clearTimeout(timer);
        return res;
    }

    /**
     * @param {Function} fn 
     * @param {Number} delay 
     * @returns 
     */
    function debounce(fn, delay) {
        let timer;
        function res() {
            clearTimeout(timer);
            timer = setTimeout(fn, delay);
        }
        res.cancel = () => clearTimeout(timer);
        return res;
    }

    /**@type {{x: Number, y: Number, s: Number}[][][]} */
    let frames$1 = [], clrs$1 = [];
    const { subscribe, set } = writable({clrs: clrs$1, frames: frames$1});

    const settings = {
        axis: {
            xMin: -3, xMax: 3,
            yMin: -2, yMax: 2,
        },
        gap: 12,
        life: 120,
        func: null,
    };

    var thresholds = [];
    function clr_index(speed) {
        var i = 1;
        while(speed < thresholds[i]) i++;
        return i-1;
    }
    function logistic(s) { return 1/(1 + 3*Math.exp(-.1*s)) }

    async function cf() {
        const start = performance.now();
        const numX = Math.floor(900/settings.gap);
        const numY = Math.floor(600/settings.gap);
        var i, z, w, shift;
        const life = settings.life;
        const axis = settings.axis;
        const deltaX = axis.xMax - axis.xMin;
        const deltaY = axis.yMax - axis.yMin;
        const f = new Array(life);
        const clr_num = clrs$1.length;
        for(var j=0; j<life; j++) {
            f[j] = new Array(clr_num);
            for(i=0; i<clr_num; i++) f[j][i] = [];
        }
        function particle() {
            w = settings.func(z);
            var speed = Math.sqrt(w.real*w.real + w.imag*w.imag);
            f[i][clr_index(speed)].push({
                x: (z.real - axis.xMin)*900/deltaX,
                y: (axis.yMax - z.imag)*600/deltaY,
                s: speed,
            });
            z.add(w.mul( logistic(speed) / speed ));
        }
        var ix, iy;
        for(ix=0; ix<=numX; ix++) {
            info.computation.set(`Progress: ${((ix+1)/numX).toFixed(2)}%`);
            for(iy=0; iy<=numY; iy++) {
                z = new Complex(
                    ix/numX*deltaX + axis.xMin,
                    iy/numY*deltaY + axis.yMin,
                );
                shift = Math.round(Math.random()*life);
                for(i=shift; i<life; i++) particle();
                for(i=0; i<shift; i++) particle();
            }
        }
        frames$1 = f;
        info.computation.set(`Computed in ${((performance.now()-start)/1000).toPrecision(3)}s`);
        info.particles.set(`Particles: ${numX+1}\xd7${numY+1} = ${(numX+1)*(numY+1)}`);
        set({clrs: clrs$1, frames: frames$1});
    }
    const computeFrames = debounce(cf, 100);
    axis.subscribe(v => {settings.axis = v; computeFrames();});
    px_gap.subscribe(v => {settings.gap = v; computeFrames();});
    life.subscribe(v => {settings.life = v*30; computeFrames();});
    complexFunction.subscribe(v => {settings.func = v; computeFrames();});

    color.all.subscribe(({number: n, thresholds: t, strings: s}) => {
        var c, i;
        thresholds = t;
        frames$1 = frames$1.map(f => {
            const r = new Array(n);
            for(c=0; c<n; c++) r[c] = [];
            for(c=0; c<n; c++) {
                for(i=f[c].length-1; i>=0; i--) {
                    r[clr_index(f[c][i].s)].push(f[c][i]);
                }
            }
            return r;
        });
        clrs$1 = s;
        set({clrs: clrs$1, frames: frames$1});
    });


    var plotFrames = { subscribe };

    var frame_request = null, /**@type {CanvasRenderingContext2D} */ ctx;
    var frame_index=0, time=0, counter = 0;

    var clrs = [], frames = [];
    plotFrames.subscribe(v => {
        clrs = v.clrs;
        frames = v.frames;
        console.log(frames);
    });


    /**@param {HTMLCanvasElement} node */
    function setCanvas(node) {
        ctx = node.getContext('2d');
        ctx.fillStyle = 'hsl(240, 6%, 15%)';
        ctx.fillRect(0, 0, 900, 600);
    }


    function draw() {
        const start = performance.now();
        if(++counter > 240) {
            info.frame.set((time/counter).toFixed(3) + ' ms');
            time = counter = 0;
        }
        ctx.fillStyle = 'hsla(240,6%,15%,.01)';
        ctx.fillRect(0, 0, 900, 600);
        if(frame_index >= frames.length) frame_index=0;
        const frame = frames[frame_index];
        var i, c;
        for(c=frame.length-1; c>=0; c--) {
            ctx.fillStyle = clrs[c];
            for(i=frame[c].length-1; i>=0; i--) {
                ctx.fillRect(frame[c][i].x-.5, frame[c][i].y-.5, 1, 1);
            }
        }
        frame_index++;
        frame_request = requestAnimationFrame(draw);
        time += performance.now() - start;
    }

    function toggle() {
        if(frame_request) {
            cancelAnimationFrame(frame_request);
            frame_request = null;
            return false;
        } else {
            frame_request = requestAnimationFrame(draw);
            return true;
        }
    }

    /* v2\components\Canvas.svelte generated by Svelte v3.43.0 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	return child_ctx;
    }

    // (86:8) {#each xlabels as l}
    function create_each_block_1(ctx) {
    	let div;
    	let div_data_label_value;

    	return {
    		c() {
    			div = element("div");
    			attr(div, "data-label", div_data_label_value = /*l*/ ctx[19]);
    			attr(div, "class", "svelte-npzlce");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*xlabels*/ 1 && div_data_label_value !== (div_data_label_value = /*l*/ ctx[19])) {
    				attr(div, "data-label", div_data_label_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (91:8) {#each ylabels as l}
    function create_each_block(ctx) {
    	let div;
    	let div_data_label_value;

    	return {
    		c() {
    			div = element("div");
    			attr(div, "data-label", div_data_label_value = /*l*/ ctx[19]);
    			attr(div, "class", "svelte-npzlce");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*ylabels*/ 2 && div_data_label_value !== (div_data_label_value = /*l*/ ctx[19])) {
    				attr(div, "data-label", div_data_label_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    function create_fragment$1(ctx) {
    	let div5;
    	let canvas;
    	let t0;
    	let div0;
    	let t1;
    	let t2;
    	let div1;
    	let div1_style_value;
    	let t3;
    	let div2;
    	let div2_style_value;
    	let t4;
    	let div3;
    	let t5;
    	let div4;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*xlabels*/ ctx[0];
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*ylabels*/ ctx[1];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	return {
    		c() {
    			div5 = element("div");
    			canvas = element("canvas");
    			t0 = space();
    			div0 = element("div");
    			t1 = text(/*pos*/ ctx[4]);
    			t2 = space();
    			div1 = element("div");
    			t3 = space();
    			div2 = element("div");
    			t4 = space();
    			div3 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t5 = space();
    			div4 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr(canvas, "width", "900");
    			attr(canvas, "height", "600");
    			attr(canvas, "class", "svelte-npzlce");
    			attr(div0, "class", "position svelte-npzlce");
    			toggle_class(div0, "show", /*showPos*/ ctx[5]);
    			attr(div1, "class", "x-axis svelte-npzlce");

    			attr(div1, "style", div1_style_value = /*xAxisTop*/ ctx[2] > 0 && /*xAxisTop*/ ctx[2] < 600
    			? `top: ${/*xAxisTop*/ ctx[2]}px;`
    			: 'display: none');

    			attr(div2, "class", "y-axis svelte-npzlce");

    			attr(div2, "style", div2_style_value = /*yAxisLeft*/ ctx[3] > 0 && /*yAxisLeft*/ ctx[3] < 900
    			? `left: ${/*yAxisLeft*/ ctx[3]}px;`
    			: 'display: none');

    			attr(div3, "class", "x-label svelte-npzlce");
    			attr(div4, "class", "y-label svelte-npzlce");
    			attr(div5, "class", "container svelte-npzlce");
    		},
    		m(target, anchor) {
    			insert(target, div5, anchor);
    			append(div5, canvas);
    			append(div5, t0);
    			append(div5, div0);
    			append(div0, t1);
    			append(div5, t2);
    			append(div5, div1);
    			append(div5, t3);
    			append(div5, div2);
    			append(div5, t4);
    			append(div5, div3);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div3, null);
    			}

    			append(div5, t5);
    			append(div5, div4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div4, null);
    			}

    			if (!mounted) {
    				dispose = [
    					listen(canvas, "mousedown", /*mousedown*/ ctx[7]),
    					listen(canvas, "mouseup", /*mouseup*/ ctx[8]),
    					listen(canvas, "mousemove", /*mousemove*/ ctx[6]),
    					action_destroyer(setCanvas.call(null, canvas))
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*pos*/ 16) set_data(t1, /*pos*/ ctx[4]);

    			if (dirty & /*showPos*/ 32) {
    				toggle_class(div0, "show", /*showPos*/ ctx[5]);
    			}

    			if (dirty & /*xAxisTop*/ 4 && div1_style_value !== (div1_style_value = /*xAxisTop*/ ctx[2] > 0 && /*xAxisTop*/ ctx[2] < 600
    			? `top: ${/*xAxisTop*/ ctx[2]}px;`
    			: 'display: none')) {
    				attr(div1, "style", div1_style_value);
    			}

    			if (dirty & /*yAxisLeft*/ 8 && div2_style_value !== (div2_style_value = /*yAxisLeft*/ ctx[3] > 0 && /*yAxisLeft*/ ctx[3] < 900
    			? `left: ${/*yAxisLeft*/ ctx[3]}px;`
    			: 'display: none')) {
    				attr(div2, "style", div2_style_value);
    			}

    			if (dirty & /*xlabels*/ 1) {
    				each_value_1 = /*xlabels*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div3, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*ylabels*/ 2) {
    				each_value = /*ylabels*/ ctx[1];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div4, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div5);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function calcLabels(min, max, num) {
    	const res = new Array(num);
    	for (var i = 0; i <= num; i++) res[i] = (i / num * (max - min) + min).toFixed(2);
    	return res;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let scaleX = 0,
    		scaleY = 0,
    		xlabels = [],
    		ylabels = [],
    		xAxisTop = 300,
    		yAxisLeft = 450;

    	axis.subscribe(a => {
    		scaleX = (a.xMax - a.xMin) / 900;
    		scaleY = (a.yMax - a.yMin) / 600;
    		$$invalidate(2, xAxisTop = a.yMax / (a.yMax - a.yMin) * 600);
    		$$invalidate(3, yAxisLeft = a.xMin / (a.xMin - a.xMax) * 900);
    		$$invalidate(0, xlabels = calcLabels(a.xMin, a.xMax, 9));
    		$$invalidate(1, ylabels = calcLabels(a.yMin, a.yMax, 6));
    	});

    	let lastX = 0,
    		lastY = 0,
    		currentX = 0,
    		currentY = 0,
    		moving = false,
    		pos = '',
    		showPos = false;

    	const hidePos = debouce(() => $$invalidate(5, showPos = false), 1000);

    	const calcPos = throttle(
    		function () {
    			$$invalidate(5, showPos = true);
    			var x = currentX * scaleX + axis.x.min;
    			var y = axis.y.max - currentY * scaleY;
    			$$invalidate(4, pos = `${x.toPrecision(3)} ${y < 0 ? '-' : '+'} ${Math.abs(y).toPrecision(3)}i`);
    			hidePos();
    		},
    		50
    	);

    	const setDeltas = throttle(
    		function () {
    			var deltaX = (currentX - lastX) * scaleX;
    			var deltaY = (currentY - lastY) * scaleY;
    			lastX = currentX;
    			lastY = currentY;
    			axis.shift(-deltaX, deltaY);
    		},
    		50
    	);

    	/**@param {MouseEvent} e*/
    	function mousemove(e) {
    		currentX = e.offsetX;
    		currentY = e.offsetY;
    		if (moving) setDeltas(); else calcPos();
    	}

    	/**@param {MouseEvent} e*/
    	function mousedown(e) {
    		lastX = e.offsetX;
    		lastY = e.offsetY;
    		e.target.style.cursor = 'grabbing';
    		moving = true;
    	}

    	/**@param {MouseEvent} e*/
    	function mouseup(e) {
    		e.target.style.cursor = 'crosshair';
    		moving = false;
    	}

    	return [
    		xlabels,
    		ylabels,
    		xAxisTop,
    		yAxisLeft,
    		pos,
    		showPos,
    		mousemove,
    		mousedown,
    		mouseup
    	];
    }

    class Canvas extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});
    	}
    }

    /* v2\components\App.svelte generated by Svelte v3.43.0 */

    function create_fragment(ctx) {
    	let button;
    	let t1;
    	let canvas;
    	let t2;
    	let div;
    	let t3;
    	let br0;
    	let t4;
    	let t5;
    	let br1;
    	let t6;
    	let t7;
    	let br2;
    	let current;
    	let mounted;
    	let dispose;
    	canvas = new Canvas({});

    	return {
    		c() {
    			button = element("button");
    			button.textContent = "Play";
    			t1 = space();
    			create_component(canvas.$$.fragment);
    			t2 = space();
    			div = element("div");
    			t3 = text(/*frame*/ ctx[0]);
    			br0 = element("br");
    			t4 = space();
    			t5 = text(/*particles*/ ctx[1]);
    			br1 = element("br");
    			t6 = space();
    			t7 = text(/*computation*/ ctx[2]);
    			br2 = element("br");
    			attr(button, "class", "svelte-3v93ht");
    			attr(div, "class", "info svelte-3v93ht");
    		},
    		m(target, anchor) {
    			insert(target, button, anchor);
    			insert(target, t1, anchor);
    			mount_component(canvas, target, anchor);
    			insert(target, t2, anchor);
    			insert(target, div, anchor);
    			append(div, t3);
    			append(div, br0);
    			append(div, t4);
    			append(div, t5);
    			append(div, br1);
    			append(div, t6);
    			append(div, t7);
    			append(div, br2);
    			current = true;

    			if (!mounted) {
    				dispose = listen(button, "click", /*click_handler*/ ctx[3]);
    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (!current || dirty & /*frame*/ 1) set_data(t3, /*frame*/ ctx[0]);
    			if (!current || dirty & /*particles*/ 2) set_data(t5, /*particles*/ ctx[1]);
    			if (!current || dirty & /*computation*/ 4) set_data(t7, /*computation*/ ctx[2]);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(canvas.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(canvas.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(button);
    			if (detaching) detach(t1);
    			destroy_component(canvas, detaching);
    			if (detaching) detach(t2);
    			if (detaching) detach(div);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	var frame, particles, computation;
    	info.frame.subscribe(v => $$invalidate(0, frame = v));
    	info.particles.subscribe(v => $$invalidate(1, particles = v));
    	info.computation.subscribe(v => $$invalidate(2, computation = v));
    	const click_handler = e => e.target.textContent = toggle() ? 'Pause' : 'Play';
    	return [frame, particles, computation, click_handler];
    }

    class App extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance, create_fragment, safe_not_equal, {});
    	}
    }

    const app = new App({target: document.body});

    return app;

})();
