import  { StylesConfig } from 'react-select';

export function getStyles<T>() {
  return {
    container: (provided) => ({
      ...provided,
      minWidth: '80px',
    }),
    control: (provided) => ({
      borderRadius: 0,
      boxShadow: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      width: '100%',
      fontSize: '16px',
      border: '2px solid #000',
      padding: '8px 8px',
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: 0,
      fontSize: '18px',
      fontFamily: `'Urbanist', sans-serif`,
      fontWeight: 'bold',
      textTransform: 'uppercase',
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: 0,
      border: '2px solid #000',
      borderTop: 'none',
      marginTop: 0,
      zIndex: 10,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#000' : '#fff',
      color: state.isSelected ? '#fff' : '#000',
      cursor: 'pointer',
      fontWeight: 'bold',
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '90px',
    }),
  } as StylesConfig<T>;
}
