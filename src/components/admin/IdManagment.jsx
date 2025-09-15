import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Upload, Download, FileText, Users } from 'lucide-react';
import Papa from 'papaparse';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { toast } from 'sonner';
import IDCardsPDF from './IDCardsPDF';

const IDCardGenerator = () => {
  console.log('IDCardGenerator component loading...');
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
        toast.success(`تم تحميل ${names.length} اسم بنجاح`);
      },
      header: false,
      skipEmptyLines: true,
    });
  };

  const isFormValid = csvData.length > 0 && club.trim() && church.trim();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-[#2194D1]">
            مولد بطاقات الهوية
          </h1>
          <p className="text-muted-foreground text-lg">
            قم بتحميل ملف CSV وإدخال بيانات النادي والكنيسة لإنشاء بطاقات الهوية
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* CSV Upload Section */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-[#2194D1]" />
                تحميل ملف الأسماء
              </CardTitle>
              <CardDescription>
                قم بتحميل ملف CSV يحتوي على قائمة الأسماء
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="csv-upload">ملف CSV</Label>
                <Input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="cursor-pointer"
                />
              </div>
              {csvData.length > 0 && (
                <div className="bg-secondary p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-secondary-foreground">
                    <Users className="h-4 w-4" />
                    <span>تم تحميل {csvData.length} اسم</span>
                  </div>
                  <div className="mt-2 max-h-32 overflow-y-auto">
                    <div className="text-sm text-muted-foreground arabic-text">
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#2194D1]" />
                بيانات النادي والكنيسة
              </CardTitle>
              <CardDescription>
                أدخل اسم النادي والكنيسة باللغة العربية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="club" className="arabic-text">النادي</Label>
                <Input
                  id="club"
                  value={club}
                  onChange={(e) => setClub(e.target.value)}
                  placeholder="أدخل اسم النادي"
                  className="arabic-text"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="church" className="arabic-text">الكنيسة</Label>
                <Input
                  id="church"
                  value={church}
                  onChange={(e) => setChurch(e.target.value)}
                  placeholder="أدخل اسم الكنيسة"
                  className="arabic-text"
                  dir="rtl"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>معاينة التصميم</CardTitle>
            <CardDescription>
              هذا هو تصميم بطاقة الهوية التي سيتم إنشاؤها
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative inline-block bg-white p-4 rounded-lg shadow-strong">
              <img
                src="/idDesgin.png"
                alt="ID Card Design"
                className="w-80 h-auto rounded"
              />
              <div className="absolute bottom-8 right-8 text-right arabic-text text-xs bg-black/20 p-2 rounded backdrop-blur-sm text-white">
                <div>الاسم: {csvData[0] || 'مثال'}</div>
                <div>النادي: {club || 'اسم النادي'}</div>
                <div>الكنيسة: {church || 'اسم الكنيسة'}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generate Button */}
        <div className="text-center">
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
                    <Button disabled variant="destructive" size="lg" className="px-8">
                      خطأ في إنشاء PDF
                    </Button>
                  );
                }
                return (
                  <Button
                    disabled={loading}
                    variant="premium"
                    size="lg"
                    className="px-8"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                        جاري إنشاء PDF...
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5" />
                        إنشاء وتحميل PDF
                      </>
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
              className="px-8"
            >
              <Download className="h-5 w-5" />
              إنشاء وتحميل PDF
            </Button>
          )}
          {csvData.length > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              سيتم إنشاء {Math.ceil(csvData.length / 9)} صفحة تحتوي على {csvData.length} بطاقة
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IDCardGenerator;