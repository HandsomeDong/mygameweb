/**
 * Created by lsd on 2017/2/17.
 */
define(function(require, exports, module) {
    require("../css/reversi.less");
    var rev_tool = require("../js/reversi_canvas.js");
    var game_obj = require("../js/reversi_game.js");
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
});
