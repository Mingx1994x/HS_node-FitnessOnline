module.exports = {

  isUndefined: (value) => {
    return value === undefined
  },
  isNotValidString: (value) => {
    return typeof value !== "string" || value.trim().length === 0 || value === ""
  },
  isNotValidInteger: (value) => {
    return !Number.isInteger(value) || value === 0
  },
  isNotValidUserName: (value) => {
    //最少2個字，最多10個字，不可包含任何特殊符號與空白
    const userNameRegex = /^[\u4e00-\u9fa5A-Za-z0-9]{2,10}$/;
    return !userNameRegex.test(value)
  },
  isNotValidEmail: (value) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return !emailRegex.test(value)
  },
  isNotValidUserPassword: (value) => {
    //需要包含英文數字大小寫，最短8個字，最長16個字
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    return !passwordRegex.test(value)
  },
  isNotValidUrl: (value) => {
    return !value.startsWith('https')
  },
  isNotValidImg: (value) => {
    let imgFormat = value.split('.').pop();
    return !((imgFormat === 'png' || imgFormat === 'jpg'))
  }

}