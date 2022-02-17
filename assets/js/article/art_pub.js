$(function() {
    var layer = layui.layer
    var form = layui.form

    initCate();
    // 初始化富文本编辑器
    initEditor()

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                // 调用模板引擎，渲染下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr);
                // 让layui重新渲染一下动态添加的页面元素
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择图片按钮绑定点击事件
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    // 监听coverFile的change事件，获取用户选择的文件
    $('#coverFile').on('change', function(e) {
        // 获取到文件的列表数组
        var files = e.target.files;
        // 判断用户是否选中文件
        if (files.length === 0) { return };
        // 根据文件，创建对应的url地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径 
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的状态
    var art_sate = '已发布'; // 默认
    // 为存为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function() {
        art_sate = '草稿'
    })

    // 为表单绑定提交事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        // 1.基于form表单，快速创建一个FormData对象 (3本P8)
        // 2.将form-pub转换成DOM对象传入FormData
        var fd = new FormData($(this)[0]);

        // 将文章发布状态，保存到fd中
        fd.append('state', art_sate);
        /*   fd.forEach(function(v, k) {
              console.log(k, v);
          }) 
        */
        // 3. 将封面裁剪过后的图片， 输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // blob就是图片的文件对象

                // 4. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob);

                // 5. 发起 ajax 数据请求，发布文章
                publishArticle(fd)
            })
    })

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                    // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})