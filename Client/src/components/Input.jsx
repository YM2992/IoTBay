function Input({field,func, type="text"} ) {
  return (
    <input
    type={type}
    placeholder={field}
    className="input-field"
    // value={email}
    onChange={(e) => func(e.target.value)}
    required
  />
  )
}

export default Input
