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