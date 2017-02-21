/**
 * Created by lsd on 2017/2/17.
 */
define(function(require, exports, module) {
    require("../css/reversi.less");
    var rev_tool = require("../js/reversi_canvas.js");
    var game_obj = require("../js/reversi_game.js");
    $(function () {
        var canvas = document.getElementById('reversi');
        var rb=new rev_tool.reversi_board(canvas, 100,50,400,400);
        var go=new game_obj.reversi_game(rb);

    })
});
