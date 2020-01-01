import Compressor from 'compressorjs';
import api from '../../api/index';
import Vue from 'vue'
import { Toast } from 'vant'
Vue.use(Toast)

/**
 * 图片压缩上传
 * @param {*} file       压缩的目标File或Blob
 * @param {*} quality    压缩质量默认0.6
 * @param {*} maxWidth   输出图片最大宽度
 * @param {*} maxHeight  输出图片最大高度
 * @param {*} 返回参数{code:'0',url:''}code为0，上传成功，url图片地址 code为99网络请求异常失败 code为999压缩功能异常
 */
export function uploadImg(file, quality = 0.95,maxWidth=800,maxHeight=800) {

    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(false);
        }
        if (file.size / 1024 > 1025 * 10) {//图片大于10M，进行高比例压缩，大概率失真
            quality = 0.5;
        }
        Toast.loading({
            message: "上传中...",
            forbidClick: true,
            duration: 0
        });
        if (file.size / 1024 <= 1025 * 1) {//图片小于1M直接上传
            let formData = new FormData();
            formData.append("file", file);
            api.chatImgUpload(formData).then(res => {
                Toast.clear();
                if (res.code == 0 && res.message != "未找到文件") {
                    resolve({ code: '0', url: res.data.uploadFilePath });
                } else {
                    //未知错误
                    Toast(res.message)
                    resolve({ code: res.code, message: res.message });
                }
            }).catch(() => {
                Toast.clear();
                Toast('服务异常')
                resolve({ code: '99' });
            });
        } else {
            new Compressor(file, {
                quality: quality,
                checkOrientation: true,//图片大于10M会出问题
                maxWidth:maxWidth,
                maxHeight:maxHeight,
                success(result) {
                    let flien=result;
                    //result.name
                    flien=new window.File([flien], flien.name, {type: flien.type})
                    let formData = new FormData();
                    formData.append("file", flien);
                    api.chatImgUpload(formData).then(res => {
                        Toast.clear();
                        if (res.code == 0 && res.message != "未找到文件") {
                            resolve({ code: '0', url: res.data.uploadFilePath });
                        } else {
                            Toast(res.message)
                            resolve({ code: res.code, message: res.message });
                        }
                    }).catch(() => {
                        Toast.clear();
                        resolve({ code: '99' });
                    });
                },
                error(err) {
                    console.log(err.message);
                    Toast('压缩异常')
                    resolve({ code: '999' });
                },
            });
        }

    })
}