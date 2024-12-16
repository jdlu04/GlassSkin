import React from 'react'
import ProductCard from "../Components/ProductCard";
import { useState } from 'react';

const Products = () => {
  const productIds = Array.from({ length: 60 }, (_, index) => index + 1);
    return (
    <>
    <div className="min-h-75 w-screen bg-green">
      <div className="text-center py-20 px-10 text-8xl">
        <h1 className="fade-in">Curated for your look</h1>
        <h1 className="text-5xl p-2 text-dark_green py-10 fade-in">
          Express your inner beauty
        </h1>
      </div>
    </div>
    <div className='w-screen p-5 flex flex-wrap justify-center gap-5'>
      {productIds.map((productId) => (
          <ProductCard key={productId} productId={productId} />
        ))}
    </div>
    </>
  )
}

export default Products