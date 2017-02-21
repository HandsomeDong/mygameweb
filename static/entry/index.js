/**
 * Created by lsd on 2017/2/17.
 */
define(function(require, exports, module) {
    require("../css/index.less");
    $(function () {

        var modules_panel = new Vue({
            el: '#modules-panel',
            data: {'item_list':[]
            },
            methods:{
                jumpover:function (link) {
                    console.log(link);
                    window.location.href=link;
                }
            }
        });
        $.ajax({
           url:'/get_index_modules/',
            dataType:'json',
            success:function(data){
                modules_panel.item_list = data['item_list'];
            }
        });
    })


});
