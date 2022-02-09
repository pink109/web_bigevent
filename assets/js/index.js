$(function() {
    getUserInfo()
    var layer = layui.layer
    $('#btnLogout').on('click', function() {
        // 退出提示
        layer.confirm('确定退出登录吗？', { icon: 3, title: '提示' }, function(index) {
            // 清楚本地存储中的token
            localStorage.removeItem('token');
            // 跳转到登录页面
            location.href = '/login.html';

            // 退出confirm提示框(官方默认的)
            layer.close(index);
        });
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 注：/my 是有权限的接口
        /*  options.headers = {
             Authorization: localStorage.getItem('token') || ''
         }, */
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            };

            // 调用renderAvatar()渲染用户头像
            // console.log(res)
            renderAvatar(res.data)
        },
        // 无论成功或失败 都会调用complete回调函数
        /*     complete: function(res) {
                // console.log(res);
                // 通过res.responseJSON 获取服务器响应的失败信息
                if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                    // 强制清空token 并且强制跳转至登录页面
                    localStorage.removeItem('token');
                    location.href = '/login.html';
                }
            } */
    })
}

// 渲染用户头像
function renderAvatar(user) {
    // 1.获取用户名称 (昵称/用户名)
    var name = user.nickname || user.username;
    // 2.设置欢迎文本
    $('#welcome').html('欢迎&nbsp&nbsp' + name);
    // 3.按需渲染头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide();
        // 名字中第一个字 (英文就大写)
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show()
    }
}