import Config from '../config';

const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.assign(`${Config.basename}/login`);
};
export default handleLogout;
