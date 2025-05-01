import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SellerNavbar from "../components/SellerNavbar";
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { getFromIndexedDB } from '../utils/IndexedDBUtils';
import {
  Zap, CheckCircle, Shield, BarChart2, Video, Camera, ArrowRight,
  Home, MessageSquare, Clock, Star, TrendingUp, DollarSign, MapPin, 
  Ruler, Bed, ChevronRight, Award, Rocket, Eye, Users, Percent, Plus,
  Building, Home as HomeIcon, Hotel, Layers, Heart, Check, X
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { count } from "../services/BuyerApi";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const getHeaders = async () => {
  const tabId = await getFromIndexedDB('TAB-ID');
  return tabId ? { 'TAB-ID': tabId } : {};
};

const propertyTypes = [
  { value: "apartment", label: "Apartment", icon: <Building className="w-4 h-4" /> },
  { value: "house", label: "House", icon: <HomeIcon className="w-4 h-4" /> },
  { value: "condo", label: "Condo", icon: <Layers className="w-4 h-4" /> },
  { value: "townhouse", label: "Townhouse", icon: <Hotel className="w-4 h-4" /> }
];

const propertyConditions = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "needs_work", label: "Needs Work" }
];

const SellerDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { firstName = "Seller", userType = "SELLER" } = location.state || {};
  const [darkMode, setDarkMode] = useState(false);
  const [stats, setStats] = useState([]);
  const [suggestedPrice, setSuggestedPrice] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    isSubscribed: false,
    status: null,
    currentPeriodEnd: null,
    loading: true,
    error: null
  });
  const [performanceData, setPerformanceData] = useState(null);

  useEffect(() => {
    AOS.init({ 
      duration: 800,
      easing: 'ease-in-out-quad',
      once: true,
      offset: 10
    });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const totalListings = await count(); 
        setStats([
          { title: "Total Listings", value: totalListings, icon: <Home className="w-5 h-5" />, color: "bg-indigo-600" },
          { title: "Properties Sold", value: 2, icon: <Award className="w-5 h-5" />, color: "bg-emerald-600" },
          { title: "Pending Requests", value: 0, icon: <Clock className="w-5 h-5" />, color: "bg-amber-500" },
          { title: "Messages", value: 2, icon: <MessageSquare className="w-5 h-5" />, color: "bg-rose-500" },
        ]);
      } catch (error) {
        console.error("Error fetching stats:", error.message);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const res = await axios.get("/api/seller-properties/status", { headers: await getHeaders(), withCredentials: true });
        setSubscriptionStatus(res.data);
      } catch (error) {
        console.error("Subscription check error:", error);
      }
    };
    checkSubscription();
  }, []);

  useEffect(() => {
    // Mock performance data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const viewsData = [450, 780, 1020, 1250, 1540, 1890];
    const leadsData = [8, 12, 15, 18, 22, 28];
    
    setPerformanceData({
      labels: months,
      views: viewsData,
      leads: leadsData,
      conversion: ['8.2%', '10.5%', '11.8%', '12.1%', '12.5%', '13.2%']
    });
  }, []);

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

  const handleAIPricing = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const location = formData.get('location');
    const size = Number(formData.get('size'));
    const bedrooms = Number(formData.get('bedrooms'));
    const propertyType = formData.get('propertyType');
    const condition = formData.get('condition');

    // Base pricing algorithm with enhancements
    const basePrice = 150000;
    
    // Location multipliers
    const locationMultiplier = 
      location.toLowerCase().includes("new york") ? 1.5 : 
      location.toLowerCase().includes("san francisco") ? 1.4 : 
      location.toLowerCase().includes("los angeles") ? 1.3 : 1.2;
    
    // Property type multipliers
    const typeMultiplier = {
      apartment: 1.0,
      house: 1.15,
      condo: 1.05,
      townhouse: 1.08
    }[propertyType] || 1.0;
    
    // Condition multipliers
    const conditionMultiplier = {
      excellent: 1.1,
      good: 1.0,
      fair: 0.9,
      needs_work: 0.8
    }[condition] || 1.0;

    // Calculate price with all factors
    const price = (basePrice + (size * 120) + (bedrooms * 25000)) * 
                 locationMultiplier * typeMultiplier * conditionMultiplier;

    setSuggestedPrice({
      price: `$${Math.round(price).toLocaleString()}`,
      range: `$${Math.round(price * 0.95).toLocaleString()} - $${Math.round(price * 1.05).toLocaleString()}`,
      location,
      size,
      bedrooms,
      propertyType: propertyTypes.find(t => t.value === propertyType)?.label || propertyType,
      condition: propertyConditions.find(c => c.value === condition)?.label || condition,
      factors: [
        { name: "Location", value: location, impact: locationMultiplier.toFixed(2) + "x" },
        { name: "Property Type", value: propertyType, impact: typeMultiplier.toFixed(2) + "x" },
        { name: "Condition", value: condition, impact: conditionMultiplier.toFixed(2) + "x" }
      ]
    });
    toast.success("AI pricing suggestion generated successfully!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <SellerNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto w-full">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white" data-aos="fade-right">
              Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{firstName}</span> 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1" data-aos="fade-right" data-aos-delay="100">
              Here's your personalized dashboard overview
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500 dark:text-gray-400 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700" data-aos="fade-left">
              Last updated: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
            <button 
              onClick={() => navigate('/add-property')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
              data-aos="fade-left"
              data-aos-delay="100"
            >
              <Plus className="w-4 h-4" />
              Add Property
            </button>
          </div>
        </div>

        {/* Subscription Status */}
        {subscriptionStatus.status === 'active' ? (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-emerald-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow" data-aos="fade-down">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-shrink-0 p-3 bg-green-100 dark:bg-emerald-800/50 rounded-lg w-12 h-12 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-green-800 dark:text-emerald-200">
                      Premium Membership Active
                    </h3>
                    <p className="mt-1 text-sm text-green-600 dark:text-emerald-400">
                      Renews on <span className="font-medium">{new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-emerald-900 text-green-800 dark:text-emerald-200 mt-2 md:mt-0">
                    Active
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <FeatureBadge icon={<Video className="mr-1 h-3 w-3" />} label="HD Video Uploads" />
                  <FeatureBadge icon={<BarChart2 className="mr-1 h-3 w-3" />} label="Advanced Analytics" />
                  <FeatureBadge icon={<Zap className="mr-1 h-3 w-3" />} label="Boosted Visibility" />
                  <FeatureBadge icon={<Rocket className="mr-1 h-3 w-3" />} label="Priority Placement" />
                </div>
                <div className="mt-6 pt-6 border-t border-green-200 dark:border-emerald-800 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-green-700 dark:text-emerald-300 mb-3 flex items-center">
                      <Video className="mr-2 h-4 w-4 flex-shrink-0" />
                      Upload high-quality property videos
                    </h4>
                    <input
                      type="file"
                      accept="video/mp4,video/quicktime"
                      className="block w-full text-sm text-green-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-100 file:text-green-700 hover:file:bg-green-200 dark:file:bg-emerald-900/50 dark:file:text-emerald-300 dark:hover:file:bg-emerald-800/70 transition-colors"
                    />
                    <p className="mt-2 text-xs text-green-500 dark:text-emerald-400">
                      Max file size: 500MB • Supported formats: MP4, MOV
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-green-700 dark:text-emerald-300 mb-3 flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4 flex-shrink-0" />
                      Performance boost
                    </h4>
                    <div className="bg-green-50 dark:bg-emerald-900/20 rounded-lg p-3">
                      <div className="flex items-center justify-between text-xs text-green-700 dark:text-emerald-300">
                        <span>Current ranking</span>
                        <span className="font-bold">Top 5%</span>
                      </div>
                      <div className="mt-2 w-full bg-green-100 dark:bg-emerald-800 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 dark:bg-emerald-500 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow" data-aos="fade-down">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 p-3 bg-white/20 rounded-lg w-12 h-12 flex items-center justify-center">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-white">Unlock Premium Features</h3>
                  <p className="mt-1 text-indigo-100/90">Get full access to our exclusive tools and benefits</p>
                  <ul className="mt-4 space-y-3 text-indigo-100/90 text-sm">
                    <FeatureItem icon={<Video className="mr-2 h-4 w-4" />} label="HD Video Uploads (4K supported)" />
                    <FeatureItem icon={<BarChart2 className="mr-2 h-4 w-4" />} label="Detailed performance insights" />
                    <FeatureItem icon={<Shield className="mr-2 h-4 w-4" />} label="Verified seller badge" />
                    <FeatureItem icon={<Camera className="mr-2 h-4 w-4" />} label="Virtual tour creation" />
                    <FeatureItem icon={<TrendingUp className="mr-2 h-4 w-4" />} label="Priority placement in search results" />
                  </ul>
                </div>
              </div>
              <button
                onClick={handleSubscribe}
                className="whitespace-nowrap px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-150 hover:shadow-md flex items-center justify-center gap-2"
              >
                Upgrade Now <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, idx) => (
            <StatCard 
              key={idx}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              delay={idx * 100}
            />
          ))}
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Performance Overview</h3>
              <select className="text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Last 6 Months</option>
                <option>Last Year</option>
                <option>Last 3 Months</option>
              </select>
            </div>
            {performanceData && (
              <div className="h-64">
                <Line
                  data={{
                    labels: performanceData.labels,
                    datasets: [
                      {
                        label: 'Views',
                        data: performanceData.views,
                        borderColor: '#6366F1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        tension: 0.3,
                        fill: true,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#6366F1',
                        pointBorderWidth: 2
                      },
                      {
                        label: 'Leads',
                        data: performanceData.leads,
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.3,
                        fill: true,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#10B981',
                        pointBorderWidth: 2
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          color: darkMode ? '#E5E7EB' : '#4B5563',
                          usePointStyle: true,
                          padding: 20
                        }
                      },
                      tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                        titleColor: darkMode ? '#E5E7EB' : '#111827',
                        bodyColor: darkMode ? '#E5E7EB' : '#111827',
                        borderColor: darkMode ? '#374151' : '#E5E7EB',
                        borderWidth: 1
                      }
                    },
                    scales: {
                      x: {
                        grid: {
                          color: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                          color: darkMode ? '#9CA3AF' : '#6B7280'
                        }
                      },
                      y: {
                        grid: {
                          color: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                          color: darkMode ? '#9CA3AF' : '#6B7280'
                        }
                      }
                    }
                  }}
                />
              </div>
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Top Performing Listings</h3>
            <div className="space-y-5">
              <TopListing 
                title="SilverBrick Square, Boston"
                views={1}
                leads={0}
                conversion="0%"
                status="Active"
              />
              <TopListing 
                title="Victoria Towers, San Jose"
                views={2}
                leads={0}
                conversion="0%"
                status="Pending"
              />
              <TopListing 
                title="The Reserved, New York"
                views={1}
                leads={0}
                conversion="0%"
                status="Active"
              />
            </div>
            <button className="mt-6 w-full text-center text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center justify-center gap-1"
            onClick={() => navigate("/myProperties")}
            >
              View all listings <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Recent Activity & AI Pricing */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Activity</h3>
              <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                View all
              </button>
            </div>
            <div className="space-y-4">
              <ActivityItem 
                icon={<Home className="text-indigo-500" />}
                title="New listing added"
                description="Modern apartment in downtown"
                time="2 hours ago"
                highlight
              />
              <ActivityItem 
                icon={<MessageSquare className="text-emerald-500" />}
                title="New message"
                description="From potential buyer for Luxury Villa"
                time="5 hours ago"
              />
              <ActivityItem 
                icon={<Star className="text-amber-500" />}
                title="Listing favorited"
                description="Your Beachfront property got 5 new favorites"
                time="1 day ago"
              />
              <ActivityItem 
                icon={<CheckCircle className="text-green-500" />}
                title="Property sold"
                description="Suburban family home closed at $450,000"
                time="3 days ago"
              />
            </div>
          </div>
          
          <AIPricingForm 
            handleAIPricing={handleAIPricing} 
            suggestedPrice={suggestedPrice} 
            delay={300}
          />
        </div>

        {/* Promo Section */}
        <PromoSection delay={400} navigate={navigate} />
      </main>
    </div>
  );
};

const FeatureBadge = ({ icon, label }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100/80 dark:bg-emerald-900/50 text-green-800 dark:text-emerald-200">
    {icon} {label}
  </span>
);

const FeatureItem = ({ icon, label }) => (
  <li className="flex items-center">
    {icon} 
    <span className="ml-2">{label}</span>
  </li>
);

const StatCard = ({ title, value, icon, color, delay = 0 }) => (
  <div
    className={`relative rounded-xl p-5 shadow-sm text-white ${color} transition-all duration-300 hover:shadow-md overflow-hidden group hover:scale-[1.02] hover:brightness-110 transform-gpu`}
    data-aos="zoom-in"
    data-aos-delay={delay}
  >
    <div className="absolute top-0 right-0 w-16 h-16 opacity-20 group-hover:opacity-90 transition-opacity">
      {React.cloneElement(icon, { className: "w-full h-full" })}
    </div>
    <div className="relative z-10">
      <div className="text-sm font-medium opacity-90 group-hover:opacity-100 transition-opacity">{title}</div>
      <div className="text-2xl font-bold mt-2 group-hover:text-white/95">{value}</div>
      <div className="mt-4 h-1 w-full bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-white/50 rounded-full transition-all duration-500 group-hover:bg-white/70 group-hover:w-[105%] -ml-[2.5%]" style={{ width: `${Math.min(value * 10, 100)}%` }}></div>
      </div>
    </div>
  </div>
);

const TopListing = ({ title, views, leads, conversion, status }) => (
  <div className="group">
    <div className="flex items-start justify-between">
      <div>
        <h4 className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </h4>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Eye className="w-3 h-3 mr-1" /> {views.toLocaleString()}
          </div>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Users className="w-3 h-3 mr-1" /> {leads}
          </div>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Percent className="w-3 h-3 mr-1" /> {conversion}
          </div>
        </div>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full ${
        status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300' : 
        'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
      }`}>
        {status}
      </span>
    </div>
  </div>
);

const ActivityItem = ({ icon, title, description, time, highlight = false }) => (
  <div className={`flex items-start pb-4 ${highlight ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
    <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
      {icon}
    </div>
    <div className="ml-4 flex-1">
      <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">{title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{time}</p>
    </div>
  </div>
);

const AIPricingForm = ({ handleAIPricing, suggestedPrice, delay = 0 }) => (
  <div 
    className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-md"
    data-aos="fade-up"
    data-aos-delay={delay}
  >
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
          <DollarSign className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          AI Pricing Suggestion
        </h3>
      </div>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Get an instant pricing suggestion based on market trends, location, and property features.
      </p>
      
      <form onSubmit={handleAIPricing} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                id="location"
                name="location" 
                placeholder="e.g. San Francisco" 
                className="pl-10 w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-500 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                required 
              />
            </div>
          </div>
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Size (sq ft)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Ruler className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                id="size"
                name="size" 
                type="number" 
                placeholder="e.g. 1500" 
                className="pl-10 w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-500 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                required 
              />
            </div>
          </div>
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bedrooms
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Bed className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                id="bedrooms"
                name="bedrooms" 
                type="number" 
                placeholder="e.g. 3" 
                className="pl-10 w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-500 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                required 
              />
            </div>
          </div>
          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Property Type
            </label>
            <select
              id="propertyType"
              name="propertyType" 
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-500 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              required
            >
              <option value="">Select type</option>
              {propertyTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Property Condition
            </label>
            <select
              id="condition"
              name="condition" 
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-500 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              required
            >
              <option value="">Select condition</option>
              {propertyConditions.map((condition) => (
                <option key={condition.value} value={condition.value}>
                  {condition.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button 
          type="submit" 
          className="w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 flex items-center justify-center gap-2 hover:shadow-md"
        >
          Get Suggested Price
        </button>
      </form>
      
      {suggestedPrice && (
        <div className="mt-8 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg" data-aos="fade-in">
          <div className="flex items-start">
            <div className="flex-shrink-0 p-2 bg-indigo-100 dark:bg-indigo-800/50 rounded-lg">
              <DollarSign className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200">
                AI-Powered Pricing Suggestion
              </h4>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300">Optimal Listing Price</p>
                  <p className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-300">
                    {suggestedPrice.price}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300">Market Range</p>
                  <p className="mt-1 text-lg font-medium text-indigo-600 dark:text-indigo-300">
                    {suggestedPrice.range}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t                   border-indigo-200 dark:border-indigo-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-indigo-700 dark:text-indigo-400">Location</p>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">{suggestedPrice.location}</p>
                </div>
                <div>
                  <p className="text-indigo-700 dark:text-indigo-400">Size</p>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">{suggestedPrice.size} sq ft</p>
                </div>
                <div>
                  <p className="text-indigo-700 dark:text-indigo-400">Bedrooms</p>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">{suggestedPrice.bedrooms}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {suggestedPrice.factors.map((factor, index) => (
                  <div key={index} className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                    <p className="text-xs text-indigo-600 dark:text-indigo-300 font-medium">{factor.name}</p>
                    <p className="text-gray-800 dark:text-gray-200 mt-1">{factor.value}</p>
                    <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-1">Impact: {factor.impact}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-indigo-500 dark:text-indigo-400">
                Based on current market conditions, comparable properties, and historical data
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

const PromoSection = ({ delay = 0, navigate }) => (
  <div 
    className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-xl shadow-lg overflow-hidden"
    data-aos="fade-up"
    data-aos-delay={delay}
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-20 -mb-20"></div>
    
    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
      <div className="max-w-xl">
        <h3 className="text-xl font-bold mb-3">Boost Your Listings</h3>
        <p className="text-indigo-100">
          Upgrade to Pro and get your properties featured at the top of search results, 
          reaching 3x more potential buyers with premium placement and marketing tools.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="flex items-center text-xs bg-white/10 px-3 py-1 rounded-full">
            <TrendingUp className="w-3 h-3 mr-1" /> 3x more views
          </div>
          <div className="flex items-center text-xs bg-white/10 px-3 py-1 rounded-full">
            <BarChart2 className="w-3 h-3 mr-1" /> Advanced analytics
          </div>
          <div className="flex items-center text-xs bg-white/10 px-3 py-1 rounded-full">
            <Video className="w-3 h-3 mr-1" /> HD video uploads
          </div>
        </div>
      </div>
      <button
        className="mt-6 md:mt-0 bg-white text-indigo-600 font-medium py-2.5 px-6 rounded-lg shadow hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
        onClick={() => navigate("/learnmore")}
      >
        Learn More
      </button>
    </div>
  </div>
);

export default SellerDashboardPage;