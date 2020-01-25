import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { getBookReviews, deleteReview } from '../api/reviews-api'
import { getBookById } from '../api/book-api'
import { getAuthor } from '../api/author-api'
import Auth from '../auth/Auth'
import { UserReviewItem } from '../types/UserReviewItem'
import { BookItem } from '../types/BookItem'
import { AuthorItem } from '../types/AuthorItem'
import {} from '../api/author-api'
interface ReviewProps {
  match: {
    params: {
      bookId: string
    }
  }
  auth: Auth
  history: History
}

interface ReviewState {
  Reviews: any[]
  loadingReviews: boolean
}

export class Reviews extends React.PureComponent<ReviewProps, ReviewState> {
  state: ReviewState = {
    Reviews: [],
    loadingReviews: true
  }
  onReviewDelete = async (review: UserReviewItem) => {
    try {
      await deleteReview(this.props.auth.getIdToken(), review.bookId)
      var array = [...this.state.Reviews]
      var index = array.indexOf(review)
      if (index !== -1) {
        array.splice(index, 1)
        this.setState({ Reviews: array })
      }
    } catch {
      alert('Book creation failed')
    }
  }

  getBookData = async (
    bookId: string
  ): Promise<{ name: string; genre: string; authorName: string }> => {
    try {
      const book = await getBookById(this.props.auth.getIdToken(), bookId)
      const author = await getAuthor(
        this.props.auth.getIdToken(),
        book.authorId
      )
      return { name: book.name, genre: book.genre, authorName: author.name }
    } catch {
      alert('Failed to remove review failed')
      return { name: '', genre: '', authorName: '' }
    }
  }
  async componentDidMount() {
    try {
      console.log(this.props.match.params.bookId)
      const Reviews = await getBookReviews(
        this.props.auth.getIdToken(),
        this.props.match.params.bookId
      )
      console.log(Reviews)

      const ReviewData = Reviews.map(review => {
        return {
          review: review,
          bookData: this.getBookData(review.bookId)
        }
      })
      this.setState({
        Reviews: ReviewData,
        loadingReviews: false
      })
    } catch (e) {
      alert(`Failed to fetch Books: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Reviews for the book</Header>

        {this.renderReviews()}
      </div>
    )
  }

  renderReviews() {
    return this.renderReviewsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Books
        </Loader>
      </Grid.Row>
    )
  }

  renderReviewsList() {
    return (
      <Grid padded>
        {console.log(this.state.Reviews)}
        {this.state.Reviews.map((review, pos) => {
          console.log(review)
          return (
            <Grid.Row key={review.review.createdAt}>
              <Grid.Column width={1} verticalAlign="middle">
                {/*<Checkbox
                  onChange={() => this.onAuthorCheck(pos)}
                  //checked={}
                />*/}
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {review.bookData.name}
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {review.bookData.authorName}
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {review.bookData.genre}
              </Grid.Column>

              <Grid.Column width={2} verticalAlign="middle">
                {review.review.reviewRate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onReviewDelete(review)}
                >
                  {<Icon name="delete" />}
                </Button>
              </Grid.Column>

              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
