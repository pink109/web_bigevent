/* $.ajaxPrefilter()函数 用于指定预先处理Ajax参数选项的回调函数 
 * 每次发起ajax请求时(包括get、post) 拦截器会先调用此函数
 * 在这个函数中，可以拿到我们给ajax提供的配置对象
 */
$.ajaxPrefilter(function(options) {
    // options 是我们的ajax配置对象
    // 重新赋值 拼接完整的url
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;

    // 统一为有权限的接口，设置headers请求头
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局挂载complete回调函数
    options.complete = function(res) {
        // console.log(res);
        // 通过res.responseJSON 获取服务器响应的失败信息
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空token 并且强制跳转至登录页面
            localStorage.removeItem('token');
            location.href = '/login.html';
        }
    }
})