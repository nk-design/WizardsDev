if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(b, c) {
        c = Number(c) || 0;
        var a = this.length;
        c = (c < 0) ? Math.ceil(c) : Math.floor(c);
        if (c < 0) {
            c += a
        }
        for (; c < a; c++) {
            if (this.hasOwnProperty(c) && this[c] === b) {
                return c
            }
        }
        return -1
    }
}
if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function(b, c) {
        c = Number(c);
        var a = this.length;
        if (isNaN(c)) {
            c = a - 1
        } else {
            c = (c < 0) ? Math.ceil(c) : Math.floor(c);
            if (c < 0) {
                c += a
            } else {
                if (c >= a) {
                    c = a - 1
                }
            }
        }
        for (; c > -1; c--) {
            if (this.hasOwnProperty(c) && this[c] === b) {
                return c
            }
        }
        return -1
    }
}
if (!Array.prototype.some) {
    Array.prototype.some = function(b, d) {
        var c, a = this.length;
        if (typeof b !== "function") {
            throw new TypeError()
        }
        for (c = 0; c < a; c++) {
            if (this.hasOwnProperty(c) && b.call(d, this[c], c, this)) {
                return true
            }
        }
        return false
    }
}
if (!Array.prototype.every) {
    Array.prototype.every = function(b, d) {
        var c, a = this.length;
        if (typeof b !== "function") {
            throw new TypeError()
        }
        for (c = 0; c < a; c++) {
            if (this.hasOwnProperty(c) && !b.call(d, this[c], c, this)) {
                return false
            }
        }
        return true
    }
}
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(b, d) {
        var c, a = this.length;
        if (typeof b !== "function") {
            throw new TypeError()
        }
        for (c = 0; c < a; c++) {
            if (this.hasOwnProperty(c)) {
                b.call(d, this[c], c, this)
            }
        }
    }
}
if (!Array.prototype.filter) {
    Array.prototype.filter = function(b, e) {
        var d, c, f, a = this.length;
        if (typeof b !== "function") {
            throw new TypeError()
        }
        d = [];
        for (c = 0; c < a; c++) {
            if (this.hasOwnProperty(c)) {
                f = this[c];
                if (b.call(e, f, c, this)) {
                    d.push(f)
                }
            }
        }
        return d
    }
}
if (!Array.prototype.map) {
    Array.prototype.map = function(b, e) {
        var d, c, a = this.length;
        if (typeof b !== "function") {
            throw new TypeError()
        }
        d = [];
        d.length = a;
        for (c = 0; c < a; c++) {
            if (this.hasOwnProperty(c)) {
                d[c] = b.call(e, this[c], c, this)
            }
        }
        return d
    }
}
VIS = {
    data: {
        input: "jsonInput",
        output: "jsonOutput",
        validateOut: "jsonValidateOutput",
        size: "jsonSize",
        inStrict: "jsonStrict",
        inEval: "jsonEval",
        outHTML: "json2HTML",
        outJSON: "json2JSON",
        preserve: "jsonSpace",
        dates: "jsonDate",
        dataTables: "jsonData",
        trunc: "jsonTrunc",
        location: "jsonLocation",
        options: "jsonOptionSet",
        outputSet: "jsonOutputSet"
    },
    paths: [],
    init: function() {
        var a, b;
        for (a in this.data) {
            if (this.data.hasOwnProperty(a)) {
                this.data[a] = $(this.data[a])
            }
        }
        if (this.data.input.spellcheck === true) {
            this.data.input.spellcheck = false
        }[{
            el: this.data.output,
            fn: this.doClick
        }, {
            el: this.data.outputSet,
            fn: this.update_option_visibility
        }, {
            el: "cmdRender",
            fn: this.render
        }, {
            el: "cmdValidate",
            fn: this.validate
        }, {
            el: "cmdClear",
            fn: this.clear
        }, {
            el: "cmdEncode",
            fn: this.doEncode
        }, {
            el: "cmdCollapse",
            fn: this.collapseAll
        }, {
            el: "cmdExpand",
            fn: this.expandAll
        }, {
            el: "cmdRemoveCRLF",
            fn: this.removeCRLF
        }, {
            el: "cmdDecodeURI",
            fn: this.decodeURI
        }, {
            el: "cmdTrim2JSON",
            fn: this.trimToJSON
        }, {
            el: "cmdLoad",
            fn: this.load
        }, {
            el: "cmdReload",
            fn: this.reLoad
        }, {
            el: "cmdHelp",
            fn: this.help
        }, {
            el: "cmdBeer",
            fn: this.beer
        }].forEach(function(c) {
            Event.addListener(c.el, "click", c.fn, this, true)
        }, this);
        Event.addListener(this.data.validateOut, "mouseover", this.overValidation, this, true);
        Event.addListener(this.data.validateOut, "mouseout", this.overValidation, this, true);
        b = COOKIE.get("json");
        b = b || "101111";
        b = b.split("");
        this.data.inStrict.checked = (b[0] === "1");
        this.data.inEval.checked = (b[0] === "0");
        this.data.preserve.checked = (b[1] === "1");
        this.data.dates.checked = (b[2] === "1");
        this.data.dataTables.checked = (b[3] === "1");
        this.data.trunc.checked = (b[4] === "1");
        this.data.outHTML.checked = (b[5] === "1");
        this.data.outJSON.checked = (b[5] === "0");
        this.update_option_visibility();
        this.load_queryString()
    },
    update_option_visibility: function() {
        var a = this.data.outHTML.checked ? "HTML" : "PRETTY";
        this.data.options.className = a;
        document.getElementById("htmlCommands").style.visibility = (a === "PRETTY") ? "hidden" : "";
        document.getElementById("reloadCommand").style.visibility = (this.getFeed.lastURL) ? "" : "hidden"
    },
    load_queryString: function() {
        var a = new QUERYSTRING(),
            b = a.get("feed");
        if (b.length === 0) {
            return
        }
        b = b[0];
        this.getFeed(b)
    },
    load: function() {
        var a = window.prompt("Enter a URL to load:");
        if (a) {
            this.getFeed(a)
        }
    },
    reLoad: function() {
        var a = this.getFeed.lastURL;
        if (a) {
            this.getFeed(a)
        }
    },
    help: function(b) {
        Event.stopEvent(b);
        var a = Event.getTarget(b);
        window.open(a.href, a.target, "width=550,resizable=yes,scrollbars=yes");
        return false
    },
    getFeed: function(e) {
        if (this.getFeed.working === true) {
            return
        }
        var d, a;

        function b(g) {
            VIS.getFeed.working = false;
            document.getElementById("loadMessage").style.display = "none";
            document.getElementById("loadCommands").style.display = "";
            VIS.update_option_visibility();
            g.purge()
        }
        d = 'Select * From json Where url="' + e + '"';
        a = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(d) + "&format=json&callback=VIS.gotFeed";
        this.getFeed.working = true;
        this.getFeed.lastURL = e;
        document.getElementById("loadMessage").style.display = "";
        document.getElementById("loadCommands").style.display = "none";
        YAHOO.util.Get.script(a, {
            timeout: 30000,
            onSuccess: b,
            onTimeout: function f(g) {
                window.alert("The remote server is not responding.");
                b(g)
            },
            onFailure: function c(g) {
                window.alert("An unknown error was encountered while loading that JSON.");
                b(g)
            }
        })
    },
    gotFeed: function(a) {
        if (!a || !a.query) {
            window.alert("An unknown error was encountered while processing that request.");
            return
        }
        if (!a.query.results) {
            window.alert("That request did not respond with a recognizable JSON result.");
            return
        }
        this.clear();
        this.data.input.value = Lang.JSON.stringify(a.query.results);
        this.render()
    },
    beer: function(b) {
        Event.stopEvent(b);
        var a = Event.getTarget(b);
        window.open(a.href, a.target, "width=550,height=300,resizable=yes,scrollbars=yes");
        return false
    },
    lastHover: null,
    overValidation: function(d) {
        var c = Event.getTarget(d),
            a = c ? c.nodeName.toLowerCase() : "",
            b;
        if (a !== "span") {
            return
        }
        b = document.getElementById((c.className === "ERR") ? "HIGHLIGHT_" + c.id.substring(4) : "ERR_" + c.id.substring(10));
        if (this.lastHover) {
            Dom.removeClass(this.lastHover.target, "hover");
            Dom.removeClass(this.lastHover.related, "hover");
            this.lastHover = null
        }
        if (d.type === "mouseover") {
            Dom.addClass(c, "hover");
            Dom.addClass(b, "hover");
            this.lastHover = {
                target: c,
                related: b
            }
        }
    },
    doClick: function(c) {
        var b = Event.getTarget(c),
            a;

        function d(e) {
            return (e.id !== "")
        }
        if (this.data.outHTML.checked && b.nodeName.toLowerCase() === "caption") {
            HTML.toggleArea(b)
        }
        if (b.id === "") {
            b = Dom.getAncestorBy(b, d)
        }
        a = b.id;
        if (a === this.data.output.id) {
            a = ""
        }
        a = this.findPath(a);
        this.data.location.innerHTML = a
    },
    pathRE: /^px?(\d+)$/,
    findPath: function(a) {
        if (this.pathRE.test(a) === false) {
            return ""
        }
        a = Number(this.pathRE.exec(a)[1]);
        return (a > this.paths.length) ? "" : this.paths[a]
    },
    dateRE: /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)Z$/,
    clear: function() {
        this.reset();
        this.data.input.value = "";
        this.data.input.focus()
    },
    parse: function(json) {
        var result;
        try {
            result = this.data.inStrict.checked ? Lang.JSON.parse(json) : eval("(" + json + ")")
        } catch (ex) {
            result = ex
        }
        return result
    },
    doEncode: function() {
        var a = this.data.input.value;
        this.reset();
        if (Lang.trim(a).length === 0) {
            return
        }
        a = this.parse(a);
        if (a instanceof Error) {
            a = this.validate()
        }
        if (a instanceof Error) {
            return
        }
        a = Lang.JSON.stringify(a);
        this.data.output.innerHTML = "<pre>" + this.html(a) + "</pre>"
    },
    render: function() {
        var a = this.data.input.value;
        this.reset();
        if (Lang.trim(a).length === 0) {
            return
        }
        a = this.parse(a);
        if (a instanceof Error) {
            a = this.validate()
        }
        this.visualize(a)
    },
    reset: function() {
        this.data.location.innerHTML = "";
        this.data.output.className = "";
        this.data.output.innerHTML = "";
        this.data.validateOut.innerHTML = "";
        this.data.size.innerHTML = "";
        this.lastHover = null
    },
    visualize: function(token) {
        var size = this.data.input.value.length,
            style = this.data.outHTML.checked ? HTML : PRETTY,
            cookie = [this.data.inStrict.checked ? "1" : "0", this.data.preserve.checked ? "1" : "0", this.data.dates.checked ? "1" : "0", this.data.dataTables.checked ? "1" : "0", this.data.trunc.checked ? "1" : "0", this.data.outHTML.checked ? "1" : this.data.outJSON.checked ? "0" : "2"].join("");
        this.paths = ["root"];
        this.data.output.className = this.data.outHTML.checked ? "HTML" : "PRETTY";
        this.data.output.innerHTML = style.display(token, 0);
        size = this.formatSize(size) + " characters";
        size = this.html(size);
        this.data.size.innerHTML = size;
        if (COOKIE.get("json") !== cookie) {
            COOKIE.set("json", cookie);
            /*@cc_on
                    if (this.data.outHTML.checked) {
                        this.fixTableWidths();
                    }
                    @*/
        }
    },
    validate: function() {
        var o, g, l, a, f, m, z = this.data.input.value,
            i = 0,
            q = (z.length === 0),
            u = /^[\-0-9]$/,
            e = [],
            c = [/^[\t\v\r\n\f\x20\xA0]$/, /^[\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]$/],
            w = [/^[\u0000-\u001f\uffda-\uffdc]$/],
            h = [/^[\u005F\u203F\u2040\u2054\uFE33\uFE34\uFE4D-\uFE4F\uFF3F]$/],
            r = [/^[\u0030-\u0039\u0660-\u0669\u06f0-\u06f9\u07c0-\u07c9]$/, /^[\u0966-\u096f\u09e6-\u09ef\u0a66-\u0a6f\u0ae6-\u0aef]$/, /^[\u0b66-\u0b6f\u0be6-\u0bef\u0c66-\u0c6f\u0ce6-\u0cef]$/, /^[\u0d66-\u0d6f\u0e50-\u0e59\u0ed0-\u0ed9\u0f20-\u0f29]$/, /^[\u1040-\u1049\u1090-\u1099\u17e0-\u17e9\u1810-\u1819]$/, /^[\u1946-\u194f\u19d0-\u19d9\u1b50-\u1b59\u1bb0-\u1bb9]$/, /^[\u1c40-\u1c49\u1c50-\u1c59\ua620-\ua629\ua8d0-\ua8d9]$/, /^[\ua900-\ua909\uaa50-\uaa59\uffda-\uffdc]$/];
        f = [/^[\u0300-\u036f\u0483-\u0487\u0591-\u05bd\u05c1-\u05c2\u05bf]$/, /^[\u05c4-\u05c5\u0610-\u061a\u064b-\u065e\u06d6-\u06dc\u05c7]$/, /^[\u06df-\u06e4\u06e7-\u06e8\u06ea-\u06ed\u0730-\u074a\u0670]$/, /^[\u07a6-\u07b0\u07eb-\u07f3\u0901-\u0903\u093e-\u094d\u0711]$/, /^[\u0951-\u0954\u0962-\u0963\u0981-\u0983\u09be-\u09c4\u093c]$/, /^[\u09c7-\u09c8\u09cb-\u09cd\u09e2-\u09e3\u0a01-\u0a03\u09bc]$/, /^[\u0a3e-\u0a42\u0a47-\u0a48\u0a4b-\u0a4d\u0a70-\u0a71\u09d7]$/, /^[\u0a81-\u0a83\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0a3c]$/, /^[\u0ae2-\u0ae3\u0b01-\u0b03\u0b3e-\u0b44\u0b47-\u0b48\u0a51]$/, /^[\u0b4b-\u0b4d\u0b56-\u0b57\u0b62-\u0b63\u0bbe-\u0bc2\u0a75]$/, /^[\u0bc6-\u0bc8\u0bca-\u0bcd\u0c01-\u0c03\u0c3e-\u0c44\u0abc]$/, /^[\u0c46-\u0c48\u0c4a-\u0c4d\u0c55-\u0c56\u0c62-\u0c63\u0b3c]$/, /^[\u0c82-\u0c83\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0b82]$/, /^[\u0cd5-\u0cd6\u0ce2-\u0ce3\u0d02-\u0d03\u0d3e-\u0d44\u0bd7]$/, /^[\u0d46-\u0d48\u0d4a-\u0d4d\u0d62-\u0d63\u0d82-\u0d83\u0cbc]$/, /^[\u0dcf-\u0dd4\u0dd8-\u0ddf\u0df2-\u0df3\u0e34-\u0e3a\u0d57]$/, /^[\u0e47-\u0e4e\u0eb4-\u0eb9\u0ebb-\u0ebc\u0ec8-\u0ecd\u0dca]$/, /^[\u0f18-\u0f19\u0f3e-\u0f3f\u0f71-\u0f84\u0f86-\u0f87\u0dd6]$/, /^[\u0f90-\u0f97\u0f99-\u0fbc\u102b-\u103e\u1056-\u1059\u0e31]$/, /^[\u105e-\u1060\u1062-\u1064\u1067-\u106d\u1071-\u1074\u0eb1]$/, /^[\u1082-\u108d\u1712-\u1714\u1732-\u1734\u1752-\u1753\u0f35]$/, /^[\u1772-\u1773\u17b6-\u17d3\u180b-\u180d\u1920-\u192b\u0f37]$/, /^[\u1930-\u193b\u19b0-\u19c0\u19c8-\u19c9\u1a17-\u1a1b\u0f39]$/, /^[\u1b00-\u1b04\u1b34-\u1b44\u1b6b-\u1b73\u1b80-\u1b82\u0fc6]$/, /^[\u1ba1-\u1baa\u1c24-\u1c37\u1dc0-\u1de6\u1dfe-\u1dff\u108f]$/, /^[\u20d0-\u20dc\u20e5-\u20f0\u2de0-\u2dff\u302a-\u302f\u135f]$/, /^[\u3099-\u309a\ua67c-\ua67d\ua823-\ua827\ua880-\ua881\u17dd]$/, /^[\ua8b4-\ua8c4\ua926-\ua92d\ua947-\ua953\uaa29-\uaa36\u18a9]$/, /^[\uaa4c-\uaa4d\ufe00-\ufe0f\uffda-\uffdc\u20e1\ua66f\ua802]$/, /^[\ua806\ua80b\uaa43\ufb1e]$/];
        m = [/^[\u0041-\u005a\u0061-\u007a\u00c0-\u00d6\u00d8-\u00f6\u00aa]/, /^[\u00f8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u0370-\u0374\u00b5]/, /^[\u0376-\u0377\u037a-\u037d\u0388-\u038a\u038e-\u03a1\u00ba]/, /^[\u03a3-\u03f5\u03f7-\u0481\u048a-\u0523\u0531-\u0556\u02ec]/, /^[\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0621-\u064a\u02ee]/, /^[\u066e-\u066f\u0671-\u06d3\u06e5-\u06e6\u06ee-\u06ef\u0386]/, /^[\u06fa-\u06fc\u0712-\u072f\u074d-\u07a5\u07ca-\u07ea\u038c]/, /^[\u07f4-\u07f5\u0904-\u0939\u0958-\u0961\u0971-\u0972\u0559]/, /^[\u097b-\u097f\u0985-\u098c\u098f-\u0990\u0993-\u09a8\u06d5]/, /^[\u09aa-\u09b0\u09b6-\u09b9\u09dc-\u09dd\u09df-\u09e1\u06ff]/, /^[\u09f0-\u09f1\u0a05-\u0a0a\u0a0f-\u0a10\u0a13-\u0a28\u0710]/, /^[\u0a2a-\u0a30\u0a32-\u0a33\u0a35-\u0a36\u0a38-\u0a39\u07b1]/, /^[\u0a59-\u0a5c\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u07fa]/, /^[\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2-\u0ab3\u0ab5-\u0ab9\u093d]/, /^[\u0ae0-\u0ae1\u0b05-\u0b0c\u0b0f-\u0b10\u0b13-\u0b28\u0950]/, /^[\u0b2a-\u0b30\u0b32-\u0b33\u0b35-\u0b39\u0b5c-\u0b5d\u09b2]/, /^[\u0b5f-\u0b61\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u09bd]/, /^[\u0b99-\u0b9a\u0b9e-\u0b9f\u0ba3-\u0ba4\u0ba8-\u0baa\u09ce]/, /^[\u0bae-\u0bb9\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0a5e]/, /^[\u0c2a-\u0c33\u0c35-\u0c39\u0c58-\u0c59\u0c60-\u0c61\u0abd]/, /^[\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0ad0]/, /^[\u0cb5-\u0cb9\u0ce0-\u0ce1\u0d05-\u0d0c\u0d0e-\u0d10\u0b3d]/, /^[\u0d12-\u0d28\u0d2a-\u0d39\u0d60-\u0d61\u0d7a-\u0d7f\u0b71]/, /^[\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dc0-\u0dc6\u0b83]/, /^[\u0e01-\u0e30\u0e32-\u0e33\u0e40-\u0e46\u0e81-\u0e82\u0b9c]/, /^[\u0e87-\u0e88\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0bd0]/, /^[\u0eaa-\u0eab\u0ead-\u0eb0\u0eb2-\u0eb3\u0ec0-\u0ec4\u0c3d]/, /^[\u0edc-\u0edd\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8b\u0cbd]/, /^[\u1000-\u102a\u1050-\u1055\u105a-\u105d\u1065-\u1066\u0cde]/, /^[\u106e-\u1070\u1075-\u1081\u10a0-\u10c5\u10d0-\u10fa\u0d3d]/, /^[\u1100-\u1159\u115f-\u11a2\u11a8-\u11f9\u1200-\u1248\u0dbd]/, /^[\u124a-\u124d\u1250-\u1256\u125a-\u125d\u1260-\u1288\u0e84]/, /^[\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u0e8a]/, /^[\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u0e8d]/, /^[\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u0ea5]/, /^[\u166f-\u1676\u1681-\u169a\u16a0-\u16ea\u1700-\u170c\u0ea7]/, /^[\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u0ebd]/, /^[\u176e-\u1770\u1780-\u17b3\u1820-\u1877\u1880-\u18a8\u0ec6]/, /^[\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19a9\u0f00]/, /^[\u19c1-\u19c7\u1a00-\u1a16\u1b05-\u1b33\u1b45-\u1b4b\u103f]/, /^[\u1b83-\u1ba0\u1bae-\u1baf\u1c00-\u1c23\u1c4d-\u1c4f\u1061]/, /^[\u1c5a-\u1c7d\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u108e]/, /^[\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f5f-\u1f7d\u10fc]/, /^[\u1f80-\u1fb4\u1fb6-\u1fbc\u1fc2-\u1fc4\u1fc6-\u1fcc\u1258]/, /^[\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u12c0]/, /^[\u1ff6-\u1ffc\u2090-\u2094\u210a-\u2113\u2119-\u211d\u17d7]/, /^[\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u17dc]/, /^[\u2183-\u2184\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2c6f\u18aa]/, /^[\u2c71-\u2c7d\u2c80-\u2ce4\u2d00-\u2d25\u2d30-\u2d65\u1f59]/, /^[\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u1f5b]/, /^[\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u1f5d]/, /^[\u2dd8-\u2dde\u3005-\u3006\u3031-\u3035\u303b-\u303c\u1fbe]/, /^[\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u2071]/, /^[\u3105-\u312d\u3131-\u318e\u31a0-\u31b7\u31f0-\u31ff\u207f]/, /^[\ua000-\ua48c\ua500-\ua60c\ua610-\ua61f\ua62a-\ua62b\u2102]/, /^[\ua640-\ua65f\ua662-\ua66e\ua67f-\ua697\ua717-\ua71f\u2107]/, /^[\ua722-\ua788\ua78b-\ua78c\ua7fb-\ua801\ua803-\ua805\u2115]/, /^[\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\u2124]/, /^[\ua90a-\ua925\ua930-\ua946\uaa00-\uaa28\uaa40-\uaa42\u2126]/, /^[\uaa44-\uaa4b\uf900-\ufa2d\ufa30-\ufa6a\ufa70-\ufad9\u2128]/, /^[\ufb00-\ufb06\ufb13-\ufb17\ufb1f-\ufb28\ufb2a-\ufb36\u214e]/, /^[\ufb38-\ufb3c\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufbb1\u2d6f]/, /^[\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\u2e2f]/, /^[\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\u3400]/, /^[\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\u4db5]/, /^[\uffda-\uffdc\u4e00\u9fc3\uac00\ud7a3\ufb1d\ufb3e]/];

        function A(J, E) {
            var D = i,
                G = z.lastIndexOf("\n", D),
                F = 1,
                I = D - (G + 1),
                H = {
                    message: J
                };
            while (G !== -1) {
                F += 1;
                G = z.lastIndexOf("\n", G - 1)
            }
            if (E === undefined) {
                H.position = D;
                H.line = F;
                H.character = I
            } else {
                H.endPosition = D;
                H.endLine = F;
                H.endCharacter = I;
                D = D - E + 1;
                G = z.lastIndexOf("\n", D);
                F = 1;
                I = D - (G + 1);
                while (G !== -1) {
                    F += 1;
                    G = z.lastIndexOf("\n", G - 1)
                }
                H.startPosition = D;
                H.startLine = F;
                H.startCharacter = I
            }
            e.push(H)
        }

        function d(F, E) {
            var D;
            if (F.length !== 1) {
                return false
            }
            for (D = 0; D < E.length; D += 1) {
                if (E[D].test(F) === true) {
                    return true
                }
            }
            return false
        }

        function k(D) {
            if (D === undefined) {
                D = 1
            }
            i -= D;
            q = (i > z.length)
        }

        function n(E) {
            if (E === undefined) {
                E = 1
            }
            var D = z.substring(i, i + E);
            i += E;
            q = (i > z.length);
            return D
        }

        function s(D) {
            if (D === undefined) {
                D = 1
            }
            return z.substring(i, i + D)
        }

        function t() {
            var D = n();
            while (d(D, c) && !q) {
                D = n()
            }
            if (q) {
                return false
            }
            k();
            return true
        }

        function y() {
            var D = "";
            do {
                switch (s()) {
                    case "0":
                    case "1":
                    case "2":
                    case "3":
                    case "4":
                    case "5":
                    case "6":
                    case "7":
                    case "8":
                    case "9":
                        D += n();
                        break;
                    default:
                        return D
                }
            } while (!q);
            return D
        }

        function p() {
            var D = /^\\u[0-9a-fA-F]{4}$/;
            if (D.test(s(6)) === false) {
                return false
            }
            return n(6)
        }

        function j() {
            var D = "";

            function E() {
                if (l === "\\") {
                    k();
                    l = p();
                    if (l === false) {
                        l = n();
                        A("Expected unicode escape sequence.");
                        return false
                    }
                    return true
                }
                return (l === "$" || l === "_" || d(l, m))
            }
            l = n();
            if (E() === false) {
                throw new Error("Identifier must start with a unicode letter, dollar sign, underscore, or unicode escape sequence.")
            }
            D += l;
            do {
                l = n();
                if (E() || d(l, f) || d(l, r) || d(l, h)) {
                    D += l
                } else {
                    k();
                    if (VIS.reserved.indexOf(D) !== -1) {
                        A("Reserved words may not be identifiers.", D.length)
                    }
                    return D
                }
            } while (!q);
            if (VIS.reserved.indexOf(D) !== -1) {
                A("Reserved words may not be identifiers.", D.length)
            }
            return D
        }

        function B(F) {
            if (F === undefined) {
                F = '"'
            }
            var E = "",
                D = false;
            n();
            do {
                l = n();
                if (q) {
                    throw new Error("Unexpected end of input.")
                }
                if (l === F) {
                    D = true
                } else {
                    if (l === "\\") {
                        l = n();
                        if (q) {
                            throw new Error("Unexpected end of input.")
                        } else {
                            if (l === F) {
                                E += F
                            } else {
                                if ((l === "'" && F === '"') || (l === '"' && F === "'")) {
                                    A("Unnecessary escapement.", 2);
                                    E += F
                                } else {
                                    switch (l) {
                                        case "\\":
                                            E += "\\";
                                            break;
                                        case "/":
                                            E += "/";
                                            break;
                                        case "b":
                                            E += "\b";
                                            break;
                                        case "f":
                                            E += "\f";
                                            break;
                                        case "n":
                                            E += "\n";
                                            break;
                                        case "r":
                                            E += "\r";
                                            break;
                                        case "t":
                                            E += "\t";
                                            break;
                                        case "u":
                                            k(2);
                                            l = p();
                                            if (l === false) {
                                                E += n(2);
                                                A("Invalid unicode escape sequence.", 2)
                                            } else {
                                                E += l
                                            }
                                            break;
                                        default:
                                            A("Invalid escape sequence.", 2);
                                            E += "\\" + l
                                    }
                                }
                            }
                        }
                    } else {
                        if (d(l, w)) {
                            A("Character is not legal in this position. Use an escape sequence to represent this character.")
                        }
                        E += l
                    }
                }
            } while (!D);
            return E
        }

        function x() {
            var F, E, G = {},
                D = false;
            n();
            if (t() === false) {
                throw new Error("Unexpected end of input.")
            }
            l = s();
            if (l === "}") {
                n();
                return G
            }
            do {
                if (l !== '"') {
                    F = (l === "'") ? B("'") : j();
                    E = F.length + ((l === '"' || l === "'") ? 2 : 0);
                    A("Object properties must be enclosed in double quotes.", E)
                } else {
                    F = B();
                    E = F.length + 2
                }
                if (q) {
                    throw new Error("Unexpected end of input.")
                }
                if (G.hasOwnProperty(F)) {
                    A("Duplicate property name: " + F, E)
                }
                if (t() === false) {
                    throw new Error("Unexpected end of input.")
                }
                l = n();
                if (l !== ":") {
                    throw new Error("Expecting a colon to separate properties from values.")
                }
                if (t() === false) {
                    throw new Error("Unexpected end of input.")
                }
                l = s();
                if (l === "," || l === "}") {
                    throw new Error("All properties must have values.")
                }
                G[F] = a();
                if (q) {
                    throw new Error("Unexpected end of input.")
                }
                if (t() === false) {
                    throw new Error("Unexpected end of input.")
                }
                l = n();
                if (l === "}") {
                    D = true
                } else {
                    if (l !== ",") {
                        throw new Error("Object properties must be separated by commas.")
                    } else {
                        if (t() === false) {
                            throw new Error("Unexpected end of input.")
                        }
                    }
                }
                l = s()
            } while (!D);
            return G
        }

        function b() {
            var E = [],
                D = false;
            n();
            if (t() === false) {
                throw new Error("Unexpected end of input.")
            }
            l = s();
            if (l === "]") {
                n();
                return E
            }
            do {
                while (l === ",") {
                    n();
                    A("Empty array values are not allowed.");
                    if (t() === false) {
                        throw new Error("Unexpected end of input.")
                    }
                    l = s();
                    if (l === "]") {
                        n();
                        return E
                    }
                }
                E[E.length] = a();
                if (q) {
                    throw new Error("Unexpected end of input.")
                }
                if (t() === false) {
                    throw new Error("Unexpected end of input.")
                }
                l = n();
                if (l === "]") {
                    D = true
                } else {
                    if (l !== ",") {
                        throw new Error("Array values must be separated by commas.")
                    } else {
                        if (t() === false) {
                            throw new Error("Unexpected end of input.")
                        }
                    }
                }
                l = s()
            } while (!D);
            return E
        }

        function C() {
            l = s();
            var E = /^[1-9]$/,
                D = "";
            if (l === "-") {
                D += n();
                l = s();
                if (q) {
                    throw new Error("Unexpected end of input.")
                }
            }
            if (E.test(l)) {
                D += y();
                if (q) {
                    return Number(D)
                }
                l = s()
            } else {
                if (l === "0") {
                    D += n();
                    if (q) {
                        return Number(D)
                    }
                    l = s();
                    if (E.test(l)) {
                        A("Invalid leading zero.");
                        D += y();
                        if (q) {
                            return Number(D)
                        }
                        l = s()
                    }
                } else {
                    throw new Error("Expecting a number.")
                }
            }
            if (l === ".") {
                D += n();
                l = y();
                if (l.length === 0) {
                    A("Invalid decimal point.")
                }
                D += l;
                l = s()
            }
            if (l === "e" || l === "E") {
                D += n();
                l = s();
                if (l === "+" || l === "-") {
                    D += n()
                }
                l = y();
                if (l.length === 0) {
                    throw new Error("Invalid exponent.")
                }
                D += l
            }
            return Number(D)
        }
        a = function() {
            var D;
            l = s();
            if (l === "{") {
                return x()
            }
            if (l === "[") {
                return b()
            }
            if (l === '"') {
                return B()
            }
            if (l === "'") {
                D = B("'");
                A("Strings must be delimited by double quotes.", D.length + 2);
                return D
            }
            if (l === "-" && s(9) === "-Infinity") {
                n(9);
                A('"-Infinity" is not a legal JSON literal.', 9);
                return -Infinity
            }
            if (u.test(l)) {
                return C()
            }
            if (l === "t" && s(4) === "true") {
                n(4);
                return true
            }
            if (l === "f" && s(5) === "false") {
                n(5);
                return false
            }
            if (l === "n" && s(4) === "null") {
                n(4);
                return null
            }
            if (l === "u" && s(9) === "undefined") {
                n(9);
                A('"undefined" is not a legal JSON literal.', 9);
                return undefined
            }
            if (l === "N" && s(3) === "NaN") {
                n(3);
                A('"NaN" is not a legal JSON literal.', 3);
                return NaN
            }
            if (l === "I" && s(8) === "Infinity") {
                n(8);
                A('"Infinity" is not a legal JSON literal.', 8);
                return Infinity
            }
            throw new Error("Unexpected content.")
        };
        this.reset();
        if (q) {
            return undefined
        }
        try {
            g = false;
            l = a()
        } catch (v) {
            g = true;
            A(v.message);
            A("Stopping: unable to continue.");
            l = v
        }
        if (g === false && i !== z.length) {
            o = n(z.length - i);
            A("Unexpected content.", o.length);
            k(o.length)
        }
        e = e.sort(function(E, D) {
            E = E.hasOwnProperty("startPosition") ? E.startPosition : E.position;
            D = D.hasOwnProperty("startPosition") ? D.startPosition : D.position;
            return E - D
        });
        if (e.length === 0) {
            this.data.validateOut.innerHTML = "<h3>Valid JSON</h3>";
            return l
        }
        o = '<h3 class="ERR">Invalid JSON</h3><ol>' + e.map(function(F, D) {
            if (F.message === "Stopping: unable to continue") {
                return '<li class="ERR">' + F.message + "</li>"
            }
            var E = F.hasOwnProperty("startPosition") ? (F.startLine !== F.endLine) ? '<li>From line <span class="NUMBER">{startLine}</span>, character <span class="NUMBER">{startCharacter}</span> to line <span class="NUMBER">{endLine}</span>,  character <span class="NUMBER">{endCharacter}</span>: <span class="ERR" id="ERR_{idx}">{message}</span></li>' : '<li>On line <span class="NUMBER">{startLine}</span>, characters <span class="NUMBER">{startCharacter}</span>-<span class="NUMBER">{endCharacter}</span>: <span class="ERR" id="ERR_{idx}">{message}</span></li>' : '<li>On line <span class="NUMBER">{line}</span>, character <span class="NUMBER">{character}</span>: <span class="ERR" id="ERR_{idx}">{message}</span></li>';
            return Lang.substitute(E, {
                idx: D.toString(),
                startLine: VIS.formatSize(F.startLine),
                startCharacter: VIS.formatSize(F.startCharacter),
                endLine: VIS.formatSize(F.endLine),
                endCharacter: VIS.formatSize(F.endCharacter),
                message: VIS.html(F.message),
                line: VIS.formatSize(F.line),
                character: VIS.formatSize(F.character)
            })
        }).join("") + "</ol><hr /><pre>" + VIS.html(z) + " </pre><hr />";
        this.data.validateOut.innerHTML = o;
        o = this.data.validateOut.getElementsByTagName("hr")[0].nextSibling;
        e.forEach(function(J, K) {
            var E, G, I, F, L, H, D = o.firstChild;
            if (J.hasOwnProperty("startPosition")) {
                E = J.startPosition - 1;
                G = J.endPosition
            } else {
                E = J.position - 1;
                G = J.position
            }
            if (YAHOO.env.ua.ie) {
                E -= (J.startLine - 1);
                G -= (J.startLine - 1)
            }
            F = o.appendChild(document.createTextNode(D.nodeValue.substring(0, E)));
            L = o.appendChild(document.createElement("span"));
            H = o.appendChild(document.createTextNode(D.nodeValue.substring(G)));
            L.appendChild(document.createTextNode(D.nodeValue.substring(E, G)));
            L.className = "ERR";
            o.removeChild(D);
            I = Dom.getRegion(L);
            o.appendChild(D);
            o.removeChild(F);
            o.removeChild(L);
            o.removeChild(H);
            L.removeChild(L.firstChild);
            L.className = "HIGHLIGHT";
            L.id = "HIGHLIGHT_" + K.toString();
            this.data.validateOut.appendChild(L);
            L.style.width = I.width + "px";
            L.style.height = I.height + "px";
            Dom.setXY(L, I);
            Dom.setStyle(L, "opacity", "0.5");
            J.highlight = L
        }, this);
        return l
    },
    collapseAll: function() {
        this.expandOrCollapse("-")
    },
    expandAll: function() {
        this.expandOrCollapse("+")
    },
    expandOrCollapse: function(c) {
        var a, e, b = this.data.output.getElementsByTagName("caption"),
            d = [];
        for (a = 0; a < b.length; a += 1) {
            e = b[a].firstChild.nodeValue.substring(1, 2);
            if (e === c) {
                d[d.length] = b[a]
            }
        }
        d.forEach(HTML.toggleArea)
    },
    removeCRLF: function() {
        this.data.input.value = this.data.input.value.replace(/^\s\s*/, "").replace(/\s\s*$/, "").replace(/\n/g, "")
    },
    decodeURI: function() {
        var a = this.data.input;
        a.value = decodeURIComponent(a.value)
    },
    trimToJSON: function() {
        var b, f, i, h = this.data.input,
            j = h.value,
            e = null,
            g = null,
            k = null,
            d = 0,
            a = [];
        j = j.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
        for (i = 0; i < j.length; i++) {
            f = j.charCodeAt(i);
            switch (f) {
                case 34:
                case 39:
                    if (g === null) {
                        break
                    }
                    if (e) {
                        if (f === e && j.charCodeAt(i - 1) !== 92) {
                            e = null
                        }
                    } else {
                        e = f
                    }
                    break;
                case 123:
                case 91:
                    if (e) {
                        break
                    }
                    if (g === null) {
                        g = f;
                        k = g + 2;
                        d++;
                        b = i
                    } else {
                        if (f === g) {
                            d++
                        }
                    }
                    break;
                case 125:
                case 93:
                    if (e) {
                        break
                    }
                    if (f === k) {
                        d--;
                        if (d === 0) {
                            a.push(j.substring(b, i + 1));
                            g = null
                        }
                    }
                    break
            }
        }
        switch (a.length) {
            case 0:
                window.alert("No braces found.");
                return;
            case 1:
                this.data.input.value = a[0];
                return;
            default:
                if (window.confirm("Multiple potential objects found.\nWrap all objects in an array?")) {
                    this.data.input.value = "[" + a.join(",") + "]"
                }
                return
        }
    },
    formatSize: function(c) {
        if (isNaN(c) || c.length === 0) {
            return ""
        }
        var b = c.toString(),
            a = b.length - 3;
        while (a >= 1) {
            b = b.substring(0, a) + "," + b.substring(a, b.length);
            a -= 3
        }
        return b
    },
    html: function(a) {
        return a.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    },
    variableRE: /^[a-z_$][\w$]*$/i,
    reserved: ["abstract", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue", "debugger", "default", "delete", "do", "double", "else", "enum", "export", "extends", "false", "final", "finally", "float", "for", "function", "goto", "if", "implements", "import", "in", "instanceof", "int", "interface", "long", "native", "new", "null", "package", "private", "protected", "public", "return", "short", "static", "super", "switch", "synchronized", "this", "throw", "throws", "transient", "true", "try", "typeof", "var", "void", "volatile", "while", "with"],
    variable: function(a) {
        if (this.variableRE.test(a) === true && this.reserved.indexOf(a) === -1) {
            return "." + a
        }
        return '[<span class="STRING">' + this.html(Lang.JSON.stringify(a)) + "</span>]"
    },
    fixTableWidths: function() {
        var b, c, a, e, d = this.data.output.getElementsByTagName("caption");
        for (b = 0; b < d.length; b += 1) {
            a = d[b].parentNode.offsetWidth;
            e = d[b].scrollWidth + 4;
            c = d[b].parentNode.parentNode;
            if (c.nodeName.toLowerCase() === "td") {
                c.style.width = Math.max(a, e).toString() + "px"
            }
        }
    }
};
PRETTY = {
    indent: 0,
    newLine: function() {
        var a, b = "<br />";
        for (a = 0; a < this.indent; a++) {
            b += "\u00A0\u00A0\u00A0\u00A0"
        }
        return b
    },
    display: function(b, a) {
        return Lang.isArray(b) ? this.array(b, a) : Lang.isBoolean(b) ? this.bool(b, a) : Lang.isFunction(b) ? this.func(b, a) : Lang.isNull(b) ? '<span id="p' + a + '" title="null" class="NULL">null</span>' : Lang.isNumber(b) ? '<span id="p' + a + '" title="Number" class="NUMBER">' + b.toString() + "</span>" : Lang.isString(b) ? this.string(b, a) : Lang.isUndefined(b) ? '<span id="p' + a + '" title="undefined" class="UNDEF">undefined</span>' : (b instanceof Error) ? this.err(b, a) : (b instanceof Date) ? this.date(b, a) : (b instanceof RegExp) ? HTML.regExp(b, a) : Lang.isObject(b) ? this.obj(b, a) : isNaN(b) ? '<span id="p' + a + '" title="NaN" class="ERR">NaN</span>' : (b === Infinity) ? '<span id="p' + a + '" title="Infinity" class="ERR">Infinity</span>' : '<span id="p' + a + '" class="IDK">[Unknown Data Type]</span>'
    },
    array: function(c, e) {
        var b, d = [];
        this.indent++;
        for (b = 0; b < c.length; b++) {
            VIS.paths.push(VIS.paths[e] + '[<span class="NUMBER">' + b + "</span>]");
            d[b] = this.display(c[b], VIS.paths.length - 1)
        }
        d = this.newLine() + d.join("," + this.newLine());
        this.indent--;
        return (c.length) ? '<span id="p' + e + '" class="ARRAY">[' + d + this.newLine() + "]</span>" : '<span id="p' + e + '" class="ARRAY">[\u00A0]</span>'
    },
    bool: function(a, c) {
        return (a) ? '<span id="p' + c + '" title="Boolean" class="BOOL">true</span>' : '<span id="p' + c + '" title="Boolean" class="BOOL">false</span>'
    },
    func: function(c, d) {
        var a, b = c.toString();
        if (VIS.data.trunc.checked) {
            a = b.indexOf("{") + 50;
            if (a < b.length) {
                b = VIS.html(b.substring(0, a)) + "\u2026\n}";
                b = b.replace(/\n/g, this.newLine());
                return '<code id="p' + d + '" title="Function (truncated)" class="FUNC">' + b + "</code>"
            }
        }
        b = VIS.html(b).replace(/\n/g, this.newLine());
        return '<code id="p' + d + '" title="Function" class="FUNC">' + b + "</code>"
    },
    string: function(a, b) {
        if (VIS.data.dates.checked && VIS.dateRE.test(a)) {
            return this.date(a, b)
        }
        a = Lang.JSON.stringify(a);
        if (VIS.data.trunc.checked && a.length > 68) {
            a = a.substring(1, a.length - 1);
            a = a.substring(0, 67) + "\u2026";
            a = '"' + a + '"'
        }
        return '<span id="p' + b + '" title="String" class="STRING">' + VIS.html(a) + "</span>"
    },
    err: function(b, a) {
        if (b.message === "parseJSON") {
            return '<span id="p' + a + '" title="Error" class="ERR">Invalid JSON</span>'
        }
        VIS.paths.push(VIS.paths[a] + ".message");
        return '<span id="p' + a + '" title="Error" class="ERR">new Error(' + this.string(b.message, VIS.paths.length - 1) + ")</span>"
    },
    date: function(b, a) {
        return '<span id="p' + a + '" title="Date" class="DATE">' + Lang.JSON.stringify(b) + "</span>"
    },
    obj: function(d, c) {
        var b, a = [];
        this.indent++;
        for (b in d) {
            if (d.hasOwnProperty(b)) {
                VIS.paths.push(VIS.paths[c] + VIS.variable(b));
                a.push('<span id="px' + (VIS.paths.length - 1) + '">' + Lang.JSON.stringify(b) + ": " + this.display(d[b], VIS.paths.length - 1) + "</span>")
            }
        }
        if (a.length) {
            a = this.newLine() + a.join("," + this.newLine())
        }
        this.indent--;
        return (a.length) ? '<span id="p' + c + '" class="OBJ">{' + a + this.newLine() + "}</span>" : '<span id="p' + c + '" class="OBJ">{\u00A0}</span>'
    }
};
HTML = {
    toggleArea: function(d) {
        var a, b = d.parentNode,
            c = d.firstChild.nodeValue.substring(1, 2);
        if (c === "-") {
            if (b.tHead) {
                b.tHead.style.display = "none"
            }
            for (a = 0; a < b.tBodies.length; a += 1) {
                b.tBodies[a].style.display = "none"
            }
            d.firstChild.nodeValue = "[+]" + d.firstChild.nodeValue.substring(3)
        } else {
            if (b.tHead) {
                b.tHead.style.display = ""
            }
            for (a = 0; a < b.tBodies.length; a += 1) {
                b.tBodies[a].style.display = ""
            }
            d.firstChild.nodeValue = "[-]" + d.firstChild.nodeValue.substring(3)
        }
    },
    display: function(b, a) {
        return Lang.isArray(b) ? VIS.data.dataTables.checked ? this.structure(b, a) : this.array(b, a) : Lang.isBoolean(b) ? this.bool(b, a) : Lang.isFunction(b) ? this.func(b, a) : Lang.isNull(b) ? '<span id="p' + a + '" title="null" class="NULL">null</span>' : Lang.isNumber(b) ? '<span id="p' + a + '" title="Number" class="NUMBER">' + b.toString() + "</span>" : Lang.isString(b) ? this.string(b, a) : Lang.isUndefined(b) ? '<span id="p' + a + '" title="undefined" class="UNDEF">undefined</span>' : (b instanceof Error) ? this.err(b, a) : (b instanceof Date) ? this.date(b, a) : (b instanceof RegExp) ? this.regExp(b, a) : Lang.isObject(b) ? VIS.data.dataTables.checked ? this.structure(b, a) : this.obj(b, a) : isNaN(b) ? '<span id="p' + a + '" title="NaN" class="ERR">NaN</span>' : (b === Infinity) ? '<span id="p' + a + '" title="Infinity" class="ERR">Infinity</span>' : '<span id="p' + a + '" class="IDK">[Unknown Data Type]</span>'
    },
    array: function(d, e) {
        var c, b = "";
        for (c = 0; c < d.length; c++) {
            VIS.paths.push(VIS.paths[e] + '[<span class="NUMBER">' + c + "</span>]");
            b += '<tr id="p' + (VIS.paths.length - 1) + '"><th>' + c + "</th><td>" + this.display(d[c], VIS.paths.length - 1) + "</td></tr>"
        }
        return (b.length) ? '<table id="p' + e + '" class="ARRAY"><caption>[-] Array, ' + VIS.formatSize(d.length) + (d.length === 1 ? " item" : " items") + "</caption><tbody>" + b + "</tbody></table>" : '<span id="p' + e + '" title="Array" class="ARRAY">[ Empty Array ]</span>'
    },
    bool: function(a, c) {
        return (a) ? '<span id="p' + c + '" title="Boolean" class="BOOL">true</span>' : '<span id="p' + c + '" title="Boolean" class="BOOL">false</span>'
    },
    string: function(b, c) {
        if (b.length === 0) {
            return '<span id="p' + c + '" title="String" class="EMPTY">[zero-length string]</span>'
        }
        if (VIS.data.dates.checked && VIS.dateRE.test(b)) {
            return this.date(Lang.JSON.stringToDate(b), c)
        }
        var a = VIS.data.preserve.checked ? "pre" : "span";
        if (VIS.data.trunc.checked && b.length > 70) {
            b = b.substring(0, 70) + "\u2026"
        }
        return "<" + a + ' id="p' + c + '" title="String" class="STRING">' + VIS.html(b) + "</" + a + ">"
    },
    regExp: function(b, c) {
        var a = "/" + VIS.html(b.source) + "/";
        if (b.global) {
            a += "g"
        }
        if (b.ignoreCase) {
            a += "i"
        }
        if (b.multiline) {
            a += "m"
        }
        return '<span id="p' + c + '" title="RegEx" class="REGEXP">' + a + "</span>"
    },
    obj: function(d, c) {
        var b, a = [];
        for (b in d) {
            if (d.hasOwnProperty(b)) {
                VIS.paths.push(VIS.paths[c] + VIS.variable(b));
                a.push('<tr id="px' + (VIS.paths.length - 1) + '"><th>' + VIS.html(b) + "</th><td>" + this.display(d[b], VIS.paths.length - 1) + "</td></tr>")
            }
        }
        return (a.length) ? '<table id="p' + c + '" class="OBJ"><caption>[-] Object, ' + VIS.formatSize(a.length) + (a.length === 1 ? " property" : " properties") + "</caption><tbody>" + a.join("") + "</tbody></table>" : '<span id="p' + c + '" title="Object" class="OBJ">{ Empty Object }</span>'
    },
    date: function(h, g) {
        if (isNaN(h)) {
            return '<span id="p' + g + '" title="Date" class="ERR">Invalid Date</span>'
        }

        function f(d) {
            var i = d.toString();
            return (d < 10) ? "0" + i : i
        }

        function e(o, m, d, k, n, j) {
            var i = (k === 0) ? 12 : (k > 12) ? k - 12 : k,
                l = (k > 11) ? "PM" : "AM";
            return (o + "-" + f(m) + "-" + f(d) + " " + f(i) + ":" + f(n) + ":" + f(j) + " " + l)
        }
        var b = e(h.getFullYear(), h.getMonth() + 1, h.getDate(), h.getHours(), h.getMinutes(), h.getSeconds()),
            c = e(h.getUTCFullYear(), h.getUTCMonth() + 1, h.getUTCDate(), h.getUTCHours(), h.getUTCMinutes(), h.getUTCSeconds()),
            a = c + " UTC (" + b + " Local)";
        return '<span id="p' + g + '" title="Date" class="DATE">' + a + "</span>"
    },
    err: function(b, a) {
        if (b.message === "parseJSON") {
            return '<span id="p' + a + '" title="Error" class="ERR">Invalid JSON</span>'
        }
        return '<span id="p' + a + '" title="Error" class="ERR">' + VIS.html(b.message) + "</span>"
    },
    func: function(c, d) {
        var a, b = c.toString();
        if (VIS.data.trunc.checked) {
            a = b.indexOf("{") + 50;
            if (a < b.length) {
                b = VIS.html(b.substring(0, a)) + "\u2026<br />}";
                return '<code id="p' + d + '" title="Function (truncated)" class="FUNC">' + b + "</code>"
            }
        }
        return '<code id="p' + d + '" title="Function" class="FUNC">' + VIS.html(b) + "</code>"
    },
    structure: function(c, b) {
        var a = new STRUCTURE(c);
        if (a.isValid(2 / 3) === false) {
            return Lang.isArray(c) ? this.array(c, b) : this.obj(c, b)
        }
        return a.render(c, b)
    }
};
STRUCTURE = function(a) {
    this.footPrints = [];
    this.length = 0;
    this.footPrint = this.scanObject(a)
};
STRUCTURE.Footprint = function(a) {
    this.keys = a.slice();
    this.count = 1
};
STRUCTURE.Footprint.prototype = {
    equals: function(b) {
        var a;
        if (this.keys.length === b.length) {
            for (a = 0; a < b.length; a++) {
                if (this.keys[a] !== b[a]) {
                    return false
                }
            }
        } else {
            return false
        }
        return true
    },
    render: function(f, e) {
        var d = this.keys,
            a = 0,
            c = d.length,
            b = [];
        if (f) {
            for (; a < c; a++) {
                VIS.paths.push(VIS.paths[e] + VIS.variable(d[a]));
                b[a] = '<td id="px' + (VIS.paths.length - 1) + '">' + HTML.display(f[d[a]], VIS.paths.length - 1) + "</td>"
            }
        } else {
            for (; a < c; a++) {
                b[a] = "<th>" + VIS.html(d[a]) + "</th>"
            }
        }
        return b.join("")
    }
};
STRUCTURE.isObject = function(a) {
    return (Lang.isObject(a) === true && Lang.isArray(a) === false && Lang.isFunction(a) === false && a instanceof Error === false && a instanceof Date === false && a instanceof RegExp === false)
};
STRUCTURE.numericSort = function(d, c) {
    return d - c
};
STRUCTURE.getKeys = function(c) {
    var b = [],
        d;
    for (d in c) {
        if (c.hasOwnProperty(d)) {
            b[b.length] = d
        }
    }
    if (Lang.isArray(c)) {
        b.sort(STRUCTURE.numericSort)
    } else {
        b.sort()
    }
    return b
};
STRUCTURE.prototype = {
    scanObject: function(d) {
        var a, c, b = 0;
        for (a in d) {
            if (d.hasOwnProperty(a)) {
                b++;
                if (STRUCTURE.isObject(d[a])) {
                    c = STRUCTURE.getKeys(d[a]);
                    if (c.length > 0) {
                        this.addFootPrint(c)
                    }
                }
            }
        }
        this.length += b;
        return this.getMode()
    },
    addFootPrint: function(b) {
        var a, c = this.footPrints;
        for (a = 0; a < c.length; a++) {
            if (c[a].equals(b)) {
                c[a].count++;
                return true
            }
        }
        c[c.length] = new STRUCTURE.Footprint(b);
        return true
    },
    getMode: function() {
        var b, c = 0,
            a = null,
            d = this.footPrints;
        for (b = 0; b < d.length; b++) {
            if (d[b].count > c) {
                a = d[b];
                c = a.count
            }
        }
        return a
    },
    isValid: function(a) {
        return (this.length > 1 && this.footPrint !== null && this.footPrint.count >= (this.length * a))
    },
    render: function(d, l) {
        var h, j, k, c, e = VIS.html,
            g = STRUCTURE.getKeys(d),
            i = this.footPrint.keys.length,
            b = [],
            a = 0,
            f = Lang.isArray(d);
        b[a++] = '<table id="p' + l + '" class="ARRAY"><caption>[-] ' + (f ? "Array" : "Object") + " data structure, " + VIS.formatSize(g.length) + (f ? " items" : " properties") + "</caption><thead><tr><th>[key]</th>";
        b[a++] = this.footPrint.render();
        b[a++] = "</tr></thead><tbody>";
        l = VIS.paths[l];
        for (h = 0; h < g.length; h++) {
            k = d[g[h]];
            j = STRUCTURE.getKeys(k);
            c = (f && isNaN(parseInt(g[h], 10)) === false) ? '[<span class="NUMBER">' + g[h] + "</span>]" : VIS.variable(g[h]);
            VIS.paths.push(l + c);
            if (this.footPrint.equals(j)) {
                b[a++] = '<tr id="p' + (VIS.paths.length - 1) + '"><th' + (f ? ' class="NUMBER">' : ">") + e(g[h]) + "</th>";
                b[a++] = this.footPrint.render(k, VIS.paths.length - 1);
                b[a++] = "</tr>"
            } else {
                b[a++] = '<tr id="p' + (VIS.paths.length - 1) + '"><th><em' + (f ? ' class="NUMBER">' : ">") + e(g[h]) + '</em></th><td colspan="' + i + '">';
                b[a++] = HTML.display(k, VIS.paths.length - 1);
                b[a++] = "</td></tr>"
            }
        }
        b[a++] = "</tbody></table>";
        return b.join("")
    }
};
QUERYSTRING = (function() {
    function b(d) {
        d = String(d);
        if (d.substring(0, 1) === "?") {
            d = d.substring(1)
        }
        d = d.split("&");
        var c = d.length;
        while (c--) {
            d[c] = d[c].split("=");
            if (d[c].length === 2) {
                d[c][0] = decodeURIComponent(d[c][0]);
                d[c][1] = decodeURIComponent(d[c][1])
            } else {
                d.splice(c, 1)
            }
        }
        return d
    }

    function a(c) {
        c = (c === null || c === undefined) ? document.location.search : String(c);
        c = b(c);
        this.get = function(f) {
            f = f.toUpperCase();
            var d, e = [];
            for (d = 0; d < c.length; d += 1) {
                if (c[d][0].toUpperCase() === f) {
                    e.push(c[d][1])
                }
            }
            return e
        };
        this.set = function(f, e) {
            f = String(f);
            if ($.isArray(e) === false) {
                e = [e]
            }
            var d, g = f.toUpperCase();
            d = e.length;
            while (d--) {
                if (e[d] === null || e[d] === undefined) {
                    e.splice(d, 1)
                } else {
                    e[d] = String(e[d])
                }
            }
            d = c.length;
            while (d--) {
                if (c[d][0].toUpperCase() === g) {
                    c.splice(d, 1)
                }
            }
            for (d = 0; d < e.length; d += 1) {
                c.push([f, e[d]])
            }
            return this
        };
        this.toString = function() {
            if (c.length === 0) {
                return ""
            }
            var d, e = [];
            for (d = 0; d < c.length; d += 1) {
                e.push(encodeURIComponent(c[d][0]) + "=" + encodeURIComponent(c[d][1]))
            }
            return "?" + e.join("&")
        }
    }
    return a
}());
COOKIE = {
    set: function(b, d) {
        var a = new Date(),
            c = encodeURIComponent(b) + "=" + encodeURIComponent(d);
        a.setFullYear(a.getFullYear() + 1);
        a = a.toGMTString();
        c += "; expires=" + a + "; path=/";
        document.cookie = c;
        return c
    },
    get: function(b) {
        var c, d = document.cookie.split(/;\s*/),
            a = d.length;
        while (a--) {
            c = d[a];
            if (c.indexOf(b) === 0) {
                return c.substring(b.length + 1)
            }
        }
        return null
    },
    del: function(b) {
        var a = new Date(),
            c = encodeURIComponent(b) + "=";
        a.setDate(a.getDate() - 1);
        a = a.toGMTString();
        c += "; expires=" + a + "; path=/";
        document.cookie = c;
        return c
    }
};
