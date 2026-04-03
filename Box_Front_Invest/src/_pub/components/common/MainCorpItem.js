import {Link} from "react-router-dom";

const MainCorpItem = (props) => {
    const { data } = props
    return (
        <div className='corpitem'>
            <Link to={data.url} className='inner'>
                <p className="title">{data.title}</p>
                <div className="sub_content">
                    <div className="date">
                        설립일 : <span>{data.date}</span>
                    </div>
                    <div className="etc">
                        <p className="number">
                            직원수 : <span>{data.number}</span>명
                        </p>
                        <p className="views">
                            조회 : <span>{data.view}</span>
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default MainCorpItem