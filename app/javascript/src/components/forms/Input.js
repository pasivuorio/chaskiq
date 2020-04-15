import React from 'react'
import Select from 'react-select'
import Button from '../Button'
import { isArray } from 'lodash'
import DatePicker from 'react-datepicker'
import { ColorPicker } from './ColorPicker'
import 'react-datepicker/dist/react-datepicker.css'

function borderColor (error) {
  if (error) {
    return 'red'
  }
  if (!error) {
    return 'gray'
  }
}

const WrappedComponent = React.forwardRef(function Input (
  {
    label,
    name,
    type,
    value,
    helperText,
    defaultValue,
    defaultChecked,
    disabled,
    handler,
    error,
    ...props
  },
  ref
) {
  function renderText () {
    return (
      <FormField
        name={name}
        label={label}
        error={error}
        helperText={helperText}
      >
        <input
          className={`shadow appearance-none border border-${borderColor(
            error
          )}-500 
              rounded w-full py-2 px-3 text-gray-700
              leading-tight focus:outline-none focus:shadow-outline`}
          name={name}
          type={type}
          defaultValue={defaultValue}
          value={value}
          disabled={disabled}
          onChange={props.onChange}
          placeholder={props.placeholder}
          ref={ref}
        />
      </FormField>
    )
  }

  function renderSelect () {
    const initialValue =
      props.data && props.data.multiple
        ? isArray(defaultValue)
          ? defaultValue.map((o) => ({ label: o, value: o }))
          : defaultValue
        : defaultValue

    const isMulti = props.data && props.data.multiple
    return (
      <FormField name={name} label={label} helperText={helperText}>
        <Select
          isMulti={isMulti}
          options={props.options}
          name={`${name}${props.data && props.data.multiple ? '[]' : ''}`}
          // inputProps={{ name: name }}
          value={value}
          defaultValue={initialValue}
          onChange={props.onChange}
          ref={ref}
        />
      </FormField>
    )
  }

  function renderCheckbox () {
    return (
      <div>
        <div className="flex items-center">
          <input
            id={name}
            name={name}
            type="checkbox"
            checked={value}
            value={true}
            disabled={disabled}
            onChange={props.onChange}
            defaultChecked={defaultValue}
            ref={ref}
            className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
          />
          <label
            htmlFor={name}
            className="ml-2 block text-sm leading-5 text-gray-900"
          >
            {label}
          </label>
        </div>

        {helperText && (
          <p className="mt-2 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }

  function renderUpload () {
    const ref = React.createRef()
    return (
      <FormField
        name={name}
        error={error}
        label={label}
        helperText={helperText}
      >
        <img src={defaultValue} alt={name} />

        <input
          accept="image/*"
          style={{ display: 'none' }}
          name={name}
          ref={ref}
          onChange={(e) => handler(e.currentTarget.files[0])}
          // multiple
          type="file"
        />

        <label htmlFor={name}>
          <Button
            variant="contained"
            component="span"
            onClick={(e) => {
              e.preventDefault()
              ref.current && ref.current.click()
            }}
          >
            Upload {label}
          </Button>
        </label>
      </FormField>
    )
  }

  function renderRadioButton () {
    return (
      <label className="inline-flex items-center">
        <input
          type="radio"
          className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
          id={name}
          name={name}
          value={value}
          disabled={disabled}
          defaultChecked={defaultChecked}
          onChange={props.onChange}
          ref={ref}
        />
        <div className="ml-2 block">
          <p className="text-sm leading-5 text-gray-900">{label}</p>

          {helperText && (
            <p className="mt-2 text-sm text-gray-500">{helperText}</p>
          )}
        </div>
      </label>
    )
  }

  function handeRenderType () {
    switch (type) {
      case 'text':
      case 'string':
      case 'password':
        return renderText()
      case 'textarea':
        return renderTextArea()
      case 'checkbox':
      case 'bool':
        return renderCheckbox()
      case 'select':
        return renderSelect()
      case 'radio':
        return renderRadioButton()
      case 'timezone':
        return renderTimezone()
      case 'upload':
        return renderUpload()
      case 'datetime':
        return renderDatetime()
      case 'color':
        return renderColor()
      default:
        return <p>nada {type}</p>
    }
  }

  function renderTextArea () {
    return (
      <div className="mt-6">
        {label && (
          <label
            htmlFor="about"
            className="block text-sm leading-5 font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <div className="">
          <textarea
            id="about"
            rows="3"
            className={`shadow appearance-none border border-${borderColor(
              error
            )}-500 rounded 
            w-full py-2 px-3 text-gray-700 mb-3 leading-tight 
            focus:outline-none focus:shadow-outline`}
            defaultValue={defaultValue}
            value={value}
            disabled={disabled}
            onChange={props.onChange}
            placeholder={props.placeholder}
            ref={ref}
          ></textarea>
        </div>
        {helperText && (
          <p className="mt-2 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }

  function renderTimezone () {
    const names = props.options.map((o) => ({ label: o, value: o }))
    const defaultTZ = Intl.DateTimeFormat().resolvedOptions().timeZone
    return (
      <FormField name={name} label={label} helperText={helperText}>
        <Select
          options={names}
          label={label}
          defaultData={name || defaultTZ}
          placeholder={'select timezone'}
          name={name}
          ref={ref}
        />
      </FormField>
    )
  }

  function renderColor () {
    return (
      <ColorPicker
        color={value}
        colorHandler={props.onChange}
        label={'Primary color'}
        error={error}
      />
    )
  }

  function renderDatetime () {
    const val = value || defaultValue

    return (
      <FormField
        name={name}
        label={label}
        error={error}
        helperText={helperText}
      >
        <DatePickerWrapper
          name={name}
          val={val}
          error={error}
          onChange={props.onChange}
        />
      </FormField>
    )
  }

  return (
    <div className={`mb-4 ${props.className ? props.className : ''}`}>
      {handeRenderType()}
    </div>
  )
})

export default WrappedComponent

function FormField ({ name, label, helperText, children, error }) {
  return (
    <React.Fragment>
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={name}
      >
        {label}
      </label>
      {children}
      {helperText && helperText}
    </React.Fragment>
  )
}

function DatePickerWrapper ({ val, name, onChange, error }) {
  const [value, setValue] = React.useState(val)

  function handleChange (val) {
    setValue(val)
    onChange && onChange(val)
  }

  return (
    <DatePicker
      name={name}
      selected={new Date(value)}
      // value={value || defaultValue}
      onChange={handleChange}
      showTimeSelect
      // defaultValue={defaultValue}
      className={`shadow appearance-none border border-${borderColor(
        error
      )}-500 rounded 
      w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none 
      focus:shadow-outline`}
      // includeTimes={[
      //  setHours(setMinutes(new Date(), 0), 17),
      //  setHours(setMinutes(new Date(), 30), 18),
      //  setHours(setMinutes(new Date(), 30), 19),
      //  setHours(setMinutes(new Date(), 30), 17)
      // ]}
      dateFormat="MMMM d, yyyy h:mm aa"
    />
  )
}