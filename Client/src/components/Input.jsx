import React from 'react'

function Input({field,func} ) {
  return (
    <input
    type={field}
    placeholder={field}
    className="input-field"
    // value={email}
    onChange={(e) => func(e.target.value)}
    required
  />
  )
}

export default Input
