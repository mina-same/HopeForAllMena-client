import React, { useState, useEffect } from 'react';

const QuillEditor = ({ value, onChange, placeholder, className, style, ...props }) => {
  const [isClient, setIsClient] = useState(false);
  const [ReactQuill, setReactQuill] = useState(null);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import ReactQuill only on client side
    import('react-quill').then((module) => {
      setReactQuill(() => module.default);
      // Import CSS
      import('react-quill/dist/quill.snow.css');
    }).catch((error) => {
      console.error('Failed to load ReactQuill:', error);
    });
  }, []);

  if (!isClient || !ReactQuill) {
    return (
      <div 
        className={className}
        style={{
          ...style,
          minHeight: '200px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '12px',
          backgroundColor: '#f9f9f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666'
        }}
      >
        Loading editor...
      </div>
    );
  }

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'align', 'color', 'background',
    'script', 'direction'
  ];

  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      style={style}
      modules={modules}
      formats={formats}
      {...props}
    />
  );
};

export default QuillEditor;
