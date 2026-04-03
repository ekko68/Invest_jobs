

const Pagination02 = (props) => {
  return (
    <div className="pagination02" >
      {/* button + active */}
      <button disabled={true}>
        <img src="/images/pagination_left.png" alt="" />
      </button>
      <button className="active">1</button>
      <button>2</button>
      <button>3</button>
      <button>
        <img src="/images/pagination_right.png" alt="" />
      </button>
    </div>
  )
}

export default Pagination02
