import gql from 'graphql-tag'
export const NewsFragment = gql`
  fragment News on news {
    __typename
    id
    title
    content
  }
`
export const UserAccountFragment = gql`
  fragment UserAccount on auth_accounts {
    __typename
    id
    email
    user_id
  }
`
export const UserFragment = gql`
  fragment User on users {
    __typename
    id
    display_name
    avatar_url
    phone_number
    account {
      ...UserAccount
    }
  }
  ${UserAccountFragment}
`
export const CurrentUserFragment = gql`
  fragment CurrentUser on users {
    ...User
  }
  ${UserFragment}
`
export const CreateNewsPostDocument = gql`
  mutation createNewsPost($title: String!, $content: String!) {
    news: insert_news_one(object: { content: $content, title: $title }) {
      ...News
    }
  }
  ${NewsFragment}
`
export const UpdateCurrentUserDocument = gql`
  mutation updateCurrentUser(
    $userId: uuid!
    $user: users_set_input!
    $account: auth_accounts_set_input!
  ) {
    user: update_users_by_pk(pk_columns: { id: $userId }, _set: $user) {
      ...CurrentUser
    }
    account: update_auth_accounts(
      where: { user_id: { _eq: $userId } }
      _set: $account
    ) {
      returning {
        ...UserAccount
      }
    }
  }
  ${CurrentUserFragment}
  ${UserAccountFragment}
`
export const UpdateNewsPostDocument = gql`
  mutation updateNewsPost($postId: uuid!, $newsPost: news_set_input!) {
    news_post: update_news_by_pk(pk_columns: { id: $postId }, _set: $newsPost) {
      ...News
    }
  }
  ${NewsFragment}
`
export const GetCurrentUserDocument = gql`
  query getCurrentUser($userId: uuid!) {
    user: users_by_pk(id: $userId) {
      ...CurrentUser
    }
  }
  ${CurrentUserFragment}
`
export const GetNewsDocument = gql`
  query getNews {
    news: news {
      ...News
    }
  }
  ${NewsFragment}
`
export const GetNewsPostDocument = gql`
  query getNewsPost($postId: uuid!) {
    news_post: news_by_pk(id: $postId) {
      ...News
    }
  }
  ${NewsFragment}
`
export const CurrentUserDocument = gql`
  subscription currentUser($userId: uuid!) {
    user: users_by_pk(id: $userId) {
      ...CurrentUser
    }
  }
  ${CurrentUserFragment}
`
