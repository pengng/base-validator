const STRATEGY = {
    required: function (actual) {
        // 0 和 false 属于有效值，仅包含一个或多个空白字符的字符串属于无效值
        let isInvalidStr = typeof actual === 'string' && !/\S/.test(actual)
        return actual !== undefined && actual !== null && !isInvalidStr
    },

    min: function (actual, expected) {
        return actual >= expected
    },

    max: function (actual, expected) {
        return actual <= expected
    },

    minlength: function (actual, expected) {
        return (Array.isArray(actual) || typeof actual === 'string') && actual.length >= expected
    },

    maxlength: function (actual, expected) {
        return (Array.isArray(actual) || typeof actual === 'string') && actual.length <= expected
    },

    tel: function (actual) {
        return /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(actual)
    },

    email: function (actual) {
        return /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(actual)
    },

    url: function (actual) {
        return /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/.test(actual)
    },

    date: function (actual) {
        
    },

    dateISO: function (actual) {
        
    },

    number: function (actual) {
        return typeof number === 'number' || /^(+|-)?[1-9]\d*([.]\d*[1-9])?$/.test(actual)
    },

    digits: function (actual) {
        return actual === parseInt(actual) || /^(+|-)?[1-9]\d*$/.test(actual)
    },

    idcard: function (actual) {
        return /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/.test(actual)
    },

    equalTo: function (actual, expected) {
        return actual === expected
    },

    between: function (actual, expected) {
        let lowerLimit = expected[0]
        let upperLimit = expected[1]
        return actual >= lowerLimit && actual <= upperLimit
    },

    betweenLength: function (actual, expected) {
        let lowerLimit = expected[0]
        let upperLimit = expected[1]
        return (Array.isArray(actual) || typeof actual === 'string') && actual.length >= lowerLimit && actual.length <= upperLimit
    },

    regular: function (actual, expected) {
        if (typeof expected === 'string') {
            let lastIdx = expected.lastIndexOf('/')
            expected = new RegExp(expected.slice(1, lastIdx), expected.slice(lastIdx + 1))
        }
        return expected.test(actual)
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