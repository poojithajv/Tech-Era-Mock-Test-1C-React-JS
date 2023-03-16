import './index.css'

import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CourseDetails extends Component {
  state = {
    data: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.getCourseData()
  }

  getCourseData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/te/courses/${id}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const fetchedData = await response.json()
    if (response.ok) {
      const eachData = fetchedData.course_details
      const updatedData = {
        id: eachData.id,
        description: eachData.description,
        imageUrl: eachData.image_url,
        name: eachData.name,
      }

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

  onClickRetry = () => {
    this.getCourseData()
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

  renderSuccessView = () => {
    const {data} = this.state
    const {id, name, description, imageUrl} = data
    return (
      <div className="course-description-container" key={id}>
        <img className="course-image" src={imageUrl} alt={name} />
        <div className="course-info-container">
          <h1 className="course-title">{name}</h1>
          <p className="course-description">{description}</p>
        </div>
      </div>
    )
  }

  renderCourseDetails = () => {
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
        {this.renderCourseDetails()}
      </>
    )
  }
}
export default CourseDetails
