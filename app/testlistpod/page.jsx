"use client"
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";
import Testprodcard from "@/components/Testprodcard";
import Form from "@/components/Form";
import Package from "@/components/Package";

const Page = () => {

    const { id } = useParams();

    const { products, router, addToCart } = useAppContext()

    const [mainImage, setMainImage] = useState(null);
    const [productData, setProductData] = useState(null);
    const [price, setPrice] = useState(33)

    const fetchProductData = async () => {
        const product = products.find(product => product._id === id);
        setProductData(product);
    }

    useEffect(() => {
        fetchProductData();
    }, [id, products.length])

    return (<>
        <Navbar />
        <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="px-5 lg:px-16 xl:px-20">
                    <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
                        <Image
                            src="/freefireimage.jpeg"
                            alt="alt"
                            className="w-full h-auto object-cover mix-blend-multiply"
                            width={1280}
                            height={720}
                        />
                    </div>


                </div>

                <div className="flex flex-col">
                    <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
                        Free Fire (Nepal)
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                            <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                            <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                            <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                            <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                            <Image
                                className="h-4 w-4"
                                src={assets.star_dull_icon}
                                alt="star_dull_icon"
                            />
                        </div>
                        <p>(4.5)</p>
                    </div>
                    <p className="text-gray-600 mt-3">
                        Top Up Free Fire Diamonds Instantly in Nepal – Fast, Easy & Secure

                        Need to top up Free Fire diamonds in Nepal quickly? Follow these simple steps to get your diamonds instantly! Just enter your Free Fire Player ID, choose the diamond amount, complete the payment, and your diamonds will be added to your Free Fire account immediately. Enjoy hassle-free payments through popular Nepali methods like Khalti, eSewa, IMEPay, MyPay, and others.

                        All prices are listed in NPR/NRS (Nepalese Rupee), making the process smooth and convenient for players in Nepal. Whether you're upgrading your character, purchasing in-game items, or enhancing your Free Fire experience, our fast top-up service has you covered.

                        Start topping up today with the best diamond top-up service in Nepal and power up your Free Fire gameplay instantly!

                        Note: Ensure that the details are correct, no refunds would be given if the details are wrong
                    </p>
                    <p className="text-3xl font-medium mt-6">
                        $600
                        <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                            $500
                        </span>
                    </p>
                    <hr className="bg-gray-600 my-6" />


                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center mb-4 ">
                    <p className="text-3xl font-medium">Featured <span className="font-medium text-orange-600">Products</span></p>
                    <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
                </div>
                <div>
                    This is section for the package selector
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        <div onClick={() => setPrice(49)} className="bg-orange-400 w-44 h-16 flex flex-col justify-center rounded-lg hover:ring-2 ">
                            <div className="flex justify-between px-2" >
                                <h1>25 Diamonds</h1> <img src="/uc.png" className="w-5 h-5"></img>
                            </div>
                            <h1 className="px-2">Rs 49</h1>
                        </div>
                        <div onClick={() => setPrice(95)} className="bg-orange-400 w-44 h-16 flex flex-col justify-center rounded-lg hover:ring-2 ">
                            <div className="flex justify-between px-2" >
                                <h1>50 Diamonds</h1> <img src="/uc.png" className="w-5 h-5"></img>
                            </div>
                            <h1 className="px-2">Rs 95</h1>
                        </div>
                        <div onClick={() => setPrice(139)} className="bg-orange-400 w-44 h-16 flex flex-col justify-center rounded-lg hover:ring-2 ">
                            <div className="flex justify-between px-2" >
                                <h1>115 Diamonds</h1> <img src="/uc.png" className="w-5 h-5"></img>
                            </div>
                            <h1 className="px-2">Rs 139</h1>
                        </div>
                        <div onClick={() => setPrice(289)} className="bg-orange-400 w-44 h-16 flex flex-col justify-center rounded-lg hover:ring-2 ">
                            <div className="flex justify-between px-2" >
                                <h1>240 Diamonds</h1> <img src="/uc.png" className="w-5 h-5"></img>
                            </div>
                            <h1 className="px-2">Rs 289</h1>
                        </div>
                        <div onClick={() => setPrice(699)} className="bg-orange-400 w-44 h-16 flex flex-col justify-center rounded-lg hover:ring-2 ">
                            <div className="flex justify-between px-2" >
                                <h1>610 Diamonds</h1> <img src="/uc.png" className="w-5 h-5"></img>
                            </div>
                            <h1 className="px-2">Rs 699</h1>
                        </div>
                        <div onClick={() => setPrice(1399)} className="bg-orange-400 w-44 h-16 flex flex-col justify-center rounded-lg hover:ring-2 ">
                            <div className="flex justify-between px-2" >
                                <h1>1240 Diamonds</h1> <img src="/uc.png" className="w-5 h-5"></img>
                            </div>
                            <h1 className="px-2">Rs 1399</h1>
                        </div>
                        <div onClick={() => setPrice(289)} className="bg-orange-400 w-44 h-16 flex flex-col justify-center rounded-lg hover:ring-2 ">
                            <div className="flex justify-between px-2" >
                                <h1>Weekly Membership</h1> <img src="/uc.png" className="w-5 h-5"></img>
                            </div>
                            <h1 className="px-2">Rs 289</h1>
                        </div>
                        <div onClick={() => setPrice(1349)} className="bg-orange-400 w-44 h-16 flex flex-col justify-center rounded-lg hover:ring-2 ">
                            <div className="flex justify-between px-2" >
                                <h1>Monthly Membership</h1> <img src="/uc.png" className="w-5 h-5"></img>
                            </div>
                            <h1 className="px-2">Rs 1349</h1>
                        </div>
                        <div onClick={() => setPrice(95)} className="bg-orange-400 w-44 h-16 flex flex-col justify-center rounded-lg hover:ring-2 ">
                            <div className="flex justify-between px-2" >
                                <h1>Weekly Lite</h1> <img src="/uc.png" className="w-5 h-5"></img>
                            </div>
                            <h1 className="px-2">Rs 95</h1>
                        </div>

                    </div>
                    
                    <Form price={price}/>
                </div>
            </div>
        </div>
        <Footer />
    </>
    )
};

export default Page;