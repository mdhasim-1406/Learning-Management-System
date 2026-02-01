import { useState, useEffect } from 'react';
import { getMyCertificates } from '../api';
import { AppLayout, PageHeader } from '../components/layout';
import { Card, Badge, Button, Skeleton } from '../components/ui';
import { formatDate } from '../lib/utils';

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

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

  if (loading) {
    return (
      <AppLayout>
        <PageHeader title="My Certificates" description="View your earned certificates" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-64" />)}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="My Certificates"
        description={`${certificates.length} certificates earned`}
      />

      {certificates.length === 0 ? (
        <Card className="text-center py-16">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates yet</h3>
          <p className="text-gray-500 mb-4">Complete courses to earn certificates</p>
          <a href="/courses" className="text-indigo-600 hover:text-indigo-700">
            Browse courses →
          </a>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map(cert => (
            <CertificateCard
              key={cert._id}
              certificate={cert}
              onView={() => setSelectedCert(cert)}
            />
          ))}
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </AppLayout>
  );
};

function CertificateCard({ certificate, onView }) {
  return (
    <Card padding="none" hover className="overflow-hidden">
      {/* Certificate Preview */}
      <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white">
        <div className="absolute top-3 right-3">
          <Badge variant="success" size="sm">Verified</Badge>
        </div>
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <AwardIcon className="w-6 h-6 text-white" />
          </div>
          <p className="text-xs text-indigo-200 uppercase tracking-wide">Certificate of Completion</p>
          <h3 className="text-lg font-bold mt-2 line-clamp-2">{certificate.course?.title}</h3>
        </div>
      </div>
      
      {/* Details */}
      <div className="p-4">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>Issued: {formatDate(certificate.issuedAt)}</span>
          <span className="font-mono text-xs">{certificate.certificateNumber}</span>
        </div>
        <Button onClick={onView} variant="secondary" className="w-full" size="sm">
          View Certificate
        </Button>
      </div>
    </Card>
  );
}

function CertificateModal({ certificate, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="absolute top-4 right-4 z-10">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Certificate Content */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-8 text-white text-center">
          <div className="border-4 border-white/30 rounded-xl p-8">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AwardIcon className="w-8 h-8" />
            </div>
            <p className="text-sm uppercase tracking-widest text-indigo-200">Certificate of Completion</p>
            <h1 className="text-2xl font-bold mt-4 mb-2">This is to certify that</h1>
            <p className="text-3xl font-bold text-yellow-300">You</p>
            <p className="text-xl mt-4">have successfully completed</p>
            <h2 className="text-2xl font-bold mt-2 mb-4">{certificate.course?.title}</h2>
            <div className="mt-6 pt-6 border-t border-white/30">
              <p className="text-sm text-indigo-200">Issued on {formatDate(certificate.issuedAt)}</p>
              <p className="font-mono text-xs mt-2 text-indigo-300">Certificate ID: {certificate.certificateNumber}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-gray-50 flex justify-center gap-3">
          <Button variant="secondary" size="sm">
            <DownloadIcon className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="secondary" size="sm">
            <ShareIcon className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}

// Icons
function AwardIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function CloseIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function DownloadIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function ShareIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  );
}

export default CertificatesPage;
