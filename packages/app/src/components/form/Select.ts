import { StylesConfig } from 'react-select';

export function getStyles<T>() {
  return {
    container: (provided) => ({
      ...provided,
      minWidth: '80px',
    }),
    control: () => ({
      borderRadius: 8,
      background: '#fefaf3',
      boxShadow: '3px 3px 0px 1px #31322d',
      cursor: 'pointer',
      width: '100%',
      fontSize: '16px',
      border: '3px solid #000',
      padding: '8px 8px',
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      padding: 0,
      fontSize: '18px',
      fontWeight: 'bold',
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: 8,
      background: '#fefaf3',
      boxShadow: '3px 3px 0px 1px #31322d',
      border: '3px solid #000',
      overflow: 'hidden',
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
