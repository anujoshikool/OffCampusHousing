import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPropertyDetails, sendEmailToSeller } from '../services/BuyerApi';

const IndiBuyerPropertyDetails = () => {
    const { propertyId } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [interestMessage, setInterestMessage] = useState(null); 
    const [appointmentDateTime, setAppointmentDateTime] = useState('');
    const [showAppointmentForm, setShowAppointmentForm] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

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
                const data = await getPropertyDetails(propertyId);
                setProperty(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPropertyDetails();
    }, [propertyId]);

    const handleRequestTour = async () => {
        if (!showAppointmentForm) {
            setShowAppointmentForm(true);
            return;
        }

        if (!appointmentDateTime) {
            setInterestMessage({ type: 'error', text: 'Please select date and time for appointment' });
            return;
        }

        setIsSubmitting(true);
        try {
            const selectedDate = new Date(appointmentDateTime);
            const formattedDate = selectedDate.toISOString().split('T')[0]; 
            const formattedTime = selectedDate.toISOString().split('T')[1].split('.')[0];  

            const appointmentRequest = {
                date: formattedDate,
                time: formattedTime
            };

            console.log('Sending to backend:', appointmentRequest); 

            const response = await sendEmailToSeller(propertyId, appointmentRequest);
            setInterestMessage({ type: 'success', text: response.message || 'Appointment request sent successfully!' });
            setShowAppointmentForm(false);
        } catch (error) {
            setInterestMessage({ type: 'error', text: error.response?.data?.message || 'Failed to send request. Please try again later.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChatWithAgent = () => {
        setInterestMessage({ type: 'success', text: 'Connecting you with an agent...' });
    };

    const handlePayment = () => {
        setIsPaymentModalOpen(true);
    };

    const handleClosePaymentModal = () => {
        setIsPaymentModalOpen(false);
    };

    const handlePaymentSuccess = () => {
        setInterestMessage({ type: 'success', text: 'Payment successful! Thank you for your purchase.' });
        setIsPaymentModalOpen(false);
    };

    if (loading) return <div className="w-full h-60 bg-gray-300 animate-pulse"></div>; 
    if (error) return <div className="text-red-600">{error}</div>; 

    const displayValue = (value) => {
        return value ? value : null;
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-4xl font-semibold text-gray-900 mb-6 text-center tracking-normal uppercase hover:text-indigo-600 transition-all duration-300">
                {property.title}
            </h1>
            <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="space-y-6">
                    {displayValue(property.description) && 
                        <p className="bg-indigo-50 p-4 rounded-lg shadow-md text-lg text-gray-700 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                            <strong className="text-indigo-600">Description:</strong> {property.description}
                        </p>
                    }

                    {displayValue(property.listingType) && 
                        <p className="bg-indigo-50 p-4 rounded-lg shadow-md text-lg text-gray-700 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                            <strong className="text-indigo-600">Listing Type:</strong> {property.listingType}
                        </p>
                    }

                    {displayValue(property.priceTotalUnit) && 
                        <p className="bg-indigo-50 p-4 rounded-lg shadow-md text-lg text-gray-700 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                            <strong className="text-indigo-600">Price (Total Unit):</strong> ${property.priceTotalUnit}
                        </p>
                    }

                    {displayValue(property.pricePerIndividual) && 
                        <p className="bg-indigo-50 p-4 rounded-lg shadow-md text-lg text-gray-700 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                            <strong className="text-indigo-600">Price per Individual:</strong> ${property.pricePerIndividual}
                        </p>
                    }

                    {displayValue(property.avgUtilitiesPerPerson) && 
                        <p className="bg-indigo-50 p-4 rounded-lg shadow-md text-lg text-gray-700 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                            <strong className="text-indigo-600">Avg Utilities per Person:</strong> ${property.avgUtilitiesPerPerson}
                        </p>
                    }

                    {displayValue(property.bedrooms) && 
                        <p className="bg-indigo-50 p-4 rounded-lg shadow-md text-lg text-gray-700 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                            <strong className="text-indigo-600">Bedrooms:</strong> {property.bedrooms}
                        </p>
                    }

                    {displayValue(property.bathrooms) && 
                        <p className="bg-indigo-50 p-4 rounded-lg shadow-md text-lg text-gray-700 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                            <strong className="text-indigo-600">Bathrooms:</strong> {property.bathrooms}
                        </p>
                    }

                    {displayValue(property.address) && 
                        <p className="bg-indigo-50 p-4 rounded-lg shadow-md text-lg text-gray-700 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                            <strong className="text-indigo-600">Address:</strong> {property.address}, {property.city}, {property.state}, {property.country}, {property.pincode}
                        </p>
                    }

                    {displayValue(property.accommodationType) && 
                        <p className="bg-indigo-50 p-4 rounded-lg shadow-md text-lg text-gray-700 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                            <strong className="text-indigo-600">Accommodation Type:</strong> {property.accommodationType}
                        </p>
                    }

                    {displayValue(property.preferredGender) && 
                        <p className="bg-indigo-50 p-4 rounded-lg shadow-md text-lg text-gray-700 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                            <strong className="text-indigo-600">Preferred Gender:</strong> {property.preferredGender}
                        </p>
                    }

                    {displayValue(property.nearestUniversity) && 
                        <p className="bg-indigo-50 p-4 rounded-lg shadow-md text-lg text-gray-700 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                            <strong className="text-indigo-600">Nearest University:</strong> {property.nearestUniversity}
                        </p>
                    }

                    {displayValue(property.dietaryPreference) && 
                        <p className="bg-indigo-50 p-4 rounded-lg shadow-md text-lg text-gray-700 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                            <strong className="text-indigo-600">Dietary Preference:</strong> {property.dietaryPreference}
                        </p>
                    }

                    {displayValue(property.status) && 
                        <p className="bg-indigo-50 p-4 rounded-lg shadow-md text-lg text-gray-700 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                            <strong className="text-indigo-600">Status:</strong> {property.status}
                        </p>
                    }

                    {displayValue(property.peoplePresent) && 
                        <p className="bg-indigo-50 p-4 rounded-lg shadow-md text-lg text-gray-700 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                            <strong className="text-indigo-600">People Present:</strong> {property.peoplePresent}
                        </p>
                    }

                    {displayValue(property.peopleRequired) && 
                        <p className="bg-indigo-50 p-4 rounded-lg shadow-md text-lg text-gray-700 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                            <strong className="text-indigo-600">People Required:</strong> {property.peopleRequired}
                        </p>
                    }

                    {displayValue(property.availableFrom) && 
                        <p className="bg-indigo-50 p-4 rounded-lg shadow-md text-lg text-gray-700 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                            <strong className="text-indigo-600">Available From:</strong> {property.availableFrom}
                        </p>
                    }

                    {displayValue(property.endOfLease) && 
                        <p className="bg-indigo-50 p-4 rounded-lg shadow-md text-lg text-gray-700 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                            <strong className="text-indigo-600">End of Lease:</strong> {property.endOfLease}
                        </p>
                    }

                    {property.mediaUrls?.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-3xl font-extrabold text-blue-600 mb-6 border-b-2 border-blue-300 pb-3">Property Images</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {property.mediaUrls.filter(url => url.endsWith('.jpg') ||  url.endsWith('.webp')||  url.endsWith('.jpeg')||url.endsWith('.png')).map((url, index) => (
                                    <div key={index} className="relative">
                                        <img 
                                            src={url} 
                                            alt={`Property ${index + 1}`} 
                                            className="w-full h-48 object-cover rounded-lg shadow-lg cursor-pointer"
                                            onClick={() => openModal(url)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={closeModal}>
                            <div className="relative max-w-3xl w-full p-4 bg-white rounded-lg">
                                <img src={currentImage} alt="Property" className="w-full h-auto rounded-lg" />
                                <button className="absolute top-2 right-2 text-white text-2xl font-bold" onClick={closeModal}>
                                    &times;
                                </button>
                            </div>
                        </div>
                    )}

                    {property.mediaUrls?.some(url => url.endsWith('.mp4') || url.endsWith('.webm')) && (
                        <div className="mt-8">
                            <h2 className="text-2xl font-semibold mb-4">Property Videos</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {property.mediaUrls.filter(url => url.endsWith('.mp4') || url.endsWith('.webm')).map((url, index) => (
                                    <video key={index} controls className="w-full h-60 rounded-lg shadow-lg">
                                        <source src={url} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 space-x-4 text-center">
                <button 
                    onClick={handleRequestTour}
                    disabled={isSubmitting}
                    className={`py-3 px-6 rounded-lg shadow-lg text-white font-bold transition-all duration-300 ${
                        isSubmitting ? "bg-gray-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                >
                    {isSubmitting 
                        ? "Sending..." 
                        : showAppointmentForm 
                        ? "Confirm Appointment Request" 
                        : "Request a Tour"}
                </button>
            </div>

            {/* ✅ UPDATED ONLY THIS SECTION BELOW */}
            {showAppointmentForm && (
                <div className="flex justify-center mt-6">
                    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-xl w-full max-w-lg space-y-4">
                        <h3 className="text-2xl font-semibold text-indigo-700">Select Preferred Date & Time</h3>
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm text-gray-700 font-medium">Date & Time</label>
                            <input
                                type="datetime-local"
                                value={appointmentDateTime}
                                onChange={(e) => setAppointmentDateTime(e.target.value)}
                                min={new Date().toISOString().slice(0, 16)}
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                required
                            />
                            <span className="text-xs text-gray-500">Seller will confirm your appointment request via email.</span>
                        </div>
                    </div>
                </div>
            )}

            {interestMessage && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <p className={`text-lg font-semibold ${interestMessage.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                            {interestMessage.text}
                        </p>
                        <button 
                            onClick={() => setInterestMessage(null)}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IndiBuyerPropertyDetails;
