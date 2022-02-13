$(function() {
    var form = layui.form;
    var layer = layui.layer

    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function(value) {
            if (value === $('[name="oldPwd"]').val()) {
                return '新密码不能与原密码相同'
            }
        },
        rePwd: function(value) {
            if (value !== $('[name="newPwd"]').val()) {
                return '两次密码不一致'
            }
        }
    })

    $('#layuiForm').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更改密码失败')
                }
                layer.msg('更改密码成功')

                // jQ对象转换成DOM对象，用原生js的reset方法重置表单
                $('#layuiForm')[0].reset()
            }
        })
    })
})