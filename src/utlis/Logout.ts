const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.assign('/login');
};
export default handleLogout;
