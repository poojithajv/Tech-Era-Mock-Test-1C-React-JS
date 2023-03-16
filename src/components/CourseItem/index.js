import {Link} from 'react-router-dom'

import './index.css'

const CourseItem = props => {
  const {courseDetails} = props
  const {id, logoUrl, name} = courseDetails
  return (
    <Link to={`/courses/${id}`} className="link">
      <li className="course-item">
        <img className="course-logo" src={logoUrl} alt={name} />
        <p className="course-name">{name}</p>
      </li>
    </Link>
  )
}
export default CourseItem
