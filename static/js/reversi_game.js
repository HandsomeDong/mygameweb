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


function reversi_game(rb){
    this.rb=rb;
    this.role=1;
    this.best_action={};
    this.available_actions=function(state, role){
        var temp_i=0;
        var temp_j=0;
        var actions={};
        for(var i=0;i<8;i++) {
            for (var j = 0; j < 8; j++) {
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


    this.alpha_beta=function(stat, search_depth, limit_depth, role,alpha, beta){
        if(search_depth>=limit_depth) return -1*this.cal_utility(stat, this.role);
        var action=this.available_actions(stat, role);
        if(action.length==0){
            return -1*this.alpha_beta(stat,search_depth+1, limit_depth, -1*role, -1*beta,-1*alpha);
        }
        var v=-9999999;
        for(var i in action){
            var child_stat=this.gen_copy_next(stat,action[i],role);
            var compare_v =this.alpha_beta(child_stat,search_depth+1, limit_depth, -1*role, -1*beta,-1*alpha);
            if(v<compare_v){
                v=compare_v;
                if(search_depth==0){
                    this.best_action=action[i];
                }
            }
            if(v>=beta) return -1*v;
            alpha=Math.max(alpha,v);
        }
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
            this.ai_step();


        }
    };


    this.ai_step=function () {
        this.best_action={};
        this.alpha_beta(this.rb.stat, 0, 7, this.role,-999999, 999999);
        if(JSON.stringify(this.best_action)=='{}'){
            this.role=this.role*-1;
            this.actions=this.available_actions(this.rb.stat, this.role);
            if(JSON.stringify(this.actions)=='{}'){
                alert('Game Over');
            }
            return;
        }
        this.execute_action(this.best_action);
        if(JSON.stringify(this.actions)=='{}'){
            this.role=this.role*-1;
            this.ai_step();
        }
    };


    this.execute_action=function(action){
        this.rb.draw_pieces(action['x'], action['y'], this.role);
        var action_list_ai=action['actions'];
        for(var piece_ai in action_list_ai){
            this.rb.draw_pieces(action_list_ai[piece_ai][0], action_list_ai[piece_ai][1], this.role);
        }
        this.role=this.role*-1;
        this.actions=this.available_actions(this.rb.stat, this.role);
        this.rb.score_board();
    };

    var ce = this.click_event.bind(this);
    this.rb.canvas.addEventListener('click', ce, false);

}






module.exports = {
    'reversi_game': reversi_game
};
