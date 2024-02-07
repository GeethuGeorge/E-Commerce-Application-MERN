import React from 'react'
import { useContext } from 'react'
import { ShopContext } from '../Contexts/ShopContext'
import { useParams } from 'react-router-dom'
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs'
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay'
import DescriptionBox from '../DescriptionBox/DescriptionBox'
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts'

const Product = () => {

  const{all_product}=useContext(ShopContext)//id in number format
  const {productId}=useParams();//id in string format
  //convert product id to number
  const product =all_product.find((item)=>item.id ===Number(productId))
  return (
    <div className="product">
      <Breadcrumbs product={product}/>
      <ProductDisplay product={product}/>
      <DescriptionBox/>
      <RelatedProducts/>
    </div>
  )
}

export default Product