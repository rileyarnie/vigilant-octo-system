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
    { value: 'true', label: 'Yes'},
    { value: 'false', label: 'No' }
];
export const certType = [
    { value: 'Degree', label: 'Bachelors'},
    { value: 'Diploma', label: 'Diploma' },
    { value: 'Certificate', label: 'Certificate' }
];
export const trainerTypes = [
    { value: 'Lecturer', label: 'Lecturer'},
    { value: 'Trainer', label: 'Trainer' },
    { value: 'Assistant', label: 'Assistant' }
];