import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { Link, graphql } from 'gatsby';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Upload, Download, FileText, Users } from 'lucide-react';
import Papa from 'papaparse';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { toast } from 'sonner';
import IDCardsPDF from './IDCardsPDF';
import './IdManagement-rtl.css';

const IDCardGenerator = () => {
  console.log('IDCardGenerator component loading...');
  const { t } = useTranslation('IdManagement');
  const { language: currentLanguage } = useI18next();
  const [csvData, setCsvData] = useState([]);
  const [club, setClub] = useState('');
  const [church, setChurch] = useState('');

  const handleCSVUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const names = results.data
          .flat()
          .filter((name) => name && typeof name === 'string' && name.trim())
          .map((name) => name.trim());
        
        setCsvData(names);
        toast.success(t('upload.success', { count: names.length }));
      },
      header: false,
      skipEmptyLines: true,
    });
  };

  const isFormValid = csvData.length > 0 && club.trim() && church.trim();

  return (
    <div className={`min-h-screen bg-background p-3 xs:p-4 sm:p-6 ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto space-y-4 xs:space-y-6 sm:space-y-8">
        <div className={`text-center space-y-2 xs:space-y-3 sm:space-y-4 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
          <h1 className={`text-2xl xs:text-3xl sm:text-4xl font-bold text-[#2194D1] ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
            {t('header.title')}
          </h1>
          <p className={`text-muted-foreground text-sm xs:text-base sm:text-lg ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
            {t('header.description')}
          </p>
        </div>

        <div className={`grid gap-4 xs:gap-6 sm:gap-8 lg:grid-cols-2 ${currentLanguage === 'ar' ? 'lg:grid-flow-col-dense' : ''}`}>
          {/* CSV Upload Section */}
          <Card className="shadow-soft">
            <CardHeader className="p-4 xs:p-5 sm:p-6">
              <CardTitle className={`flex items-center gap-2 text-base xs:text-lg sm:text-xl ${currentLanguage === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <Upload className="h-4 w-4 xs:h-5 xs:w-5 text-[#2194D1]" />
                {t('upload.title')}
              </CardTitle>
              <CardDescription className={`text-sm xs:text-base ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                {t('upload.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 xs:space-y-4 p-4 xs:p-5 sm:p-6 pt-0">
              <div className="space-y-2">
                <Label htmlFor="csv-upload" className={`text-sm xs:text-base ${currentLanguage === 'ar' ? 'text-right block' : 'text-left'}`}>{t('upload.label')}</Label>
                <Input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className={`cursor-pointer text-sm xs:text-base ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
              {csvData.length > 0 && (
                <div className="bg-secondary p-3 xs:p-4 rounded-lg">
                  <div className={`flex items-center gap-2 text-secondary-foreground ${currentLanguage === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}>
                    <Users className="h-4 w-4" />
                    <span className="text-sm xs:text-base">{t('upload.loaded', { count: csvData.length })}</span>
                  </div>
                  <div className="mt-2 max-h-24 xs:max-h-32 overflow-y-auto">
                    <div className={`text-xs xs:text-sm text-muted-foreground ${currentLanguage === 'ar' ? 'text-right arabic-text' : 'text-left'}`}>
                      {csvData.slice(0, 5).join(', ')}
                      {csvData.length > 5 && '...'}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Club and Church Input Section */}
          <Card className="shadow-soft">
            <CardHeader className="p-4 xs:p-5 sm:p-6">
              <CardTitle className={`flex items-center gap-2 text-base xs:text-lg sm:text-xl ${currentLanguage === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <FileText className="h-4 w-4 xs:h-5 xs:w-5 text-[#2194D1]" />
                {t('clubChurch.title')}
              </CardTitle>
              <CardDescription className={`text-sm xs:text-base ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                {t('clubChurch.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 xs:space-y-4 p-4 xs:p-5 sm:p-6 pt-0">
              <div className="space-y-2">
                <Label htmlFor="club" className={`text-sm xs:text-base ${currentLanguage === 'ar' ? 'text-right arabic-text block' : 'text-left'}`}>{t('clubChurch.clubLabel')}</Label>
                <Input
                  id="club"
                  value={club}
                  onChange={(e) => setClub(e.target.value)}
                  placeholder={t('clubChurch.clubPlaceholder')}
                  className={`text-sm xs:text-base ${currentLanguage === 'ar' ? 'arabic-text text-right' : 'text-left'}`}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="church" className={`text-sm xs:text-base ${currentLanguage === 'ar' ? 'text-right arabic-text block' : 'text-left'}`}>{t('clubChurch.churchLabel')}</Label>
                <Input
                  id="church"
                  value={church}
                  onChange={(e) => setChurch(e.target.value)}
                  placeholder={t('clubChurch.churchPlaceholder')}
                  className={`text-sm xs:text-base ${currentLanguage === 'ar' ? 'arabic-text text-right' : 'text-left'}`}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <Card className="shadow-soft">
          <CardHeader className="p-4 xs:p-5 sm:p-6">
            <CardTitle className={`text-base xs:text-lg sm:text-xl ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>{t('preview.title')}</CardTitle>
            <CardDescription className={`text-sm xs:text-base ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
              {t('preview.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 xs:p-5 sm:p-6 pt-0">
            <div className="flex justify-center">
              <div className={`relative inline-block bg-white p-2 xs:p-3 sm:p-4 rounded-lg shadow-strong max-w-full`}>
                <img
                  src="/idDesgin.png"
                  alt={t('preview.title')}
                  className="w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[380px] md:max-w-[420px] lg:max-w-[480px] h-auto rounded"
                />
                <div className={`absolute bottom-4 xs:bottom-6 sm:bottom-8 ${currentLanguage === 'ar' ? 'right-4 xs:right-6 sm:right-8 text-right' : 'left-4 xs:left-6 sm:left-8 text-left'} arabic-text text-xs xs:text-sm bg-black/20 p-1.5 xs:p-2 rounded backdrop-blur-sm text-white max-w-[200px] xs:max-w-[240px] sm:max-w-[280px]`}>
                  <div className="truncate">{t('preview.name', { name: csvData[0] || t('preview.example') })}</div>
                  <div className="truncate">{t('preview.club', { club: club || t('clubChurch.clubLabel') })}</div>
                  <div className="truncate">{t('preview.church', { church: church || t('clubChurch.churchLabel') })}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generate Button */}
        <div className={`flex flex-col items-center space-y-3 xs:space-y-4 ${currentLanguage === 'ar' ? 'text-right' : 'text-center'}`}>
          {isFormValid ? (
            <PDFDownloadLink
              document={
                <IDCardsPDF
                  names={csvData}
                  club={club}
                  church={church}
                  imageUrl="/idDesgin.png"
                />
              }
              fileName="id-cards.pdf"
            >
              {({ loading, error }) => {
                if (error) {
                  console.error('PDF generation error:', error);
                  return (
                    <Button 
                      disabled 
                      variant="destructive" 
                      size="lg" 
                      className="px-4 xs:px-6 sm:px-8 text-sm xs:text-base w-full xs:w-auto max-w-xs"
                    >
                      {t('generate.error')}
                    </Button>
                  );
                }
                return (
                  <Button
                    disabled={loading}
                    variant="premium"
                    size="lg"
                    className={`px-4 xs:px-6 sm:px-8 text-sm xs:text-base w-full xs:w-auto max-w-xs ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}
                  >
                    {loading ? (
                      <div className={`flex items-center gap-2 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                        <span className="text-sm xs:text-base">{t('generate.generating')}</span>
                      </div>
                    ) : (
                      <div className={`flex items-center gap-2 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <Download className="h-4 w-4 xs:h-5 xs:w-5" />
                        <span className="text-sm xs:text-base">{t('generate.button')}</span>
                      </div>
                    )}
                  </Button>
                );
              }}
            </PDFDownloadLink>
          ) : (
            <Button
              disabled
              variant="premium"
              size="lg"
              className={`px-4 xs:px-6 sm:px-8 text-sm xs:text-base w-full xs:w-auto max-w-xs ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`flex items-center gap-2 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                <Download className="h-4 w-4 xs:h-5 xs:w-5" />
                <span className="text-sm xs:text-base">{t('generate.button')}</span>
              </div>
            </Button>
          )}
          {csvData.length > 0 && (
            <p className={`text-xs xs:text-sm text-muted-foreground px-4 text-center ${currentLanguage === 'ar' ? 'text-right' : 'text-center'}`}>
              {t('generate.pages', { pages: Math.ceil(csvData.length / 9), cards: csvData.length })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IDCardGenerator;

// GraphQL query for i18n support
export const query = graphql`
  query($language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;