import React, { useState } from 'react';
import QuillEditor from '../ui/QuillEditor';
import { useTranslation } from 'react-i18next';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { 
  Eye, Save, FileText, Heading, AlignLeft, Folder, Edit3, 
  Tags, Image, Globe, Star, Info, Lightbulb, Upload, 
  Rocket, HelpCircle, Check, PenTool, Camera, AlertTriangle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import blogAPI from '../../services/blogAPI';
import '../../styles/NewBlog-rtl.css';

const NewBlog = () => {
  const { user, token } = useAuth();
  const { t } = useTranslation('NewBlog');
  const { language: currentLanguage } = useI18next();
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    content: '',
    contentAr: '',
    excerpt: '',
    excerptAr: '',
    category: 'news',
    tags: '',
    tagsAr: '',
    status: 'draft',
    featured: false
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = [
    { value: 'news', label: t('categories.news') },
    { value: 'events', label: t('categories.events') },
    { value: 'updates', label: t('categories.updates') },
    { value: 'stories', label: t('categories.stories') },
    { value: 'announcements', label: t('categories.announcements') }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.excerpt) {
      setMessage({ type: 'danger', text: t('validation.requiredFields') });
      return;
    }

    if (!image) {
      setMessage({ type: 'danger', text: t('validation.imageRequired') });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      const blogData = {
        ...formData,
        image,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        tagsAr: formData.tagsAr.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await blogAPI.createBlog(blogData, token);

      setMessage({ type: 'success', text: t('messages.createSuccess') });

      // Reset form
      setFormData({
        title: '',
        titleAr: '',
        content: '',
        contentAr: '',
        excerpt: '',
        excerptAr: '',
        category: 'news',
        tags: '',
        tagsAr: '',
        status: 'draft',
        featured: false
      });
      setImage(null);
      setImagePreview(null);

    } catch (error) {
      setMessage({ type: 'danger', text: error.message || t('messages.createError') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8 ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${currentLanguage === 'ar' ? 'sm:flex-row' : ''}`}>
          <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {t('title')}
            </h1>
            <p className="text-gray-600 text-lg">
              {t('description')}
            </p>
          </div>
          <div className={`flex gap-3 ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
            <button className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
              <Eye className="h-4 w-4" />
              {t('buttons.preview')}
            </button>
            <button className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
              <Save className="h-4 w-4" />
              {t('buttons.saveDraft')}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Alert Message */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : message.type === 'danger' 
                  ? 'bg-red-50 border border-red-200 text-red-800'
                  : 'bg-blue-50 border border-blue-200 text-blue-800'
              } ${currentLanguage === 'ar' ? 'flex-row text-right' : 'text-left'}`}>
                {message.type === 'success' ? (
                  <Check className="h-5 w-5 flex-shrink-0" />
                ) : message.type === 'danger' ? (
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <Info className="h-5 w-5 flex-shrink-0" />
                )}
                <span>{message.text}</span>
                <button 
                  onClick={() => setMessage({ type: '', text: '' })}
                  className={`${currentLanguage === 'ar' ? 'mr-auto' : 'ml-auto'} text-gray-400 hover:text-gray-600`}
                >
                  ×
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 text-sm font-medium text-gray-700 ${currentLanguage === 'ar' ? 'flex-row justify-end' : ''}`}>
                    <Heading className="h-4 w-4 text-blue-600" />
                    {t('form.titleEn')} *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder={t('form.titleEnPlaceholder')}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 text-sm font-medium text-gray-700 ${currentLanguage === 'ar' ? 'flex-row justify-end' : ''}`}>
                    <Heading className="h-4 w-4 text-blue-600" />
                    {t('form.titleAr')}
                  </label>
                  <input
                    type="text"
                    name="titleAr"
                    value={formData.titleAr}
                    onChange={handleChange}
                    placeholder={t('form.titleArPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Excerpt Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 text-sm font-medium text-gray-700 ${currentLanguage === 'ar' ? 'flex-row justify-end' : ''}`}>
                    <AlignLeft className="h-4 w-4 text-blue-600" />
                    {t('form.excerptEn')} *
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    placeholder={t('form.excerptEnPlaceholder')}
                    rows={3}
                    maxLength={200}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    dir="ltr"
                  />
                  <div className={`flex justify-between items-center text-sm ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                    <div className={`flex items-center gap-1 text-gray-500 ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                      <Info className="h-4 w-4" />
                      {t('form.excerptHelp')}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${formData.excerpt.length > 180 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                      {formData.excerpt.length}/200
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 text-sm font-medium text-gray-700 ${currentLanguage === 'ar' ? 'flex-row justify-end' : ''}`}>
                    <AlignLeft className="h-4 w-4 text-blue-600" />
                    {t('form.excerptAr')}
                  </label>
                  <textarea
                    name="excerptAr"
                    value={formData.excerptAr}
                    onChange={handleChange}
                    placeholder={t('form.excerptArPlaceholder')}
                    rows={3}
                    maxLength={200}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    dir="rtl"
                  />
                  <div className={`flex justify-between items-center text-sm ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                    <div className={`flex items-center gap-1 text-gray-500 ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                      <Info className="h-4 w-4" />
                      {t('form.excerptHelpAr')}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${formData.excerptAr.length > 180 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                      {formData.excerptAr.length}/200
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Field */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 text-sm font-medium text-gray-700 ${currentLanguage === 'ar' ? 'flex-row justify-end' : ''}`}>
                    <Folder className="h-4 w-4 text-blue-600" />
                    {t('form.category')} *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Content Editors */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 text-sm font-medium text-gray-700 ${currentLanguage === 'ar' ? 'flex-row justify-end' : ''}`}>
                    <Edit3 className="h-4 w-4 text-blue-600" />
                    {t('form.contentEn')} *
                  </label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <QuillEditor
                      value={formData.content}
                      onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                      placeholder={t('form.contentEnPlaceholder')}
                      style={{ height: '300px', marginBottom: '50px' }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`flex items-center gap-2 text-sm font-medium text-gray-700 ${currentLanguage === 'ar' ? 'flex-row justify-end' : ''}`}>
                    <Edit3 className="h-4 w-4 text-blue-600" />
                    {t('form.contentAr')}
                  </label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <QuillEditor
                      value={formData.contentAr}
                      onChange={(value) => setFormData(prev => ({ ...prev, contentAr: value }))}
                      placeholder={t('form.contentArPlaceholder')}
                      style={{ height: '300px', marginBottom: '50px', direction: 'rtl' }}
                    />
                  </div>
                </div>
              </div>

              {/* Tags Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 text-sm font-medium text-gray-700 ${currentLanguage === 'ar' ? 'flex-row justify-end' : ''}`}>
                    <Tags className="h-4 w-4 text-blue-600" />
                    {t('form.tagsEn')}
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder={t('form.tagsEnPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                    dir="ltr"
                  />
                  <div className={`flex items-center gap-1 text-sm text-gray-500 ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                    <Lightbulb className="h-4 w-4" />
                    {t('form.tagsHelp')}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 text-sm font-medium text-gray-700 ${currentLanguage === 'ar' ? 'flex-row justify-end' : ''}`}>
                    <Tags className="h-4 w-4 text-blue-600" />
                    {t('form.tagsAr')}
                  </label>
                  <input
                    type="text"
                    name="tagsAr"
                    value={formData.tagsAr}
                    onChange={handleChange}
                    placeholder={t('form.tagsArPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                    dir="rtl"
                  />
                  <div className={`flex items-center gap-1 text-sm text-gray-500 ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                    <Lightbulb className="h-4 w-4" />
                    {t('form.tagsHelpAr')}
                  </div>
                </div>
              </div>

              {/* Featured Image Upload */}
              <div className="space-y-2">
                <label className={`flex items-center gap-2 text-sm font-medium text-gray-700 ${currentLanguage === 'ar' ? 'flex-row justify-end' : ''}`}>
                  <Camera className="h-4 w-4 text-blue-600" />
                  {t('form.featuredImage')} *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {imagePreview ? (
                    <div className="mt-4 text-center">
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-w-xs max-h-48 object-cover rounded-lg shadow-md"
                        />
                        <div className={`absolute top-2 ${currentLanguage === 'ar' ? 'right-2' : 'left-2'} bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1`}>
                          <Check className="h-3 w-3" />
                          {t('upload.ready')}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`mt-4 text-center text-gray-500 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                      <Upload className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">{t('upload.uploadText')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Publication Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 text-sm font-medium text-gray-700 ${currentLanguage === 'ar' ? 'flex-row justify-end' : ''}`}>
                    <Globe className="h-4 w-4 text-blue-600" />
                    {t('form.publicationStatus')}
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="draft">{t('status.draft')}</option>
                    <option value="published">{t('status.published')}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <label className={`flex items-center gap-3 cursor-pointer ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                        <div className={`flex items-center gap-2 font-medium text-gray-900 ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                          <Star className="h-4 w-4 text-yellow-500" />
                          {t('form.featuredPost')}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {t('form.featuredPostHelp')}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-gray-200 ${currentLanguage === 'ar' ? 'sm:flex-row' : ''}`}>
                <div className={`flex items-center gap-2 text-gray-500 text-sm ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                  <Info className="h-4 w-4" />
                  {t('form.autoSave')}
                </div>
                <div className={`flex gap-3 ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                  <button
                    type="button"
                    disabled={loading}
                    className={`flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 ${currentLanguage === 'ar' ? 'flex-row' : ''}`}
                  >
                    <Save className="h-4 w-4" />
                    {t('buttons.saveDraft')}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 ${currentLanguage === 'ar' ? 'flex-row' : ''}`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        {t('buttons.creating')}
                      </>
                    ) : (
                      <>
                        <Rocket className="h-4 w-4" />
                        {t('buttons.publishPost')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Guidelines Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h3 className={`text-white font-semibold flex items-center gap-2 ${currentLanguage === 'ar' ? 'flex-row text-right' : 'text-left'}`}>
                  <Lightbulb className="h-5 w-5" />
                  {t('guidelines.title')}
                </h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Content Tips */}
                <div>
                  <div className={`flex items-center gap-3 mb-4 ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                    <div className="bg-blue-50 p-2 rounded-full">
                      <PenTool className="h-4 w-4 text-blue-600" />
                    </div>
                    <h4 className={`font-semibold text-gray-900 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                      {t('guidelines.contentTips')}
                    </h4>
                  </div>
                  <ul className={`space-y-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                    <li className={`flex items-center gap-2 text-sm text-gray-600 ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {t('guidelines.tips.engaging')}
                    </li>
                    <li className={`flex items-center gap-2 text-sm text-gray-600 ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {t('guidelines.tips.clear')}
                    </li>
                    <li className={`flex items-center gap-2 text-sm text-gray-600 ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {t('guidelines.tips.images')}
                    </li>
                    <li className={`flex items-center gap-2 text-sm text-gray-600 ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {t('guidelines.tips.tags')}
                    </li>
                  </ul>
                </div>

                {/* Image Requirements */}
                <div>
                  <div className={`flex items-center gap-3 mb-4 ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                    <div className="bg-purple-50 p-2 rounded-full">
                      <Image className="h-4 w-4 text-purple-600" />
                    </div>
                    <h4 className={`font-semibold text-gray-900 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                      {t('guidelines.imageRequirements')}
                    </h4>
                  </div>
                  <div className="space-y-2">
                    <div className={`flex justify-between items-center ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                      <span className="text-sm text-gray-600">{t('guidelines.imageSpecs.size')}:</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{t('guidelines.imageSpecs.recommended')}</span>
                    </div>
                    <div className={`flex justify-between items-center ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                      <span className="text-sm text-gray-600">{t('guidelines.imageSpecs.format')}:</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{t('guidelines.imageSpecs.formats')}</span>
                    </div>
                    <div className={`flex justify-between items-center ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                      <span className="text-sm text-gray-600">{t('guidelines.imageSpecs.maxSize')}:</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{t('guidelines.imageSpecs.limit')}</span>
                    </div>
                  </div>
                </div>

                {/* Publication Status */}
                <div>
                  <div className={`flex items-center gap-3 mb-4 ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                    <div className="bg-yellow-50 p-2 rounded-full">
                      <Globe className="h-4 w-4 text-yellow-600" />
                    </div>
                    <h4 className={`font-semibold text-gray-900 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                      {t('guidelines.publicationStatus')}
                    </h4>
                  </div>
                  <div className="space-y-2">
                    <div className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                      <div className={`flex items-center gap-2 ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                        <span className="px-2 py-1 bg-gray-500 text-white rounded text-xs">Draft</span>
                        <span className="text-sm text-gray-600">{t('guidelines.statusInfo.draft')}</span>
                      </div>
                      <Eye className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                      <div className={`flex items-center gap-2 ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                        <span className="px-2 py-1 bg-green-500 text-white rounded text-xs">Published</span>
                        <span className="text-sm text-gray-600">{t('guidelines.statusInfo.published')}</span>
                      </div>
                      <Eye className="h-4 w-4 text-green-500" />
                    </div>
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

export default NewBlog;

