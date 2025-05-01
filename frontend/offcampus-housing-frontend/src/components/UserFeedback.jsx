// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { postFeedback } from '../services/SellerApi';
// import {
//   ArrowBack as ArrowBackIcon,
//   Send as SendIcon,
//   BugReport as BugIcon,
//   WifiOff as ConnectionIcon,
//   ThumbUp as SuggestionIcon,
//   AccountCircle as AccountIcon,
//   Email as EmailIcon,
//   Description as DescriptionIcon,
//   Error as ErrorIcon,
//   CheckCircle as SuccessIcon,
//   Star as StarIcon,
//   StarBorder as StarBorderIcon
// } from '@mui/icons-material';
// import { styled, alpha } from '@mui/material/styles';
// import { Button, TextField, MenuItem, Alert, Snackbar, Rating, Box, CircularProgress } from '@mui/material';
// import axios from 'axios';

// const GlassCard = styled('div')(({ theme }) => ({
//   backdropFilter: 'blur(16px)',
//   backgroundColor: alpha(theme.palette.background.paper, 0.6),
//   borderRadius: '1rem',
//   boxShadow: theme.shadows[10],
//   padding: theme.spacing(4),
//   transition: '0.4s ease all',
//   '&:hover': {
//     transform: 'translateY(-5px)',
//     boxShadow: theme.shadows[16],
//   },
// }));

// const feedbackTypes = [
//   { value: 'bug', label: 'Bug Report', icon: <BugIcon /> },
//   { value: 'connection', label: 'Connection Issue', icon: <ConnectionIcon /> },
//   { value: 'suggestion', label: 'Feature Suggestion', icon: <SuggestionIcon /> },
//   { value: 'ui', label: 'UI/UX Feedback', icon: <AccountIcon /> },
//   { value: 'performance', label: 'Performance Issue', icon: <ConnectionIcon /> },
//   { value: 'other', label: 'Other Feedback', icon: <DescriptionIcon /> },
// ];

// const UserFeedback = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     rating: 0,
//     feedbackType: '',
//     feedback: ''
//   });
//   const [errors, setErrors] = useState({
//     name: false,
//     email: false,
//     rating: false,
//     feedbackType: false,
//     feedback: false
//   });
//   const [submitStatus, setSubmitStatus] = useState({
//     open: false,
//     success: false,
//     message: ''
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: false
//       }));
//     }
//   };

//   const handleRatingChange = (event, newValue) => {
//     setFormData(prev => ({
//       ...prev,
//       rating: newValue
//     }));
//     if (errors.rating) {
//       setErrors(prev => ({
//         ...prev,
//         rating: false
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {
//       name: !formData.name.trim(),
//       email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
//       rating: formData.rating === 0,
//       feedbackType: !formData.feedbackType,
//       feedback: !formData.feedback.trim()
//     };
//     setErrors(newErrors);
//     return !Object.values(newErrors).some(error => error);
//   };

  

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       setSubmitStatus({
//         open: true,
//         success: false,
//         message: 'Please fill all required fields correctly.'
//       });
//       return;
//     }

//     setIsSubmitting(true);
    
//     // try {
//     //   const feedbackData = {
//     //     name: formData.name,
//     //     email: formData.email,
//     //     rating: formData.rating,
//     //     feedbackType: formData.feedbackType,
//     //     feedback: formData.feedback
//     //   };

//     //   await postFeedback(feedbackData);

//     //   setSubmitStatus({
//     //     open: true,
//     //     success: true,
//     //     message: 'Thank you for your feedback! We appreciate your input.'
//     //   });


//     const handleSubmit = async () => {
//       try {
//         const feedbackData = {
//           name: formData.name,
//           email: formData.email,
//           rating: formData.rating,
//           feedbackType: formData.feedbackType,
//           feedback: formData.feedback,
//         };
    
//         const response = await postFeedback(feedbackData); // Call your API
    
//         setSubmitStatus({
//           open: true,
//           success: true,
//           message: response.message,
//         });
    
//         // Reset form after successful submission
//         setFormData({
//           name: '',
//           email: '',
//           rating: 0,
//           feedbackType: '',
//           feedback: '',
//         });
    
//       } catch (error) {
//         console.error('Error submitting feedback:', error);
//         setSubmitStatus({
//           open: true,
//           success: false,
//           message: error.response?.data?.message || error.message || 'Failed to submit feedback. Please try again later.',
//         });
//       } finally {
//         setIsSubmitting(false);
//       }
//     };
    
//   };
//   const handleCloseSnackbar = () => {
//     setSubmitStatus(prev => ({ ...prev, open: false }));
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-12">
//       <div className="flex items-center mb-8">
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => navigate(-1)}
//           className="flex items-center text-indigo-600 hover:text-indigo-800"
//         >
//           <ArrowBackIcon className="mr-2" />
//           Back
//         </motion.button>
//       </div>

//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="mb-8"
//       >
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">
//           Share Your Feedback
//         </h1>
//         <p className="text-gray-600">We value your input to improve our service</p>
//       </motion.div>

//       <GlassCard>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <TextField
//                 fullWidth
//                 label="Your Name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 error={errors.name}
//                 helperText={errors.name ? 'Name is required' : ''}
//                 InputProps={{
//                   startAdornment: (
//                     <AccountIcon className="text-gray-400 mr-2" />
//                   ),
//                 }}
//                 variant="outlined"
//                 className="bg-white rounded-lg"
//               />
//             </div>
//             <div>
//               <TextField
//                 fullWidth
//                 label="Email Address"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 error={errors.email}
//                 helperText={errors.email ? 'Valid email is required' : ''}
//                 InputProps={{
//                   startAdornment: (
//                     <EmailIcon className="text-gray-400 mr-2" />
//                   ),
//                 }}
//                 variant="outlined"
//                 className="bg-white rounded-lg"
//               />
//             </div>
//           </div>

//           <div className="py-2">
//             <Box component="fieldset" borderColor="transparent">
//               <div className="flex items-center mb-1">
//                 <span className="text-gray-700 mr-2">Rating:</span>
//                 {errors.rating && (
//                   <span className="text-red-500 text-sm ml-2">Please provide a rating</span>
//                 )}
//               </div>
//               <Rating
//                 name="rating"
//                 value={formData.rating}
//                 onChange={handleRatingChange}
//                 precision={1}
//                 icon={<StarIcon fontSize="inherit" style={{ color: '#6366f1' }} />}
//                 emptyIcon={<StarBorderIcon fontSize="inherit" style={{ color: '#d1d5db' }} />}
//                 size="large"
//               />
//             </Box>
//           </div>

//           <div>
//             <TextField
//               select
//               fullWidth
//               label="Feedback Type"
//               name="feedbackType"
//               value={formData.feedbackType}
//               onChange={handleChange}
//               error={errors.feedbackType}
//               helperText={errors.feedbackType ? 'Please select a feedback type' : ''}
//               variant="outlined"
//               className="bg-white rounded-lg"
//             >
//               {feedbackTypes.map((option) => (
//                 <MenuItem key={option.value} value={option.value}>
//                   <div className="flex items-center">
//                     <span className="mr-2">{option.icon}</span>
//                     {option.label}
//                   </div>
//                 </MenuItem>
//               ))}
//             </TextField>
//           </div>

//           <div>
//             <TextField
//               fullWidth
//               multiline
//               rows={6}
//               label="Your Feedback"
//               name="feedback"
//               value={formData.feedback}
//               onChange={handleChange}
//               error={errors.feedback}
//               helperText={errors.feedback ? 'Please provide detailed feedback' : 'Be as detailed as possible'}
//               InputProps={{
//                 startAdornment: (
//                   <DescriptionIcon className="text-gray-400 mr-2 self-start mt-2" />
//                 ),
//               }}
//               variant="outlined"
//               className="bg-white rounded-lg"
//             />
//           </div>

//           <div className="flex justify-end pt-4">
//             <motion.div
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.97 }}
//             >
//               <Button
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//                 size="large"
//                 startIcon={isSubmitting ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
//                 disabled={isSubmitting}
//                 className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md"
//               >
//                 {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
//               </Button>
//             </motion.div>
//           </div>
//         </form>
//       </GlassCard>

//       <Snackbar
//         open={submitStatus.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//       >
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity={submitStatus.success ? 'success' : 'error'}
//           icon={submitStatus.success ? <SuccessIcon /> : <ErrorIcon />}
//           className="shadow-lg"
//         >
//           {submitStatus.message}
//         </Alert>
//       </Snackbar>
//     </div>
//   );

// };

// export default UserFeedback;







import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { postFeedback } from '../services/SellerApi';
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  BugReport as BugIcon,
  WifiOff as ConnectionIcon,
  ThumbUp as SuggestionIcon,
  AccountCircle as AccountIcon,
  Email as EmailIcon,
  Description as DescriptionIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { Button, TextField, MenuItem, Alert, Snackbar, Rating, Box, CircularProgress } from '@mui/material';

const GlassCard = styled('div')(({ theme }) => ({
  backdropFilter: 'blur(16px)',
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  borderRadius: '1rem',
  boxShadow: theme.shadows[10],
  padding: theme.spacing(4),
  transition: '0.4s ease all',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[16],
  },
}));

const feedbackTypes = [
  { value: 'bug', label: 'Bug Report', icon: <BugIcon /> },
  { value: 'connection', label: 'Connection Issue', icon: <ConnectionIcon /> },
  { value: 'suggestion', label: 'Feature Suggestion', icon: <SuggestionIcon /> },
  { value: 'ui', label: 'UI/UX Feedback', icon: <AccountIcon /> },
  { value: 'performance', label: 'Performance Issue', icon: <ConnectionIcon /> },
  { value: 'other', label: 'Other Feedback', icon: <DescriptionIcon /> },
];

const UserFeedback = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    feedbackType: '',
    feedback: ''
  });
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    rating: false,
    feedbackType: false,
    feedback: false
  });
  const [submitStatus, setSubmitStatus] = useState({
    open: false,
    success: false,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const handleRatingChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      rating: newValue
    }));
    if (errors.rating) {
      setErrors(prev => ({
        ...prev,
        rating: false
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: !formData.name.trim(),
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      rating: formData.rating === 0,
      feedbackType: !formData.feedbackType,
      feedback: !formData.feedback.trim()
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus({
        open: true,
        success: false,
        message: 'Please fill all required fields correctly.'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const feedbackData = {
        name: formData.name,
        email: formData.email,
        rating: formData.rating,
        feedbackType: formData.feedbackType,
        feedback: formData.feedback
      };

      const response = await postFeedback(feedbackData);

      setSubmitStatus({
        open: true,
        success: true,
        message: response.message || 'Thank you for your feedback! We appreciate your input.'
      });

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        rating: 0,
        feedbackType: '',
        feedback: ''
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus({
        open: true,
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to submit feedback. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSubmitStatus(prev => ({ ...prev, open: false }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-12">
      <div className="flex items-center mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <ArrowBackIcon className="mr-2" />
          Back
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Your Feedback is appreciable
        </h1>
        <p className="text-gray-600">Help us to help you better</p>
      </motion.div>

      <GlassCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <TextField
                fullWidth
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                helperText={errors.name ? 'Name is required' : ''}
                InputProps={{
                  startAdornment: (
                    <AccountIcon className="text-gray-400 mr-2" />
                  ),
                }}
                variant="outlined"
                className="bg-white rounded-lg"
              />
            </div>
            <div>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                helperText={errors.email ? 'Valid email is required' : ''}
                InputProps={{
                  startAdornment: (
                    <EmailIcon className="text-gray-400 mr-2" />
                  ),
                }}
                variant="outlined"
                className="bg-white rounded-lg"
              />
            </div>
          </div>

          <div className="py-2">
            <Box component="fieldset" borderColor="transparent">
              <div className="flex items-center mb-1">
                <span className="text-gray-700 mr-2">Rating:</span>
                {errors.rating && (
                  <span className="text-red-500 text-sm ml-2">Please provide a rating</span>
                )}
              </div>
              <Rating
                name="rating"
                value={formData.rating}
                onChange={handleRatingChange}
                precision={1}
                icon={<StarIcon fontSize="inherit" style={{ color: '#6366f1' }} />}
                emptyIcon={<StarBorderIcon fontSize="inherit" style={{ color: '#d1d5db' }} />}
                size="large"
              />
            </Box>
          </div>

          <div>
            <TextField
              select
              fullWidth
              label="Feedback Type"
              name="feedbackType"
              value={formData.feedbackType}
              onChange={handleChange}
              error={errors.feedbackType}
              helperText={errors.feedbackType ? 'Please select a feedback type' : ''}
              variant="outlined"
              className="bg-white rounded-lg"
            >
              {feedbackTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    <span className="mr-2">{option.icon}</span>
                    {option.label}
                  </div>
                </MenuItem>
              ))}
            </TextField>
          </div>

          <div>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Your Feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              error={errors.feedback}
              helperText={errors.feedback ? 'Please provide detailed feedback' : 'Be as detailed as possible'}
              InputProps={{
                startAdornment: (
                  <DescriptionIcon className="text-gray-400 mr-2 self-start mt-2" />
                ),
              }}
              variant="outlined"
              className="bg-white rounded-lg"
            />
          </div>

          <div className="flex justify-end pt-4">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={isSubmitting ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </motion.div>
          </div>
        </form>
      </GlassCard>

      <Snackbar
        open={submitStatus.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={submitStatus.success ? 'success' : 'error'}
          icon={submitStatus.success ? <SuccessIcon /> : <ErrorIcon />}
          className="shadow-lg"
        >
          {submitStatus.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UserFeedback;