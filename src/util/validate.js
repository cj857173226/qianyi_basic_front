/**
 * 邮箱
 * @param {*} s
 */
export function isEmail(s) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile(s) {
  var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
  if (!myreg.test(s)) {
    return false;
  } else {
    return true;
  }
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone(s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL(s) {
  return /^http[s]?:\/\/.*/.test(s)
}

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri */
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母 */
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母 */
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母 */
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/* 验证pad还是pc */
export const vaildatePc = function () {
  const userAgentInfo = navigator.userAgent
  const Agents = ['Android', 'iPhone',
    'SymbianOS', 'Windows Phone',
    'iPad', 'iPod'
  ]
  let flag = true
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false
      break
    }
  }
  return flag
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

/**
 * 判断身份证号码
 */
export function cardid(code) {
  const list = []
  let result = true
  let msg = ''
  var city = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外 '
  }
  if (!validatenull(code)) {
    if (code.length === 18) {
      if (!code || !/(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(code)) {
        msg = '证件号码格式错误'
      } else if (!city[code.substr(0, 2)]) {
        msg = '地址编码错误'
      } else {
        // 18位身份证需要验证最后一位校验位
        code = code.split('')
        // ∑(ai×Wi)(mod 11)
        // 加权因子
        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
        // 校验位
        var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2, 'x']
        var sum = 0
        var ai = 0
        var wi = 0
        for (var i = 0; i < 17; i++) {
          ai = code[i]
          wi = factor[i]
          sum += ai * wi
        }
        if (parity[sum % 11] !== code[17]) {
          msg = '证件号码校验位错误'
        } else {
          result = false
        }
      }
    } else {
      msg = '证件号码长度不为18位'
    }
  } else {
    msg = '证件号码不能为空'
  }
  list.push(result)
  list.push(msg)
  return list
}

/**
 * 判断手机号码是否正确
 */
export function isvalidatemobile(phone) {
  const list = []
  let result = true
  let msg = ''
  var isPhone = /^0\d{2,3}-?\d{7,8}$/
  // 增加134 减少|1349[0-9]{7}，增加181,增加145，增加17[678]
  if (!validatenull(phone)) {
    if (phone.length === 11) {
      if (!isPhone.test(phone)) {
        result = false
        msg = '手机号码格式不正确'
      }
    } else {
      result = false
      msg = '手机号码长度不为11位'
    }
  } else {
    msg = '手机号码不能为空'
    result = false
  }
  list.push(result)
  list.push(msg)
  return list
}

/**
 * 判断姓名是否正确
 */
export function validatename(name) {
  var regName = /^[\u4e00-\u9fa5]{2,8}$/
  if (!regName.test(name)) return false
  return true
}

/**
 * 判断是否为整数
 */
export function validatenum(num, type) {
  let regName = /[^\d.]/g
  if (type === 1) {
    if (!regName.test(num)) return false
  } else if (type === 2) {
    regName = /[^\d]/g
    if (!regName.test(num)) return false
  }
  return true
}

/**
 * 判断是否为小数
 */
export function validatenumord(num, type) {
  let regName = /[^\d.]/g
  if (type === 1) {
    if (!regName.test(num)) return false
  } else if (type === 2) {
    regName = /[^\d.]/g
    if (!regName.test(num)) return false
  }
  return true
}

/**
 * 判断是否为空
 */
export function validatenull(val) {
  if (typeof val === 'boolean') {
    return false
  }
  if (typeof val === 'number') {
    return false
  }
  if (val instanceof Array) {
    if (val.length === 0) return true
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === '{}') return true
  } else {
    if (val === 'null' || val == null || val === 'undefined' || val === undefined || val === '') return true
    return false
  }
  return false
}


/**
 * 判断密码  包含数字和字母
 */

export function CheckPassWord(val) {
  let reg = /^(?![^a-zA-Z]+$)(?!\D+$)/;
  if (reg.test(val)) {
    return true;
  }
  return false;
}


export function IdentityCodeValid(idCard) {
  var tip = "";
  var pass = true;
  var vcity = {
    11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古",
    21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏",
    33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南",
    42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆",
    51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃",
    63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
  };

  //校验长度，类型
  if (isCardNo(idCard) === false) {
    pass = false;
    tip = "身份证格式有误"
  }
  //检查省份
  if (checkProvince(idCard, vcity) === false) {
    pass = false;
    tip = "身份证格式有误"
  }
  //校验生日
  if (checkBirthday(idCard) === false) {
    pass = false;
    tip = "身份证格式有误"
  }
  //检验位的检测
  if (checkParity(idCard) === false) {
    pass = false;
    tip = "身份证格式有误"
  }
  return [pass, tip];
}

function isCardNo(card) {
  //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  var reg = /(^\d{15}$)|(^\d{17}(\d|X|x)$)/;
  if (reg.test(card) === false) {
    return false;
  }
  return true;
}
function checkProvince(card, vcity) {
  var province = card.substr(0, 2);
  if (vcity[province] == undefined) {
    return false;
  }
  return true;
};
function checkBirthday(card) {
  var len = card.length;
  //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
  if (len == '15') {
    var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
    var arr_data = card.match(re_fifteen);
    var year = arr_data[2];
    var month = arr_data[3];
    var day = arr_data[4];
    var birthday = new Date('19' + year + '/' + month + '/' + day);
    return verifyBirthday('19' + year, month, day, birthday);
  }
  //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
  if (len == '18') {
    var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X|x)$/;
    var arr_data = card.match(re_eighteen);
    var year = arr_data[2];
    var month = arr_data[3];
    var day = arr_data[4];
    var birthday = new Date(year + '/' + month + '/' + day);
    return verifyBirthday(year, month, day, birthday);
  }
  return false;
};
function verifyBirthday(year, month, day, birthday) {
  var now = new Date();
  var now_year = now.getFullYear();
  //年月日是否合理
  if (birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
    //判断年份的范围（0岁到100岁之间)
    var time = now_year - year;
    if (time >= 0 && time <= 100) {
      return true;
    }
    return false;
  }
  return false;
}
function checkParity(card) {
  //15位转18位
  card = changeFivteenToEighteen(card);
  var len = card.length;
  if (len == '18') {
    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
    var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
    var cardTemp = 0, i, valnum;
    for (i = 0; i < 17; i++) {
      cardTemp += card.substr(i, 1) * arrInt[i];
    }
    valnum = arrCh[cardTemp % 11];
    if (valnum == card.substr(17, 1).toLocaleUpperCase()) {
      return true;
    }
    return false;
  }
  return false;
}
function changeFivteenToEighteen(card) {
  if (card.length == '15') {
    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
    var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
    var cardTemp = 0, i;
    card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
    for (i = 0; i < 17; i++) {
      cardTemp += card.substr(i, 1) * arrInt[i];
    }
    card += arrCh[cardTemp % 11];
    return card;
  }
  return card;
}

// 座机固话 验证
export function testTelephone(phone) {
  var phone_reg = new RegExp(/^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/);
  if (!phone_reg.test(phone)) {
    return false;

  }
  return true;
}