function AgreementItem({ id, label, required, checked, onChange }) {
  return (
    <label className="signup__agree-item" htmlFor={id}>
      <input id={id} type="checkbox" checked={checked} onChange={onChange} />
      <span>
        {label} {required ? <em>[필수]</em> : <em className="signup__optional">[선택]</em>}
      </span>
      <button type="button" className="signup__detail-link">Details links</button>
    </label>
  )
}

export default AgreementItem
