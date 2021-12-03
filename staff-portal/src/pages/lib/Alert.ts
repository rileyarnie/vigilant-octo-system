import { toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export interface Alerts {
    showSuccess(msg: string);
    showError(msg: string);
}
export class ToastifyAlerts implements Alerts {
    constructor(){
        toast.configure();
    }
    readonly errorToast: ToastOptions = {
        position: toast.POSITION.TOP_RIGHT,
        className: 'toast.error',
        type: 'error',
        theme: 'colored',
        progressClassName: 'error-progress-bar',
        autoClose: 5000,
    };
    readonly successToast: ToastOptions = {
        position: toast.POSITION.TOP_RIGHT,
        className: 'toast.success',
        type: 'success',
        theme: 'colored',
        progressClassName: 'error-progress-bar',
        autoClose: 5000,
    };
    public showSuccess(msg: string) {
        toast(msg, this.successToast);
    }
    public showError(msg: string) {
        toast(msg, this.errorToast);
    }
}