export const customSelectTheme = (theme) => {
    return {
        ...theme,
        colors: {
            ...theme.colors,
            primary25: 'pink',
            primary: 'blue',
            text: 'black',
            backgroundColor: 'yellow'
        }
    };
};
export const selectOptions = [
    { value: true, label: 'Yes'},
    { value: false, label: 'No' }
];
export const certType = [
    { value: 'phd', label: 'PHD'},
    { value: 'masters', label: 'Masters' },
    { value: 'bachelors', label: 'Bachelors' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'competencyBased', label: 'Competency based' },
    { value: 'shortTerm', label: 'Short term' }
];
export const trainerTypes = [
    { value: 'Lecturer', label: 'Lecturer'},
    { value: 'Trainer', label: 'Trainer' },
    { value: 'Assistant', label: 'Assistant' }
];