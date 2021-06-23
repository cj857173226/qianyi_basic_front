/*目前校验类型（暂不可动态配置）
Url：URL校验
Length：长度校验
Email：邮箱校验
Number：数字校验
Tel：电话校验
Idcard：身份证
CharAndNum：字符和数字，
USCC：统一社会信用编码
Field:只匹配数字和字母组合，但不能是纯数字
使用方法：
main.js 里面导入validatorjs, element表单上添加v-validate指令,提交动作调用va方法得到当前组件校验结果。Example:v-validate:Number=[10,15]
*/
import {
    formatDate
} from './formDate';

function showMsg(type, value, vnode) {
    if (vnode.elm.querySelector('.errorMsg')) {
        vnode.elm.removeChild(vnode.elm.querySelector('.errorMsg'));
    }
    let div = document.createElement('div');
    let para = vnode.elm.querySelector('.validate-input').getAttribute('tag') || vnode.elm.getAttribute('tag') || '参数';
    let input = vnode.elm.querySelector('.validate-input');
    let msg = {
        length1: para + '长度应该不少于' + value + '位',
        length2: para + '长度应该在' + value[0] + '位至' + value[1] + '位之间',
        url: '请输入合法的URL',
        email: '请输入合法的Email地址',
        required: para + '为必填项',
        number: para + '只能为纯数字',
        tel: '请输入正确的电话号码',
        idcard: '请输入合法的身份证号',
        charAndNum: para + '只能包含英文和数字，不能包含中文以及特殊字符',
        USCC: '请输入合法的统一社会信用编码',
        field: para + '只匹配数字和字母组合，但不能是纯数字'
    }
    div.setAttribute("class", "errorMsg");
    div.style.position = 'absolute';
    div.style.bottom = '-16px';
    div.style.overflow = 'hidden';
    div.style.fontSize = '12px';
    div.style.lineHeight = '15px';
    div.style.width = "100%";
    div.style.left = "0";
    div.style['text-overflow'] = 'ellipsis';
    div.style['white-space'] = 'nowrap';
    div.innerHTML = msg[type];
    div.setAttribute("title", msg[type]);
    div.style.color = "#CE1E2C";
    input.style['border-color'] = '#CE1E2C';
    vnode.elm.append(div);
}

function judgeLength(_this, value, textValue, vnode) {
    if (value) {
        if (value.length === 1) {
            if (typeof value[0] === 'number') {
                if (textValue.length < value[0]) {
                    showMsg('length1', value, vnode);
                    _this.dataset['vaValid'] = false;
                }
            }
        } else {
            if (typeof value[0] === 'number' && typeof value[1] === 'number' && value[1] > value[0]) {
                if (textValue.length < value[0] || textValue.length > value[1]) {
                    showMsg('length2', value, vnode);
                    _this.dataset['vaValid'] = false;
                }
            }
        }
    }
}

function validateHandle(val) {
    let dataList = [];
    if (val) {
        if (val.constructor.name.indexOf('HTML') != -1) {
            dataList = val.getElementsByClassName('validate-input');
        } else {
            dataList = val.$el.getElementsByClassName('validate-input')
        }
    } else {
        dataList = this.$el.getElementsByClassName('validate-input');
    }
    for (let i = 0; i < dataList.length; i++) {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", false, true);
        if (dataList[i].dataset['vaMultiple'] === 'true') {
            var data = dataList[i].parentNode.previousSibling.querySelectorAll('.el-tag');
            if (data.length > 0) {
                dataList[i].dataset['vaValid'] = true;
            } else {
                if (dataList[i].dispatchEvent) {
                    dataList[i].dispatchEvent(evt);
                } else {
                    dataList[i].fireEvent(evt);
                }
            }
        } else {
            if (dataList[i].dispatchEvent) {
                dataList[i].dispatchEvent(evt);
            } else {
                dataList[i].fireEvent(evt);
            }

        }
    }
    for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].dataset['vaValid'] === 'false') {
            return false
        }
    }
    return true

}

function cancelValidateStatus(val) {
    let dataList = [];
    let errArray = [];
    if (val) {
        if (val.constructor.name.indexOf('HTML') != -1) {
            dataList = val.getElementsByClassName('validate-input');
            errArray = val.querySelectorAll('.errorMsg');
        } else {
            dataList = val.$el.getElementsByClassName('validate-input');
            errArray = val.$el.querySelectorAll('.errorMsg');
        }
    } else {
        dataList = this.$el.getElementsByClassName('validate-input');
        errArray = this.$el.querySelectorAll('.errorMsg');
    }
    for (let i = 0; i < dataList.length; i++) {
        dataList[i].dataset['vaValid'] = true;
        dataList[i].style['border-color'] = "#dcdfe6";
    }
    for (let i = 0; i < errArray.length; i++) {
        errArray[i].style.display = 'none';
    }
}
export default {
    install(Vue) {
        Vue.directive('validate', {
            inserted: function (el, binding, vnode) {
                function changeHandle(event) {
                    let type = this.dataset['vaType'];
                    let value = this.dataset['vaValue'] ? JSON.parse(this.dataset['vaValue']) : null;
                    let textValue = this.value.trim();
                    if (this.value === '' && this.attributes.value) {
                        textValue = this.attributes.value.value.trim();
                    }
                    if (/ElCascader/.test(vnode.tag)) {
                        let paraArray = vnode.data.model.expression.split('.');
                        if (paraArray.length > 1) {
                            let str = 'vnode.context';
                            paraArray.map(item => {
                                str = str + '.' + item;
                            })
                            textValue = eval(str);
                        } else {
                            textValue = vnode.context[paraArray[0]];
                        }
                        if (!textValue || (Array.isArray(textValue) && textValue.length === 0)) {
                            showMsg('required', '', vnode);
                            this.dataset['vaValid'] = false;
                            return;
                        }
                    }
                    this.dataset['vaValid'] = true;
                    this.style['border-color'] = "#dcdfe6";
                    vnode.elm.querySelector('.errorMsg') ? vnode.elm.removeChild(vnode.elm.querySelector('.errorMsg')) : '';
                    if (!textValue) {
                        showMsg('required', '', vnode);
                        this.dataset['vaValid'] = false;
                        return;
                    }
                    switch (type) {
                        case 'Url':
                            let urlReg = /^(https?|ftp|http):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
                            if (!urlReg.test(textValue)) {
                                break;
                                showMsg('url', '', vnode);
                            }
                            break;
                        case 'Length':
                            judgeLength(this, value, textValue, vnode);
                            break;
                        case 'Email':
                            let emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
                            if (!urlReg.test(textValue)) {
                                showMsg('email', '', vnode);
                                this.dataset['vaValid'] = false;
                            }
                            break;
                        case 'Number':
                            let numReg = /^(\-)?[0-9]+$/;
                            if (!numReg.test(textValue)) {
                                showMsg('number', '', vnode);
                                this.dataset['vaValid'] = false;
                            }
                            break;
                        case 'Tel':
                            let telReg = /(^1[0-9]{10}$)|(^[0]{1}[0-9]{2,3}\-{0,1}[2-8]{1}[0-9]{5,7}$)/g;
                            if (!telReg.test(textValue)) {
                                showMsg('tel', '', vnode);
                                this.dataset['vaValid'] = false;
                            }
                            break;
                        case 'Idcard':
                            let idReg = /^[0-9]{6}[1-2]{1}[0-9]{3}[0-1]{1}[0-9]{1}[0-3]{1}[0-9]{1}[0-9]{3}[xX0-9]{1}$/g;
                            if (!idReg.test(textValue)) {
                                showMsg('idcard', '', vnode);
                                this.dataset['vaValid'] = false;
                            }
                            break;
                        case 'CharAndNum':
                            let charReg = /^[0-9a-zA-Z]+$/;
                            if (!charReg.test(textValue)) {
                                showMsg('charAndNum', '', vnode);
                                this.dataset['vaValid'] = false;
                            } else {
                                judgeLength(this, value, textValue, vnode);
                            }
                            break;
                        case 'USCC':
                            let USCCReg = /[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g;
                            if (!USCCReg.test(textValue)) {
                                showMsg('USCC', '', vnode);
                                this.dataset['vaValid'] = false;
                            }
                            break;
                        case 'Field':
                            let fieldReg = /^(?!\d+$)[\da-zA-Z]+$/;
                            if (!fieldReg.test(textValue)) {
                                showMsg('field', '', vnode);
                                this.dataset['vaValid'] = false;
                            }
                            break;
                        default:
                            break;

                    }
                    return false
                }
                el.style.position = 'relative';
                //设置input 校验类型
                let formEle = el.querySelector('.el-input__inner') || el.querySelector('input') || el.querySelector('textarea');
                if ("arg" in binding) {
                    formEle.setAttribute('data-va-type', binding.arg);
                    //设置校验值主要是长度
                    binding.expression ? formEle.setAttribute('data-va-value', binding.expression) : '';
                } else if ("value" in binding) {
                    formEle.setAttribute('data-va-type', binding.value.value);
                }
                if (vnode.componentInstance.multiple) {
                    formEle.setAttribute('data-va-multiple', true);
                } else {
                    formEle.setAttribute('data-va-multiple', false);
                }
                //设置input的校验结果
                formEle.setAttribute('data-va-valid', true);
                //设置input class属性
                formEle.classList.add('validate-input');
                //设置是否必须
                JSON.stringify(binding.modifiers) != '{}' && binding.modifiers.required ? formEle.setAttribute('data-va-required', true) : '';
                // formEle.addEventListener('change', changeHandle);
                formEle.onchange = changeHandle;
            },
            componentUpdated: function (el, binding, vnode) {
                let formEle = el.querySelector('.el-input__inner') || el.querySelector('input') || el.querySelector('textarea');
                if (/ElDatePicker/.test(vnode.tag) || /ElAutocomplete/.test(vnode.tag) || /ElCascader/.test(vnode.tag)) {
                    if (formEle.value !== vnode.data.model.value) {
                        if (/ElDatePicker/.test(vnode.tag)) {
                            if (vnode.data.model.value) {
                                if (typeof vnode.data.model.value !== 'number') {
                                    formEle.value = vnode.data.model.value.replace('12:00:00', '');
                                } else {
                                    formEle.value = formatDate(new Date(vnode.data.model.value), "yyyy-MM-dd hh:mm:ss");
                                }
                            } else {
                                formEle.value = null
                            }
                        } else if (/ElAutocomplete/.test(vnode.tag)) {
                            formEle.value = vnode.data.model.value;
                        } else {
                            if (formEle.value === '' && vnode.data.model.value.length === 0) {
                                return
                            }
                        }
                        formEle.dispatchEvent(new Event('change'));
                    }
                } else if (/ElSelect/.test(vnode.tag)) {
                    if (vnode.componentInstance.multiple) {
                        if (!(formEle.value === '' && vnode.data.model.value.length === 0 && vnode.componentInstance.selected.length === 0)) {
                            formEle.value = vnode.data.model.value;
                            formEle.dispatchEvent(new Event('change'));
                        }
                    } else {
                        if (formEle.value !== vnode.data.model.value) {
                            formEle.value = vnode.data.model.value;
                            formEle.dispatchEvent(new Event('change'));
                        }
                    }
                }
            },
            unbind: function (el, binding, vnode) {
                vnode.elm.querySelector('.errorMsg') ? vnode.elm.removeChild(vnode.elm.querySelector('.errorMsg')) : '';
                let formEle = el.querySelector('.el-input__inner') || el.querySelector('input') || el.querySelector('textarea');
                formEle.style['border-color'] = "#dcdfe6";

                function changeHandle(event) {
                    let type = this.dataset['vaType'];
                    let value = this.dataset['vaValue'] ? JSON.parse(this.dataset['vaValue']) : null;
                    let textValue = this.value.trim();
                    this.dataset['vaValid'] = true;
                    this.style['border-color'] = "#dcdfe6";
                    vnode.elm.querySelector('.errorMsg') ? vnode.elm.removeChild(vnode.elm.querySelector('.errorMsg')) : '';
                    if (!textValue) {
                        showMsg('required', '', vnode);
                        this.dataset['vaValid'] = false;
                        return;
                    }
                    switch (type) {
                        case 'Url':
                            let urlReg = /^(https?|ftp|http):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
                            if (!urlReg.test(textValue)) {
                                break;
                                showMsg('url', '', vnode);
                            }
                            break;
                        case 'Length':
                            judgeLength(this, value, textValue, vnode);
                            break;
                        case 'Email':
                            let emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
                            if (!urlReg.test(textValue)) {
                                showMsg('email', '', vnode);
                                this.dataset['vaValid'] = false;
                            }
                            break;
                        case 'Number':
                            let numReg = /^[0-9]+$/;
                            if (!numReg.test(textValue)) {
                                showMsg('number', '', vnode);
                                this.dataset['vaValid'] = false;
                            }
                            break;
                        case 'Tel':
                            let telReg = /(^1[0-9]{10}$)|(^[0]{1}[0-9]{2,3}\-{0,1}[2-8]{1}[0-9]{5,7}$)/g;
                            if (!telReg.test(textValue)) {
                                showMsg('tel', '', vnode);
                                this.dataset['vaValid'] = false;
                            }
                            break;
                        case 'Idcard':
                            let idReg = /^[0-9]{6}[1-2]{1}[0-9]{3}[0-1]{1}[0-9]{1}[0-3]{1}[0-9]{1}[0-9]{3}[xX0-9]{1}$/g;
                            if (!idReg.test(textValue)) {
                                showMsg('idcard', '', vnode);
                                this.dataset['vaValid'] = false;
                            }
                            break;
                        case 'CharAndNum':
                            let charReg = /^[0-9a-zA-Z]+$/;
                            if (!charReg.test(textValue)) {
                                showMsg('charAndNum', '', vnode);
                                this.dataset['vaValid'] = false;
                            } else {
                                judgeLength(this, value, textValue, vnode);
                            }
                            break;
                        case 'USCC':
                            let USCCReg = /[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g;
                            if (!USCCReg.test(textValue)) {
                                showMsg('USCC', '', vnode);
                                this.dataset['vaValid'] = false;
                            }
                            break;
                        default:
                            break;
                    }
                    return false
                }
                removeEventListener("change", changeHandle, false)
            }
        });
        Vue.prototype.va = validateHandle;
        Vue.prototype.cancelVa = cancelValidateStatus;
    }
}