//匹配中文
export const regxWordZh = /[\u4e00-\u9fa5]/gm
//数字
export const regxOnlyNum = /^\d+$/
//英文
export const regxOnlyEn = /^[a-z]+$/i
//数字和英文
export const regxOnlyNumEn = /^[a-z0-9]+$/i
//数字+英文+下划线
export const regxOnlyNumEnUnline = /^\w+$/
//邮箱
export const regxEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
//网址
export const regxUrl = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i
//座机号码
export const regxCall = /^(0\d{2,3})-?(\d{7,8})$/
//区号手机号
export const regx86Phone = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
//无区号手机号
export const regxPhone = /^(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
//简易手机号
export const regxSPhone = /^1[3456789]\d{9}$/
//身份证
export const regxIdentity = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
//邮政编码
export const regxPostCode = /^[1-9]\d{5}(?!\d)$/
