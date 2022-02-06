/* $.ajaxPrefilter()函数 用于指定预先处理Ajax参数选项的回调函数 
 * 每次发起ajax请求时(包括get、post) 拦截器会先调用此函数
 * 在这个函数中，可以拿到我们给ajax提供的配置对象
 */
$.ajaxPrefilter(function(options) {
    // options 是我们的ajax配置对象
    // 重新赋值 拼接完整的url
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
})