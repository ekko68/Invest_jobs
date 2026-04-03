import { useEffect, useState } from 'react'
import TabItem from './TabItem'

export default function Tabs(props) {
  const { className = '', children, onChange, selectedTab } = props
  if (children.props) return <OneTab child={children} className={className} />
  const [activeTab, setActiveTab] = useState(selectedTab || children[0].props.value || children[0].props.label)

  const handleTabClick = (tabValue) => {
    setActiveTab(tabValue)
    if (typeof onChange === 'function') onChange(tabValue)
  }

  useEffect(() => {
    if (selectedTab) setActiveTab(selectedTab)
  }, [selectedTab])

  return (
    <>
      <ul className={`tab_list ${className}`}>
        {children.map((child) => {
          const { label } = child.props
          const value = child.props.value || label

          return (
            <TabItem
              key={label}
              label={label}
              value={value}
              onClick={handleTabClick}
              isActiveTab={value === activeTab}
            />
          )
        })}
      </ul>
      <div className="tab_content active">
        <h3 className="hide">{activeTab + ' 내용 시작'}</h3>
        {children.map((child) => {
          const { label } = child.props
          const value = child.props.value || label
          const active = value === activeTab

          return (
            <div key={value} className={active ? '' : 'hide'}>
              {child.props.children}
            </div>
          )
        })}
      </div>
    </>
  )
}
const OneTab = ({ child, className }) => {
  const { label } = child.props
  const value = child.props.value || label
  return (
    <>
      <ul className={`tab_list ${className}`}>
        <TabItem label={label} value={value} isActiveTab={true} onClick={() => {}} />
      </ul>
      <div className="tab_content active">
        <h3 className="hide">{label + ' 내용 시작'}</h3>
        <div>{child.props.children}</div>
      </div>
    </>
  )
}
