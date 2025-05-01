import React from 'react';
import { ArrowRightIcon, CheckCircleIcon, BoltIcon, ChartBarIcon, ShieldCheckIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import SellerDashboardPage from './SellerDashboardPage';
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-hot-toast";


const Premium = () => {
  const features = [
    {
      name: 'Priority Placement',
      description: 'Get featured at the top of search results for maximum visibility',
      icon: BoltIcon,
    },
    {
      name: 'Advanced Analytics',
      description: 'Detailed insights into views, saves, and lead generation',
      icon: ChartBarIcon,
    },
    {
      name: 'Verified Badge',
      description: 'Stand out with an official verified seller badge',
      icon: ShieldCheckIcon,
    },
    {
      name: 'HD Media Uploads',
      description: 'Upload high-quality photos and 4K virtual tours',
      icon: VideoCameraIcon,
    },
  ];

  const handleSubscribe = async () => {
    try {
      const res = await axios.post("/api/seller-properties/subscribe", {}, { headers: await getHeaders(), withCredentials: true });
      const { sessionId } = res.data;
      const stripe = await loadStripe('pk_test_51RGWWVH8x6jydMcNKPVnthcQp05VvTNo3CdSP5NEZqrMpL6eiGWhpKOqaMmZloJsrHgSpdg8aWnragQfdJ5ZvKjH00JnLGu6V4');
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Stripe error:", error);
      toast.error("Failed to initiate subscription. Please try again.");
    }
  };

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="max-w-md mx-auto sm:max-w-lg lg:mx-0">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Boost Your Listings
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              Upgrade to Pro and get your properties featured at the top of search results, reaching 3x more potential buyers.
            </p>
            <div className="mt-8">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                  <CheckCircleIcon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Pro Benefits</h4>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    All premium features included in one simple monthly plan.
                  </p>
                </div>
              </div>
              <ul className="mt-8 space-y-5">
                {features.map((feature) => (
                  <li key={feature.name} className="flex items-start">
                    <div className="flex-shrink-0">
                      <feature.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-gray-900 dark:text-white">{feature.name}</p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12 sm:mt-16 lg:mt-0">
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg sm:max-w-md sm:w-full sm:mx-auto lg:ml-0 lg:mr-0 lg:flex-shrink-0 lg:max-w-none">
              <div className="p-8 lg:p-10">
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
                    Premium Membership
                  </p>
                  <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
                    Only <span className="font-medium text-indigo-600 dark:text-indigo-400">$10/month</span>
                  </p>
                </div>
                <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wide">
                    What's included
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                      </div>
                      <p className="ml-3 text-base text-gray-700 dark:text-gray-300">Priority placement in search results</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                      </div>
                      <p className="ml-3 text-base text-gray-700 dark:text-gray-300">Detailed performance analytics</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                      </div>
                      <p className="ml-3 text-base text-gray-700 dark:text-gray-300">Verified seller badge</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                      </div>
                      <p className="ml-3 text-base text-gray-700 dark:text-gray-300">HD photo and video uploads</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                      </div>
                      <p className="ml-3 text-base text-gray-700 dark:text-gray-300">24/7 premium support</p>
                    </li>
                  </ul>
                </div>
                <div className="mt-8">
                  <div className="rounded-md shadow">
                    <button
                      className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                      onClick={handleSubscribe}
                    >
                      Upgrade Now
                    </button>
                  </div>
                  <div className="mt-3 text-center">
                    <a href="#" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                      Learn more about Pro
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;