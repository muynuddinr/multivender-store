"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiTruck, FiRefreshCw, FiHeadphones, FiStar, FiChevronRight, FiChevronLeft, FiPackage } from 'react-icons/fi';
import { MdLocalOffer, MdStorefront } from 'react-icons/md';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Hero slider data
  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1920&h=1080&fit=crop",
      title: "Discover Unique Products",
      description: "From local artisans and global brands",
      buttonText: "Shop Now",
      buttonLink: "/products",
      color: "from-indigo-600 to-purple-700",
    },
    {
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1920&h=1080&fit=crop",
      title: "Summer Collection 2023",
      description: "Refresh your style with seasonal trends",
      buttonText: "Explore",
      buttonLink: "/summer-collection",
      color: "from-pink-600 to-red-500",
    },
    {
      image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=1920&h=1080&fit=crop",
      title: "Special Offers",
      description: "Up to 50% off on selected items",
      buttonText: "View Deals",
      buttonLink: "/sale",
      color: "from-green-600 to-teal-500", 
    }
  ];

  // Featured categories
  const categories = [
    { name: "Men", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=300&h=300", link: "/men" },
    { name: "Women", image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=300&h=300", link: "/women" },
    { name: "Kids", image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=300&h=300", link: "/kids" },
    { name: "Accessories", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=300&h=300", link: "/accessories" },
    { name: "Electronics", image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=300&h=300", link: "/electronics" },
    { name: "Home & Kitchen", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=300&h=300", link: "/home-kitchen" },
  ];

  // Featured products (sample data)
  const featuredProducts = [
    {
      id: 1,
      name: "Premium Leather Jacket",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=500&h=500&fit=crop",
      rating: 4.8,
      reviews: 124,
      seller: "LeatherCraft Co.",
      discount: 15,
    },
    {
      id: 2,
      name: "Wireless Noise Cancelling Headphones",
      price: 149.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&h=500&fit=crop",
      rating: 4.7,
      reviews: 89,
      seller: "AudioTech",
      discount: 0,
    },
    {
      id: 3,
      name: "Smart Fitness Watch",
      price: 99.99,
      image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=500&h=500&fit=crop",
      rating: 4.5,
      reviews: 76,
      seller: "GadgetHub",
      discount: 10,
    },
    {
      id: 4,
      name: "Handcrafted Ceramic Vase",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1612196808214-b1b39ce6b29c?q=80&w=500&h=500&fit=crop",
      rating: 4.9,
      reviews: 42,
      seller: "ArtisanDecor",
      discount: 0,
    },
    {
      id: 5,
      name: "Organic Cotton T-Shirt",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=500&h=500&fit=crop",
      rating: 4.6,
      reviews: 118,
      seller: "EcoApparel",
      discount: 5,
    },
    {
      id: 6,
      name: "Professional Kitchen Knife Set",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1593618998160-854542445a81?q=80&w=500&h=500&fit=crop",
      rating: 4.8,
      reviews: 65,
      seller: "CulinaryExperts",
      discount: 20,
    },
    {
      id: 7,
      name: "Handmade Leather Wallet",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=500&h=500&fit=crop",
      rating: 4.7,
      reviews: 53,
      seller: "LeatherCraft Co.",
      discount: 0,
    },
    {
      id: 8,
      name: "Portable Bluetooth Speaker",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=500&h=500&fit=crop",
      rating: 4.6,
      reviews: 87,
      seller: "AudioTech",
      discount: 15,
    },
  ];
  
  // Featured sellers/brands
  const featuredSellers = [
    { name: "LeatherCraft Co.", logo: "https://images.unsplash.com/photo-1634712282287-14ed57b9cc89?q=80&w=150&h=150&fit=crop", products: 128 },
    { name: "EcoApparel", logo: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=150&h=150&fit=crop", products: 96 },
    { name: "GadgetHub", logo: "https://images.unsplash.com/photo-1606663889134-b1dedb5ed8b7?q=80&w=150&h=150&fit=crop", products: 215 },
    { name: "ArtisanDecor", logo: "https://images.unsplash.com/photo-1592492152545-9695d3f473f4?q=80&w=150&h=150&fit=crop", products: 64 },
    { name: "AudioTech", logo: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=150&h=150&fit=crop", products: 108 },
  ];
  
  // Testimonials
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Regular Customer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&fit=crop",
      text: "I love shopping at MULTI-STORE! The variety of products from different sellers gives me so many options. The quality is always great and delivery is prompt."
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Verified Buyer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&fit=crop",
      text: "As someone who values unique items, this marketplace is a treasure trove. I've discovered so many small businesses with amazing products I wouldn't find elsewhere."
    },
    {
      id: 3,
      name: "Priya Sharma",
      role: "Fashion Enthusiast",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&h=100&fit=crop",
      text: "The curated collections make it easy to find exactly what I'm looking for. Customer service is excellent, and returns are hassle-free when needed."
    }
  ];

  // Auto-advance slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  // Product Card Component
  const ProductCard = ({ product }: { product: any }    ) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        <div className="h-64 relative overflow-hidden">
          <Image 
            src={product.image} 
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-500 hover:scale-105"
          />
        </div>
        {product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {product.discount}% OFF
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="text-xs text-gray-500 mb-1">
          {product.seller}
        </div>
        <h3 className="text-md font-medium text-gray-900 mb-1 truncate">{product.name}</h3>
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <FiStar className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="ml-1 text-xs text-gray-600">{product.rating}</span>
          </div>
          <span className="mx-1 text-xs text-gray-400">|</span>
          <span className="text-xs text-gray-500">{product.reviews} reviews</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {product.discount > 0 ? (
              <>
                <span className="text-md font-bold text-gray-900">
                  ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                </span>
                <span className="ml-2 text-xs line-through text-gray-500">
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-md font-bold text-gray-900">${product.price.toFixed(2)}</span>
            )}
          </div>
          <button className="p-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors">
            <FiShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-16"> {/* Add padding top to account for fixed navbar */}
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20 z-10" />
            <div className="absolute inset-0">
              <Image
                src={slide.image || "https://via.placeholder.com/1920x1080"}
                alt={slide.title}
                fill
                style={{ objectFit: 'cover' }}
                priority={index === 0}
              />
            </div>
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: index === currentSlide ? 1 : 0, y: index === currentSlide ? 0 : 20 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="max-w-xl"
              >
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{slide.title}</h1>
                <p className="text-xl text-gray-100 mb-8">{slide.description}</p>
                <Link 
                  href={slide.buttonLink} 
                  className={`px-6 py-3 rounded-md bg-gradient-to-r ${slide.color} text-white font-medium shadow-lg hover:shadow-xl transition-shadow`}
                >
                  {slide.buttonText}
                </Link>
              </motion.div>
            </div>
          </div>
        ))}
        
        {/* Slider controls */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
          aria-label="Previous slide"
        >
          <FiChevronLeft className="h-6 w-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
          aria-label="Next slide"
        >
          <FiChevronRight className="h-6 w-6" />
        </button>
        
        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentSlide ? "bg-white w-8" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-gradient-to-b from-indigo-50 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                <FiTruck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Free Shipping</h3>
                <p className="text-sm text-gray-500">On orders over $50</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <FiRefreshCw className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Easy Returns</h3>
                <p className="text-sm text-gray-500">30-day return policy</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <MdLocalOffer className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Special Discounts</h3>
                <p className="text-sm text-gray-500">Save up to 50% off</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
                <FiHeadphones className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">24/7 Support</h3>
                <p className="text-sm text-gray-500">Customer help center</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
            <p className="mt-2 text-lg text-gray-600">Explore our wide range of products across popular categories</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link 
                href={category.link} 
                key={index}
                className="group relative rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="w-full h-40 relative">
                  <Image 
                    src={category.image || `https://via.placeholder.com/300x300?text=${category.name}`} 
                    alt={category.name} 
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
                </div>
                <div className="absolute bottom-0 w-full p-4">
                  <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
              <p className="mt-2 text-lg text-gray-600">The latest additions to our marketplace</p>
            </div>
            <Link href="/products" className="text-indigo-600 hover:text-indigo-800 flex items-center">
              View All <FiChevronRight className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-12 bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="hidden lg:block absolute -right-40 -top-40 w-96 h-96 bg-white/10 rounded-full"></div>
        <div className="hidden lg:block absolute -left-20 -bottom-20 w-72 h-72 bg-white/10 rounded-full"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:flex items-center justify-between">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Summer Sale Is On!</h2>
              <p className="text-xl text-indigo-100 mb-6">
                Up to 50% off on summer essentials. Limited time offer.
              </p>
              <Link 
                href="/sale" 
                className="inline-block px-6 py-3 bg-white text-indigo-600 font-medium rounded-md shadow-lg hover:bg-gray-100 transition-colors"
              >
                Shop The Sale
              </Link>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="w-72 h-72 lg:w-96 lg:h-96 relative">
                <Image 
                  src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=768&h=768&fit=crop" 
                  alt="Summer Sale" 
                  fill
                  style={{ objectFit: 'contain' }}
                  className="drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Popular Products</h2>
              <p className="mt-2 text-lg text-gray-600">Top-rated items loved by our customers</p>
            </div>
            <Link href="/products" className="text-indigo-600 hover:text-indigo-800 flex items-center">
              View All <FiChevronRight className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(4, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Sellers/Brands */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Featured Sellers</h2>
            <p className="mt-2 text-lg text-gray-600">Discover quality products from our trusted partners</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {featuredSellers.map((seller, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="h-24 w-24 mx-auto mb-4 relative rounded-full overflow-hidden bg-gray-100">
                  <Image 
                    src={seller.logo || `https://via.placeholder.com/150x150?text=${seller.name.charAt(0)}`}
                    alt={seller.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{seller.name}</h3>
                <p className="text-sm text-gray-500">{seller.products} products</p>
                <Link 
                  href={`/seller/${seller.name.toLowerCase().replace(' ', '-')}`}
                  className="mt-3 inline-block text-sm text-indigo-600 hover:text-indigo-800"
                >
                  View Store
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
            <p className="mt-2 text-lg text-gray-600">Trusted by thousands of satisfied shoppers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 p-6 rounded-lg relative">
                <div className="absolute -top-5 left-6 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                  </svg>
                </div>
                <div className="pt-6">
                  <p className="text-gray-700 mb-6">{testimonial.text}</p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                      <Image 
                        src={testimonial.image || `https://via.placeholder.com/100x100?text=${testimonial.name.charAt(0)}`}
                        alt={testimonial.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller/Reseller CTA */}
      <section className="py-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Join Our Marketplace</h2>
              <p className="text-gray-300 text-lg mb-8">
                Whether you're a small business owner, artisan, or reseller, MULTI-STORE offers you a platform to reach customers worldwide. Expand your business with our growing marketplace.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/seller-login" 
                  className="px-6 py-3 bg-white text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  <MdStorefront className="mr-2" /> Become a Seller
                </Link>
                <Link 
                  href="/reseller-login" 
                  className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors flex items-center justify-center"
                >
                  <FiPackage className="mr-2" /> Join as Reseller
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <div className="text-3xl font-bold mb-2">10K+</div>
                <p className="text-gray-300">Active Sellers</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <div className="text-3xl font-bold mb-2">1M+</div>
                <p className="text-gray-300">Products</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <div className="text-3xl font-bold mb-2">5M+</div>
                <p className="text-gray-300">Customers</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <div className="text-3xl font-bold mb-2">50+</div>
                <p className="text-gray-300">Countries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="py-12 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop On The Go</h2>
              <p className="text-lg text-gray-600 mb-6">
                Download our mobile app for a seamless shopping experience. Get exclusive app-only deals and notifications.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="#" className="inline-block bg-black px-4 py-2 rounded-lg text-white font-medium hover:bg-gray-800">
                  <div className="flex items-center">
                    <div className="mr-2">
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.18 14.7 3.15 5.3 9.34 5.05c1.56.06 2.66.95 3.5.95.85 0 2.37-1.16 4.13-.95 1.55.14 2.88.8 3.66 2.24-3.3 2.13-2.77 6.18.58 7.68-.52 1.68-1.3 3.35-2.16 4.28v.03z" />
                        <path d="M12.03 4.95c-.26-1.73.55-3.22 1.7-4.1 1.2 1.1 1.83 2.84 1.5 4.12-1.24.08-2.77-.8-3.2-.02z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs">Download on the</div>
                      <div className="text-base font-semibold">App Store</div>
                    </div>
                  </div>
                </Link>
                <Link href="#" className="inline-block bg-black px-4 py-2 rounded-lg text-white font-medium hover:bg-gray-800">
                  <div className="flex items-center">
                    <div className="mr-2">
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 5.26l2.3-1.336-2.658-1.54-2.621 2.633 2.979.243zm.004 9.856l2.978-.242-2.621-2.633-2.656 1.54 2.299 1.335zm-3.827-3.537l-2.687-8.118-2.694 4.665 5.38 3.453zm0 2.313l-5.38 3.453 2.694 4.665 2.686-8.118z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs">GET IT ON</div>
                      <div className="text-base font-semibold">Google Play</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <div className="w-64 h-auto relative">
                <Image
                  src="https://images.unsplash.com/photo-1565538420870-da08ff96a207?q=80&w=256&h=512&fit=crop"
                  alt="Multi-Store Mobile App"
                  width={256}
                  height={512}
                  className="drop-shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Stay Updated</h2>
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter for the latest products, trends, and exclusive offers.
          </p>
          <form className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <button
                type="submit"
                className="px-4 py-3 bg-indigo-600 text-white font-medium rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
