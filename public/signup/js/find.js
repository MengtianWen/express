/**
 * Created by luneice on 17-8-12.
 */
/*Closure的小世界*/
(function (window) {
    var AF = AF || {};
    /*模型层*/
    AF.M = (function () {
        return {}
    })();

    /*视图层*/
    AF.V = (function () {
        var M = AF.M;

        return {}
    })();

    /*控制层*/
    AF.C = (function () {
        var M = AF.M;
        var V = AF.V;
    })();

    window.AF = AF;

})(window);