import React, { useState } from 'react';
import ConfirmationModalWrapper from '../../App/components/modal/ConfirmationModalWrapper';
import ModalWrapper from '../../App/components/modal/ModalWrapper';
import { timetablingAxiosInstance } from '../../utlis/interceptors/timetabling-interceptor';
import { Alerts, ToastifyAlerts } from '../lib/Alert';
import { TextInput, ValidationForm } from 'react-bootstrap4-form-validation';

const alerts: Alerts = new ToastifyAlerts();

interface Props {
    programCohortSemesterId: number;
    showCutOffModal: boolean;
    setShowModal;
    modalTitle: string;
    examCutOffDate: Date | null;
}

const ChangeExamCutOffModal: React.FunctionComponent<Props> = (props) => {
    const [cutOffDate, setCutOffDate] = useState(new Date());
    const [disabled, setDisabled] = useState(false);
    const [activationModal, setActivationModal] = useState(false);
    const handleClose = () => props.setShowModal(false);
    function handleCloseActivationModal() {
        setActivationModal(false);
    }

    async function updatePCSCutOffDate(pcsId: number, updates: unknown) {
        setDisabled(true);
        try {
            try {
                await timetablingAxiosInstance.put(`/program-cohort-semesters/${pcsId}/marks-entry-cutoff`, updates);
                alerts.showSuccess('Successfully updated program cohort semester');
                props.setShowModal(false);
            } catch (error) {
                alerts.showError((error as Error).message);
            }
        } finally {
            setDisabled(false);
            setActivationModal(false);
        }
    }

    return (
        <>
            <ModalWrapper show={props.showCutOffModal} title={props.modalTitle} closeModal={handleClose} modalSize="md" noFooter>
                <h6>Enter a new cut off date</h6>
                <ValidationForm
                    onSubmit={(e) => {
                        e.preventDefault();
                        setActivationModal(true);
                    }}
                >
                    <div>
                        <TextInput
                            name="startDate"
                            id="startDate"
                            type="date"
                            required
                            defaultValue={props.examCutOffDate ? props.examCutOffDate : new Date()}
                            onChange={(e) => {
                                setCutOffDate(e.target.value);
                            }}
                        />
                    </div>
                    <div className="form-group mt-4">
                        <button className="btn btn-info float-right">Submit</button>
                        <button
                            className="btn btn-danger float-left"
                            onClick={(e) => {
                                e.preventDefault();
                                handleClose();
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </ValidationForm>
            </ModalWrapper>

            <ConfirmationModalWrapper
                disabled={disabled}
                submitButton
                submitFunction={() =>
                    updatePCSCutOffDate(props.programCohortSemesterId, { examCutOffDate: new Date(cutOffDate).toISOString() })
                }
                closeModal={handleCloseActivationModal}
                show={activationModal}
            >
                <h6 className="text-center">
                    Are you sure you want to change the exam cut off date of Program Cohort Semester Id {props.programCohortSemesterId} to{' '}
                    {new Date(cutOffDate).toDateString()}
                </h6>
            </ConfirmationModalWrapper>
        </>
    );
};

export default ChangeExamCutOffModal;
