$(function() {
    // 点击“去注册”链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    });

    // 点击“去登录”链接
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从layui中获取form对象
    var form = layui.form;
    // layer对象
    var layer = layui.layer;

    // 通过form.verify()自定义校验规则
    form.verify({
        // 自定义pwd规则 (键值对)
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致
        repwd: function(value) {
            // value获取的是确认密码的值，pwd是设置的密码值
            // []属性选择器
            var pwd = $('#form_reg [name="password"]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }

        $.post(' /api/reguser', data, function(res) {

            if (res.status !== 0) {
                // layer.msg 弹出框
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录！');
            // 模拟手动点击行为 跳转登录页面
            $('#link_login').click()
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')

                // 将登陆成功后的token字符串 保持到本地存储(详见2本P65)
                // 用于后续去访问有权限的接口
                localStorage.setItem('token', res.token);
                // 跳转到后台页面 (location.href获取或设置整个url，详见2本P57)
                location.href = '/index.html'
            }
        })
    })
})