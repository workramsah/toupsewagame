'use client'
import React from "react";
import HeaderSlider from "../components/HeaderSlider";
import HomeProducts from "../components/HomeProducts";
import Banner from "../components/Banner";
import NewsLetter from "../components/NewsLetter";
import FeaturedProduct from "../components/FeaturedProduct";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Testprodcard from "@/components/Testprodcard";
import Link from "next/link";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32">
        <HeaderSlider />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
          <Link href="/testlistpod"><Testprodcard name="Free Fire" price="Rs 25-1200" description="This is freefire topup" image="freefireimage.jpeg"/></Link>
          <Link href="/topup/pubg"><Testprodcard name="PUBG" price="Rs 25-1200+" description="This is pubg topup" image="pubgs.avif"/></Link>
          
          <Testprodcard image="Khalti.jpg"/><Testprodcard/><Testprodcard/><Testprodcard/><Testprodcard/><Testprodcard/><Testprodcard/>
        </div>
        <FeaturedProduct />
        <Banner />
        <NewsLetter />
      </div>
      <Footer />
    </>
  );
};

export default Home;
