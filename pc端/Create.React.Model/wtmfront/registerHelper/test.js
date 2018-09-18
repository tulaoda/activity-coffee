/**
 * 注册 helper  内置 EditFormItem HeaderFormItem JSONStringify
 * @param {*} Handlebars 
 */
module.exports = (Handlebars) => {
    Handlebars.registerHelper('test', function (person) {
        return "我是测试代码 registerHelper" + JSON.stringify(person)
    });
}