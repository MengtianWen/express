/* *
 * Created by luneice on 17-7-8.
 */
(function (window) {
    var AA = AA || {};
    /*模型层，数据的容器*/
    AA.M = (function () {
        var data = {
            study: [],
            luck: [],
            broadcast: [],
            datum: [
            ]
        };
        /*请求哪个页面的数据*/
        var get = function (index, callback) {
            var url = '/getdata';
            var param = {
                func: null,
                page: 1,
                fromat: 3,
                sort: 'goddess',
                t: new Date().getMilliseconds()
            };

            if (typeof index === 'object'){
                for (var key in param){
                    param[key] = (index[key] === undefined ? param : index)[key];
                }
                index = param.func;
            }else {
                /*若index不是object*/
                param.func = index;
            }

            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                timeout : 8000,
                data: param,
                beforeSend: function () {
                    // console.log('执行前');
                },
                success: function (res) {
                    // console.log('执行成功', res);
                    data[index] = res[index];
                    callback();
                },
                error: function (jqXHR, textStatus) {
                    console.log('执行失败', textStatus);
                    if(textStatus === 'timeout'){
                        callback();
                    }
                }
            });
        };

        return {
            data: data,
            get: get
        }
    })();

    /*视图层，负责动画和交互*/
    AA.V = (function () {
        var M = AA.M;
        var html = {
            "study": null,
            "luck": null,
            "broadcast": null,
            "datum":
            '<div class="datum-cont--comm">' +
            '<div class="datum-icon--comm datum-{#type#}--icon"></div>' +
            '<div class="datum-txt--comm">' +
            '{#title#}' +
            '</div>' +
            '<div class="datum-op--comm">' +
            '<a href="{#url#}" class="dataum-download"></a>' +
            '</div>' +
            '</div>'
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
                return str.replace(/{#(\w+)#}/g, function (match, key) {
                    return typeof data === 'string' ? data : (typeof data[key] === 'undefined' ? '' : data[key]);
                });
            }
        };

        var resizeSwiperContainer = function (e) {
            var swiperslide = $('.' + e);
            var swipercontainer = $('.swiper-container');
            swipercontainer[0].style.height = swiperslide[0].scrollHeight + 'px';
            // console.log(swipercontainer, swiperslide);
        };

        var pagestack = ['study'];
        /*swiper页面索引*/
        var page = {
            'study': 0,
            'luck': 1,
            'broadcast': 2,
            'datum': 3,
            '0': 'study',
            '1': 'luck',
            '2': 'broadcast',
            '3': 'datum'
        };
        /*滑动屏幕时处罚*/
        var swiper = new Swiper('.swiper-container', {
            spaceBetween: 2,
            autoHeight: true,
            onSlideChangeEnd: function(swiper){
                var index = page[swiper.activeIndex];
                $('.nav-a--cont').removeClass('active');
                $('#'+ index).children('.nav-a--cont').addClass('active');
                pagestack.pop();pagestack.push(index);
                resizeSwiperContainer(index);
            }
        });

        var touchAction = {
            nav: function () {
                /*点击此处才会更新容器里面的内容*/
                /*改变导航栏状态*/
                $('.nav-a--cont').removeClass('active');
                $(this).children('.nav-a--cont').addClass('active');
                /*swipe到指定的页面*/
                var index = this.getAttribute('id');
                var swiperslide = $('.'+ index);
                resizeSwiperContainer(index);
                swiper.slideTo(page[index], 800, false);
                /*刷新当前的页面，获取最新的数据*/
                if (pagestack.pop() === index){
                    swiperslide.empty().prepend($.parseHTML('<div class="loader"></div>'));
                    M.get(index, function () {
                        /*结果返回回调该方法*/
                        /*移除加载动画*/
                        $('.loader').remove();
                        /*根据模板解析数据*/
                        var elements = format(html[index], M.data[index]);
                        swiperslide.prepend($.parseHTML(elements)).append('<div class="more-cont">获取更多</div>');
                    });
                }
                pagestack.push(index);
            },
            more: function () {
                var that = this;
                /*获取当前节点*/
                var node = $(this)[0].parentNode;
                var info = node.id.split('-');
                /*得到获取更多按钮所在的页面*/
                var index = info[0];
                /*下一页的数据*/
                var page = info[2] * 1 + 1;
                var params = {
                    func: index,
                    page: page
                };
                var id = index + '-content-' + page;
                M.get(params, function () {
                    var elements = format(html[index], M.data[index]);
                    // console.log(M.data, M.data[index]);
                    $(that).before($.parseHTML(elements));
                    resizeSwiperContainer(index);
                });
                node.id = id;
            }
        };

        return {
            touchAction: touchAction
        }
    })();

    /*控制层，负责逻辑控制*/
    AA.C = (function () {
        var M = AA.M;
        var V = AA.V;

        /*监听导航栏的点击事件*/
        $(document).on('click', '.nav-item--comm', V.touchAction.nav);
        /*监听上拉刷新事件*/
        $(document).on('click', '.more-cont', V.touchAction.more);
    })();

    window.AA = AA;

})(window);