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
