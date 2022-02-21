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
