import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {formatDistanceToNow} from 'date-fns'
import Loader from 'react-loader-spinner'

import {GoPrimitiveDot} from 'react-icons/go'
import {HiFire} from 'react-icons/hi'

import HeaderComponent from '../HeaderComponent'
import NavigationMenuAsLeftSideBar from '../NavigationMenuAsLeftSideBar'
import FailureViewComponent from '../FailureViewComponent'

import {
  NavigationAndTrendingPartContainer,
  LoaderOrFailureContainer,
  TrendingComponentContainer,
  LoaderComponent,
  TrendingTopHeadContainer,
  TrendingLogo,
  TrendingVideoAndDetailsContainer,
  TrendingsContainer,
  EachVideoThumbnailImage,
  LinkContainer,
  ChannelLogoVideoTitleInformationContainer,
  ChannelLogoImage,
  VideoTitleInformationContainer,
  VideoTitle,
  VideoInformation,
  ChannelTitle,
  ChannesViewsAndUpdatedTime,
  PrimitiveDotChangingScreens,
  PrimitiveDot,
  ChannelViewAndUpdatedTimeContainer,
} from './StyledComponents'

const dataFetchStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class TrendingRoute extends Component {
  state = {
    listOfVideosDetails: [],
    dataFetchStatus: dataFetchStatusConstants.initial,
  }

  componentDidMount = () => {
    this.getListOfVideosData()
  }

  getListOfVideosData = async () => {
    this.setState({dataFetchStatus: dataFetchStatusConstants.loading})
    const response = await fetch('https://apis.ccbp.in/videos/trending', {
      method: 'GET',
      headers: {authorization: `Bearer ${Cookies.get('jwt_token')}`},
    })
    if (response.ok) {
      const data = await response.json()

      console.log(data.videos)

      this.setState({dataFetchStatus: dataFetchStatusConstants.success})
      this.setState({listOfVideosDetails: data.videos})
    }
    if (!response.ok) {
      this.setState({dataFetchStatus: dataFetchStatusConstants.failure})
    }
    console.log('fetching data function complete')
  }

  renderRoutePartOnDataResponse = () => {
    const {dataFetchStatus, listOfVideosDetails} = this.state

    switch (dataFetchStatus) {
      case dataFetchStatusConstants.loading:
        return (
          <LoaderOrFailureContainer data-testid="loader">
            <LoaderComponent
              as={Loader}
              type="ThreeDots"
              color="#4f46e5"
              height="50"
              width="50"
            />
          </LoaderOrFailureContainer>
        )
      case dataFetchStatusConstants.failure:
        return (
          <LoaderOrFailureContainer>
            <FailureViewComponent retryFunction={this.getListOfVideosData} />
          </LoaderOrFailureContainer>
        )
      case dataFetchStatusConstants.success:
        return (
          <div>
            <TrendingTopHeadContainer>
              <TrendingLogo as={HiFire} />
              <h1>Trending</h1>
            </TrendingTopHeadContainer>
            <TrendingsContainer>
              {listOfVideosDetails.map(each => {
                const {channel} = each

                return (
                  <TrendingVideoAndDetailsContainer key={each.id}>
                    <LinkContainer as={Link} to={`/videos/${each.id}`}>
                      <EachVideoThumbnailImage
                        src={each.thumbnail_url}
                        alt="video thumbnail"
                      />
                      <ChannelLogoVideoTitleInformationContainer>
                        <ChannelLogoImage
                          src={channel.profile_image_url}
                          alt="channel logo"
                        />
                        <VideoTitleInformationContainer>
                          <VideoTitle>{each.title}</VideoTitle>
                          <VideoInformation>
                            <ChannelTitle>{channel.name}</ChannelTitle>
                            <ChannelViewAndUpdatedTimeContainer>
                              <PrimitiveDotChangingScreens
                                as={GoPrimitiveDot}
                              />
                              <ChannesViewsAndUpdatedTime>
                                {each.view_count} views
                              </ChannesViewsAndUpdatedTime>
                              <PrimitiveDot as={GoPrimitiveDot} />
                              <ChannesViewsAndUpdatedTime>
                                {/* each.published_at */}
                                {formatDistanceToNow(
                                  new Date(each.published_at),
                                  {
                                    addSuffix: true,
                                  },
                                )
                                  .split(' ')
                                  .reverse()
                                  .slice(0, 3)
                                  .reverse()
                                  .join(' ')}
                              </ChannesViewsAndUpdatedTime>
                            </ChannelViewAndUpdatedTimeContainer>
                          </VideoInformation>
                        </VideoTitleInformationContainer>
                      </ChannelLogoVideoTitleInformationContainer>
                    </LinkContainer>
                  </TrendingVideoAndDetailsContainer>
                )
              })}
            </TrendingsContainer>
          </div>
        )
      default:
        return null
    }
  }

  render() {
    console.log('TrendingRoute')
    console.log(this.props)

    return (
      <div>
        <HeaderComponent />
        <NavigationAndTrendingPartContainer>
          <NavigationMenuAsLeftSideBar />
          <TrendingComponentContainer>
            {this.renderRoutePartOnDataResponse()}
          </TrendingComponentContainer>
        </NavigationAndTrendingPartContainer>
      </div>
    )
  }
}

export default TrendingRoute
