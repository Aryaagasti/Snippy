import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiExternalLink, FiCopy, FiCheck, FiDownload } from 'react-icons/fi';
import { urlAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Analytics = () => {
  const { slug } = useParams();
  const [urlData, setUrlData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [slug]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await urlAPI.getUrlAnalytics(slug);
      setUrlData(response.data.data.url);
      setAnalytics(response.data.data.analytics);
      setError('');
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to fetch analytics data');
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Copied to clipboard!');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleDownloadQR = async () => {
    try {
      const response = await urlAPI.generateQrCode(slug);
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `qr-${slug}.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('QR code downloaded successfully');
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('Failed to download QR code');
    }
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (!analytics) return null;

    // Clicks by date
    const dateLabels = Object.keys(analytics.clicksByDate).sort();
    const dateData = dateLabels.map(date => analytics.clicksByDate[date]);
    
    const clicksByDateData = {
      labels: dateLabels,
      datasets: [
        {
          label: 'Clicks',
          data: dateData,
          backgroundColor: 'rgba(14, 165, 233, 0.5)',
          borderColor: 'rgb(14, 165, 233)',
          borderWidth: 1,
        },
      ],
    };
    
    // Browsers
    const browserLabels = Object.keys(analytics.browsers);
    const browserData = browserLabels.map(browser => analytics.browsers[browser]);
    
    const browsersData = {
      labels: browserLabels,
      datasets: [
        {
          label: 'Browsers',
          data: browserData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
    
    // Platforms
    const platformLabels = Object.keys(analytics.platforms);
    const platformData = platformLabels.map(platform => analytics.platforms[platform]);
    
    const platformsData = {
      labels: platformLabels,
      datasets: [
        {
          label: 'Platforms',
          data: platformData,
          backgroundColor: [
            'rgba(139, 92, 246, 0.5)',
            'rgba(16, 185, 129, 0.5)',
            'rgba(245, 158, 11, 0.5)',
            'rgba(239, 68, 68, 0.5)',
            'rgba(59, 130, 246, 0.5)',
          ],
          borderColor: [
            'rgba(139, 92, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(59, 130, 246, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
    
    // Countries
    const countryLabels = Object.keys(analytics.countries);
    const countryData = countryLabels.map(country => analytics.countries[country]);
    
    const countriesData = {
      labels: countryLabels,
      datasets: [
        {
          label: 'Countries',
          data: countryData,
          backgroundColor: 'rgba(139, 92, 246, 0.5)',
          borderColor: 'rgb(139, 92, 246)',
          borderWidth: 1,
        },
      ],
    };
    
    // Referrers
    const referrerLabels = Object.keys(analytics.referrers);
    const referrerData = referrerLabels.map(referrer => analytics.referrers[referrer]);
    
    const referrersData = {
      labels: referrerLabels,
      datasets: [
        {
          label: 'Referrers',
          data: referrerData,
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 1,
        },
      ],
    };
    
    return {
      clicksByDate: clicksByDateData,
      browsers: browsersData,
      platforms: platformsData,
      countries: countriesData,
      referrers: referrersData,
    };
  };

  const chartData = prepareChartData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link to="/dashboard" className="flex items-center text-primary-600 hover:text-primary-700">
          <FiArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">URL Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Detailed analytics for your shortened URL
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      ) : (
        <>
          {/* URL Info Card */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                URL Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Details and statistics about this shortened URL
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Original URL
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                    <span className="truncate max-w-md">{urlData?.originalUrl}</span>
                    <a
                      href={urlData?.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-primary-600 hover:text-primary-700"
                    >
                      <FiExternalLink />
                    </a>
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Short URL
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                    <span>{urlData?.shortUrl}</span>
                    <button
                      onClick={() => handleCopy(urlData?.shortUrl)}
                      className="ml-2 text-primary-600 hover:text-primary-700"
                    >
                      {copied ? <FiCheck /> : <FiCopy />}
                    </button>
                    <button
                      onClick={handleDownloadQR}
                      className="ml-2 text-primary-600 hover:text-primary-700"
                      title="Download QR Code"
                    >
                      <FiDownload />
                    </button>
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Total Clicks
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {analytics?.totalClicks || 0}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Created At
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {urlData?.createdAt ? new Date(urlData.createdAt).toLocaleString() : 'N/A'}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Status
                  </dt>
                  <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      urlData?.active && !urlData?.expired
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {urlData?.active && !urlData?.expired
                        ? 'Active'
                        : urlData?.expired
                        ? 'Expired'
                        : 'Inactive'}
                    </span>
                  </dd>
                </div>
                {urlData?.description && (
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Description
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {urlData.description}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Analytics Charts */}
          {analytics && analytics.totalClicks > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Clicks by Date */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Clicks Over Time</h3>
                <div className="h-64">
                  <Line
                    data={chartData.clicksByDate}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
              
              {/* Browsers */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Browsers</h3>
                <div className="h-64">
                  <Pie
                    data={chartData.browsers}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </div>
              
              {/* Platforms */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Platforms</h3>
                <div className="h-64">
                  <Pie
                    data={chartData.platforms}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </div>
              
              {/* Countries */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Countries</h3>
                <div className="h-64">
                  <Bar
                    data={chartData.countries}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
              
              {/* Referrers */}
              <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Referrers</h3>
                <div className="h-64">
                  <Bar
                    data={chartData.referrers}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data Available</h3>
              <p className="text-gray-500">
                This URL hasn't received any clicks yet. Share your URL to start collecting analytics data.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Analytics;
