/**
 * Shared react-select styles for MSportFit dark UI (CSS variables from app theme).
 * @param {'filter' | 'calc'} variant
 * @returns {object} react-select styles object
 */
export function getMsportfitSelectStyles(variant = 'filter') {
  const isCalc = variant === 'calc';

  const accentBorder = 'rgba(232, 99, 10, 0.4)';
  const accentGlow = '0 0 0 2px rgba(232, 99, 10, 0.1)';
  const optionSelectedBg = 'rgba(232, 99, 10, 0.14)';
  const optionFocusedBg = 'rgba(255, 255, 255, 0.06)';

  return {
    container: (base) => ({
      ...base,
      width: '100%',
    }),
    control: (base, state) => ({
      ...base,
      minHeight: isCalc ? 46 : 38,
      fontSize: isCalc ? '0.92rem' : '0.88rem',
      fontFamily: 'inherit',
      backgroundColor: 'var(--color-surface-elevated)',
      borderColor: state.isFocused ? accentBorder : 'var(--color-border)',
      borderRadius: 'var(--radius-sm)',
      borderWidth: 1,
      boxShadow: state.isFocused ? accentGlow : 'none',
      cursor: 'pointer',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      '&:hover': {
        borderColor: state.isFocused ? accentBorder : 'rgba(255, 255, 255, 0.1)',
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: isCalc ? '2px 10px' : '2px 8px',
    }),
    singleValue: (base) => ({
      ...base,
      color: 'var(--color-text)',
      margin: 0,
    }),
    placeholder: (base) => ({
      ...base,
      color: 'var(--color-text-secondary)',
      opacity: 0.65,
      margin: 0,
    }),
    input: (base) => ({
      ...base,
      color: 'var(--color-text)',
      margin: 0,
      padding: 0,
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: 'auto',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: 'rgba(255, 255, 255, 0.45)',
      padding: isCalc ? '0 10px' : '0 8px',
      transition: 'color 0.15s',
      '&:hover': {
        color: 'rgba(255, 255, 255, 0.65)',
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: 'var(--color-surface-elevated)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-sm)',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45)',
      overflow: 'hidden',
      zIndex: 10000,
      /* Не вужче за контрол, але може розширитись під довгі підписи */
      minWidth: '100%',
      width: 'max-content',
      /* fixed + portal: обмежуємо ширину, щоб меню не «липло» до краю в’юпорту */
      maxWidth: 'calc(100vw - 2rem)',
      boxSizing: 'border-box',
    }),
    menuList: (base) => ({
      ...base,
      padding: '4px',
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 10000,
    }),
    option: (base, state) => ({
      ...base,
      fontSize: isCalc ? '0.92rem' : '0.88rem',
      fontFamily: 'inherit',
      cursor: 'pointer',
      borderRadius: 'calc(var(--radius-sm) - 2px)',
      padding: isCalc ? '10px 12px' : '8px 10px',
      whiteSpace: 'normal',
      lineHeight: 1.35,
      backgroundColor: state.isSelected
        ? optionSelectedBg
        : state.isFocused
          ? optionFocusedBg
          : 'transparent',
      color: 'var(--color-text)',
      '&:active': {
        backgroundColor: optionSelectedBg,
      },
    }),
  };
}
