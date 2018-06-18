/**
 * Created by luneice on 2017/2/8.
 */
(function (window) {
	var AF = AF || {};
	//数据模型层
	AF.M = (function () {
		var Data = {
			"hotspot": [],
			"declare": {},
			"recommend": {},
			"feedback": {},
			"help": {}
		};

		//从服务器上获取数据
		var post = {
			"url": "php/hotspot.php",
			"data": null,
			"type": "post"
		};
		var fn = {
			"success": function (response) {
				Data.hotspot = response;
				AF.V.loadAnimate.hiden();//动画时长500ms
				var appendit = function () {
					var data = Data.hotspot;
					AF.V.renderHotspot(data);//将数据写入到页面
					clearTimeout(timer);
				};
				var timer = window.setInterval(appendit, 510);
			},
			"complete": function () {

			}
		};
		var request = function (post, fn) {
			$.ajax({
				type: post["type"],
				url: post["url"],
				async: true,
				data: post["data"],
				success: fn["success"],
				complete: fn["complete"]
			});
		};
		request(post, fn);
		return {
			//按键值取数据
			getData: function (key) {
				return Data[key];
			},
			//按键值存数据
			setData: function (key, value) {
				Data[key] = typeof Data[key] === "undefined" ? null : value;
			},
			//取全部数据
			fetchData: function () {
				return Data;
			},
			//存全部数据
			putData: function (value) {
				Data = value;
			},
			//请求数据参数有请求数据，回调函数
			request: request
		}
	})();

	//视图层
	AF.V = (function () {

		var deviceInfo = (function () {
			var client = document.documentElement;
			var width = client.clientWidth;//设备的宽度
			var height = client.clientHeight - 50;//设备的高度
			return {//设备信息
				height: height,
				width: width
			};
		})();

		var changeNavColor = function () {
			$(".nav-a--default").removeClass("nav-a--on");
			$(this).children(".nav-a--default").addClass("nav-a--on");
		};

		var changeIptColor = function () {
			$("#nav-ipt--search").css({"border-color": "#ff005d"}).fadeOut(750, "easeInQuint").fadeIn(150, "easeInQuint", function () {
				$("#nav-ipt--search").css({"border-color": "rgba(67, 167, 243, .9)"})
			});
		};

		//搜索按钮动画
		var navAnimate = {
			"search": {
				"shown": function () {
					$(".res-exhibit--list").slideUp(350);//隐藏导航栏目结果
					$(".nav-func--search").animate({//处理逻辑为：搜索按钮显示出来，隐藏导航栏目结果，异步向服务器发送获取热搜请求
						"width": "100%"
					}, 450, "easeInQuint", function () {
						$(".nav-btn--search").attr("id", "search");
						$(".nav-ipt--search").css({
							"width": deviceInfo["width"] - 130
						}).show(300, "easeInQuint");
					});
					AF.event.removeClickListener.searchshow();
				},
				"hiden": function () {
					$(".nav-btn--search").removeAttr("id");//移除search
					$(".nav-ipt--search").fadeOut(300, "easeInQuint", function () {
						$(".nav-func--search").animate({
							"width": "80px"
						}, 450, "easeInQuint");
					});
					AF.event.addClickListener.searchshow();
				}
			}
		};
		//数据加载动画
		var loadAnimate = {
			"shown": function () {
				$(".res-loading").fadeIn(150, "easeInQuint");
			},
			"hiden": function () {
				$(".res-loading").fadeOut(350, "easeInQuint");
			}
		};
		var html = {
			"hotspot": '<div class="res-hot--item"  id="{#id#}">' +
			'<a href="{#url#}" target="_blank">' +
			'<div class="res-hot--img"><img src="{#photo#}"></div>' +
			'<div class="res-hot--title">{#title#}</div>' +
			'</a>' +
			'</div>',
			"declare": null
		};
		//解析数据
		var format = function (str, data) {
			var html = '';
			if (data instanceof Array) {
				for (var i = 0, len = data.length; i < len; i++) {
					html += arguments.callee(str, data[i]);
				}
				return html;
			} else {
				return str.replace(/\{#(\w+)#\}/g, function (match, key) {
					return typeof data === 'string' ? data : (typeof data[key] === 'undefined' ? '' : data[key]);
				});
			}
		};
		//写入到document
		var write = {
			"hotspot": function (data) {
				var hotspotdoc = format(html["hotspot"], data);
				$(".res-exhibit--hotspot").append(hotspotdoc);
			}
		};
		var doms = {
			"searchresult": null,
			"hotspot": true,
			"declare": null,
			"recommend": null,
			"help": null,
			"feedback": null,
			"id": "hotspot"
		};//用来存储DOM的
		var dom = {//用来操作DOM
			"remove": function (id) {
				var selector = ".res-exhibit--" + id;
				doms[id] = $(selector);
				return $(selector);
			},
			"append": function (id) {
				if (id !== "searchresult") {
					$(".res-exhibit--list").append(doms[id][0]);//如果点击的不是结果栏目
				} else {
					$(".res-exhibit--container").append(doms[id][0]);//如果点击的是结果栏目
				}
			}
		};
		var handleDomStack = [dom.remove("hotspot")];//栈实现保存上一次的DOM
		var switchNavDom = function () {
			var id = $(this).attr("id");
			if (doms.id === id) {//点击的是当前栏目

			} else {//点击的是其他栏目,则切换导航栏
				if (doms.id === "searchresult") {
					$(".res-exhibit--list").show();
				}
				doms.id = id;
				if (doms[id] === null) {//处理的逻辑为把上一个移走，向服务器发送请求
					handleDomStack.pop().remove();//移除DOM函数出栈，移除DOM
					loadAnimate.shown();//加载动画开始加载
					AF.C.navEvent.switch(id);//发送数据请求
					handleDomStack.push(dom.remove(id));//当前DOM函数进栈，准备下一次移除DOM
				} else {
					handleDomStack.pop().remove();//移除DOM函数出栈，移除DOM
					dom.append(id);//将保存的DOM添加到页面
					handleDomStack.push(dom.remove(id));//移除DOM函数进栈，即将移除DOM
				}
			}
		};

		var switchFloatBtn = function () {
			$(".func-float--nav_btns").removeClass("func-float--nav_active");
			$(this).addClass("func-float--nav_active");
			var id = $(this).attr("id");
			var selector = ".func-float--" + id + "_body";
			$(selector).siblings("[class $= '_body']").css("display", "none");
			$(selector).css("display", "flex");
			event.stopPropagation();
		};

		var hideSwitchFloatBtn = function () {
			$(".func-float--container").fadeOut(100);
			$(".func-float--masker").fadeOut(400);
		};
		return {
			getDeviceInfo: deviceInfo,
			changeNavColor: changeNavColor,
			navAnimate: navAnimate,
			loadAnimate: loadAnimate,
			changeIptColor: changeIptColor,
			renderHotspot: write["hotspot"],//需要传一个参数
			switchNavDom: switchNavDom,
			navDom: doms,
			switchFloatBtn: switchFloatBtn,
			hideSwitchFloatBtn: hideSwitchFloatBtn
		}
	})();

	//控制层
	AF.C = (function () {
		var M = AF.M;
		var V = AF.V;

		var point = {//点击点的坐标位置
			begin: {
				x: 0,
				y: 0,
				time: 0
			},
			move: {
				status: false,//是否滑动
				x: 0,
				y: 0,
				times: 4
			},
			end: {
				x: 0,
				y: 0,
				time: 0
			}
		};
		var device = V.getDeviceInfo;//获取设备信息
		point.move.y = device["height"] * 0.618;//触摸范围在其他范围内的默认值
		point.move.x = device["width"] - 60;

		var touchinfo = {};
		var touch = {
			hand: "none",
			arrow: "none",
			timing: 0,
			default: true
		};
		var show = {
			up: function () {
				$(".func-btn--float").css({
					"top": point.move.y - 15,
					"left": point.move.x
				}).fadeIn(400);
			},
			down: function () {
				$(".func-btn--float").css({
					"top": point.move.y - 40,
					"left": point.move.x
				}).fadeIn(400);
			}
		};
		//触摸事件在此
		var figure = {
			start: function () {//2.4ms
				point.begin.time = new Date().getTime();
				var touch = touchinfo = event.touches[0];
				point.begin.x = touch.clientX;
				point.begin.y = touch.clientY;
			},
			move: function () {//9.6ms
				var touch = event.touches[0];
				var x = point.end.x = touch.clientX;
				var y = point.end.y = touch.clientY;

				var height = parseFloat(device["height"]);
				var width = parseFloat(device["width"]);
				var minH = height * 0.4;
				var maxH = height * 0.8;
				var half = width / 2;
				if (y >= minH && y <= maxH) {
					point.move.y = (point.move.y + y) / 2;
				}
				if (x <= half) {
					point.move.x = 5;
				} else {
					point.move.x = width - 55;
				}
				point.move.status = true;
			},
			end: function () {
				point.end.time = new Date().getTime();
				touch["timing"] = point.end.time - point.begin.time;//时间差毫秒
				var ismove = JSON.stringify(point.move.status);
				if (ismove === "true") {
					var str = point.begin.x - point.end.x >= 0 ? (point.begin.y - point.end.y >= 0 ? "leftup" : "rightdown") : (point.begin.y - point.end.y >= 0 ? "rightup" : "leftdown");
					touch["hand"] = str.replace(/[up|down]/g, "");//什么方向
					touch["arrow"] = str.replace(/[right|lef\t]/g, "");//哪只手
					point.move.times++;//滑动完一次就加一次
					if (point.move.times % 5 === 0) {//取七次的平均值
						$(".func-btn--float").fadeOut(600, function () {
							if (touch["arrow"] === "down") {
								show.down();
							} else {
								show.up();
							}
						});
					}
				} else {
					//touch["hand"] = touch["arrow"] = "none";
				}
				point.move.status = false;
			}
		};
		//点击事件
		var click = {
			funcbtnfloat: function () {
				AF.event.removeTouchListener();
				var funcbtnfloat = $(this)[0];
				var width = funcbtnfloat.clientWidth / 2;
				var half = V.getDeviceInfo["width"] / 2;
				var distance = width * 1.618;
				var rotateX = funcbtnfloat.offsetLeft;// + width;
				var rotateY = funcbtnfloat.offsetTop;// + width;
				var offsetX = distance * 0.5;
				var offsetY = distance * 1.866;

				var a = function () {
					if (rotateX < half) {
						$(".func-btn--func1").css({
							"transform": "translate(" + (Number(rotateX) + Number(offsetX)) + "px," + (Number(rotateY) - Number(offsetY)) + "px)",
							"display": "inline-block"
						});
						$(".func-btn--func2").css({
							"transform": "translate(" + (Number(rotateX) + 1.6 * Number(distance)) + "px," + Number(rotateY) + "px)",
							"display": "inline-block"
						});
						$(".func-btn--func3").css({
							"transform": "translate(" + (Number(rotateX) + Number(offsetX)) + "px," + (Number(rotateY) + Number(offsetY)) + "px)",
							"display": "inline-block"
						});
						$(".func-btn--func4").css({
							"display": "none"
						});
						$(".func-btn--func5").css({
							"display": "none"
						});
						$(".func-btn--func6").css({
							"display": "none"
						});
					} else {
						$(".func-btn--func1").css({
							"display": "none"
						});
						$(".func-btn--func2").css({
							"display": "none"
						});
						$(".func-btn--func3").css({
							"display": "none"
						});
						$(".func-btn--func4").css({
							"transform": "translate(" + (Number(rotateX) - Number(offsetX)) + "px," + (Number(rotateY) + Number(offsetY)) + "px)",
							"display": "inline-block"
						});
						$(".func-btn--func5").css({
							"transform": "translate(" + (Number(rotateX) - 1.6 * Number(distance)) + "px," + Number(rotateY) + "px)",
							"display": "inline-block"
						});
						$(".func-btn--func6").css({
							"transform": "translate(" + (Number(rotateX) - Number(offsetX)) + "px," + (Number(rotateY) - Number(offsetY)) + "px)",
							"display": "inline-block"
						});
					}
				};
				a();
				$(".func-btns").fadeOut(980, "easeInQuint", AF.event.addTouchListener());
			},
			funcbtns: function () {
				var btnObj = $(this).attr("class");
				if (!btnObj.match(/func[3|4]/g)) {//指定哪个按钮才显示面板
					$(".func-float--masker").fadeIn(200);
					$(".func-float--container").fadeIn(100);
					if (!btnObj.match(/fb-user/g)) {
						$(".func-float--settings_body").removeAttr("style");
						$(".func-float--userinfo_body").hide(0);
						$("#userinfo").removeClass("func-float--nav_active");
						$("#settings").addClass("func-float--nav_active");
					} else {
						$(".func-float--userinfo_body").removeAttr("style");
						$(".func-float--settings_body").hide(0);
						$("#settings").removeClass("func-float--nav_active");
						$("#userinfo").addClass("func-float--nav_active");
					}
				}
			}
		};
		//导航栏、搜索
		var post = {
			"declare": {
				"url": "php/declare.php",
				"type": "post"
			},
			"recommend": {
				"url": "php/recommend.php",
				"type": "post"
			},
			"help": {
				"url": "php/help.php",
				"type": "post"
			},
			"feedback": {
				"url": "php/feedback.php",
				"type": "post"
			}
		};

		var func = {
			"search": {
				"success": function () {
					//更新其他页面
					// alert("搜索结果已经得到");
					//移动搜索按钮
					V.navAnimate.search.hiden();
					//移除加载动画
				},
				"complete": function () {//改变标题栏的颜色
					var selector = "#" + V.navDom.id;
					$(selector).children().removeClass("nav-a--on");
					$("#searchresult").show().children().addClass("nav-a--on");
					V.navDom.id = "searchresult";
					V.navDom.searchresult = $(".res-search--list");
					V.loadAnimate.hiden();
				}
			},
			"event": {
				"success": function () {
					//更新其他页面
					//移除加载动画
					V.loadAnimate.hiden();
				},
				"complete": function () {
					//完成后的逻辑
				}
			}
		};

		var navEvent = {
			"search": function () {
				//获取页面输入的值
				var value = {};
				value["keyword"] = $("#nav-ipt--search")[0].value;
				if (value["keyword"].match(/\S/g) !== null) {
					//加载动画出来
					V.loadAnimate.shown();
					//搜索完了执行这一步
					M.request({
						"url": "php/search.php",
						"data": value,
						"type": "get"
					}, func["search"]);
				} else {
					V.changeIptColor();
				}
			},
			"switch": function (id) {//切换热点、推荐等方法的函数
				//发送请求
				M.request(post[id], func["event"]);
			}
		};

		return {
			"touch": figure,
			"click": click,
			"navEvent": navEvent
		}
	})();

	//事件监听注册
	AF.event = (function () {
		var C = AF.C;
		var V = AF.V;
		var addTouchListener = function () {
			document.addEventListener("touchstart", C.touch.start, false);
			document.addEventListener("touchmove", C.touch.move, false);
			document.addEventListener("touchend", C.touch.end, false);
		};
		addTouchListener();
		var removeTouchListener = function () {
			document.removeEventListener("touchstart", C.touch.start, false);
			document.removeEventListener("touchmove", C.touch.move, false);
			document.removeEventListener("touchend", C.touch.end, false);
		};

		$(document).on("click", ".func-btn--float", C.click.funcbtnfloat);
		$(document).on("click", ".func-btns", C.click.funcbtns);
		// document.querySelector(".func-btn--float").addEventListener("click", C.click.funcbtnfloat, false);
		// document.querySelector(".func-btns").addEventListener("click", C.click.funcbtns, false);

		$(document).on("click", ".nav-func--item", V.changeNavColor);
		$(document).on("click", ".nav-func--item", V.switchNavDom);
		$(document).on("click", ".nav-btn--search", V.navAnimate.search.shown);
		$(document).on("click", "#search", C.navEvent.search);
		$(document).on("click", ".func-float--nav_btns", V.switchFloatBtn);
		$(document).on("click", ".func-float--masker", V.hideSwitchFloatBtn);

		var removeClickListener = {
			"searchshow": function () {
				$(document).off("click", ".nav-btn--search", V.navAnimate.search.shown);
			}
		};

		var addClickListener = {
			"searchshow": function () {
				$(document).on("click", ".nav-btn--search", V.navAnimate.search.shown);
			}
		};

		return {
			addTouchListener: addTouchListener,
			removeTouchListener: removeTouchListener,
			addClickListener: addClickListener,
			removeClickListener: removeClickListener
		}
	})();

	//功能扩展
	AF.extends = (function () {
		//扩展jQuery的淡入淡出动画
		(function () {
			jQuery.extend(jQuery.easing, {
				easeInQuint: function (x, t, b, c, d) {
					return c * (t /= d) * t * t * t * t + b;
				}
			});
		})();
	})();
	window.AF = AF;
})(window);
