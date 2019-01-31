const PHONE = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
const EMAIL = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
const URL = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/
const IDCARD = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/

// 校验的策略列表
const STRATEGY = {
    required: function (actual) {
        // 0 和 false 属于有效值，仅包含一个或多个空白字符的字符串属于无效值
        let isInvalidStr = typeof actual === 'string' && !/\S/.test(actual)
        return actual !== undefined && actual !== null && !isInvalidStr
    },

    // 允许数字类型或数字格式的字符串（前后可包含一个或多个空白字符，可以是小数和负数）
    number: function (actual) {
        return typeof number === 'number' || /^\s*(+|-)?([1-9]\d*|0)([.]\d*[1-9])?\s*$/.test(actual)
    },

    // 允许整数或整数格式的字符串（前后可包含一个或多个空白字符，可以是负数）
    digits: function (actual) {
        return actual === parseInt(actual) || /^\s*(+|-)?([1-9]\d*|0)\s*$/.test(actual)
    },

    // 实际值应大于等于期望值，仅允许数字类型和数字格式字符串，不允许布尔值
    min: function (actual, expected) {
        if (!this.number(expected)) {
            throw new TypeError('min() expected 值应为数字类型')
        }
        return this.number(actual) && actual >= expected
    },

    // 实际值应小于等于期望值，仅允许数字类型和数字格式字符串，不允许布尔值
    max: function (actual, expected) {
        if (!this.number(expected)) {
            throw new TypeError('max() expected 值应为数字类型')
        }
        return this.number(actual) && actual <= expected
    },

    // 实际值应该在期望的上限和下限之间，包含上限和下限
    // 上限值和下限值不区分顺序
    // 期望值可以是单个元素的数组或数字类型，则上限值和下限值相等
    between: function (actual, expected) {
        if (this.number(expected)) {
            expected = [expected]
        } else if (!Array.isArray(expected)) {
            throw new TypeError('between() expected 应为数组')
        }
        let lowerLimit = Math.min.apply(Math, expected)
        let upperLimit = Math.max.apply(Math, expected)
        return this.min(actual, lowerLimit) && this.max(actual, upperLimit)
    },

    /**
     * 实际值的长度应大于等于期望值。
     * 对于数组，元素的个数应大于等于期望值；对于字符串，则是字符的个数。
     * 期望值描述的是长度，应为整数类型
     */
    minlength: function (actual, expected) {
        if (!this.digits(expected)) {
            throw new TypeError('minlength() expected 应为整数类型')
        }
        return (Array.isArray(actual) || typeof actual === 'string') && this.min(actual.length, expected)
    },

    /**
     * 实际值的长度应小于等于期望值。
     * 对于数组，元素的个数应小于等于期望值；对于字符串，则是字符的个数。
     * 期望值描述的是长度，应为整数类型
     */
    maxlength: function (actual, expected) {
        if (!this.digits(expected)) {
            throw new TypeError('maxlength() expected 应为整数类型')
        }
        return (Array.isArray(actual) || typeof actual === 'string') && this.max(actual.length, expected)
    },

    /**
     * 实际值的长度应该在期望的上限和下限之间，包含上限和下限
     * 上限值和下限值不区分顺序
     * 期望值可以是单个元素的数组或数字类型，则上限值和下限值相等
     */
    lengthBetween: function (actual, expected) {
        if (this.digits(expected)) {
            expected = [expected]
        } else if (!Array.isArray(expected)) {
            throw new TypeError('lengthBetween() expected 应为数组')
        }
        let lowerLimit = Math.min.apply(Math, expected)
        let upperLimit = Math.max.apply(Math, expected)
        return this.minlength(actual, lowerLimit) && this.maxlength(actual, upperLimit)
    },

    tel: function (actual) {
        return this.regular(actual, PHONE)
    },

    email: function (actual) {
        return this.regular(actual, EMAIL)
    },

    url: function (actual) {
        return this.regular(actual, URL)
    },

    idcard: function (actual) {
        return this.regular(actual, IDCARD)
    },

    /**
     * 正则校验。期望值可以是正则字面值格式的字符串，如: "/\d{11}/i"
     * @param {any} actual 实际值
     * @param {string|RegExp} expected 期望值
     */
    regular: function (actual, expected) {
        if (typeof expected === 'string') {
            let idx = expected.lastIndexOf('/')
            expected = new RegExp(expected.slice(1, idx), expected.slice(idx + 1))
        }
        if (!(expected instanceof RegExp)) {
            throw new TypeError('regular() expected 应为正则表达式')
        }
        return expected.test(actual)
    },

    date: function (actual) {
        
    },

    dateISO: function (actual) {
        
    },

    equalTo: function (actual, expected) {
        return actual === expected
    },

    contains: function (actual, expected) {
        return (Array.isArray(actual) || typeof actual === 'string') && actual.contains(expected)
    },

    in: function (actual, expected) {
        return expected.contains(actual)
    }
}

/**
 * 校验实际值是否符合期望值
 * @param {any} actual 实际值
 * @param {Array<object>} expected 期望值
 * 
 * @example expected
 * [
 *      {
 *          property: 'phone', // 校验的字段名 alias: prop
 *          message: '手机号码不正确', // 错误提示语，alias: msg
 *          assert: 'tel', // 断言类型
 *          expected: '', // 期望值，部分断言类型不需要期望值
 *      }
 * ]
 */
function Validator(actual, expected) {
    if (typeof actual !== 'object') {
        throw new TypeError('校验值类型应为 Object')
    }
    let err = expected.find(function (item) {
        if (!STRATEGY[item.assert]) {
            throw new TypeError('assert 值不支持')
        }
        return !STRATEGY[item.assert](actual[item.property || item.prop], item.expected)
    })
    if (err) {
        return err.message || err.msg
    }
}

module.exports = Validator