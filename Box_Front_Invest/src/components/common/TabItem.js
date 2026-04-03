export default function Tab(props) {
  const { label, value, isActiveTab, onClick } = props

  const handleClick = () => {
    onClick(value)
  }

  return (
    <li className="tab_item">
      <button type="button" className={`tab_item_button ${isActiveTab ? 'active' : ''}`} onClick={handleClick}>
        {label}
      </button>
    </li>
  )
}
