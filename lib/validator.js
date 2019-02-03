// 定义在全局，避免每次校验都花时间初始化正则。
const PHONE = /^\s*(?:13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}\s*$/
const EMAIL = /^\s*(?:[A-Za-z0-9_\-\.])+\@(?:[A-Za-z0-9_\-\.])+\.(?:[A-Za-z]{2,4})\s*$/
const URL = /^\s*(?:(?:ht|f)tps?):\/\/[\w\-]+(?:\.[\w\-]+)+(?:[\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?\s*$/
const IDCARD = /(^\s*[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]\s*$)|(^\s*[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}\s*$)/
const NUMBER = /^\s*[+\-]?(?:[1-9]\d*|0)(?:[\.]\d*[1-9])?\s*$/
const DIGITS = /^\s*[+\-]?(?:[1-9]\d*|0)\s*$/
const VISIABLE_STR = /\S/

// 校验的策略列表
const STRATEGY = {
    required: function (actual) {
        // 0 和 false 属于有效值，仅包含一个或多个空白字符的字符串属于无效值
        let isInvalidStr = typeof actual === 'string' && !VISIABLE_STR.test(actual)
        return actual !== undefined && actual !== null && !isInvalidStr
    },

    // 允许数字类型或数字格式的字符串（前后可包含一个或多个空白字符，可以是小数和负数）
    number: function (actual) {
        return typeof number === 'number' || NUMBER.test(actual)
    },

    // 允许整数或整数格式的字符串（前后可包含一个或多个空白字符，可以是负数）
    digits: function (actual) {
        return (typeof actual === 'number' && actual % 1 === 0) || DIGITS.test(actual)
    },

    // 实际值应大于等于期望值
    min: function (actual, expected) {
        // 仅允许数字类型和数字格式字符串，不允许布尔值
        if (!this.number(expected)) {
            throw new TypeError('min() expected 值应为数字类型')
        }
        return this.number(actual) && actual >= expected
    },

    // 实际值应小于等于期望值，
    max: function (actual, expected) {
        // 仅允许数字类型和数字格式字符串，不允许布尔值
        if (!this.number(expected)) {
            throw new TypeError('max() expected 值应为数字类型')
        }
        return this.number(actual) && actual <= expected
    },

    // 实际值应该在期望的上限和下限之间，包含上限和下限
    between: function (actual, expected) {
        // 期望值可以是单个元素的数组或数字类型，则上限值和下限值相等
        if (this.number(expected)) {
            expected = [expected]
        } else if (!Array.isArray(expected)) {
            throw new TypeError('between() expected 应为数组')
        }

        // 上限值和下限值不区分顺序，小的值为下限，大的值为上限。
        let lowerLimit = Math.min.apply(Math, expected)
        let upperLimit = Math.max.apply(Math, expected)

        return this.min(actual, lowerLimit) && this.max(actual, upperLimit)
    },

    /**
     * 实际值的长度应大于等于期望值。
     */
    minlength: function (actual, expected) {
        // 期望值描述的是长度，应为整数类型
        if (!this.digits(expected)) {
            throw new TypeError('minlength() expected 应为整数类型')
        }
        // 对于数组，元素的个数应大于等于期望值；
        if (Array.isArray(actual)) {
            return this.min(actual.length, expected)
        // 对于字符串，则是字符的个数。不包含前后的空白字符
        } else if (typeof actual === 'string') {
            return this.min(actual.trim().length, expected)
        }
    },

    /**
     * 实际值的长度应小于等于期望值。
     */
    maxlength: function (actual, expected) {
        // 期望值描述的是长度，应为整数类型
        if (!this.digits(expected)) {
            throw new TypeError('maxlength() expected 应为整数类型')
        }
        // 对于数组，元素的个数应小于等于期望值；
        if (Array.isArray(actual)) {
            return this.max(actual.length, expected)
            // 对于字符串，则是字符的个数。不包含前后的空白字符
        } else if (typeof actual === 'string') {
            return this.max(actual.trim().length, expected)
        }
    },

    /**
     * 实际值的长度应该在期望的上限和下限之间，包含上限和下限
     */
    lengthBetween: function (actual, expected) {
        // 期望值可以是单个元素的数组或数字类型，则上限值和下限值相等
        if (this.digits(expected)) {
            expected = [expected]
        } else if (!Array.isArray(expected)) {
            throw new TypeError('lengthBetween() expected 应为数组')
        }
        // 上限值和下限值不区分顺序，小的值为下限，大的值为上限。
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

    /**
     * 值相等。对于复合类型（数组和对象），进行递归对比。对于基本类型，进行全等对比（即对比类型和值）。
     * @param {any} actual 实际值
     * @param {any} expected 期望值
     */
    equalTo: function (actual, expected) {
        // 对于数组，按序对比每一项
        if (Array.isArray(actual) && Array.isArray(expected)) {
            if (actual.length === expected.length) {
                let iterator = function (item, i) {
                    return this.equalTo(item, expected[i])
                }
                return actual.every(iterator.bind(this))
            }
        // 对于对象，对比所有字段。对象的键一样，且值也一样。忽略对象原型链上的属性。
        } else if (typeof actual === 'object' && typeof expected === 'object' && actual && expected) {
            let keyListA = Object.keys(actual)
            let keyListB = Object.keys(expected)
            if (keyListA.length === keyListB.length) {
                let iterator = function (item) {
                    return expected.hasOwnProperty(item) && this.equalTo(actual[item], expected[item])
                }
                return keyListA.every(iterator.bind(this))
            }
        } else if (typeof actual === 'string' && typeof expected === 'string') {
            // 对于字符串，进行对比时，忽略前后包含的空白字符。
            return actual.trim() === expected.trim()
        } else if (this.number(actual) && this.number(expected)) {
            // 对于期望值和实际值都是数字类型，进行隐式转换后，再对比
            return actual == expected
        } else {
            return actual === expected
        }
    },

    // 包含期望值。对于数组，对比的是单项；对于字符串，对比的是字串。
    includes: function (actual, expected) {
        return (Array.isArray(actual) || typeof actual === 'string') && actual.includes(expected)
    },

    // 在期望值中存在。对于数组，对比的是单项；对于字符串，对比的是字串。
    in: function (actual, expected) {
        if (!(Array.isArray(expected) || typeof expected === 'string')) {
            throw new TypeError('in() expected 应为数组或字符串')
        }
        // 对于用户的数据，忽略前后空白字符
        if (typeof actual === 'string') {
            actual = actual.trim()
        }
        return expected.includes(actual)
    }
}

// alias
STRATEGY.mobile = STRATEGY.phone = STRATEGY.tel
STRATEGY.mail = STRATEGY.email
STRATEGY.URL = STRATEGY.url
STRATEGY.eq = STRATEGY.equalTo
STRATEGY.length = STRATEGY.lengthBetween
STRATEGY.gte = STRATEGY.min
STRATEGY.lte = STRATEGY.max

/**
 * 校验的数据对象是否符合校验规则
 * @param {object} data 校验的数据对象
 * @param {Array<object>} rule 校验规则
 * @returns {string|undefined} 错误提示语
 * 
 * @example rule (校验规则)
 * [
 *      {
 *          property: 'phone', // 校验的字段名 alias: prop、key
 *          message: '手机号码不正确', // 错误提示语，alias: msg
 *          assert: 'tel', // 断言类型
 *          expected: '', // 期望值，部分断言类型不需要期望值
 *      }
 * ]
 */
function Validator(data, rule, allErrors) {
    if (!(data && typeof data === 'object')) {
        throw new TypeError('校验值类型应为 Object')
    } else if (!Array.isArray(rule)) {
        throw new TypeError('期望值应为 Array')
    }

    let iterator = function (item) {
        let prop = item.property || item.prop || item.key // alias
        let assert = STRATEGY[item.assert].bind(STRATEGY) // 校验方法
        let actual = data[prop] // 校验值
        let expected = item.expected // 期望值

        if (!assert) {
            console.warn('assert 值不支持')
            return
        }

        // 如果校验的数据对象不存在 property 指定的属性，则跳过。
        if (!data.hasOwnProperty(prop)) return

        return !assert(actual, expected)
    }

    // 当 allErrors 为 true，返回全部校验不通过的项目。默认仅返回第一项。
    let ret = rule[allErrors ? 'filter' : 'find'](iterator)

    if (Array.isArray(ret)) {
        let retVal = {}
        ret.forEach(function (item) {
            let prop = item.property || item.prop || item.key
            let msg = item.message || item.msg
            retVal[prop] = msg
        })
        return retVal
    } else if (typeof ret === 'object') {
        return ret.message || ret.msg
    }
}

/**
 * 同 Validator(data, rule)，但返回全部不通过的项目
 */
Validator.all = function (data, rule) {
    let allErrors = true
    return Validator(data, rule, allErrors)
}

module.exports = Validator