import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyCertificates } from '../api';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui-next/Button';
import Card, { CardContent } from '../components/ui-next/Card';
import Skeleton from '../components/ui-next/Skeleton';
import { formatDate } from '../lib/utils';
import { motion } from 'framer-motion';
import { pageVariants, staggerContainer, fadeInUp } from '../lib/animations';

function DownloadIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function AwardIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
    </svg>
  );
}

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const { data } = await getMyCertificates();
        setCertificates(data);
      } catch (error) {
        console.error('Failed to fetch certificates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const handleDownload = (cert) => {
    // In a real app, this would generate a PDF
    alert(`Downloading certificate: ${cert.certificateNumber}`);
  };

  if (loading) {
    return (
      <AppLayout>
        <PageHeader title="My Certificates" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => <Skeleton key={i} className="h-64 rounded-xl" />)}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="space-y-6"
      >
        <PageHeader title="My Certificates" description="View and download your earned certificates" />

        {certificates.length === 0 ? (
          <Card className="text-center py-12 border-stone-200">
            <AwardIcon className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-stone-900 mb-2">No certificates yet</h3>
            <p className="text-stone-500 mb-6">Complete courses to earn certificates.</p>
            <Link to="/courses">
              <Button variant="luxury">Browse Courses</Button>
            </Link>
          </Card>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {certificates.map((cert) => (
              <motion.div key={cert._id} variants={fadeInUp}>
                <Card className="h-full border-stone-200 hover:border-emerald-200 transition-colors group">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <AwardIcon className="w-6 h-6 text-emerald-600" />
                    </div>

                    <h3 className="font-bold text-stone-900 mb-1 line-clamp-1">
                      {cert.course?.title}
                    </h3>
                    <p className="text-sm text-stone-500 mb-4">
                      Issued on {formatDate(cert.issuedAt)}
                    </p>

                    <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-xs font-mono text-stone-400">
                        #{cert.certificateNumber.slice(-8).toUpperCase()}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDownload(cert)}
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      >
                        <DownloadIcon className="w-4 h-4 mr-1.5" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </AppLayout >
  );
};

export default CertificatesPage;
