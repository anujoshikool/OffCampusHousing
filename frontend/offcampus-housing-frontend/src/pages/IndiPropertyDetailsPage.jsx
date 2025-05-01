import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPropertyById } from '../services/SellerApi';

const IndiBuyerPropertyDetails = () => {
    const { propertyId } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
   
    const openModal = (url) => {
        setCurrentImage(url);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentImage(null);
    };

    useEffect(() => {
        const fetchPropertyDetails = async () => {
            try {
                const data = await getPropertyById(propertyId);
                setProperty(data);
                console.log("DATA:", data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPropertyDetails();
    }, [propertyId]);

    const handleModify = () => {
        navigate(`/update-property/${propertyId}`);
    };

    if (loading) return <div className="w-full h-60 bg-gray-200 animate-pulse rounded-lg"></div>; 
    if (error) return <div className="text-red-600 text-center text-lg">{error}</div>; 

    const displayValue = (value) => value ? value : null;

    return (
        <div className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-indigo-50 to-white rounded-lg shadow-lg">
            <h1 className="text-4xl font-semibold text-gray-900 mb-8 text-center tracking-wide uppercase hover:text-indigo-600 transition-all duration-300">
                {property.title}
            </h1>

            <div className="bg-white p-8 rounded-xl shadow-xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {displayValue(property.sellerEmail) && 
                        <p className="bg-indigo-50 p-5 rounded-lg shadow-lg text-lg text-gray-800 transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                            <strong className="text-indigo-600">Email:</strong> {property.sellerEmail}
                        </p>
                    }
                    {displayValue(property.userType) && 
                        <p className="bg-indigo-50 p-5 rounded-lg shadow-lg text-lg text-gray-800 transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                            <strong className="text-indigo-600">Who am I:</strong> Landlord
                        </p>
                    }
                    {displayValue(property.description) && 
                        <p className="bg-indigo-50 p-5 rounded-lg shadow-lg text-lg text-gray-800 transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                            <strong className="text-indigo-600">Description:</strong> {property.description}
                        </p>
                    }
                    {displayValue(property.listingType) && 
                        <p className="bg-indigo-50 p-5 rounded-lg shadow-lg text-lg text-gray-800 transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                            <strong className="text-indigo-600">Listing Type:</strong> {property.listingType}
                        </p>
                    }
                    {displayValue(property.priceTotalUnit) && 
                        <p className="bg-indigo-50 p-5 rounded-lg shadow-lg text-lg text-gray-800 transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                            <strong className="text-indigo-600">Price (Total Unit):</strong> ${property.priceTotalUnit}
                        </p>
                    }
                    {displayValue(property.pricePerIndividual) && 
                        <p className="bg-indigo-50 p-5 rounded-lg shadow-lg text-lg text-gray-800 transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                            <strong className="text-indigo-600">Price per Individual:</strong> ${property.pricePerIndividual}
                        </p>
                    }
                    {displayValue(property.bedrooms) && 
                        <p className="bg-indigo-50 p-5 rounded-lg shadow-lg text-lg text-gray-800 transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                            <strong className="text-indigo-600">Bedrooms:</strong> {property.bedrooms}
                        </p>
                    }
                    {displayValue(property.bathrooms) && 
                        <p className="bg-indigo-50 p-5 rounded-lg shadow-lg text-lg text-gray-800 transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                            <strong className="text-indigo-600">Bathrooms:</strong> {property.bathrooms}
                        </p>
                    }
                    {displayValue(property.address) && 
                        <p className="bg-indigo-50 p-5 rounded-lg shadow-lg text-lg text-gray-800 transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                            <strong className="text-indigo-600">Address:</strong> {property.address}, {property.city}, {property.state}, {property.country}, {property.pincode}
                        </p>
                    }
                </div>

                {/* Image Gallery */}
                {property.imageUrls?.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-3xl font-extrabold text-blue-600 mb-6 border-b-2 border-blue-300 pb-3">Property Images</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {property.imageUrls.filter(url => url.endsWith('.jpg') ||  url.endsWith('.webp')||  url.endsWith('.jpeg')|| url.endsWith('.png')).map((url, index) => (
                                <div key={index} className="relative">
                                    <img 
                                        src={url} 
                                        alt={`Property ${index + 1}`} 
                                        className="w-full h-48 object-cover rounded-lg shadow-lg cursor-pointer transition-all duration-300 hover:opacity-80"
                                        onClick={() => openModal(url)} 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Modal for Image Pop-up */}
                {isModalOpen && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
                        onClick={closeModal}
                    >
                        <div className="relative max-w-3xl w-full p-4 bg-white rounded-lg shadow-xl">
                            <img src={currentImage} alt="Property" className="w-full h-auto rounded-lg" />
                            <button 
                                className="absolute top-2 right-2 text-white text-2xl font-bold" 
                                onClick={closeModal}
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                )}

                {/* Modify Button */}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleModify}
                        className="py-3 px-6 rounded-lg shadow-lg text-white font-bold transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transform"
                    >
                        Update Property
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IndiBuyerPropertyDetails;