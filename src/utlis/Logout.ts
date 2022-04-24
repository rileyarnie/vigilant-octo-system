const handleLogout = () => {
    localStorage.clear();
    window.location.assign('/login');
};
export default handleLogout;
