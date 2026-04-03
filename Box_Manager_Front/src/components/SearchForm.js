import Select from './atomic/Select'
import { useRef } from 'react'

const SearchForm = (props) => {
  const {
    searchInput,
    placeholder = '',
    setSearchInput,
    selectList,
    onSelectActive,
    handleSearch,
    selectNone = false
  } = props
  const searchSelect = useRef(null)
  const defaultSelect = {
    active: 'searchContent',
    list: [
      { id: 'searchContent', value: 'searchContent', label: '제목' },
      { id: 'searchUser', value: 'searchUser', label: '작성자' }
    ]
  }
  // 검색
  const onSearch = () => {
    handleSearch()
  }
  // Enter + 검색
  const onKeyPress = (e) => {
    // console.log("e.key", e.key)
    e.key === 'Enter' && onSearch()
  }
  // input value set
  const handleSetInput = (value) => {
    if (setSearchInput) {
      setSearchInput(value)
    }
  }
  return (
    <div className="search_wrap both_clear">
      {!selectNone && (
        <Select
          optionList={selectList ? selectList : defaultSelect}
          handleSelectActive={onSelectActive}
          ref={searchSelect}
        />
      )}
      <input
        type="text"
        className={'input'}
        value={searchInput}
        placeholder={placeholder}
        onChange={(e) => handleSetInput(e.target.value)}
        onKeyDown={onKeyPress}
        title={'검색어입력'}
      />
      <button className="button full_blue button_search" onClick={onSearch}>
        <span className="hide">검색</span>
      </button>
    </div>
  )
}

export default SearchForm
