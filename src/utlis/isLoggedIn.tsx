const isLoggedIn = () => {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

    return userInfo && userInfo.isStaff ? true : false;
};
export default isLoggedIn;
