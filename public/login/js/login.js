/**
 * Created by luneice on 17-7-25.
 */

(function (window) {
    var AL = AL || {};
    /*模型层*/
    AL.M = (function () {
        var user = {};
        var username = '', password = '';
        var User = function (username, password) {
            this.username = username;
            this.password = password;
            this.time = new Date().getTime();
            return this;
        };

        var login = function (callback) {
            $.ajax({
                url: '/login',
                type: 'post',
                timeout: 8000,
                dataType: 'json',
                data: user,
                success: function (res, textStatus) {
                    callback(res, textStatus);
                },
                error: function (res, textStatus) {
                    callback(res, textStatus);
                }
            });
        };
        
        return {
            setUsername: function (str) {
                username = str;
                return true;
            },
            setPassword: function (str) {
                password = str;
                return true;
            },
            createUser: function () {
                user = new User(username, password);
            },
            login: login
        }
    })();

    /*视图层*/
    AL.V = (function () {
        var notice = {
            correct: function (that) {
                var input = $(that);
                input.removeClass('wrong').siblings('p').removeClass('wrong')[0].innerText = '';
            },
            error: function (that, str) {
                var input = $(that);
                input.addClass('wrong').siblings('p').addClass('wrong')[0].innerText = str;
            },
            failure: function () {
                /*用户名或密码错误的提示*/
                $('.toast').stop(true).fadeIn().delay(1500).fadeOut();
            }
        };

        return {
            notice: notice
        }
    })();

    /*控制层*/
    AL.C = (function () {
        var M = AL.M;
        var V = AL.V;
        var inputArr = $('.login-ipt--comm > input');

        var check = {
            username: function () {
                var username = inputArr[0].value;
                return ((/^201[3-9][0-9]{5,6}$/.test(username)) ||
                    (/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(username))) ?
                    M.setUsername(username) : false;
            },
            password: function () {
                var password = inputArr[1].value;
                return (/^[A-Za-z0-9!@#$%^&*()_+-=|\\/?<>,.:;]{6,18}$/.test(password)) ? M.setPassword(password) : false;
            }
        };

        var verify = {
            username: function () {
                check.username() ? V.notice.correct(inputArr[0]) : V.notice.error(inputArr[0], '用户名非法');
            },
            password: function () {
                check.password() ? V.notice.correct(inputArr[1]) : V.notice.error(inputArr[1], '密码非法');
            }
        };

        /*用户名合法性验证提示*/
        $(inputArr).on('blur', function () {
            var id = $(this)[0].getAttribute('id');
            verify[id]();
        });
        

        /*监听登录按钮事件*/
        $('.login').on('click', function () {
            if (check.username() && check.password()){
                /*如果输入的信息合法则登录*/
                M.createUser();
                M.login(function (res) {
                    if (res['success'] === true ){
                        /*登陆成功*/
                        window.location = window.location.origin;
                    }else {/*登录失败*/

                        V.notice.failure();
                    }
                });
            }else {
                /*输入信息非法*/
                verify.username();
                verify.password();
            }
        });
    })();

    window.AL = AL;
})(window);