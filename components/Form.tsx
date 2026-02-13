'use client'
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Form() {
    const [formData, setFormData] = useState({
        uid: '',
        name: '',
        whatsappnum: '',
        imageUrl: ''
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [image,setImage]=useState("/uc.png")

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload to Cloudinary
        setUploading(true);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);

            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                body: uploadFormData,
            });

            // Check if response is ok
            if (!uploadResponse.ok) {
                let errorData;
                try {
                    errorData = await uploadResponse.json();
                } catch (parseError) {
                    errorData = {
                        success: false,
                        message: `Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`
                    };
                }
                toast.error(errorData.message || 'Failed to upload image');
                setPreviewImage(null);
                return;
            }

            // Parse successful response
            let uploadData;
            try {
                uploadData = await uploadResponse.json();
            } catch (parseError) {
                console.error('Failed to parse upload response:', parseError);
                toast.error('Invalid response from upload server');
                setPreviewImage(null);
                return;
            }

            if (uploadData.success) {
                setFormData(prev => ({
                    ...prev,
                    imageUrl: uploadData.imageUrl
                }));
                toast.success('Image uploaded successfully!');
            } else {
                toast.error(uploadData.message || 'Failed to upload image');
                setPreviewImage(null);
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image. Please try again.');
            setPreviewImage(null);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            // Check if response is ok
            if (!response.ok) {
                // Try to parse error response
                let errorData;
                try {
                    errorData = await response.json();
                } catch (parseError) {
                    // If JSON parsing fails, use status text
                    errorData = {
                        success: false,
                        message: `Server error: ${response.status} ${response.statusText}`
                    };
                }

                const errorMessage = errorData.message || errorData.error || `Request failed with status ${response.status}`;
                console.error('API Error:', {
                    status: response.status,
                    statusText: response.statusText,
                    data: errorData
                });
                toast.error(errorMessage);
                return;
            }

            // Parse successful response
            let data;
            try {
                data = await response.json();
            } catch (parseError) {
                console.error('Failed to parse response:', parseError);
                toast.error('Invalid response from server');
                return;
            }

            if (data.success) {
                toast.success('User created successfully!');
                setFormData({
                    uid: '',
                    name: '',
                    whatsappnum: '',
                    imageUrl: ''
                });
                setPreviewImage(null);
            } else {
                const errorMessage = data.message || data.error || 'Failed to create user';
                console.error('API Error:', data);
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error('Network Error:', error);
            toast.error('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 ">
            <div className="max-w-md w-full ">

                <form className="mt-2 space-y-6 " onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="uid" className="block text-sm font-medium text-gray-700">
                                UID Number
                            </label>
                            <input
                                id="uid"
                                name="uid"
                                type="text"
                                required
                                value={formData.uid}
                                onChange={handleChange}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                placeholder="Enter UID number"
                            />
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                placeholder="Enter name"
                            />
                        </div>
                        <div>
                            <label htmlFor="whatsappnum" className="block text-sm font-medium text-gray-700">
                                WhatsApp Number
                            </label>
                            <input
                                id="whatsappnum"
                                name="whatsappnum"
                                type="text"
                                required
                                value={formData.whatsappnum}
                                onChange={handleChange}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                placeholder="Enter WhatsApp number"
                            />
                        </div>
                        <div>
                            <div className='flex space-x-8'>
                                <h1>pay with</h1>
                                <button onClick={()=>setImage("/profile.png")}>Khalti</button>
                                <button onClick={()=>setImage("/uc.png")}>eSewa</button>
                            </div>

                            <img src={image}></img>
                        </div>
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                Profile Image
                            </label>
                            <div className="mt-1">
                                <input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={uploading}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                {uploading && (
                                    <p className="mt-2 text-sm text-gray-500">Uploading image...</p>
                                )}
                                {previewImage && (
                                    <div className="mt-4">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="h-32 w-32 object-cover rounded-lg border border-gray-300"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}