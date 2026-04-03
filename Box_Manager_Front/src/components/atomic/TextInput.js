import { useEffect, useState } from 'react'

export default function TextInput(props) {
  const { value = '', title = '', placeholder = '', length, onChange } = props
  const [text, setText] = useState(value)

  useEffect(() => {
    setText(value)
  }, [value])

  const handleChangeText = (eventText) => {
    setText(eventText)
    onChange(eventText)
  }

  return (
    <>
      <input
        type="text"
        className="input"
        placeholder={placeholder}
        maxLength={length}
        id={title}
        value={text}
        onChange={(event) => {
          handleChangeText(event.target.value)
        }}
      />
      {length ? (
        <div className="data_length">
          {text.length}/{length}
        </div>
      ) : (
        ''
      )}
    </>
  )
}
