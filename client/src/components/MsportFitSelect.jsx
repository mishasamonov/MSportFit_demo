import { useMemo } from 'react';
import Select from 'react-select';
import { getMsportfitSelectStyles } from '../lib/msportfitReactSelectStyles';

/**
 * Single-value select aligned with MSportFit dark inputs (react-select).
 * @param {object} props
 * @param {string} [props.id]
 * @param {'filter' | 'calc'} [props.variant]
 * @param {string} props.value — controlled string value (match option.value)
 * @param {Array<{ value: string, label: string }>} props.options
 * @param {(value: string) => void} props.onChange
 * @param {number} [props.maxMenuHeight] — висота меню до прокрутки (типово 280, як раніше в menuList)
 */
export default function MsportFitSelect({
  id,
  variant = 'filter',
  value,
  options,
  onChange,
  maxMenuHeight = 280,
  ...rest
}) {
  const styles = useMemo(() => getMsportfitSelectStyles(variant), [variant]);

  const selected = useMemo(() => options.find((o) => o.value === value) ?? null, [options, value]);

  return (
    <Select
      {...rest}
      inputId={id}
      instanceId={id || 'msf-select'}
      classNamePrefix="msf-rs"
      isSearchable={false}
      blurInputOnSelect
      menuPlacement="auto"
      menuPosition="fixed"
      menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
      maxMenuHeight={maxMenuHeight}
      styles={styles}
      value={selected}
      options={options}
      onChange={(opt) => onChange(opt ? opt.value : '')}
    />
  );
}
