/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Created by lsd on 2017/2/17.
 */
!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
    __webpack_require__(7);
    var rev_tool = __webpack_require__(8);
    var game_obj = __webpack_require__(9);
    $(function () {
        $('#select-board').modal({
            keyboard: false,
            backdrop: 'static'
        });
        $('#score-board').modal({
            keyboard: false,
            backdrop: 'static',
            show:false
        });
        $('#try-again').on('click',function () {
            window.location.href='/reversi/';
        });
        var canvas = document.getElementById('reversi');
        var rb=new rev_tool.reversi_board(canvas, 100,50,400,400);
        var go=new game_obj.reversi_game(rb);

        $('#DL-1').on('click', function () {go.level=5;$('#select-board').modal('hide');});
        $('#DL-2').on('click', function () {go.level=6;$('#select-board').modal('hide');});
        $('#DL-3').on('click', function () {go.level=7;$('#select-board').modal('hide');});

        go.end_function=function(){
            var score=this.rb.get_score();
            $('#black-c').html(score['black']);
            $('#white-c').html(score['white']);
            var title=score['black']>score['white']?'You Win!':'You Lose!';
            if(score['black']==score['white']) title='Draw!';
            $('#end-title').html(title);
            $('#score-board').modal('show');
        };

    })
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 4 */,
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".modal-dialog {\n  margin-top: 120px;\n}\n.modal-dialog .modal-content .modal-body {\n  padding: 10px 0 10px 0;\n  text-align: center;\n}\n.modal-dialog .modal-content .modal-body button {\n  margin-top: 10px;\n  margin-bottom: 10px;\n  font-size: 25px;\n  width: 150px;\n}\n", ""]);

// exports


/***/ }),
/* 6 */,
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../node_modules/css-loader/index.js??ref--1-1!./../../node_modules/less-loader/index.js!./reversi.less", function() {
			var newContent = require("!!./../../node_modules/css-loader/index.js??ref--1-1!./../../node_modules/less-loader/index.js!./reversi.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 8 */
/***/ (function(module, exports) {

/**
 * Created by lsd on 2017/2/20.
 */

function reversi_board(canvas, x, y, height, width){
    this.canvas=canvas;
    this.ctx=canvas.getContext('2d');
    this.x=x;
    this.y=y;
    this.height=height;
    this.width=width;
    this.ch_height = height/8;
    this.ch_width = width/8;
    this.radius=this.ch_height/2.5;
    this.stat=[];
    this.black_pos=[this.x+this.width+60, 200-this.radius/2];
    this.white_pos=[this.x+this.width+60, 300-this.radius/2];

    this.draw_board=function (){
        for(var i=0;i<8;i++){
            this.stat[i]=[];
            for(var j=0;j<8;j++){
                this.stat[i][j]=0;
                this.ctx.strokeRect(this.x+i*this.ch_width,this.y+j*this.ch_height,this.ch_width,this.ch_height);
            }
        }
    };

    this.draw_pieces=function (ch_x, ch_y, is_black) {
        if(ch_x>7||ch_x<0||ch_y>7||ch_y<0){
            return false;
        }
        this.ctx.beginPath();
        var px=this.x+(ch_x+0.5)*this.ch_width;
        var py=this.y+(ch_y+0.5)*this.ch_height;
        this.ctx.arc(px, py, this.radius, 0, Math.PI*2, true);
        if(is_black==1){
            this.ctx.fillStyle = "black";
            this.ctx.fill();
            this.stat[ch_x][ch_y]=1;
        }else{
            this.ctx.fillStyle = "white";
            this.ctx.fill();
            this.ctx.stroke();
            this.stat[ch_x][ch_y]=-1;
        }
        return this.stat;
    };

    this.cordinate_to_check=function (cx, cy) {
        if(cx>this.x+this.width||cx<this.x||cy>this.y+this.height||cy<this.y){
            console.log('out of boundary!');
            return false;
        }
        var re_x=cx-this.x;
        var re_y=cy-this.y;
        return {ch_x:parseInt(re_x/this.ch_width), ch_y:parseInt(re_y/this.ch_height)};
    };

    this.get_score=function () {
        var b_count=0;
        var w_count=0;
        for(var i=0;i<8;i++){
            for(var j=0;j<8;j++){
                if(this.stat[i][j]==1){
                    b_count++;
                }
                else if(this.stat[i][j]==-1){
                    w_count++;
                }
            }
        }
        return {black:b_count, white: w_count};
    };

    this.score_board=function(hand){
        this.ctx.fillStyle='white';
        this.ctx.fillRect(this.x+this.width+10,0,200,700);
        this.ctx.fillStyle='black';
        var score=this.get_score();
        var b_count=score['black'];
        var w_count=score['white'];
        this.ctx.font = "32px serif";
        this.ctx.fillText(b_count+'', this.x+this.width+120, 200);
        this.ctx.beginPath();
        this.ctx.arc(this.black_pos[0], this.black_pos[1], this.radius, 0, Math.PI*2, true);
        this.ctx.fill();
        this.ctx.fillText(w_count+'', this.x+this.width+120, 300);
        this.ctx.beginPath();
        this.ctx.arc(this.white_pos[0], this.white_pos[1], this.radius, 0, Math.PI*2, true);
        this.ctx.stroke();
        if(hand==1){
            this.ctx.beginPath();
            this.ctx.arc(this.black_pos[0], this.black_pos[1], this.radius*1.5, 0, Math.PI*2, true);
            this.ctx.stroke();
        }else{
            this.ctx.beginPath();
            this.ctx.arc(this.white_pos[0], this.white_pos[1], this.radius*1.5, 0, Math.PI*2, true);
            this.ctx.stroke();
        }
    };


    this.draw_board();
    // this.draw_pieces(0,7,-1);
    // this.draw_pieces(1,7,-1);
    // this.draw_pieces(2,7,-1);
    // this.draw_pieces(3,7,-1);
    // this.draw_pieces(4,7,-1);
    // this.draw_pieces(5,7,-1);
    // this.draw_pieces(1,6,1);
    // this.draw_pieces(5,6,1);
    this.draw_pieces(3,3,false);
    this.draw_pieces(3,4,true);
    this.draw_pieces(4,4,false);
    this.draw_pieces(4,3,true);
    this.score_board(1);
}


module.exports = {
    'reversi_board': reversi_board
};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

/**
 * Created by lsd on 2017/2/20.
 */

var DIRECTIONS=[[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1],[0,1]];
var UTILITY_MATRIX = [
    [99, -8, 8, 6, 6, 8, -8, 99],
    [-8, -24, -4, -3, -3, -4, -24, -8],
    [8, -4, 7, 4, 4, 7, -4, 8],
    [6, -3, 4, 0, 0, 4, -3, 6],
    [6, -3, 4, 0, 0, 4, -3, 6],
    [8, -4, 7, 4, 4, 7, -4, 8],
    [-8, -24, -4, -3, -3, -4, -24, -8],
    [99, -8, 8, 6, 6, 8, -8, 99]
];
var ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
var LOG=false;


function reversi_game(rb){
    this.rb=rb;
    this.role=1;
    this.best_action={}
    this.level=5;
    this.end_function=null;
    this.available_actions=function(state, role){
        var temp_i=0;
        var temp_j=0;
        var actions={};
        for(var j=0;j<8;j++) {
            for (var i = 0; i < 8; i++) {
                if (state[i][j] == 0) {
                    for (var dir = 0; dir < 8; dir++) {
                        var deleted_pieces = [];
                        temp_i = i + DIRECTIONS[dir][0];
                        temp_j = j + DIRECTIONS[dir][1];
                        while (this.in_boundary(temp_i, temp_j) && state[temp_i][temp_j] == role * -1) {
                            deleted_pieces.push([temp_i, temp_j]);
                            temp_i += DIRECTIONS[dir][0];
                            temp_j += DIRECTIONS[dir][1];
                        }
                        if (!this.in_boundary(temp_i, temp_j) || state[temp_i][temp_j] == 0 || (temp_i == i + DIRECTIONS[dir][0] && temp_j == j + DIRECTIONS[dir][1])) {
                            continue;
                        }
                        if (state[temp_i][temp_j] == role) {
                            if (typeof(actions['' + i + j]) != "undefined") {
                                for (var item in deleted_pieces) {
                                    actions['' + i + j]['actions'].push(deleted_pieces[item]);
                                }
                            } else {
                                actions['' + i + j] = {x: i, y: j, actions: deleted_pieces}
                            }
                        }
                    }
                }
            }

        }
        return actions;
    };

    this.in_boundary=function(tx,ty){
        return tx>=0&&tx<8&&ty>=0&&ty<8;
    };
    this.actions=this.available_actions(this.rb.stat, this.role);

    this.log=function (name, depth, value, alpha, beta) {
        if(LOG) {
            if(name!='pass'&&name!='root') {
                name = ALPHABET[parseInt(name[0])]+(1 + parseInt(name[1]));
            }
            value=value>9999?Infinity:value;
            value=value<-9999?-Infinity:value;
            beta=beta>9999?Infinity:beta;
            alpha=alpha<-9999?-Infinity:alpha;
            if(depth%2==0){
                console.log(name, depth, value, alpha, beta);
            }else{
                console.log(name, depth, -value, -beta, -alpha);
            }
        }
    };

    this.alpha_beta=function(stat, search_depth, limit_depth, role,alpha, beta,name){
        if(search_depth>=limit_depth){
            var vr=-1*this.cal_utility(stat, role);
            this.log(name, search_depth, -vr, alpha, beta);
            return vr;
        }
        var action=this.available_actions(stat, role);
        if(JSON.stringify(action)=='{}'){
            this.log(name, search_depth, -9999999, alpha, beta);
            var vp=-1*this.alpha_beta(stat,search_depth+1, limit_depth, -1*role, -1*beta,-1*alpha, 'pass');
            this.log(name, search_depth, -vp, alpha, beta);
            return vp;
        }
        var v=-9999999;
        for(var j=0;j<8;j++) {
            for (var i = 0; i < 8; i++) {
                var key=''+i+j;
                if(action.hasOwnProperty(key)) {
                    this.log(name, search_depth, v, alpha, beta);
                    var child_stat = this.gen_copy_next(stat, action[key], role);
                    var child_name = '' + action[key]['x'] + action[key]['y'];
                    var compare_v = this.alpha_beta(child_stat, search_depth + 1, limit_depth, -1 * role, -1 * beta, -1 * alpha, child_name);
                    if (v < compare_v) {
                        v = compare_v;
                        if (search_depth == 0) {
                            this.best_action = action[key];
                        }
                    }
                    if (v >= beta) {
                        this.log(name, search_depth, v, alpha, beta);
                        return -1 * v;
                    }
                    alpha = Math.max(alpha, v);
                }
            }
        }
        this.log(name, search_depth, v, alpha, beta);
        return -1*v;
    };

    this.gen_copy_next=function(stat, action,role){
        var temp_stat=[];
        for(var i=0;i<8;i++){
            temp_stat[i]=[];
            for(var j=0;j<8;j++) {
                temp_stat[i][j]=stat[i][j];
            }
        }
        temp_stat[action['x']][action['y']]=role;
        for(var ind in action['actions']){
            temp_stat[action['actions'][ind][0]][action['actions'][ind][1]]=role;
        }
        return temp_stat;
    };

    this.cal_utility=function(stat, role){
        var sum=0;
        for(var i=0;i<8;i++){
            for(var j=0;j<8;j++){
                sum+=stat[i][j]*UTILITY_MATRIX[i][j];
            }
        }
        return sum*role;
    };

    this.click_event=function(ev){
        var x, y;
        if (ev.layerX || ev.layerX == 0) {
            x = ev.layerX;
            y = ev.layerY;
        } else if (ev.offsetX || ev.offsetX == 0) { // Opera
            x = ev.offsetX;
            y = ev.offsetY;
        }
        var cor = this.rb.cordinate_to_check(x, y);
        if(this.actions[''+cor['ch_x']+cor['ch_y']]&&this.role==1) {
            this.execute_action(this.actions[''+cor['ch_x']+cor['ch_y']]);
            this.exec_ai_step();


        }
    };


    this.ai_step=function () {
        this.best_action={};
        this.alpha_beta(this.rb.stat, 0, this.level, this.role,-999999, 999999,'root');
        if(JSON.stringify(this.best_action)=='{}'){
            this.role=this.role*-1;
            this.actions=this.available_actions(this.rb.stat, this.role);
            if(JSON.stringify(this.actions)=='{}'){
                if(this.end_function){
                    this.end_function();
                }else{
                    alert('Game Over');
                }
            }
            return;
        }
        // console.log(this.best_action);
        this.execute_action(this.best_action);
        if(JSON.stringify(this.actions)=='{}'){
            this.role=this.role*-1;
            this.exec_ai_step();
        }
    };


    this.exec_ai_step=function () {
        var bind_this=this.ai_step.bind(this);
        setTimeout(bind_this,10);
    };


    this.execute_action=function(action){
        this.rb.draw_pieces(action['x'], action['y'], this.role);
        var action_list_ai=action['actions'];
        for(var piece_ai in action_list_ai){
            this.rb.draw_pieces(action_list_ai[piece_ai][0], action_list_ai[piece_ai][1], this.role);
        }
        this.role=this.role*-1;
        this.actions=this.available_actions(this.rb.stat, this.role);
        this.rb.score_board(this.role);
    };

    var ce = this.click_event.bind(this);
    this.rb.canvas.addEventListener('click', ce, false);
    if(JSON.stringify(this.actions)=='{}'){
        this.role=this.role*-1;
        this.ai_step();
    }

}






module.exports = {
    'reversi_game': reversi_game
};


/***/ }),
/* 10 */,
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3);


/***/ })
/******/ ]);