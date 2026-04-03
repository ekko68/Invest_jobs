import React, { lazy } from 'react'
import { Switch, Route } from 'react-router-dom'
import ROUTER_NAMES from 'modules/consts/RouterConst'

// 메인배너
const BooksBannerMainList = lazy(() => import('pages/books/banner/main/List').then((c) => c))
const BooksBannerMainView = lazy(() => import('pages/books/banner/main/View').then((c) => c))
const BooksBannerMainEdit = lazy(() => import('pages/books/banner/main/Write').then((c) => c))

// 광고배너
const BooksBannerAdList = lazy(() => import('pages/books/banner/ad/List').then((c) => c))
const BooksBannerAdView = lazy(() => import('pages/books/banner/ad/View').then((c) => c))
const BooksBannerAdEdit = lazy(() => import('pages/books/banner/ad/Write').then((c) => c))

// 회원관리
const BooksUserList = lazy(() => import('pages/books/user/List').then((c) => c))
const BooksUserView = lazy(() => import('pages/books/user/View').then((c) => c))

// 추심관리
const BooksCollectionList = lazy(() => import('pages/books/collection/List').then((c) => c))
const BooksCollectionView = lazy(() => import('pages/books/collection/View').then((c) => c))


// prettier-ignore
const BooksRouter = (props) => {
  return (
    <>
      <Switch>
        <Route exact path={ROUTER_NAMES.BOOKS_BANNER_MAIN_LIST} component={(props) => <BooksBannerMainList {...props} />} />
        <Route exact path={`${ROUTER_NAMES.BOOKS_BANNER_MAIN_VIEW}/:id`}component={(props) => <BooksBannerMainView {...props} />} />
        <Route exact path={[`${ROUTER_NAMES.BOOKS_BANNER_MAIN_EDIT}/:id`,ROUTER_NAMES.BOOKS_BANNER_MAIN_EDIT]} component={(props) => <BooksBannerMainEdit {...props} />} />

        <Route exact path={ROUTER_NAMES.BOOKS_BANNER_AD_LIST} component={(props) => <BooksBannerAdList {...props} />} />
        <Route exact path={`${ROUTER_NAMES.BOOKS_BANNER_AD_VIEW}/:id`} component={(props) => <BooksBannerAdView {...props} />} />
        <Route exact path={[`${ROUTER_NAMES.BOOKS_BANNER_AD_EDIT}/:id`,ROUTER_NAMES.BOOKS_BANNER_AD_EDIT]} component={(props) => <BooksBannerAdEdit {...props} />} />


        <Route exact path={ROUTER_NAMES.BOOKS_USER_LIST} component={(props) => <BooksUserList {...props} />} />
        <Route exact path={`${ROUTER_NAMES.BOOKS_USER_VIEW}/:id`} component={(props) => <BooksUserView {...props} />} />

        <Route exact path={ROUTER_NAMES.BOOKS_COLLECTION_LIST} component={(props) => <BooksCollectionList {...props} />} />
        <Route exact path={`${ROUTER_NAMES.BOOKS_COLLECTION_VIEW}`} component={(props) => <BooksCollectionView {...props} />} />


      </Switch>
    </>
  )
}
export default BooksRouter
