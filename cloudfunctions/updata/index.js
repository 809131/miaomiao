// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "dev-ymb"
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    /* ********** */
    if (typeof event.data == 'string') {
      event.data = eval('(' + event.data + ')') //eval将字符串转为js语句
    }
    /* 判断doc是否存在 如果doc存在则更新云函数数据，不做新添加 ；不存在就重新添加数据 */

    if (event.doc) {
      return await db.collection(event.collection)
        .doc(event.doc)
        .update({ // data 传入需要局部更新的数据
          data: { // 表示将 es6的运算符
            ...event.data
          }
        })
    } else {
      return await db.collection(event.collection)
        .where({
          ...event.doc
        })
        .update({
          // data 传入需要局部更新的数据
          data: {
            // 表示将 es6的运算符
            ...event.data
          }
        })
    }
    /* ********** */
  } catch (e) {
    console.error(e)
  }
}