import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import CourseItem from '../CourseItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    data: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.getCoursesData()
  }

  getCoursesData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = 'https://apis.ccbp.in/te/courses'
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const fetchedData = await response.json()
    if (response.ok) {
      const updatedData = fetchedData.courses.map(eachCourse => ({
        id: eachCourse.id,
        logoUrl: eachCourse.logo_url,
        name: eachCourse.name,
      }))
      this.setState({data: updatedData, apiStatus: apiStatusConstants.success})
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderSuccessView = () => {
    const {data} = this.state
    return (
      <div className="main-container">
        <h1 className="heading">Courses</h1>
        <ul className="courses-container">
          {data.map(eachCourse => (
            <CourseItem key={eachCourse.id} courseDetails={eachCourse} />
          ))}
        </ul>
      </div>
    )
  }

  onClickRetry = () => {
    this.getCoursesData()
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png"
        alt="failure view"
        className="error-image"
      />
      <h1 className="error-heading">Oops! Something Went Wrong</h1>
      <p className="error-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="retry-button"
        type="button"
        onClick={this.onClickRetry}
      >
        Retry
      </button>
    </div>
  )

  renderCoursesView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderCoursesView()}
      </>
    )
  }
}
export default Home
