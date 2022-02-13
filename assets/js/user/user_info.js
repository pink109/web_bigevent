$(function() {
    var form = layui.form
    var layer = layui.layer

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    });
    initUserInfo()

    // 初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                console.log(res);
                // 调用form.val()快速为表单赋值
                // 表单必须有 lay-filter=""属性
                // 2个参数，第一个是要赋值的表单，第二个是赋值数据(和表单中的name对应)
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置表单数据
    $('#btnReset').on('click', function(e) {
        // 阻止默认全部重置行为
        e.preventDefault();
        initUserInfo()
    })

    // 监听表单提交事件
    $('#layuiForm').on('submit', function(e) {
        // 阻止默认提交行为
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')

                // 当前页面的父元素中的getUserInfo()方法 (window指当前页面)
                //  <iframe>页面的父元素index页面
                window.parent.getUserInfo()
            }

        })
    })
})