$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义美化时间格式的过滤器
    template.defaults.imports.dateFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    initTable()
    initCate()

    // 获取文章列表的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // console.log(res); // length是0 无数据？？
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // 使用模板引擎渲染列表页面
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr);
                // 调用渲染分页的方法 (total属性是总数据的条数)
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                // 使用模板引擎渲染第一个选择项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr);

                // 让layui重新渲染一下动态添加的页面元素
                form.render()
            }
        })
    }

    // 为筛选表单绑定提交事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 获取表单中的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state').val();
        // 为查询对象q 对应的属性赋值
        q.cate_id = cate_id
        q.state = state;
        // 根据筛选 重新渲染页面
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        /* laypage.render()当分页被切换时触发，函数返回两个参数：
        obj（当前分页的所有选项值）、
        first（是否首次，一般用于初始加载的判断）
        */
        laypage.render({
            elem: 'pageBox', // 注意，这里的 test1 是 ID，不用加 # 号
            count: total, // 数据总数，从服务端得到
            limit: q.pagesize, // 每页显示的条数
            curr: q.pagenum, // 起始页(当前被选中的)
            jump: function(obj, first) {
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // 把最新页码值 赋值到q查询对象中
                q.pagenum = obj.curr;

                // console.log(obj.limit); //得到每页显示的条数
                // 把最新的条目数，赋值到q查询参数对象的 pagesize属性中
                q.pagesize = obj.limit

                /* 触发 jump 回调的方式有两种：
                1. 点击页码的时候，会触发 jump 回调
                2. 只要调用了 laypage.render() 方法，就会触发 jump 回调 
                */
                // 如果直接调用initTable()，因为2的原因会进入死循环
                // console.log(first); // 主动触发(方式2)返回ture，点击触发返回undefined
                if (!first) {
                    initTable()
                }
            },
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], // 自定义排版
            limits: [2, 3, 5, 10] // 每页条数的选择项
        });
    }

    // 为动态生成的删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        // 获取删除按钮个数
        var len = $(this).length;
        // 获得文章的id
        var id = $(this).attr('data-id')

        layer.confirm('is not?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功！')

                    /* 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    如果没有剩余的数据了，则让页码值-1 之后，再调用initTable 方法 
                    */
                    if (len === 1) {
                        // 如果删除按钮值等于1，说明在点击删除后，页面数据就清空了
                        // 而页码值还是删除前的数值，如果直接渲染页面加载不到数据
                        // 注意：页码的最小值必须为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }

                    initTable()
                }
            })

            layer.close(index);
        });
    })
})