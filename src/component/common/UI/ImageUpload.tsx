import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Camera, Upload, X } from 'lucide-react';

interface ImageUploadProps {
    currentImage?: string;
    onImageChange: (imageData: string) => void;
    disabled?: boolean;
    size?: number;
}

export default function ImageUpload({
    currentImage,
    onImageChange,
    disabled,
    size = 80
}: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string>(currentImage || '');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string>('');

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size must be less than 5MB');
            return;
        }

        setError('');
        setUploading(true);

        try {
            // Convert to base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPreview(base64String);
                onImageChange(base64String);
                setUploading(false);
            };
            reader.onerror = () => {
                setError('Failed to read file');
                setUploading(false);
            };
            reader.readAsDataURL(file);
        } catch (err) {
            console.error('Error processing image:', err);
            setError('Failed to process image');
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview('');
        onImageChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="relative inline-block">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled || uploading}
            />

            <div className="relative group">
                {preview ? (
                    <div
                        className="relative overflow-hidden rounded-full border-2 border-gray-300"
                        style={{ width: size, height: size }}
                    >
                        <Image
                            src={preview}
                            alt="Profile"
                            fill
                            className="object-cover"
                            unoptimized={preview.startsWith('data:')}
                        />
                        {!disabled && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                disabled={uploading}
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                ) : (
                    <div
                        className="rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-400"
                        style={{ width: size, height: size }}
                    >
                        <Camera size={size / 2.5} className="text-gray-400" />
                    </div>
                )}

                {!disabled && (
                    <button
                        type="button"
                        onClick={triggerFileInput}
                        disabled={uploading}
                        className="absolute bottom-0 right-0 bg-vividblue text-white rounded-full p-1.5 hover:bg-vividblue/70 transition-colors disabled:bg-gray-400 shadow-lg"
                    >
                        {uploading ? (
                            <div className="animate-spin w-4 h-4">⏳</div>
                        ) : (
                            <Upload size={14} />
                        )}
                    </button>
                )}
            </div>

            {error && (
                <p className="text-red-500 text-xs mt-1 absolute whitespace-nowrap">{error}</p>
            )}
        </div>
    );
}