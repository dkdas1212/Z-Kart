import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import Meta from '../components/Meta'
import { useParams } from 'react-router-dom';
import { listProducts } from '../actions/productActions'


const HomeScreen = ({  }) => {
  
  const dispatch = useDispatch()
  const params = useParams();
 
  const keyword = params.keyword;
  const pageNumber = params.pageNumber || 1
  const productList = useSelector((state) => state.productList);
  const { loading, error, products,page,pages} = productList;
  const pro = productList.products;
  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber))
  }, [dispatch, keyword, pageNumber])

  return (
    <>
     <Meta/>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to='/' className='btn btn-light'>
          Go Back
        </Link>
      )}
      <h1>Latest Products</h1>
      {console.log(productList.products)}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : pro?  (
          <Row>
            {pro.map((item) => (
              <Col key={item._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={item} />
              </Col>
            ))}
          </Row>
      ):" "} 
      <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ''}
          /> 
          
        
      
    </>
  )
}

export default HomeScreen
