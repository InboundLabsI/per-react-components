const customSelectStyles = {
    control: (provided, state) => {
        const boxShadow = state.isFocused ? 'none' : 'none'
        return { ...provided, boxShadow };
    },
    menu: (provided, state) => {
        const padding = '21px 0'
        const border = '1px solid #CCCCCC'
        const boxShadow = '0px 0px 5px rgba(0, 0, 0, 0.17)'
        const top = '-35px'
        return { ...provided, padding, border, boxShadow, top };
    },
    option: (provided, state) => {
        const padding = '11px 32px'
        const fontSize = '13px'
        const lineHeight = '16px'

        return { ...provided, padding, fontSize, lineHeight };
    },
    singleValue: (provided, state) => {
        const fontSize = '13px'
        const lineHeight = '16px'
        const borderColor = state.isFocused ? '#ccc' : '#ccc'
        return { ...provided, fontSize, lineHeight, borderColor };
    },
    placeholder: (provided, state) => {
        const fontSize = '13px'
        const lineHeight = '16px'

        return { ...provided, fontSize, lineHeight };
    },
}

const customCategorySelectStyles = {
    container: (provided, state) => {
        return { ...provided, margin: '0 16px 0 0', flex: 1 };
    },
    control: (provided, state) => {
        const boxShadow = state.isFocused ? 'none' : 'none'
        const border = '1px solid #DCDDDE'
        return { ...provided, boxShadow, border, minHeight: 64, borderRadius: 4 };
    },
    indicatorSeparator: (provided, state) => {
        return { ...provided, display: 'none' };
    },
    menu: (provided, state) => {
        const padding = '21px 0'
        const border = '1px solid #CCCCCC'
        const boxShadow = '0px 0px 5px rgba(0, 0, 0, 0.17)'
        const top = '100%'
        return { ...provided, padding, border, boxShadow, top };
    },
    option: (provided, state) => {
        const padding = '11px 32px'
        const fontSize = '13px'
        const lineHeight = '16px'
        return { ...provided, padding, fontSize, lineHeight, backgroundColor: state.isFocused ? '#F5F8FA' : state.isSelected ? '#F5F8FA' : 'transparent', color: '#191919' };
    },
    singleValue: (provided, state) => {
        const fontSize = '13px'
        const lineHeight = '16px'
        const borderColor = state.isFocused ? '#ccc' : '#ccc'
        return { ...provided, fontSize, lineHeight, borderColor };
    },
    placeholder: (provided, state) => {
        const fontSize = '13px'
        const lineHeight = '16px'

        return { ...provided, fontSize, lineHeight };
    },
}

export {
    customSelectStyles,
    customCategorySelectStyles
}