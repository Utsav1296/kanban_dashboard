export const fetchUser = () => {
   const userInfo = (localStorage.getItem('token') !== 'undefined')
   return userInfo
}